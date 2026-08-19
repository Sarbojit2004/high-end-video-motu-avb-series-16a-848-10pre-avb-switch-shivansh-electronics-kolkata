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

const manifest = JSON.parse(readFileSync(resolve(PROJ, "asset-manifest.json"), "utf8"));
// The repository-wide inventory, for the denominator: this project's own
// manifest holds only the curated subset, so it cannot report what was
// selected FROM.
const ALL = JSON.parse(readFileSync(resolve(PROJ, "../reels/asset-manifest.json"), "utf8"));
const ALL_PRODUCT = ALL.filter((a) => a.product !== "Brand").length;
const { BEATS, BEAT_STARTS, frames, TOTAL_FRAMES } = await loadSchedule();

const tc = (f) => {
  const s = Math.floor(f / 30);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * What each layout in BeatScene.tsx ACTUALLY puts on screen. Listing an image
 * on a beat whose layout ignores it would report coverage the viewer never
 * gets — so the two are reconciled here rather than assumed.
 *   idxOnly  — renders b.idx and nothing else
 *   idxPlus  — renders b.idx plus every other entry in b.images
 *   all      — renders every entry in b.images
 *   none     — renders no photography at all
 */
const RENDERS = {
  hook: "idxOnly", software: "idxOnly", specGrid: "idxOnly",
  macroReveal: "idxPlus", dataFlow: "idxPlus",
  portSweep: "idxOnly",
  montage: "all", hero: "all", badges: "all", ecosystemSplit: "all",
  brandBeat: "none", price: "none", cta: "none", outro: "none",
};

const unrendered = [];
BEATS.forEach((b) => {
  const mode = RENDERS[b.kind];
  const shown =
    mode === "none" ? [] :
    mode === "all" ? b.images :
    mode === "idxOnly" ? (b.idx === undefined ? [] : [b.idx]) :
    [b.idx, ...b.images.filter((i) => i !== b.idx)].filter((i) => i !== undefined);
  for (const i of b.images) if (!shown.includes(i)) unrendered.push({ beat: b.id, kind: b.kind, idx: i });
});

const where = new Map();
BEATS.forEach((b, i) => {
  for (const idx of b.images) {
    if (!where.has(idx)) where.set(idx, []);
    where.get(idx).push({ beat: b.id, at: tc(BEAT_STARTS[i]), sec: b.sec, kind: b.kind });
  }
});

// The two logos appear through the Brand components in every segment, not
// through any beat's image list, so they are not part of the beat coverage map.
const assigned = manifest.filter((a) => a.product !== "Brand");
const logos = manifest.filter((a) => a.product === "Brand");
const missing = assigned.filter((a) => !where.has(a.idx));

console.log("COMPRESSED REEL");
console.log(`  assigned images : ${assigned.length}`);
console.log(`  covered         : ${assigned.length - missing.length}`);
console.log(`  MISSING         : ${missing.length}`);
for (const m of missing) console.log(`     !! ${m.idx} ${m.product} ${m.file}`);
console.log(`  LISTED BUT NOT RENDERED BY ITS LAYOUT: ${unrendered.length}`);
for (const u of unrendered) console.log(`     !! image ${u.idx} on ${u.beat} (${u.kind})`);

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
console.log(`\n  beats: ${BEATS.length}   runtime: ${total}s   frames: ${TOTAL_FRAMES}   (target 88s / 2640)`);
console.log(`  average beat: ${(total / BEATS.length).toFixed(1)}s`);

writeFileSync(
  resolve(PROJ, "ASSET_COVERAGE_COMPRESSED_REEL.md"),
  `# Asset coverage — MOTU AVB Compressed Reel

**${assigned.length} curated images**, selected from the **${ALL_PRODUCT} unique product images** in the
repository (141 files; 19 fold into others on identical pixel content, confirmed
by a format-agnostic hash rather than by filename similarity — \`MOTU 10pre (23).jpg\`,
\`MOTU 16A (3).jpg\` and \`MOTU 848 (6).jpg\` are one image under three names).

Unlike the long-form video and the three-part reel series, this reel does **not**
carry "every enumerated image must appear". It carries a curated selection
instead; the reasoning per block, and the full account of what was deliberately
left out, is in \`scripts/curation.mjs\`.

What is **not** relaxed is completeness per image. Every image below renders
through \`<Plate>\` (\`object-fit: contain\`), so it is shown whole and uncropped —
including every member of a clubbed Ecosystem Montage beat, each of which holds
the frame alone at full size before the group assembles. \`scripts/whole-unit.mjs\`
verifies that on rendered stills.

Images 9, 18 and 62 appear in two beats each, deliberately: they carry the thesis
Ecosystem Montage at 00:38 and then return inside their own product segment as a
callback.

The two brand logos (${logos.map((l) => l.idx).join(", ")}) appear throughout via the Brand
components rather than through any beat's image list.

| # | Product | Tier | Source file | Appears at |
|---|---|---|---|---|
${assigned.sort((a, b) => a.idx - b.idx).map((a) => {
  const w = where.get(a.idx) ?? [];
  return `| ${a.idx} | ${a.product} | ${a.tier} | \`${a.file}\`${a.aliases.length > 1 ? ` (+${a.aliases.length - 1} identical)` : ""} | ${w.map((x) => `${x.at} ${x.beat}`).join("<br>") || "**MISSING**"} |`;
}).join("\n")}
`
);
console.log(`\nwrote ASSET_COVERAGE_COMPRESSED_REEL.md`);
const pass = missing.length === 0 && unrendered.length === 0 && TOTAL_FRAMES === 2640;
console.log(pass ? "COVERAGE: PASS" : "COVERAGE: FAIL");
process.exit(pass ? 0 : 1);
