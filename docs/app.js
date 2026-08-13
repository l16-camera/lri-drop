/**
 * LRI Drop landing — CircaHue living accent + interactive UI shell demo.
 */

import {
  applyCssVars,
  createLightHueTicker,
  sampleLightHue,
} from "./vendor/circahue.js";
import { initI18n, t, onLangChange } from "./i18n.js";

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
    hourOut.textContent = t("hourLiveOut");
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
    if (hourOut) hourOut.textContent = t("hourLiveOut");
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
    convertBtn.textContent = t("convert");
    return;
  }

  empty.hidden = true;
  live.hidden = false;

  const doneCount = queue.filter((q) => q.status === "done").length;
  const running = queue.some((q) => q.status === "running");

  countEl.textContent =
    queue.length === 1 ? t("filesOne") : t("filesMany", { n: queue.length });
  statsEl.innerHTML = [
    doneCount ? `<span class="ok">${t("statDone", { n: doneCount })}</span>` : "",
    running ? `<span class="run">${t("statWorking")}</span>` : "",
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
          ? t("monoReady", { n: item.monoCount || item.imageCount })
          : t("modulesReady", { n: item.imageCount });
      } else if (item.status === "running") {
        meta = t("extractPct", { n: Math.round(item.progress * 100) });
      } else if (item.status === "done") {
        const n = onlyMono ? item.monoCount || 0 : item.imageCount;
        const monoNote =
          !onlyMono && item.monoCount ? ` · ${item.monoCount} mono` : "";
        meta = `<button type="button" class="link" data-reveal="${item.id}">${t("openFolder", { n, mono: monoNote })}</button>`;
      }

      return `
        <li class="card status-${item.status}" data-id="${item.id}">
          <div class="card-top">
            <div class="name-row">
              <span class="dot"></span>
              <strong>${item.name}</strong>
              ${item.fromCamera ? `<span class="chip cam">${t("chipCamera")}</span>` : ""}
              ${item.hasMono ? `<span class="chip mono">mono ${item.monoCams}</span>` : ""}
              ${item.focal ? `<span class="chip">${item.focal}</span>` : ""}
            </div>
            <button type="button" class="icon-btn" data-remove="${item.id}" aria-label="${t("removeAria")}">×</button>
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
    ? t("converting")
    : t("convert");
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
  if (title) title.textContent = t("dropSampleAdded");
  setTimeout(() => {
    stack?.classList.remove("bounce");
    zone?.classList.remove("active");
    if (title) title.textContent = t("dropTitle");
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

/**
 * Module array from openfusion Claude artifact — which L16 banks fire
 * at each focal length (measured handoff ~70 mm).
 * @see https://claude.ai/code/artifact/6ccaac29-3827-4fd3-979f-86ef9bb263d6
 */
function initModuleArray() {
  const rowsEl = document.getElementById("rows");
  const focal = document.getElementById("focal");
  const focalVal = document.getElementById("focalVal");
  const regimeHint = document.getElementById("regimeHint");
  const firedReadout = document.getElementById("firedReadout");
  if (!rowsEl || !(focal instanceof HTMLInputElement) || !focalVal || !regimeHint || !firedReadout) {
    return;
  }

  /** @type {{ id: string, name: string, role: string, cams: string[] }[]} */
  const rows = [
    { id: "A", name: "28 mm", role: "wide", cams: ["A1", "A2", "A3", "A4", "A5"] },
    { id: "B", name: "70 mm", role: "mid", cams: ["B1", "B2", "B3", "B4", "B5"] },
    { id: "C", name: "150 mm", role: "tele", cams: ["C1", "C2", "C3", "C4", "C5", "C6"] },
  ];
  const monoCams = new Set(["A2", "C6"]);
  /** @type {Record<string, HTMLElement>} */
  const cellMap = {};

  rows.forEach((r) => {
    const row = document.createElement("div");
    row.className = "mrow";

    const label = document.createElement("div");
    label.className = "label";
    const roleKey = r.role === "wide" ? "rowWide" : r.role === "mid" ? "rowMid" : "rowTele";
    label.innerHTML = `<b>${t("rowLabel", { id: r.id })}</b>${r.name} · ${t(roleKey)}`;
    label.dataset.rowId = r.id;
    label.dataset.rowRole = r.role;
    row.appendChild(label);

    const cells = document.createElement("div");
    cells.className = "cells";
    r.cams.forEach((c) => {
      const cell = document.createElement("div");
      cell.className = "cell" + (monoCams.has(c) ? " mono" : "");
      cell.setAttribute("data-cam", c);
      cell.setAttribute("title", monoCams.has(c) ? `${c} mono → ${c}_mono.dng` : `${c} → ${c}.dng`);
      cell.innerHTML = `${c}<span class="dot" aria-hidden="true"></span>`;
      cells.appendChild(cell);
      cellMap[c] = cell;
    });
    row.appendChild(cells);
    rowsEl.appendChild(row);
  });

  /** @param {string[]} fired */
  function widestRef(fired) {
    const order = [
      "A1", "A2", "A3", "A4", "A5",
      "B1", "B2", "B3", "B4", "B5",
      "C1", "C2", "C3", "C4", "C5", "C6",
    ];
    for (const id of order) {
      if (fired.includes(id)) return id;
    }
    return null;
  }

  function update() {
    const f = Number.parseInt(focal.value, 10);
    focalVal.textContent = String(f);

    /** @type {string[]} */
    let fired = [];
    if (f <= 70) {
      fired = [...rows[0].cams, ...rows[1].cams];
      regimeHint.textContent = t("regimeWide");
    } else {
      fired = [...rows[1].cams, ...rows[2].cams];
      regimeHint.textContent = t("regimeTele");
    }

    const ref = widestRef(fired);
    for (const [c, el] of Object.entries(cellMap)) {
      const on = fired.includes(c);
      el.classList.toggle("fired", on);
      el.classList.toggle("ref", c === ref);
    }
    firedReadout.textContent = ref
      ? t("firingRef", { n: fired.length, ref })
      : t("firing", { n: fired.length });
  }

  function relabelRows() {
    rowsEl.querySelectorAll(".label").forEach((label) => {
      if (!(label instanceof HTMLElement)) return;
      const id = label.dataset.rowId;
      const role = label.dataset.rowRole;
      if (!id || !role) return;
      const roleKey = role === "wide" ? "rowWide" : role === "mid" ? "rowMid" : "rowTele";
      const mm = role === "wide" ? "28 mm" : role === "mid" ? "70 mm" : "150 mm";
      label.innerHTML = `<b>${t("rowLabel", { id })}</b>${mm} · ${t(roleKey)}`;
    });
    update();
  }

  focal.addEventListener("input", update);
  update();
  onLangChange(relabelRows);
}

function init() {
  initI18n();
  onLangChange(() => {
    renderQueue();
  });

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
  initModuleArray();

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
    const el = e.target;
    if (!(el instanceof HTMLElement)) return;
    const removeId =
      el.getAttribute("data-remove") ||
      el.closest("[data-remove]")?.getAttribute("data-remove");
    if (removeId) {
      removeItem(removeId);
      return;
    }
    if (el.getAttribute("data-reveal")) {
      el.textContent = t("revealDemo");
    }
  });

  document.getElementById("exportForm")?.addEventListener("submit", (e) => e.preventDefault());

  document.getElementById("copyLightcal")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    if (!(btn instanceof HTMLButtonElement)) return;
    const text = btn.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(text);
      const prev = btn.textContent;
      btn.textContent = t("letterCopied");
      btn.classList.add("copied");
      window.setTimeout(() => {
        btn.textContent = t("letterCopy");
        btn.classList.remove("copied");
      }, 1600);
    } catch {
      btn.textContent = t("letterCopyFail");
    }
  });

  renderQueue();
}

init();
