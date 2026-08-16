// Render one representative still per scene, plus a contact sheet, so every
// beat can be checked for safe-zone violations, overlap and contrast.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const schedule = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "schedule.json"), "utf8"));

const part = process.argv[2] || "1";
const comp = `Part${part}`;
const OUT = path.join(ROOT, "qa", `part${part}`);
fs.mkdirSync(OUT, { recursive: true });

// Transition durations must mirror the P{n}_TRANSITIONS arrays.
const TDUR = {
  "1": [26, 22, 26, 20, 24, 14, 20, 26, 24, 22, 26, 24, 24, 22],
  "2": [26, 22, 26, 20, 24, 14, 20, 26, 24, 22, 26, 24, 24, 22],
  "3": [26, 22, 26, 20, 24, 14, 20, 26, 24, 22, 26, 24, 24, 22],
}[part];

const scenes = schedule.parts[part].scenes;
const rendered = scenes.map((s, i) => s.dur + (i > 0 ? TDUR[i - 1] : 0) / 2 + (i < TDUR.length ? TDUR[i] : 0) / 2);
let acc = 0;
const starts = rendered.map((r, i) => {
  const s = Math.round(acc);
  acc += r - (i < TDUR.length ? TDUR[i] : 0);
  return s;
});

const frames = scenes.map((s, i) => {
  // sample ~62% into each scene, past the entrance choreography
  const f = Math.round(starts[i] + rendered[i] * 0.62);
  return { id: s.id, name: s.name, frame: Math.min(f, schedule.durationInFrames - 1) };
});

const made = [];
for (const f of frames) {
  const out = path.join(OUT, `${f.id}-${f.name}.png`);
  execFileSync(
    "npx",
    ["remotion", "still", comp, out, `--frame=${f.frame}`, "--image-format=png"],
    { cwd: ROOT, stdio: ["ignore", "ignore", "pipe"] }
  );
  console.log(`${f.id} @ ${f.frame}  ${path.basename(out)}`);
  made.push(out);
}

// contact sheet (3 cols) so a whole part can be eyeballed at once
const COLS = 3;
const CELL_W = 300;
const CELL_H = 533;
for (let s = 0; s * 9 < made.length; s++) {
  const chunk = made.slice(s * 9, s * 9 + 9);
  const args = chunk.flatMap((m) => ["-i", m]);
  const parts = chunk.map(
    (_, i) => `[${i}:v]scale=${CELL_W}:${CELL_H}[v${i}]`
  );
  const layout = chunk
    .map((_, i) => `${(i % COLS) * CELL_W}_${Math.floor(i / COLS) * CELL_H}`)
    .join("|");
  const chain =
    parts.join(";") + ";" + chunk.map((_, i) => `[v${i}]`).join("") +
    `xstack=inputs=${chunk.length}:layout=${layout}:fill=0xCCCCCC[out]`;
  const sheet = path.join(OUT, `_sheet-${s + 1}.jpg`);
  execFileSync(ffmpegPath, [...args, "-filter_complex", chain, "-map", "[out]", "-frames:v", "1", "-q:v", "3", "-y", sheet], { stdio: ["ignore", "ignore", "pipe"] });
  console.log(`sheet → ${sheet}`);
}
