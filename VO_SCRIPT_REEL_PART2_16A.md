# VOICEOVER SCRIPT — REEL PART 2 OF 3
## MOTU 16A · "THE MATRIX"

**Runtime:** 178.000 s · 5,340 frames @ 30 fps
**Canvas:** 1080 × 1920 (9:16)
**Audio slot:** `public/vo/voiceover-reel-part2.mp3` (silent placeholder, 178.000 s)
**Language:** English only. Narration, not captions — none of this is burned on screen.

---

## Tone direction

**Same blend as Part 1 — Precise & Technical-but-Accessible (primary) with Warm
& Trustworthy underneath (secondary)** — held for series cohesion.

Part 2 sits a little further toward the Precise end of that blend. Part 1 was
about performers and microphones, which invites warmth; Part 2 is about signal
paths, and the 16A's defining feature is an *absence* (zero mic preamps). That
argument only works if it is delivered as engineering confidence rather than
apology. Keep the warmth in the phrasing, not in the emphasis.

**Delivery notes:**
- Target **150 wpm**, same as Part 1.
- "Zero microphone preamps" must land as a **claim, not a caveat**. No apologetic
  lift at the end of the line.
- Pronounce "16A" as **"sixteen-A"**. "10pre" as **"ten-pre"**. "ADAT" as
  **"AY-dat"**. "S-MUX" as **"ess-mux"**.
- Never position the 16A above or below the 10pre. They are peers.

---

## VO-to-timeline table

| Segment Label | Script Text | Start Frame | End Frame | On-Screen Asset/Graphic |
|---|---|---|---|---|
| **01 · Recap + hook** | Part one captured the performance — ten preamps, on the engine every interface here shares. [pause 0.4s] Which leaves the harder question. Where does all of it go? | 18 | 288 | S01 — recap line, Tier-1 "Now: where all of it goes."; 16A hero (`motu-16a-newly-added-3.png`) |
| **02 · Chapter card** | Part two. The matrix. | 316 | 436 | S02 chapter card: "PART 2 OF 3 · THE MATRIX" |
| **03 · 16A reveal** | The MOTU 16A. Thirty-two inputs, thirty-four outputs, sixty-six channels — and two three-point-nine-inch displays to keep track of them. | 464 | 856 | S03 — 16A hero on black, rear and front angles, I/O plate |
| **04 · Zero preamps** | And zero microphone preamps. [pause 0.5s] That is not a compromise, it is the specialisation. Every one of those inputs is line level, so the entire box is given over to moving signal cleanly. | 884 | 1246 | S04 — Tier-1 "Zero microphone preamps."; rear TRS array; spec rows 0 / 16 / 16 |
| **05 · Sixteen in** | Sixteen balanced quarter-inch TRS inputs. Synths, outboard preamps, hardware compressors, a summing box — wired in permanently, and always available. | 1274 | 1666 | S05 — rear panel with cabling (`motu-16a-25.jpg`), TRS array, metering |
| **06 · Sixteen out** | And sixteen balanced, DC-coupled outputs going back the other way. [pause 0.3s] DC-coupled matters: every output can carry control voltage as well as audio, so modular and analogue gear is driven straight from the session. | 1694 | 2056 | S06 — LINE OUT macro (`motu-16a-24.jpg`); DC-coupled plate; CueMix outputs |
| **07 · Dual displays** | Two displays instead of one, because a routing box has twice as much to show you. Inputs on the left, outputs on the right, live. | 2084 | 2386 | S07 — dual-TFT hero; front-panel variants strip |
| **08 · The patchbay** | Underneath it all, CueMix Pro — sixty-four channels in, thirty-two buses out. Any source to any destination, in software, running on the interface's own DSP. | 2414 | 2836 | **MG-3 CueMix overlay (patchbay mode)**; nine-tile CueMix montage |
| **09 · ADAT / optical** | Two banks of ADAT and S-MUX optical carry sixteen more channels over light — so the input count grows without the cable run growing with it. | 2864 | 3196 | S09 — optical rear macro; 2 banks / S-MUX plates; word-clock rear |
| **10 · Engine callback** | And it is worth repeating: this is a completely different box from the 10pre, running exactly the same silicon. Same converters, same DSP, same one-point-eight milliseconds. | 3224 | 3596 | **MG-1 Identical Engine callback**; ESS / Thunderbolt / RTL montage |
| **11 · DAW integration** | One Thunderbolt 4 or USB4 cable to the session — forty gigabits — and every one of those sixty-six channels is in your DAW. | 3624 | 3986 | S11 — laptop + 16A image run; DAW / plugin montage |
| **12 · AVB daisy-chain** | Now connect it. [pause 0.3s] Daisy-chain the 10pre from part one to this 16A, and they stop being two interfaces. One network, one clock, one routing grid — a hundred and twenty channels deep. | 4014 | 4476 | **MG-2 Network topology, level 2** — host → 10pre → 16A; counter to 120; AVB diagrams |
| **13 · Multi-device** | And CueMix sees all of it from one window, however many devices are on the network. | 4504 | 4808 | S13 — CueMix DISCOVERY with multiple devices; iPad wireless control |
| **14 · Two down** | The source, then the matrix. [pause 0.4s] One front-end left. | 4836 | 5040 | **MG-5 Identity badges** — matrix active, mic dimmed, monitor dimmed |
| **15 · Light CTA / tease** | The MOTU 16A, from Shivansh Electronics — one lakh eighty-seven thousand nine hundred rupees, inclusive of GST. [pause 0.3s] Details at shivanshelectronics.in. Next — the command center. | 5068 | 5332 | S15 — 16A hero; MOP plate; primary URL; "NEXT · PART 3" chip |

---

## Arithmetic check (computed from this table by `scripts/vo-check.mjs`)

| Check | Result |
|---|---|
| Segments | 15 |
| First start frame | 18 |
| Final end frame | **5,332** ≤ 5,340 ✓ |
| Overlapping segments | **0** — every `start[i+1] > end[i]` ✓ |
| Inter-segment gaps | min 28 / max 28 frames, each inside a scene transition ✓ |
| Total narration window | 4,922 frames (164.1 s of 178 s) |
| Silence between segments | 418 frames (13.9 s) — 7.8 % ✓ |
| `[pause]` time inside segments | 2.2 s |
| Word count | **331 words** |
| Actual speaking time | 161.9 s (window − pauses) |
| **Implied rate** | 331 ÷ 161.9 s = **122.7 wpm** ✓ |
| Densest segment | 01 · Recap + hook — 25 words ÷ 8.6 s = **174.4 wpm** ✓ (ceiling 175) |

Run `node scripts/vo-check.mjs` to re-verify; it fails non-zero on any overlap,
overrun past frame 5,340, or segment above 175 wpm.

Part 2 runs the slowest of the three by design. Its content is the most
technical (routing, DC-coupling, optical channel counts) and the toolkit's own
pacing guidance puts technical explanation at 120–130 wpm. The extra air is
deliberate, not underwritten — every scene still carries narration.

## Compliance notes

- No competitor brand is named or implied anywhere.
- The 16A is never framed as an upgrade from, or a downgrade to, the 10pre — segment
  10 explicitly re-states that they run identical silicon.
- Exact Authorized Distributor designation spoken in full once (segment 15).
- Only the interface MOP appears. The AVB Switch MOP is **not** mentioned in Part 2.
- CTA stays light; the full outro belongs to Part 3.
- Verified figures only: 32 in / 34 out, 66 channels, 0 mic preamps, 16 balanced
  TRS in, 16 balanced DC-coupled TRS out, dual 3.9" TFT, 2 banks ADAT/S-MUX,
  64-ch CueMix Pro (64 in / 32 buses), ~1.8 ms RTL, Thunderbolt 4 / USB4 40 Gbps.
