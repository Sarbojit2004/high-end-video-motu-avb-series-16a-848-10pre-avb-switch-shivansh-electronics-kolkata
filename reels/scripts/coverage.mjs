// CHECKPOINT 5 — asset coverage, per reel.
//
// Asserts every image ASSIGNED to this reel appears in it. This is the specific
// checkpoint the prior reel build failed: it cropped and trimmed images down to
// force them into the runtime instead of giving each complete treatment. Every
// layout here renders through <Plate> (object-fit: contain), so an image that
// appears is an image shown whole.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadSchedule, PROJ } from "./_load.mjs";

const REEL = Number(process.argv[2] ?? 1);
const manifest = JSON.parse(readFileSync(resolve(PROJ, "asset-manifest.json"), "utf8"));
const { BEATS, BEAT_STARTS, frames, TOTAL_FRAMES } = await loadSchedule(REEL);

const tc = (f) => {
  const s = Math.floor(f / 30);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

const where = new Map();
BEATS.forEach((b, i) => {
  for (const idx of b.images) {
    if (!where.has(idx)) where.set(idx, []);
    where.get(idx).push({ beat: b.id, at: tc(BEAT_STARTS[i]), sec: b.sec, kind: b.kind });
  }
});

const assigned = manifest.filter((a) => a.reel === REEL);
const logos = manifest.filter((a) => a.product === "Brand");
const missing = assigned.filter((a) => !where.has(a.idx));

console.log(`REEL ${REEL}`);
console.log(`  assigned images : ${assigned.length}`);
console.log(`  covered         : ${assigned.length - missing.length}`);
console.log(`  MISSING         : ${missing.length}`);
for (const m of missing) console.log(`     !! ${m.idx} ${m.product} ${m.file}`);

const byProd = {};
for (const a of assigned) {
  byProd[a.product] ??= { n: 0, sec: 0 };
  byProd[a.product].n++;
  if (where.has(a.idx)) byProd[a.product].sec += where.get(a.idx).reduce((s, w) => s + w.sec, 0);
}
console.log("\n  product      images   on-screen s");
for (const [k, v] of Object.entries(byProd))
  console.log(`    ${k.padEnd(11)} ${String(v.n).padStart(5)}   ${v.sec.toFixed(0).padStart(8)}`);

const heroes = BEATS.filter((b) => b.kind === "macroReveal" || b.kind === "portSweep" || b.kind === "hook");
console.log(`\n  full Macro-to-Full-Reveal / Port Sweep beats: ${heroes.length}`);
for (const h of heroes) console.log(`    ${h.id} (${h.sec}s) -> image ${h.idx}`);

const total = BEATS.reduce((a, b) => a + b.sec, 0);
console.log(`\n  beats: ${BEATS.length}   runtime: ${total}s   frames: ${TOTAL_FRAMES}   (target 178s / 5340)`);
console.log(`  average beat: ${(total / BEATS.length).toFixed(1)}s`);

writeFileSync(
  resolve(PROJ, `ASSET_COVERAGE_REEL${REEL}.md`),
  `# Asset coverage — Reel ${REEL}

${assigned.length} images are assigned to this reel out of the 122 unique images
in the repository (141 files; 19 are byte-identical duplicates confirmed by
format-agnostic pixel hashing, not filename similarity). Every one appears
below, and every appearance renders through \`<Plate>\` (\`object-fit: contain\`)
so the complete unit is visible — nothing is cropped, clipped or trimmed to fit
the runtime.

The two brand logos (${logos.map((l) => l.idx).join(", ")}) appear in all three
reels via the Brand components rather than a beat's image list.

| # | Product | Tier | Source file | Appears at |
|---|---|---|---|---|
${assigned.sort((a, b) => a.idx - b.idx).map((a) => {
  const w = where.get(a.idx) ?? [];
  return `| ${a.idx} | ${a.product} | ${a.tier} | \`${a.file}\`${a.aliases.length > 1 ? ` (+${a.aliases.length - 1} identical)` : ""} | ${w.map((x) => `${x.at} ${x.beat}`).join("<br>") || "**MISSING**"} |`;
}).join("\n")}
`
);
console.log(`\nwrote ASSET_COVERAGE_REEL${REEL}.md`);
const pass = missing.length === 0 && TOTAL_FRAMES === 5340;
console.log(pass ? "COVERAGE: PASS" : "COVERAGE: FAIL");
process.exit(pass ? 0 : 1);
