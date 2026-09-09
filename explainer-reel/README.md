# MOTU AVB Ecosystem — 3-minute narrated technical explainer

**Client:** Shivansh Electronics, Kolkata
**Runtime:** 180.000 s (5,400 frames @ 30 fps) · **2160 × 3840** (9:16, 4K portrait)
**Voice:** recorded by the client. No AI or synthesised narration anywhere in this build.

This is an **additive** deliverable. Nothing belonging to the prior reels in this
repository (`montage-reel/`, `master-reel/`, `reels/`, `longform/`,
`compressed-reel/`, the root `src/`) has been changed, and this reel shares no
typography, palette or motion vocabulary with any of them.

## Deliverables

| | Path |
|---|---|
| The reel | `out/motu-avb-explainer-reel.mp4` |
| Portrait thumbnail | `out/motu-avb-explainer-thumbnail.png` |
| Speech script for recording | `../VO_SCRIPT_EXPLAINER_REEL.md` |
| Coverage proof | `../ASSET_COVERAGE_EXPLAINER_REEL.md` |
| VO drop-in point | `public/audio/vo.wav` (silent placeholder, exactly 180.000 s) |

## Dropping the narration in

Record the script, save the take as `public/audio/vo.wav`, re-render. **No code
changes are needed** — a silent placeholder of exactly the right length already
sits at that path.

If the take runs long or short:

```bash
node --experimental-strip-types scripts/sync-vo.mjs
```

It measures where speech actually starts and stops (ignoring room tone at the
ends), compares that to the scripted timeline segment by segment, and says what
to change. Under ~1.5 s of drift, nothing needs changing at all.

## How it is built

Two derived data structures drive everything. There is not a single hand-typed
frame number in the render code.

```
src/script.ts   what is said, and when   →  narration governs the timing
src/shots.ts    what is shown, and when  →  derived from the caption groups
```

`script.ts` is the single source of truth for **both** the printed script the
client records and every on-screen caption, so the two cannot drift apart — they
are the same data. Each caption's duration comes from its spoken word count at
165 wpm, with numerals expanded to how they are actually said (`125 dB` is six
spoken words, not two), so a spec-dense line is budgeted the time it really takes
to read aloud.

| | |
|---|---|
| Script length | 461 words |
| Written speaking rate | 165 wpm (brief asks 150–165) |
| Effective rate over the runtime | 153.7 wpm — the difference is ~12 s of deliberate pauses |

## The visual language

Read off the supplied reference video (`20260909-0751-17_5275046.mp4`) frame by
frame, and applied to MOTU technical content. What transferred:

1. **Word-synced captions, not headline cards.** Short spoken phrases where words
   arrive one at a time, with per-word styling inside the line: pending words
   dimmed, settled words in neutral ink, and one word pulled out in the product's
   accent colour at the heaviest weight. This is the technique that makes the
   piece read as *speech* rather than as graphic design, which is why it suits a
   reel built to carry real narration. → `src/components/Caption.tsx`
2. **Photo-real staging.** Product photography lit and shadowed as though it were
   a render — cast shadows on the ground, a key light, reflections in the void.
   → `src/components/Staged.tsx`
3. **Two alternating environments** — warm cream and near-black — switching on
   segment boundaries so the four-product structure has a rhythm.
4. **Arcing motion**, never straight slides.
5. **A restrained particle drift.**
6. **A blueprint grid-dot patch**, edge-faded so it never reads as a rectangle.
7. **A small technical accent** — the reference's barcode, reinterpreted as the
   marks this ecosystem actually carries: link LEDs, a clock settling, a signal
   path, a sample-rate readout. → `TechMark` in `src/components/Environment.tsx`

Deliberately **not** carried over: the reference's emoji, its grey ribbon device,
its meme register and its subject matter. Those belong to a piece of social
commentary and would undercut a technical B2B explainer.

## Keeping four near-identical products apart

The hardest constraint in the brief: three of the four products are the same 1U
chassis, photographed from the same angles, running the same software. Four
things carry the distinction on every hardware frame:

| | |
|---|---|
| **Accent colour, held for the whole segment** | 16A `#C8322E` · 848 `#B9761A` · 10pre `#187A56` · AVB Switch `#1F5FD0` |
| **A persistent name plate** | not a one-off title card — on screen for the entire segment |
| **A differentiator stripe** | `0 PREAMPS · 16 LINE IN` vs `4 PREAMPS · A/B/C` vs `10 PREAMPS · 4 FRONT + 6 REAR`. The *name* does not distinguish three identical boxes; the difference does |
| **Segment progress hairline** | so a viewer knows where they are in three minutes |

## The shot plan

119 distinct images have to appear inside 180 s, and the brief also asks for
*longer* holds than a montage. Both are satisfied by giving the frame layers
instead of queuing images one per cut:

| Tier | |
|---|---|
| `hero` | one image, staged, 3–6 s — the image a sentence rests on |
| `pair` | two panel runs, front above rear |
| `strip` | ≤3 plates, each large enough to read |
| `grid` | 4–8 cells that assemble over ~1 s and then hold — **one composition, not a burst of cuts** |

Shots cut on caption-group boundaries, never on a beat grid.

Two things stop the automatic distribution from putting the wrong picture on a
sentence:

- **Subject classification.** Every image is tagged for what it *shows*
  (`hardware` / `context` / `ui` / `diagram` / `mark` / `bundle`), because the
  alpha channel does not tell you — the CueMix Pro roundel, the Thunderbolt mark
  and the latency diagram are all transparent PNGs. An earlier pass ranked on
  alpha alone and put a software logo on "Sixteen balanced line inputs".
- **Pinned shots** (`PINS` in `src/shots.ts`). Seventeen sentences have exactly
  one correct image in the whole library — "Four combo preamps on the front
  panel" has to be the macro of the four XLR/TRS combo jacks. Those are stated by
  hand, with a reason each; the rules fill in around them.

## The audio

Everything is synthesised from scratch in `scripts/gen_audio.py` — no sample
library, nothing downloaded. It replicates the DSP approach used by the TASCAM
Recording Series repository (biquad filters, explicit envelopes, comb-filter
reverb, stereo widening) **without importing its files**: that palette is named
for TASCAM mixer actions — fader-slide, knob-detent, relay-click, sd-insert,
db25-lock — which describe mechanical things a MOTU AVB interface does not do.
The vocabulary here is re-authored around what this ecosystem actually does:

`port-link` `net-lock` `stream-open` `clock-tick` `spec-latch` `data-sweep`
`seg-swell` `sub-drop` `caption-in` `whoosh-soft` `whoosh-bright` `whoosh-rev`
`whoosh-air`

`net-lock` is the one cue doing narrative work: two oscillators beating against
each other and pulling into unison, under the line about gPTP locking every
device to one clock.

**The mix is built for a voice**, which is the opposite of the silent montage
reels elsewhere in this repository where music was the driving layer:

- The bed is carved with a broad −7 dB dip at 1.6 kHz at synthesis time
  (`speech_pocket`), not left to a later ducking pass. Measured result: 37 dB of
  energy below 200 Hz against −0.5 dB across 1–4 kHz, where the voice lives.
- Every cue is short and deliberately placed out of the way — bright (>2.5 kHz)
  or sub (<120 Hz), never mid-heavy, so nothing masks a consonant.
- The bed's energy arc follows this film's six segments rather than looping.

## Commands

```bash
npm install

npm run assets     # dedupe + downscale the repo's product imagery, write src/assets.ts
npm run audio      # synthesise music bed, ambient bed, 13 SFX cues, VO placeholder
npm run script     # regenerate the printed speech script from src/script.ts
npm run plan       # print the shot plan and confirm coverage
npm run coverage   # write ASSET_COVERAGE_EXPLAINER_REEL.md (exits non-zero if incomplete)

npm run studio     # preview
npm run render     # 2160x3840 final
npm run thumb      # portrait thumbnail
npm run typecheck
```

### Rendering notes

This environment's network policy blocks Remotion's Chrome Headless Shell
download, so `remotion.config.ts` points at the Chromium already installed for
Playwright. Override with `REMOTION_CHROME=/path/to/chrome` if yours is
elsewhere.

At 2160 × 3840 the render is dominated by CSS `filter: blur()` and
`drop-shadow()` — each is a full-surface convolution at 8.3 megapixels. Soft
shadows here are drawn as radial gradients (which are already soft) rather than
blurred rectangles, which is worth roughly an order of magnitude on a
four-core machine.
