# MOTU AVB Series — Long-form video Part 3 of 3
## "The Control Room" · MOTU 848

**Runtime** 298.000 s (8,940 frames @ 30 fps) · **Format** 1920x1080 landscape 16:9  
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
| s1 | Door three | The signal has been captured in the live room, and routed through the mix suite. This is the last place it goes — the room where somebody finally decides whether it is finished. | 00:00.00 | 00:13.63 | 0–409 | 13.6 | 33 | 2.42 | 848 (11) |
| s2 | Twelve outputs | Twelve balanced analog outputs. Not eight, not sixteen. Twelve is a very specific number, and the reason it is twelve is the single most important thing about this unit — it is the difference between a stereo mix room and an immersive one. | 00:13.63 | 00:31.40 | 409–942 | 17.8 | 43 | 2.42 | 848 (16), 848 (12) |
| s3 | Why twelve — the 7.1.4 array | A seven-one-four Dolby Atmos monitoring array is seven ear-level speakers, one subwoofer channel, and four height speakers overhead. Seven, plus one, plus four. That is twelve discrete feeds, and every one of them needs its own analog output. | 00:31.40 | 00:47.10 | 942–1413 | 15.7 | 38 | 2.42 | 848 (18), 848 (1) |
| s4 | One clock source | The usual way to reach twelve outputs is to aggregate two interfaces. That works on paper and causes trouble in practice: two converters, two clocks, and a drift between them that shows up as phase smearing across the speaker array — precisely the thing an immersive mix is supposed to reveal. | 00:47.10 | 01:08.17 | 1413–2045 | 21.1 | 51 | 2.42 | 848 (17), 848 (7) |
| s5 | No aggregation | Here all twelve outputs come off one unit, from one ESS Sabre32 clock. There is nothing to synchronise, nothing to drift apart over a long session, and no aggregate device sitting between the renderer and the room pretending two boxes are one. | 01:08.17 | 01:25.53 | 2045–2566 | 17.4 | 42 | 2.42 | 848 (8), 848 (13) |
| s6 | Four combo inputs | Capture here is deliberately modest, because a control room is not a tracking room. Four combo inputs take microphone, line or high-impedance instrument signals, with seventy-four decibels of gain and an equivalent input noise figure of minus one hundred and twenty-nine dBu. | 01:25.53 | 01:42.90 | 2566–3087 | 17.4 | 42 | 2.42 | 848 (23), 848 (2) |
| s7 | What those four are for | That covers what actually happens in a mix room. A vocal fix. A bass guitar taken direct. A stereo synthesizer. A voiceover pickup for a picture session. Enough capture to keep the work moving without anyone leaving the chair or booking the live room. | 01:42.90 | 02:01.10 | 3087–3633 | 18.2 | 44 | 2.42 | 848 (9), 848 (24) |
| s8 | Inserts on channels 3-4 | Channels three and four carry dedicated analog send and return inserts, ahead of conversion. Your favourite vocal compressor stays permanently patched into the path, so the sound you print is the sound you approved. | 02:01.10 | 02:15.17 | 3633–4055 | 14.1 | 34 | 2.42 | 848 (20), 848 (6) |
| s9 | A/B/C monitor switching | On the front, hardware monitor control. A, B and C speaker selection, switched in the analog domain, so you can check a mix on the mains, the nearfields and the reference pair without touching a plug-in or leaving the listening position. | 02:15.17 | 02:32.10 | 4055–4563 | 16.9 | 41 | 2.42 | 10pre (20), 848 (25) |
| s10 | Talkback and headphones | There is talkback built in, and two independent headphone outputs, each with its own programmable source. The engineer and the client can be listening to entirely different mixes while the room monitors stay muted — useful when someone needs to check a stem without stopping the session. | 02:32.10 | 02:51.53 | 4563–5146 | 19.4 | 47 | 2.42 | 848 (15), 848 (4) |
| s11 | The display | The front-panel display carries live metering for inputs, outputs, monitor level and clock status. In an immersive session, being able to see all twelve legs of the array metered at the hardware — not in a plug-in window behind three other windows — is worth more than it sounds. | 02:51.53 | 03:11.80 | 5146–5754 | 20.3 | 49 | 2.42 | 848 (22) |
| s12 | CueMix — renderer to array | CueMix Pro maps the renderer output straight onto the physical array. Each channel of the Atmos bed lands on the speaker it belongs to, point to point, and you can confirm that mapping visually rather than trusting it. | 03:11.80 | 03:27.50 | 5754–6225 | 15.7 | 38 | 2.42 | 848 (26), 848 (3) |
| s13 | CueMix — routing and trim | Individual output trim lets you level-match the array without touching the renderer at all. That matters in a real room, where one height speaker almost always ends up closer to the listening position than the other three. | 03:27.50 | 03:42.80 | 6225–6684 | 15.3 | 37 | 2.42 | 10pre (21), 848 (1) |
| s14 | The shared engine, once more | Underneath, it is the same platform as the other two units. The same converters, the same thirty-two-bit DSP, the same forty-gigabit Thunderbolt 4 connection, the same sub-two-millisecond round trip. | 03:42.80 | 03:54.80 | 6684–7044 | 12.0 | 29 | 2.42 | 848 (2), 848 (10) |
| s15 | Bundled content | And the same bundled production library arrives with it — instruments, loops and effects, rather than a bare driver package, which is not nothing when the unit is already doing the work of a monitor controller. | 03:54.80 | 04:09.67 | 7044–7490 | 14.9 | 36 | 2.42 | 848 (11), 848 (5) |
| s16 | The network completes | Now the three rooms connect. A single Cat-6 cable ties the tracking room, the mix suite and this control room into one Milan-certified network — an open standard governed by the Avnu Alliance, interoperating with other Milan-certified equipment across the professional audio industry. | 04:09.67 | 04:27.43 | 7490–8023 | 17.8 | 43 | 2.42 | 10pre (25), 10pre (22) |
| s17 | One platform | Eight devices. One hundred and twenty-eight channels per device. Two milliseconds of fixed, deterministic latency. And one routing matrix covering the whole facility, from the microphone in the live room to the height speaker above the mix position. | 04:27.43 | 04:43.13 | 8023–8494 | 15.7 | 38 | 2.42 | 848 (3) |
| s18 | Final CTA | One engine. Three specialized front-ends. One identical investment: Market Operating Price one lakh eighty-seven thousand nine hundred rupees, including GST, per unit. Available now from Shivansh Electronics, MOTU\'s Authorized Distributor for East and North East India. | 04:43.13 | 04:58.00 | 8494–8940 | 14.9 | 36 | 2.42 |  |

**Total** 8,940 frames · 298.000 s · 721 words · 2.42 w/s overall

---

## Continuous read (for the voice talent)

**s1** (00:00.00)  The signal has been captured in the live room, and routed through the mix suite. This is the last place it goes — the room where somebody finally decides whether it is finished.

**s2** (00:13.63)  Twelve balanced analog outputs. Not eight, not sixteen. Twelve is a very specific number, and the reason it is twelve is the single most important thing about this unit — it is the difference between a stereo mix room and an immersive one.

**s3** (00:31.40)  A seven-one-four Dolby Atmos monitoring array is seven ear-level speakers, one subwoofer channel, and four height speakers overhead. Seven, plus one, plus four. That is twelve discrete feeds, and every one of them needs its own analog output.

**s4** (00:47.10)  The usual way to reach twelve outputs is to aggregate two interfaces. That works on paper and causes trouble in practice: two converters, two clocks, and a drift between them that shows up as phase smearing across the speaker array — precisely the thing an immersive mix is supposed to reveal.

**s5** (01:08.17)  Here all twelve outputs come off one unit, from one ESS Sabre32 clock. There is nothing to synchronise, nothing to drift apart over a long session, and no aggregate device sitting between the renderer and the room pretending two boxes are one.

**s6** (01:25.53)  Capture here is deliberately modest, because a control room is not a tracking room. Four combo inputs take microphone, line or high-impedance instrument signals, with seventy-four decibels of gain and an equivalent input noise figure of minus one hundred and twenty-nine dBu.

**s7** (01:42.90)  That covers what actually happens in a mix room. A vocal fix. A bass guitar taken direct. A stereo synthesizer. A voiceover pickup for a picture session. Enough capture to keep the work moving without anyone leaving the chair or booking the live room.

**s8** (02:01.10)  Channels three and four carry dedicated analog send and return inserts, ahead of conversion. Your favourite vocal compressor stays permanently patched into the path, so the sound you print is the sound you approved.

**s9** (02:15.17)  On the front, hardware monitor control. A, B and C speaker selection, switched in the analog domain, so you can check a mix on the mains, the nearfields and the reference pair without touching a plug-in or leaving the listening position.

**s10** (02:32.10)  There is talkback built in, and two independent headphone outputs, each with its own programmable source. The engineer and the client can be listening to entirely different mixes while the room monitors stay muted — useful when someone needs to check a stem without stopping the session.

**s11** (02:51.53)  The front-panel display carries live metering for inputs, outputs, monitor level and clock status. In an immersive session, being able to see all twelve legs of the array metered at the hardware — not in a plug-in window behind three other windows — is worth more than it sounds.

**s12** (03:11.80)  CueMix Pro maps the renderer output straight onto the physical array. Each channel of the Atmos bed lands on the speaker it belongs to, point to point, and you can confirm that mapping visually rather than trusting it.

**s13** (03:27.50)  Individual output trim lets you level-match the array without touching the renderer at all. That matters in a real room, where one height speaker almost always ends up closer to the listening position than the other three.

**s14** (03:42.80)  Underneath, it is the same platform as the other two units. The same converters, the same thirty-two-bit DSP, the same forty-gigabit Thunderbolt 4 connection, the same sub-two-millisecond round trip.

**s15** (03:54.80)  And the same bundled production library arrives with it — instruments, loops and effects, rather than a bare driver package, which is not nothing when the unit is already doing the work of a monitor controller.

**s16** (04:09.67)  Now the three rooms connect. A single Cat-6 cable ties the tracking room, the mix suite and this control room into one Milan-certified network — an open standard governed by the Avnu Alliance, interoperating with other Milan-certified equipment across the professional audio industry.

**s17** (04:27.43)  Eight devices. One hundred and twenty-eight channels per device. Two milliseconds of fixed, deterministic latency. And one routing matrix covering the whole facility, from the microphone in the live room to the height speaker above the mix position.

**s18** (04:43.13)  One engine. Three specialized front-ends. One identical investment: Market Operating Price one lakh eighty-seven thousand nine hundred rupees, including GST, per unit. Available now from Shivansh Electronics, MOTU\'s Authorized Distributor for East and North East India.

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
  (`audio/score_long3.py`), so a recorded voiceover can be laid over
  `audio/out/bed_long3.wav` without re-balancing the bed.
