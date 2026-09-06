# MOTU AVB Ecosystem — 90-second montage reel

One continuous **90-second, no-voiceover, image + motion-graphics montage** of
the MOTU AVB ecosystem — **16A · 848 · 10pre · AVB Switch** — for
**Shivansh Electronics, Kolkata**. 2160 × 3840 (true-4K vertical 9:16),
**60 fps**, delivered as **three sequential parts**, each under GitHub's 100 MB
limit, that join back-to-back in an NLE with no gap and no re-sync.

| Part | Reel time | Acts | Music | File |
|---|---|---|---|---|
| 1 of 3 | 0:00.000 – 0:27.483 | 0 Cold open · I 16A | D A N N Y – Take Me | `out/motu-avb-montage-reel-part1-of-3.mp4` |
| 2 of 3 | 0:27.483 – 1:10.383 | II 848 · III 10pre | Ian Asher – Take Me (To The Moon) | `out/motu-avb-montage-reel-part2-of-3.mp4` |
| 3 of 3 | 1:10.383 – 1:29.817 | IV Switch / ecosystem · V Close | D A N N Y – Take Me | `out/motu-avb-montage-reel-part3-of-3.mp4` |

Every part starts and ends on a hard-cut act boundary that is also a downbeat
of the shared music bed. Join order is the number in the filename.

This is a ground-up build: no visual system, colour, card layout or motion
language from any earlier MOTU deliverable in this repository is reused.

---

## Quick start

```bash
cd montage-reel
npm install
npm run setup        # images + logos → public/, beat analysis, SFX synthesis, music bed
npm run render:all   # three parts → out/
npm run render:thumb # ecosystem cover still → out/
node --experimental-strip-types scripts/text-coverage.mjs   # text-layer gate
node --experimental-strip-types scripts/check-sizes.mjs   # < 100 MB, frame-exact, audio present
```

`npm run setup` runs, in order:

| Step | Script | What it does |
|---|---|---|
| `make-assets` | `scripts/copy-assets.mjs` | hashes every image in the repo root, de-duplicates the 15 byte-identical groups, excludes the one non-MOTU photograph, copies 120 unique product images + 2 logos into `public/` |
| `fetch-fonts` | `scripts/fetch-fonts.mjs` | pulls the five open-licence typefaces (TrueType) from Google Fonts; registers licensed Telegraf files if present |
| `make-grain` | `scripts/make-grain.mjs` | writes the film-grain tile |
| `analyze-music` | `scripts/analyze-music.py` (librosa) | beat-grid / energy analysis of both tracks → `public/audio/analysis/` (results already committed) |
| `make-sfx` | `scripts/make-sfx.mjs` | synthesizes the seven transition sounds in-process |
| `make-audio` | `scripts/make-audio.mjs` | cuts, tempo-matches, loudness-normalises and joins the four music sections, places one SFX per cut, limits, writes `public/audio/bed.wav` + per-part slices |

Preview: `npm run studio` → composition **Full** (the whole 90 s) or **Part1/2/3**.

Rendering notes: the container ships Chromium and blocks Remotion's browser
download, so `remotion.config.ts` points at the local binary
(`REMOTION_BROWSER_EXECUTABLE` overrides). `REMOTION_CONCURRENCY`,
`REMOTION_CRF` and `REMOTION_MAXRATE` override the encode settings.

---

## Structure (TIMING_MAP.md is the locked source)

Master grid **89.52 BPM** (the native tempo of the Danny section that opens the
reel), 0.670241 s per beat, 40.21 frames per beat, **134 beats = 5389 frames =
89.817 s**. Every cut in the reel lands on a beat of the bed.

| Act | Beats | Time | What happens |
|---|---|---|---|
| 0 Cold open | 0–9 | 0:00–0:06 | black → one pulse per clock edge, both logos small and top-anchored for the whole act, one Alfa Slab word (**SIGNAL**) with a Tinos subtitle |
| I MOTU 16A | 9–41 | 0:06–0:27 | line-reveal hero + title card, rapid-fire angles / details / CueMix stacks, giant **16A**, serif close-beat *precision* |
| II MOTU 848 | 41–73 | 0:27–0:49 | opens on a line-reveal of the rear three-quarter then a push-in hero (a different shape from Act I), the "quiet, expensive" act; 4-beat serif close *presence* on the track's own breakdown |
| III MOTU 10pre | 73–105 | 0:49–1:10 | fastest cut rate (½-beat stutters), giant **10pre**, serif close *momentum* |
| IV Switch / ecosystem | 105–125 | 1:10–1:24 | colour-flash callbacks 16A → 848 → 10pre (Blue / Cyan / Orange), the network diagrams, AVB Switch hero + **AVB SWITCH** card, **ONE NETWORK** grid, three rear panels stacked "in sync", **ONE CLOCK** |
| V Close | 125–134 | 1:24–1:30 | Deep Navy bookend: both logos together, Caveat tagline *in perfect sync* (its only use), WhatsApp + website held static; the Danny hard-stop lands at 1:26.43 |

Shot list: `src/data/timeline.ts` (94 shots, 120/120 images, six transition
types with no two consecutive cuts alike — enforced at build time).
Coverage ledger: `ASSET_COVERAGE_MONTAGE_REEL.md` (`npm run coverage`).

---

## Audio

**Both supplied tracks are the entire soundscape** — no voiceover, no dialogue —
so the bed is mixed loud (music-video level), never as a background bed:

| | |
|---|---|
| Master loudness | **−10.0 LUFS integrated, −1.0 dBTP, LRA 2.2** (`public/audio/bed-report.json`) |
| Combination | **alternating** — the tracks are 3.4 % apart in tempo and in different keys, so layering would smear; each handoff is a hard cut on a shared downbeat + 12 ms crossfade + transition SFX |
| Sections | Danny 19.478→46.958 s (build + drop #1) · Ian 24.990→46.943 s (chorus #1) · Ian 68.886→90.819 s (chorus #2, the track's loudest section) · Danny 111.476→end (final drop → real hard-stop ending) |
| Tempo match | pitch-preserving `atempo` ≤ 2.4 % so one uniform beat grid spans the reel |
| Level match | two-pass `loudnorm` per section to the same target, then one look-ahead brick-wall limiter over the sum |
| SFX | 181 events, one per cut, synthesized in `scripts/make-sfx.mjs` (whoosh, impact, glitch, riser, sweep, pop, tick); impacts/pops start on the beat, whooshes/sweeps/risers end on it; mixed −6 dB under the music |

**Source-file note.** The brief names the two tracks as user-supplied and
excludes the repository's `sound-effects/` folder. No files were attached to
the build session, and the only copies of *D A N N Y – TAKE ME* and *Ian Asher –
Take Me (To The Moon)* in the repository are inside `sound-effects/`. Those two
files — and nothing else in that folder — are read by `scripts/make-audio.mjs`.
Everything else in `sound-effects/` (the Epidemic Sound tracks, stems and the
`sfx music` sub-folder) is untouched and unreferenced. To use different master
files, point `SRC` in `scripts/make-audio.mjs` at them and re-run
`npm run make-audio`.

Extra deliverables in `out/`: the full mixed bed and each part's exact slice
(`*-bed.wav`), plus music-only and SFX-only stems.

---

## Typography (brief §2)

| Role | Face used | Licence | Notes |
|---|---|---|---|
| Hero display | **Alfa Slab One** | OFL | SIGNAL, 16A, 848, 10pre, AVB SWITCH, ONE NETWORK, ONE CLOCK — 7 hero moments |
| Grotesk workhorse | **Telegraf → Bricolage Grotesque** | Telegraf: commercial (Pangram Pangram) · Bricolage: OFL | see below |
| Serif contrast voice | **Bodoni Moda** | OFL | a true Didone; one word per use — *precision*, *presence*, *momentum* |
| Script accent | **Caveat** 600/700 | OFL | tall, condensed, confident; used exactly once (Act V tagline) |
| Classical pairing | **Tinos** | Apache 2.0 | metric-compatible Times New Roman; subtitles under every display headline |
| Microtype | Bricolage Grotesque 300–500 | OFL | WhatsApp number, URL, corner mark |

**Telegraf.** Telegraf is not an open font: it is a paid commercial licence from
Pangram Pangram, and pangrampangram.com is not reachable from the build
environment, so it could not be sourced here. The font stack lists Telegraf
first; to use it, license it and drop the files into
`public/fonts/telegraf/` (e.g. `Telegraf-Black.woff2`, `Telegraf-Bold.woff2`,
`Telegraf-Regular.woff2`, `Telegraf-Light.woff2`), re-run
`node scripts/fetch-fonts.mjs` (it registers them) and re-render. Until then
Bricolage Grotesque — an ink-trapped grotesk with the same character — carries
every Telegraf role.

Fonts are shipped as TrueType on purpose: the container's Chromium build
reports WOFF2 faces as loaded but paints fallbacks.

---

## On-screen text (rectification pass)

Every product appearance carries a **heading + subheading pair**. The pair is
introduced on the cut that opens a run, holds through that run's rapid-fire
cuts, and exits with motion before the next one; a product change always opens
a fresh pair on that cut.

`node --experimental-strip-types scripts/text-coverage.mjs` is the gate. It
reports every shot in the product acts and what text is on it, and fails the
build on any violation. Current state: **100 % of product-act time carries
text, 0 shots with none**, longest text-free run **0.0 s** (limit 2.5 s).

| | |
|---|---|
| Heading | ALL UPPERCASE, no terminal punctuation — the product name (`MOTU 16A`, `MOTU 848`, `MOTU 10PRE`, `AVB SWITCH`) or an ecosystem-level word (`AVB NETWORK`, `IN SYNC`, `MOTU AVB`) |
| Subheading | Title Case, 2–4 words, no terminal punctuation, never a spec value — `Front And Rear`, `CueMix Pro Control`, `Patch Bay Routing`, `Ties It Together`, `One Shared Clock` … |
| Primary pairing | **Bodoni Moda** heading (the Didone contrast voice) at 150–260 px, auto-fitted so it dominates the width it occupies, with **Caveat** as the script companion at 46 % of its scale tucked against the heading's baseline |
| Secondary pairing | the existing act-opening product-name cards and Alfa Slab One hero words, each with their Tinos line — untouched by this pass |
| Contrast | the pair always sits on a tight scrim in the act's own scrim colour at the verified 94 % opacity; the script takes the act accent only where that clears 4.5:1 on that scrim, otherwise the scrim's own ink |

**Motion.** The build-in rides the cut that brought the shot on: a whip or
line-reveal gives the heading a directional wipe, a glitch or flash gives it a
blurred stagger, a punch or hard cut gives it a scale-in. The subheading
follows four frames later. Three elements persist on independent chains, so
nothing re-animates unless it actually changes:

| Element | Holds while | Effect |
|---|---|---|
| scrim | any unbroken run of cards | the plate never blinks between runs |
| heading | the product does not change | the product name locks for a whole act |
| subheading | the phrase does not change | in the Act IV callback burst the heading flips product-to-product every beat over one held `One Ecosystem` |

**What this pass did not touch:** the shot list, which images appear and in what
order, the act boundaries and timing, the per-act palettes, the transitions
between shots, the music/SFX mix, and the Act 0 / Act V branding lockups. The
bare one-line labels are superseded by the full pair, but their layout
reservations in `Shot.tsx` are left in place so no image moves.

Source: `src/data/text-track.ts` (the cards + validator), `src/components/ContextBand.tsx`
(the pair), and `TextLayer` in `src/Reel.tsx` — one instance above every shot,
so the pair holds dead still through a run's cuts instead of being dragged by
each whip.

---

## Colour (brief §4)

Each act draws a 2–4 colour micro-palette from the supplied pool
(`src/design/palette.ts`); the ground changes act to act and, inside Acts I and
IV, at cut points:

| Act | Ground(s) | Type | Accent / lines / flash |
|---|---|---|---|
| 0, V | Deep Navy `#1C1C28` | White | Cyan |
| I | Navy Blue `#092634` ↔ Riviera Blue `#183451` | Gamboge (7.4:1 / 6.0:1), Soft Ivory | Tangerine |
| II | Burgundy `#1A0A0F` | Blush Pink (15.9:1) | Terracotta (lines only — 3.3:1 as type, so it never carries type) |
| III | Brunswick Green `#2A5945` | Vanilla (6.2:1), Celadon | Celadon / Vanilla |
| IV | Blue `#004E72` → Cyan `#1EC1CB` → Orange `#FF6E42` per callback | White on Blue, Deep Navy on Cyan/Orange | White |

**Contrast rule.** `node --experimental-strip-types scripts/contrast.mjs`
verifies every declared ink/ground pairing ≥ 4.5:1, including the worst case
for type over a photograph: the 94 %-opaque act-colour scrim over a pure-white
image region. Type over photographs always uses the act's highest-luminance ink
on that scrim (tight to the text block, never full-frame).

---

## Transitions and motion (brief §5)

Six types, rotated so no two consecutive cuts share one (checked in
`buildTimeline()`): hard cut on the beat (with a 2-frame brightness pop),
glitch / RGB-split tear (±3 frames around the beat), whip pan with a 3-copy
directional smear, **line-reveal wipe** (the signature — opens Acts I, II and
IV), scale-punch, and 1–3 frame colour flash. Moves *land* on the beat: a
whip or line starts 10–14 frames early and settles on the beat frame.

Under everything: a beat-keyed gradient field, abstract routing lines with
travelling packets and node flashes (`SignalField`), film grain on every frame
(`Grain`), and a slow parallax drift on any image held longer than a beat.
Every text card builds in (letter stagger, scale-punch, wipe) and then holds
still.

---

## Branding (brief §6)

Two logos (both supplied files, on white plates — never recoloured), together
and static in Act 0 and Act V only; a dim single-line corner mark through the
product acts; WhatsApp `+91 98316 62458` and `www.shivanshelectronics.in` with
icons in Act V. The user-supplied WhatsApp / website icon files were not
attached to the build session: `src/components/Brand.tsx` draws clean vector
stand-ins and automatically uses `public/branding/whatsapp-icon.png` /
`public/branding/website-icon.png` instead if those files are present.

---

## Image coverage (brief §0, §8)

139 image files in the repository root → 15 byte-identical duplicate groups →
**120 unique product images**, every one of which appears (most once, 15 hero
shots twice as Act IV callbacks). One photograph is excluded on content:
`MOTU 10pre (23).jpg` (= `MOTU 16A (3).jpg` = `MOTU 848 (6).jpg`) is a Moog
modular synthesizer, not MOTU hardware. Holds run 0.33–2.0 s (mean 0.81 s);
vertical 9:16 lets two or three landscape images stack in one frame, which is
how 40 images fit in 21 s.

---

## Thumbnail

`npm run render:thumb` → `out/thumbnail-motu-avb-ecosystem.png` (2160 × 3840,
the reel's own frame size, 9.7 MB).

It is the reel's cover frame, built from the same system rather than designed
separately: the Act 0 / Act V bookend palette (Deep Navy ground, White + Cyan),
the routing-line signal motif, the same grain pass, and the full type hierarchy
— **Alfa Slab One** hero (`AVB` / `ECOSYSTEM`), **Tinos** classical line naming
every product, **Bricolage Grotesque** (Telegraf's stand-in) product labels and
`AVB SWITCH`, microtype for the URL, both logos on their white plates.

All four products appear in one frame, arranged as the idea the reel argues:
the 16A, 848 and 10pre stacked as a rack, their signal routed down the gutters
into the AVB Switch that ties them together. Source: `src/Thumbnail.tsx`
(entirely static — no `useCurrentFrame`, so it renders identically at any frame).

---

## Render + file size (brief §9)

Encode: H.264 (x264), `yuv420p`, CRF 21 with a **15 Mbps max-rate cap** so the
longest part (Part 2, 42.9 s) cannot exceed ~82 MB even at full grain density;
AAC 256 kbps. `scripts/check-sizes.mjs` verifies every part is < 100 MB,
frame-exact (1649 / 2574 / 1166 frames) and carries audio. Measured sizes are
recorded below after each render.

### Measured (this delivery)

| Part | Frames | Duration | Video bitrate | Size | Gate |
|---|---|---|---|---|---|
| `out/motu-avb-montage-reel-part1-of-3.mp4` | 1649 | 27.541 s | 15.0 Mbps | **50.2 MB** | ok |
| `out/motu-avb-montage-reel-part2-of-3.mp4` | 2574 | 42.944 s | 14.5 Mbps | **75.5 MB** | ok |
| `out/motu-avb-montage-reel-part3-of-3.mp4` | 1166 | 19.477 s | 13.6 Mbps | **32.2 MB** | ok |

H.264 High, 2160×3840, 60 fps, yuv420p, AAC 256 kbps 48 kHz; all three parts
frame-exact against the timing map and under 100 MB (`npm run check-sizes`).
Sizes are in MiB as GitHub counts them. Render time on the 4-core build
container: ~1 s per frame at concurrency 3 (≈ 95 min for the set).

Join in the NLE: place Part 1, Part 2, Part 3 back-to-back on one track with no
gaps and no re-sync; the embedded audio is one continuous bed sliced at the two
split frames.

