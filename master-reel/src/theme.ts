// Design tokens — MOTU AVB Series ecosystem MASTER REEL (portrait, light ground).
//
// PROVENANCE (Section 0/7): every value in this file is pulled UNCHANGED from
// the approved three-part reel build at `reels/src/theme.ts` on
// `claude/motu-avb-longform-video-mbc8pu` — the same hardware, the same brand,
// the same light-background portrait treatment, already proven correct and
// approved. Nothing here is re-derived, and nothing is taken from the Neumann
// project, which this build does not reference at all.
//
// NOTE ON THE BRANCH NAMED IN THE BRIEF: `claude/motu-avb-three-part-reels-jhgg3y`
// holds an EARLIER, superseded reel build (SAFE 250/1580/90, paper #F2F1EE) —
// the one whose image cropping was the named failure mode. The approved reels
// live in `reels/` on the long-form branch, and that is what this file mirrors.
//
// The ONLY value changed from the source is VIDEO.durationInSeconds: 178 -> 298.

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
  durationInSeconds: 298,
  get durationInFrames() {
    return Math.round(this.fps * this.durationInSeconds); // 8940
  },
} as const;

export const COLORS = {
  // Light ground — every scene, whole runtime, no exceptions.
  //
  // Held in a NEAR-WHITE range (0xEF..0xFD) so the two supplied logos — used
  // exactly as given, opaque, with their own white background, never keyed and
  // never boxed — sit on a page within ~1-4% of their own ground and read as
  // continuous with it rather than as artwork on a plate.
  paper: "#F6F8FA",
  paperLift: "#FDFEFE",
  paperEdge: "#EFF2F6",
  paperWell: "#E7EBF1",

  // Type
  ink: "#0E1116",      // 17.9:1 on paper
  inkSoft: "#20272F",  // 12.6:1
  slate: "#48525F",    // 7.6:1 — Stage 10's "muted slate" subheadline
  slateDim: "#6B7684", // 4.6:1 — micro-labels only, never body

  // Accents
  motuBlue: "#0B5FD0",   // 6.2:1
  motuBlueSoft: "#3E86E8",
  signal: "#00845F",     // 4.8:1 — AVB link-active / TFT meter green
  signalBright: "#00A67E",
  amber: "#B4610A",      // 4.9:1 — animated spec counters
  alert: "#B32218",      // 6.1:1 — problem/tension beats only

  line: "rgba(14,17,22,0.12)",
  lineStrong: "rgba(14,17,22,0.24)",
  shadow: "rgba(14,17,22,0.10)",
} as const;

export const RADII = { card: 26, plate: 18, chip: 999, sm: 12 } as const;

/**
 * CAPTION-SAFE ZONE (Section 2).
 *
 * Text, logos and callouts stay clear of the top 180px and bottom 220px, where
 * platform UI (caption overlay, action rail, handle, progress bar) sits.
 * Background and ambient imagery may extend into those bands.
 *
 * These are the exact values proven in the approved three-part reel build
 * (`reels/src/theme.ts`), used unchanged. Section 2 requires them to be pulled
 * from that build rather than re-derived, and they are.
 */
export const SAFE = {
  top: 180,
  bottom: 220,
  marginX: 64,
  get contentTop() { return this.top; },
  get contentBottom() { return VIDEO.height - this.bottom; }, // 1700
  get contentH() { return VIDEO.height - this.top - this.bottom; }, // 1520
  get contentW() { return VIDEO.width - this.marginX * 2; }, // 952
} as const;

export const TIMING = { transition: 14, in: 12, hold: 8, out: 10 } as const;

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

/** Fixed MOPs — never rounded, never blended, stated in EVERY reel (Fact 2). */
export const PRICE = {
  interface: "Rs. 1,87,900",
  switch: "Rs. 52,990",
  note: "per unit · MOP, incl. GST",
  interfaceLabel: "MOTU 16A / 848 / 10pre",
  switchLabel: "MOTU AVB Switch",
} as const;

/** Verified specs, Brief Stage 8. Only VERIFIED figures reach the screen. */
export const SPEC = {
  shared: {
    dac: "ESS Sabre32 Ultra",
    dsp: "32-bit floating point",
    mixer: "64-channel CueMix Pro",
    host: "Thunderbolt 4 / USB4",
    bandwidth: "40 Gbps",
    hostIO: "256 channels",
    rtl: "~1.8 ms",
    rates: "44.1 – 192 kHz",
    network: "Milan-certified IEEE 802.1 AVB",
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
    display: "3.9in 24-bit RGB TFT",
  },
  s16a: {
    io: "32 in / 34 out",
    channels: "66 channels",
    lineIn: "16 × 1/4in TRS",
    lineOut: "16 × TRS, DC-coupled",
    preamps: "0 — line-level specialist",
    display: "Dual 3.9in RGB TFT",
    optical: "16-ch ADAT / 8-ch S-MUX",
  },
  s848: {
    io: "28 in / 32 out",
    channels: "60 channels",
    preamps: "4 × XLR/TRS combo",
    gain: "+74 dB",
    ein: "-129 dBu EIN",
    line: "8 × TRS in, 12 × TRS out",
    control: "Talkback · A/B/C · dual phones",
    display: "3.9in 24-bit RGB TFT",
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

export const MASTER = {
  id: "MasterReel",
  title: "One Engine. Three Front-Ends. One Network.",
  products: "MOTU 16A · 848 · 10pre · AVB Switch",
  out: "motu-avb-master-reel-ecosystem",
} as const;

/** Utility — hex + alpha to rgba(). */
export function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
