# MOTU AVB Series Ecosystem — long-form video (898 s / 14:58)

A single standalone long-form video covering the **MOTU 16A**, **MOTU 848**,
**MOTU 10pre** and **MOTU AVB Switch**, for **Shivansh Electronics**, Authorized
Distributor of MOTU (Mark of the Unicorn, USA) Interfaces for East and North East
India.

**1920×1080, 30 fps, exactly 26,940 frames.** Light background for the entire
runtime. No burned-in captions, no reserved caption band — the full frame is used.

This project is deliberately separate from the three-part reel that lives at the
repository root. It shares the repository's image and music assets and nothing
else: no scene code, no layout decisions, and in particular none of the reel's
approach to image treatment.

---

## Quick start

```bash
cd longform
npm install
npm run setup          # stage images + fonts, synthesize SFX, stage music stems
npm run verify         # typecheck + content guard + asset coverage + branding cadence
npm run render:chunks  # the 898 s video, rendered in 7 chapter-aligned chunks
npm run render:thumb   # 1920x1080 thumbnail
npm run render:audio   # the two standalone audio deliverables
```

`npm run setup` is required before the first render: `public/` is generated from
the repository's own source assets and is not committed.

### Rendering notes

This container ships Chromium and blocks Remotion's browser-download host, so
`remotion.config.ts` points the renderer at the local binary. Override with:

```bash
export REMOTION_BROWSER_EXECUTABLE=/path/to/chrome
```

`npm run render` does the whole 898 s in one pass. `npm run render:chunks` is
preferred: it renders one chunk per chapter and concatenates with a stream copy
(no re-encode), so a failure late in the timeline does not cost the whole run.
Set `RESUME=1` to keep completed chunks on a re-run.

---

## Deliverables

| File | What it is | In git |
|---|---|---|
| `out/parts/chunk-0*.mp4` + `npm run join` | The final render, music bed and SFX embedded | yes |
| `out/motu-avb-ecosystem-longform.mp4` | The joined master, produced by `npm run join` | no — see below |
| `out/thumbnail-motu-avb-ecosystem-longform.png` | 1920x1080 landscape thumbnail | yes |
| `out/motu-avb-longform-music-bed.flac` | Layer 1 alone, 898 s, exactly as deployed | yes |
| `out/motu-avb-longform-transition-sfx-timeline.flac` | Layer 2 alone, 898 s, every hit at its exact position | yes |
| `out/*.wav` | The same two files uncompressed, via `npm run make-wav` | no — 172 MB each |
| `out/motu-avb-ecosystem-longform-project.zip` | Self-contained project (safety net) | yes |
| `VO_SCRIPT_LONGFORM_MOTU_AVB_ECOSYSTEM.md` | Full timed narration script | yes |
| `ASSET_COVERAGE.md` | Per-image ledger — where each of the 122 images appears | yes |
| `BRANDING_CADENCE.md` | Timestamped list of every Shivansh and MOTU appearance | yes |

### Why the master and the WAVs are not single committed files

GitHub hard-rejects any file over 100 MB and git-lfs is not available in this
environment. The 898 s master is ~240 MB and each WAV is 172 MB, so:

- **The video** is committed as **seven chapter parts**, each well under the
  limit. `npm run join` recombines them with an ffmpeg stream copy — no
  re-encode, so the result is bit-identical to the master this project renders.
- **The audio** is committed as **FLAC**, which is lossless. `npm run make-wav`
  decodes both back to 48 kHz / 16-bit stereo WAV; the round trip is verified
  sample-identical (matching ffmpeg MD5) to the WAVs Remotion writes directly.

Nothing is downgraded by either route — both are exact, just packaged to fit.

```bash
npm run join       # out/parts/*.mp4  ->  out/motu-avb-ecosystem-longform.mp4
npm run make-wav   # out/*.flac       ->  out/*.wav
```

Both audio files are **898.00 s / 26,940 frames**, generated from the *same* schedule
that renders the picture. They drop onto the timeline at 00:00 and are already in
sync — no manual placement, no clip-by-clip alignment. Only loudness needs
adjusting against your recorded narration.

Levels as delivered: music bed **−22.0 dBFS RMS / −5.4 dBFS peak**, SFX timeline
**−46.4 dBFS RMS / −12.3 dBFS peak** (96% silence — it is a sparse transient
timeline, which is what makes it droppable). Narration around −16 dBFS sits
cleanly above the bed with the SFX transients still reading.

---

## Structure

Timing follows the creative brief's own Stage 15 long-form allocation:

| Chapter | Window | Length | Content |
|---|---|---|---|
| 1 | 0:00–1:30 | 90 s | The Hook & The Problem |
| 2 | 1:30–4:00 | 150 s | The Thesis — One Engine, Three Front-Ends |
| 3 | 4:00–6:30 | 150 s | Capture — the 10pre |
| 4 | 6:30–9:00 | 150 s | Routing — the 16A |
| 5 | 9:00–11:30 | 150 s | Command — the 848 |
| 6 | 11:30–13:30 | 120 s | The Network — AVB Switch & Milan |
| 7 | 13:30–14:58 | 88 s | Synthesis & CTA |

`src/schedule.ts` is the single source of truth for beat order, duration, image
assignment and SFX placement. Picture, music bed and SFX timeline all derive from
it, which is why the three stay in sync by construction.

---

## Image treatment

**Every image is shown complete.** All imagery renders through `<Plate>`, which is
`object-fit: contain` — an image that appears is an image shown whole. Where an
aspect ratio does not match its slot, the difference is absorbed by ground
treatment (the light page, a soft well, or a card), never by cropping into the
subject. The macro phases of `MacroReveal` and `PortSweep` are camera moves that
always resolve to the full unit within the same beat.

Each image's own background is auto-detected at asset-copy time from its four
corners, so images already on white dissolve into the page and images on black
get a deliberate card rather than reading as a stray dark rectangle.

`npm run coverage` regenerates `ASSET_COVERAGE.md` and fails the build if any
enumerated image is unaccounted for.

### A note on the source images

The repository contains **141 image files**, which resolve to **122 unique
images** — 19 files are byte-identical duplicates of another file, confirmed by
format-agnostic pixel hashing rather than filename similarity. The filename
product prefixes are not reliable: `MOTU 10pre (23).jpg`, `MOTU 16A (3).jpg` and
`MOTU 848 (6).jpg` are the same file. Every image was therefore classified by
visual inspection, and `asset-manifest.json` records that classification.

---

## Audio

**Layer 1 — music bed.** The repository supplies five full instrumental tracks
(the brief says four) plus 17 stems. This build never uses the full mixes; each
chapter is assembled from that chapter's own stems so the mix can be gated by
narrative function. Deployment is a deliberate Path A / Path B blend:

- **Mindscape** bookends the video (Ch1, Ch2, Ch7) and is the ecosystem's sonic
  signature — at −16.2 dBFS mean it is the only supplied track with real headroom
  to sit under narration, and the flattest envelope of the five.
- **GIFTED** scores Ch3 (10pre) — highest dynamics of the five, 0.473.
- **DIABLO** scores Ch4 (16A) — dense and synth-forward.
- **Black & Blue** scores Ch5 (848) — warmest and most spacious.
- **ETERNITY** scores Ch6 (Network) — loudest and most driving, for the climax.

Stems are never layered *across* tracks: unrelated tempi and keys would turn the
bed to mush. Chapters crossfade at the seams over 2 s.

**Layer 2 — transition/foley palette.** All 15 sounds are synthesized from raw
PCM in `scripts/make-sfx.mjs`. Nothing comes from ElevenLabs or any other external
audio service. Per Brief Stage 11 there are no cinematic low-frequency whooshes;
`scripts/validate-audio.mjs` enforces that every SFX file keeps ≤2% of its energy
below 400 Hz, which is the register that would muddy the bed.

```bash
node scripts/validate-audio.mjs   # decodes and checks both layers
```

---

## Verification

```bash
npm run verify   # typecheck, content guard, asset coverage, branding cadence
npm run qa       # renders a still for every beat into out/qa/ and checks each
```

- **`scripts/guard.mjs`** — scans everything that can reach the screen for TASCAM,
  any competing audio-interface manufacturer, any other brand relationship, and
  incorrect / rounded / blended pricing. It extracts string literals and JSX text
  rather than scanning raw source, so identifiers like `zoom={2.4}` are not
  mistaken for manufacturers.
- **`scripts/coverage.mjs`** — every enumerated image accounted for; chapter
  budgets exact; total exactly 26,940 frames.
- **`scripts/branding.mjs`** — no gap over 40 s between Shivansh appearances,
  every chapter carries one, MOTU present mid-video, website the most-repeated
  single detail.
- **`scripts/qa-stills.mjs`** — one still per beat, checking the page ground stays
  light in every one of them.

`src/Root.tsx` throws at load if the schedule does not sum to exactly 898 s, so a
timing drift is a build error rather than something found in the render.

---

## Logos

Both logos are used **exactly as supplied**: opaque, with their own white
background intact, never alpha-keyed, and never placed inside a box, card or
plate. They sit directly on the video, resized per placement. The page palette is
held in a near-white range (`COLORS.paper` and neighbours, 0xEF–0xFD) so the
logos' white ground is within ~4% of the page and reads as continuous.

---

## Typography

The type system is ported from the Neumann TLM 107 long-form build — Fraunces and
Archivo, self-hosted woff2, copied by `scripts/copy-assets.mjs`. Hierarchy follows
Brief Stage 10 rather than the reference's own usage: **Archivo carries the
weight** (uppercase tracked headlines, spec callouts with tabular numerals, micro
callouts), with **Fraunces held back** for the two editorial moments — the
Hook/Problem chapter and the Transformation beat.

The reference's *colours* are not ported. That video is dark-ground
(`ink #0C0D10`, ivory type); this one is light-ground, and the whole palette was
re-derived and contrast-checked against MOTU's dark brushed-metal chassis and RGB
TFT display greens. Every value is ≥4.5:1 on the page; body text is ≥7:1.
