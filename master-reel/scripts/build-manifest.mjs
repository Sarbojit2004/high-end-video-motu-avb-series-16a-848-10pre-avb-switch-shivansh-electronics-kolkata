// CURATED ASSET MANIFEST — Section 0a.
//
// This master reel is the one deliverable in this pipeline that does NOT
// require every image to appear. The long-form video and the three-part reels
// both carried "every enumerated image must appear" as a hard rule; here the
// rule is quality and coherence of a CURATED set instead.
//
// What is NOT relaxed: identity is still decided by pixel content, never by
// filename. `MOTU 10pre (23).jpg`, `MOTU 16A (3).jpg` and `MOTU 848 (6).jpg`
// are one image under three names, and the hash below is what proves it.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { CURATED, LOGOS } from "./curation.mjs";

const raw = JSON.parse(readFileSync("scripts/inventory-raw.json", "utf8"));
const classified = JSON.parse(readFileSync("../reels/asset-manifest.json", "utf8"));

// Fold the fresh pixel-hash scan onto the approved build's visual
// classification. The classification came from looking at contact sheets, not
// from parsing filenames, which is why it is reused rather than recomputed.
const byFile = new Map(raw.map((r) => [r.file, r]));
const byIdx = new Map(classified.map((a) => [a.idx, a]));

const slugOf = (a) => {
  const p = { "10pre": "tenpre", "16A": "s16a", "848": "s848", AVBSwitch: "avbsw",
              Network: "net", Shared: "shared", Brand: "brand" }[a.product];
  return `${p}-${String(a.idx).padStart(3, "0")}`;
};

// Two images (62, 18) are listed in two segments on purpose — they carry the
// thesis Ecosystem Montage and then return in their own product segment as a
// callback. The manifest holds one entry each.
const out = [];
for (const idx of [...new Set([...CURATED, ...LOGOS])]) {
  const a = byIdx.get(idx);
  if (!a) throw new Error(`curated index ${idx} is not in the classified inventory`);
  const r = byFile.get(a.file);
  if (!r) throw new Error(`${a.file} is not in the fresh pixel scan`);
  out.push({
    idx: a.idx, file: a.file, aliases: a.aliases, hash: r.hash,
    w: r.w, h: r.h, fmt: r.fmt, ar: r.ar,
    product: a.product, tier: a.tier, bg: a.bg, border: a.border,
    slug: slugOf(a), ext: a.ext,
  });
}
out.sort((x, y) => x.idx - y.idx);
writeFileSync("asset-manifest.json", JSON.stringify(out, null, 1));

const byProd = {};
for (const a of out) byProd[a.product] = (byProd[a.product] ?? 0) + 1;
console.log(`curated: ${new Set(CURATED).size} unique product images + ${LOGOS.length} logos = ${out.length} entries`);
console.log(`of ${classified.length} unique images in the repository (${raw.length} files, ${raw.length - classified.length} pixel-identical duplicates folded)`);
for (const [k, v] of Object.entries(byProd)) console.log(`   ${k.padEnd(10)} ${v}`);
console.log("wrote asset-manifest.json");
