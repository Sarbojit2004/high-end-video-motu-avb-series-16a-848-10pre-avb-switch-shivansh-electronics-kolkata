/**
 * THE CURATED SELECTION — Section 0a.
 *
 * 60 of the repository's 120 unique product images, chosen by looking at every
 * one of them on per-product contact sheets (scripts/sheets.mjs), not by
 * filename and not by quota. The reasoning for each block is written down here
 * because Section 0a asks for the curation to be visible and justified rather
 * than silent.
 */

export const HOOK = [
  82,  // studio: console + monitors, the room being outgrown
  14,  // a second room — the same problem, twice
  63,  // 16A rear cable fan on black: the cabling reality, dramatic
  90,  // 848 rear cable fan: the same wall, a second time
  107, // 848 front on black — the first product tease, held back to a glimpse
];

export const THESIS = [
  30, 76, 85,   // 10pre / 16A / 848 front elevations — the peer triptych
  9, 62, 18,    // ECOSYSTEM MONTAGE: mic combos / line-out bank / talkback+ABC.
                // Three visibly different front panels under one claim.
  24,  // ESS Sabre32 — the shared converter
  26,  // Thunderbolt 4 / USB4 — the shared host connection
  43,  // CueMix Pro badge — the shared mixer
  31,  // device discovery listing 10pre + 848 + 16A together in one window:
       // the ecosystem stated by the software itself, not by a graphic
  11,  // CueMix running on a monitor — the shared console, in use
  105, // round-trip latency diagram — the shared engine's measured result
];

export const CAPTURE_10PRE = [
  39,  // hero — Macro-to-Full-Reveal
  35,  // rear elevation — Port Density Sweep across the combo row
  5,   // send/return inserts, channels 1-2
  15,  // 3.9in RGB TFT, the wide meter shot
  16,  // eight DC-coupled line outputs
  27,  // two independent headphone outs
  38,  // front-right three-quarter — the second hero angle
  37,  // rear three-quarter
];

export const ROUTE_16A = [
  79,  // hero — Macro-to-Full-Reveal
  51,  // rear elevation, the 32-jack wall — Port Density Sweep
  62,  // sixteen line outputs, macro     (also carries the thesis montage)
  60,  // optical + line-out rear row
  74,  // rear power / word clock / network / optical, on white
  54,  // CueMix patch bay, blue — the routing story's software hero
  55,  // CueMix patch bay, purple — the same matrix, re-patched
  58,  // dual RGB displays
  21,  // modular synth wall — what a DC-coupled output is actually for
  56,  // laptop + 16A, in the room
  73,  // CueMix Pro for iOS on an iPad
  77,  // rear three-quarter
];

export const COMMAND_848 = [
  110, // hero — Macro-to-Full-Reveal
  18,  // talkback / A / B / C / MUTE / MONO  (also carries the thesis montage)
  95,  // four XLR-TRS combo inputs
  93,  // inserts beside the combo pair
  88,  // two independent headphone outs
  97,  // monitor group
  94,  // 3.9in RGB TFT
  89,  // twelve DC-coupled line outputs
  91,  // network / optical / line rear cluster
  108, // rear three-quarter
  98,  // CueMix patch bay for the 848
];

export const NETWORK = [
  20,  // the built-in NETWORK port on an interface's own rear — Data Flow Reveal
  112, // AVB Switch, six ports lit — Macro-to-Full-Reveal
  116, // AVB Switch front panel, branding legible
  117, // CAT-5e/6 patch cable
  115, // IEEE 802.1 AVB mark
  100, // Milan certification mark
  113, // rendered network topology
  68,  // topology diagram — interfaces daisy-chained through the switch
  118, // gPTP clock
  119, // guaranteed quality of service
  120, // latency gauge
];

/** The closing four-product Ecosystem Montage — one hero angle per product. */
export const CLIMAX = [41, 80, 111, 114];

export const CURATED = [
  ...HOOK, ...THESIS, ...CAPTURE_10PRE, ...ROUTE_16A,
  ...COMMAND_848, ...NETWORK, ...CLIMAX,
];

/** Both logos, used in every segment via the Brand components. */
export const LOGOS = [121, 122];

/**
 * DELIBERATELY LEFT OUT — Section 0a asks for this to be stated, not silent.
 *
 *  ~20 CueMix Pro UI panels (2, 19, 28, 29, 32, 33, 34, 36, 44, 46, 48, 50, 52,
 *      53, 59, 64, 66, 72, 75, 96, 99) — near-identical dark screenshots that
 *      read as one texture at portrait phone scale. Four visually distinct ones
 *      were kept instead: the two patch bays, the discovery window and the badge.
 *   5  bundled sample-pack covers (57, 83, 84, 92, 102) — third-party artwork,
 *      the weakest link to a four-product ecosystem thesis, and 298 s has no
 *      room for a bundled-software segment.
 *   6  connectivity / line-art schematics (4, 6, 67, 69, 103, 104) — dense
 *      technical diagrams that are illegible at 1080 wide on a phone.
 *   2  of the three identical 10.09:1 16A front strips (45, 47, 49 -> none kept;
 *      51 rear and 76 front carry the 16A's geometry far better).
 *   2  of the three iPad shots (12, 22, 106 -> kept 73 only).
 *   2  duplicate round-trip-latency diagrams (8, 71 -> kept 105).
 *   1  duplicate Thunderbolt mark (87 -> kept 26).
 *   1  duplicate topology diagram (23 -> kept 68).
 *      plus duplicate meter shots (7, 101), products-on-black variants beyond
 *      the one kept as a hook tease (40, 81), the dark desk lifestyle (42),
 *      the reverb plugin panel (25), both USB-C cable renders (10, 61), and
 *      assorted rear-detail repeats (1, 3, 13, 17, 65, 70, 86, 109, 3).
 *
 * Nothing was dropped to keep per-product counts even, and nothing weak was
 * added to raise one. The AVB Switch has only three images in the repository
 * and all three are used; it is not padded, and it still gets a 40 s segment,
 * carried by the nine network-category images alongside it.
 */
