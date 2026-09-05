// Delivery gate (brief §9): every exported part must be under GitHub's 100 MB
// hard limit, start/end on the planned frames, and carry audio. Prints a table
// and exits non-zero on any violation.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ffprobe } from "./ffmpeg.mjs";
import { PARTS, FPS, beatFrame } from "../src/data/grid.ts";

const PROJ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIMIT = 100 * 1024 * 1024;
let bad = 0;
console.log("part                                   MB      frames  expected  duration   video kbps  audio");
for (const p of PARTS) {
  const f = path.join(PROJ, "out", `${p.file}.mp4`);
  if (!fs.existsSync(f)) { console.log(`${p.file.padEnd(38)} MISSING`); bad++; continue; }
  const bytes = fs.statSync(f).size;
  const probe = JSON.parse(execFileSync(ffprobe, ["-v", "error", "-show_streams", "-show_format", "-count_frames", "-of", "json", f]).toString());
  const v = probe.streams.find((s) => s.codec_type === "video"), a = probe.streams.find((s) => s.codec_type === "audio");
  const frames = +(v.nb_read_frames ?? v.nb_frames);
  const expected = beatFrame(p.endBeat) - beatFrame(p.startBeat);
  const ok = bytes < LIMIT && frames === expected && !!a;
  if (!ok) bad++;
  console.log(`${p.file.padEnd(38)} ${(bytes / 1048576).toFixed(1).padStart(6)}  ${String(frames).padStart(6)}  ${String(expected).padStart(8)}  ${(+probe.format.duration).toFixed(3).padStart(8)} s  ${Math.round(+v.bit_rate / 1000 || 0).toString().padStart(8)}  ${a ? `${a.codec_name} ${a.sample_rate} Hz` : "NONE"}  ${ok ? "ok" : "FAIL"}`);
}
console.log(bad ? `\n${bad} part(s) fail the delivery gate` : "\nall parts < 100 MB, frame-exact, with audio");
process.exit(bad ? 1 : 0);
