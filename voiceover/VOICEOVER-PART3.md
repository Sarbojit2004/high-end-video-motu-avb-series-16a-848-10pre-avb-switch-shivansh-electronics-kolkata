# MOTU AVB Series — Reel Part 3 of 3
## "The Control Room" · MOTU 848

**Runtime** 88.000 s (2,640 frames @ 30 fps) · **Format** 1080×1920 portrait 9:16  
**Language** English only · **Tone** Cinematic & Aspirational (brief §9, option 2)

The voiceover is written as discrete timeline-mapped segments, each locked to one visual
beat. Picture and narration change together: there is no beat where the voice has moved on
while the screen lingers, and none where new imagery arrives unnarrated.

Pace is planned at 2.2–2.5 words/second. Record to the frame ranges below — if a read comes
in long or short, move the **segment boundary**, never rush the delivery.

---

## Voiceover → timeline

| # | Segment | Script | Start | End | Frames | Sec | Words | w/s | On-screen assets |
|---|---------|--------|-------|-----|--------|-----|-------|-----|------------------|
| s1 | Hook — where the mix is heard | The signal has been captured, and routed. This is where it is finally heard. | 00:00.00 | 00:06.83 | 0–205 | 6.8 | 14 | 2.05 | 848 (11) |
| s2 | Twelve outputs → 7.1.4 | Twelve balanced analog outputs. Not eleven, not sixteen. Exactly the count a seven-one-four Dolby Atmos array needs, from one clock source. | 00:06.83 | 00:17.07 | 205–512 | 10.2 | 21 | 2.05 | 848 (16), 848 (12), 848 (18) |
| s3 | One clock, no aggregation | No aggregated devices. No second interface fighting for sync. No phase smearing across the speaker array. | 00:17.07 | 00:24.87 | 512–746 | 7.8 | 16 | 2.05 | 848 (1), 848 (17), 848 (7) |
| s4 | Four combo inputs | Four combo inputs handle the everyday work: a vocal overdub, a bass direct, a stereo synth. Seventy-four decibels of gain when you need it. | 00:24.87 | 00:36.03 | 746–1081 | 11.2 | 24 | 2.15 | 848 (23), 848 (9), 848 (2) |
| s5 | Inserts on channels 3-4 | Channels three and four carry dedicated analog inserts, so your favourite vocal compressor stays patched into the path. | 00:36.03 | 00:44.60 | 1081–1338 | 8.6 | 18 | 2.10 | 848 (20), 848 (6) |
| s6 | Monitor control: A/B/C + talkback | Hardware A, B and C speaker switching. Talkback. Two independent headphone outputs with programmable sources. | 00:44.60 | 00:51.93 | 1338–1558 | 7.3 | 15 | 2.05 | 10pre (20), 848 (15), 848 (25) |
| s7 | The renderer, routed | CueMix Pro maps the renderer output straight onto the physical array, point to point, with metering on every leg. | 00:51.93 | 01:00.97 | 1558–1829 | 9.0 | 19 | 2.10 | 848 (26), 10pre (21), 848 (3), 848 (22), 848 (4) |
| s8 | The shared engine, again | And beneath it, the same engine as the other two. Same converters, same DSP, same forty-gigabit connection. | 01:00.97 | 01:09.07 | 1829–2072 | 8.1 | 17 | 2.10 | 848 (13), 848 (8), 848 (24), 848 (1), 848 (2) |
| s9 | The network completes | One Cat-6 cable ties the tracking room, the mix suite and this control room into a single Milan-certified network. | 01:09.07 | 01:18.10 | 2072–2343 | 9.0 | 19 | 2.10 | 10pre (25), 10pre (22), 848 (3), 848 (10), 848 (11), 848 (5) |
| s10 | Final CTA | One engine. Three specialized front-ends. One identical investment. Available now from Shivansh Electronics, MOTU’s Authorized Distributor for East and North East India. | 01:18.10 | 01:28.00 | 2343–2640 | 9.9 | 22 | 2.22 |  |

**Total** 2,640 frames · 88.000 s · 185 words · 2.10 w/s overall

---

## Continuous read (for the voice talent)

**s1** (00:00.00)  The signal has been captured, and routed. This is where it is finally heard.

**s2** (00:06.83)  Twelve balanced analog outputs. Not eleven, not sixteen. Exactly the count a seven-one-four Dolby Atmos array needs, from one clock source.

**s3** (00:17.07)  No aggregated devices. No second interface fighting for sync. No phase smearing across the speaker array.

**s4** (00:24.87)  Four combo inputs handle the everyday work: a vocal overdub, a bass direct, a stereo synth. Seventy-four decibels of gain when you need it.

**s5** (00:36.03)  Channels three and four carry dedicated analog inserts, so your favourite vocal compressor stays patched into the path.

**s6** (00:44.60)  Hardware A, B and C speaker switching. Talkback. Two independent headphone outputs with programmable sources.

**s7** (00:51.93)  CueMix Pro maps the renderer output straight onto the physical array, point to point, with metering on every leg.

**s8** (01:00.97)  And beneath it, the same engine as the other two. Same converters, same DSP, same forty-gigabit connection.

**s9** (01:09.07)  One Cat-6 cable ties the tracking room, the mix suite and this control room into a single Milan-certified network.

**s10** (01:18.10)  One engine. Three specialized front-ends. One identical investment. Available now from Shivansh Electronics, MOTU’s Authorized Distributor for East and North East India.

---

## Notes

- **No competitor or interoperability-partner brands** are named anywhere. Milan
  certification is conveyed as the substance of the claim — that these units interoperate
  with other Milan-certified equipment across the professional audio industry — without
  naming third-party manufacturers.
- **Pricing** appears only as Market Operating Price (MOP), in the Part 3 CTA, framed as one
  identical investment rather than three separate prices.
- **Distributor designation** is used unabbreviated: "Shivansh Electronics, MOTU's Authorized
  Distributor for East and North East India."
- The reel ships with an original score and original synthesised sound design mixed low
  (`audio/score_part3.py`), so a recorded voiceover can be laid over
  `audio/out/bed_part3.wav` without re-balancing the bed.
