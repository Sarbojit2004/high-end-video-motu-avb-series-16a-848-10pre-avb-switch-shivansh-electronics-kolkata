// ─────────────────────────────────────────────────────────────────────────────
// LOCKED THEME — single source of truth for all three reel parts.
// Parts 2 and 3 import this unchanged; nothing here is redefined per part.
//
// Type system is structurally ported from the established project type system
// (Fraunces display + Archivo technical grotesque, five tiers, same
// choreography rules). Colour values are re-derived from scratch
// for this project's LIGHT background — the source project was dark-on-dark and
// none of its text colours or scrim technique carry over.
// ─────────────────────────────────────────────────────────────────────────────

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 178,
  get durationInFrames() {
    return Math.round(this.fps * this.durationInSeconds); // 5340
  },
} as const;

// ── Light palette ────────────────────────────────────────────────────────────
// Brief direction: a strictly controlled light environment that forces the dark
// brushed-metal MOTU chassis to read with sharp, high-contrast weight, with the
// front-panel RGB TFT displays glowing vividly against the light field.
// Held identical across Parts 1–3.
export const COLORS = {
  // Grounds — warm neutral, never pure white (pure white clips the specular
  // highlights on the chassis chamfers and glares on a phone screen).
  paper: "#F2F1EE",
  paperLift: "#FAFAF8", // raised cards / plates
  paperSink: "#E7E6E1", // recessed wells
  paperEdge: "#D9D7D1", // hairline panel edges
  mist: "#DFE3E7", // cool grey — technical / network zones

  // Ink — dark text on light. Primary is near-black for maximum legibility.
  ink: "#13161A",
  inkSoft: "#363C44",
  graphite: "#5B636D",
  graphiteDim: "#8A9199",

  // Accents (fixed set; each chapter selects from these, none are redefined)
  signal: "#0A5FC4", // AVB / network / data-path blue
  signalBright: "#2C8BF2",
  signalWash: "#E4EEFB",
  amber: "#B8651A", // preamp gain / tracking warmth
  amberBright: "#E08A2B",
  amberWash: "#FBF0E2",
  // Chassis-matched dark used for full-bleed contrast plates + product wells
  chassis: "#1B1E22",
  chassisSoft: "#2A2E34",

  // Utility
  line: "rgba(19,22,26,0.14)",
  lineStrong: "rgba(19,22,26,0.28)",
  shadow: "rgba(19,22,26,0.18)",
} as const;

// Per-chapter accent selection — same palette, different emphasis.
export const CHAPTER = {
  1: { key: COLORS.amber, keyBright: COLORS.amberBright, wash: COLORS.amberWash },
  2: { key: COLORS.signal, keyBright: COLORS.signalBright, wash: COLORS.signalWash },
  3: { key: COLORS.signal, keyBright: COLORS.signalBright, wash: COLORS.signalWash },
} as const;

export const RADII = { card: 34, chip: 999, plate: 26, sm: 14 } as const;

// ── Safe-zone geometry (Section 2a) ──────────────────────────────────────────
// Critical content lives strictly inside SAFE_TOP..SAFE_BOTTOM and inboard of
// MARGIN_X. Top/bottom bands carry ambient content only.
export const SAFE = {
  top: 250,
  bottom: 1580,
  marginX: 90,
  get height() {
    return this.bottom - this.top; // 1330
  },
  get width() {
    return VIDEO.width - this.marginX * 2; // 900
  },
} as const;

// Shared timing (frames @30fps)
export const TIMING = { transition: 22, in: 18, hold: 8, out: 16 } as const;

// ── Brand ────────────────────────────────────────────────────────────────────
export const BRAND = {
  name: "Shivansh Electronics",
  // Exact required designation — used verbatim at least once in the series.
  designation:
    "Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India",
  designationShort: "Authorized Distributor · MOTU (Mark of the Unicorn, USA)",
  region: "East & North East India",
  website: "www.shivanshelectronics.in",
  linktree: "shivanshelectronics.in/linktree-hub",
  instagram: "shivanshelectronics.in/instagram-page",
  facebook: "shivanshelectronics.in/facebook-page",
  linkedin: "shivanshelectronics.in/linkedin-page",
  youtube: "shivanshelectronics.in/youtube-channel",
  whatsapp: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
  address:
    "Raja Electric — Shivansh Electronics, 3, Ramanath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal 700031",
} as const;

// ── Pricing — two distinct points, never blended ─────────────────────────────
export const PRICING = {
  interface: {
    mop: "Rs. 1,87,900",
    note: "per unit · inclusive of GST",
    applies: "MOTU 16A · 848 · 10pre",
  },
  switch: {
    mop: "Rs. 52,990",
    note: "per unit · inclusive of GST",
    applies: "MOTU AVB Switch",
  },
} as const;

// ── Verified specs (MOTU official spec pages) ────────────────────────────────
export const SHARED_ENGINE = {
  dac: "ESS Sabre32 Ultra DAC",
  dsp: "32-bit floating-point DSP",
  mixer: "64-channel CueMix Pro (64 in / 32 buses)",
  connectivity: "Thunderbolt 4 / USB4 · 40 Gbps",
  rtl: "~1.8 ms RTL @ 96 kHz",
  rates: "44.1 – 192 kHz",
  network: "Dual-Gigabit Milan-certified AVB",
} as const;

export const PRODUCTS = {
  tenpre: {
    name: "10pre",
    full: "MOTU 10pre",
    chapter: "THE SOURCE",
    io: "26 in / 28 out",
    channels: "54 channels",
    preamps: "10 × XLR/TRS combo mic inputs",
    gain: "+74 dB gain",
    ein: "-129 dBu EIN",
    thd: "-114 dB THD+N",
    split: "8 rear-panel · 2 front-panel",
    lineOut: "8 × DC-coupled TRS line out",
    phones: "2 independent headphone outs",
    display: "3.9\" TFT display",
    expansion: "Optical Expansion: +10 mic in / +8 line out",
  },
  sixteena: {
    name: "16A",
    full: "MOTU 16A",
    chapter: "THE MATRIX",
    io: "32 in / 34 out",
    channels: "66 channels",
    ins: "16 × balanced 1/4\" TRS in",
    outs: "16 × balanced DC-coupled 1/4\" TRS out",
    preamps: "Zero microphone preamps",
    displays: "Dual 3.9\" TFT displays",
    optical: "2 banks ADAT / S-MUX optical I/O",
  },
  eight48: {
    name: "848",
    full: "MOTU 848",
    chapter: "THE COMMAND CENTER",
    io: "28 in / 32 out",
    channels: "60 channels",
    preamps: "4 × XLR/TRS combo mic inputs",
    gain: "+74 dB gain",
    ein: "-129 dBu EIN",
    thd: "-114 dB THD+N",
    lineIn: "8 × TRS line in + 2 × insert-return",
    lineOut: "12 × DC-coupled TRS line out",
    atmos: "Up to 7.1.4 Dolby Atmos monitoring",
    control: "Talkback · A/B/C speaker select",
    phones: "2 independent headphone outs",
    display: "3.9\" TFT display",
  },
  avbswitch: {
    name: "AVB Switch",
    full: "MOTU AVB Switch",
    chapter: "THE NETWORK",
    ports: "6 × 1-Gigabit AVB Ethernet ports",
    cabling: "CAT-5e / CAT-6 · up to 100 m per run",
    sync: "IEEE 802.1AS (gPTP) nanosecond sync",
    scale: "Up to 150 devices across 37 switches",
    streams: "512 simultaneous streams · 4,096 channels",
  },
} as const;
