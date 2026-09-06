// Text-layer gate: proves the heading/subheading track satisfies the
// rectification rules before anything is rendered.
//
//   * formatting — heading ALL UPPERCASE, subheading Title Case, 2–4 words,
//     no terminal punctuation on either, no spec values
//   * cuts — every card starts and ends on an existing cut (nothing re-timed)
//   * coverage — no product imagery is ever left with no legible text for
//     longer than MAX_SILENT_S
//   * product changes — a new product always opens a fresh pair on that cut
import { TEXT_TRACK, validateTrack, trackStats, MAX_SILENT_S } from "../src/data/text-track.ts";
import { TIMELINE } from "../src/data/timeline.ts";
import { FPS, ACTS, beatFrame } from "../src/data/grid.ts";

const t = (f) => `${String(Math.floor(f / FPS / 60)).padStart(1)}:${(f / FPS % 60).toFixed(2).padStart(5, "0")}`;

console.log("── text track ─────────────────────────────────────────────────────────");
for (const c of TEXT_TRACK) {
  console.log(
    `${c.act}  ${t(c.startFrame)} → ${t(c.endFrame)}  ${((c.endFrame - c.startFrame) / FPS).toFixed(2).padStart(5)}s  ` +
    `${c.motion.padEnd(7)} ${c.heading.padEnd(12)} / ${c.sub}`
  );
}

// per-shot report: what text is on screen for every shot of the product acts
const SUPPRESS = new Set(["title", "word", "mood", "script"]);
let uncovered = 0;
console.log("\n── per-shot coverage (product acts) ───────────────────────────────────");
for (const s of TIMELINE.shots) {
  if (!["act1", "act2", "act3", "act4"].includes(s.act)) continue;
  const owns = s.text && SUPPRESS.has(s.text.role);
  const card = TEXT_TRACK.find((c) => s.startFrame >= c.startFrame && s.startFrame < c.endFrame);
  const what = owns ? `own ${s.text.role}: "${s.text.value}"` : card ? `band: ${card.heading} / ${card.sub}` : "*** NO TEXT ***";
  if (!owns && !card) uncovered++;
  console.log(`${s.act} rel${String(s.rel).padStart(5)} ${s.kind.padEnd(6)} ${what}`);
}

const issues = validateTrack();
console.log("\n── stats ──────────────────────────────────────────────────────────────");
console.log(trackStats());
const total = beatFrame(ACTS.find((a) => a.id === "act4").endBeat) - beatFrame(ACTS.find((a) => a.id === "act1").startBeat);
const banded = TEXT_TRACK.reduce((a, c) => a + (c.endFrame - c.startFrame), 0);
const owned = TIMELINE.shots.filter((s) => ["act1", "act2", "act3", "act4"].includes(s.act) && s.text && SUPPRESS.has(s.text.role)).reduce((a, s) => a + (s.endFrame - s.startFrame), 0);
console.log(`product acts: ${(total / FPS).toFixed(2)}s   band up: ${(banded / FPS).toFixed(2)}s   own text moments: ${(owned / FPS).toFixed(2)}s   → ${(((banded + owned) / total) * 100).toFixed(1)}% of product time carries text`);
console.log(`shots with no text of any kind: ${uncovered}   silent-run limit: ${MAX_SILENT_S}s`);

console.log("\n── validation ─────────────────────────────────────────────────────────");
if (!issues.length) console.log("ok — all formatting, cut-alignment and coverage rules pass");
for (const i of issues) console.log(`${i.level.toUpperCase()}: ${i.message}`);
process.exit(issues.some((i) => i.level === "error") ? 1 : 0);
