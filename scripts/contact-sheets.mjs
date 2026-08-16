// Build labelled contact sheets from the repo's product images so every asset
// can be visually content-verified before it is used. Pure ffmpeg, no deps.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = process.argv[2] || path.resolve(ROOT, "..", "qa-sheets");
fs.mkdirSync(OUT, { recursive: true });

const GROUPS = {
  "10pre": /^MOTU 10(pre|PRE)/,
  "16A": /^MOTU 16A/,
  "848": /^MOTU 848/,
  "avbswitch": /^MOTU AVB SWITCH/,
};

const all = fs
  .readdirSync(ROOT)
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  .filter((f) => !/LOGO/i.test(f))
  .sort();

const COLS = 4;
const ROWS = 3;
const PER = COLS * ROWS;
const CELL = 340;

const manifest = {};

for (const [key, re] of Object.entries(GROUPS)) {
  const files = all.filter((f) => re.test(f));
  manifest[key] = files;
  for (let s = 0; s * PER < files.length; s++) {
    const chunk = files.slice(s * PER, s * PER + PER);
    const args = [];
    for (const f of chunk) args.push("-i", path.join(ROOT, f));

    // scale+pad each tile onto a light card, then tile row-major.
    const parts = chunk.map(
      (_, i) =>
        `[${i}:v]scale=${CELL - 16}:${CELL - 16}:force_original_aspect_ratio=decrease,` +
        `pad=${CELL - 16}:${CELL - 16}:(ow-iw)/2:(oh-ih)/2:color=0xE8E8EA,` +
        `pad=${CELL}:${CELL}:8:8:color=0xFFFFFF[v${i}]`
    );
    // xstack tiles N distinct inputs (tile= only tiles frames over time).
    const layout = chunk
      .map((_, i) => `${(i % COLS) * CELL}_${Math.floor(i / COLS) * CELL}`)
      .join("|");
    const chain =
      parts.join(";") +
      ";" +
      chunk.map((_, i) => `[v${i}]`).join("") +
      `xstack=inputs=${chunk.length}:layout=${layout}:fill=0xDDDDDD[out]`;

    const outFile = path.join(OUT, `sheet-${key}-${s + 1}.jpg`);
    execFileSync(
      ffmpegPath,
      [...args, "-filter_complex", chain, "-map", "[out]", "-frames:v", "1", "-q:v", "3", "-y", outFile],
      { stdio: ["ignore", "ignore", "pipe"] }
    );
    console.log(`${outFile}  (${chunk.length} tiles)`);
    chunk.forEach((f, i) => console.log(`   ${s * PER + i + 1}. ${f}`));
  }
}

fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("\nTOTAL:", Object.values(manifest).reduce((a, b) => a + b.length, 0));
