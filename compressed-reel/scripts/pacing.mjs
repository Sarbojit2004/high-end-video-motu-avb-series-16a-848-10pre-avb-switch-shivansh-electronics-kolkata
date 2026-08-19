// CHECKPOINT 5 — the fastest cadence in this pipeline, checked rather than claimed.
//
// Section 5 asks for a noticeably faster cadence than the 298 s master reel
// (7.1 s average) or the three-part reels (7.4-8.1 s), without turning into a
// blur. Checked: no beat is a disproportionate share of the runtime, every beat
// carries motion vocabulary rather than holding a static composition, no more
// than three beats of a kind run consecutively, and no two adjacent beats reuse
// a transition SFX — which matters far more here, because Layer 2 fires at
// roughly double the master reel's rate inside a third of the runtime.
import { loadSchedule } from "./_load.mjs";
const { BEATS, BEAT_STARTS, frames, TOTAL_SECONDS } = await loadSchedule();

// Which kinds are inherently in motion for their whole duration.
const MOVING = {
  hook: "macro-to-full-reveal", macroReveal: "macro-to-full-reveal",
  portSweep: "port density sweep", dataFlow: "data flow reveal + macro",
  ecosystemMontage: "solo passes then assembly", ecosystemSplit: "synchronised light sweep",
  montage: "staggered tile assembly", badges: "staggered reveal",
  specGrid: "staged spec chips + gimbal", software: "gimbal drift",
  brandBeat: "staged lockup", price: "staged price lockup",
  cta: "staged contact reveal", outro: "staged outro lockup",
};

let fail = 0;
const longest = Math.max(...BEATS.map((b) => b.sec));
const share = (longest / TOTAL_SECONDS) * 100;
console.log(`beats: ${BEATS.length}   runtime: ${TOTAL_SECONDS}s   average ${(TOTAL_SECONDS / BEATS.length).toFixed(1)}s`);
console.log(`first cut at ${BEATS[0].sec}s   longest beat ${longest}s (${share.toFixed(1)}% of runtime)`);
// 88 s is short enough that one 8 s beat is legitimately 9% of it; the
// master reel's 5% ceiling would be the wrong test at this length.
if (share > 10) { console.error(`   FAIL a single beat is ${share.toFixed(1)}% of the runtime`); fail++; }
if (BEATS[0].sec > 8) { console.error(`   FAIL first cut lands at ${BEATS[0].sec}s`); fail++; }
const avg = TOTAL_SECONDS / BEATS.length;
if (avg >= 7.1) { console.error(`   FAIL average beat ${avg.toFixed(1)}s is not faster than the master reel's 7.1s`); fail++; }

for (const b of BEATS) {
  if (!MOVING[b.kind]) { console.error(`   FAIL ${b.id} (${b.kind}) has no motion vocabulary`); fail++; }
}

// Adjacent beats should not repeat the same kind more than twice running, or
// the segment starts to feel like a slideshow.
let run = 1;
for (let i = 1; i < BEATS.length; i++) {
  run = BEATS[i].kind === BEATS[i - 1].kind ? run + 1 : 1;
  if (run > 3) {
    console.error(`   FAIL ${BEATS[i].id}: ${run} consecutive "${BEATS[i].kind}" beats`);
    fail++;
  }
}

// No two adjacent beats may reach for the same transition SFX.
for (let i = 1; i < BEATS.length; i++) {
  if (BEATS[i].sfx === BEATS[i - 1].sfx) {
    console.error(`   FAIL ${BEATS[i].id} repeats the previous beat's SFX "${BEATS[i].sfx}"`);
    fail++;
  }
}
const palette = new Set(BEATS.map((b) => b.sfx));
console.log(`distinct transition SFX across the reel: ${palette.size}`);

const kinds = {};
for (const b of BEATS) kinds[b.kind] = (kinds[b.kind] ?? 0) + 1;
console.log("\nbeat kinds:");
for (const [k, v] of Object.entries(kinds).sort((a, b) => b[1] - a[1]))
  console.log(`   ${k.padEnd(18)} ${String(v).padStart(2)}   ${MOVING[k]}`);

console.log(fail === 0 ? "\nPACING: PASS" : `\nPACING: FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
