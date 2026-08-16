// Section 0 — the asset inventory, with each image assigned to exactly one reel.
//
// Classification is by VISUAL INSPECTION, not filename: the supplied product
// prefixes are demonstrably unreliable ("MOTU 10pre (23).jpg", "MOTU 16A (3).jpg"
// and "MOTU 848 (6).jpg" are byte-identical to one another). Uniqueness was
// established by format-agnostic pixel hashing — decode, normalise to 32x32
// greyscale, hash — so two files only collapse when their PIXELS match, never
// because their names look alike.
import { createRequire } from "node:module";
import { readdirSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(PROJ, "..");

const files = readdirSync(REPO).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
const rows = [];
for (const f of files) {
  const p = resolve(REPO, f);
  const md = await sharp(p).metadata();
  const raw = await sharp(p).removeAlpha().resize(32, 32, { fit: "fill" }).greyscale().raw().toBuffer();
  rows.push({ f, w: md.width, h: md.height, fmt: md.format,
              ar: +(md.width / md.height).toFixed(3), bytes: statSync(p).size,
              sig: createHash("md5").update(raw).digest("hex") });
}

// collapse to unique pixel content, keeping every filename alias
const bySig = new Map();
for (const r of rows) {
  if (!bySig.has(r.sig)) bySig.set(r.sig, { ...r, aliases: [] });
  bySig.get(r.sig).aliases.push(r.f);
}
const uniq = [...bySig.values()].sort((a, b) => a.aliases[0].localeCompare(b.aliases[0]));
uniq.forEach((u, i) => (u.idx = i + 1));

// ── visual classification (indices are the sorted-unique order above) ────────
const BUCKET = {
  "10pre": [1,3,4,5,6,7,8,9,12,13,15,16,17,27,28,29,30,32,33,34,35,36,37,38,39,40,41],
  "16A":   [42,44,45,46,47,49,50,51,52,53,54,55,56,58,60,62,63,65,67,69,70,71,72,73,74,75,76,77,78,79,80,81],
  "848":   [18,19,85,86,88,89,90,91,93,94,95,97,98,101,103,104,105,106,107,108,109,110,111],
  AVBSwitch: [112,114,116],
  Network: [23,68,100,113,115,117,118,119,120],
  Shared:  [2,10,11,14,20,21,22,24,25,26,31,43,48,57,59,61,64,66,82,83,84,87,92,96,99,102],
  Brand:   [121,122],
};

// ── per-reel division (Section 0) — every product image gets exactly one home ─
// Reel 1 "The Source"        : 10pre + the shared-engine intro material
// Reel 2 "The Matrix"        : 16A + the CueMix/DAW software body
// Reel 3 "Command & Scale"   : 848 + AVB Switch + the network story
const REEL = {
  1: [...BUCKET["10pre"], 24, 26, 14, 10, 31, 11, 23],
  2: [...BUCKET["16A"], 21, 43, 22, 48, 96, 2, 59, 64, 66, 99, 25, 61, 57, 83, 84, 92, 102, 68],
  3: [...BUCKET["848"], ...BUCKET.AVBSwitch, 20, 82, 87, 100, 113, 115, 117, 118, 119, 120],
};

const bucketOf = {}; for (const [k, v] of Object.entries(BUCKET)) for (const i of v) bucketOf[i] = k;
const reelOf = {}; for (const [r, v] of Object.entries(REEL)) for (const i of v) {
  if (reelOf[i]) throw new Error(`image ${i} assigned to reels ${reelOf[i]} and ${r}`);
  reelOf[i] = +r;
}

// Hero tier — the images that can carry a full Macro-to-Full-Reveal.
const HERO = new Set([30,35,37,38,39,40,41, 45,47,49,51,76,77,78,79,80,81, 85,86,107,108,109,110,111, 112,114,116]);

const out = [];
for (const u of uniq) {
  const bucket = bucketOf[u.idx];
  if (!bucket) throw new Error(`unclassified image ${u.idx} (${u.aliases[0]})`);
  const reel = bucket === "Brand" ? 0 : reelOf[u.idx]; // logos appear in all three
  if (bucket !== "Brand" && !reel) throw new Error(`image ${u.idx} has no reel`);
  out.push({ idx: u.idx, file: u.aliases[0], aliases: u.aliases, w: u.w, h: u.h,
             fmt: u.fmt, ar: u.ar, product: bucket, reel,
             tier: HERO.has(u.idx) ? "hero" : "support" });
}
writeFileSync(resolve(PROJ, "asset-manifest.json"), JSON.stringify(out, null, 1));

console.log(`files: ${rows.length}   unique: ${out.length}   aliases folded: ${rows.length - out.length}`);
const t = {}; for (const o of out) (t[o.product] ??= 0, t[o.product]++);
console.log("\nbucket        n"); for (const [k, v] of Object.entries(t)) console.log(`  ${k.padEnd(12)} ${v}`);
const r = {1:0,2:0,3:0,0:0}; for (const o of out) r[o.reel]++;
console.log(`\nReel 1: ${r[1]}   Reel 2: ${r[2]}   Reel 3: ${r[3]}   logos (all reels): ${r[0]}`);
console.log(`product images assigned: ${r[1]+r[2]+r[3]} / ${out.length - r[0]}`);
