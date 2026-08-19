# Asset coverage — MOTU AVB Compressed Reel

**26 curated images**, selected from the **120 unique product images** in the
repository (141 files; 19 fold into others on identical pixel content, confirmed
by a format-agnostic hash rather than by filename similarity — `MOTU 10pre (23).jpg`,
`MOTU 16A (3).jpg` and `MOTU 848 (6).jpg` are one image under three names).

Unlike the long-form video and the three-part reel series, this reel does **not**
carry "every enumerated image must appear". It carries a curated selection
instead; the reasoning per block, and the full account of what was deliberately
left out, is in `scripts/curation.mjs`.

What is **not** relaxed is completeness per image. Every image below renders
through `<Plate>` (`object-fit: contain`), so it is shown whole and uncropped —
including every member of a clubbed Ecosystem Montage beat, each of which holds
the frame alone at full size before the group assembles. `scripts/whole-unit.mjs`
verifies that on rendered stills.

Images 9, 18 and 62 appear in two beats each, deliberately: they carry the thesis
Ecosystem Montage at 00:38 and then return inside their own product segment as a
callback.

The two brand logos (121, 122) appear throughout via the Brand
components rather than through any beat's image list.

| # | Product | Tier | Source file | Appears at |
|---|---|---|---|---|
| 9 | 10pre | support | `MOTU 10pre (13).jpg` | 00:00 hook-faces |
| 11 | Shared | support | `MOTU 10pre (14).jpg` | 00:47 flow-mixer |
| 18 | 848 | support | `MOTU 10pre (20).jpg` (+1 identical) | 00:00 hook-faces |
| 20 | Shared | support | `MOTU 10pre (22).jpg` (+1 identical) | 00:57 net-builtin |
| 24 | Shared | support | `MOTU 10pre (26).jpg` (+2 identical) | 00:12 flow-silicon |
| 26 | Shared | support | `MOTU 10pre (28).jpg` (+1 identical) | 00:12 flow-silicon |
| 30 | 10pre | hero | `MOTU 10pre (4).png` | 00:07 hook-peers |
| 31 | Shared | support | `MOTU 10pre (5).jpg` | 00:53 flow-window |
| 35 | 10pre | hero | `MOTU 10pre (8).png` | 00:32 flow-capture |
| 39 | 10pre | hero | `MOTU 10PRE NEWLY ADDED (3).png` | 00:32 flow-capture |
| 41 | 10pre | hero | `MOTU 10PRE NEWLY ADDED.png` | 01:13 cta-climax |
| 51 | 16A | hero | `MOTU 16A (13).png` | 00:26 flow-sweep |
| 54 | 16A | support | `MOTU 16A (16).jpg` | 00:47 flow-mixer |
| 62 | 16A | support | `MOTU 16A (24).jpg` | 00:00 hook-faces |
| 68 | Network | support | `MOTU 16A (5).jpg` (+1 identical) | 00:57 net-builtin |
| 76 | 16A | hero | `MOTU 16A (9).png` | 00:07 hook-peers |
| 79 | 16A | hero | `MOTU 16A NEWLY ADDED (3).png` | 00:18 flow-route |
| 80 | 16A | hero | `MOTU 16A NEWLY ADDED (4).png` | 01:13 cta-climax |
| 85 | 848 | hero | `MOTU 848 (11).png` | 00:07 hook-peers |
| 97 | 848 | support | `MOTU 848 (25).jpg` | 00:38 flow-command |
| 100 | Network | support | `MOTU 848 (3).png` | 01:09 net-standards |
| 110 | 848 | hero | `MOTU 848 NEWLY ADDED (3).png` | 00:38 flow-command |
| 111 | 848 | hero | `MOTU 848 NEWLY ADDED (4).png` | 01:13 cta-climax |
| 112 | AVBSwitch | hero | `MOTU AVB SWITCH (1).jpg` | 01:03 net-switch |
| 114 | AVBSwitch | hero | `MOTU AVB SWITCH (2).jpg` | 01:13 cta-climax |
| 115 | Network | support | `MOTU AVB SWITCH (2).png` | 01:09 net-standards |
