import { SPEC } from "./theme";
import { HOOK, THESIS, TENPRE, S16A, S848, NET, CLIMAX } from "./assets";
import type { Beat, SegmentId } from "./beat";
import { frames, starts, totalFrames } from "./beat";

/**
 * MOTU AVB SERIES — MASTER REEL
 * 298 s / 8,940 frames. One continuous ecosystem arc, all four products.
 *
 * TIMING (Section 4, adjusted — reasoning recorded here because the brief asks
 * for adjustments to be stated rather than silently applied).
 *
 * Section 4's own timestamps sum to 178 s (30+50+50+30+18, ending at 2:58) —
 * they are the three-part reel's timeline, carried over. The brief also says
 * the intent is to preserve the LONG-FORM's relative weighting, so that is what
 * is scaled here: the long-form's committed 90/150/150/150/150/120/88 = 898 s
 * allocation, multiplied by 298/898.
 *
 *   Hook      30 s   0:00–0:30     <- 90 s
 *   Thesis    50 s   0:30–1:20     <- 150 s
 *   Capture   50 s   1:20–2:10     <- 150 s   (10pre)
 *   Route     50 s   2:10–3:00     <- 150 s   (16A)
 *   Command   50 s   3:00–3:50     <- 150 s   (848)
 *   Network   40 s   3:50–4:30     <- 120 s   (AVB Switch)
 *   CTA       28 s   4:30–4:58     <- 88 s
 *                   = 298 s
 *
 * Section 4's version collapsed the three 150 s product segments into a single
 * 50 s block, which is exactly the 120 s the arithmetic was missing. Restoring
 * one segment per interface matches the long-form's structure, which is what
 * Section 4 says this reel is a compressed derivative of.
 *
 * PACING (Section 5): 40 beats, average 7.5 s, first cut at 6 s. No beat holds
 * one static composition — every beat carries a camera move, a montage
 * assembly, an animated diagram or a staged type reveal.
 *
 * IMAGE TREATMENT (Section 3): five images earn a full Macro-to-Full-Reveal,
 * two earn a Port Density Sweep, one a Data Flow Reveal, and four beats are
 * Ecosystem Montages. Everything else gets a faster but still complete,
 * uncropped pass. Every curated image resolves to the whole unit at some point
 * in its own screen time — enforced by scripts/coverage.mjs and
 * scripts/whole-unit.mjs, not asserted.
 */

const B = (b: Beat): Beat => b;

export const SEGMENTS: { id: SegmentId; name: string; sec: number }[] = [
  { id: "hook",    name: "The Hook — The Scaling Wall",        sec: 30 },
  { id: "thesis",  name: "One Engine, Three Front-Ends",       sec: 50 },
  { id: "capture", name: "Capture — MOTU 10pre",               sec: 50 },
  { id: "route",   name: "Route — MOTU 16A",                   sec: 50 },
  { id: "command", name: "Command — MOTU 848",                 sec: 50 },
  { id: "network", name: "The Network — MOTU AVB Switch",      sec: 40 },
  { id: "cta",     name: "Synthesis & Call To Action",         sec: 28 },
];

export const BEATS: Beat[] = [
  // ══════════════════════════════════ 0:00–0:30  THE HOOK (30 s, 5 beats)
  B({
    id: "hook-open", seg: "hook", sec: 6, kind: "hook",
    idx: HOOK.cableFan16A, images: [HOOK.cableFan16A], focal: [0.62, 0.5], macroScale: 3.2,
    eyebrow: "MOTU AVB Series",
    heading: "One Room\nIs Never\nThe Last Room.",
    brand: "cornerLogo", sfx: "encoder-detent-hi",
  }),
  B({
    id: "hook-rooms", seg: "hook", sec: 7, kind: "montage",
    images: [HOOK.studioA, HOOK.studioB], cols: 1,
    labels: ["Room one", "Room two — and the converters no longer agree"],
    heading: "The Scaling Wall",
    brand: "none", sfx: "relay-tick-lo",
  }),
  B({
    id: "hook-cabling", seg: "hook", sec: 6, kind: "montage",
    images: [HOOK.cableFan848], cols: 1,
    eyebrow: "Every channel, cabled twice",
    heading: "Add A Room,\nRe-Cable Everything",
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "hook-compromise", seg: "hook", sec: 6, kind: "software",
    idx: HOOK.tease848, images: [HOOK.tease848],
    eyebrow: "The usual trade",
    heading: "Preamps Or Routing.\nPick One.",
    sub: "Density at the front, or channels through the patchbay — and a different converter for each.",
    brand: "lowerThird", sfx: "panel-air-soft",
  }),
  B({
    id: "hook-turn", seg: "hook", sec: 5, kind: "ecosystemSplit",
    images: [],
    labels: ["MOTU 16A", "MOTU 848", "MOTU 10pre"],
    eyebrow: "There is another way to build it",
    heading: "One Engine.",
    brand: "cornerLogo", motu: true, sfx: "gptp-sync",
  }),

  // ══════════════════════════════════ 0:30–1:20  THE THESIS (50 s, 7 beats)
  B({
    id: "th-triptych", seg: "thesis", sec: 8, kind: "ecosystemMontage",
    images: [THESIS.elev10pre, THESIS.elev16A, THESIS.elev848],
    labels: ["MOTU 10pre", "MOTU 16A", "MOTU 848"], cols: 1, soloHold: 26,
    eyebrow: "Peers — never a value ladder",
    heading: "Three Front-Ends,\nOne Rack Space Each",
    brand: "none", sfx: "rack-seat",
  }),
  B({
    id: "th-faces", seg: "thesis", sec: 9, kind: "ecosystemMontage",
    images: [THESIS.face10pre, THESIS.face16A, THESIS.face848],
    labels: ["10pre — ten mic preamps", "16A — sixteen line outs, no preamps", "848 — talkback and A/B/C"],
    cols: 1, soloHold: 30,
    eyebrow: "Visibly different. Identically powered.",
    heading: "The Same Engine\nBehind All Three",
    brand: "cornerLogo", sfx: "encoder-turn",
  }),
  B({
    id: "th-badges", seg: "thesis", sec: 7, kind: "badges",
    images: [THESIS.ess, THESIS.thunderbolt],
    labels: ["ESS Sabre32 Ultra conversion", "Thunderbolt 4 / USB4, 40 Gbps"],
    heading: "Identical In Every Chassis",
    brand: "none", sfx: "avb-ping-hi",
  }),
  B({
    id: "th-dsp", seg: "thesis", sec: 7, kind: "specGrid",
    idx: THESIS.cuemixBadge, images: [THESIS.cuemixBadge],
    eyebrow: "Verified specification",
    heading: "One Mixer,\nOn The Hardware",
    specs: [
      { label: "Onboard DSP", value: SPEC.shared.dsp },
      { label: "Mixer", value: SPEC.shared.mixer },
    ],
    brand: "none", sfx: "counter-tick-hi",
  }),
  B({
    id: "th-discovery", seg: "thesis", sec: 7, kind: "software",
    idx: THESIS.discovery, images: [THESIS.discovery],
    eyebrow: "One window, three interfaces",
    heading: "They Already\nKnow Each Other",
    sub: "Every AVB Series interface appears in the same control software, on the same network, with the same mixer.",
    brand: "lowerThird", motu: true, sfx: "link-establish",
  }),
  B({
    id: "th-console", seg: "thesis", sec: 6, kind: "montage",
    images: [THESIS.cuemixMonitor, THESIS.rtl], cols: 1,
    labels: ["64 inputs · 32 buses", "~1.8 ms analogue round trip"],
    heading: "A Console You Do Not\nSpend CPU On",
    brand: "none", sfx: "data-stream-short",
  }),
  B({
    id: "th-price", seg: "thesis", sec: 6, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),

  // ══════════════════════════════════ 1:20–2:10  CAPTURE — 10pre (50 s, 7 beats)
  B({
    id: "cap-reveal", seg: "capture", sec: 9, kind: "macroReveal",
    idx: TENPRE.hero, images: [TENPRE.hero], focal: [0.2, 0.55], macroScale: 3.2,
    eyebrow: "MOTU 10pre",
    heading: "Capture",
    sub: "The tracking front-end: ten high-gain preamps in one rack space.",
    brand: "none", sfx: "rack-seat",
  }),
  B({
    id: "cap-preamps", seg: "capture", sec: 8, kind: "specGrid",
    // A deliberate callback: the thesis showed this panel as one of three
    // faces; Capture returns to it as the whole preamp argument.
    idx: THESIS.face10pre, images: [THESIS.face10pre],
    eyebrow: "Verified specification",
    heading: "Ten Preamps",
    specs: [
      { label: "Preamplifiers", value: SPEC.tenpre.preamps },
      { label: "Maximum gain", value: SPEC.tenpre.gain },
      { label: "Equivalent input noise", value: SPEC.tenpre.ein },
    ],
    brand: "cornerLogo", sfx: "encoder-turn",
  }),
  B({
    id: "cap-sweep", seg: "capture", sec: 8, kind: "portSweep",
    idx: TENPRE.rearElevation, images: [TENPRE.rearElevation],
    eyebrow: "Port density",
    heading: "Eight Across The Rear",
    brand: "none", sfx: "panel-air",
  }),
  B({
    id: "cap-inserts", seg: "capture", sec: 7, kind: "montage",
    images: [TENPRE.inserts, TENPRE.meters], cols: 1,
    labels: ["Send / return inserts, channels 1–2", "3.9in 24-bit RGB TFT"],
    heading: "Outboard Before Conversion",
    brand: "cornerLogo", sfx: "encoder-detent-lo",
  }),
  B({
    id: "cap-outputs", seg: "capture", sec: 7, kind: "montage",
    images: [TENPRE.lineOut, TENPRE.headphones], cols: 1,
    labels: ["8 × TRS, DC-coupled", "Two independent headphone outs"],
    heading: "Everything The Take Needs",
    brand: "none", sfx: "relay-tick-hi",
  }),
  B({
    id: "cap-angles", seg: "capture", sec: 6, kind: "montage",
    images: [TENPRE.heroRight, TENPRE.rearQuarter], cols: 1,
    eyebrow: "26 in / 28 out · 54 channels",
    heading: "One Rack Space",
    brand: "cornerLogo", sfx: "rj45-snap-soft",
  }),
  B({
    id: "cap-brand", seg: "capture", sec: 5, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-lo",
  }),

  // ══════════════════════════════════ 2:10–3:00  ROUTE — 16A (50 s, 7 beats)
  B({
    id: "rt-reveal", seg: "route", sec: 9, kind: "macroReveal",
    idx: S16A.hero, images: [S16A.hero], focal: [0.24, 0.5], macroScale: 3.2,
    eyebrow: "MOTU 16A",
    heading: "Route",
    sub: "The line-level matrix: everything already amplified, everything reaching everything else.",
    brand: "none", motu: true, sfx: "encoder-detent-top",
  }),
  B({
    id: "rt-sweep", seg: "route", sec: 8, kind: "portSweep",
    idx: S16A.rearElevation, images: [S16A.rearElevation],
    eyebrow: "Port density",
    heading: "Thirty-Two Jacks,\nOne Panel",
    brand: "cornerLogo", sfx: "panel-air-hi",
  }),
  B({
    id: "rt-io", seg: "route", sec: 7, kind: "specGrid",
    idx: S16A.lineOutBank, images: [S16A.lineOutBank],
    eyebrow: "Verified specification",
    heading: "Sixty-Six Channels",
    specs: [
      { label: "Total I/O", value: SPEC.s16a.io },
      { label: "Analogue line in", value: SPEC.s16a.lineIn },
    ],
    brand: "none", sfx: "counter-tick",
  }),
  B({
    id: "rt-patchbay", seg: "route", sec: 8, kind: "montage",
    images: [S16A.patchbayBlue, S16A.patchbayPurple], cols: 1,
    labels: ["Any input", "to any output"],
    eyebrow: "CueMix Pro",
    heading: "The Patch Bay\nLives On The Box",
    brand: "cornerLogo", sfx: "encoder-detent",
  }),
  B({
    id: "rt-dc", seg: "route", sec: 7, kind: "montage",
    images: [S16A.modularSynth, S16A.opticalRow], cols: 1,
    labels: ["DC-coupled: audio or control voltage", "16-ch ADAT · 8-ch S/MUX"],
    heading: "Outputs That Do More",
    brand: "none", sfx: "relay-tick",
  }),
  B({
    id: "rt-context", seg: "route", sec: 6, kind: "montage",
    images: [S16A.laptop, S16A.ipad, S16A.meters, S16A.rearDetail], cols: 2,
    heading: "Driven From Anywhere",
    brand: "cornerLogo", sfx: "data-stream-short",
  }),
  B({
    // Was a lone image in a full media slot, which read as an empty frame on
    // the QA still. It carries the shared host figures instead — true of all
    // three interfaces, so it also keeps the thesis alive inside the segment.
    id: "rt-angles", seg: "route", sec: 5, kind: "specGrid",
    idx: S16A.rearQuarter, images: [S16A.rearQuarter],
    eyebrow: "32 in / 34 out",
    heading: "One Rack Space",
    specs: [
      { label: "Host connection", value: SPEC.shared.host },
      { label: "To the host", value: SPEC.shared.hostIO },
    ],
    brand: "none", sfx: "rack-seat",
  }),

  // ══════════════════════════════════ 3:00–3:50  COMMAND — 848 (50 s, 7 beats)
  B({
    id: "cmd-reveal", seg: "command", sec: 9, kind: "macroReveal",
    idx: S848.hero, images: [S848.hero], focal: [0.22, 0.5], macroScale: 3.2,
    eyebrow: "MOTU 848",
    heading: "Command",
    sub: "The control room front-end: preamps, monitoring and talkback on the same panel.",
    brand: "none", sfx: "talkback-engage",
  }),
  B({
    id: "cmd-control", seg: "command", sec: 8, kind: "montage",
    images: [S848.control, S848.monitorGroup], cols: 1,
    labels: ["Talkback · A / B / C · mute · mono", "Monitor group"],
    eyebrow: "Run the room from the front",
    heading: "Three Speaker Sets,\nOne Button Each",
    brand: "cornerLogo", sfx: "relay-tick-lo",
  }),
  B({
    id: "cmd-preamps", seg: "command", sec: 7, kind: "montage",
    images: [S848.combos, S848.inserts], cols: 1,
    labels: ["4 × XLR/TRS combo, +74 dB", "Inserts on the first pair"],
    heading: "Balanced, Not Specialised",
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "cmd-io", seg: "command", sec: 7, kind: "specGrid",
    idx: S848.lineOut, images: [S848.lineOut],
    eyebrow: "Verified specification",
    heading: "Sixty Channels",
    specs: [
      { label: "Total I/O", value: SPEC.s848.io },
      { label: "Analogue line", value: SPEC.s848.line },
    ],
    brand: "cornerLogo", sfx: "counter-tick-hi",
  }),
  B({
    id: "cmd-monitor", seg: "command", sec: 7, kind: "montage",
    images: [S848.headphones, S848.meters], cols: 1,
    labels: ["Two independent headphone outs", "3.9in 24-bit RGB TFT"],
    heading: "Everyone Hears\nTheir Own Mix",
    brand: "none", sfx: "encoder-detent-hi",
  }),
  B({
    id: "cmd-software", seg: "command", sec: 7, kind: "montage",
    images: [S848.patchbay, S848.rearCluster], cols: 1,
    labels: ["Routed once, recalled with the session", "Network · optical · line"],
    heading: "Set It, Then Forget It",
    brand: "cornerLogo", sfx: "data-stream",
  }),
  B({
    id: "cmd-angles", seg: "command", sec: 5, kind: "specGrid",
    idx: S848.rearQuarter, images: [S848.rearQuarter],
    eyebrow: "28 in / 32 out",
    heading: "One Rack Space",
    specs: [
      { label: "Sample rates", value: SPEC.shared.rates },
      { label: "Round trip", value: SPEC.shared.rtl },
    ],
    brand: "none", sfx: "rack-seat",
  }),

  // ══════════════════════════════════ 3:50–4:30  THE NETWORK (40 s, 5 beats)
  B({
    // DATA FLOW REVEAL, as Section 3 defines it: a tight macro push on the AVB
    // Switch's RJ-45 ports and LED activity lights, resolving out to the whole
    // unit while an animated glowing vector line draws the Ethernet path.
    id: "net-builtin", seg: "network", sec: 9, kind: "dataFlow",
    idx: NET.switchPorts, images: [NET.switchPorts, NET.topologyDiagram],
    focal: [0.5, 0.62], macroScale: 3.0,
    eyebrow: "MOTU AVB Switch",
    heading: "Six Ports,\nOne Timebase",
    sub: "Standard Ethernet, carrying sample-accurate audio between every room.",
    brand: "cornerLogo", motu: true, sfx: "rj45-snap",
  }),
  B({
    // ECOSYSTEM MONTAGE — Section 3's second worked example, made literal: the
    // interface's own built-in Ethernet port beside the Switch's RJ-45 cluster,
    // so the "one network" claim is completed by showing the physical
    // connection point on BOTH sides. Each is held alone, whole, first.
    id: "net-handshake", seg: "network", sec: 9, kind: "ecosystemMontage",
    images: [NET.builtInPort, NET.rj45Cable, NET.switchFront],
    labels: ["Every interface — its own AVB port", "Standard CAT-5e / CAT-6", "The Switch — for everything past two"],
    cols: 1, soloHold: 32,
    eyebrow: "Both ends of the same cable",
    heading: "Then You Add\nThe Third Room",
    brand: "none", sfx: "rj45-snap-soft",
  }),
  B({
    id: "net-spec", seg: "network", sec: 8, kind: "specGrid",
    idx: NET.topologyRender, images: [NET.topologyRender],
    eyebrow: "Verified specification",
    heading: "Scales Past\nOne Building",
    specs: [
      { label: "Reach", value: SPEC.avbsw.reach },
      { label: "Ceiling", value: SPEC.avbsw.scale },
      { label: "Streams", value: SPEC.avbsw.streams },
    ],
    brand: "cornerLogo", sfx: "gptp-lock",
  }),
  B({
    id: "net-standards", seg: "network", sec: 8, kind: "montage",
    images: [NET.milan, NET.ieeeAvb, NET.clock, NET.qos], cols: 2,
    eyebrow: "Open standards, not a proprietary bus",
    heading: "Why It Stays In Time",
    brand: "none", sfx: "gptp-sync",
  }),
  B({
    id: "net-latency", seg: "network", sec: 6, kind: "montage",
    images: [NET.gauge], cols: 1,
    labels: ["~1.8 ms round trip, room to room"],
    eyebrow: "IEEE 802.1AS · gPTP",
    heading: "Sample-Accurate,\nEvery Room",
    brand: "cornerLogo", sfx: "data-stream-long",
  }),

  // ══════════════════════════════════ 4:30–4:58  SYNTHESIS & CTA (28 s, 4 beats)
  B({
    id: "cta-climax", seg: "cta", sec: 8, kind: "ecosystemMontage",
    images: [CLIMAX.tenpre, CLIMAX.s16a, CLIMAX.s848, CLIMAX.avbsw],
    labels: ["MOTU 10pre", "MOTU 16A", "MOTU 848", "MOTU AVB Switch"],
    cols: 2, soloHold: 22,
    eyebrow: "One ecosystem",
    heading: "Four Products.\nOne Network.",
    brand: "none", motu: true, sfx: "avb-ping-top",
  }),
  B({
    id: "cta-price", seg: "cta", sec: 9, kind: "price",
    images: [], eyebrow: "Market Operating Price, incl. GST",
    heading: "Two Categories.\nTwo Prices.",
    brand: "none", sfx: "avb-ping-alt",
  }),
  B({
    id: "cta-contact", seg: "cta", sec: 6, kind: "cta",
    images: [], heading: "Talk To Us",
    brand: "none", sfx: "link-establish",
  }),
  B({
    id: "cta-outro", seg: "cta", sec: 5, kind: "outro",
    images: [], brand: "none", motu: true, sfx: "gptp-sync",
  }),
];

export { frames };
export const BEAT_STARTS = starts(BEATS);
export const TOTAL_FRAMES = totalFrames(BEATS);
export const TOTAL_SECONDS = BEATS.reduce((a, b) => a + b.sec, 0);

/**
 * MUSIC DEPLOYMENT (Section 10 Layer 1) — Path A / Path B BLEND.
 *
 * Confirmed against the long-form branch's own committed MUSIC_PLAN rather than
 * assumed: `longform/src/schedule.ts` documents its choice as "a deliberate
 * Path A / Path B blend — Mindscape bookends the video and is its sonic
 * signature (Path A's ecosystem unification); each product chapter is scored
 * from its own track's stems (Path B's thematic variation)". This reel's
 * structure is a compressed derivative of that exact segment structure, so it
 * inherits that exact deployment. The three-part reels used the same shape at
 * reel scale, so both references agree and no override is needed.
 *
 * Stems are never layered ACROSS tracks — different tempi and keys would turn
 * the bed to mush. Each segment draws from one track only, and the seams
 * crossfade over 1 s.
 *
 * NOTE ON THE SOURCE MATERIAL: Section 10 refers to "the four supplied tracks".
 * The repository actually supplies FIVE instrumental tracks and 17 stems —
 * Black & Blue, DIABLO, ETERNITY, GIFTED and Mindscape. All five are used here,
 * as they were in the long-form video. This was flagged in both prior builds.
 */
export const MUSIC_PLAN = [
  // Hook — sparse and unresolved while the problem is stated.
  { from: 0, to: 30, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.50 },
    { slug: "mindscape-bass", gain: 0.34 },
  ] },
  // Thesis — the ecosystem theme stated in full, melody enters.
  { from: 30, to: 80, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.46, from: 30 },
    { slug: "mindscape-melody", gain: 0.40, from: 30 },
    { slug: "mindscape-bass", gain: 0.34, from: 30 },
  ] },
  // Capture — GIFTED: highest dynamics of the five, suits tracking energy.
  { from: 80, to: 130, track: "GIFTED", stems: [
    { slug: "gifted-drums", gain: 0.40 },
    { slug: "gifted-bass", gain: 0.30 },
    { slug: "gifted-instruments", gain: 0.42 },
  ] },
  // Route — DIABLO: dense and synth-forward, suits routing and the patch bay.
  { from: 130, to: 180, track: "DIABLO", stems: [
    { slug: "diablo-drums", gain: 0.30 },
    { slug: "diablo-bass", gain: 0.26 },
    { slug: "diablo-instruments", gain: 0.42 },
    { slug: "diablo-melody", gain: 0.34 },
  ] },
  // Command — Black & Blue: warmest and most spacious, suits the control room.
  { from: 180, to: 230, track: "Black & Blue", stems: [
    { slug: "blackblue-drums", gain: 0.30 },
    { slug: "blackblue-bass", gain: 0.28 },
    { slug: "blackblue-instruments", gain: 0.46 },
  ] },
  // Network — ETERNITY: loudest and most driving of the five. The climax.
  { from: 230, to: 270, track: "ETERNITY", stems: [
    { slug: "eternity-drums", gain: 0.32 },
    { slug: "eternity-bass", gain: 0.28 },
    { slug: "eternity-instruments", gain: 0.44 },
    { slug: "eternity-melody", gain: 0.36 },
  ] },
  // CTA — home to Mindscape, drums absent, for the close. Path A's bookend.
  { from: 270, to: 298, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.48, from: 60 },
    { slug: "mindscape-melody", gain: 0.44, from: 60 },
    { slug: "mindscape-bass", gain: 0.34, from: 60 },
  ] },
] as const;
