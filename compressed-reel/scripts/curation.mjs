/**
 * THE DEEPER CURATED SELECTION — Section 0a.
 *
 * 26 images, drawn ENTIRELY from the 298 s master reel's own curated 61. Per
 * Section 0a this reel's job is to find the strongest subset of that subset,
 * not to re-litigate the original curation from the full 120-image inventory.
 * Nothing was pulled back from the master reel's excluded set: its curation
 * held up, and every image below was already judged strong there.
 *
 * The selection criterion changed, though, and that is the whole point. The
 * master reel could afford images that reward a few seconds of attention. At
 * 88 s the question for every image became: DOES IT READ AT A GLANCE? Images
 * that need dwell time to decode — spec-dense rear panels, CueMix UI variants,
 * lifestyle shots, icon sets — are gone regardless of how good they are, because
 * this reel's cadence would show them without giving the viewer time to see them.
 */

// ── The hook, fused with the thesis (Section 4, beat 1) ──────────────────────
// Three front panels that could not look more different, under one claim. This
// is the master reel's own strongest Ecosystem Montage, promoted to the opening
// because at 88 s the thesis cannot wait for a problem statement first.
export const HOOK = [
  9,   // 10pre — ten mic/line/instrument combos. Reads as "preamps" instantly.
  62,  // 16A — sixteen line outputs and no preamps at all.
  18,  // 848 — talkback, A/B/C, mute, mono. The fastest-reading panel in the set.
];

// The same three units whole, as peers. Setup and payoff of one argument.
export const THESIS = [30, 76, 85];

// ── The ecosystem flow (Section 4, beat 2) ──────────────────────────────────
export const FLOW = [
  24,  // ESS Sabre32 — the shared converter, legible in under a second
  26,  // Thunderbolt 4 / USB4 — same
  79,  // 16A hero — MACRO-TO-FULL-REVEAL #1 (see below)
  51,  // 16A rear elevation — Port Density Sweep across the 32-jack wall
  39,  // 10pre hero — the most legible product photograph in the inventory
  35,  // 10pre rear elevation — eight combos across the back
  110, // 848 hero
  97,  // 848 monitor group
  54,  // CueMix patch bay — the routing story in one blue screenshot
  11,  // CueMix on a monitor — the shared console, in use
  31,  // device discovery: ALL THREE interfaces in one software window. The
       // single most efficient image in the whole inventory for this thesis.
];

// ── Network & scale (Section 4, beat 3) ─────────────────────────────────────
export const NETWORK = [
  20,  // an interface's own built-in AVB port — Data Flow Reveal
  68,  // topology: interfaces daisy-chained through the switch
  112, // AVB Switch, six ports lit — MACRO-TO-FULL-REVEAL #2 (see below)
  115, // IEEE 802.1 AVB mark
  100, // Milan certification mark
];

// ── Synthesis & CTA (Section 4, beat 4) ─────────────────────────────────────
// One hero angle per product — the closing ecosystem climax.
export const CLIMAX = [41, 80, 111, 114];

export const CURATED = [...HOOK, ...THESIS, ...FLOW, ...NETWORK, ...CLIMAX];

/** Both logos, used via the Brand components rather than any beat image list. */
export const LOGOS = [121, 122];

/**
 * MACRO-TO-FULL-REVEAL — reserved for exactly two moments (Section 3).
 *
 *   #1  image 79, the MOTU 16A hero, at ~0:18.
 *       Chosen on technique grounds rather than product favouritism. The 16A's
 *       front panel is the one that does NOT explain itself — sixteen jacks and
 *       no gain knobs — so opening macro on a jack detail and pulling out to the
 *       whole unit is the reveal doing the job the technique exists for. The
 *       10pre (visible preamp knobs) and the 848 (visible talkback and A/B/C)
 *       both read instantly from their panels and land fine in montage solos,
 *       so spending a second reveal on either would buy nothing.
 *
 *   #2  image 112, the MOTU AVB Switch, at ~1:04.
 *       The product a viewer is least likely to recognise, with the smallest
 *       narrative footprint in every prior build, and the literal payoff of the
 *       "one network" claim. This is what stops the Switch reading as an
 *       afterthought — without promoting it to peer-tier fourth interface,
 *       which Fact 1 forbids.
 *
 * Everything else gets a montage solo pass (still full-size and uncropped), a
 * Port Density Sweep, or a Data Flow Reveal.
 */

/**
 * DELIBERATELY LEFT OUT of the master reel's 61, and why — Section 0a asks for
 * this to be visible.
 *
 *   Spec-dense rear panels and connector clusters (5, 15, 16, 27, 37, 38, 58,
 *     60, 74, 77, 88, 89, 91, 93, 94, 95, 98, 108): each needs a beat of its own
 *     to be read. At this cadence they would flash past as dark textures.
 *   CueMix UI variants (55, 43, 105): 54 and 11 already carry the software
 *     claim; a second patch bay adds nothing at a glance.
 *   Lifestyle and context (82, 14, 21, 56, 63, 73, 90, 107): these set a mood,
 *     and mood is the first thing an 88 s runtime cannot afford.
 *   Network icon set (113, 116, 117, 118, 119, 120): the clock, QoS rosette,
 *     gauge and cable are supporting evidence for a claim this reel states once
 *     and moves on from. 115 and 100 carry it alone.
 *
 * ALL FOUR PRODUCTS REMAIN REPRESENTED (Section 0a's one standing requirement):
 *   10pre 5 · 16A 6 · 848 5 · AVB Switch 2 · Network 3 · Shared 5.
 * The AVB Switch's two is proportionate to its established smaller narrative
 * footprint, not a silent drop — and it still receives one of the only two
 * Macro-to-Full-Reveals in the entire reel.
 */
