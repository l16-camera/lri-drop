"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  CSS_VAR_KEYS: () => CSS_VAR_KEYS,
  DAY_STOPS: () => DAY_STOPS,
  DEFAULT_LATITUDE: () => DEFAULT_LATITUDE,
  DRACONIC_APPROX: () => DRACONIC_APPROX,
  KNOWN_NEW_MOON_MS: () => KNOWN_NEW_MOON_MS,
  MOON_HOUR_OFFSET: () => MOON_HOUR_OFFSET,
  SYNODIC_MONTH: () => SYNODIC_MONTH,
  accentDimHex: () => accentDimHex,
  accentHoverHex: () => accentHoverHex,
  applyCssVars: () => applyCssVars,
  buildArcs: () => buildArcs,
  buildCssVars: () => buildCssVars,
  clamp: () => clamp,
  createLightHueTicker: () => createLightHueTicker,
  dayOfYear: () => dayOfYear,
  dayPhase: () => dayPhase,
  formatHourClock: () => formatHourClock,
  formatZonedDateTime: () => formatZonedDateTime,
  lerp: () => lerp,
  lightAt: () => lightAt,
  lightHueCssVars: () => lightHueCssVars,
  localHour: () => localHour,
  localHourInTimeZone: () => localHourInTimeZone,
  moonAgeDays: () => moonAgeDays,
  moonDeclination: () => moonDeclination,
  moonEffHour: () => moonEffHour,
  moonPhase: () => moonPhase,
  offsetHoursInTimeZone: () => offsetHoursInTimeZone,
  phaseLabel: () => phaseLabel,
  rgbCss: () => rgbCss,
  rgbToHex: () => rgbToHex,
  sampleLightHue: () => sampleLightHue,
  seasonFactor: () => seasonFactor,
  seasonShape: () => seasonShape,
  solarAltitude: () => solarAltitude,
  solarDayEvents: () => solarDayEvents,
  solarDeclination: () => solarDeclination,
  sunDiscRadius: () => sunDiscRadius,
  sunMarkerDiameter: () => sunMarkerDiameter,
  wrapHour: () => wrapHour,
  zonedParts: () => zonedParts
});
module.exports = __toCommonJS(index_exports);

// src/moon.ts
var SYNODIC_MONTH = 29.530588853;
var KNOWN_NEW_MOON_MS = Date.UTC(2e3, 0, 6, 18, 14, 0);
var DRACONIC_APPROX = 27.32;
var MOON_HOUR_OFFSET = 6;
function moonAgeDays(at) {
  const raw = (at.getTime() - KNOWN_NEW_MOON_MS) / 864e5 % SYNODIC_MONTH;
  return raw < 0 ? raw + SYNODIC_MONTH : raw;
}
function moonPhase(ageDays) {
  return ageDays / SYNODIC_MONTH;
}
function moonDeclination(ageDays) {
  return 28.5 * Math.sin(2 * Math.PI * ageDays / DRACONIC_APPROX);
}
function moonEffHour(hour) {
  return (hour - MOON_HOUR_OFFSET + 24) % 24;
}

// src/math.ts
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
function toRad(deg) {
  return deg * Math.PI / 180;
}
function toDeg(rad) {
  return rad * 180 / Math.PI;
}
function lerpRgb(a, b, t) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t))
  ];
}
function rgbToHex(rgb) {
  const toHex = (v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, "0");
  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`;
}
function rgbCss(rgb) {
  return `${rgb[0]},${rgb[1]},${rgb[2]}`;
}
function accentHoverHex(rgb) {
  return rgbToHex([
    Math.min(255, rgb[0] + 20),
    Math.min(255, rgb[1] + 20),
    Math.min(255, rgb[2] + 20)
  ]);
}
function accentDimHex(rgb) {
  return rgbToHex([rgb[0] * 0.7, rgb[1] * 0.7, rgb[2] * 0.7]);
}
function localHour(at) {
  return at.getHours() + at.getMinutes() / 60 + at.getSeconds() / 3600;
}
function dayOfYear(at) {
  const start = new Date(at.getFullYear(), 0, 0);
  return Math.floor((at.getTime() - start.getTime()) / 864e5);
}
function wrapHour(h) {
  const x = h % 24;
  return x < 0 ? x + 24 : x;
}

// src/solar.ts
var DEFAULT_LATITUDE = 55.75;
function solarDeclination(at, dayOfYearOverride) {
  const doy = dayOfYearOverride ?? dayOfYear(at);
  return 23.44 * Math.sin(2 * Math.PI / 365 * (284 + doy));
}
function solarAltitude(hour, declinationDeg, latitudeDeg = DEFAULT_LATITUDE) {
  const H = toRad(15 * (hour - 12));
  const decl = toRad(declinationDeg);
  const lat = toRad(latitudeDeg);
  const alt = Math.asin(
    Math.sin(decl) * Math.sin(lat) + Math.cos(decl) * Math.cos(lat) * Math.cos(H)
  );
  return toDeg(alt);
}

// src/season.ts
function seasonFactor(mode, at, monthOverride) {
  if (mode === "winter") return 0;
  if (mode === "mid") return 0.5;
  if (mode === "summer") return 1;
  const month = monthOverride ?? at.getMonth();
  const seasonDist = Math.min(Math.abs(month - 6), 12 - Math.abs(month - 6));
  return 1 - seasonDist / 6;
}
function seasonShape(factor) {
  return {
    // winter softer/fluffier (bigger blur, lower alpha), summer punchier
    blurMul: 1.6 - factor * 0.8,
    alphaMul: 0.55 + factor * 0.55,
    ringMul: 0.6 + factor * 0.5
  };
}
function sunDiscRadius(seasonFactorValue) {
  return 7.5 + seasonFactorValue * 5;
}
function sunMarkerDiameter(seasonFactorValue) {
  return (11 + seasonFactorValue * 6) * 2;
}

// src/arcs.ts
var ARC_WIDTH = 300;
var MOON_DIAMETER = 20;
function buildArcs(input) {
  const height = input.height ?? 286;
  const horizonY = height * 0.34;
  const pxPerDeg = 0.8 * (height / 160);
  const declMoon = moonDeclination(input.moonAgeDays);
  const sunY = (h) => horizonY - solarAltitude(h, input.sunDeclinationDeg, input.latitude) * pxPerDeg;
  const moonY = (h) => horizonY - solarAltitude(h, declMoon, input.latitude) * pxPerDeg;
  const samples = Array.from({ length: 49 }, (_, i) => i / 2);
  const sunPath = "M" + samples.map((h) => `${(h / 24 * ARC_WIDTH).toFixed(1)},${sunY(h).toFixed(1)}`).join(" L ");
  const moonPath = "M" + samples.map((h) => `${(h / 24 * ARC_WIDTH).toFixed(1)},${moonY(h - MOON_HOUR_OFFSET).toFixed(1)}`).join(" L ");
  const sunX = input.hour / 24 * ARC_WIDTH;
  const moonX = input.hour / 24 * ARC_WIDTH;
  const mHour = moonEffHour(input.hour);
  const phase = input.moonAgeDays / 29.530588853;
  return {
    viewBox: `0 0 ${ARC_WIDTH} ${height}`,
    width: ARC_WIDTH,
    height,
    horizonY,
    sunPath,
    moonPath,
    sun: {
      x: sunX,
      y: sunY(input.hour),
      diameter: sunMarkerDiameter(input.seasonFactor)
    },
    moon: {
      x: moonX,
      y: moonY(mHour),
      diameter: MOON_DIAMETER,
      fillWidth: MOON_DIAMETER * phase
    }
  };
}

// src/css.ts
var CSS_VAR_KEYS = [
  "--accent-primary",
  "--accent-primary-hover",
  "--accent-primary-dim",
  "--light-hue-glow-rgb",
  "--light-hue-glow-alpha",
  "--light-hue-glow-blur",
  "--light-hue-ring-rgb",
  "--light-hue-ring-alpha",
  "--light-hue-rgb"
];
function buildCssVars(snap) {
  return {
    "--accent-primary": snap.accent.hex,
    "--accent-primary-hover": snap.accentHover,
    "--accent-primary-dim": snap.accentDim,
    "--light-hue-glow-rgb": snap.glow.rgb,
    "--light-hue-glow-alpha": snap.glow.alpha.toFixed(4),
    "--light-hue-glow-blur": `${snap.glow.blur.toFixed(2)}px`,
    "--light-hue-ring-rgb": snap.ring.rgb,
    "--light-hue-ring-alpha": snap.ring.alpha.toFixed(4),
    "--light-hue-rgb": snap.accent.rgbCss
  };
}
function applyCssVars(el, vars) {
  if (!el) return;
  for (const [k, v] of Object.entries(vars)) {
    el.style.setProperty(k, v);
  }
}

// src/phase.ts
var PHASE_LABELS = {
  night: "Night",
  dawn: "Dawn",
  morning: "Morning",
  zenith: "Zenith",
  day: "Day",
  sunset: "Sunset",
  dusk: "Dusk"
};
function dayPhase(hour) {
  if (hour < 5 || hour >= 21) return "night";
  if (hour < 7) return "dawn";
  if (hour < 11) return "morning";
  if (hour < 14) return "zenith";
  if (hour < 17) return "day";
  if (hour < 20) return "sunset";
  return "dusk";
}
function phaseLabel(phase) {
  return PHASE_LABELS[phase];
}

// src/stops.ts
var DAY_STOPS = [
  { h: 0, rgb: [205, 220, 255], a: 0.32, blur: 13, ring: [180, 200, 255], ringA: 0.5 },
  { h: 5, rgb: [170, 175, 225], a: 0.28, blur: 14, ring: [170, 175, 225], ringA: 0.45 },
  { h: 6.5, rgb: [255, 150, 95], a: 0.5, blur: 10, ring: [255, 140, 80], ringA: 0.7 },
  { h: 9, rgb: [255, 195, 110], a: 0.48, blur: 9, ring: [240, 170, 70], ringA: 0.72 },
  { h: 12, rgb: [255, 228, 160], a: 0.58, blur: 6, ring: [240, 190, 90], ringA: 0.85 },
  { h: 15, rgb: [255, 180, 95], a: 0.5, blur: 8, ring: [235, 160, 60], ringA: 0.78 },
  { h: 18, rgb: [255, 110, 70], a: 0.62, blur: 7, ring: [235, 95, 55], ringA: 0.85 },
  { h: 20, rgb: [200, 120, 160], a: 0.4, blur: 11, ring: [190, 120, 170], ringA: 0.55 },
  { h: 24, rgb: [205, 220, 255], a: 0.32, blur: 13, ring: [180, 200, 255], ringA: 0.5 }
];
function lightAt(h, stops = DAY_STOPS) {
  const hour = h < 0 ? 0 : h > 24 ? 24 : h;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i];
    const b = stops[i + 1];
    if (hour >= a.h && hour <= b.h) {
      const t = (hour - a.h) / (b.h - a.h || 1);
      return {
        rgb: lerpRgb(a.rgb, b.rgb, t),
        a: lerp(a.a, b.a, t),
        blur: lerp(a.blur, b.blur, t),
        ring: lerpRgb(a.ring, b.ring, t),
        ringA: lerp(a.ringA, b.ringA, t)
      };
    }
  }
  const first = stops[0];
  return {
    rgb: first.rgb,
    a: first.a,
    blur: first.blur,
    ring: first.ring,
    ringA: first.ringA
  };
}

// src/zoned.ts
function part(parts, type) {
  return parts.find((p) => p.type === type)?.value ?? "0";
}
function zonedParts(at, timeZone) {
  const tz = timeZone?.trim() || void 0;
  let dtf;
  try {
    dtf = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "shortOffset"
    });
  } catch {
    dtf = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "shortOffset"
    });
  }
  const parts = dtf.formatToParts(at);
  const year = Number(part(parts, "year"));
  const month = Number(part(parts, "month")) - 1;
  const day = Number(part(parts, "day"));
  const hour = Number(part(parts, "hour"));
  const minute = Number(part(parts, "minute"));
  const second = Number(part(parts, "second"));
  const offsetRaw = part(parts, "timeZoneName");
  const offsetLabel = offsetRaw ? offsetRaw : "GMT";
  const start = Date.UTC(year, 0, 0);
  const cur = Date.UTC(year, month, day);
  const dayOfYear2 = Math.round((cur - start) / 864e5);
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    fractionalHour: hour + minute / 60 + second / 3600,
    dayOfYear: dayOfYear2,
    offsetLabel,
    timeZone: tz ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}
function localHourInTimeZone(at, timeZone) {
  return zonedParts(at, timeZone).fractionalHour;
}
function offsetHoursInTimeZone(at, timeZone) {
  const label = zonedParts(at, timeZone).offsetLabel;
  const m = /GMT([+-])(\d{1,2})(?::(\d{2}))?/i.exec(label);
  if (!m) return 0;
  const sign = m[1] === "-" ? -1 : 1;
  const h = Number(m[2]);
  const min = m[3] ? Number(m[3]) : 0;
  return sign * (h + min / 60);
}
function formatZonedDateTime(at, timeZone, locale = "en") {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timeZone || void 0,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
      timeZoneName: "shortOffset"
    }).format(at);
  } catch {
    return at.toISOString();
  }
}

// src/sample.ts
var ARC_HEIGHT_DEFAULT = 286;
function resolveLocale(opts) {
  if (opts.locale) return opts.locale;
  if (typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function") {
    try {
      return Intl.DateTimeFormat().resolvedOptions().locale || "en";
    } catch {
    }
  }
  return "en";
}
function buildCaption(at, ageDays, phase, locale, timeZone, offsetLabel) {
  let pct = `${Math.round(phase * 100)}%`;
  try {
    pct = new Intl.NumberFormat(locale, {
      style: "percent",
      maximumFractionDigits: 0
    }).format(phase);
  } catch {
  }
  const dateStr = timeZone ? formatZonedDateTime(at, timeZone, locale) : at.toLocaleDateString(locale);
  const tz = offsetLabel ?? (() => {
    const h = -at.getTimezoneOffset() / 60;
    return h >= 0 ? `UTC+${h}` : `UTC${h}`;
  })();
  const zoneBit = timeZone ? ` \xB7 ${timeZone}` : "";
  return `Moon age: ${ageDays.toFixed(1)} d (${pct} lit) \xB7 ${dateStr} \xB7 ${tz}${zoneBit} \xB7 ${locale}`;
}
function sampleLightHue(opts = {}) {
  const at = opts.at ?? /* @__PURE__ */ new Date();
  const latitude = opts.latitude ?? DEFAULT_LATITUDE;
  const season = opts.season ?? "auto";
  const timeZone = opts.timeZone?.trim() || void 0;
  const zoned = timeZone ? zonedParts(at, timeZone) : null;
  const sFactor = seasonFactor(season, at, zoned?.month);
  const shape = seasonShape(sFactor);
  const hour = opts.hourOverride != null ? wrapHour(opts.hourOverride) : zoned ? zoned.fractionalHour : localHour(at);
  const light = lightAt(hour);
  const glowAlpha = light.a * shape.alphaMul;
  const glowBlur = light.blur * shape.blurMul;
  const ringAlpha = light.ringA * shape.ringMul;
  const accentHex = rgbToHex(light.rgb);
  const accentHover = accentHoverHex(light.rgb);
  const accentDim = accentDimHex(light.rgb);
  const rgbStr = rgbCss(light.rgb);
  const ringStr = rgbCss(light.ring);
  const phase = dayPhase(hour);
  const doy = zoned?.dayOfYear ?? dayOfYear(at);
  const declSun = solarDeclination(at, doy);
  const sunAlt = solarAltitude(hour, declSun, latitude);
  const ageDays = moonAgeDays(at);
  const mPhase = moonPhase(ageDays);
  const declMoon = moonDeclination(ageDays);
  const mHour = moonEffHour(hour);
  const moonAlt = solarAltitude(mHour, declMoon, latitude);
  const arcHeight = opts.arcHeight ?? ARC_HEIGHT_DEFAULT;
  const horizonY = arcHeight * 0.34;
  const pxPerDeg = 0.8 * (arcHeight / 160);
  const sunY = horizonY - sunAlt * pxPerDeg;
  const moonY = horizonY - moonAlt * pxPerDeg;
  const snapBase = {
    accent: {
      hex: accentHex,
      rgb: light.rgb,
      rgbCss: rgbStr
    },
    accentHover,
    accentDim,
    glow: {
      rgb: rgbStr,
      alpha: glowAlpha,
      blur: glowBlur
    },
    ring: {
      rgb: ringStr,
      alpha: ringAlpha
    }
  };
  const locale = resolveLocale(opts);
  const includeArcs = opts.includeArcs === true;
  const offsetLabel = zoned?.offsetLabel;
  const snapshot = {
    hour,
    hourInt: Math.round(hour) % 24,
    seasonFactor: sFactor,
    phase,
    phaseLabel: phaseLabel(phase),
    ...snapBase,
    cssVars: buildCssVars(snapBase),
    sun: {
      altitudeDeg: sunAlt,
      aboveHorizon: sunAlt > 0,
      xNorm: hour / 24,
      y: sunY,
      declinationDeg: declSun,
      discRadius: sunDiscRadius(sFactor)
    },
    moon: {
      altitudeDeg: moonAlt,
      aboveHorizon: moonAlt > 0,
      xNorm: hour / 24,
      y: moonY,
      ageDays,
      phase: mPhase,
      declinationDeg: declMoon
    },
    caption: buildCaption(at, ageDays, mPhase, locale, timeZone, offsetLabel),
    meta: {
      latitude,
      season,
      at,
      dayOfYear: doy,
      ...timeZone ? { timeZone: zoned?.timeZone ?? timeZone, offsetLabel } : {}
    }
  };
  if (includeArcs) {
    snapshot.arcs = buildArcs({
      hour,
      seasonFactor: sFactor,
      sunDeclinationDeg: declSun,
      moonAgeDays: ageDays,
      latitude,
      height: arcHeight
    });
  }
  return snapshot;
}
function lightHueCssVars(opts = {}) {
  return sampleLightHue(opts).cssVars;
}

// src/ticker.ts
function createLightHueTicker(onTick, opts = {}) {
  const { intervalMs = 6e4, ...sampleOpts } = opts;
  const currentOpts = { ...sampleOpts };
  const fire = () => {
    const snap = sampleLightHue(currentOpts);
    onTick(snap);
    return snap;
  };
  fire();
  const id = setInterval(fire, intervalMs);
  return {
    stop: () => clearInterval(id),
    refresh: () => fire()
  };
}

// src/events.ts
function solarDayEvents(declinationDeg, latitudeDeg, stepHours = 0.05) {
  let maxAlt = -Infinity;
  let minAlt = Infinity;
  let noonHour = 12;
  let prevAlt = solarAltitude(0, declinationDeg, latitudeDeg);
  let sunriseHour = null;
  let sunsetHour = null;
  for (let h = stepHours; h <= 24 + 1e-9; h += stepHours) {
    const hour = Math.min(h, 24);
    const alt = solarAltitude(hour, declinationDeg, latitudeDeg);
    if (alt > maxAlt) {
      maxAlt = alt;
      noonHour = hour;
    }
    if (alt < minAlt) minAlt = alt;
    if (sunriseHour == null && prevAlt < 0 && alt >= 0) {
      const t = prevAlt === alt ? 0 : -prevAlt / (alt - prevAlt);
      sunriseHour = hour - stepHours + t * stepHours;
    }
    if (sunsetHour == null && hour > 12 && prevAlt >= 0 && alt < 0) {
      const t = prevAlt === alt ? 0 : prevAlt / (prevAlt - alt);
      sunsetHour = hour - stepHours + t * stepHours;
    }
    prevAlt = alt;
  }
  return {
    sunriseHour,
    sunsetHour,
    noonHour,
    maxAltitudeDeg: maxAlt,
    minAltitudeDeg: minAlt,
    alwaysAbove: minAlt >= 0,
    alwaysBelow: maxAlt < 0
  };
}
function formatHourClock(hour) {
  if (hour == null || Number.isNaN(hour)) return "\u2014";
  const h = (Math.floor(hour) % 24 + 24) % 24;
  const m = Math.round((hour - Math.floor(hour)) * 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CSS_VAR_KEYS,
  DAY_STOPS,
  DEFAULT_LATITUDE,
  DRACONIC_APPROX,
  KNOWN_NEW_MOON_MS,
  MOON_HOUR_OFFSET,
  SYNODIC_MONTH,
  accentDimHex,
  accentHoverHex,
  applyCssVars,
  buildArcs,
  buildCssVars,
  clamp,
  createLightHueTicker,
  dayOfYear,
  dayPhase,
  formatHourClock,
  formatZonedDateTime,
  lerp,
  lightAt,
  lightHueCssVars,
  localHour,
  localHourInTimeZone,
  moonAgeDays,
  moonDeclination,
  moonEffHour,
  moonPhase,
  offsetHoursInTimeZone,
  phaseLabel,
  rgbCss,
  rgbToHex,
  sampleLightHue,
  seasonFactor,
  seasonShape,
  solarAltitude,
  solarDayEvents,
  solarDeclination,
  sunDiscRadius,
  sunMarkerDiameter,
  wrapHour,
  zonedParts
});
