# MOTU AVB Series — Reel Series Build

Three portrait reels for the current-generation MOTU AVB Series (10pre, 16A, 848),
for **Shivansh Electronics — MOTU's Authorized Distributor for East and North East India**.

| Part | Title | Product | Runtime | Render |
|------|-------|---------|---------|--------|
| 1 | The Tracking Room | MOTU 10pre | 88.000 s | `renders/motu-reel-part1-10pre.mp4` |
| 2 | The Patchbay | MOTU 16A | 88.000 s | `renders/motu-reel-part2-16a.mp4` |
| 3 | The Control Room | MOTU 848 | 88.000 s | `renders/motu-reel-part3-848.mp4` |

**Format** 1080×1920 (9:16), 30 fps, 2,640 frames per part exactly.
Series total 264.000 s / 7,920 frames.

---

## Asset audit — read this first

The brief stated 117 distinct product images. Full enumeration and visual
inspection of every file found three things that differ from that:

1. **The 117 are not all distinct.** MD5 hashing finds 15 duplicate groups and
   **18 byte-identical redundant copies**, leaving **99 unique product images**.
   Three files appear under all three product names.
2. **Filenames do not identify the product depicted.** Several images filed
   under one product show another product's hardware, a third-party brand, or
   product-agnostic material — e.g. `MOTU 10pre (23).jpg` is a Moog modular
   synthesiser, `MOTU 10pre (26).jpg` is the ESS Technology logo, and
   `MOTU 10pre (21).jpg` is a CueMix screenshot whose own title bar reads
   "Proxy Device: 848". Allocation is therefore driven by **verified image
   content**, recorded in `remotion/assets.json`, not by filename.
3. **The asset mix is roughly half software.** 34 of the 99 unique images are
   CueMix Pro screenshots; genuine hero hardware photography runs to about
   12–14 images per product.

The 16A **dual 3.9" RGB TFT display** claim was checked against the repo's own
photography and is confirmed — two separate glowing panels on the 16A front
panel, against a single wide display on both the 10pre and the 848.

### Mandatory coverage

Every one of the 117 product images appears across the three reels combined.
Showing all 99 unique images covers all 117 filenames, because each duplicate's
pixels are on screen under its twin. This is machine-verified:

```bash
cd remotion && node verify-coverage.mjs
#   FILENAMES COVERED : 117 / 117
#   PASS
```

The audit walks repo file → md5 → catalogue entry → timeline segment, so it
fails if any image is dropped during editing. It caught a real defect during
the build: 8 catalogue entries had been transcribed against the wrong variant
of a shared basename, hiding 8 genuinely unique images (108/117).

---

## Layout

```
remotion/                Remotion 4 workspace
  src/theme.ts           palette, type scale, safe zones, brand constants
  src/components.tsx     stage, plates, typography, UI-highlight primitives
  src/AvbChain.tsx       AVB daisy-chain motif (vector, animated pulse)
  src/assets.ts          generated catalogue — do not hand-edit
  src/part{1,2,3}/
    timeline.ts          the single source of truth for that part
    Part{N}.tsx          scenes, one per voiceover segment
  src/thumbnails/        one thumbnail composition per part
  assets.json            content-verified catalogue (source of src/assets.ts)
  sync-assets.mjs        copies repo images into public/img/, emits assets.ts
  validate-timeline.mjs  frame continuity, runtime, pacing, per-part coverage
  verify-coverage.mjs    mandatory 117/117 audit
  emit-vo.mjs            emits the voiceover deliverable for a part

audio/
  synth.py               DSP primitives (oscillators, filters, reverb)
  score_common.py        shared scoring engine, parameterised per part
  score_part{1,2,3}.py   per-part arrangement + sound design
  out/                   generated wavs (gitignored)

voiceover/               frame-mapped voiceover scripts
thumbnails/              1080×1920 thumbnails, one per part
renders/                 final MP4s
```

`remotion/public/img/` and `audio/out/` are gitignored — regenerate with
`node sync-assets.mjs` and `python3 score_partN.py`.

---

## Build

```bash
cd remotion
npm install
node sync-assets.mjs            # populate public/img from the repo images

cd ../audio
pip install numpy scipy
python3 score_part1.py           # ~95 s each; writes music / sfx / bed wavs
python3 score_part2.py
python3 score_part3.py
cp out/bed_part*.wav ../remotion/public/audio/

cd ../remotion
node validate-timeline.mjs 1 2 3 # must print ALL CHECKS PASSED
node verify-coverage.mjs         # must print 117 / 117 … PASS
npx remotion render Part1 out/motu-reel-part1-10pre.mp4
npx remotion render Part2 out/motu-reel-part2-16a.mp4
npx remotion render Part3 out/motu-reel-part3-848.mp4
npx remotion studio              # interactive preview
```

---

## How the timing works

Each part's `timeline.ts` holds ten segments, each with its script text, an
exact frame range and the catalogue indices on screen during it. Scenes read
their duration from that file, so **narration and picture change together by
construction** — there is no separate estimate to drift out of sync.

`validate-timeline.mjs` enforces:

- frame continuity (no gaps or overlaps) and an exact 2,640-frame total
- speaking pace inside 1.9–2.55 words/second
- at least ~0.9 s of screen time per asset
- every catalogued asset for that part placed exactly once

Measured result:

| Part | Words | Overall w/s | Slowest beat | Fastest beat | Assets |
|------|-------|-------------|--------------|--------------|--------|
| 1 | 193 | 2.19 | 9.50 s/asset | 1.50 s/asset | 31 |
| 2 | 206 | 2.34 | 8.00 s/asset | 1.66 s/asset | 37 |
| 3 | 185 | 2.10 | 8.50 s/asset | 1.47 s/asset | 31 |

Part 2 is deliberately the quickest, per the brief's timing logic — 16A's
value proposition is line-level density, which reads fast. Parts 1 and 3 take
longer over the preamp split and the 7.1.4 output mapping respectively.

---

## Visual system

- **Light field throughout.** 90 of the 99 source images are dark-field, so each
  sits on a plate filled with **that image's own sampled edge colour**. A
  letterboxed image dissolves into its frame instead of showing hard bars, and a
  blurred copy of the image extends the field behind it.
- **No image is ever cropped.** Every asset is `contain`-fitted. The
  macro-to-scale reveal magnifies about a focal point and resolves to the
  complete, uncropped frame — the camera move never costs you product detail.
- **Safe zones.** Content is confined to y = 250…1580 with 90 px side margins.
- **No logo overlays in the reel bodies or on any thumbnail.** Marks already
  baked into supplied photography are left exactly as provided. The only logo
  usage in the project is the Part 3 CTA.

---

## Audio

All music and sound design is synthesised from first principles with
numpy/scipy. No samples, no libraries, no generation service.

One sonic identity carries across the series (A natural minor, i–VI–III–VII,
shared palette) with the arrangement re-weighted per part:

| Part | BPM | Character | Side/mid | Low-end share |
|------|-----|-----------|----------|---------------|
| 1 | 120 | driving, drum-forward | 0.578 | 45 % |
| 2 | 126 | tightly sequenced 16th arpeggio | 0.544 | 52 % |
| 3 | 112 | expansive, wide, reverb-heavy | 0.662 | 31 % |

Arrangement intensity is keyed to each part's voiceover segments, so the music
lifts and settles with the picture (full sections measure ~1.6–1.9× the intro).
Sub and kick stay mono; everything above 150 Hz is decorrelated, which keeps the
mix wide without collapsing on a phone speaker.

Sound design is cue-by-cue, placed at exact frames: scene-change sweeps,
macro-reveal swells, connector and patch-jack seating, monitor-switch depresses,
display wake shimmers, the AVB network pulse, and a closing resolve chord.

---

## Voiceover

`voiceover/VOICEOVER-PART{1,2,3}.md` carry the segmented scripts as frame-mapped
tables (segment · script · start · end · frames · seconds · words · w/s ·
on-screen assets), plus a continuous read for the voice talent.

**The spoken track is not rendered.** This environment has no TTS engine and no
provider credentials, so the reels ship with music and sound design only. The
bed is deliberately mixed low to receive a voiceover without re-balancing, and
because every beat is frame-anchored, dropping a recorded track over
`audio/out/bed_partN.wav` requires no re-timing.

---

## Accuracy constraints observed

- **Never a price or quality ladder.** All three units share one Market
  Operating Price (₹1,87,900) and one engine; they are presented as three
  specialised front-ends, never as entry-level / step-up / flagship.
- **No competitor or interoperability-partner brands** are named in narration,
  on-screen text, or implied by framing. Milan certification is stated as its
  substance — interoperation with other Milan-certified equipment across the
  professional audio industry — without naming third-party manufacturers.
- **Pricing terminology** is Market Operating Price / MOP throughout, never MRP.
  The CTA uses the identical-investment framing rather than three prices side by
  side, which would read as a comparison.
- **Distributor designation** is used unabbreviated in the reels; thumbnails use
  the permitted short form "Authorized Distributor — East & North East India".
  The territory is never generalised to "India" or "pan-India".
- **Current generation only** — all copy and photography covers the 2025
  Thunderbolt 4 / USB4 generation.
