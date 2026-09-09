// ─────────────────────────────────────────────────────────────────────────────
// THEME — derived entirely from the supplied reference video, and shared with
// nothing else in this repository.
//
// This reel does NOT inherit the visual system of any prior MOTU AVB
// deliverable in this pipeline. The montage reel's torn-paper collage, the
// master reel's giant bleeding type, the three-part series' Fraunces/Archivo
// light-paper system — none of them are imported here, by instruction. What
// follows is read off the reference video frame by frame.
//
// WHAT THE REFERENCE ACTUALLY DOES (Section 2)
//
//   1. Captions, not headlines. Short spoken phrases in sentence case, revealed
//      roughly in time with the words, with ONE word inside the phrase pulled
//      out in a bold accent colour while the rest stays neutral. Words that have
//      not landed yet sit in a dimmed grey and settle to full weight.
//   2. Two environments, alternating: a warm cream minimal field, and a
//      near-black void with the subject picked out by a single light.
//   3. Objects staged photo-real — real cast shadow, real ground contact,
//      a soft reflection in the dark environment.
//   4. A fine grid-and-dot blueprint patch behind the subject, not full bleed.
//   5. A restrained particle drift near the hero object.
//   6. Arcing motion paths rather than everything travelling in straight lines.
//   7. A small technical-graphic accent (a barcode in the reference) used as an
//      authenticity marker.
//
// WHAT IS DELIBERATELY NOT CARRIED OVER: its emoji, its curved grey ribbon
// device, its meme register, and its subject matter. Those belong to a piece of
// social commentary and would undercut a technical B2B explainer.
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEO = {
  width: 2160,
  height: 3840,
  fps: 30,
  durationInFrames: 5400, // 180.000 s
} as const;

export const sec = (s: number) => Math.round(s * VIDEO.fps);

// ── Grounds ──────────────────────────────────────────────────────────────────
// The reference's cream is warm and slightly dirty — never pure white, which
// would glare on a phone and blow out the chrome on the MOTU chassis. Its black
// is not pure either; it carries a faint warm lift so the void reads as a room.
export const GROUND = {
  light: "#F2EFE9",
  lightLift: "#FAF8F4",
  lightSink: "#E6E2D9",
  lightLine: "rgba(24,22,20,0.13)",
  lightDot: "rgba(24,22,20,0.26)",

  dark: "#0A0A0C",
  darkLift: "#141418",
  darkSink: "#050506",
  darkLine: "rgba(255,255,255,0.10)",
  darkDot: "rgba(255,255,255,0.22)",
} as const;

// ── Ink ──────────────────────────────────────────────────────────────────────
export const INK = {
  onLight: "#16140F",
  onLightSoft: "#4A4740",
  onLightDim: "#A8A399", // words not yet spoken
  onDark: "#FBFAF7",
  onDarkSoft: "#B9B6AE",
  onDarkDim: "#5E5C57",
} as const;

// ── Per-product accent ───────────────────────────────────────────────────────
// The reference carries exactly one accent (a hot red) and uses it for the
// emphasised word in every caption. This reel needs four, because the brief's
// hardest visual problem is that three of the products are the same 1U chassis
// photographed from the same angles — a viewer landing on a random frame must
// be able to tell which one they are looking at.
//
// So: one hue per product, held for that product's entire segment across
// captions, the chapter rule, the label chip, the grid tint and the particles.
// Each has a `key` for the cream ground and a brighter `glow` for the black —
// exactly as the reference's red is darker on cream and luminous on black.
//
// The four are equally spaced around the wheel and matched for perceived
// weight, so they read as one designed system rather than four random colours.
export type ProductKey = "p16a" | "p848" | "p10pre" | "pswitch" | "shared";

export const ACCENT: Record<
  ProductKey,
  { key: string; glow: string; wash: string; name: string; short: string }
> = {
  // 16A — line level, no preamps. A cool signal red: analogue, precise.
  p16a: { key: "#C8322E", glow: "#FF5A4E", wash: "rgba(200,50,46,0.028)", name: "MOTU 16A", short: "16A" },
  // 848 — preamps and monitoring. Amber: gain, warmth, the control room.
  p848: { key: "#B9761A", glow: "#FFA630", wash: "rgba(185,118,26,0.028)", name: "MOTU 848", short: "848" },
  // 10pre — the highest mic count. Green: live inputs, stage, signal present.
  p10pre: { key: "#187A56", glow: "#2FD69A", wash: "rgba(24,122,86,0.028)", name: "MOTU 10pre", short: "10pre" },
  // Switch — the network. Blue: data, clock, infrastructure.
  pswitch: { key: "#1F5FD0", glow: "#5A9BFF", wash: "rgba(31,95,208,0.028)", name: "MOTU AVB Switch", short: "AVB SWITCH" },
  // Shared platform assets and the ecosystem-level segments.
  shared: { key: "#3A3733", glow: "#D8D4CC", wash: "rgba(58,55,51,0.02)", name: "MOTU AVB", short: "AVB" },
};

// ── Type ─────────────────────────────────────────────────────────────────────
// The reference sets its captions in a geometric humanist sans — round bowls,
// tall x-height, heavy bold. Bricolage Grotesque is the closest face already
// self-hosted in this repository and carries the 300/500/700/800 range the
// caption treatment needs (dim / neutral / emphasis / hero).
export const FONT = {
  ui: "'Bricolage Grotesque', 'Helvetica Neue', Arial, sans-serif",
  mono: "'Bricolage Grotesque', ui-monospace, monospace",
} as const;

export const TYPE = {
  caption: { size: 132, line: 1.14, weight: 500, track: -1.6 },
  captionEmph: { weight: 800, track: -2.4 },
  hero: { size: 210, line: 1.0, weight: 800, track: -5 },
  chapter: { size: 40, weight: 700, track: 5.5 },
  label: { size: 34, weight: 700, track: 3.4 },
  micro: { size: 27, weight: 500, track: 2.6 },
  spec: { size: 96, weight: 800, track: -2 },
} as const;

// ── Safe zone ────────────────────────────────────────────────────────────────
// 9:16 on a phone: the top band is eaten by the status bar and the platform's
// own chrome, the bottom by the caption/CTA overlay. Nothing that must be read
// goes outside these.
export const SAFE = {
  x: 156,
  top: 470,
  bottom: 560,
  get w() {
    return VIDEO.width - this.x * 2;
  },
} as const;

// ── Contact (brief Section 7) ────────────────────────────────────────────────
export const CONTACT = {
  brand: "SHIVANSH ELECTRONICS",
  city: "KOLKATA",
  site: "www.shivanshelectronics.in",
  whatsapp: ["+91 98316 62458", "+91 89818 07755", "+91 91477 00677"],
  role: "Authorised MOTU Distributor — East & North East India",
} as const;

export const LOGO = {
  shivansh: "logos/shivansh.png",
  motu: "logos/motu.png",
} as const;
