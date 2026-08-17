import { SPEC } from "../theme";
import { S16A, R2_SHARED } from "../assets";
import type { Beat } from "../beat";
import { frames, starts, totalFrames } from "../beat";

/**
 * REEL 2 — "THE MATRIX" (MOTU 16A + software control)
 * 178 s / 5,340 frames. 23 beats.
 *
 * Standalone by construction. A viewer may meet this reel without having seen
 * Reel 1, so the "one identical engine, one identical price" argument is made
 * here in full rather than assumed — it is the reason the 16A having no mic
 * preamps is a geometry choice and not a lower tier, which is this reel's
 * entire thesis.
 *
 * The 16A is the line-level matrix: sixteen balanced ins, sixteen DC-coupled
 * outs, dual RGB displays, and the deepest software story of the three because
 * a patchbay with no front-panel gain knobs is driven from CueMix Pro. So this
 * reel spends its middle third inside the software and its bundled content —
 * the densest image set of the three at 50 images.
 *
 * Reel cadence: first cut at 5 s, average beat 7.7 s, and exactly FOUR images
 * earn a full Macro-to-Full-Reveal / Port Sweep / Data Flow pass (r2-reveal,
 * r2-density, r2-dc-coupled, r2-network). Every other image still gets a
 * complete, uncropped pass — just a faster one. That is Section 0's stated
 * resolution to the 534 s-vs-898 s runtime squeeze, and no image anywhere in
 * the reel is cropped, clipped or trimmed to make it fit.
 */

const B = (b: Beat): Beat => b;

export const BEATS: Beat[] = [
  B({
    id: "r2-hook", sec: 5, kind: "hook",
    idx: S16A.rearFull, images: [S16A.rearFull], focal: [0.34, 0.52], macroScale: 4.2,
    eyebrow: "MOTU AVB Series",
    heading: "Thirty-Two In.\nThirty-Four Out.",
    brand: "cornerLogo", sfx: "encoder-detent-hi",
  }),
  B({
    id: "r2-reveal", sec: 8, kind: "macroReveal",
    idx: S16A.qFront, images: [S16A.qFront], focal: [0.26, 0.5], macroScale: 3.2,
    eyebrow: "MOTU 16A",
    heading: "The Line-Level Matrix",
    brand: "none", motu: true, sfx: "rack-seat",
  }),
  B({
    id: "r2-ecosystem", sec: 8, kind: "ecosystemSplit",
    images: [S16A.frontElevation],
    labels: ["MOTU 16A", "MOTU 848", "MOTU 10pre"],
    eyebrow: "Peers — not a value ladder",
    heading: "One Identical Engine",
    brand: "cornerLogo", sfx: "gptp-sync",
  }),
  B({
    id: "r2-shared-spec", sec: 7, kind: "specGrid",
    idx: S16A.rearElevation, images: [S16A.rearElevation],
    eyebrow: "Identical in every chassis",
    heading: "Same Silicon,\nSame Price",
    specs: [
      { label: "Conversion", value: SPEC.shared.dac },
      { label: "Onboard mixing", value: SPEC.shared.mixer },
    ],
    brand: "none", sfx: "avb-ping-hi",
  }),
  B({
    id: "r2-density", sec: 8, kind: "portSweep",
    idx: S16A.wideFront, images: [S16A.wideFront],
    eyebrow: "Port density",
    heading: "Sixteen Balanced Inputs",
    brand: "cornerLogo", sfx: "panel-air",
  }),
  B({
    id: "r2-io", sec: 7, kind: "specGrid",
    idx: S16A.wideFrontAlt, images: [S16A.wideFrontAlt],
    eyebrow: "Verified specification",
    heading: "Sixty-Six Channels",
    specs: [
      { label: "Total I/O", value: SPEC.s16a.io },
      { label: "Analogue line", value: SPEC.s16a.lineIn },
    ],
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "r2-brand-1", sec: 6, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),
  B({
    id: "r2-display", sec: 8, kind: "montage",
    images: [S16A.meters, S16A.lineOutJacks], cols: 1,
    labels: ["Dual 3.9in RGB TFT", "16 × TRS, DC-coupled out"],
    eyebrow: "Two displays, not one",
    heading: "Every Channel In Front Of You",
    brand: "none", sfx: "relay-tick-hi",
  }),
  B({
    id: "r2-dc-coupled", sec: 8, kind: "macroReveal",
    idx: S16A.rearCableFan, images: [S16A.rearCableFan, R2_SHARED.modularSynth],
    focal: [0.42, 0.5], macroScale: 2.7,
    eyebrow: "DC-coupled outputs",
    heading: "Line Out, Or Control Voltage",
    brand: "cornerLogo", sfx: "encoder-detent-lo",
  }),
  B({
    id: "r2-optical", sec: 8, kind: "montage",
    images: [S16A.rearOptical, S16A.networkOptical], cols: 1,
    labels: ["16-ch ADAT · 8-ch S/MUX", "Expansion without a converter"],
    heading: "Optical Expansion",
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "r2-cuemix", sec: 9, kind: "software",
    idx: S16A.cuemixHome, images: [S16A.cuemixHome],
    eyebrow: "CueMix Pro",
    heading: "The Console\nIs The Software",
    sub: "64 inputs, 32 buses, running on the interface's own 32-bit floating point DSP — not on your computer.",
    brand: "lowerThird", motu: true, sfx: "avb-ping-top",
  }),
  B({
    id: "r2-patchbay", sec: 7, kind: "montage",
    images: [S16A.cuemixPatchbay, S16A.cuemixPatchbayAlt], cols: 1,
    heading: "Any Input, Any Output",
    brand: "none", sfx: "relay-tick",
  }),
  B({
    id: "r2-brand-2", sec: 6, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-lo",
  }),
  B({
    id: "r2-mixing", sec: 8, kind: "montage",
    images: [R2_SHARED.cuemixBadge, S16A.cuemixInputTrim, S16A.cuemixMixSends, S16A.cuemixMixing],
    cols: 2,
    heading: "Trim, Sends, Mixes",
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "r2-processing", sec: 8, kind: "montage",
    images: [S16A.cuemixEq, S16A.cuemixDynamics, S16A.cuemixOutputs, R2_SHARED.cuemixMonitor2],
    cols: 2,
    eyebrow: "On every channel",
    heading: "EQ, Gate, Compressor",
    brand: "cornerLogo", sfx: "encoder-detent",
  }),
  B({
    id: "r2-network", sec: 9, kind: "dataFlow",
    idx: S16A.connectivity, images: [S16A.connectivity, R2_SHARED.topology16A],
    focal: [0.2, 0.52], macroScale: 2.6,
    eyebrow: "Built into every unit",
    heading: "The Rack Becomes A Network",
    sub: "A two-port AVB switch in the chassis. Milan-certified, on the open IEEE 802.1 standard.",
    brand: "cornerLogo", sfx: "rj45-snap",
  }),
  B({
    id: "r2-daw", sec: 8, kind: "montage",
    images: [R2_SHARED.daw1, R2_SHARED.daw2, R2_SHARED.daw3, R2_SHARED.daw4,
             R2_SHARED.daw5, R2_SHARED.cuemixMonitor3], cols: 2,
    eyebrow: "256 channels to the host",
    heading: "Into Your Session",
    brand: "none", sfx: "data-stream",
  }),
  B({
    id: "r2-bundled", sec: 8, kind: "montage",
    images: [R2_SHARED.bundleInstruments, R2_SHARED.bundleLoopmasters, R2_SHARED.bundleLucid,
             R2_SHARED.bundleSoundbanks, R2_SHARED.bundleBigFish, R2_SHARED.reverb], cols: 2,
    heading: "In The Box, From Day One",
    brand: "cornerLogo", sfx: "relay-tick-hi",
  }),
  B({
    id: "r2-context", sec: 8, kind: "montage",
    images: [S16A.deskLifestyle, S16A.laptopLifestyle, S16A.rackLifestyle, S16A.ipad,
             R2_SHARED.ipadCuemix, R2_SHARED.usbC, S16A.frontLineArt, S16A.rtl,
             S16A.wideFrontB], cols: 3,
    heading: "In The Rack, In The Room",
    brand: "none", sfx: "data-stream-short",
  }),
  B({
    id: "r2-hero-2", sec: 8, kind: "montage",
    images: [S16A.qRear, S16A.qRearRight, S16A.qFrontRight, S16A.qFrontDark], cols: 2,
    eyebrow: "32 in / 34 out",
    heading: "One Rack Space",
    brand: "cornerLogo", sfx: "rack-seat",
  }),
  B({
    id: "r2-price", sec: 12, kind: "price",
    images: [], eyebrow: "Market Operating Price, incl. GST",
    heading: "Two Categories.\nTwo Prices.",
    brand: "none", sfx: "avb-ping-top",
  }),
  B({
    id: "r2-cta", sec: 7, kind: "cta",
    images: [], heading: "Talk To Us",
    brand: "none", sfx: "link-establish",
  }),
  B({
    id: "r2-outro", sec: 7, kind: "outro",
    images: [], brand: "none", motu: true, sfx: "gptp-sync",
  }),
];

export { frames };
export const BEAT_STARTS = starts(BEATS);
export const TOTAL_FRAMES = totalFrames(BEATS);
export const TOTAL_SECONDS = BEATS.reduce((a, b) => a + b.sec, 0);

/**
 * MUSIC (Section 10a) — Path B body with the set's Path A signature.
 *
 * DIABLO scores the body. Of the five supplied tracks it is the most insistent
 * and the most rhythmically gridded, which is the right character for a
 * routing matrix and for the software-heavy middle third; it is also 170.5 s,
 * long enough to carry this reel's 145 s body with a single relay.
 *
 * Mindscape opens the hook and returns for the CTA and outro, exactly as in
 * Reels 1 and 3. Using the same two moments in all three reels is what gives
 * the set one recognisable sonic signature without layering unrelated tempi
 * and keys on top of one another.
 */
export const MUSIC_PLAN = [
  { from: 0, to: 5, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.5 },
    { slug: "mindscape-melody", gain: 0.42 },
  ] },
  { from: 5, to: 150, track: "DIABLO", stems: [
    { slug: "diablo-drums", gain: 0.3 },
    { slug: "diablo-bass", gain: 0.27 },
    { slug: "diablo-instruments", gain: 0.44 },
    { slug: "diablo-melody", gain: 0.34 },
  ] },
  { from: 150, to: 178, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.48, from: 40 },
    { slug: "mindscape-melody", gain: 0.44, from: 40 },
    { slug: "mindscape-bass", gain: 0.34, from: 40 },
  ] },
] as const;
