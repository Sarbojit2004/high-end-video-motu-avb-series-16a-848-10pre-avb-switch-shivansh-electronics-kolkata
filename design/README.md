# 16A, 848 and 10Pre — social slides

Thirty editorial slides, ten per product, at **2160 × 2160** for the Instagram
feed. Same design system as the TASCAM Sonicview and Model sets and the
UltraLite mk5 / 828 sets; the MOTU mark takes the TASCAM mark's place in the
branding rail.

| Folder | Product |
|---|---|
| `16a-square-2160/` | MOTU 16A |
| `848-square-2160/` | MOTU 848 |
| `10pre-square-2160/` | MOTU 10Pre |

`_contact-sheet.png` in each folder shows all ten together.

## The composition

One display line set to the full measure, a photograph punched through it, a
wide lower photograph, a figure caption beneath it, a plate register beside it,
and the branding rail on a white colophon.

Where the photograph covers the display line the buried type is brought forward
over it at 36%, per-pixel rather than per-letter: the headline is drawn twice,
the base layer staying behind the photograph at full opacity so every uncovered
part renders unchanged, and a second copy above it masked by the hero's own
alpha. The transition falls on the product's outline, not a bounding box.

## What these three libraries forced

**Nothing here is silhouette-matted.** Every product frame across all three
units is lit on black or is a software capture — there is not one white sweep.
The matte keys on a white ground flooded in from the frame border, so on these
frames it finds no background, keeps the whole rectangle and *raises nothing*:
a slide would silently get a photo block where a cut-out was intended. So every
hero is a hard-edged photo block, which is the honest treatment for product shot
on black anyway, and `prep.py` checks the result rather than trusting the mode.
Only the 16A's three thin front-panel strips are bbox-trimmed as plates.

**The register is a curated selection, not a partition.** The Sonicview
catalogue ran to 129 distinct frames, so every frame could be placed exactly
once. These carry 45, 43 and 41, and ten slides need twenty for heroes and bands
alone. So a frame may lead its own slide and return as a plate on a related one.
Every frame still appears, and none ever appears twice on a single slide; the
verification pass checks both.

## Rules the build holds to

- Every product photograph and both logos appear in their **original colour**,
  unmodified. Nothing is desaturated, filtered or AI-generated.
- All textures (halftone, paper grain) are generated programmatically.
- Only four informational items appear: the MOTU logo, the Shivansh Electronics
  logo, the website, and the WhatsApp icon with the three numbers.
- No social handles, email, pricing, unverified specification claims, or a
  call-to-action sentence. The ~1.8 ms round-trip figure is read off MOTU's own
  latency diagrams rather than asserted independently.
- **Eleven frames are held back across the three products**, under the same
  ruling that kept the Dante certification mark off the Sonicview slides: they
  are other companies' marks or bundle artwork rather than photographs of the
  product — the ESS Technology, Thunderbolt and Milan marks, the Loopmasters,
  Lucid Samples and Big Fish Audio covers, and a collage of bundled instrument
  thumbnails. MOTU's own CueMix Pro mark and its own latency and topology
  drawings are kept, being the manufacturer's own material. Each held frame is
  listed with its reason in `HELD_BACK` in the product's spec, and the
  verification pass prints them.

Latest verification — all three sets 10/10 exact at 2160 × 2160; every frame
placed, none twice on a slide; worst per-channel colour drift **0.93** (16A),
**0.73** (848) and **0.64** (10Pre) of 255; no prohibited content; **zero pixels
altered outside any product silhouette** by the forward text layer.

## Rebuilding

```
python3 ingest.py <repo> "MOTU 16A" M16A ids_16a.json   # dedup + inventory
python3 prep.py m16a                                     # mattes, trims, textures
SERIES=m16a python3 build_sq.py                          # render
SERIES=m16a python3 verify_sq.py                         # measure
```

`build_sq.py` and `verify_sq.py` are shared with every other series and select
with `SERIES=`, so a fix lands on all of them rather than drifting between
copies. The renderer must launch with `--allow-file-access-from-files`: a CSS
`mask-image` is fetched as a cross-origin resource and Chromium blocks `file://`
for those, so without it the forward text layer silently never paints.
