# MOTU AVB Series ecosystem — three 178 s portrait reels

Three standalone reels for **Shivansh Electronics**, Authorized Distributor of
MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India.

| Reel | Focus | Output |
|---|---|---|
| 1 — The Source | MOTU 10pre + shared engine | `out/motu-avb-reel-1-source.mp4` |
| 2 — The Matrix | MOTU 16A + software control | `out/motu-avb-reel-2-matrix.mp4` |
| 3 — Command & Scale | MOTU 848 + AVB Switch | `out/motu-avb-reel-3-command-scale.mp4` |

**1080×1920, 30 fps, 178 s each (5,340 frames).** Light background throughout.
Each reel stands alone with its own hook, body and complete CTA.

This project is separate from the ecosystem's long-form video and from the prior
reel build at the repository root. It shares the repository's image and music
assets and nothing else — no scene code, no beat structure, and in particular
none of the prior build's approach to image treatment.

## Quick start

```bash
cd reels
npm install
npm run setup            # stage images + fonts, synthesize SFX, stage music stems
npm run validate-audio   # both audio layers
npm run verify           # typecheck + content guard + coverage + branding (all 3 reels)
npm run qa               # a still per beat, checked for light ground
npm run render:reel1     # 178 s reel   (also :reel2, :reel3)
npm run render:thumb1    # 1080x1920 thumbnail   (also :thumb2, :thumb3)
npm run render:audio1    # the two standalone audio deliverables   (also :audio2, :audio3)
```

`qa` and `whole-unit` take the reel number through the `REEL` environment
variable (`REEL=2 npm run qa`); `coverage` and `branding` take it as an argument
(`node scripts/coverage.mjs 2`). `npm run verify` runs all three reels.

`npm run setup` is required before the first render — `public/` is generated
from the repository's own source assets and is not committed.

This container ships Chromium and blocks Remotion's browser-download host, so
`remotion.config.ts` points at the local binary. Override with
`REMOTION_BROWSER_EXECUTABLE`.

## Caption-safe zone

Text, logos and callouts stay clear of the **top 180 px and bottom 220 px**;
background imagery may extend into them. `<Frame>` enforces it, and the QA still
pass renders those bands tinted so a violation is visible at a glance.

The Neumann reel this project is modelled on uses `marginTop: 96,
marginBottom: 150` and places brand plates 110 px from the bottom — looser than
this, and inside the band platform UI actually occupies. These reels take the
more conservative numbers deliberately.

## Image treatment

**Every image is shown complete.** All imagery renders through `<Plate>`
(`object-fit: contain`), so an image that appears is an image shown whole. Where
an aspect ratio does not match its slot the difference is absorbed by ground
treatment, never by cropping into the subject. Each image's own background is
auto-detected from its four corners at asset-copy time, so white-ground images
dissolve into the page and black-ground images get a deliberate card.

### The runtime squeeze, and how it is resolved

Three reels × 178 s = **534 s** covering the same 120 unique images the
ecosystem's long-form format covers in 898 s — about 60% of the room per image.
The resolution is **not** cropping. Per reel: only **four** images earn a full
Macro-to-Full-Reveal or Port Density Sweep; everything else gets a faster but
still complete, uncropped pass; and lower-priority context images move into
multi-image montages where each tile is still shown whole.

### Source images

141 files → **122 unique**. 19 files are byte-identical duplicates of another
file, confirmed by format-agnostic pixel hashing rather than filename
similarity. The filename product prefixes are unreliable — `MOTU 10pre (23).jpg`,
`MOTU 16A (3).jpg` and `MOTU 848 (6).jpg` are the same file — so every image was
classified by visual inspection. 120 product images divide across the three
reels with no overlap and nothing left over: **Reel 1: 34, Reel 2: 50,
Reel 3: 36.** The two logos appear in all three.

## Audio

**Layer 1 — music.** The repository supplies **five** full instrumental tracks
(the brief says four) plus 17 stems. Deployment is a **Path B body with a Path A
signature**: each reel's body is scored by the track that matches its product —
GIFTED for Reel 1 (highest dynamics of the five, 0.473, tracking energy), DIABLO
for Reel 2 (dense, synth-forward, routing), ETERNITY for Reel 3 (loudest and most
driving, the closing chapter) — while **every reel opens its hook and
closes its CTA on Mindscape**, the only supplied track long enough to cover
178 s unlooped and the calmest of the five. That gives the set one recognisable
sonic signature at the two moments a viewer notices most, without layering
unrelated tempi and keys over one another. Stems are never layered across
tracks; seams crossfade over 1 s.

**Layer 2 — transition/foley.** All **21** sounds are synthesized from raw PCM
in `scripts/make-sfx.mjs`. Nothing comes from ElevenLabs or any other external
audio service. The palette is larger than the long format's 15 because reel
cadence fires SFX far more often — a transition on every cut plus accents inside
each beat — and a smaller set would repeat audibly inside a single 178 s reel.
Per Brief Stage 11 there are no cinematic low-frequency whooshes;
`scripts/validate-audio.mjs` enforces ≤2% of each file's energy below 400 Hz.

## Verification

```bash
npm run verify                 # typecheck, content guard, coverage, branding cadence
REEL=2 npm run qa              # a still per beat, checked for light ground
REEL=2 npm run whole-unit      # every camera move resolves to the whole unit
node scripts/coverage.mjs 2
node scripts/branding.mjs 2
```

- **`guard.mjs`** — scans everything that can reach the screen for TASCAM, any
  competing audio-interface manufacturer, any other brand relationship, and
  incorrect / rounded / blended pricing. It extracts string literals and JSX
  text rather than raw source, so `zoom={2.6}` is not mistaken for a brand.
- **`coverage.mjs`** — every image assigned to the reel appears in it, *and*
  the beat's layout actually renders it. A beat can list an image its layout
  ignores (`ecosystemSplit` did exactly that), which would report coverage the
  viewer never gets; the script reconciles each beat's image list against what
  its layout puts on screen.
- **`whole-unit.mjs`** — the two camera moves scale their container above 1.0
  inside `overflow: hidden`, so *during* a move the frame is a crop by design.
  This renders the last frame of every beat carrying a move and asserts the
  transform has resolved to ≤1.0, i.e. the complete unit is on screen before the
  cut. It caught `PortSweep` ending at 1.02 on its final visible frame.
- **`branding.mjs`** — no Shivansh gap over 25 s, MOTU present mid-reel, website
  the most-repeated single detail.
- `src/Root.tsx` throws at load if a schedule does not sum to exactly 178 s.

## Logos

Both logos are used **exactly as supplied**: opaque, with their own white
background intact, never alpha-keyed, and never inside a box, card or plate.
They sit directly on the video, resized per placement, clear of the safe zone.
The page palette is held within ~1–4% of white so the logos' own ground reads as
continuous with it.

A `mix-blend-mode: multiply` approach was tried and rejected — `Scene` applies a
transform for its entrance, which creates a stacking context and isolates the
blend, leaving a visible white rectangle over dark content: precisely the boxed
look the rule forbids.

## Typography

Fraunces + Archivo, ported from the Neumann reel's own committed woff2 files.
Per Brief Stage 10, Archivo carries the weight (uppercase tracked headlines,
spec callouts with tabular numerals, micro-callouts); Fraunces is held back for
editorial beats. Sizes are set for a **phone**: headlines 104–126 px, subheads
34–42 px, spec values 54–66 px, micro labels never below 20 px.

The reference's *colours* are not ported — it is a dark-ground video
(`ink #0C0D10`, ivory type). The whole palette was re-derived light and
contrast-checked against MOTU's dark brushed-metal chassis and RGB TFT greens.
Every value is ≥4.5:1 on the page; body text is ≥7:1.
