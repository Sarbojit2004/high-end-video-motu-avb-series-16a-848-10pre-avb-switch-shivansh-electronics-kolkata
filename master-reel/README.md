# MOTU AVB Series ecosystem — one 298 s portrait master reel

A single standalone reel for **Shivansh Electronics**, Authorized Distributor of
MOTU (Mark of the Unicorn, USA) Interfaces for East and North East India.

**1080×1920, 30 fps, 298 s (8,940 frames).** Light background throughout.
Output: `out/motu-avb-master-reel-ecosystem.mp4`.

Unlike the three-part reel series, this reel is **not product-segmented**: it
presents all four products inside one ecosystem narrative, using a **curated
selection** of the strongest imagery rather than the full asset inventory.

## Quick start

```bash
cd master-reel
npm install
npm run setup            # stage curated images + fonts, synthesize SFX, stage music stems
npm run validate-audio   # both audio layers, before anything depends on them
npm run verify           # typecheck + content guard + coverage + branding cadence
npm run qa               # a still per beat, checked for light ground
npm run whole-unit       # every camera move + every clubbed image resolves whole
npm run render           # the 298 s master reel
npm run render:thumb     # 1080x1920 thumbnail
npm run render:audio     # the two standalone audio deliverables
```

`npm run setup` is required before the first render — `public/` is generated from
the repository's own source assets and is not committed.

This container ships Chromium and blocks Remotion's browser-download host, so
`remotion.config.ts` points at the local binary. Override with
`REMOTION_BROWSER_EXECUTABLE`.

## Where the reference values came from

This build references **no** part of the Neumann project. Every structural and
visual value is pulled from the two completed, approved MOTU AVB builds in this
same repository:

| System | Source | Value |
|---|---|---|
| Caption-safe zone | `reels/src/theme.ts` | `top 180, bottom 220, marginX 64` → 952×1520 |
| Light palette | `reels/src/theme.ts` | `paper #F6F8FA`, `ink #0E1116`, `slate #48525F`, `motuBlue #0B5FD0`, `signal #00845F` |
| Type system | `reels/src/fonts.ts` + `reels/public/fonts` | Fraunces + Archivo, same five tiers |
| Macro-to-Full-Reveal, Port Density Sweep, Gimbal, Data Flow, Ecosystem Split | `reels/src/components/` | reel-pace implementations |
| Macro-reveal breathing room | `longform/` | 35 / 65 ratio, given more room than 178 s allowed |
| Two-layer audio pipeline | `reels/src/audio.tsx` | schedule-driven music bed + synthesized SFX |
| Branding cadence guideline | `reels/scripts/branding.mjs` | ≤25 s Shivansh gap; MOTU sparing, incl. mid-reel |
| Music deployment path | `longform/src/schedule.ts` | Path A / Path B blend (read, not assumed) |

**A correction to the branch names in the brief.** The brief points at
`claude/motu-avb-three-part-reels-jhgg3y` as the approved reel series. That
branch holds an **earlier, superseded** build — `src/Part1-3.tsx`, chunked MP4
parts, `SAFE = {top: 250, bottom: 1580, marginX: 90}`, palette `#F2F1EE` — the
one whose image cropping was the named failure mode. The approved series is
`reels/` on `claude/motu-avb-longform-video-mbc8pu`, and that is what this build
mirrors. Raw source images live at the **repository root on all three branches**
(verified identical, 141 files); `main` is not a separate asset branch.

## Timing

Section 4's stated timestamps sum to 178 s, not 298 — they are the three-part
reel's timeline carried over. Since the brief says the intent is to preserve the
**long-form's** relative weighting, that is what was scaled (×298/898):

| Segment | Long-form | Here |
|---|---|---|
| The Hook | 90 s | 0:00–0:30 |
| The Thesis — One Engine, Three Front-Ends | 150 s | 0:30–1:20 |
| Capture — MOTU 10pre | 150 s | 1:20–2:10 |
| Route — MOTU 16A | 150 s | 2:10–3:00 |
| Command — MOTU 848 | 150 s | 3:00–3:50 |
| The Network — MOTU AVB Switch | 120 s | 3:50–4:30 |
| Synthesis & CTA | 88 s | 4:30–4:58 |

42 beats, average 7.1 s, first cut at 6 s. `src/Root.tsx` throws at load if the
schedule does not sum to 298 s **or** if any segment misses its allocation.

## Curation (Section 0a) — the one rule that changed

The long-form and the three-part reels both required every enumerated image to
appear. **This reel does not.** It requires quality and coherence of a curated
set instead.

Fresh inventory, re-derived rather than carried over: **141 files → 122 unique**
(19 folded across 16 groups), by decoding every file to a 32×32 greyscale hash.
Consolidation is on pixel content only — `MOTU 10pre (23).jpg`, `MOTU 16A (3).jpg`
and `MOTU 848 (6).jpg` are one image under three names. 120 product images + 2 logos.

**61 selected**: 848 16 · 16A 14 · 10pre 11 · Network 8 · Shared 9 · AVB Switch 3.

The reasoning per block, and the full account of what was left out and why, is
written down in `scripts/curation.mjs`. In short: the 848 takes the largest share
because its front panel carries the most *distinct* features; the AVB Switch has
only three images in the repository and all three are used, with no padding —
its 40 s segment is carried by the network imagery beside it.

**What is not relaxed:** every selected image is shown whole and uncropped at
some point in its screen time, including every member of a clubbed Ecosystem
Montage beat. `scripts/coverage.mjs` and `scripts/whole-unit.mjs` prove it.

## Ecosystem Montage — the new technique

The prior builds had Ecosystem *Split*: a triptych of the three interfaces
asserting peer equality between them. This reel needed something broader, so
`EcosystemMontage` (in `src/components/Media.tsx`) clubs images from **different**
products in one beat, under a single heading making a claim true of all of them.

Its completeness guarantee is structural: each member gets `hold` frames **alone**
at full slot size before the group assembles, so clubbing can never become an
excuse to crop. `whole-unit.mjs` asserts the solo phase actually fits inside the
beat and renders a still at each member's solo midpoint.

Four beats use it: the peer triptych (0:30), the three front panels under one
shared-engine claim (0:38), the physical handshake — an interface's own AVB port,
the cable, the Switch (3:59), and the four-product climax (4:30).

## Audio

**Layer 1 — music.** Path A / Path B blend, confirmed against the long-form
branch's own committed `MUSIC_PLAN` rather than assumed: Mindscape bookends the
hook and the CTA (the ecosystem signature), each product segment is scored from
its own track (GIFTED → Capture, DIABLO → Route, Black & Blue → Command,
ETERNITY → Network). Stems are never layered across tracks. At this length every
segment's window (30–50 s) is shorter than its track, so nothing loops — an
advantage the 178 s reels did not have.

The repository supplies **five** instrumental tracks and 17 stems, not the four
the brief refers to. All five are used, as in the long-form.

**Layer 2 — transition/foley.** All **28** sounds are synthesized from raw PCM in
`scripts/make-sfx.mjs`. Nothing comes from ElevenLabs or any other external
service, including the toolkit's own SFX tooling. The palette is wider than the
reels' 21 because 298 s at this cadence would otherwise expose the loop. No
cinematic low-frequency whooshes: `scripts/validate-audio.mjs` enforces ≤2% of
each file's energy below 400 Hz (measured worst case here: 0.04%).

## Verification

- **`guard.mjs`** — scans everything that can reach the screen for TASCAM, any
  competing audio-interface brand, any other brand relationship, and incorrect /
  rounded / blended pricing. Extracts string literals and JSX text rather than
  raw source, so `zoom={2.6}` is not mistaken for a brand.
- **`coverage.mjs`** — every curated image appears, *and* the beat's layout
  actually renders it (a beat can list an image its layout ignores, which would
  report coverage the viewer never gets).
- **`whole-unit.mjs`** — every camera move resolves to ≤1.0 scale before its cut,
  and every clubbed Ecosystem Montage member gets a real solo pass.
- **`branding.mjs`** — no Shivansh gap over 25 s, MOTU present mid-reel, website
  the most-repeated single detail.
- **`qa-stills.mjs`** — a still per beat with a ground-luminance check.

## Image grounds

`Plate` picks a presentation from the image's own detected ground:

| Ground | Treatment |
|---|---|
| light, with alpha | bare — it has no ground of its own and dissolves into the page |
| light, no alpha | a soft rounded well |
| mixed | a soft rounded well |
| dark | a rounded card with a shadow, so a dark photo reads as an intentional frame |

The light/no-alpha row exists because of the AVB Switch. Its three photographs
are the only product images in the repository with no transparent version, so
their hard `#FFF` rectangle sat visibly on the `#F6F8FA` page — a box around the
one product that most needed to look deliberate. The well turns that edge into a
designed panel. This affects four images (112, 114, 116, 118); the other 21
light-ground images carry alpha and stay bare.

Logos are exempt by construction: `Logo` renders a raw `<Img>` and never touches
`Plate`, so the "directly on screen, never boxed" rule cannot be affected by any
of this.

## Logos

Both logos are used **exactly as supplied**: opaque, with their own white
background intact, never alpha-keyed, and never inside a box, card or plate. They
sit directly on the video, resized per placement, clear of the safe zone. The
page palette is held within ~1–4% of white so the logos' own ground reads as
continuous with it.
