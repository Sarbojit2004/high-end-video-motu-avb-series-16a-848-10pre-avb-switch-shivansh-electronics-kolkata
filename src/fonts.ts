import { staticFile } from "remotion";
import type React from "react";
import { COLORS } from "./theme";

// Self-hosted variable fonts (no network at render → deterministic & portable).
// Ported from the established project type system:
//  - Fraunces → characterful high-contrast editorial serif (display headlines)
//  - Archivo  → clean technical grotesque (labels, specs, contact, numerals)
export const DISPLAY = "Fraunces";
export const LABEL = "Archivo";

export const FONT_FACE_CSS = `
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-normal.woff2")}') format('woff2');
  font-weight: 100 900; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'Fraunces';
  src: url('${staticFile("fonts/fraunces-italic.woff2")}') format('woff2');
  font-weight: 100 900; font-style: italic; font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-normal.woff2")}') format('woff2');
  font-weight: 100 900; font-style: normal; font-display: block;
}
@font-face {
  font-family: 'Archivo';
  src: url('${staticFile("fonts/archivo-italic.woff2")}') format('woff2');
  font-weight: 100 900; font-style: italic; font-display: block;
}
`;

export async function loadFonts(): Promise<void> {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  const probes = [
    "400 32px Fraunces", "500 32px Fraunces", "600 32px Fraunces",
    "700 32px Fraunces", "900 32px Fraunces",
    "400 32px Archivo", "500 32px Archivo", "600 32px Archivo",
    "700 32px Archivo", "800 32px Archivo", "900 32px Archivo",
  ];
  await Promise.all(probes.map((p) => (document as Document).fonts.load(p)));
  await (document as Document).fonts.ready;
}

// ─────────────────────────────────────────────────────────────────────────────
// FIVE-TIER TYPOGRAPHY TOKEN TABLE (locked — Parts 1/2/3 all use these)
//
// Tier 1 Headline        Fraunces  700  118px  -0.025em  mask-up + settle
// Tier 2 Subheadline     Fraunces  500   52px  -0.010em  fade + 18px rise
// Tier 3 Spec numerals   Archivo   800   92px  -0.010em  odometer count-up
// Tier 4 Micro label     Archivo   700   24px   0.240em  wipe from left
// Tier 5 CTA             Archivo   800   44px   0.020em  scale-in 0.96→1
// ─────────────────────────────────────────────────────────────────────────────

export const T1_HEADLINE = 118;
export const T2_SUB = 52;
export const T3_SPEC = 92;
export const T4_MICRO = 24;
export const T5_CTA = 44;

/** Tier 1 — headline. Reserved for product name + defining ecosystem trait. */
export const headline = (
  size = T1_HEADLINE,
  color: string = COLORS.ink,
  weight = 700
): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 0.92,
  letterSpacing: "-0.025em",
  color,
  margin: 0,
});

/** Tier 2 — subheadline. Medium-weight contextual narrative. */
export const sub = (
  size = T2_SUB,
  color: string = COLORS.inkSoft,
  weight = 500
): React.CSSProperties => ({
  fontFamily: DISPLAY,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.18,
  letterSpacing: "-0.01em",
  color,
  margin: 0,
});

/** Tier 3 — hard verified specification numerals. Tabular, technical. */
export const spec = (
  size = T3_SPEC,
  color: string = COLORS.ink,
  weight = 800
): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.0,
  letterSpacing: "-0.01em",
  fontVariantNumeric: "tabular-nums",
  color,
  margin: 0,
});

/** Tier 4 — micro callout / label, attached to physical features. */
export const micro = (
  size = T4_MICRO,
  color: string = COLORS.graphite,
  weight = 700,
  tracking = "0.24em"
): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.1,
  letterSpacing: tracking,
  textTransform: "uppercase",
  color,
  margin: 0,
});

/** Tier 5 — CTA. The final, most critical element. */
export const cta = (
  size = T5_CTA,
  color: string = COLORS.ink,
  weight = 800
): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.15,
  letterSpacing: "0.02em",
  color,
  margin: 0,
});

/** Body/running text (support role, not one of the five tiers). */
export const body = (
  size = 30,
  color: string = COLORS.inkSoft,
  weight = 500
): React.CSSProperties => ({
  fontFamily: LABEL,
  fontWeight: weight,
  fontSize: size,
  lineHeight: 1.34,
  letterSpacing: "0.005em",
  color,
  margin: 0,
});
