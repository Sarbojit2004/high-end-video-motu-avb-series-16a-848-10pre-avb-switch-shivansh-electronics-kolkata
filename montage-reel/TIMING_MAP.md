# TIMING MAP — MOTU AVB Ecosystem 90-second montage reel

Locked before any composition work (brief §10 step 3 / §11). Every number
below is derived from the two supplied tracks' actual beat grids, measured with
`scripts/analyze-music.mjs` (grid-search of BPM/phase against onset strength +
low-band kick flux; see `public/audio/analysis/sections.json`).

## Master grid

| | |
|---|---|
| Master tempo | **89.52 BPM** — the native tempo of the Danny section that opens the reel (no stretch) |
| Seconds per beat | 0.670241 s |
| Frame rate | 60 fps → 40.2145 frames per beat |
| Reel length | **134 beats = 5389 frames = 89.817 s** |
| Smallest cut unit | ½ beat (20 frames, 0.335 s) — used only in stutter bursts |

Both tracks are half-time-feel at ~86–90 BPM, so one uniform beat grid spans
the whole reel. Every section is pitch-preservingly tempo-matched to 89.52 BPM
(`atempo`, ≤ 2.4 %, inaudible) so every cut can land on a beat of the *bed*,
not an approximate clock second.

## Acts (beat → frame → seconds)

| Act | Beats | Frames | Time | Length | Music |
|---|---|---|---|---|---|
| 0 Cold open | 0 – 9 | 0 – 362 | 0:00.000 – 0:06.033 | 6.03 s | Danny pre-drop build |
| I 16A | 9 – 41 | 362 – 1649 | 0:06.033 – 0:27.483 | 21.45 s (8 bars) | Danny drop #1 |
| II 848 | 41 – 73 | 1649 – 2936 | 0:27.483 – 0:48.933 | 21.45 s (8 bars) | Ian Asher chorus #1 |
| III 10pre | 73 – 105 | 2936 – 4223 | 0:48.933 – 1:10.383 | 21.45 s (8 bars) | Ian Asher chorus #2 (loudest) |
| IV Switch / ecosystem | 105 – 125 | 4223 – 5027 | 1:10.383 – 1:23.783 | 13.40 s (5 bars) | Danny final drop |
| V Branding close | 125 – 134 | 5027 – 5389 | 1:23.783 – 1:29.817 | 6.03 s | Danny ending + hard stop |

Act openings (beats 9, 41, 73, 105) are all bar-line downbeats of the bed, and
all four coincide with a drop/chorus downbeat of the source track.

## Music bed (source → reel)

| Reel beats | Reel time | Source | Source range | Stretch | Why this section |
|---|---|---|---|---|---|
| 0 – 41 | 0:00.000 – 0:27.483 | `D A N N Y - TAKE ME` | 19.478 → 46.958 s | ×1.0000 | Build (19.5–25.5) under the cold open, then drop #1 — first high-energy section (RMS peak 0.48). Danny's *second* drop lands exactly on the cut at 27.483, so the handoff replaces one drop with another. |
| 41 – 73 | 0:27.483 – 0:48.933 | `Ian Asher - Take Me (To The Moon)` | 24.990 → 46.943 s | ×1.02356 (87.46 → 89.52) | First chorus; its 2-bar breakdown (44–47 s) lands under Act II's serif "breathing" close beat. |
| 73 – 105 | 0:48.933 – 1:10.383 | `Ian Asher - Take Me (To The Moon)` | 68.886 → 90.819 s | ×1.02262 (87.54 → 89.52) | Second chorus — the track's highest-energy section (RMS 0.41–0.45), driving the fastest-cut act. Same-track splice at a bar line, masked by the Act III opening glitch + impact. |
| 105 – 134 | 1:10.383 – 1:29.817 | `D A N N Y - TAKE ME` | 111.476 → 129.103 s (track end) | ×1.00765 (88.84 → 89.52) | Final drop (RMS 0.48) opens the ecosystem payoff; the track's real hard-stop ending lands at reel 1:26.43 under the static branding lockup, and the last 3.4 s ring out. |

Combination approach: **alternating** (not layering). The two tracks are 3.4 %
apart in tempo and in different keys; layering would smear. Each handoff is a
hard cut on a shared downbeat + a 12 ms crossfade + a transition-SFX hit.

Loudness: each section is two-pass `loudnorm` to −10 LUFS integrated / −1 dBTP
before concatenation, so the four sections sit at one level; the mixed bed is
then brick-wall limited at −1 dBTP. Transition SFX are mixed *under* the music
(−6 dB relative), never the reverse.

## Export split (brief §9)

| Part | Beats | Frames | Time | Music source |
|---|---|---|---|---|
| 1 of 3 | 0 – 41 | 0 – 1649 | 0:00.000 – 0:27.483 | Danny only |
| 2 of 3 | 41 – 105 | 1649 – 4223 | 0:27.483 – 1:10.383 | Ian Asher only |
| 3 of 3 | 105 – 134 | 4223 – 5389 | 1:10.383 – 1:29.817 | Danny only |

Splits sit exactly on the two Danny ↔ Ian handoffs so every part carries a
single music source; both split frames are hard cuts (act boundaries), never
mid-transition or mid-hold.

## Shot budget

120 unique product images (139 files; 15 byte-identical groups; 1 Moog
photograph excluded — see `public/images/manifest.json`).

| Act | Images | Beats | Slots | Mean hold |
|---|---|---|---|---|
| I 16A | 40 | 32 | 28 (incl. 3-image stacks) | 0.77 s per slot |
| II 848 | 31 | 32 | 27 | 0.80 s |
| III 10pre | 40 | 32 | 31 | 0.69 s |
| IV Switch + callbacks | 9 switch + 3 callbacks | 20 | 14 | 0.96 s |

Vertical 9:16 lets two or three landscape images stack in one frame, which is
how 40 images fit into 21 s without dropping below the brief's 0.6–1.2 s hold
range: each stacked frame is one slot, and each image inside it is still its
own distinct beat (staggered entry 6 frames apart).
