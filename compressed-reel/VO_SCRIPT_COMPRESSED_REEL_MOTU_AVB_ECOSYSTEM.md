# Voiceover — MOTU AVB Series Compressed Reel, 88 s / 1:28

**English only. No burned-in captions.** Narration is recorded separately and
dropped into `public/vo/voiceover-compressed-reel.mp3`.

## Tone

**The pipeline's established blend, compressed rather than replaced.**
Brief Stage 9's *"Precise & Technical-but-Accessible"* (The Systems Engineer)
carries the body; the open and the outro lean *"Warm & Trustworthy"* (The
Infrastructure Specialist) — the same split the 298 s master reel used, because
this reel makes the identical argument (one engine, three front-ends, one
network) and needs the same premise-then-proof shape, just delivered at speed.

**Delivery: ~175–185 wpm.** Faster than the master reel's ~155 wpm and the
178 s reels' ~165 wpm — this is the fastest-cut video in the pipeline (16 beats,
5.5 s average, some as short as 4 s), and the narration has to move at the cut's
pace or it will still be talking over the next beat. Every line below was
word-counted against its beat's actual duration at this rate; nothing here
assumes more air than the beat has.

**Delivery note:** don't slow down for the two price figures the way the longer
formats do — at this pace a brief, clean, unhurried-but-not-lingering read of
both MOPs is what "not rushed" means. Landing them clearly beats landing them
slowly.

**Timecodes are this reel's actual rendered beat boundaries** (`npm run
qa`/`timeline.mjs` against `src/schedule.ts`), not estimates. Start each line
~0.2 s after its boundary so the cut registers first — tighter than the longer
formats' 0.3–0.4 s, because there is less room to spare.

---

**[00:00–00:07] hook-faces — Three Front Panels. One Engine.**
> Three front panels. Ten preamps. Sixteen line outs. Talkback and A, B, C. One
> identical engine behind every one of them.

**[00:07–00:12] hook-peers — Peers. Not A Ladder.**
> The MOTU 16A, 848 and 10pre. Peers — not a ladder.

**[00:12–00:18] flow-silicon — Identical In Every Chassis**
> Same ESS Sabre32 Ultra conversion. Same Thunderbolt 4 and USB4. Identical in
> every chassis.

**[00:18–00:26] flow-route — Sixteen In. Sixteen Out.**
> The 16A is the matrix — sixteen balanced ins, sixteen out, and no preamps at
> all, because a patch bay doesn't need them.

**[00:26–00:32] flow-sweep — Thirty-Two Jacks, One Panel**
> Thirty-two jacks, one rear panel, one pass.

**[00:32–00:38] flow-capture — Capture**
> The 10pre is the tracking specialist. Ten preamps, up to seventy-four decibels
> of gain, eight of them across the rear.

**[00:38–00:43] flow-command — Command**
> The 848 runs the room — talkback, A, B and C monitoring, on the front panel.

**[00:43–00:47] flow-brand — branding beat**
> Shivansh Electronics. Authorized Distributor of MOTU, for East and North East
> India.

**[00:47–00:53] flow-mixer — One Mixer. Every Unit.**
> One CueMix Pro mixer, sixty-four inputs, on the hardware — in every one of
> them.

**[00:53–00:57] flow-window — Already On The Same Network**
> All three, already talking to each other, in one window.

**[00:57–01:03] net-builtin — Two Rooms Need Nothing Extra**
> Every interface has a two-port AVB switch built in. Two rooms need nothing
> extra.

**[01:03–01:09] net-switch — Then You Add The Third**
> Add a third, and that's what the MOTU AVB Switch is for.

**[01:09–01:13] net-standards — Milan · IEEE 802.1**
> Milan-certified. Open standard. Not a proprietary bus.

**[01:13–01:18] cta-climax — Four Products. One Network.**
> Four products. One network.

**[01:18–01:24] cta-price — Two Categories. Two Prices.** *(the explicit price moment)*
> Shivansh Electronics — Authorized Distributor of MOTU, Mark of the Unicorn,
> USA. The 16A, 848 and 10pre: one lakh, eighty-seven thousand, nine hundred
> rupees each, inclusive of GST. The AVB Switch: fifty-two thousand, nine
> hundred and ninety, inclusive of GST.

**[01:24–01:28] cta-outro — outro lockup**
> Shivansh Electronics. www dot shivansh electronics dot in.

---

## Compliance

- No comparison with, or reference to, any other audio-interface manufacturer.
- No mention of TASCAM.
- No reference to any other Shivansh Electronics brand relationship.
- **Both** Market Operating Prices are stated in full, separately, at
  01:18–01:24 — the CTA's one explicit, timestamped price moment. Neither
  figure is rounded, blended, or preceded by "starting from"; the two are never
  summed into one number.
- The AVB Switch is introduced at 00:57 as what the two-port link *already
  does*, then at 01:03 as what you add beyond that — infrastructure, never a
  peer-tier fourth interface (Fact 1).
- The three interfaces are named as peers at 00:07 ("peers, not a ladder") and
  each flow beat changes the *room*, never a *tier*.
- `www.shivanshelectronics.in` is the only URL spoken, in the reel's final line,
  landing on the same beat as the on-screen outro lockup — the reel's single
  most emphasized destination, matching its 7 on-screen appearances against 1
  for the next-most-repeated detail.
- Every specification quoted is from the VERIFIED column of Brief Stage 8, the
  same figures the on-screen headings and labels use (SPEC-bound in
  `src/schedule.ts`, not retyped).

## Word budget (checked against this reel's ~175–185 wpm pace)

| Beat | Duration | Budget | Script | Fit |
|---|---|---|---|---|
| hook-faces | 7 s | ~21–24 | 22 | comfortable |
| hook-peers | 5 s | ~15–17 | 11 | comfortable |
| flow-silicon | 6 s | ~17–19 | 12 | comfortable |
| flow-route | 8 s | ~23–26 | 25 | fits |
| flow-sweep | 6 s | ~17–19 | 8 | comfortable |
| flow-capture | 6 s | ~17–19 | 18 | fits |
| flow-command | 5 s | ~15–17 | 12 | comfortable |
| flow-brand | 4 s | ~12–13 | 13 | fits |
| flow-mixer | 6 s | ~17–19 | 14 | comfortable |
| flow-window | 4 s | ~12–13 | 12 | fits |
| net-builtin | 6 s | ~17–19 | 14 | comfortable |
| net-switch | 6 s | ~17–19 | 11 | comfortable |
| net-standards | 4 s | ~12–13 | 8 | comfortable |
| cta-climax | 5 s | ~15–17 | 4 | deliberately spare — see note |
| cta-price | 6 s | ~17–19 | **42** | **over budget by design — see note** |
| cta-outro | 4 s | ~12–13 | 5 | deliberately spare — see note |

**Note on cta-climax and cta-outro.** Both are held short on purpose: the
climax beat's on-screen "Four products. One network." is doing the emotional
work while the four hero images assemble, and the outro is a lockup shot the
viewer should be reading, not listening past. Loading either with more words
would fight the visual, not support it.

**Note on cta-price — the one deliberately over-budget block, exactly as in
every longer format in this pipeline.** The full distributor designation plus
both unrounded MOPs is 42 words and cannot be cut — every longer format in this
pipeline hit the identical wall for the identical reason. At 175 wpm that's
~14.4 s of speech against a 6 s beat.

**This is the tightest copy constraint anywhere in this pipeline, and it does
not resolve by speaking faster.** Two structural options, in order of
preference:

1. **Extend cta-price to ~15 s and pull the difference from earlier beats.**
   The flow segment (00:12–00:57, 8 beats) has the most beats to draw a couple
   of seconds from without any single one going silent-fast; `flow-silicon`
   (6 s, 12 words) and `net-standards` (4 s, 8 words) both have slack already.
   This keeps the picture's total at 88 s only if paired with an equal cut
   elsewhere — it is a *schedule* change, not a narration trick, so treat it as
   a `src/schedule.ts` edit alongside the VO, not a read-it-fast fix.
2. **Split the price line across two adjacent beats.** Say the distributor
   designation and the interface MOP during `cta-climax` (its 5 s can absorb a
   short lead-in without competing with on-screen text, since the climax
   heading is only four words), and land the AVB Switch MOP alone, unhurried,
   in `cta-price`. This needs no schedule change at all — it only redistributes
   which words sit under which beat — but check on a rendered still that the
   climax beat's audio doesn't crowd the four-image assembly it's timed to.

The script above is written straight through as one price beat because that is
what the rendered picture currently supports; whichever option is chosen at
recording time, do not shorten the designation or round either figure to make
it fit — cut screen time elsewhere first, exactly as this reel's own build
notes did when a legibility check forced the outro from 3 s to 4 s.
