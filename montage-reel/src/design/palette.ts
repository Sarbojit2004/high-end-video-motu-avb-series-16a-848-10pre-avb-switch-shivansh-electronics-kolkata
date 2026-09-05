// ─────────────────────────────────────────────────────────────────────────────
// COLOUR SYSTEM — brief §4. The pool is a swatch library; each act draws its
// own 2–4 colour micro-palette. Every text/background pairing used in the reel
// is declared here and verified ≥ 4.5:1 by scripts/contrast.mjs, including the
// worst case for type over a photograph (scrim over a pure-white region).
// Pure TypeScript — no Remotion imports.
// ─────────────────────────────────────────────────────────────────────────────
export const POOL = {
  deepNavy: "#1C1C28",
  cyan: "#1EC1CB",
  burgundy: "#1A0A0F",
  blushPink: "#F6E6EA",
  sand: "#E5E1DD",
  teal: "#407E8C",
  gold: "#A58D66",
  navy: "#083A4F",
  sandLinen: "#D4AF83",
  softIvory: "#F3ECDE",
  terracotta: "#A9501C",
  rivieraBlue: "#183451",
  dun: "#E8D1BA",
  gamboge: "#EDA335",
  brunswickGreen: "#2A5945",
  celadon: "#9DD0B6",
  white: "#F9F9F9",
  blue: "#004E72",
  orange: "#FF6E42",
  navyBlue: "#092634",
  tangerine: "#EB7D00",
  vanilla: "#EBE3A7",
  drabDarkBrown: "#2E2910",
} as const;
export type PoolColor = (typeof POOL)[keyof typeof POOL];

export interface ActPalette {
  /** flat background(s) — the act cycles through these at major cut points */
  bg: string[];
  /** headline / display type colour (verified against every bg of the act) */
  ink: string;
  /** secondary type colour (subtitles, mood words) */
  ink2: string;
  /** non-text accent: line-work, underline bars, pulse field, flash colour */
  accent: string;
  /** line-work colour (may equal accent) */
  line: string;
  /** flash-cut colour */
  flash: string;
  /** scrim colour placed behind any type that sits over a photograph */
  scrim: string;
  /** type colour used on top of that scrim (always the highest-luminance ink) */
  scrimInk: string;
}

export const ACT_PALETTES: Record<"act0" | "act1" | "act2" | "act3" | "act4" | "act5", ActPalette> = {
  act0: { bg: [POOL.deepNavy], ink: POOL.white, ink2: POOL.cyan, accent: POOL.cyan, line: POOL.cyan, flash: POOL.cyan, scrim: POOL.deepNavy, scrimInk: POOL.white },
  // Cool/warm: Tangerine passes on Navy Blue but not on Riviera Blue (4.2:1),
  // so headlines on the Riviera ground use Gamboge; scripts/contrast.mjs
  // checks both grounds against both inks.
  act1: { bg: [POOL.navyBlue, POOL.rivieraBlue], ink: POOL.gamboge, ink2: POOL.softIvory, accent: POOL.tangerine, line: POOL.tangerine, flash: POOL.tangerine, scrim: POOL.navyBlue, scrimInk: POOL.softIvory },
  // Terracotta on Burgundy is only 3.3:1 — it is a line/accent colour here,
  // never a type colour. Blush Pink carries all type.
  act2: { bg: [POOL.burgundy], ink: POOL.blushPink, ink2: POOL.blushPink, accent: POOL.terracotta, line: POOL.terracotta, flash: POOL.terracotta, scrim: POOL.burgundy, scrimInk: POOL.blushPink },
  // Vanilla passes on the flat green ground (6.2:1) but not on a 94 % scrim over a
  // white photo region, so type over photographs uses White.
  act3: { bg: [POOL.brunswickGreen], ink: POOL.vanilla, ink2: POOL.celadon, accent: POOL.celadon, line: POOL.celadon, flash: POOL.vanilla, scrim: POOL.brunswickGreen, scrimInk: POOL.white },
  // Act IV cycles three grounds; type flips to Deep Navy on the two bright ones.
  act4: { bg: [POOL.blue, POOL.cyan, POOL.orange], ink: POOL.white, ink2: POOL.deepNavy, accent: POOL.cyan, line: POOL.white, flash: POOL.white, scrim: POOL.blue, scrimInk: POOL.white },
  act5: { bg: [POOL.deepNavy], ink: POOL.white, ink2: POOL.cyan, accent: POOL.cyan, line: POOL.cyan, flash: POOL.cyan, scrim: POOL.deepNavy, scrimInk: POOL.white },
};

// ── WCAG relative luminance / contrast ───────────────────────────────────────
const chan = (v: number) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
export const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};
export const luminance = (hex: string): number => { const [r, g, b] = hexToRgb(hex); return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b); };
export const contrast = (a: string, b: string): number => { const la = luminance(a), lb = luminance(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
/** Contrast of `ink` against `scrim` at `alpha` opacity laid over a region of luminance `under` (0 black … 1 white). */
export const scrimContrast = (ink: string, scrim: string, alpha: number, under: number): number => {
  const l = alpha * luminance(scrim) + (1 - alpha) * under;
  const li = luminance(ink);
  return (Math.max(li, l) + 0.05) / (Math.min(li, l) + 0.05);
};
/** Opacity used by every text scrim in the reel (see components/Scrim). */
export const SCRIM_ALPHA = 0.94;

/** Pick the ink for a given ground: the act's ink if it passes 4.5:1, else ink2, else white/deep navy. */
export const inkFor = (p: ActPalette, bg: string): string => {
  for (const c of [p.ink, p.ink2, POOL.white, POOL.deepNavy]) if (contrast(c, bg) >= 4.5) return c;
  return POOL.white;
};
export const rgba = (hex: string, a: number) => { const [r, g, b] = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`; };
