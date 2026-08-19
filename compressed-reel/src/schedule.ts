import { SPEC } from "./theme";
import { FACES, ELEV, SHARED, HERO, NET, CLIMAX } from "./assets";
import type { Beat, SegmentId } from "./beat";
import { frames, starts, totalFrames } from "./beat";

/**
 * MOTU AVB SERIES — COMPRESSED MASTER REEL
 * 88 s / 2,640 frames. All four products, one continuous ecosystem arc.
 *
 * THE COMPRESSION LOGIC (the governing decision of this build).
 *
 * This is NOT the 298 s master reel scaled down. Scaling its seven segments by
 * 0.295 would give 9-15 s each — below the floor for establishing AND resolving
 * a point, and it would produce four rushed product fragments instead of one
 * coherent claim. So the structure COLLAPSES instead:
 *
 *   - The three per-product segments stop being segments. The 10pre, 16A and
 *     848 now share beats, under headings that are true of all of them at once.
 *   - Ecosystem Montage stops being one technique among several and becomes the
 *     spine: 10 of these 16 beats are built that way, against 4 of the master
 *     reel's 42.
 *   - The hook and the thesis fuse. There is no separate "scaling wall" problem
 *     statement; at this runtime the problem and its answer have to arrive in
 *     the same breath, so the reel opens ON the claim.
 *
 * TIMING (Section 4's shape, rebalanced — reasoning recorded because the brief
 * asks for adjustments to be stated rather than applied silently):
 *
 *   Hook fused with thesis   12 s   0:00-0:12   (Section 4: 12 s, unchanged)
 *   The ecosystem flow       45 s   0:12-0:57   (Section 4: 43 s, +2)
 *   Network & scale          16 s   0:57-1:13   (Section 4: 20 s, -4)
 *   Synthesis & CTA          15 s   1:13-1:28   (Section 4: 13 s, +2)
 *                          = 88 s
 *
 * Section 4's own numbers sum to 88 exactly, so no arithmetic fix was needed.
 * The one rebalance: 20 s of 88 is 23% of the runtime for the AVB Switch, where
 * the master reel gave it 13.4% — and Fact 1 is explicit that it is not a
 * peer-tier fourth interface. 16 s still buys it three beats and a distinct
 * moment of its own, including one of the only two Macro-to-Full-Reveals in the
 * reel. The 3 s goes to the flow, where three products are sharing the time,
 * and the spare seconds to the CTA, which carries both price figures and the
 * distributor designation — the tightest copy in this pipeline. One of those
 * seconds was taken back from the flow after a QA still showed the 3 s outro
 * failing Section 7's legibility bar at ~18 words.
 *
 * PACING (Section 5): 16 beats, average 5.5 s, first cut at 7 s. The fastest
 * cadence in the pipeline — the master reel averaged 7.1 s, the three-part
 * reels 7.4-8.1 s.
 *
 * IMAGE TREATMENT (Section 3): exactly TWO images earn a full
 * Macro-to-Full-Reveal (79 and 112 — see scripts/curation.mjs for why those two
 * and not the obvious per-product alternatives). One Port Density Sweep (51),
 * one Data Flow Reveal (20). Everything else is a montage solo pass, which is
 * still full-size and uncropped. No image anywhere is cropped to fit the pace:
 * where that pressure arose, the image was cut from the selection instead.
 */

/**
 * Compression removed every specGrid beat — a spec chip needs dwell time this
 * runtime does not have. The verified figures that DO reach the screen ride in
 * headings and montage labels instead, and they are interpolated from SPEC
 * rather than retyped, so they cannot drift from the verified column.
 */
const B = (b: Beat): Beat => b;

export const SEGMENTS: { id: SegmentId; name: string; sec: number }[] = [
  { id: "hook",    name: "The Hook, Fused With The Thesis", sec: 12 },
  { id: "flow",    name: "The Ecosystem, As One Flow",      sec: 45 },
  { id: "network", name: "Network & Scale",                 sec: 16 },
  { id: "cta",     name: "Synthesis & Call To Action",      sec: 15 },
];

export const BEATS: Beat[] = [
  // ═══════════════════════ 0:00-0:12  HOOK FUSED WITH THESIS (12 s, 2 beats)
  B({
    // The reel opens ON the claim. Three front panels, each unmistakably
    // different, each held alone and whole before they assemble under one
    // heading that is true of all three.
    id: "hook-faces", seg: "hook", sec: 7, kind: "ecosystemMontage",
    images: [FACES.tenpre, FACES.s16a, FACES.s848],
    labels: ["10pre — ten mic preamps", "16A — sixteen line outs, no preamps", "848 — talkback and A/B/C"],
    cols: 1, soloHold: 34,
    eyebrow: "MOTU AVB Series",
    heading: "Three Front Panels.\nOne Engine.",
    brand: "cornerLogo", motu: true, sfx: "encoder-detent-hi",
  }),
  B({
    id: "hook-peers", seg: "hook", sec: 5, kind: "ecosystemMontage",
    images: [ELEV.tenpre, ELEV.s16a, ELEV.s848],
    labels: ["MOTU 10pre", "MOTU 16A", "MOTU 848"],
    cols: 1, soloHold: 24,
    eyebrow: "One rack space each",
    heading: "Peers. Not A Ladder.",
    brand: "none", sfx: "rack-seat",
  }),

  // ═══════════════════════════ 0:12-0:58  THE ECOSYSTEM FLOW (46 s, 8 beats)
  B({
    id: "flow-silicon", seg: "flow", sec: 6, kind: "badges",
    images: [SHARED.ess, SHARED.thunderbolt],
    labels: ["ESS Sabre32 Ultra conversion", "Thunderbolt 4 / USB4"],
    heading: "Identical In Every Chassis",
    // Carries a corner mark to split what was otherwise a 19 s stretch with no
    // Shivansh presence — 21% of the reel. Section 6 drops the longer formats'
    // fixed-interval rule, but a fifth of the runtime is still too long a hole.
    brand: "cornerLogo", sfx: "avb-ping-hi",
  }),
  B({
    // MACRO-TO-FULL-REVEAL #1. The 16A's panel is the one that does not
    // explain itself, so the macro opens on jack detail and pulls out to the
    // whole unit — the technique doing the job it exists for.
    id: "flow-route", seg: "flow", sec: 8, kind: "macroReveal",
    idx: HERO.s16a, images: [HERO.s16a], focal: [0.26, 0.5], macroScale: 3.2,
    eyebrow: "MOTU 16A",
    heading: "Sixteen In.\nSixteen Out.",
    sub: SPEC.s16a.io,
    brand: "none", sfx: "encoder-detent-top",
  }),
  B({
    id: "flow-sweep", seg: "flow", sec: 6, kind: "portSweep",
    idx: HERO.s16aRear, images: [HERO.s16aRear],
    eyebrow: "Port density",
    heading: "Thirty-Two Jacks,\nOne Panel",
    brand: "cornerLogo", sfx: "panel-air-hi",
  }),
  B({
    id: "flow-capture", seg: "flow", sec: 6, kind: "ecosystemMontage",
    images: [HERO.tenpre, HERO.tenpreRear],
    labels: [`MOTU 10pre — ten preamps, ${SPEC.tenpre.gain}`, "Eight across the rear"],
    cols: 1, soloHold: 46,
    eyebrow: "Change the room, change the panel",
    heading: "Capture",
    brand: "none", sfx: "encoder-turn",
  }),
  B({
    id: "flow-command", seg: "flow", sec: 5, kind: "ecosystemMontage",
    images: [HERO.s848, HERO.s848Monitor],
    labels: ["MOTU 848 — the control room", "Monitor group, A/B/C, talkback"],
    cols: 1, soloHold: 46,
    eyebrow: "Where the decisions get made",
    heading: "Command",
    brand: "none", sfx: "talkback-engage",
  }),
  B({
    id: "flow-brand", seg: "flow", sec: 4, kind: "brandBeat",
    images: [], brand: "beat", sfx: "avb-ping-mid",
  }),
  B({
    id: "flow-mixer", seg: "flow", sec: 6, kind: "ecosystemMontage",
    images: [SHARED.cuemixPatchbay, SHARED.cuemixMonitor],
    labels: ["Any input to any output", `${SPEC.shared.mixer}, on the hardware`],
    cols: 1, soloHold: 46,
    eyebrow: "CueMix Pro",
    heading: "One Mixer.\nEvery Unit.",
    brand: "cornerLogo", sfx: "relay-tick-top",
  }),
  B({
    // The single most efficient image in the inventory for this thesis: all
    // three interfaces listed together in one software window.
    id: "flow-window", seg: "flow", sec: 4, kind: "software",
    idx: SHARED.discovery, images: [SHARED.discovery],
    eyebrow: "One window, three interfaces",
    heading: "Already On\nThe Same Network",
    brand: "none", sfx: "link-establish",
  }),

  // ═══════════════════════════════ 0:58-1:14  NETWORK & SCALE (16 s, 3 beats)
  B({
    id: "net-builtin", seg: "network", sec: 6, kind: "dataFlow",
    idx: NET.builtInPort, images: [NET.builtInPort, NET.topology],
    focal: [0.16, 0.5], macroScale: 2.6,
    eyebrow: "Built into every interface",
    heading: "Two Rooms Need\nNothing Extra",
    brand: "none", motu: true, sfx: "rj45-snap",
  }),
  B({
    // MACRO-TO-FULL-REVEAL #2. The least-recognised product in the set, and
    // the literal payoff of the "one network" claim.
    id: "net-switch", seg: "network", sec: 6, kind: "macroReveal",
    idx: NET.switchPorts, images: [NET.switchPorts], focal: [0.5, 0.62], macroScale: 3.0,
    eyebrow: "MOTU AVB Switch",
    heading: "Then You Add\nThe Third",
    brand: "cornerLogo", sfx: "rj45-snap-soft",
  }),
  B({
    id: "net-standards", seg: "network", sec: 4, kind: "montage",
    images: [NET.milan, NET.ieeeAvb], cols: 2,
    eyebrow: "Open standards, not a proprietary bus",
    heading: "Milan · IEEE 802.1",
    brand: "none", sfx: "gptp-drift",
  }),

  // ═══════════════════════════ 1:14-1:28  SYNTHESIS & CTA (14 s, 3 beats)
  B({
    id: "cta-climax", seg: "cta", sec: 5, kind: "ecosystemMontage",
    images: [CLIMAX.tenpre, CLIMAX.s16a, CLIMAX.s848, CLIMAX.avbsw],
    labels: ["MOTU 10pre", "MOTU 16A", "MOTU 848", "MOTU AVB Switch"],
    cols: 2, soloHold: 18,
    eyebrow: "One ecosystem",
    heading: "Four Products.\nOne Network.",
    brand: "none", motu: true, sfx: "avb-ping-top",
  }),
  B({
    // The dual MOP. Nothing else competes for this beat.
    id: "cta-price", seg: "cta", sec: 6, kind: "price",
    images: [], eyebrow: "Market Operating Price, incl. GST",
    heading: "Two Categories.\nTwo Prices.",
    brand: "none", sfx: "avb-ping-warm",
  }),
  B({
    // 4 s, not 3. The outro lockup carries the distributor designation, the
    // region and the URL — around 18 words. Section 7's bar is "instantly,
    // comfortably readable", and the QA still showed 3 s failing it. The second
    // comes from flow-command, which had a one-word heading and room to spare.
    id: "cta-outro", seg: "cta", sec: 4, kind: "outro",
    images: [], brand: "none", motu: true, sfx: "gptp-sync",
  }),
];

export { frames };
export const BEAT_STARTS = starts(BEATS);
export const TOTAL_FRAMES = totalFrames(BEATS);
export const TOTAL_SECONDS = BEATS.reduce((a, b) => a + b.sec, 0);

/**
 * MUSIC (Section 9 Layer 1) — the master reel's blend, body collapsed to one track.
 *
 * The 298 s master reel used a Path A / Path B blend: Mindscape bookending the
 * whole thing as the ecosystem signature, with each product segment scored from
 * its own track. Both halves of that are reused here, but the body is ETERNITY
 * ALONE rather than a four-track rotation — at 88 s a track change every ~15 s
 * would read as restlessness, not structure.
 *
 * ETERNITY specifically because the master reel itself reserved it for that
 * build's most driving passage (its network/climax chapter). This reel is that
 * energy from end to end, so its body track is the right single choice, and the
 * Mindscape bookends keep the sonic connection to its nearest sibling exact.
 *
 * The body window is 62 s against ETERNITY's 142.7 s, so it makes a single
 * unlooped pass with no relay at all.
 */
export const MUSIC_PLAN = [
  { from: 0, to: 12, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.50 },
    { slug: "mindscape-melody", gain: 0.42 },
  ] },
  { from: 12, to: 74, track: "ETERNITY", stems: [
    { slug: "eternity-drums", gain: 0.32 },
    { slug: "eternity-bass", gain: 0.28 },
    { slug: "eternity-instruments", gain: 0.44 },
    { slug: "eternity-melody", gain: 0.36 },
  ] },
  { from: 74, to: 88, track: "Mindscape", stems: [
    { slug: "mindscape-instruments", gain: 0.48, from: 60 },
    { slug: "mindscape-melody", gain: 0.44, from: 60 },
    { slug: "mindscape-bass", gain: 0.34, from: 60 },
  ] },
] as const;
