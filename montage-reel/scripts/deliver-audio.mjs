// Copy the audio deliverables next to the renders (public/ is gitignored):
// the full mixed bed, each part's exact slice, and the music-only / SFX-only stems.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PARTS } from "../src/data/grid.ts";

const PROJ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUDIO = path.join(PROJ, "public", "audio");
const OUT = path.join(PROJ, "out");
fs.mkdirSync(OUT, { recursive: true });
const copies = [
  ["bed.wav", "motu-avb-montage-reel-bed-full.wav"],
  ["music-only.wav", "motu-avb-montage-reel-music-only.wav"],
  ["sfx-timeline.wav", "motu-avb-montage-reel-sfx-only.wav"],
  ["sfx-events.json", "motu-avb-montage-reel-sfx-events.json"],
  ["bed-report.json", "motu-avb-montage-reel-bed-report.json"],
  ...PARTS.map((p) => [`${p.file}-bed.wav`, `${p.file}-bed.wav`]),
];
for (const [src, dst] of copies) {
  fs.copyFileSync(path.join(AUDIO, src), path.join(OUT, dst));
  console.log(`${dst.padEnd(48)} ${(fs.statSync(path.join(OUT, dst)).size / 1048576).toFixed(1)} MB`);
}
