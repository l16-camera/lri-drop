/**
 * LRI Drop landing — CircaHue living accent + interactive UI shell demo.
 */

import {
  applyCssVars,
  createLightHueTicker,
  sampleLightHue,
} from "./vendor/circahue.js";

/** @typedef {'ready' | 'running' | 'done'} ItemStatus */

/**
 * @typedef {Object} QueueItem
 * @property {string} id
 * @property {string} name
 * @property {ItemStatus} status
 * @property {number} progress
 * @property {boolean} fromCamera
 * @property {boolean} hasMono
 * @property {string} monoCams
 * @property {string} focal
 * @property {number} imageCount
 * @property {number} [monoCount]
 */

const HUE_OPTS = {
  latitude: 55.75,
};

/** @type {QueueItem[]} */
let queue = [];
let busy = false;
let sampleIndex = 0;
/** @type {number | null} */
let hourOverride = null;
/** @type {{ stop: () => void, refresh: () => unknown } | null} */
let ticker = null;

const samples = [
  {
    name: "IMG_20170412_142211.lri",
    fromCamera: false,
    hasMono: true,
    monoCams: "A2+C6",
    focal: "28 mm",
    imageCount: 10,
    monoCount: 2,
  },
  {
    name: "IMG_20180301_091044.lri",
    fromCamera: true,
    hasMono: true,
    monoCams: "A2",
    focal: "70 mm",
    imageCount: 8,
    monoCount: 1,
  },
  {
    name: "street_golden_hour.lri",
    fromCamera: false,
    hasMono: false,
    monoCams: "",
    focal: "35 mm",
    imageCount: 12,
    monoCount: 0,
  },
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** @param {{ cssVars: Record<string, string>, phaseLabel: string, accent: { hex: string }, hour: number, caption: string }} snap */
function paintHue(snap) {
  applyCssVars(document.documentElement, snap.cssVars);

  const phase = document.getElementById("huePhase");
  const hex = document.getElementById("hueHex");
  const caption = document.getElementById("hueCaption");
  const swatch = document.getElementById("hueSwatch");
  const titleHue = document.getElementById("titleHue");
  const hourOut = document.getElementById("hourOut");

  if (phase) phase.textContent = snap.phaseLabel;
  if (hex) hex.textContent = snap.accent.hex;
  if (swatch) swatch.style.background = snap.accent.hex;
  if (titleHue) titleHue.style.background = snap.accent.hex;
  if (caption) {
    const mode = hourOverride == null ? "live clock" : `scrub ${snap.hour.toFixed(2)}h`;
    caption.textContent = `${snap.phaseLabel} · ${snap.accent.hex} · ${mode} · ${snap.caption}`;
  }
  if (hourOut && hourOverride == null) {
    hourOut.textContent = "live";
  }
}

function sampleNow() {
  const opts =
    hourOverride == null
      ? { ...HUE_OPTS }
      : { ...HUE_OPTS, hourOverride };
  return sampleLightHue(opts);
}

function applyHue() {
  paintHue(sampleNow());
}

function startLiveTicker() {
  ticker?.stop();
  ticker = createLightHueTicker((snap) => paintHue(snap), {
    ...HUE_OPTS,
    intervalMs: 60_000,
  });
}

function setHourOverride(/** @type {number | null} */ h) {
  hourOverride = h;
  if (h == null) {
    startLiveTicker();
    const dial = document.getElementById("hourDial");
    // Sync slider to current local hour for continuity
    if (dial instanceof HTMLInputElement) {
      dial.value = String(sampleLightHue(HUE_OPTS).hour);
    }
    const hourOut = document.getElementById("hourOut");
    if (hourOut) hourOut.textContent = "live";
  } else {
    ticker?.stop();
    ticker = null;
    const hourOut = document.getElementById("hourOut");
    if (hourOut) hourOut.textContent = `${h.toFixed(2)}h`;
    applyHue();
  }
}

function renderQueue() {
  const empty = document.getElementById("queueEmpty");
  const live = document.getElementById("queueLive");
  const cards = document.getElementById("cards");
  const countEl = document.getElementById("queueCount");
  const statsEl = document.getElementById("queueStats");
  const clearBtn = document.getElementById("clearDone");
  const convertBtn = document.getElementById("convertBtn");

  if (!empty || !live || !cards || !countEl || !statsEl || !clearBtn || !convertBtn) return;

  if (queue.length === 0) {
    empty.hidden = false;
    live.hidden = true;
    cards.innerHTML = "";
    convertBtn.disabled = true;
    convertBtn.textContent = "Convert";
    return;
  }

  empty.hidden = true;
  live.hidden = false;

  const doneCount = queue.filter((q) => q.status === "done").length;
  const running = queue.some((q) => q.status === "running");

  countEl.textContent = `${queue.length} file${queue.length === 1 ? "" : "s"}`;
  statsEl.innerHTML = [
    doneCount ? `<span class="ok">${doneCount} done</span>` : "",
    running ? `<span class="run">working…</span>` : "",
  ]
    .filter(Boolean)
    .join("");

  clearBtn.hidden = doneCount === 0;

  const onlyMono = document.getElementById("onlyMono")?.checked;

  cards.innerHTML = queue
    .map((item) => {
      let meta = "";
      if (item.status === "ready") {
        meta = onlyMono
          ? `${item.monoCount || item.imageCount} mono modules ready`
          : `${item.imageCount} modules ready`;
      } else if (item.status === "running") {
        meta = `extract · ${Math.round(item.progress * 100)}%`;
      } else if (item.status === "done") {
        const n = onlyMono ? item.monoCount || 0 : item.imageCount;
        const monoNote =
          !onlyMono && item.monoCount ? ` · ${item.monoCount} mono` : "";
        meta = `<button type="button" class="link" data-reveal="${item.id}">${n} DNG${monoNote} → open</button>`;
      }

      return `
        <li class="card status-${item.status}" data-id="${item.id}">
          <div class="card-top">
            <div class="name-row">
              <span class="dot"></span>
              <strong>${item.name}</strong>
              ${item.fromCamera ? '<span class="chip cam">camera</span>' : ""}
              ${item.hasMono ? `<span class="chip mono">mono ${item.monoCams}</span>` : ""}
              ${item.focal ? `<span class="chip">${item.focal}</span>` : ""}
            </div>
            <button type="button" class="icon-btn" data-remove="${item.id}" aria-label="Remove">×</button>
          </div>
          <div class="bar-wrap">
            <div class="bar" style="transform: scaleX(${item.status === "done" ? 1 : item.progress || 0})"></div>
          </div>
          <div class="card-meta">${meta}</div>
        </li>`;
    })
    .join("");

  const convertible = queue.some((q) => q.status === "ready");
  convertBtn.disabled = busy || !convertible;
  convertBtn.textContent = busy
    ? "Converting…"
    : `Convert ${queue.filter((q) => q.status === "ready").length || ""}`.trim();
}

function addSample() {
  const template = samples[sampleIndex % samples.length];
  sampleIndex += 1;

  if (queue.some((q) => q.name === template.name && q.status !== "done")) {
    queue = [
      ...queue,
      {
        id: uid(),
        ...template,
        name: template.name.replace(".lri", `_${sampleIndex}.lri`),
        status: /** @type {ItemStatus} */ ("ready"),
        progress: 0,
      },
    ];
  } else {
    queue = [
      ...queue,
      {
        id: uid(),
        ...template,
        status: /** @type {ItemStatus} */ ("ready"),
        progress: 0,
      },
    ];
  }

  const stack = document.getElementById("iconStack");
  const zone = document.getElementById("dropzone");
  const title = document.getElementById("dropTitle");
  stack?.classList.add("bounce");
  zone?.classList.add("active");
  if (title) title.textContent = "Sample added";
  setTimeout(() => {
    stack?.classList.remove("bounce");
    zone?.classList.remove("active");
    if (title) title.textContent = "Drop .lri files here";
  }, 450);

  renderQueue();
}

async function convertAll() {
  if (busy) return;
  const todo = queue.filter((q) => q.status === "ready");
  if (!todo.length) return;

  busy = true;
  renderQueue();

  for (const item of todo) {
    queue = queue.map((q) =>
      q.id === item.id ? { ...q, status: "running", progress: 0 } : q,
    );
    renderQueue();

    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      await wait(90 + Math.random() * 70);
      queue = queue.map((q) =>
        q.id === item.id ? { ...q, progress: i / steps } : q,
      );
      renderQueue();
    }

    queue = queue.map((q) =>
      q.id === item.id ? { ...q, status: "done", progress: 1 } : q,
    );
    renderQueue();
  }

  busy = false;
  renderQueue();
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function removeItem(id) {
  queue = queue.filter((q) => q.id !== id);
  renderQueue();
}

function clearDone() {
  queue = queue.filter((q) => q.status !== "done");
  renderQueue();
}

function init() {
  const dial = document.getElementById("hourDial");
  if (dial instanceof HTMLInputElement) {
    dial.value = String(sampleLightHue(HUE_OPTS).hour);
    dial.addEventListener("input", () => {
      setHourOverride(Number(dial.value));
    });
  }

  document.getElementById("hourLive")?.addEventListener("click", () => {
    setHourOverride(null);
  });

  startLiveTicker();

  const zone = document.getElementById("dropzone");
  zone?.addEventListener("click", (e) => {
    if (e.target instanceof HTMLElement && e.target.closest("#addSample")) return;
    addSample();
  });
  zone?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      addSample();
    }
  });

  document.getElementById("addSample")?.addEventListener("click", (e) => {
    e.stopPropagation();
    addSample();
  });

  document.getElementById("convertBtn")?.addEventListener("click", convertAll);
  document.getElementById("clearDone")?.addEventListener("click", clearDone);
  document.getElementById("onlyMono")?.addEventListener("change", renderQueue);
  document.getElementById("monoPreviews")?.addEventListener("change", renderQueue);

  document.getElementById("cards")?.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    const removeId =
      t.getAttribute("data-remove") ||
      t.closest("[data-remove]")?.getAttribute("data-remove");
    if (removeId) {
      removeItem(removeId);
      return;
    }
    if (t.getAttribute("data-reveal")) {
      t.textContent = "demo — no local folder";
    }
  });

  document.getElementById("exportForm")?.addEventListener("submit", (e) => e.preventDefault());

  renderQueue();
}

init();
