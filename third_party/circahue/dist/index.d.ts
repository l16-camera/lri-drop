/** Mean synodic month (days). */
declare const SYNODIC_MONTH = 29.530588853;
/** Known new moon epoch used by the design (UTC 2000-01-06 18:14). */
declare const KNOWN_NEW_MOON_MS: number;
/** Draconic-ish period used for declination approximation. */
declare const DRACONIC_APPROX = 27.32;
/** Moon hour offset on the day chart (design: −6 h). */
declare const MOON_HOUR_OFFSET = 6;
/**
 * Moon age in synodic days [0, SYNODIC_MONTH).
 * Works across the ~100yr range the design claimed.
 */
declare function moonAgeDays(at: Date): number;
/** Illumination / fill fraction [0, 1). */
declare function moonPhase(ageDays: number): number;
/**
 * Approximate lunar declination (degrees).
 * Real lunar altitude needs full ephemeris; this tracks phase-linked dates.
 */
declare function moonDeclination(ageDays: number): number;
/** Effective hour for moon altitude on the chart (shift by MOON_HOUR_OFFSET). */
declare function moonEffHour(hour: number): number;

/** Season intensity mode. `auto` derives from day-of-year. */
type SeasonMode = "auto" | "winter" | "mid" | "summer";
/**
 * Day-phase label derived from local solar-hour (not civil twilight).
 * Matches the design prototype phase bands.
 */
type DayPhase = "night" | "dawn" | "morning" | "zenith" | "day" | "sunset" | "dusk";
type Rgb = readonly [number, number, number];
interface LightHueOptions {
    /** Instant to sample. Default: `new Date()`. */
    at?: Date;
    /**
     * Override local clock hour in [0, 24). When set, date is still used for
     * season / declination / moon age, but the palette and markers use this hour.
     */
    hourOverride?: number;
    /**
     * IANA timezone id (e.g. `"Europe/Moscow"`, `"America/New_York"`).
     * When set, wall-clock hour, calendar day-of-year and season `auto` are
     * taken from this zone instead of the runtime local zone.
     * Moon age stays absolute (UTC epoch). Does not replace `latitude`.
     */
    timeZone?: string;
    /**
     * Observer latitude in degrees (positive north).
     * Default `55.75` (Moscow) — same default as the Luminat design prototype.
     */
    latitude?: number;
    /**
     * Observer longitude in degrees (positive east).
     * Reserved for solar-noon / equation-of-time refinements; currently unused.
     */
    longitude?: number;
    /** Season shaping of glow intensity / sun disc size. Default `auto`. */
    season?: SeasonMode;
    /**
     * When true, include SVG arc geometry for sun/moon day charts.
     * Default false (cheaper for accent-only consumers).
     */
    includeArcs?: boolean;
    /**
     * Arc chart height in viewBox units (width is fixed at 300).
     * Default 286 — matches the design dial size.
     */
    arcHeight?: number;
    /** BCP 47 locale for human captions. Default runtime locale / `en`. */
    locale?: string;
}
interface LightStop {
    h: number;
    rgb: Rgb;
    a: number;
    blur: number;
    ring: Rgb;
    ringA: number;
}
interface InterpolatedLight {
    rgb: Rgb;
    a: number;
    blur: number;
    ring: Rgb;
    ringA: number;
}
interface GlowState {
    /** Comma-joined "r,g,b" for rgba() templates. */
    rgb: string;
    alpha: number;
    blur: number;
}
interface RingState {
    rgb: string;
    alpha: number;
}
interface AccentState {
    hex: string;
    rgb: Rgb;
    /** rgb as "r,g,b" string. */
    rgbCss: string;
}
interface BodyState {
    altitudeDeg: number;
    aboveHorizon: boolean;
    /** Normalized x position along the day chart [0, 1]. */
    xNorm: number;
    /** Absolute y in arc viewBox units (when arcs computed). */
    y: number;
}
interface MoonState extends BodyState {
    /** Age in synodic days since new moon [0, ~29.53). */
    ageDays: number;
    /** Illumination / fill fraction [0, 1) — age / synodic month. */
    phase: number;
    /** Approximate lunar declination (degrees). */
    declinationDeg: number;
}
interface ArcGeometry {
    viewBox: string;
    width: number;
    height: number;
    horizonY: number;
    sunPath: string;
    moonPath: string;
    sun: {
        x: number;
        y: number;
        diameter: number;
    };
    moon: {
        x: number;
        y: number;
        diameter: number;
        fillWidth: number;
    };
}
interface LightHueSnapshot {
    /** Effective local hour used for palette / markers [0, 24). */
    hour: number;
    /** Rounded hour label 0–23. */
    hourInt: number;
    /** Season intensity [0 winter … 1 summer]. */
    seasonFactor: number;
    phase: DayPhase;
    /** Human phase label (English keys; consumer may i18n). */
    phaseLabel: string;
    accent: AccentState;
    accentHover: string;
    accentDim: string;
    glow: GlowState;
    ring: RingState;
    sun: BodyState & {
        declinationDeg: number;
        discRadius: number;
    };
    moon: MoonState;
    /**
     * Ready-to-apply CSS custom properties for brand accent.
     * Keys include leading `--`.
     */
    cssVars: Record<string, string>;
    /** Present when `includeArcs: true`. */
    arcs?: ArcGeometry;
    /** Short debug/caption string (locale-aware moon age). */
    caption: string;
    /** Options effectively used (resolved defaults). */
    meta: {
        latitude: number;
        season: SeasonMode;
        at: Date;
        dayOfYear: number;
        /** Resolved IANA zone used for wall clock (if any). */
        timeZone?: string;
        /** shortOffset label e.g. GMT+3 */
        offsetLabel?: string;
    };
}
interface LightHueTicker {
    stop: () => void;
    /** Force an immediate re-sample with current options. */
    refresh: () => LightHueSnapshot;
}

/**
 * Sample the living light accent at a given instant / observer position.
 * Pure function — no DOM, no timers.
 */
declare function sampleLightHue(opts?: LightHueOptions): LightHueSnapshot;
/**
 * Convenience: only the CSS custom properties map.
 * Equivalent to `sampleLightHue(opts).cssVars`.
 */
declare function lightHueCssVars(opts?: LightHueOptions): Record<string, string>;

interface TickerOptions extends LightHueOptions {
    /** Poll interval in ms. Default 60_000 (once per minute is enough for hour drift). */
    intervalMs?: number;
}
/**
 * Periodically re-sample light-hue and invoke `onTick`.
 * Browser / Node friendly (uses `setInterval`). Call `stop()` to clear.
 *
 * Does not touch the DOM — apply `snapshot.cssVars` yourself (or use `applyCssVars`).
 */
declare function createLightHueTicker(onTick: (snapshot: LightHueSnapshot) => void, opts?: TickerOptions): LightHueTicker;

/** CSS custom property names written by light-hue. */
declare const CSS_VAR_KEYS: readonly ["--accent-primary", "--accent-primary-hover", "--accent-primary-dim", "--light-hue-glow-rgb", "--light-hue-glow-alpha", "--light-hue-glow-blur", "--light-hue-ring-rgb", "--light-hue-ring-alpha", "--light-hue-rgb"];
type LightHueCssVar = (typeof CSS_VAR_KEYS)[number];
/** Build the cssVars map from a computed snapshot (or partial accent/glow/ring). */
declare function buildCssVars(snap: Pick<LightHueSnapshot, "accent" | "accentHover" | "accentDim" | "glow" | "ring">): Record<string, string>;
/**
 * Apply snapshot CSS vars onto an element (browser only).
 * No-op friendly: pass `null` / undefined to skip.
 */
declare function applyCssVars(el: {
    style: {
        setProperty(name: string, value: string): void;
    };
} | null | undefined, vars: Record<string, string>): void;

/**
 * Time-of-day keyframes from the Luminat MainScreens prototype.
 * Midnight moonlight → pre-dawn → sunrise → morning → zenith → afternoon →
 * sunset → dusk → midnight.
 */
declare const DAY_STOPS: readonly LightStop[];
/** Interpolate palette stop at fractional hour `h` in [0, 24]. */
declare function lightAt(h: number, stops?: readonly LightStop[]): InterpolatedLight;

/**
 * Season intensity factor in [0, 1]:
 * - winter → 0 (softer glow, fluffier blur, smaller sun disc)
 * - summer → 1 (punchier alpha / ring, larger disc)
 * - mid → 0.5
 * - auto → triangle peaking at July (month index 6), trough at January
 *
 * Matches the Luminat design prototype month heuristic.
 *
 * @param monthOverride — 0–11; when set (e.g. from IANA zone wall clock), used instead of `at.getMonth()`.
 */
declare function seasonFactor(mode: SeasonMode, at: Date, monthOverride?: number): number;
/** Season multipliers applied to stop alpha / blur / ring. */
declare function seasonShape(factor: number): {
    blurMul: number;
    alphaMul: number;
    ringMul: number;
};
/** Design “hidden” sun disc radius (half-diameter style number). */
declare function sunDiscRadius(seasonFactorValue: number): number;
/** Chart sun marker diameter in px (design: (11 + factor * 6) * 2). */
declare function sunMarkerDiameter(seasonFactorValue: number): number;

/** Default latitude from the Luminat design prototype (Moscow). */
declare const DEFAULT_LATITUDE = 55.75;
/**
 * Solar declination (degrees) from day-of-year.
 * Same formula as design: `23.44 * sin(2π/365 * (284 + doy))`.
 *
 * @param dayOfYearOverride — when set (e.g. zone wall-clock doy), used instead of local `dayOfYear(at)`.
 */
declare function solarDeclination(at: Date, dayOfYearOverride?: number): number;
/**
 * Solar altitude in degrees for local hour angle at `latitude`.
 * Hour 12 ≈ local solar noon (approximation; no equation of time).
 */
declare function solarAltitude(hour: number, declinationDeg: number, latitudeDeg?: number): number;

/**
 * Day phase from fractional hour — same bands as the design Russian labels
 * (Ночь / Рассвет / Утро / Зенит / День / Закат / Сумерки).
 */
declare function dayPhase(hour: number): DayPhase;
declare function phaseLabel(phase: DayPhase): string;

interface ArcInput {
    hour: number;
    seasonFactor: number;
    sunDeclinationDeg: number;
    moonAgeDays: number;
    latitude: number;
    height?: number;
}
/**
 * Build SVG path geometry for the sun/moon day chart.
 * Coordinate space: width 300 × height (default 286), horizon at 34% height.
 */
declare function buildArcs(input: ArcInput): ArcGeometry;

interface SolarDayEvents {
    /** First hour (0–24) where altitude crosses above 0, or null if always down. */
    sunriseHour: number | null;
    /** First hour after noon where altitude crosses below 0, or null if always up. */
    sunsetHour: number | null;
    /** Hour of maximum altitude (≈ solar noon in this model). */
    noonHour: number;
    maxAltitudeDeg: number;
    minAltitudeDeg: number;
    /** True polar day / night style edge cases at high latitude. */
    alwaysAbove: boolean;
    alwaysBelow: boolean;
}
/**
 * Approximate sunrise / sunset for the circadian model (altitude = 0 crossings).
 * Samples the day at `stepHours` resolution (default 0.05 h ≈ 3 min).
 * Useful for playground “reality check” readouts — not an ephemeris.
 */
declare function solarDayEvents(declinationDeg: number, latitudeDeg: number, stepHours?: number): SolarDayEvents;
declare function formatHourClock(hour: number | null): string;

/**
 * IANA timezone wall-clock helpers (Intl only — no deps).
 * Used so circadian sampling can follow Europe/Moscow, America/New_York, etc.
 */
interface ZonedParts {
    year: number;
    /** 0–11, same as Date#getMonth */
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    /** hour + minute/60 + second/3600 in [0, 24) */
    fractionalHour: number;
    /** 1…366 in the target zone's calendar year */
    dayOfYear: number;
    /** Short offset label from Intl, e.g. "GMT+3" / "GMT-5" */
    offsetLabel: string;
    timeZone: string;
}
/**
 * Decompose an instant into wall-clock components in `timeZone`.
 * Falls back to the runtime local zone if `timeZone` is omitted or invalid.
 */
declare function zonedParts(at: Date, timeZone?: string): ZonedParts;
/** Fractional local hour [0, 24) in the given IANA zone. */
declare function localHourInTimeZone(at: Date, timeZone?: string): number;
/**
 * Approximate numeric UTC offset hours for a zone at instant `at`
 * (e.g. 3 for GMT+3, -5 for GMT-5). Parsed from shortOffset when possible.
 */
declare function offsetHoursInTimeZone(at: Date, timeZone?: string): number;
/** Format wall clock in zone: "2026-07-01 18:30 GMT+3". */
declare function formatZonedDateTime(at: Date, timeZone?: string, locale?: string): string;

declare function lerp(a: number, b: number, t: number): number;
declare function clamp(v: number, lo: number, hi: number): number;
declare function rgbToHex(rgb: Rgb): string;
declare function rgbCss(rgb: Rgb): string;
declare function accentHoverHex(rgb: Rgb): string;
declare function accentDimHex(rgb: Rgb): string;
/** Local civil hour as fractional [0, 24). */
declare function localHour(at: Date): number;
/**
 * Day-of-year 1…366 using local calendar (same construction as the design:
 * `new Date(y, 0, 0)` then floor ms delta / 864e5).
 */
declare function dayOfYear(at: Date): number;
declare function wrapHour(h: number): number;

export { type AccentState, type ArcGeometry, type BodyState, CSS_VAR_KEYS, DAY_STOPS, DEFAULT_LATITUDE, DRACONIC_APPROX, type DayPhase, type GlowState, type InterpolatedLight, KNOWN_NEW_MOON_MS, type LightHueCssVar, type LightHueOptions, type LightHueSnapshot, type LightHueTicker, type LightStop, MOON_HOUR_OFFSET, type MoonState, type Rgb, type RingState, SYNODIC_MONTH, type SeasonMode, type SolarDayEvents, type TickerOptions, type ZonedParts, accentDimHex, accentHoverHex, applyCssVars, buildArcs, buildCssVars, clamp, createLightHueTicker, dayOfYear, dayPhase, formatHourClock, formatZonedDateTime, lerp, lightAt, lightHueCssVars, localHour, localHourInTimeZone, moonAgeDays, moonDeclination, moonEffHour, moonPhase, offsetHoursInTimeZone, phaseLabel, rgbCss, rgbToHex, sampleLightHue, seasonFactor, seasonShape, solarAltitude, solarDayEvents, solarDeclination, sunDiscRadius, sunMarkerDiameter, wrapHour, zonedParts };
