import { VIDEO, SPEC } from "./theme";
import { TENPRE, S16A, S848, AVBSW, NET, BADGE, SHARED, type SfxKey } from "./assets";

/**
 * THE SCHEDULE — 898 s / 26,940 frames, mapped to Brief Stage 15's own
 * long-form allocation.
 *
 *   Ch1  0:00–1:30   90 s  The Hook & The Problem
 *   Ch2  1:30–4:00  150 s  The Thesis — One Engine, Three Front-Ends
 *   Ch3  4:00–6:30  150 s  Capture — The 10pre
 *   Ch4  6:30–9:00  150 s  Routing — The 16A
 *   Ch5  9:00–11:30 150 s  Command — The 848
 *   Ch6 11:30–13:30 120 s  The Network — AVB Switch & Milan
 *   Ch7 13:30–14:58  88 s  Synthesis & CTA
 *
 * `images` on every beat is the coverage ledger: scripts/coverage.mjs asserts
 * that the union across all beats is all 120 product images, and that no beat
 * shows an image in a way that crops it out of existence.
 */

export type Brand = "none" | "corner" | "cornerLeft" | "lower" | "beat";

export type Beat = {
  id: string;
  ch: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  sec: number;
  kind:
    | "coldOpen" | "chapterOpen" | "editorial" | "points" | "montage"
    | "macroReveal" | "portSweep" | "hero" | "triptych" | "specGrid"
    | "engineDiagram" | "topology" | "dataFlow" | "badges" | "software"
    | "brandBeat" | "price" | "contact" | "outro" | "counters";
  images: number[];
  /** Primary image for single-image layouts. */
  idx?: number;
  eyebrow?: string;
  heading?: string;
  sub?: string;
  body?: string;
  points?: { title: string; body: string }[];
  specs?: { label: string; value: string }[];
  labels?: string[];
  cols?: number;
  focal?: [number, number];
  macroScale?: number;
  brand: Brand;
  motu?: boolean;
  sfx: SfxKey;
  note?: string;
};

const B = (b: Beat): Beat => b;

// ═══════════════════════════════════════════ Ch1 — The Hook & The Problem (90s)
const CH1: Beat[] = [
  B({
    id: "c1-cold-open", ch: 1, sec: 12, kind: "coldOpen",
    idx: TENPRE.combos4, images: [TENPRE.combos4], focal: [0.3, 0.52], macroScale: 3.4,
    eyebrow: "MOTU AVB Series Ecosystem",
    heading: "One Engine.\nThree Front-Ends.\nOne Network.",
    sub: "16A · 848 · 10pre · AVB Switch",
    brand: "corner", motu: true, sfx: "encoder-detent",
  }),
  B({
    id: "c1-one-room", ch: 1, sec: 10, kind: "editorial",
    idx: SHARED.studioWide, images: [SHARED.studioWide],
    heading: "One room is straightforward.",
    body: "A single interface. A single converter. Every decision lands in the same place.",
    brand: "none", sfx: "panel-air-soft",
  }),
  B({
    id: "c1-second-room", ch: 1, sec: 10, kind: "editorial",
    idx: SHARED.studioConsole, images: [SHARED.studioConsole],
    heading: "Then you add a second room.",
    body: "And the questions start compounding faster than the channel count.",
    brand: "corner", sfx: "panel-air",
  }),
  B({
    id: "c1-converter-roulette", ch: 1, sec: 14, kind: "points",
    idx: S16A.deskLifestyle, images: [S16A.deskLifestyle],
    eyebrow: "The friction",
    heading: "Converter Roulette",
    points: [
      { title: "Different rooms, different sound", body: "A vocal booth tracked on a cheaper second interface inherits different headroom and a different distortion signature." },
      { title: "The difference surfaces at mixdown", body: "Two takes of the same source that will not sit together, discovered far too late." },
    ],
    brand: "none", sfx: "relay-tick",
  }),
  B({
    id: "c1-scaling-wall", ch: 1, sec: 13, kind: "points",
    idx: S16A.laptopLifestyle, images: [S16A.laptopLifestyle],
    eyebrow: "The friction",
    heading: "The Scaling Wall",
    points: [
      { title: "Optical chaining introduces clocking errors", body: "Fragile, and it multiplies with every device you add." },
      { title: "Aggregate device workarounds destabilise the host", body: "Software patches for a hardware-shaped problem." },
      { title: "Proprietary audio-over-IP costs licensing and switches", body: "Infrastructure you cannot buy off the shelf." },
    ],
    brand: "lower", sfx: "relay-tick",
  }),
  B({
    id: "c1-compromise", ch: 1, sec: 12, kind: "montage",
    images: [SHARED.bundleInstruments, SHARED.daw1, SHARED.daw2], cols: 3,
    eyebrow: "The friction",
    heading: "The Compromise Purchase",
    sub: "Enough preamps to track a kit almost always meant surrendering the balanced line I/O for outboard and synths. Buy the unit that half-fits.",
    brand: "none", sfx: "panel-air",
  }),
  B({
    id: "c1-brand-1", ch: 1, sec: 9, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),
  B({
    id: "c1-turn", ch: 1, sec: 10, kind: "editorial",
    idx: NET.topology16A, images: [NET.topology16A],
    heading: "None of that is inevitable.",
    body: "It is a consequence of buying boxes instead of building a system.",
    brand: "corner", sfx: "link-establish",
  }),
];

// ═══════════════════════════════════════════════════ Ch2 — The Thesis (150s)
const CH2: Beat[] = [
  B({
    id: "c2-open", ch: 2, sec: 8, kind: "chapterOpen",
    images: [], eyebrow: "Chapter 01",
    heading: "One Engine.\nThree Front-Ends.",
    sub: "Identical processing. Identical conversion. Identical price. The only variable is the physical geometry the room needs.",
    brand: "none", motu: true, sfx: "rack-seat",
  }),
  B({
    id: "c2-triptych", ch: 2, sec: 16, kind: "triptych",
    images: [S16A.frontElevation, S848.frontElevation, TENPRE.frontElevation],
    labels: ["MOTU 16A", "MOTU 848", "MOTU 10pre"],
    eyebrow: "Peer front-ends — not a value ladder",
    heading: "Three Answers To Room Topography",
    brand: "corner", sfx: "gptp-sync",
  }),
  B({
    id: "c2-engine", ch: 2, sec: 14, kind: "engineDiagram",
    images: [], eyebrow: "The unseen architecture",
    heading: "The Shared Engine",
    sub: "One design, distributed across three chassis.",
    brand: "none", sfx: "avb-ping-hi",
  }),
  B({
    id: "c2-badges", ch: 2, sec: 10, kind: "badges",
    images: [BADGE.ess, BADGE.thunderbolt, BADGE.cuemix],
    labels: ["ESS Sabre32 Ultra DAC", "Thunderbolt 4 / USB4", "64-channel CueMix Pro"],
    heading: "Identical, Across All Three",
    brand: "lower", sfx: "counter-tick",
  }),
  B({
    id: "c2-specs", ch: 2, sec: 13, kind: "specGrid",
    idx: SHARED.discovery, images: [SHARED.discovery],
    eyebrow: "Verified shared specification",
    heading: "The Same Engine In Every Chassis",
    specs: [
      { label: "Conversion", value: SPEC.shared.dac },
      { label: "Internal DSP", value: SPEC.shared.dsp },
      { label: "Mixer", value: SPEC.shared.mixer },
      { label: "Sample rates", value: SPEC.shared.rates },
    ],
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "c2-rtl", ch: 2, sec: 12, kind: "montage",
    images: [TENPRE.rtl, S16A.rtl, S848.rtl], cols: 3,
    labels: ["10pre", "16A", "848"],
    eyebrow: "Round-trip latency",
    heading: "~1.8 ms — The Same Figure, Whichever Box",
    sub: "Measured at 96 kHz on a 32-sample host buffer. The signal path does not care which front-end it entered through.",
    brand: "corner", sfx: "avb-ping-mid",
  }),
  B({
    id: "c2-cuemix", ch: 2, sec: 11, kind: "software",
    idx: SHARED.cuemixMonitor1, images: [SHARED.cuemixMonitor1],
    eyebrow: "CueMix Pro",
    heading: "A Large-Format Console, On The Hardware",
    sub: "64 inputs, 32 buses, and 4-band double-precision EQ, compression, gating and high-pass on every channel — running on the interface, not the host.",
    brand: "lower", sfx: "encoder-detent",
  }),
  B({
    id: "c2-cuemix-2", ch: 2, sec: 12, kind: "montage",
    images: [SHARED.cuemixMonitor2, SHARED.cuemixMonitor3, SHARED.reverb], cols: 3,
    heading: "Zero-Latency Monitoring, Any Buffer Size",
    sub: "Because the DSP sits on the interface, the host buffer stops dictating what the performer hears.",
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "c2-thunderbolt", ch: 2, sec: 11, kind: "montage",
    images: [BADGE.thunderboltTall, SHARED.usbC, SHARED.usbCAlt], cols: 3,
    eyebrow: "Host connectivity",
    heading: "40 Gbps Over One Type-C Cable",
    sub: "Thunderbolt 4 and USB4, backward compatible with USB3 and USB2 — up to 256 channels of host I/O.",
    brand: "corner", sfx: "rj45-snap",
  }),
  B({
    id: "c2-price-parity", ch: 2, sec: 13, kind: "price",
    images: [], eyebrow: "The decision this removes",
    heading: "Identical Engine. Identical Price.",
    sub: "There is no premium model to agonise over. Choose the front-end whose physical connections match the room — nothing about the sound is on the table.",
    brand: "none", sfx: "gptp-sync",
  }),
  B({
    id: "c2-brand-2", ch: 2, sec: 9, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-lo",
  }),
  B({
    id: "c2-network-preview", ch: 2, sec: 11, kind: "montage",
    images: [SHARED.networkOpticalMacro, NET.topologyDaisy], cols: 2,
    eyebrow: "Built into every unit",
    heading: "A Two-Port AVB Switch, In Every Chassis",
    sub: "The first room you add costs nothing in extra networking hardware.",
    brand: "corner", sfx: "link-establish",
  }),
  B({
    id: "c2-transformation", ch: 2, sec: 10, kind: "editorial",
    idx: SHARED.ipadCuemix, images: [SHARED.ipadCuemix],
    heading: "A cue mix built in the control room opens intact on the tracking stage.",
    body: "Same mixer. Same recall. Same maths.",
    brand: "none", sfx: "panel-air-soft",
  }),
];

// ══════════════════════════════════════════ Ch3 — Capture: The 10pre (150s)
const CH3: Beat[] = [
  B({
    id: "c3-open", ch: 3, sec: 8, kind: "chapterOpen",
    images: [], eyebrow: "Chapter 02 · Capture",
    heading: "The MOTU 10pre",
    sub: "The tracking specialist. Ten high-gain preamps in a single 1U chassis.",
    brand: "none", motu: true, sfx: "rack-seat",
  }),
  B({
    id: "c3-hero-reveal", ch: 3, sec: 16, kind: "macroReveal",
    idx: TENPRE.qFrontLeft, images: [TENPRE.qFrontLeft], focal: [0.22, 0.56], macroScale: 3.2,
    eyebrow: "MOTU 10pre",
    heading: "Built To Capture A Room",
    brand: "corner", sfx: "encoder-detent",
  }),
  B({
    id: "c3-inserts", ch: 3, sec: 14, kind: "macroReveal",
    idx: TENPRE.inserts, images: [TENPRE.inserts, TENPRE.qRearLeft], focal: [0.5, 0.5], macroScale: 2.6,
    eyebrow: "Channels 1–2",
    heading: "Dedicated Send / Return Inserts",
    sub: "Patch an outboard chain in before conversion, on the two channels most likely to need it.",
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "c3-preamps", ch: 3, sec: 13, kind: "specGrid",
    idx: TENPRE.combos4, images: [TENPRE.combos4],
    eyebrow: "Verified specification",
    heading: "Ten Preamps. No Compromise Anywhere.",
    specs: [
      { label: "Preamplifiers", value: SPEC.tenpre.preamps },
      { label: "Maximum gain", value: SPEC.tenpre.gain },
      { label: "Equivalent input noise", value: SPEC.tenpre.ein },
      { label: "Distortion", value: SPEC.tenpre.thdn },
    ],
    brand: "lower", sfx: "counter-tick",
  }),
  B({
    id: "c3-rear-sweep", ch: 3, sec: 14, kind: "portSweep",
    idx: TENPRE.rearElevation, images: [TENPRE.rearElevation],
    eyebrow: "Port density",
    heading: "Eight Combo Inputs Across The Rear",
    brand: "none", sfx: "panel-air",
  }),
  B({
    id: "c3-split", ch: 3, sec: 12, kind: "montage",
    images: [TENPRE.rearIO, TENPRE.frontLineArt], cols: 2,
    labels: ["8 on the rear — permanent snake runs", "2 on the front — rapid overdubs"],
    heading: "The Front / Rear Split",
    sub: "The eight you cable once and forget. The two you reach for without walking behind the rack.",
    brand: "corner", sfx: "encoder-detent",
  }),
  B({
    id: "c3-meters", ch: 3, sec: 10, kind: "hero",
    idx: TENPRE.metersWide, images: [TENPRE.metersWide],
    eyebrow: "3.9in 24-bit RGB TFT",
    heading: "Every Channel, Metered On The Panel",
    brand: "lower", sfx: "relay-tick",
  }),
  B({
    id: "c3-hero-2", ch: 3, sec: 12, kind: "montage",
    images: [TENPRE.qFrontRight, TENPRE.qFrontDark], cols: 2,
    heading: "One Rack Unit",
    sub: "Fifty-four simultaneous channels, twenty-six in and twenty-eight out.",
    brand: "none", sfx: "rack-seat",
  }),
  B({
    id: "c3-software", ch: 3, sec: 12, kind: "montage",
    images: [33, 28, 29], cols: 3,
    labels: ["Mic input trim", "Gate & compression", "Parametric EQ"],
    heading: "Per-Channel Processing, On The Interface",
    brand: "corner", sfx: "encoder-turn",
  }),
  B({
    id: "c3-routing", ch: 3, sec: 11, kind: "montage",
    images: [3, 32, 34, 36], cols: 4,
    labels: ["Patchbay", "Device home", "Mixing", "Outputs"],
    heading: "Routing Without A Patchbay Wall",
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "c3-details", ch: 3, sec: 10, kind: "montage",
    images: [TENPRE.meters, TENPRE.lineOut, TENPRE.headphones, TENPRE.monitorGroup], cols: 4,
    labels: ["Metering", "8 × DC-coupled line out", "Dual headphones", "Monitor group"],
    brand: "corner", sfx: "relay-tick",
  }),
  B({
    id: "c3-brand-3", ch: 3, sec: 8, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-hi",
  }),
  B({
    id: "c3-context", ch: 3, sec: 10, kind: "montage",
    images: [TENPRE.connectivity, TENPRE.rearCableFan, TENPRE.ipad, TENPRE.qFrontLeftAlt], cols: 4,
    heading: "In The Room, In The Rack, In Your Hand",
    brand: "none", sfx: "panel-air-soft",
  }),
];

// ═══════════════════════════════════════════ Ch4 — Routing: The 16A (150s)
const CH4: Beat[] = [
  B({
    id: "c4-open", ch: 4, sec: 8, kind: "chapterOpen",
    images: [], eyebrow: "Chapter 03 · Routing",
    heading: "The MOTU 16A",
    sub: "The routing specialist. Sixty-six channels of line-level density, and the patchbay at the centre of a hardware studio.",
    brand: "none", motu: true, sfx: "rack-seat",
  }),
  B({
    id: "c4-hero-reveal", ch: 4, sec: 14, kind: "macroReveal",
    idx: S16A.qFront, images: [S16A.qFront], focal: [0.7, 0.5], macroScale: 3.0,
    eyebrow: "MOTU 16A",
    heading: "The Centre Of The Signal Path",
    brand: "corner", sfx: "encoder-detent",
  }),
  B({
    id: "c4-port-sweep", ch: 4, sec: 15, kind: "portSweep",
    idx: S16A.wideFront, images: [S16A.wideFront],
    eyebrow: "Port density sweep",
    heading: "Sixteen In. Sixteen Out. All Balanced TRS.",
    brand: "none", sfx: "panel-air",
  }),
  B({
    id: "c4-specs", ch: 4, sec: 12, kind: "specGrid",
    idx: S16A.rearElevation, images: [S16A.rearElevation],
    eyebrow: "Verified specification",
    heading: "Sixty-Six Simultaneous Channels",
    specs: [
      { label: "Total I/O", value: SPEC.s16a.io },
      { label: "Line inputs", value: SPEC.s16a.lineIn },
      { label: "Line outputs", value: SPEC.s16a.lineOut },
      { label: "Front panel", value: SPEC.s16a.display },
    ],
    brand: "lower", sfx: "counter-tick",
  }),
  B({
    id: "c4-sweep-2", ch: 4, sec: 13, kind: "portSweep",
    idx: S16A.wideFrontAlt, images: [S16A.wideFrontAlt],
    eyebrow: "Dual 3.9in RGB TFT",
    heading: "Every Bank Metered At Once",
    brand: "none", sfx: "relay-tick",
  }),
  B({
    id: "c4-dc-coupled", ch: 4, sec: 13, kind: "montage",
    images: [S16A.lineOutJacks, SHARED.modularSynth], cols: 2,
    eyebrow: "DC-coupled outputs",
    heading: "Control Voltage, Straight From The DAW",
    sub: "No blocking capacitors on the line outputs — so the 16A routes CV into modular synthesisers as readily as it routes audio.",
    brand: "corner", sfx: "encoder-turn",
  }),
  B({
    id: "c4-optical", ch: 4, sec: 10, kind: "hero",
    idx: S16A.rearOptical, images: [S16A.rearOptical],
    eyebrow: "Optical expansion",
    heading: "16 Channels ADAT · 8 Channels S/MUX",
    brand: "lower", sfx: "encoder-detent",
  }),
  B({
    id: "c4-rear", ch: 4, sec: 11, kind: "montage",
    images: [S16A.networkOptical, S16A.rearFull], cols: 2,
    labels: ["Network & optical", "Word clock, network, optical, power"],
    heading: "Everything Terminates Somewhere Deliberate",
    brand: "none", sfx: "rj45-snap",
  }),
  B({
    id: "c4-hero-2", ch: 4, sec: 11, kind: "montage",
    images: [S16A.qRear, S16A.qRearRight], cols: 2,
    heading: "Thirty-Two In, Thirty-Four Out",
    brand: "corner", sfx: "rack-seat",
  }),
  B({
    id: "c4-patchbay", ch: 4, sec: 11, kind: "montage",
    images: [54, 55], cols: 2,
    heading: "The Patchbay, In Software",
    sub: "Any source to any destination, recalled with the session.",
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "c4-software", ch: 4, sec: 10, kind: "montage",
    images: [44, 46, 50, 52, 53, SHARED.daw3], cols: 3,
    heading: "Input Trim, Sends, Mixing, Outputs, EQ",
    brand: "lower", sfx: "counter-tick",
  }),
  B({
    id: "c4-brand-4", ch: 4, sec: 8, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),
  B({
    id: "c4-context", ch: 4, sec: 14, kind: "montage",
    images: [S16A.wideFrontB, S16A.meters, S16A.rearCableFan, S16A.frontLineArt, S16A.connectivity, 70, 72, S16A.ipad, 75, S16A.qFrontRight, S16A.qFrontDark, SHARED.daw4], cols: 4,
    heading: "The 16A In Context",
    brand: "none", sfx: "panel-air-soft",
  }),
];

// ═══════════════════════════════════════════ Ch5 — Command: The 848 (150s)
const CH5: Beat[] = [
  B({
    id: "c5-open", ch: 5, sec: 8, kind: "chapterOpen",
    images: [], eyebrow: "Chapter 04 · Command",
    heading: "The MOTU 848",
    sub: "The control-room specialist. The monitoring desk folded into the interface.",
    brand: "none", motu: true, sfx: "rack-seat",
  }),
  B({
    id: "c5-hero-reveal", ch: 5, sec: 15, kind: "macroReveal",
    idx: S848.qFront, images: [S848.qFront], focal: [0.28, 0.54], macroScale: 3.1,
    eyebrow: "MOTU 848",
    heading: "Sits In Front Of The Engineer",
    brand: "corner", sfx: "encoder-detent",
  }),
  B({
    id: "c5-control", ch: 5, sec: 14, kind: "macroReveal",
    idx: S848.speakerSelect, images: [S848.speakerSelect, S848.qFrontRight], focal: [0.5, 0.5], macroScale: 2.4,
    eyebrow: "Front panel",
    heading: "A / B / C Speaker Select. Talkback. Mono.",
    sub: "Mix translation checked across three monitor pairs without a separate monitor controller in the chain.",
    brand: "none", sfx: "talkback-engage",
  }),
  B({
    id: "c5-specs", ch: 5, sec: 13, kind: "specGrid",
    idx: S848.combos4, images: [S848.combos4],
    eyebrow: "Verified specification",
    heading: "Four Preamps, Identical To The 10pre's",
    specs: [
      { label: "Total I/O", value: SPEC.s848.io },
      { label: "Preamplifiers", value: SPEC.s848.preamps },
      { label: "Maximum gain", value: SPEC.s848.gain },
      { label: "Equivalent input noise", value: SPEC.s848.ein },
    ],
    brand: "lower", sfx: "counter-tick",
  }),
  B({
    id: "c5-monitor-group", ch: 5, sec: 14, kind: "montage",
    images: [S848.monitorGroup, S848.frontLineArt], cols: 2,
    labels: ["Monitor group", "Front panel layout"],
    heading: "The Monitor Controller You Do Not Have To Buy",
    sub: "Speaker selection, talkback and cue routing live in the same box that converts the audio.",
    brand: "none", sfx: "talkback-engage",
  }),
  B({
    id: "c5-meters", ch: 5, sec: 10, kind: "hero",
    idx: S848.meters, images: [S848.meters],
    eyebrow: "3.9in 24-bit RGB TFT",
    heading: "Inputs, Outputs And Monitor, At A Glance",
    brand: "lower", sfx: "relay-tick",
  }),
  B({
    id: "c5-headphones", ch: 5, sec: 14, kind: "montage",
    images: [S848.headphones, S848.lineOut], cols: 2,
    labels: ["Dual independent headphone outs", "12 × DC-coupled line outputs"],
    heading: "Two Cue Mixes, Genuinely Independent",
    sub: "The performer and the engineer stop negotiating over one headphone send.",
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "c5-rear-sweep", ch: 5, sec: 13, kind: "portSweep",
    idx: S848.rearElevation, images: [S848.rearElevation],
    eyebrow: "Port density sweep",
    heading: "Eight TRS In. Twelve TRS Out.",
    brand: "corner", sfx: "panel-air",
  }),
  B({
    id: "c5-inserts", ch: 5, sec: 13, kind: "montage",
    images: [S848.insertsCombo, S848.rearIO], cols: 2,
    labels: ["Inserts on channels 3–4", "Network, optical and line"],
    heading: "Analogue Outboard, Pre-Conversion",
    brand: "none", sfx: "encoder-detent",
  }),
  B({
    id: "c5-software", ch: 5, sec: 12, kind: "montage",
    images: [98, 19, SHARED.daw5], cols: 3,
    heading: "Control Room Routing, Recalled With The Session",
    brand: "lower", sfx: "counter-tick",
  }),
  B({
    id: "c5-brand-5", ch: 5, sec: 8, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-lo",
  }),
  B({
    id: "c5-context", ch: 5, sec: 16, kind: "montage",
    images: [S848.rearCableFan, S848.metersAlt, S848.connectivity, S848.ipad, S848.qFrontDark, S848.qRear, S848.qRearRight], cols: 4,
    heading: "The 848 In Context",
    brand: "none", sfx: "panel-air-soft",
  }),
];

// ═════════════════════════════════════════════ Ch6 — The Network (120s)
const CH6: Beat[] = [
  B({
    id: "c6-open", ch: 6, sec: 8, kind: "chapterOpen",
    images: [], eyebrow: "Chapter 05 · The Network",
    heading: "The MOTU AVB Switch",
    sub: "Not a fourth interface. The infrastructure that scales the three you already have.",
    brand: "none", motu: true, sfx: "rj45-snap",
  }),
  B({
    id: "c6-topology", ch: 6, sec: 18, kind: "topology",
    images: [],
    eyebrow: "Network scaling",
    heading: "Two Devices Need Nothing. Three Need A Switch.",
    // Carries the Shivansh mark: without it the run from c5-brand-5 (11:06) to
    // c6-switch-reveal (11:56) opens a 42 s gap, over the Section 7 guideline.
    brand: "corner", sfx: "link-establish",
  }),
  B({
    id: "c6-switch-reveal", ch: 6, sec: 14, kind: "dataFlow",
    idx: AVBSW.qPorts, images: [AVBSW.qPorts], focal: [0.62, 0.62], macroScale: 2.8,
    eyebrow: "Six Gigabit AVB ports",
    heading: "Where The Building Plugs In",
    brand: "corner", sfx: "rj45-snap",
  }),
  B({
    id: "c6-specs", ch: 6, sec: 12, kind: "specGrid",
    idx: AVBSW.frontElevation, images: [AVBSW.frontElevation],
    eyebrow: "Verified specification",
    heading: "Standard Cable. Standard Distance.",
    specs: [
      { label: "Network ports", value: SPEC.avbsw.ports },
      { label: "Cabling", value: SPEC.avbsw.cable },
      { label: "Reach per run", value: SPEC.avbsw.reach },
      { label: "Synchronisation", value: SPEC.avbsw.sync },
    ],
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "c6-switch-hero", ch: 6, sec: 11, kind: "macroReveal",
    idx: AVBSW.qWhite, images: [AVBSW.qWhite], focal: [0.5, 0.55], macroScale: 2.5,
    heading: "One Box. The Whole Facility.",
    brand: "lower", sfx: "encoder-detent",
  }),
  B({
    id: "c6-standards", ch: 6, sec: 10, kind: "badges",
    images: [NET.milan, NET.ieeeAvb, NET.clock],
    labels: ["Milan-certified", "IEEE 802.1 AVB", "gPTP nanosecond sync"],
    heading: "An Open Standard, Not A Private One",
    brand: "none", sfx: "gptp-sync",
  }),
  B({
    id: "c6-cable", ch: 6, sec: 9, kind: "hero",
    idx: NET.rj45Cable, images: [NET.rj45Cable],
    eyebrow: "CAT-5e / CAT-6",
    heading: "Hundreds Of Channels Down Ordinary Ethernet",
    sub: "Instead of pulling analogue multicore through the walls of a building.",
    brand: "lower", sfx: "rj45-snap",
  }),
  B({
    id: "c6-scale-render", ch: 6, sec: 12, kind: "hero",
    idx: NET.topologyRender, images: [NET.topologyRender],
    eyebrow: "Star topology",
    heading: "Rooms Become Nodes",
    brand: "none", sfx: "data-stream",
  }),
  B({
    id: "c6-qos", ch: 6, sec: 10, kind: "montage",
    images: [NET.qos, NET.gauge], cols: 2,
    labels: ["Guaranteed quality of service", "Deterministic bandwidth"],
    heading: "Reserved Bandwidth, Not Best Effort",
    sub: "AVB reserves the stream before it carries it — so audio does not compete with everything else on the wire.",
    brand: "corner", sfx: "avb-ping-hi",
  }),
  B({
    id: "c6-brand-6", ch: 6, sec: 8, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),
  B({
    id: "c6-counters", ch: 6, sec: 8, kind: "counters",
    images: [],
    heading: "The Ceiling",
    specs: [
      { label: "AVB devices", value: "150" },
      { label: "AVB switches", value: "37" },
      { label: "Simultaneous streams", value: "512" },
      { label: "Audio channels", value: "4,096" },
    ],
    brand: "none", sfx: "gptp-sync",
  }),
];

// ═══════════════════════════════════════ Ch7 — Synthesis & CTA (88s)
const CH7: Beat[] = [
  B({
    id: "c7-transformation", ch: 7, sec: 11, kind: "editorial",
    images: [], eyebrow: "The transformation",
    heading: "The facility stops being a collection of rooms.",
    body: "It becomes one instrument, with absolute sonic consistency in every one of them — and it grows exactly as the work demands.",
    brand: "corner", sfx: "gptp-sync",
  }),
  B({
    id: "c7-bundled", ch: 7, sec: 10, kind: "montage",
    images: [SHARED.bundleLoopmasters, SHARED.bundleLucid, SHARED.bundleSoundbanks, SHARED.bundleBigFish], cols: 4,
    eyebrow: "Included content",
    heading: "Soundbanks And Loop Content In The Box",
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "c7-recap", ch: 7, sec: 12, kind: "triptych",
    images: [S16A.qFrontRight, S848.qRearRight, TENPRE.qFrontRight],
    labels: ["MOTU 16A — routing", "MOTU 848 — command", "MOTU 10pre — capture"],
    eyebrow: "One engine, three front-ends, one network",
    heading: "Choose The Geometry. Never The Quality.",
    // No MOTU mark here: this beat anchors its heading to the top-left, which
    // is exactly where the mark sits. MOTU carries c7-distributor and c7-outro,
    // 12 s and 40 s later.
    brand: "corner", sfx: "rack-seat",
  }),
  B({
    id: "c7-price", ch: 7, sec: 16, kind: "price",
    images: [], eyebrow: "Market Operating Price, inclusive of GST",
    heading: "Two Categories. Two Prices.",
    sub: "The three interfaces share one price because they share one engine. The Switch is infrastructure, and priced as infrastructure.",
    brand: "none", sfx: "avb-ping-hi",
  }),
  B({
    id: "c7-distributor", ch: 7, sec: 12, kind: "brandBeat",
    images: [], brand: "beat", motu: true, sfx: "gptp-sync",
  }),
  B({
    id: "c7-contact", ch: 7, sec: 12, kind: "contact",
    images: [], heading: "Talk To Us",
    brand: "none", sfx: "link-establish",
  }),
  B({
    id: "c7-outro", ch: 7, sec: 15, kind: "outro",
    images: [], brand: "none", motu: true, sfx: "avb-ping-lo",
  }),
];

export const BEATS: Beat[] = [...CH1, ...CH2, ...CH3, ...CH4, ...CH5, ...CH6, ...CH7];

export const frames = (sec: number): number => Math.round(sec * VIDEO.fps);

/** Cumulative frame offset of every beat. */
export const BEAT_STARTS: number[] = (() => {
  const out: number[] = [];
  let acc = 0;
  for (const b of BEATS) {
    out.push(acc);
    acc += frames(b.sec);
  }
  return out;
})();

export const TOTAL_FRAMES = BEATS.reduce((a, b) => a + frames(b.sec), 0);
export const TOTAL_SECONDS = BEATS.reduce((a, b) => a + b.sec, 0);

// ───────────────────────────────────────────────────────────── chapter model
export const CHAPTERS = [
  { n: 1, name: "The Hook & The Problem", sec: 90 },
  { n: 2, name: "The Thesis", sec: 150 },
  { n: 3, name: "Capture — The 10pre", sec: 150 },
  { n: 4, name: "Routing — The 16A", sec: 150 },
  { n: 5, name: "Command — The 848", sec: 150 },
  { n: 6, name: "The Network", sec: 120 },
  { n: 7, name: "Synthesis & CTA", sec: 88 },
] as const;

/**
 * MUSIC DEPLOYMENT (Section 10a Layer 1) — a deliberate Path A / Path B blend.
 *
 * Mindscape bookends the video and is its sonic signature (Path A's ecosystem
 * unification); each product chapter is scored from its own track's stems so
 * the hardware's character comes through (Path B's thematic variation). Stems
 * are never layered across tracks — different tempi and keys would turn the bed
 * to mush — so each chapter draws only from one track and the seams crossfade.
 *
 * `stems` are staged slugs in public/audio/music/. `gain` is per-stem so the
 * mix can be gated by narrative function rather than riding a finished master.
 */
export type ChapterMusic = {
  ch: number;
  track: string;
  stems: { slug: string; gain: number; from?: number }[];
};

export const MUSIC_PLAN: ChapterMusic[] = [
  // Ch1 — sparse and unresolved while the problem is stated.
  { ch: 1, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.5 },
    { slug: "mindscape-bass", gain: 0.34 },
  ] },
  // Ch2 — the ecosystem theme stated in full.
  { ch: 2, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.46, from: 30 },
    { slug: "mindscape-melody", gain: 0.4, from: 30 },
    { slug: "mindscape-bass", gain: 0.34, from: 30 },
  ] },
  // Ch3 — GIFTED: highest dynamics of the five, suits tracking energy.
  { ch: 3, track: "GIFTED", stems: [
    { slug: "gifted-drums", gain: 0.4 },
    { slug: "gifted-bass", gain: 0.3 },
    { slug: "gifted-instruments", gain: 0.42 },
  ] },
  // Ch4 — DIABLO: dense and synth-forward, suits routing/patchbay.
  { ch: 4, track: "DIABLO", stems: [
    { slug: "diablo-drums", gain: 0.3 },
    { slug: "diablo-bass", gain: 0.26 },
    { slug: "diablo-instruments", gain: 0.42 },
    { slug: "diablo-melody", gain: 0.34 },
  ] },
  // Ch5 — Black & Blue: warmest and most spacious, suits the control room.
  { ch: 5, track: "Black & Blue", stems: [
    { slug: "blackblue-drums", gain: 0.3 },
    { slug: "blackblue-bass", gain: 0.28 },
    { slug: "blackblue-instruments", gain: 0.46 },
  ] },
  // Ch6 — ETERNITY: loudest and most driving of the five. The climax.
  { ch: 6, track: "ETERNITY", stems: [
    { slug: "eternity-drums", gain: 0.32 },
    { slug: "eternity-bass", gain: 0.28 },
    { slug: "eternity-instruments", gain: 0.44 },
    { slug: "eternity-melody", gain: 0.36 },
  ] },
  // Ch7 — home to Mindscape, drums absent, for the close.
  { ch: 7, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.46 },
    { slug: "mindscape-melody", gain: 0.42 },
    { slug: "mindscape-bass", gain: 0.32 },
  ] },
];

/** Frame span of each chapter, derived from the beat list. */
export const CHAPTER_SPANS = CHAPTERS.map((c) => {
  const idxs = BEATS.map((b, i) => ({ b, i })).filter(({ b }) => b.ch === c.n);
  const start = BEAT_STARTS[idxs[0].i];
  const last = idxs[idxs.length - 1];
  return { ch: c.n, name: c.name, start, end: BEAT_STARTS[last.i] + frames(last.b.sec) };
});
