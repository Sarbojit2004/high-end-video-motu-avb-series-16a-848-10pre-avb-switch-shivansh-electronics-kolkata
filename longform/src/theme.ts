// Design tokens for the MOTU AVB Series ecosystem long-form video.
//
// PALETTE PROVENANCE (Section 2 / 8a): the Neumann TLM 107 long-form reference
// this project is modelled on is a DARK-ground video (its `COLORS.ink` is
// #0C0D10 with #F4EFE6 ivory type). Its structure, type system and audio
// pipeline port directly; its colour values cannot. Every value below is
// re-derived for this project's light ground, verified against MOTU's actual
// dark brushed-metal chassis and the RGB TFT display greens, per Brief
// Stage 12. `motuBlue` is darkened from the supplied logo's #5898F8, which
// fails contrast on a light ground.

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInSeconds: 898,
  get durationInFrames() {
    return Math.round(this.fps * this.durationInSeconds); // 26940
  },
} as const;

export const COLORS = {
  // Light ground — every scene, whole runtime, no exceptions.
  //
  // Deliberately held in a NEAR-WHITE range (0xEF..0xFD). The two supplied
  // logos are used exactly as given: opaque, with their own white background,
  // placed directly on the video with no box or card. Keeping the page within
  // ~4% of white means that white ground is imperceptible against it, so the
  // logos read as sitting on the video rather than on a plate.
  paper: "#F6F8FA",
  paperLift: "#FDFEFE",
  paperEdge: "#EFF2F6",
  paperWell: "#E7EBF1",

  // Type
  ink: "#0E1116", // 17.9:1 on paper
  inkSoft: "#20272F", // 12.6:1
  slate: "#48525F", // 7.6:1 — Stage 10's "muted slate" subheadline
  slateDim: "#6B7684", // 4.6:1 — micro-labels only, never body

  // Accents
  motuBlue: "#0B5FD0", // 6.2:1
  motuBlueSoft: "#3E86E8", // decorative strokes only
  signal: "#00845F", // 4.8:1 — AVB link-active / TFT meter green
  signalBright: "#00A67E", // glow/decorative
  amber: "#B4610A", // 4.9:1 — animated spec counters
  alert: "#B32218", // 6.1:1 — the "problem" chapter only

  // Structure
  line: "rgba(14,17,22,0.12)",
  lineStrong: "rgba(14,17,22,0.24)",
  shadow: "rgba(14,17,22,0.10)",
} as const;

export const RADII = { card: 28, plate: 20, chip: 999, sm: 12 } as const;

/**
 * Section 2: no reserved caption band and no top/bottom exclusion zone — the
 * full frame is usable. `marginX` is the 40–60px inboard padding required so
 * critical text survives downstream cropping or re-encode. Ambient/background
 * imagery may still bleed to the true edge.
 */
export const SPACE = {
  width: VIDEO.width,
  height: VIDEO.height,
  marginX: 56,
  marginY: 52,
  get contentW() {
    return this.width - this.marginX * 2; // 1808
  },
} as const;

export const TIMING = { transition: 24, in: 16, hold: 10, out: 14 } as const;

/** Confirmed distributor relationship + contact set (Section 7 / 11). */
export const BRAND = {
  name: "Shivansh Electronics",
  role: "Authorized Distributor of MOTU (Mark of the Unicorn, USA) Interfaces",
  region: "East and North East India",
  website: "www.shivanshelectronics.in",
  instagram: "instagram.com/@shivanshelectronics.in",
  facebook: "facebook.com/@shivanshelectronics.in",
  linkedin: "linkedin.com/@shivanshelectronics-in",
  youtube: "youtube.com/@shivanshelectronics-in",
  whatsapp: ["+91 98316 62458", "+91 91477 00677", "+91 89818 07755"],
  address:
    "3, Rama Nath Das Road, Dhakuria, Tanu Pukur, Garfa, Kolkata, West Bengal 700031",
} as const;

/** Fixed MOPs — never rounded, never blended into one range (Fact 2). */
export const PRICE = {
  interface: "Rs. 1,87,900",
  switch: "Rs. 52,990",
  note: "per unit · MOP, inclusive of GST",
  interfaceLabel: "MOTU 16A / 848 / 10pre",
  switchLabel: "MOTU AVB Switch",
} as const;

/** Verified specs, Brief Stage 8. Only VERIFIED figures appear on screen. */
export const SPEC = {
  shared: {
    dac: "ESS Sabre32 Ultra",
    dsp: "32-bit floating point",
    mixer: "64-channel CueMix Pro",
    host: "Thunderbolt 4 / USB4",
    bandwidth: "40 Gbps",
    hostIO: "256 channels (128 in / 128 out)",
    rtl: "~1.8 ms",
    rtlNote: "round-trip @ 96 kHz, 32-sample buffer",
    rates: "44.1 – 192 kHz",
    network: "Milan-certified IEEE 802.1 AVB",
  },
  s16a: {
    io: "32 in / 34 out",
    channels: "66 channels",
    lineIn: "16 × 1/4in TRS",
    lineOut: "16 × 1/4in TRS, DC-coupled",
    preamps: "0 — line-level specialist",
    display: "Dual 3.9in 24-bit RGB TFT",
    optical: "16-ch ADAT / 8-ch S-MUX",
  },
  s848: {
    io: "28 in / 32 out",
    channels: "60 channels",
    preamps: "4 × XLR/TRS combo",
    gain: "+74 dB",
    ein: "-129 dBu EIN",
    thdn: "-114 dB THD+N",
    line: "8 × TRS in, 12 × TRS DC-coupled out",
    inserts: "2 × TRS inserts (ch 3–4)",
    display: "Single 3.9in 24-bit RGB TFT",
    control: "Talkback · A/B/C speaker select · dual headphones",
  },
  tenpre: {
    io: "26 in / 28 out",
    channels: "54 channels",
    preamps: "10 × XLR/TRS combo",
    gain: "+74 dB",
    ein: "-129 dBu EIN",
    thdn: "-114 dB THD+N",
    split: "8 rear · 2 front",
    inserts: "2 × TRS inserts (ch 1–2)",
    lineOut: "8 × TRS, DC-coupled",
    display: "Single 3.9in 24-bit RGB TFT",
  },
  avbsw: {
    ports: "6 × 1-Gigabit AVB",
    cable: "CAT-5e / CAT-6",
    reach: "100 m per run",
    scale: "150 devices · 37 switches",
    streams: "512 streams · 4,096 channels",
    sync: "IEEE 802.1AS (gPTP)",
  },
} as const;

export type ProductKey = "tenpre" | "s16a" | "s848" | "avbsw";

export const PRODUCT_NAME: Record<ProductKey, string> = {
  tenpre: "MOTU 10pre",
  s16a: "MOTU 16A",
  s848: "MOTU 848",
  avbsw: "MOTU AVB Switch",
};

export const PRODUCT_ROLE: Record<ProductKey, string> = {
  tenpre: "The Tracking Specialist",
  s16a: "The Routing Specialist",
  s848: "The Control-Room Specialist",
  avbsw: "The Network Infrastructure",
};

/** Utility — hex + alpha to rgba(). */
export function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
