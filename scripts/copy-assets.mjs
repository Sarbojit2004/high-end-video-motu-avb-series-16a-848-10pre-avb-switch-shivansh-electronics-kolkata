// Copy verified product imagery + fonts into public/ under stable slugs.
// Content-mismatched files (see ASSET_COVERAGE.md) are excluded here, once,
// so no scene can accidentally reference them.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMG_OUT = path.resolve(ROOT, "public", "images");
const FONT_OUT = path.resolve(ROOT, "public", "fonts");

// Confirmed content mismatch: all three are the same bytes, and the image is a
// Moog modular synthesizer — third-party hardware, not any MOTU product.
export const EXCLUDED = new Set([
  "MOTU 10pre (23).jpg",
  "MOTU 16A (3).jpg",
  "MOTU 848 (6).jpg",
]);

const slug = (f) =>
  f
    .replace(/\.(jpg|jpeg|png)$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + path.extname(f).toLowerCase();

fs.mkdirSync(IMG_OUT, { recursive: true });
fs.mkdirSync(FONT_OUT, { recursive: true });

const files = fs
  .readdirSync(ROOT)
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  .filter((f) => !/LOGO/i.test(f)) // reels carry no logo files at all (Section 5)
  .filter((f) => !EXCLUDED.has(f))
  .sort();

const map = {};
for (const f of files) {
  const s = slug(f);
  fs.copyFileSync(path.join(ROOT, f), path.join(IMG_OUT, s));
  map[f] = s;
}
fs.writeFileSync(path.join(IMG_OUT, "_map.json"), JSON.stringify(map, null, 2));

// Fonts ported from the established project type system.
const FONT_SRC = path.resolve(ROOT, "..", "neumann-tlm-107-new", "public", "fonts");
let fontsCopied = 0;
if (fs.existsSync(FONT_SRC)) {
  for (const f of fs.readdirSync(FONT_SRC)) {
    fs.copyFileSync(path.join(FONT_SRC, f), path.join(FONT_OUT, f));
    fontsCopied++;
  }
}

console.log(`images copied : ${files.length}`);
console.log(`excluded      : ${EXCLUDED.size} (${[...EXCLUDED].join(", ")})`);
console.log(`fonts copied  : ${fontsCopied}`);
