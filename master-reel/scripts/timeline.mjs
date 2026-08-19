import { loadSchedule } from "./_load.mjs";
const { BEATS, BEAT_STARTS, frames } = await loadSchedule();
const tc = (f) => { const s = f / 30; return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(Math.floor(s%60)).padStart(2,"0")}`; };
let seg = "";
for (let i = 0; i < BEATS.length; i++) {
  const b = BEATS[i], a = BEAT_STARTS[i], z = a + frames(b.sec);
  if (b.seg !== seg) { seg = b.seg; console.log(`\n── ${seg.toUpperCase()}`); }
  console.log(`  ${tc(a)}–${tc(z)}  ${String(b.sec).padStart(2)}s  ${b.id.padEnd(16)} ${b.kind}`);
}
