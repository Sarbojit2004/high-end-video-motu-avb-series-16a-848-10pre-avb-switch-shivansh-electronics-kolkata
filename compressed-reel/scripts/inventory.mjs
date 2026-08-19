// FULL ASSET INVENTORY — fresh, per Section 0a. Nothing carried over.
//
// Filenames are demonstrably unreliable here (files with different product
// prefixes are byte-identical), so identity is decided by PIXEL CONTENT:
// every file is decoded, normalized to 32x32 greyscale, and hashed. Two files
// consolidate ONLY if that hash matches — never because their names look alike.
import { readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const REPO = resolve(process.cwd(), "..");
const files = readdirSync(REPO)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort();

const rows = [];
for (const f of files) {
  const img = sharp(resolve(REPO, f));
  const meta = await img.metadata();
  // Decode -> flatten onto white -> 32x32 grey -> md5. Format-agnostic, so a
  // JPG and a PNG of the same pixels collide exactly as they should.
  const raw = await sharp(resolve(REPO, f))
    .flatten({ background: "#ffffff" })
    .resize(32, 32, { fit: "fill" })
    .greyscale().raw().toBuffer();
  rows.push({
    file: f,
    w: meta.width, h: meta.height, fmt: meta.format,
    ar: +(meta.width / meta.height).toFixed(4),
    hash: createHash("md5").update(raw).digest("hex"),
  });
}

const byHash = new Map();
for (const r of rows) {
  if (!byHash.has(r.hash)) byHash.set(r.hash, []);
  byHash.get(r.hash).push(r);
}

const dupGroups = [...byHash.values()].filter((g) => g.length > 1);
console.log(`files scanned          : ${rows.length}`);
console.log(`unique by pixel content: ${byHash.size}`);
console.log(`duplicate files folded : ${rows.length - byHash.size}`);
console.log(`\nduplicate groups (${dupGroups.length}) — consolidated on identical pixels, NOT on filename:`);
for (const g of dupGroups) console.log(`   ${g.map((x) => `${x.file} [${x.fmt} ${x.w}x${x.h}]`).join("  ==  ")}`);

writeFileSync("scripts/inventory-raw.json", JSON.stringify(rows, null, 1));
console.log("\nwrote scripts/inventory-raw.json");
