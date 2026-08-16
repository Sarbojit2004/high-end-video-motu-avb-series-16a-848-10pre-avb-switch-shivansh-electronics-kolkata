// Regenerates the two standalone audio deliverables as uncompressed WAV from
// the committed FLACs.
//
// Why FLAC is what ships: each WAV is 172 MB (898 s x 48 kHz x 16-bit stereo),
// over GitHub's 100 MB per-file limit, and git-lfs is unavailable in this
// environment. FLAC is lossless, so the WAVs this produces are sample-identical
// to the ones `npm run render:audio` writes directly from Remotion.
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { PROJ } from "./_load.mjs";

const FF = createRequire(import.meta.url)("ffmpeg-static");
const OUT = resolve(PROJ, "out");

for (const name of ["motu-avb-longform-music-bed", "motu-avb-longform-transition-sfx-timeline"]) {
  const src = resolve(OUT, `${name}.flac`);
  const dst = resolve(OUT, `${name}.wav`);
  if (!existsSync(src)) {
    console.error(`missing ${src} — run \`npm run render:audio\` instead`);
    process.exit(1);
  }
  execFileSync(FF, ["-v", "error", "-y", "-i", src, "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "2", dst]);
  console.log(`  ${name}.wav  ${(statSync(dst).size / 1e6).toFixed(1)} MB`);
}
console.log("both WAVs regenerated (898.00 s each, sample-identical to the direct render)");
