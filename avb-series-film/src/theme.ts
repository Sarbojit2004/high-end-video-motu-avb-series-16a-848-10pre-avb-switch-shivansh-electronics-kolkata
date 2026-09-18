// ─────────────────────────────────────────────────────────────────────────────
// THEME — MOTU AVB Series film system.
//
// Carried over from the M-Series reel by instruction: the type pairing (a brush
// script carrying one key word, a black geometric sans carrying the rest), the
// three-tier caption lockup, the 64%-opaque typographic layer sitting ON the
// picture with a hard drop shadow instead of a scrim, the universal safe box,
// and no branding until the end screen.
//
// What is new here: two canvases (a 9:16 reel and a 16:9 film) share one
// system, and the per-product accent is a four-way set — three interfaces and
// the switch that joins them. The triad is deliberately different from both
// the M-Series reel and the earlier AVB explainer so the three films do not
// look like re-edits of one another.
// ─────────────────────────────────────────────────────────────────────────────

export type Canvas = {
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  /** Text-safe box — imagery ignores it and runs to every edge. */
  safe: { left: number; right: number; top: number; bottom: number };
  /** Type scale multiplier relative to the 9:16 reel. */
  scale: number;
  portrait: boolean;
};

export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);

/** 90.000 s vertical reel, 2160 × 3840. */
export const REEL: Canvas = {
  width: 2160,
  height: 3840,
  fps: FPS,
  durationInFrames: 2700,
  // The intersection of Instagram Reels', YouTube Shorts' and TikTok's
  // overlays on a 9:16 frame — one master, safe on all three.
  safe: { left: 132, right: 268, top: 300, bottom: 720 },
  scale: 1,
  portrait: true,
};

/** 300.000 s landscape film, 3840 × 2160. */
export const FILM: Canvas = {
  width: 3840,
  height: 2160,
  fps: FPS,
  durationInFrames: 9000,
  // YouTube's landscape chrome is only the player bar; a 5% inset on every
  // side plus room at the bottom for the scrub bar and the end-screen elements.
  safe: { left: 200, right: 200, top: 140, bottom: 260 },
  scale: 0.72,
  portrait: false,
};

export const safeW = (c: Canvas) => c.width - c.safe.left - c.safe.right;
export const safeH = (c: Canvas) => c.height - c.safe.top - c.safe.bottom;

/** How opaque the caption lockup is over the picture. 0.64 = 36% transparent. */
export const TYPE_OPACITY = 0.64;

// ── Grounds ──────────────────────────────────────────────────────────────────
export const GROUND = {
  light: "#F2EFE9",
  lightLift: "#FAF8F4",
  lightSink: "#E6E2D9",
  dark: "#08080B",
  darkLift: "#131318",
  darkSink: "#040405",
} as const;

export const INK = {
  onLight: "#16140F",
  onLightSoft: "#4A4740",
  onLightDim: "#A8A399",
  onDark: "#FBFAF7",
  onDarkSoft: "#B9B6AE",
  onDarkDim: "#5E5C57",
} as const;

// ── Per-product accent ───────────────────────────────────────────────────────
// Four products, four hues, each held for its whole segment. Three of the four
// are the same 1U chassis photographed from the same angles, so colour is what
// tells a viewer which unit is on screen.
export type ProductKey = "p16a" | "p848" | "p10pre" | "pswitch" | "shared";

export const ACCENT: Record<
  ProductKey,
  { key: string; glow: string; name: string; short: string; tag: string }
> = {
  // 16A — the matrix: 16 line in, 16 line out, no preamps. Coral: signal, wiring.
  p16a: { key: "#C43A2B", glow: "#FF6A52", name: "MOTU 16A", short: "16A", tag: "16 LINE IN · 16 LINE OUT" },
  // 848 — the command centre. Gold: the desk, the monitor section.
  p848: { key: "#B8801E", glow: "#FFC24A", name: "MOTU 848", short: "848", tag: "4 PREAMPS · TALKBACK · A/B/C" },
  // 10pre — the source. Emerald: microphones, the live room.
  p10pre: { key: "#1B8F62", glow: "#3BE39F", name: "MOTU 10pre", short: "10pre", tag: "10 PREAMPS · 8 REAR + 2 FRONT" },
  // AVB Switch — the network. Blue: the cable itself.
  pswitch: { key: "#2557C9", glow: "#5B9DFF", name: "MOTU AVB Switch", short: "AVB SWITCH", tag: "5 AVB PORTS · 1 CLOCK" },
  // The hook, the platform section and the close belong to no single product.
  shared: { key: "#1E1B16", glow: "#FFF6E9", name: "MOTU AVB Series", short: "AVB SERIES", tag: "16A · 848 · 10pre · AVB SWITCH" },
};

// ── Type ─────────────────────────────────────────────────────────────────────
export const FONT = {
  script: "'ReelScript', 'Brush Script MT', cursive",
  display: "'ReelDisplay', 'Archivo Black', 'Helvetica Neue', Arial, sans-serif",
} as const;

/** Sizes at reel scale (2160 wide). The film multiplies by Canvas.scale. */
export const TYPE = {
  before: { size: 92, track: 5.6 },
  script: { size: 348, track: -2 },
  after: { size: 128, track: 2.2 },
  chapter: { size: 46, track: 6.0 },
  micro: { size: 30, track: 3.0 },
} as const;

// ── Contact — outro only ─────────────────────────────────────────────────────
export const CONTACT = {
  brand: "SHIVANSH ELECTRONICS",
  city: "KOLKATA",
  site: "www.shivanshelectronics.in",
  whatsapp: ["+91 98316 62458", "+91 89818 07755", "+91 91477 00677"],
  role: "Exclusive Distributor of MOTU (Mark of the Unicorn, USA)",
  region: "for East & North East India",
} as const;
