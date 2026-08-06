<script>
  import { onMount } from "svelte";
  import { SvelteSet } from "svelte/reactivity";
  import { fade, fly, scale } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { invoke } from "@tauri-apps/api/core";
  import { listen } from "@tauri-apps/api/event";
  import { getCurrentWindow } from "@tauri-apps/api/window";

  /** @typedef {'idle' | 'ready' | 'running' | 'done' | 'error' | 'pulling'} ItemStatus */

  /**
   * @typedef {Object} QueueItem
   * @property {string} id
   * @property {string} path
   * @property {string} name
   * @property {ItemStatus} status
   * @property {string} [error]
   * @property {number} [imageCount]
   * @property {number} [monoCount]
   * @property {string} [outputDir]
   * @property {number} progress
   * @property {string} [camera]
   * @property {string} [focal]
   * @property {boolean} [hasMono]
   * @property {string[]} [monoCams]
   * @property {boolean} [fromCamera]
   */

  /**
   * @typedef {Object} RemoteLri
   * @property {string} name
   * @property {string} remote_path
   * @property {number} size
   * @property {string} [mtime]
   */

  /** @type {QueueItem[]} */
  let queue = $state([]);
  let onlyMono = $state(false);
  let monoPreviews = $state(true);
  let outputRoot = $state(/** @type {string | null} */ (null));
  let dragging = $state(false);
  let busy = $state(false);
  let globalMsg = $state("");
  let pulse = $state(false);
  let doneBurst = $state(false);

  /** @type {{ adb_ok: boolean, light?: { serial: string, model: string }, devices: any[] } | null} */
  let camStatus = $state(null);
  let camBusy = $state(false);
  let camPanel = $state(false);
  /** @type {RemoteLri[]} */
  let remoteList = $state([]);
  /** @type {SvelteSet<string>} */
  let selectedRemote = new SvelteSet();
  let camError = $state("");
  let camLoading = $state(false);

  const doneCount = $derived(queue.filter((q) => q.status === "done").length);
  const errCount = $derived(queue.filter((q) => q.status === "error").length);
  const running = $derived(queue.find((q) => q.status === "running" || q.status === "pulling"));
  const lightOnline = $derived(!!camStatus?.light);
  const selectedCount = $derived(selectedRemote.size);
  const readyCount = $derived(queue.filter((q) => q.status === "ready").length);

  function uid() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function isLri(path) {
    return path.toLowerCase().endsWith(".lri");
  }

  function baseName(path) {
    return path.split(/[/\\]/).pop() ?? path;
  }

  function fmtSize(n) {
    if (!n) return "—";
    if (n >= 1e9) return `${(n / 1e9).toFixed(2)} GB`;
    if (n >= 1e6) return `${(n / 1e6).toFixed(0)} MB`;
    return `${(n / 1e3).toFixed(0)} KB`;
  }

  function toast(msg, ms = 2000) {
    globalMsg = msg;
    setTimeout(() => {
      if (globalMsg === msg) globalMsg = "";
    }, ms);
  }

  async function ensureOutput() {
    if (outputRoot) return outputRoot;
    const picked = await invoke("pick_output_dir");
    if (!picked) return null;
    outputRoot = picked;
    return picked;
  }

  async function refreshCamera() {
    try {
      camStatus = await invoke("camera_status");
    } catch {
      camStatus = { adb_ok: false, devices: [] };
    }
  }

  async function openCameraPanel() {
    camPanel = true;
    camError = "";
    camLoading = true;
    selectedRemote.clear();
    try {
      await refreshCamera();
      if (!camStatus?.light && !(camStatus?.devices?.length)) {
        camError = "No camera online — connect Light L16 via USB";
        remoteList = [];
        return;
      }
      remoteList = await invoke("list_camera_lri", {
        serial: camStatus?.light?.serial ?? null,
      });
    } catch (e) {
      camError = String(e);
      remoteList = [];
    } finally {
      camLoading = false;
    }
  }

  function toggleRemote(name) {
    if (selectedRemote.has(name)) selectedRemote.delete(name);
    else selectedRemote.add(name);
  }

  function selectAllRemote() {
    selectedRemote.clear();
    for (const r of remoteList) selectedRemote.add(r.name);
  }

  function selectNoneRemote() {
    selectedRemote.clear();
  }

  async function pullSelectedToQueue() {
    if (!selectedCount || camBusy) return;
    camBusy = true;
    camError = "";
    const picks = remoteList.filter((r) => selectedRemote.has(r.name));
    pulse = true;
    setTimeout(() => (pulse = false), 600);

    for (const remote of picks) {
      if (queue.some((q) => q.name === remote.name && q.fromCamera)) continue;

      const id = uid();
      /** @type {QueueItem} */
      const item = {
        id,
        path: "",
        name: remote.name,
        status: "pulling",
        progress: 0,
        fromCamera: true,
        camera: "adb pull…",
      };
      queue = [...queue, item];

      try {
        const pulled = await invoke("pull_camera_lri", {
          remotePath: remote.remote_path,
          name: remote.name,
          size: remote.size,
          serial: camStatus?.light?.serial ?? null,
        });
        queue = queue.map((q) =>
          q.id === id
            ? {
                ...q,
                path: pulled.local_path,
                status: "idle",
                camera: pulled.from_cache ? "cached" : "pulled",
              }
            : q,
        );

        // inspect
        const summary = await invoke("inspect_lri", { path: pulled.local_path });
        queue = queue.map((q) =>
          q.id === id
            ? {
                ...q,
                status: "ready",
                focal: summary.focal_length != null ? `${summary.focal_length} mm` : null,
                hasMono: monoFromSummary(summary).present,
                monoCams: monoFromSummary(summary).cameras,
                imageCount: summary.image_count,
              }
            : q,
        );
      } catch (e) {
        queue = queue.map((q) =>
          q.id === id ? { ...q, status: "error", error: String(e), progress: 0 } : q,
        );
      }
    }

    camBusy = false;
    camPanel = false;
    toast(`Added ${picks.length} from camera`);
  }

  function monoFromSummary(summary) {
    if (summary.mono?.cameras?.length) {
      return { present: true, cameras: summary.mono.cameras };
    }
    const cameras = (summary.cameras || [])
      .filter((c) => c.is_mono || (c.sensor || "").toLowerCase().includes("mono"))
      .map((c) => c.id);
    return { present: cameras.length > 0, cameras };
  }

  async function addPaths(paths) {
    const lris = (paths ?? []).filter(isLri);
    if (!lris.length) {
      toast("Drop .lri files");
      return;
    }

    pulse = true;
    setTimeout(() => (pulse = false), 600);

    for (const path of lris) {
      if (queue.some((q) => q.path === path)) continue;
      /** @type {QueueItem} */
      const item = {
        id: uid(),
        path,
        name: baseName(path),
        status: "idle",
        progress: 0,
      };
      queue = [...queue, item];

      try {
        const summary = await invoke("inspect_lri", { path });
        queue = queue.map((q) =>
          q.id === item.id
            ? {
                ...q,
                status: "ready",
                focal: summary.focal_length != null ? `${summary.focal_length} mm` : null,
                hasMono: monoFromSummary(summary).present,
                monoCams: monoFromSummary(summary).cameras,
                imageCount: summary.image_count,
              }
            : q,
        );
      } catch (e) {
        queue = queue.map((q) =>
          q.id === item.id
            ? { ...q, status: "error", error: String(e), progress: 0 }
            : q,
        );
      }
    }
  }

  async function convertAll() {
    if (busy) return;
    const out = await ensureOutput();
    if (!out) return;

    const todo = queue.filter((q) => q.status === "ready" || q.status === "error");
    if (!todo.length) return;

    busy = true;
    doneBurst = false;

    for (const item of todo) {
      if (!item.path) continue;
      queue = queue.map((q) =>
        q.id === item.id
          ? { ...q, status: "running", progress: 0, error: undefined, camera: "…" }
          : q,
      );

      try {
        const res = await invoke("convert_lri", {
          input: item.path,
          output: out,
          onlyMono,
          monoPreviews,
        });
        queue = queue.map((q) =>
          q.id === item.id
            ? {
                ...q,
                status: "done",
                progress: 1,
                imageCount: res.image_count,
                monoCount: res.mono_count,
                outputDir: res.output_dir,
                camera: "done",
              }
            : q,
        );
      } catch (e) {
        queue = queue.map((q) =>
          q.id === item.id
            ? { ...q, status: "error", error: String(e), progress: 0 }
            : q,
        );
      }
    }

    busy = false;
    doneBurst = true;
    setTimeout(() => (doneBurst = false), 1200);
  }

  function clearDone() {
    queue = queue.filter((q) => q.status !== "done");
  }

  function removeItem(id) {
    queue = queue.filter((q) => q.id !== id);
  }

  async function reveal(path) {
    try {
      await invoke("reveal_path", { path });
    } catch (e) {
      toast(String(e));
    }
  }

  async function chooseOutput() {
    const picked = await invoke("pick_output_dir");
    if (picked) outputRoot = picked;
  }

  onMount(() => {
    let unlistenProgress = () => {};
    let unlistenDrop = () => {};
    let pollTimer = 0;

    (async () => {
      try {
        outputRoot = (await invoke("get_output_root")) ?? null;
      } catch {
        /* ignore */
      }

      await refreshCamera();
      pollTimer = window.setInterval(refreshCamera, 4000);

      unlistenProgress = await listen("convert-progress", (event) => {
        const p = event.payload;
        queue = queue.map((q) => {
          if (q.name !== p.file && !q.path.endsWith(p.file)) return q;
          if (p.phase === "pull") {
            return { ...q, camera: p.camera, status: q.status === "pulling" ? "pulling" : q.status };
          }
          const total = p.total > 0 ? p.total : 1;
          return {
            ...q,
            progress: Math.min(1, p.done / total),
            camera: p.camera,
          };
        });
      });

      const win = getCurrentWindow();
      unlistenDrop = await win.onDragDropEvent(async (event) => {
        const { type, paths } = event.payload;
        if (type === "enter" || type === "over") {
          dragging = true;
        } else if (type === "leave") {
          dragging = false;
        } else if (type === "drop") {
          dragging = false;
          await addPaths(paths ?? []);
        }
      });
    })();

    return () => {
      unlistenProgress();
      unlistenDrop();
      if (pollTimer) clearInterval(pollTimer);
    };
  });
</script>

<main class="shell" class:dragging class:pulse class:done-burst={doneBurst}>
  <header class="top" in:fly={{ y: -16, duration: 500, easing: cubicOut }}>
    <div class="brand">
      <img
        class="mark"
        src="/icons/app-icon.png"
        width="48"
        height="48"
        alt=""
        aria-hidden="true"
        draggable="false"
      />
      <div>
        <h1>LRI Drop</h1>
        <p>Light Raw → DNG · drop or from camera</p>
      </div>
    </div>
    <div class="top-actions">
      <button
        class="cam-pill"
        class:online={lightOnline}
        class:offline={!lightOnline}
        type="button"
        onclick={openCameraPanel}
        title={lightOnline
          ? `${camStatus?.light?.model ?? "L16"} · ${camStatus?.light?.serial}`
          : "No Light camera (adb)"}
      >
        <span class="cam-dot"></span>
        {#if lightOnline}
          Light {camStatus?.light?.model || "L16"}
        {:else if camStatus && !camStatus.adb_ok}
          no adb
        {:else}
          camera offline
        {/if}
      </button>
      <button class="ghost" type="button" onclick={chooseOutput} title={outputRoot ?? "Pick folder"}>
        {#if outputRoot}
          <span class="out-label">{baseName(outputRoot)}</span>
        {:else}
          Output folder…
        {/if}
      </button>
    </div>
  </header>

  <section
    class="dropzone"
    class:active={dragging}
    class:has-items={queue.length > 0}
    in:scale={{ start: 0.96, duration: 450, easing: cubicOut }}
  >
    <div class="orbit" aria-hidden="true">
      {#each [0, 1, 2] as i (i)}
        <span class="ring" style="--i: {i}"></span>
      {/each}
    </div>

    <div class="drop-inner">
      <div class="icon-stack" class:bounce={dragging}>
        <div class="file-ghost g1"></div>
        <div class="file-ghost g2"></div>
        <div class="file-main">.lri</div>
      </div>
      <h2>{dragging ? "Release to add" : "Drop .lri files here"}</h2>
      <p class="hint">
        or
        <button class="inline-link" type="button" onclick={openCameraPanel} disabled={!lightOnline && camStatus?.adb_ok === false}>
          pick from Light camera
        </button>
        · mono as <code>A2_mono.dng</code>
      </p>
    </div>
  </section>

  <section class="controls" in:fly={{ y: 12, duration: 400, delay: 80, easing: cubicOut }}>
    <label class="toggle">
      <input type="checkbox" bind:checked={onlyMono} />
      <span class="track"><span class="knob"></span></span>
      <span>Mono only (A2 / C6)</span>
    </label>
    <label class="toggle">
      <input type="checkbox" bind:checked={monoPreviews} />
      <span class="track"><span class="knob"></span></span>
      <span>Mono PNG previews</span>
    </label>
    <div class="spacer"></div>
    <button
      class="primary"
      type="button"
      disabled={busy || !queue.some((q) => q.status === "ready" || q.status === "error")}
      onclick={convertAll}
    >
      {#if busy}
        Converting…
      {:else}
        Convert {readyCount || ""}
      {/if}
    </button>
  </section>

  {#if globalMsg}
    <div class="toast" transition:fly={{ y: 20, duration: 280 }}>{globalMsg}</div>
  {/if}

  <section class="queue" aria-live="polite">
    {#if queue.length === 0}
      <p class="empty" in:fade={{ duration: 200 }}>
        Queue empty — drop files or open camera
      </p>
    {:else}
      <div class="queue-head">
        <span>{queue.length} file{queue.length === 1 ? "" : "s"}</span>
        <span class="stats">
          {#if doneCount}<span class="ok">{doneCount} done</span>{/if}
          {#if errCount}<span class="err">{errCount} err</span>{/if}
          {#if running}<span class="run">working…</span>{/if}
        </span>
        {#if doneCount}
          <button class="link" type="button" onclick={clearDone}>Clear done</button>
        {/if}
      </div>

      <ul class="cards">
        {#each queue as item, i (item.id)}
          <li
            class="card status-{item.status}"
            in:fly={{ y: 18, duration: 380, delay: Math.min(i * 40, 200), easing: cubicOut }}
            out:fly={{ x: 40, duration: 220 }}
          >
            <div class="card-top">
              <div class="name-row">
                <span class="dot"></span>
                <strong>{item.name}</strong>
                {#if item.fromCamera}
                  <span class="chip cam">camera</span>
                {/if}
                {#if item.hasMono}
                  <span class="chip mono">mono {item.monoCams?.join("+")}</span>
                {/if}
                {#if item.focal}
                  <span class="chip">{item.focal}</span>
                {/if}
              </div>
              <button class="icon-btn" type="button" onclick={() => removeItem(item.id)} aria-label="Remove">
                ×
              </button>
            </div>

            <div class="bar-wrap">
              <div
                class="bar"
                class:indeterminate={item.status === "pulling"}
                style="transform: scaleX({item.status === 'done' ? 1 : item.status === 'pulling' ? 0.35 : item.progress || 0})"
              ></div>
            </div>

            <div class="card-meta">
              {#if item.status === "pulling"}
                Pulling from camera… {item.camera ?? ""}
              {:else if item.status === "idle"}
                Reading…
              {:else if item.status === "ready"}
                {item.imageCount ?? "?"} modules ready
              {:else if item.status === "running"}
                {item.camera ?? "…"} · {Math.round((item.progress || 0) * 100)}%
              {:else if item.status === "done"}
                <button class="link" type="button" onclick={() => reveal(item.outputDir)}>
                  {item.imageCount} DNG{#if item.monoCount} · {item.monoCount} mono{/if} → open
                </button>
              {:else if item.status === "error"}
                <span class="err-text">{item.error}</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <footer class="foot" in:fade={{ duration: 500, delay: 150 }}>
    luminat · isamarin × BLMK
  </footer>
</main>

{#if camPanel}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-backdrop" transition:fade={{ duration: 180 }} onclick={() => !camBusy && (camPanel = false)}>
    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
    <div
      class="modal"
      transition:fly={{ y: 24, duration: 320, easing: cubicOut }}
      onclick={(e) => e.stopPropagation()}
    >
      <div class="modal-head">
        <div>
          <h2>Light camera</h2>
          <p>
            {#if lightOnline}
              {camStatus?.light?.model || "L16"} · {camStatus?.light?.serial}
            {:else}
              Searching via adb…
            {/if}
          </p>
        </div>
        <button class="icon-btn" type="button" onclick={() => (camPanel = false)} disabled={camBusy}>×</button>
      </div>

      {#if camLoading}
        <div class="modal-empty">Listing /sdcard/DCIM/Camera…</div>
      {:else if camError}
        <div class="modal-empty err-text">{camError}</div>
      {:else}
        <div class="modal-toolbar">
          <span>{remoteList.length} captures · {selectedCount} selected</span>
          <div class="modal-tools">
            <button class="link" type="button" onclick={selectAllRemote}>All</button>
            <button class="link" type="button" onclick={selectNoneRemote}>None</button>
            <button class="link" type="button" onclick={openCameraPanel}>Refresh</button>
          </div>
        </div>
        <ul class="remote-list">
          {#each remoteList as r (r.name)}
            <li>
              <label class="remote-row" class:on={selectedRemote.has(r.name)}>
                <input
                  type="checkbox"
                  checked={selectedRemote.has(r.name)}
                  onchange={() => toggleRemote(r.name)}
                />
                <span class="r-name">{r.name}</span>
                <span class="r-meta">{fmtSize(r.size)}{#if r.mtime} · {r.mtime}{/if}</span>
              </label>
            </li>
          {/each}
        </ul>
      {/if}

      <div class="modal-foot">
        <button class="ghost" type="button" onclick={() => (camPanel = false)} disabled={camBusy}>Cancel</button>
        <button
          class="primary"
          type="button"
          disabled={!selectedCount || camBusy || camLoading}
          onclick={pullSelectedToQueue}
        >
          {#if camBusy}
            Pulling…
          {:else}
            Add {selectedCount || ""} to queue
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .shell {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto auto 1fr auto;
    gap: 1rem;
    padding: 1.25rem 1.35rem 1rem;
    position: relative;
    transition: background 0.4s ease;
  }

  .shell.dragging {
    background: radial-gradient(900px 500px at 50% 30%, var(--gold-soft), transparent 60%);
  }

  .shell.pulse .mark {
    animation: pop 0.55s cubic-bezier(0.2, 1.4, 0.3, 1);
  }

  .shell.done-burst .mark {
    animation: ring-burst 0.9s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0.85rem;
  }

  .mark {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 8px 28px var(--gold-glow);
    user-select: none;
  }

  h1 {
    margin: 0;
    font-size: 1.2rem;
    letter-spacing: 0.01em;
  }

  .brand p {
    margin: 0.15rem 0 0;
    color: var(--muted);
    font-size: 0.82rem;
  }

  .top-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cam-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    background: rgba(255, 255, 255, 0.03);
    transition:
      border-color 0.25s ease,
      color 0.25s ease,
      background 0.25s ease,
      box-shadow 0.3s ease;
  }

  .cam-pill.online {
    border-color: rgba(93, 202, 138, 0.45);
    color: #b8f0d0;
    background: var(--ok-soft);
    box-shadow: 0 0 20px rgba(93, 202, 138, 0.12);
  }

  .cam-pill.offline:hover {
    border-color: rgba(232, 164, 58, 0.35);
    color: var(--text);
  }

  .cam-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #666;
  }

  .cam-pill.online .cam-dot {
    background: var(--ok);
    box-shadow: 0 0 0 0 rgba(93, 202, 138, 0.5);
    animation: pulse-dot 1.6s ease infinite;
  }

  .ghost {
    max-width: 180px;
    padding: 0.5rem 0.85rem;
    border-radius: 999px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.03);
    color: var(--muted);
    font-size: 0.8rem;
    transition:
      border-color 0.25s ease,
      color 0.25s ease,
      background 0.25s ease;
  }

  .ghost:hover {
    border-color: rgba(232, 164, 58, 0.4);
    color: var(--text);
    background: var(--gold-soft);
  }

  .out-label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dropzone {
    position: relative;
    border-radius: calc(var(--radius) + 4px);
    border: 1.5px dashed rgba(255, 255, 255, 0.12);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 70%), var(--bg1);
    min-height: 180px;
    display: grid;
    place-items: center;
    overflow: hidden;
    transition:
      border-color 0.35s ease,
      background 0.35s ease,
      box-shadow 0.4s ease,
      transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1);
  }

  .dropzone.has-items {
    min-height: 140px;
  }

  .dropzone.active {
    border-color: rgba(232, 164, 58, 0.7);
    background:
      radial-gradient(circle at 50% 50%, var(--gold-soft), transparent 65%),
      var(--bg2);
    box-shadow:
      0 0 0 1px rgba(232, 164, 58, 0.2),
      0 20px 60px rgba(0, 0, 0, 0.35);
    transform: scale(1.015);
  }

  .orbit {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .ring {
    position: absolute;
    left: 50%;
    top: 50%;
    width: calc(120px + var(--i) * 70px);
    height: calc(120px + var(--i) * 70px);
    margin: calc(-60px - var(--i) * 35px) 0 0 calc(-60px - var(--i) * 35px);
    border-radius: 50%;
    border: 1px solid rgba(232, 164, 58, calc(0.12 - var(--i) * 0.03));
    animation: spin calc(18s + var(--i) * 6s) linear infinite;
    animation-direction: alternate;
  }

  .dropzone.active .ring {
    border-color: rgba(232, 164, 58, calc(0.35 - var(--i) * 0.08));
    animation-duration: calc(6s + var(--i) * 2s);
  }

  .drop-inner {
    position: relative;
    text-align: center;
    padding: 1.25rem;
    z-index: 1;
  }

  .icon-stack {
    width: 72px;
    height: 88px;
    margin: 0 auto 0.85rem;
    position: relative;
    transition: transform 0.35s cubic-bezier(0.2, 1.2, 0.3, 1);
  }

  .icon-stack.bounce {
    transform: translateY(-6px) scale(1.06);
  }

  .file-ghost,
  .file-main {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    background: var(--bg3);
    border: 1px solid var(--line);
  }

  .g1 {
    transform: rotate(-8deg) translate(-6px, 4px);
    opacity: 0.4;
  }

  .g2 {
    transform: rotate(6deg) translate(8px, 2px);
    opacity: 0.55;
  }

  .file-main {
    display: grid;
    place-items: center;
    background: linear-gradient(160deg, #2a2e38, #1a1d24);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    font-family: var(--mono-font);
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--gold);
    letter-spacing: 0.04em;
  }

  .drop-inner h2 {
    margin: 0 0 0.4rem;
    font-size: 1.1rem;
    font-weight: 650;
    transition: color 0.25s ease;
  }

  .dropzone.active .drop-inner h2 {
    color: var(--gold);
  }

  .hint {
    margin: 0;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .hint code {
    font-family: var(--mono-font);
    font-size: 0.78rem;
    color: var(--mono);
    background: rgba(255, 255, 255, 0.05);
    padding: 0.1rem 0.35rem;
    border-radius: 5px;
  }

  .inline-link {
    color: var(--gold);
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 2px;
    padding: 0 0.15rem;
  }

  .inline-link:hover {
    opacity: 0.85;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.85rem 1.1rem;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    font-size: 0.86rem;
    color: var(--muted);
    cursor: pointer;
    user-select: none;
  }

  .toggle input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .track {
    width: 38px;
    height: 22px;
    border-radius: 999px;
    background: var(--bg3);
    border: 1px solid var(--line);
    position: relative;
    transition:
      background 0.25s ease,
      border-color 0.25s ease;
  }

  .knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #d0d4dc;
    transition: transform 0.28s cubic-bezier(0.2, 1.2, 0.3, 1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  }

  .toggle input:checked + .track {
    background: var(--gold-soft);
    border-color: rgba(232, 164, 58, 0.5);
  }

  .toggle input:checked + .track .knob {
    transform: translateX(16px);
    background: var(--gold);
  }

  .spacer {
    flex: 1;
  }

  .primary {
    padding: 0.65rem 1.25rem;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--gold), var(--accent-primary-dim));
    color: #1a1208;
    font-weight: 700;
    letter-spacing: 0.01em;
    box-shadow: 0 10px 28px var(--gold-glow);
    transition:
      transform 0.2s ease,
      box-shadow 0.25s ease,
      filter 0.2s ease;
  }

  .primary:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  .queue {
    min-height: 0;
    overflow: auto;
  }

  .empty {
    margin: 1.5rem 0;
    text-align: center;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .queue-head {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.65rem;
    font-size: 0.8rem;
    color: var(--muted);
  }

  .stats {
    display: flex;
    gap: 0.55rem;
  }

  .stats .ok {
    color: var(--ok);
  }
  .stats .err {
    color: var(--err);
  }
  .stats .run {
    color: var(--gold);
  }

  .cards {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }

  .card {
    border-radius: 14px;
    border: 1px solid var(--line);
    background: rgba(255, 255, 255, 0.025);
    padding: 0.75rem 0.85rem 0.7rem;
    transition:
      border-color 0.3s ease,
      background 0.3s ease;
  }

  .card.status-running,
  .card.status-pulling {
    border-color: rgba(232, 164, 58, 0.35);
    background: linear-gradient(90deg, var(--gold-soft), transparent 55%);
  }

  .card.status-done {
    border-color: rgba(93, 202, 138, 0.3);
    background: var(--ok-soft);
  }

  .card.status-error {
    border-color: rgba(224, 92, 92, 0.35);
    background: var(--err-soft);
  }

  .card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .name-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.5rem;
  }

  .name-row strong {
    font-size: 0.92rem;
    font-weight: 650;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--muted);
    flex-shrink: 0;
  }

  .status-ready .dot {
    background: var(--gold);
  }
  .status-running .dot,
  .status-pulling .dot {
    background: var(--gold);
    animation: pulse-dot 1.2s ease infinite;
  }
  .status-done .dot {
    background: var(--ok);
  }
  .status-error .dot {
    background: var(--err);
  }

  .chip {
    font-size: 0.68rem;
    padding: 0.12rem 0.4rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: var(--muted);
    font-weight: 600;
  }

  .chip.mono {
    background: rgba(200, 204, 212, 0.16);
    color: var(--mono);
  }

  .chip.cam {
    background: rgba(74, 168, 216, 0.18);
    color: #8fd0f0;
  }

  .icon-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    color: var(--muted);
    font-size: 1.1rem;
    line-height: 1;
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text);
  }

  .bar-wrap {
    margin: 0.55rem 0 0.4rem;
    height: 4px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    overflow: hidden;
  }

  .bar {
    height: 100%;
    width: 100%;
    transform-origin: left center;
    transform: scaleX(0);
    border-radius: inherit;
    background: linear-gradient(90deg, var(--gold), var(--accent-primary-hover));
    transition: transform 0.35s cubic-bezier(0.2, 0.9, 0.2, 1);
  }

  .bar.indeterminate {
    animation: shimmer 1.1s ease-in-out infinite alternate;
  }

  .status-done .bar {
    background: linear-gradient(90deg, #3da86c, var(--ok));
  }

  .card-meta {
    font-size: 0.78rem;
    color: var(--muted);
    min-height: 1.1em;
  }

  .err-text {
    color: #f0a0a0;
  }

  .link {
    color: var(--gold);
    font-size: inherit;
  }

  .link:hover {
    text-decoration: underline;
  }

  .toast {
    position: fixed;
    left: 50%;
    bottom: 2.2rem;
    transform: translateX(-50%);
    padding: 0.55rem 1rem;
    border-radius: 999px;
    background: var(--bg3);
    border: 1px solid var(--line);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    font-size: 0.85rem;
    z-index: 40;
  }

  .foot {
    text-align: center;
    color: rgba(255, 255, 255, 0.28);
    font-size: 0.72rem;
    letter-spacing: 0.04em;
  }

  /* Camera modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(6, 7, 10, 0.72);
    backdrop-filter: blur(8px);
    z-index: 30;
    display: grid;
    place-items: center;
    padding: 1.25rem;
  }

  .modal {
    width: min(520px, 100%);
    max-height: min(78vh, 720px);
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    border: 1px solid var(--line);
    background: linear-gradient(180deg, #1a1c22, #12141a);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
    overflow: hidden;
  }

  .modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 1rem 1.1rem 0.75rem;
    border-bottom: 1px solid var(--line);
  }

  .modal-head h2 {
    margin: 0;
    font-size: 1.05rem;
  }

  .modal-head p {
    margin: 0.25rem 0 0;
    font-size: 0.78rem;
    color: var(--muted);
    font-family: var(--mono-font);
  }

  .modal-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 1.1rem;
    font-size: 0.78rem;
    color: var(--muted);
    border-bottom: 1px solid var(--line);
  }

  .modal-tools {
    display: flex;
    gap: 0.75rem;
  }

  .remote-list {
    list-style: none;
    margin: 0;
    padding: 0.35rem 0;
    overflow: auto;
    flex: 1;
  }

  .remote-row {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.65rem;
    align-items: center;
    padding: 0.55rem 1.1rem;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .remote-row:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  .remote-row.on {
    background: var(--gold-soft);
  }

  .remote-row input {
    accent-color: var(--gold);
  }

  .r-name {
    font-weight: 600;
    font-size: 0.88rem;
    font-family: var(--mono-font);
  }

  .r-meta {
    font-size: 0.72rem;
    color: var(--muted);
    white-space: nowrap;
  }

  .modal-empty {
    padding: 2rem 1.25rem;
    text-align: center;
    color: var(--muted);
    font-size: 0.9rem;
  }

  .modal-foot {
    display: flex;
    justify-content: flex-end;
    gap: 0.65rem;
    padding: 0.85rem 1.1rem;
    border-top: 1px solid var(--line);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg) scale(1);
    }
    to {
      transform: rotate(12deg) scale(1.03);
    }
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }
    40% {
      transform: scale(1.18);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes ring-burst {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.35);
      opacity: 0.35;
    }
  }

  @keyframes pulse-dot {
    0% {
      box-shadow: 0 0 0 0 rgba(93, 202, 138, 0.55);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(93, 202, 138, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(93, 202, 138, 0);
    }
  }

  @keyframes shimmer {
    from {
      opacity: 0.55;
      transform: scaleX(0.2);
    }
    to {
      opacity: 1;
      transform: scaleX(0.55);
    }
  }
</style>
