# MOTU AVB Series — 90 s reel + 5 min film (Remotion × Higgsfield)

Two narrated 4K masters for the MOTU **16A**, **848**, **10pre** and **AVB Switch**,
built as one Remotion project with one type system, one script format and one
shot-plan format:

| | Reel | Film |
|---|---|---|
| Canvas | **2160 × 3840** (9:16) | **3840 × 2160** (16:9) |
| Runtime | 90.000 s (2,700 frames @ 30 fps) | 300.000 s (9,000 frames @ 30 fps) |
| Narration | 209 words · 00:00.0 – 01:22.4 · **152.2 wpm** effective | 676 words · 00:03.0 – 04:52.0 · **153.5 wpm** effective |
| End screen | last 7.0 s | last 7.4 s |
| Master | `out/motu-avb-reel-4k.mp4` (parts in `out/parts/`) | `out/motu-avb-film-4k.mp4` (parts in `out/parts/`) |
| Review copy | `out/motu-avb-reel-1080p.mp4` | `out/motu-avb-film-1080p.mp4` |
| Speech script | `../VO_SCRIPT_AVB_REEL_90S.md` | `../VO_SCRIPT_AVB_FILM_5MIN.md` |
| VO drop-in | `public/audio/vo-reel.wav` | `public/audio/vo-film.wav` |

**Shivansh Electronics is the exclusive distributor of MOTU (Mark of the Unicorn,
USA) for East & North East India.** That line, the two logos, the website and
the 3 WhatsApp numbers appear once, on the end screen, and nowhere else.

---

## Quick start

```bash
npm install
npm run assets        # repo photography  -> public/images/ + src/assets.ts
node scripts/scan-higgsfield.mjs   # generated stills / clips -> src/higgsfield.ts
npm run audio         # music beds + 10 SFX cues, mastered to EBU R128
npm run script        # writes both VO_SCRIPT_*.md files from src/script.ts
node --experimental-strip-types scripts/validate-plan.mjs   # every pin resolves?

npm run studio        # preview either composition
bash scripts/render-4k.sh reel    # or: film / all
```

The container that authored this build has Chromium pre-installed;
`remotion.config.ts` points Remotion at it. Set `REMOTION_CHROME` to override.

---

## What drives what

There is not one hand-typed frame number in the render path.

| File | Owns |
|---|---|
| `src/script.ts` | **what is said.** Both scripts. Every caption's duration comes from its *spoken* word count (numerals expand: "125 dB" is 8 spoken words) at the written rate — 162 wpm for the reel, 160 for the film — plus a 0.2 s beat where a thought ends and a 0.4 s breath between segments. That lands both reads at **~152–154 wpm effective**, the pace the client found easy to read and sync on the M-Series reel. The film also carries a picture-only *hold* before each chapter. |
| `src/shots.ts` | **what is shown.** Every shot is pinned by hand to the caption it starts on; it runs until the next pin. Six kinds: generated `still`, generated `video` (falls back to the still if the clip is missing), real `bleed`, real `panel`, `split`, `mosaic`. |
| `src/Film.tsx` | **how it is staged**, transitioned, annotated and mixed — one component rendered on two canvases. |

Re-time a line in `script.ts` and the picture, the demonstratives, the SFX cue
sheet and the printed VO script all move with it.

---

## The layer stack

```
4  outro    the end screen — the only brand marks in either film
3  overlay  ALL typography, held at 0.64 opacity (36% transparent)
            ├ caption lockup — bottom-left, inside the safe box
            ├ product tag + demonstratives + spec chips — top-left
            └ chapter title during the film's holds
2  scrim    a gradient only where the dense text lives
1  picture  full-bleed stills / B-roll / photography under a camera move
```

**Typography** is carried over from the M-Series reel by instruction: a brush
script face (Pacifico standing in for Brittanic) carrying the one word each
sentence turns on, and a black geometric sans (Archivo Black standing in for
Lo-Flicker) carrying the rest; the whole typographic layer at 64% opacity so the
picture reads through the letterforms, with legibility bought back by a hard,
tight drop shadow rather than a scrim. Drop the real faces at
`public/fonts/script.ttf` and `public/fonts/display.ttf` and re-render. The film
runs the same lockup at 0.72 scale. **Every number on screen is a numeral.**

**Per-product accent** (a different set from both the M-Series reel and the
earlier AVB explainer, so the three films never look like re-edits):

| | Accent | Why |
|---|---|---|
| 16A | coral `#FF6A52` | signal and wiring — the matrix |
| 848 | gold `#FFC24A` | the desk, the monitor section — the command centre |
| 10pre | emerald `#3BE39F` | microphones, the live room — the source |
| AVB Switch | blue `#5B9DFF` | the cable itself — the network |

---

## The Higgsfield material

Generated with the Higgsfield MCP against the **real product photography in this
repository as image references**, so every unit on screen is the actual 16A /
848 / 10pre / AVB Switch — same chassis, panels, displays and printed names.

| | Model | Count | Credits |
|---|---|---|---|
| Workflow stills, 16:9 @ 2K | Nano Banana Pro (Google) | 10 scenes (+3 regenerated for panel accuracy) | 2 each |
| Workflow stills, 9:16 @ 2K | Nano Banana Pro | 6 native portrait variants for the reel's full-bleed moments | 2 each |
| B-roll, 1080p 5 s, silent | Kling 3.0 pro, image-to-video from the stills | 8 landscape + 2 portrait | 7.5 each |

Everything was generated at HD/2K and upscaled inside the 4K composition, as
instructed, rather than paid for at 4K. Total spend is recorded at the bottom of
this file.

The ten scenes, each a real-world problem the ecosystem solves:

1. **hero-rack** — 10pre, 848, 16A racked under the AVB Switch (the family)
2. **16a-mixroom** — the 16A as the studio's patchbay behind a console and outboard rack
3. **16a-modular** — the 16A's DC-coupled outputs into a Eurorack wall
4. **848-desk** — a producer's desk, CueMix Pro on the laptop
5. **848-podcast** — a 4-mic podcast table, a finger on TALK
6. **848-atmos** — a 7.1.4 post suite fed by the 848's 12 outputs
7. **10pre-tracking** — a whole band on one 10pre, the drummer on an iPad cue mix
8. **10pre-stage** — the 10pre on stage, one CAT-6 run to front of house
9. **switch-foh** — the AVB Switch and a 16A at the FOH desk
10. **auditorium** — a house-of-worship install rack: switch, 16A, 10pre

**Panel accuracy.** Three first-pass stills plugged XLR cables into front panels
that have none on the real units (the 848's 4 combo inputs are on its **rear**;
the 10pre has **8 on the rear and 2 on the front**). They were regenerated with
that stated explicitly. The scripts and spec chips were corrected the same way
— both facts were read off the panel photographs in the repository root.

**How the files got here.** The authoring container cannot reach Higgsfield's
result CDN, so `higgsfield-manifest.json` lists each result URL and its
destination, and `.github/workflows/fetch-higgsfield-assets.yml` downloads the
files on a GitHub runner and commits them to the branch whenever the manifest
changes.

---

## Demonstratives

Three of the four products are the same 1U chassis. Every graphic exists to
make the *difference* visible: a 16-slot **channel ladder** (16 line / 4 mic + 8
line / 10 mic, mic slots drawn solid), a **dynamic-range meter** and a
**round-trip latency trace** for the numbers a viewer cannot picture, a
**network graph** for the switch (units attach along lit cables, then one clock
pulse runs through all of them), and a **3-column comparison ladder** at the
close. Nothing uses `filter: blur()` — at 4K every effect is a transform, a
gradient or a clip-path.

---

## Audio

Everything is synthesised from scratch by `scripts/gen_audio.py` — nothing is
sampled or fetched. Two continuous beds (90 s and 300 s, E major at 104 BPM,
each shaped to its own script's segment map; the film adds a soft kick) and 10
transition cues, every one married to a transition kind in
`src/components/Transitions.tsx`. The bed is carved with a −7 dB speech pocket
at 1.6 kHz, and every source is mastered to **−23 LUFS (EBU R128)** with a single
computed gain — the ffmpeg build here lacks `ebur128`, so the BS.1770-4 meter is
implemented in the script. Every source then plays at unity in the timeline.

```
music-bed-reel / -film   -23.0 LUFS     riser-short  -23.0   (reference cue)
                                        chime-lift   -24.5   outro-bloom  -25.0
                                        net-lock     -25.5   slide-air    -26.0
                                        impact-soft  -26.5   gate-snap    -27.0
                                        air-pass     -29.0   tick-glass   -34.0
                                        count-blip   -36.0
```

The narration is recorded by the client. Silent placeholders of exactly 90.000 s
and 300.000 s sit at `public/audio/vo-reel.wav` and `public/audio/vo-film.wav`;
replace the file and re-render.

---

## Real photography coverage

139 filenames in the repository root are 119 distinct images (byte-identical
duplicates collapsed; the Moog photograph and the blank grey PNG excluded).
The reel places 29 of them and the film 71 — CueMix Pro's screens are clubbed
into drifting mosaics (mixer, EQ, dynamics, patchbay, routing, iPad), the panel
plans are tracked laterally, and the detail crops sit under the line they prove.
Run `node --experimental-strip-types scripts/validate-plan.mjs` for the count.
