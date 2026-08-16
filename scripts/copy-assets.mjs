// Copy verified product imagery + fonts into public/ under stable slugs.
// Content-mismatched files (see ASSET_COVERAGE.md) are excluded here, once,
// so no scene can accidentally reference them.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

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

// Chromium's image decoder fails with "The source image cannot be decoded" once
// several very large sources are in flight at render concurrency — three of
// these files are 9021×7260 (65 MP ≈ 262 MB of RGBA each), and one scene shows
// the same file as both ambient bands plus a product plate. Nothing needs to
// exceed ~2× the 1080 px canvas width, so cap the long edge on copy. Purely a
// decode-safety measure: 2600 px is still heavily oversampled for 1080×1920.
const MAX_EDGE = 2600;

const dimsOf = (file) => {
  let out = "";
  try {
    out = execFileSync(ffmpegPath, ["-hide_banner", "-i", file], {
      stdio: ["ignore", "pipe", "pipe"],
    }).toString();
  } catch (e) {
    // ffmpeg exits non-zero when given an input and no output; the probe text
    // we need is still on stderr.
    out = (e.stderr ?? "").toString();
  }
  const m = out.match(/,\s(\d{2,})x(\d{2,})[\s,]/);
  return m ? { w: +m[1], h: +m[2] } : null;
};

const map = {};
let downscaled = 0;
for (const f of files) {
  const s = slug(f);
  const src = path.join(ROOT, f);
  const dst = path.join(IMG_OUT, s);
  const d = dimsOf(src);
  if (d && Math.max(d.w, d.h) > MAX_EDGE) {
    const scale = d.w >= d.h ? `${MAX_EDGE}:-2` : `-2:${MAX_EDGE}`;
    execFileSync(ffmpegPath, ["-i", src, "-vf", `scale=${scale}:flags=lanczos`, "-y", dst], {
      stdio: ["ignore", "ignore", "pipe"],
    });
    downscaled++;
  } else {
    fs.copyFileSync(src, dst);
  }
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
console.log(`downscaled    : ${downscaled} (long edge > ${MAX_EDGE}px)`);
console.log(`excluded      : ${EXCLUDED.size} (${[...EXCLUDED].join(", ")})`);
console.log(`fonts copied  : ${fontsCopied}`);
