import { SPEC } from "../theme";
import { TENPRE, R1_SHARED } from "../assets";
import type { Beat } from "../beat";
import { frames, starts, totalFrames } from "../beat";

/**
 * REEL 1 — "THE SOURCE" (MOTU 10pre + shared-engine intro)
 * 178 s / 5,340 frames. 22 beats.
 *
 * Per Brief Stage 15's short-form allocation: open on the inception of the
 * signal, establish the "one identical engine" baseline early so the viewer
 * knows the 10pre is not a lesser tier, then spend the bulk on the ten +74 dB
 * preamps and the path into the digital domain, and close by planting the AVB
 * network via the interface's own built-in Ethernet port.
 *
 * Reel cadence, not long-form cadence: first cut lands at 5 s, average beat is
 * 8.1 s, and no beat holds one static composition. Only FOUR images earn a full
 * Macro-to-Full-Reveal (marked `macroReveal`/`portSweep`) — the rest get a
 * faster but still complete, uncropped pass, which is Section 0's stated
 * resolution to the 534 s-vs-898 s runtime squeeze.
 */

const B = (b: Beat): Beat => b;

export const BEATS: Beat[] = [
  B({
    id: "r1-hook", sec: 5, kind: "hook",
    idx: TENPRE.combos4, images: [TENPRE.combos4], focal: [0.28, 0.5], macroScale: 3.6,
    eyebrow: "MOTU AVB Series",
    heading: "Ten Preamps.\nOne Rack Unit.",
    brand: "cornerLogo", sfx: "encoder-detent",
  }),
  B({
    id: "r1-reveal", sec: 8, kind: "macroReveal",
    idx: TENPRE.qFrontLeft, images: [TENPRE.qFrontLeft], focal: [0.22, 0.55], macroScale: 3.1,
    eyebrow: "MOTU 10pre",
    heading: "The Tracking Specialist",
    brand: "none", motu: true, sfx: "rack-seat",
  }),
  B({
    id: "r1-ecosystem", sec: 8, kind: "ecosystemSplit",
    images: [TENPRE.frontElevation],
    labels: ["MOTU 16A", "MOTU 848", "MOTU 10pre"],
    eyebrow: "Peers — not a value ladder",
    heading: "One Identical Engine",
    brand: "cornerLogo", sfx: "gptp-sync",
  }),
  B({
    id: "r1-badges", sec: 7, kind: "badges",
    images: [R1_SHARED.ess, R1_SHARED.thunderbolt],
    labels: ["ESS Sabre32 Ultra DAC", "Thunderbolt 4 / USB4"],
    heading: "Identical In Every Chassis",
    brand: "none", sfx: "avb-ping-hi",
  }),
  B({
    id: "r1-no-compromise", sec: 8, kind: "software",
    idx: R1_SHARED.discovery, images: [R1_SHARED.discovery],
    eyebrow: "Same engine, same price",
    heading: "Choose Geometry,\nNever Quality",
    sub: "The 16A, 848 and 10pre share one 32-bit floating point DSP and one 64-channel CueMix Pro mixer — at one price.",
    brand: "lowerThird", sfx: "counter-tick",
  }),
  B({
    id: "r1-preamps", sec: 9, kind: "specGrid",
    idx: TENPRE.combos4, images: [TENPRE.combos4],
    eyebrow: "Verified specification",
    heading: "Ten High-Gain Preamps",
    specs: [
      { label: "Preamplifiers", value: SPEC.tenpre.preamps },
      { label: "Maximum gain", value: SPEC.tenpre.gain },
    ],
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "r1-sweep", sec: 9, kind: "portSweep",
    idx: TENPRE.rearElevation, images: [TENPRE.rearElevation],
    eyebrow: "Port density",
    heading: "Eight Combo Inputs, Across The Rear",
    brand: "cornerLogo", sfx: "panel-air",
  }),
  B({
    id: "r1-split", sec: 8, kind: "montage",
    images: [TENPRE.rearIO, TENPRE.frontLineArt], cols: 1,
    labels: ["8 rear — permanent snake runs", "2 front — rapid overdubs"],
    heading: "The Front / Rear Split",
    brand: "none", sfx: "encoder-detent-hi",
  }),
  B({
    id: "r1-brand-1", sec: 6, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),
  B({
    id: "r1-noise", sec: 9, kind: "specGrid",
    idx: TENPRE.qFrontDark, images: [TENPRE.qFrontDark],
    eyebrow: "Verified specification",
    heading: "Ultra-Quiet, Not Just Loud",
    specs: [
      { label: "Equivalent input noise", value: SPEC.tenpre.ein },
      { label: "Distortion", value: SPEC.tenpre.thdn },
    ],
    brand: "none", sfx: "relay-tick",
  }),
  B({
    id: "r1-inserts", sec: 8, kind: "macroReveal",
    idx: TENPRE.inserts, images: [TENPRE.inserts, TENPRE.qRearLeft], focal: [0.5, 0.5], macroScale: 2.6,
    eyebrow: "Channels 1–2",
    heading: "Send / Return Inserts",
    sub: "Outboard in the path before conversion.",
    brand: "cornerLogo", sfx: "encoder-detent-lo",
  }),
  B({
    id: "r1-meters", sec: 8, kind: "montage",
    images: [TENPRE.metersWide, TENPRE.meters], cols: 1,
    eyebrow: "3.9in 24-bit RGB TFT",
    heading: "Every Channel, On The Panel",
    brand: "none", sfx: "relay-tick-hi",
  }),
  B({
    id: "r1-cuemix", sec: 9, kind: "software",
    idx: R1_SHARED.cuemixMonitor, images: [R1_SHARED.cuemixMonitor],
    eyebrow: "CueMix Pro",
    heading: "A Console On The Interface",
    sub: "64 inputs, 32 buses. EQ, compression and gating on every channel — running on the hardware, not your computer.",
    brand: "lowerThird", motu: true, sfx: "encoder-turn",
  }),
  B({
    id: "r1-software", sec: 8, kind: "montage",
    images: [TENPRE.cuemixMicIn, TENPRE.cuemixDynamics, TENPRE.cuemixEq, TENPRE.cuemixHome], cols: 2,
    heading: "Per-Channel Processing",
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "r1-brand-2", sec: 7, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-lo",
  }),
  B({
    id: "r1-outputs", sec: 8, kind: "montage",
    images: [TENPRE.lineOut, TENPRE.headphones, TENPRE.monitorGroup], cols: 1,
    labels: ["8 × DC-coupled line out", "Dual headphones", "Monitor group"],
    heading: "Everything You Reach For",
    brand: "none", sfx: "encoder-detent",
  }),
  B({
    id: "r1-network", sec: 9, kind: "dataFlow",
    idx: TENPRE.rearIO, images: [TENPRE.rearIO, R1_SHARED.topologyDaisy], focal: [0.18, 0.5], macroScale: 2.8,
    eyebrow: "Built into every unit",
    heading: "The Network Starts Here",
    sub: "A two-port AVB switch, in the chassis. The first room you add costs nothing extra.",
    brand: "cornerLogo", sfx: "rj45-snap",
  }),
  B({
    id: "r1-context", sec: 8, kind: "montage",
    images: [TENPRE.connectivity, TENPRE.ipad, TENPRE.cuemixPatchbay, TENPRE.rearCableFan,
             TENPRE.cuemixMixing, TENPRE.cuemixOutputs, TENPRE.rtl, R1_SHARED.usbC,
             R1_SHARED.studioWide], cols: 3,
    heading: "In The Rack, In The Room",
    brand: "none", sfx: "data-stream-short",
  }),
  B({
    id: "r1-hero-2", sec: 8, kind: "montage",
    images: [TENPRE.qFrontRight, TENPRE.qFrontLeftAlt], cols: 1,
    eyebrow: "26 in / 28 out",
    heading: "Fifty-Four Channels, 1U",
    brand: "cornerLogo", sfx: "rack-seat",
  }),
  B({
    id: "r1-price", sec: 12, kind: "price",
    images: [], eyebrow: "Market Operating Price, incl. GST",
    heading: "Two Categories.\nTwo Prices.",
    brand: "none", sfx: "avb-ping-top",
  }),
  B({
    id: "r1-cta", sec: 8, kind: "cta",
    images: [], heading: "Talk To Us",
    brand: "none", sfx: "link-establish",
  }),
  B({
    id: "r1-outro", sec: 8, kind: "outro",
    images: [], brand: "none", motu: true, sfx: "gptp-sync",
  }),
];

export { frames };
export const BEAT_STARTS = starts(BEATS);
export const TOTAL_FRAMES = totalFrames(BEATS);
export const TOTAL_SECONDS = BEATS.reduce((a, b) => a + b.sec, 0);

/**
 * MUSIC (Section 10a) — Path B body with a Path A signature.
 *
 * GIFTED scores the body: highest dynamics of the five supplied tracks (0.473),
 * which suits the 10pre's tracking energy. Mindscape opens the hook and returns
 * for the CTA/outro — it is the only supplied track long enough to cover 178 s
 * unlooped and the calmest of the five, and using it at those two moments in
 * ALL THREE reels gives the set one recognisable sonic signature without
 * layering unrelated tempi and keys over each other.
 */
export const MUSIC_PLAN = [
  { from: 0, to: 5, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.5 },
    { slug: "mindscape-melody", gain: 0.42 },
  ] },
  { from: 5, to: 150, track: "GIFTED", stems: [
    { slug: "gifted-drums", gain: 0.42 },
    { slug: "gifted-bass", gain: 0.32 },
    { slug: "gifted-instruments", gain: 0.44 },
  ] },
  { from: 150, to: 178, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.48, from: 40 },
    { slug: "mindscape-melody", gain: 0.44, from: 40 },
    { slug: "mindscape-bass", gain: 0.34, from: 40 },
  ] },
] as const;
