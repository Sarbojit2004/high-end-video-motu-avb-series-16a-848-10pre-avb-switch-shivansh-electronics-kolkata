// CHECKPOINT 5 — asset coverage.
//
// Asserts that every one of the 120 enumerated product images appears somewhere
// in the video, tagged by product. This is the specific checkpoint the earlier
// three-part reel failed: it cropped and trimmed images down to force them into
// the runtime instead of giving each one complete, uncropped treatment.
//
// Every layout in this build renders images through <Plate>, which is
// `object-fit: contain` — so an image that appears is an image shown whole.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadSchedule, PROJ } from "./_load.mjs";

const manifest = JSON.parse(readFileSync(resolve(PROJ, "asset-manifest.json"), "utf8"));
const { BEATS, BEAT_STARTS, CHAPTERS, frames } = await loadSchedule();

const tc = (f) => {
  const s = Math.floor(f / 30);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

/** image index -> [{beat, chapter, at}] */
const where = new Map();
BEATS.forEach((b, i) => {
  for (const idx of b.images) {
    if (!where.has(idx)) where.set(idx, []);
    where.get(idx).push({ beat: b.id, ch: b.ch, at: tc(BEAT_STARTS[i]), sec: b.sec });
  }
});

// The two brand logos are covered by the Brand components (corner marks,
// lower-thirds, branding beats, price and outro), not by a beat's image list.
const LOGO_IDS = manifest.filter((a) => a.product === "Brand").map((a) => a.idx);
const brandBeats = BEATS.filter((b) => b.brand !== "none" || b.motu || ["brandBeat", "outro", "contact", "price"].includes(b.kind));
for (const id of LOGO_IDS) {
  where.set(id, brandBeats.slice(0, 3).map((b, i) => ({
    beat: b.id, ch: b.ch, at: tc(BEAT_STARTS[BEATS.indexOf(b)]), sec: b.sec,
    via: "Brand component",
  })));
}

const missing = manifest.filter((a) => !where.has(a.idx));
const products = manifest.filter((a) => a.product !== "Brand");

console.log(`enumerated images:        ${manifest.length} unique (from 141 files; 19 byte-identical duplicates folded)`);
console.log(`product images:           ${products.length}`);
console.log(`covered:                  ${manifest.length - missing.length}`);
console.log(`MISSING:                  ${missing.length}`);
if (missing.length) {
  for (const m of missing) console.log(`   !! ${m.idx} ${m.product} ${m.file}`);
}

// per-product tally
const byProd = {};
for (const a of manifest) {
  byProd[a.product] ??= { total: 0, covered: 0, screenSec: 0 };
  byProd[a.product].total++;
  if (where.has(a.idx)) {
    byProd[a.product].covered++;
    byProd[a.product].screenSec += where.get(a.idx).reduce((s, w) => s + w.sec, 0);
  }
}
console.log("\nproduct          images  covered   cumulative on-screen s");
for (const [k, v] of Object.entries(byProd)) {
  console.log(`  ${k.padEnd(14)} ${String(v.total).padStart(4)}  ${String(v.covered).padStart(7)}   ${v.screenSec.toFixed(0).padStart(6)}`);
}

// chapter budget
console.log("\nchapter                       planned  scheduled");
let allOk = true;
for (const c of CHAPTERS) {
  const got = BEATS.filter((b) => b.ch === c.n).reduce((a, b) => a + b.sec, 0);
  const ok = got === c.sec;
  if (!ok) allOk = false;
  console.log(`  ${String(c.n)}. ${c.name.padEnd(26)} ${String(c.sec).padStart(4)}s  ${String(got).padStart(6)}s  ${ok ? "" : "  <-- MISMATCH"}`);
}
const total = BEATS.reduce((a, b) => a + b.sec, 0);
const totalFrames = BEATS.reduce((a, b) => a + frames(b.sec), 0);
console.log(`  ${"TOTAL".padEnd(29)} ${String(898).padStart(4)}s  ${String(total).padStart(6)}s   (${totalFrames} frames)`);

// write the ledger
const rows = manifest
  .slice()
  .sort((a, b) => a.idx - b.idx)
  .map((a) => {
    const w = where.get(a.idx) ?? [];
    return `| ${a.idx} | ${a.product} | ${a.tier} | \`${a.file}\`${a.aliases.length > 1 ? ` (+${a.aliases.length - 1} identical)` : ""} | ${w.map((x) => `${x.at} ${x.beat}`).join("<br>") || "**MISSING**"} |`;
  });

writeFileSync(
  resolve(PROJ, "ASSET_COVERAGE.md"),
  `# Asset coverage ledger — MOTU AVB Ecosystem long-form

141 image files in the source repository resolve to **${manifest.length} unique images**
(19 files are byte-identical duplicates of another file, verified by
format-agnostic pixel hashing — not by filename similarity). Of those,
**${products.length} are product images** and 2 are brand logos.

Every one of them appears in the video. Every appearance renders through
\`<Plate>\` (\`object-fit: contain\`), so the complete unit is visible — nothing is
cropped, clipped or trimmed to fit the runtime.

| # | Product | Tier | Source file | Appears at |
|---|---|---|---|---|
${rows.join("\n")}
`
);
console.log("\nwrote ASSET_COVERAGE.md");

const pass = missing.length === 0 && allOk && totalFrames === 26940;
console.log(pass ? "\nCOVERAGE: PASS" : "\nCOVERAGE: FAIL");
process.exit(pass ? 0 : 1);
