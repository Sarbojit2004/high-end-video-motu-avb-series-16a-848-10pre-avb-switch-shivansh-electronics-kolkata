#!/usr/bin/env node
// Generates VO_SCRIPT_EXPLAINER_REEL.md — the read-aloud deliverable (Section 8).
//
// Run:  node --experimental-strip-types scripts/build-script.mjs
//
// Every timestamp here is DERIVED from src/script.ts, never typed by hand, so
// the printed script and the on-screen captions can never disagree.
import { writeFileSync } from "node:fs";
import { buildTimeline, WPM, SEGMENT_GAP } from "../src/script.ts";

const { segments, total } = buildTimeline();

const ts = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const tsp = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`;

const TITLES = {
  open: "COLD OPEN — the ecosystem, before any product is named",
  s16a: "MOTU 16A — no preamps, maximum clean line I/O",
  s848: "MOTU 848 — four preamps and a control room",
  s10pre: "MOTU 10pre — ten preamps, split front and rear",
  sswitch: "MOTU AVB SWITCH — the network, not the box",
  close: "ECOSYSTEM CLOSE — same platform, different front panel",
};

// Reading notes the client needs in order to actually perform the read.
const NOTES = {
  open:
    "Level, unhurried, slightly cold. This is the thesis of the whole film — " +
    "do not sell yet. Let 'One network' land before moving on.",
  s16a:
    "'It has no microphone preamps' is a deliberate anticlimax — say it flat, " +
    "then let 'That is the point.' turn it. Lift into the numbers at the end.",
  s848:
    "Warmer than the 16A section. 'The presenter hears one thing / The remote " +
    "guest hears another' is a two-beat rhythm — equal weight, small gap between.",
  s10pre:
    "This is the most physical section. 'a microphone in your hand' should sound " +
    "like a real room, not a spec. Slight acceleration through the front/rear split.",
  sswitch:
    "Drop the warmth. This is engineering. Read '802.1AS' as 'eight-oh-two dot " +
    "one A S'. '4,096' is 'four thousand and ninety-six'. Keep the numbers clean " +
    "and unhurried — they are the credibility of the whole section.",
  close:
    "Gather everything. Slow down through the three 'same' lines, then land " +
    "'Choose by the front panel.' as the conclusion. Sign-off is warm and plain.",
};

const words = segments.reduce((a, s) => a + s.words, 0);

let md = `# MOTU AVB ECOSYSTEM — 3-MINUTE NARRATED EXPLAINER REEL
## SPEECH SCRIPT FOR CLIENT RECORDING

**Client:** Shivansh Electronics, Kolkata
**Deliverable:** \`explainer-reel\` — 180.000 s / 2160 × 3840 (9:16, 4K portrait) / 30 fps
**Voice:** to be recorded by the client. No AI or synthesised narration is used anywhere in this build.

---

## HOW TO USE THIS SCRIPT

Read it top to bottom in one take if you can. The reel is cut to these
timestamps, so the closer your read sits to them, the less re-timing is needed.

| | |
|---|---|
| **Total script length** | **${words} words** |
| **Written speaking rate** | **${WPM} wpm** (inside the 150–165 brief) |
| **Effective rate over the full 3 minutes** | **${(words / (total / 60)).toFixed(1)} wpm** — the difference is the pauses below |
| **Total runtime** | **${total.toFixed(2)} s** |
| **Pause held between segments** | ${SEGMENT_GAP.toFixed(2)} s |

**On the two rates.** The script is *written* at ${WPM} wpm — that is how fast the
words themselves should come out while you are speaking a phrase. Across the whole
three minutes the average drops to ~${(words / (total / 60)).toFixed(0)} wpm, because roughly
${(total - (words / WPM) * 60).toFixed(0)} seconds of the runtime is deliberate silence: the beats after
each thought and the gap between segments. Both figures sit inside the brief's
150–165 band. **Do not try to fill the pauses** — they are where the visuals land.

**Marks in the text.**

- \`▌\` a short beat — roughly a quarter-second. End of a thought.
- \`▌▌\` the segment break — take a full breath, the picture changes here.
- **Bold** words are the ones emphasised on screen in the product's accent colour.
  Give them a little more weight in the read; the caption is timed to you.

**Numbers, said aloud.** \`74 dB\` = "seventy-four dee-bee". \`−129 dBu\` = "minus one
twenty-nine dee-bee-you". \`125 dB\` = "one hundred and twenty-five dee-bee".
\`802.1AS\` = "eight-oh-two dot one A S". \`4,096\` = "four thousand and ninety-six".
\`256\` = "two hundred and fifty-six". \`512\` = "five hundred and twelve".
\`CAT-6\` = "cat six". \`Sabre32\` = "sabre thirty-two".

---

`;

for (const seg of segments) {
  md += `## ${ts(seg.start)} – ${ts(seg.end)}  ·  ${TITLES[seg.id]}\n\n`;
  md += `> **${seg.words} words · ${(seg.end - seg.start).toFixed(1)} s**\n>\n`;
  md += `> *Delivery:* ${NOTES[seg.id]}\n\n`;

  // The spoken paragraph, with emphasis and beat marks in place.
  const body = seg.captions
    .map((c) => {
      let t = c.t;
      if (c.e && t.includes(c.e)) t = t.replace(c.e, `**${c.e}**`);
      return t + (c.beat ? " ▌" : "");
    })
    .join(" ");
  md += `${body} ▌▌\n\n`;

  // Per-line cue sheet, so a re-take can be dropped in at the right place.
  md += `<details><summary>Line-by-line cue sheet (${seg.captions.length} caption lines)</summary>\n\n`;
  md += `| In | Line as spoken | On-screen emphasis |\n|---|---|---|\n`;
  for (const c of seg.captions) {
    md += `| \`${tsp(c.start)}\` | ${c.t} | ${c.e ? `**${c.e}**` : "—"} |\n`;
  }
  md += `\n</details>\n\n---\n\n`;
}

md += `## AFTER YOU RECORD

Save the take as a single continuous WAV or MP3 and drop it in at:

\`\`\`
explainer-reel/public/audio/vo.wav
\`\`\`

A silent placeholder of exactly the right length is already sitting at that path,
so **nothing in the project needs to be edited** — replace the file, re-render,
and the voice is in the film. If your take runs longer or shorter than
${total.toFixed(1)} s, run:

\`\`\`
node --experimental-strip-types scripts/sync-vo.mjs
\`\`\`

which measures the recording and reports the drift per segment against these
timestamps, so the edit can be nudged to your actual read rather than the
other way round.

---

## TECHNICAL ACCURACY

Every specification spoken in this script is taken from the sixteen product
documents supplied for this build, cross-checked against all four tech-spec
sheets:

| Claim in script | Source |
|---|---|
| 16A: 16 balanced line inputs, 16 DC-coupled outputs, 32 in / 34 out | \`TECH_SPECS__MOTU_16A\` |
| 16A: 125 dB output dynamic range, ESS Sabre32 | \`TECH_SPECS__MOTU_16A\`, \`DESCRIPTIONS__MOTU_16A\` |
| 16A: DC-coupled outputs transmit CV to Eurorack | \`DESCRIPTIONS__MOTU_16A\`, \`WORKFLOWS_PART2__MOTU_16A\` (Wf 8) |
| 848: 4 combo preamps, +74 dB gain, −129 dBu EIN | \`TECH_SPECS__MOTU_848\` |
| 848: 8 line inputs, 12 outputs, inserts on ch 3–4 | \`TECH_SPECS__MOTU_848\` |
| 848: A/B/C monitor select, 2 headphones w/ independent cues | \`TECH_SPECS__MOTU_848\` |
| 10pre: 10 combo preamps — 6 rear, 4 front | \`TECH_SPECS__MOTU_10PRE\` |
| 10pre: 48 V phantom, −20 dB pad per channel | \`TECH_SPECS__MOTU_10PRE\` |
| 10pre: same −129 dBu EIN / 118 dB as the 848 | \`TECH_SPECS__MOTU_10PRE\` + \`__848\` |
| Switch: 6 Gigabit ports, no analogue I/O | \`TECH_SPECS__MOTU_AVB_Switch\` |
| Switch: 802.1AS gPTP, nanosecond clock accuracy | \`TECH_SPECS__MOTU_AVB_Switch\` |
| Switch: 802.1Qav credit-based shaping guarantees bandwidth | \`TECH_SPECS__MOTU_AVB_Switch\` |
| Switch: 512 streams, up to 4,096 channels | \`TECH_SPECS__MOTU_AVB_Switch\` |
| Switch: one CAT-6 run replaces the snake | \`WORKFLOWS_PART1__MOTU_AVB_Switch\` (Wf 2A) |
| Shared: Thunderbolt 4 / USB4, 256 computer channels | all three interface spec sheets |
| Shared: 64-ch mixer, 26 aux buses, standalone operation | all three interface spec sheets |
| Shared: CueMix Pro across the range | all three interface spec sheets |

*Note on the AVB Switch:* it is configured with **MOTU Discovery**, not CueMix Pro.
The script's "same CueMix Pro across all three" line is therefore scoped to the
three interfaces only, which is why it is worded that way.
`;

writeFileSync("../VO_SCRIPT_EXPLAINER_REEL.md", md);
console.log(
  `VO_SCRIPT_EXPLAINER_REEL.md written — ${words} words, ${total.toFixed(2)}s, ` +
    `${WPM} wpm written / ${(words / (total / 60)).toFixed(1)} wpm effective`,
);
