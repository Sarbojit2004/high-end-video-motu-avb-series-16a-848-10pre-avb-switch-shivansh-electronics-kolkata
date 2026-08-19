# MOTU AVB Series ecosystem — one 88 s portrait compressed reel

A standalone reel for **Shivansh Electronics**, Authorized Distributor of MOTU
(Mark of the Unicorn, USA) Interfaces for East and North East India.

**1080×1920, 30 fps, 88 s (2,640 frames).** Light background throughout.
Output: `out/motu-avb-compressed-reel-ecosystem.mp4`.

All four products in one continuous ecosystem narrative, from a deeply curated
26-image selection — roughly 30% of the 298 s master reel's runtime, and a
**structural collapse** of it rather than a proportional scale-down.

## Quick start

```bash
cd compressed-reel
npm install
npm run setup            # stage curated images + fonts, synthesize SFX, stage music stems
npm run validate-audio   # both audio layers, before anything depends on them
npm run verify           # typecheck + guard + coverage + branding + pacing
npm run qa               # a still per beat, checked for light ground
npm run whole-unit       # every camera move + every clubbed image resolves whole
npm run render           # the 88 s reel
npm run render:thumb     # 1080x1920 thumbnail
npm run render:audio     # the two standalone audio deliverables
```

`npm run setup` is required before the first render — `public/` is generated
from the repository's own source assets and is not committed.

This container ships Chromium and blocks Remotion's browser-download host, so
`remotion.config.ts` points at the local binary. Override with
`REMOTION_BROWSER_EXECUTABLE`.

## The compression logic — why this is not a small master reel

Scaling the 298 s master reel's seven segments by 0.295 would give **9–15 s
each**: below the floor for establishing *and* resolving a point, and it would
produce four rushed product fragments instead of one coherent claim. So the
structure collapses instead:

- **The three per-product segments stop being segments.** The 10pre, 16A and
  848 now share beats under headings true of all of them at once.
- **Ecosystem Montage becomes the spine.** 6 of 16 beats (35 s, 40% of runtime,
  and every beat where multiple products share the frame), against 4 of 42 in
  the master reel — a 4× increase in share, and by 3× the most-used technique here.
- **Hook and thesis fuse.** There is no separate "scaling wall" problem
  statement; the reel opens *on* the claim, because at 88 s the problem and its
  answer have to arrive in the same breath.

## Timing

| Segment | Section 4 | Here | |
|---|---|---|---|
| Hook fused with thesis | 12 s | **12 s** | 0:00–0:12 |
| The ecosystem flow | 43 s | **45 s** | 0:12–0:57 |
| Network & scale | 20 s | **16 s** | 0:57–1:13 |
| Synthesis & CTA | 13 s | **15 s** | 1:13–1:28 |

Section 4's own numbers sum to 88 exactly, so no arithmetic fix was needed. Two
adjustments: 20 s of 88 is 23% of the runtime for the AVB Switch where the
master reel gave it 13.4%, and Fact 1 is explicit that it is not a peer-tier
fourth interface — 16 s still buys it three beats and one of only two
Macro-to-Full-Reveals. The CTA gained a second after a QA still showed a 3 s
outro failing Section 7's legibility bar at ~18 words of text.

16 beats, **average 5.5 s** — the fastest cadence in this pipeline (master reel
7.1 s, three-part reels 7.4–8.1 s). `src/Root.tsx` throws at load if the
schedule misses 88 s or if any segment misses its allocation.

## Curation — 26 images, a subset of a subset

Per Section 0a this reel narrows the master reel's own curated 61 rather than
re-curating from the 120-image inventory. **All 26 come from that 61**; nothing
was pulled back from its excluded set. `scripts/build-manifest.mjs` throws if an
index appears that the master reel did not select.

The selection *criterion* changed, and that is the point. The master reel could
afford images that reward a few seconds. Here the question became: **does it
read at a glance?** Everything needing dwell time to decode is gone — spec-dense
rear panels, CueMix UI variants, lifestyle shots, icon sets — regardless of
quality, because this cadence would show them without giving the viewer time to
see them. Full reasoning in `scripts/curation.mjs`.

**10pre 5 · 16A 6 · 848 5 · AVB Switch 2 · Network 3 · Shared 5.** All four
products genuinely represented; the Switch's two is proportionate to its
established smaller footprint, not a silent drop, and it still gets one of the
two Macro-to-Full-Reveals.

## The two Macro-to-Full-Reveals

Reserved, per Section 3, for exactly two moments:

- **Image 79 — the MOTU 16A, at 0:18.** Chosen on technique grounds, not product
  favouritism. The 16A's front panel is the one that does *not* explain itself —
  sixteen jacks, no gain knobs — so opening macro on a jack detail and pulling
  out to the whole unit is the technique doing the job it exists for. The 10pre
  (visible preamp knobs) and 848 (visible talkback and A/B/C) read instantly from
  their panels and land fine in montage solos.
- **Image 112 — the MOTU AVB Switch, at 1:04.** The least-recognisable product in
  the set, with the smallest narrative footprint in every prior build, and the
  literal payoff of the "one network" claim. This is what stops it reading as an
  afterthought without promoting it to peer tier.

Also used: one Port Density Sweep (51, the 32-jack wall) and one Data Flow
Reveal (20). Ecosystem Split is not used — the montages carry peer equality
better at this pace.

**The completeness rule does not loosen at this runtime.** Every image is shown
whole and uncropped, including every clubbed montage member, each of which holds
the frame alone at full size before the group assembles. No image was cropped to
fit the pace; where that pressure arose the image was cut from the selection.

## Branding — four planned placements, all landed

Opening (0:00, both logos), first flow beat (0:12), the sweep (0:26), a full
brand beat mid-flow (0:44), the mixer beat (0:48), the Switch (1:04), and the
CTA and outro (1:19, 1:25). Eight Shivansh appearances, longest gap 12 s; MOTU
four — open, mid-reel, climax, outro. `www.shivanshelectronics.in` on seven of
them against one for the next-most-repeated detail.

Section 6's fixed-interval rule from the longer formats is deliberately not
imported: at 88 s it would produce an unreasonable number of branding
interruptions relative to content.

## Audio

**Layer 1 — the master reel's blend, body collapsed to one track.** Mindscape
bookends the open and the CTA, exactly as in the master reel — the same
ecosystem signature, reused directly. The body is **ETERNITY alone** rather than
a four-track rotation: at 88 s a track change every ~15 s reads as restlessness,
not structure, and ETERNITY is the track the master reel itself reserved for its
most driving passage. The 62 s body window sits inside ETERNITY's 142.7 s, so it
makes one unlooped pass with no relay.

**Layer 2 — 34 synthesized voices**, all from raw PCM in `scripts/make-sfx.mjs`.
Nothing from ElevenLabs or any external service. Widened from the master reel's
28 because **density, not duration, forces it**: 79 placements across 88 s is
**0.90 per second, 2.2× the master reel's 0.40**. Every one of the 34 is used.
No cinematic low-frequency whooshes — `validate-audio.mjs` enforces ≤2% of each
file's energy below 400 Hz (worst case here 0.15%).

`accents()` gained handling for `ecosystemMontage`, which the master reel never
needed: there it was 4 beats of 42 and the picture carried them alone. Here it
is the spine, and a beat where three images each take the frame and hand it on
needs the hand-offs articulated.

## Verification

- **`guard.mjs`** — scans everything that can reach the screen for TASCAM, any
  competing audio-interface brand, any other brand relationship, and incorrect /
  rounded / blended pricing.
- **`coverage.mjs`** — every curated image appears *and* its beat's layout
  actually renders it.
- **`whole-unit.mjs`** — every camera move resolves to ≤1.0 scale before its cut,
  and every clubbed montage member gets a real solo pass, verified on stills.
- **`branding.mjs`** — placements, gaps and URL emphasis.
- **`pacing.mjs`** — asserts the average beat is *faster* than the master reel's
  7.1 s, that no beat is a disproportionate share, that every beat carries motion
  vocabulary, and that no two adjacent beats reuse a transition SFX.
- **`sfx-map.mjs`** — calls the real `accents()` rather than re-implementing it,
  so the report cannot drift from what renders.

## Logos

Both logos are used **exactly as supplied**: opaque, with their own white
background intact, never alpha-keyed, and never inside a box, card or plate.
`Logo` renders a raw `<Img>` and never goes through `Plate`, so no image-ground
treatment can box them.
