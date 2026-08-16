import { SPEC } from "../theme";
import { S848, R3_SHARED, AVBSW, NET } from "../assets";
import type { Beat } from "../beat";
import { frames, starts, totalFrames } from "../beat";

/**
 * REEL 3 — "THE COMMAND CENTER & SCALE" (MOTU 848 + MOTU AVB Switch)
 * 178 s / 5,340 frames. 24 beats.
 *
 * Standalone by construction, like the other two: the "one identical engine,
 * one identical price" argument is made here in full rather than assumed.
 *
 * This is the only reel carrying TWO products, so it is built in two movements.
 * The first is the 848 as the room's command centre — four preamps, talkback,
 * A/B/C speaker switching, dual headphones, a monitor group: the front panel
 * you actually operate a session from. The second is the MOTU AVB Switch and
 * the scale it unlocks, which is where the network story that both other reels
 * plant finally pays off. The AVB Switch's own Market Operating Price is the
 * reason the price beat in every reel states TWO figures rather than one.
 *
 * Reel cadence: first cut at 5 s, average beat 7.4 s, and exactly FOUR images
 * earn a full Macro-to-Full-Reveal / Port Sweep pass (r3-hook, r3-reveal,
 * r3-rear, r3-switch). Every other image still gets a complete, uncropped pass
 * — just a faster one. Nothing anywhere in the reel is cropped, clipped or
 * trimmed to make it fit the runtime.
 */

const B = (b: Beat): Beat => b;

export const BEATS: Beat[] = [
  B({
    id: "r3-hook", sec: 5, kind: "hook",
    idx: S848.speakerSelect, images: [S848.speakerSelect], focal: [0.5, 0.5], macroScale: 2.8,
    eyebrow: "MOTU AVB Series",
    heading: "Talkback.\nA, B, C.",
    brand: "cornerLogo", sfx: "talkback-engage",
  }),
  B({
    id: "r3-reveal", sec: 8, kind: "macroReveal",
    idx: S848.qFront, images: [S848.qFront], focal: [0.24, 0.5], macroScale: 3.2,
    eyebrow: "MOTU 848",
    heading: "The Command Center",
    brand: "none", motu: true, sfx: "rack-seat",
  }),
  B({
    id: "r3-ecosystem", sec: 8, kind: "ecosystemSplit",
    images: [S848.frontElevation],
    labels: ["MOTU 16A", "MOTU 848", "MOTU 10pre"],
    eyebrow: "Peers — not a value ladder",
    heading: "One Identical Engine",
    brand: "cornerLogo", sfx: "gptp-sync",
  }),
  B({
    id: "r3-shared-spec", sec: 7, kind: "specGrid",
    idx: S848.rearElevation, images: [S848.rearElevation],
    eyebrow: "Identical in every chassis",
    heading: "Same Silicon,\nSame Price",
    specs: [
      { label: "Conversion", value: SPEC.shared.dac },
      { label: "Onboard mixing", value: SPEC.shared.mixer },
    ],
    brand: "none", sfx: "avb-ping-hi",
  }),
  B({
    id: "r3-preamps", sec: 8, kind: "montage",
    images: [S848.combos4, S848.insertsCombo], cols: 1,
    labels: ["4 × XLR/TRS combo, +74 dB", "Send / return inserts"],
    eyebrow: "Verified specification",
    heading: "Four Preamps, Eight Line In",
    brand: "cornerLogo", sfx: "encoder-turn",
  }),
  B({
    id: "r3-monitor", sec: 7, kind: "montage",
    images: [S848.monitorGroup, S848.headphones], cols: 1,
    labels: ["Monitor group", "Two independent headphone outs"],
    heading: "Run The Room",
    brand: "none", sfx: "relay-tick",
  }),
  B({
    id: "r3-brand-1", sec: 6, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),
  B({
    id: "r3-lineart", sec: 7, kind: "specGrid",
    idx: S848.frontLineArt, images: [S848.frontLineArt],
    eyebrow: "Verified specification",
    heading: "Sixty Channels",
    specs: [
      { label: "Total I/O", value: SPEC.s848.io },
      { label: "Front-panel control", value: SPEC.s848.control },
    ],
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "r3-outputs", sec: 7, kind: "montage",
    images: [S848.lineOut, S848.rearCableFan], cols: 1,
    labels: ["12 × TRS out, DC-coupled", "Cabled once, permanently"],
    heading: "Everything You Reach For",
    brand: "cornerLogo", sfx: "encoder-detent",
  }),
  B({
    id: "r3-rear", sec: 7, kind: "portSweep",
    idx: S848.rearIO, images: [S848.rearIO],
    eyebrow: "Port density",
    heading: "Across The Rear",
    brand: "none", sfx: "panel-air",
  }),
  B({
    id: "r3-meters", sec: 7, kind: "montage",
    images: [S848.meters, S848.metersAlt], cols: 1,
    eyebrow: "3.9in 24-bit RGB TFT",
    heading: "Every Channel, On The Panel",
    brand: "cornerLogo", sfx: "relay-tick-hi",
  }),
  B({
    id: "r3-cuemix", sec: 9, kind: "software",
    idx: S848.cuemixPatchbay, images: [S848.cuemixPatchbay],
    eyebrow: "CueMix Pro",
    heading: "A Console\nOn The Interface",
    sub: "64 inputs, 32 buses, with a gate, compressor and 4-band EQ per channel — running on the hardware, not your computer.",
    brand: "lowerThird", motu: true, sfx: "encoder-detent-hi",
  }),
  B({
    id: "r3-brand-2", sec: 6, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-lo",
  }),
  B({
    id: "r3-software", sec: 7, kind: "montage",
    images: [S848.cuemixPatchbayAlt, S848.ipad], cols: 1,
    heading: "Route It Once",
    brand: "none", sfx: "data-stream-short",
  }),
  B({
    id: "r3-network", sec: 9, kind: "dataFlow",
    idx: R3_SHARED.rearNetworkOptical, images: [R3_SHARED.rearNetworkOptical, NET.topologyRender],
    focal: [0.16, 0.5], macroScale: 2.6,
    eyebrow: "Built into every unit",
    heading: "The Network Starts Here",
    sub: "A two-port AVB switch in the chassis. Two rooms need no extra hardware at all.",
    brand: "cornerLogo", sfx: "rj45-snap",
  }),
  B({
    id: "r3-switch", sec: 8, kind: "macroReveal",
    idx: AVBSW.qWhite, images: [AVBSW.qWhite, AVBSW.qPorts], focal: [0.5, 0.56], macroScale: 2.9,
    eyebrow: "MOTU AVB Switch",
    heading: "Then You Add A Third",
    brand: "cornerLogo", sfx: "rj45-snap-soft",
  }),
  B({
    id: "r3-switch-spec", sec: 7, kind: "specGrid",
    idx: AVBSW.frontElevation, images: [AVBSW.frontElevation],
    eyebrow: "Verified specification",
    heading: "Six Gigabit Ports",
    specs: [
      { label: "Ports", value: SPEC.avbsw.ports },
      { label: "Reach", value: SPEC.avbsw.reach },
    ],
    brand: "none", sfx: "link-establish",
  }),
  B({
    id: "r3-standards", sec: 7, kind: "montage",
    images: [NET.milan, NET.ieeeAvb, R3_SHARED.thunderbolt, NET.rj45Cable], cols: 2,
    eyebrow: "Open standards, not a proprietary bus",
    heading: "Milan · IEEE 802.1",
    brand: "cornerLogo", sfx: "gptp-sync",
  }),
  B({
    id: "r3-scale", sec: 7, kind: "montage",
    images: [NET.clock, NET.qos, NET.gauge, S848.rtl], cols: 2,
    labels: ["gPTP sample-accurate clock", "Guaranteed bandwidth",
             "Low, predictable latency", "~1.8 ms analogue round trip"],
    heading: "Why It Stays In Time",
    brand: "none", sfx: "avb-ping-top",
  }),
  B({
    id: "r3-context", sec: 7, kind: "montage",
    images: [R3_SHARED.studioWide, S848.connectivity], cols: 1,
    eyebrow: "150 devices · 512 streams",
    heading: "It Scales Past One Room",
    brand: "cornerLogo", sfx: "data-stream",
  }),
  B({
    id: "r3-hero-2", sec: 8, kind: "montage",
    images: [S848.qFrontDark, S848.qRear, S848.qRearRight, S848.qFrontRight], cols: 2,
    eyebrow: "28 in / 32 out",
    heading: "Sixty Channels, 1U",
    brand: "cornerLogo", sfx: "rack-seat",
  }),
  B({
    id: "r3-price", sec: 12, kind: "price",
    images: [], eyebrow: "Market Operating Price, incl. GST",
    heading: "Two Categories.\nTwo Prices.",
    brand: "none", sfx: "avb-ping-top",
  }),
  B({
    id: "r3-cta", sec: 7, kind: "cta",
    images: [], heading: "Talk To Us",
    brand: "none", sfx: "link-establish",
  }),
  B({
    id: "r3-outro", sec: 7, kind: "outro",
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
 * ETERNITY scores the body — the loudest and most driving of the five supplied
 * tracks, which is what the set's closing chapter wants: Reel 3 is the one that
 * has to land the scale argument, and its second movement (the AVB Switch, from
 * 1:39) needs to read as an opening-out rather than a wind-down.
 *
 * Mindscape opens the hook and returns for the CTA and outro, exactly as in
 * Reels 1 and 2. Using the same two moments in all three reels is what gives
 * the set one recognisable sonic signature without layering unrelated tempi and
 * keys on top of one another.
 */
export const MUSIC_PLAN = [
  { from: 0, to: 5, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.5 },
    { slug: "mindscape-melody", gain: 0.42 },
  ] },
  { from: 5, to: 150, track: "ETERNITY", stems: [
    { slug: "eternity-drums", gain: 0.3 },
    { slug: "eternity-bass", gain: 0.28 },
    { slug: "eternity-instruments", gain: 0.46 },
    { slug: "eternity-melody", gain: 0.36 },
  ] },
  { from: 150, to: 178, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.48, from: 40 },
    { slug: "mindscape-melody", gain: 0.44, from: 40 },
    { slug: "mindscape-bass", gain: 0.34, from: 40 },
  ] },
] as const;
