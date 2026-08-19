// CHECKPOINT 5 — reel-appropriate density across the whole 298 s.
//
// The risk in a 298 s reel built from seven segments is that it reads as seven
// short films. Two things are checked: that no beat is a disproportionate share
// of the runtime, and that no beat holds one static composition — every beat
// must carry a camera move, a montage assembly, an animated diagram or a staged
// type reveal.
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
if (share > 5) { console.error(`   FAIL a single beat is ${share.toFixed(1)}% of the runtime`); fail++; }
if (BEATS[0].sec > 8) { console.error(`   FAIL first cut lands at ${BEATS[0].sec}s`); fail++; }

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
