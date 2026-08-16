// Recombines the committed chapter parts into the single 898 s master.
//
// The parts are joined VIDEO-ONLY and the audio is muxed in from the two
// full-length layer renders. That is deliberate:
//
//   Every part carries its own AAC track, and every AAC encode adds priming
//   samples at the head, so each part's container is ~50 ms longer than its
//   video. The concat demuxer offsets each input by its container duration, so
//   naively concatenating the parts pushes each chapter's video start later by
//   a cumulative ~50 ms — six 1-2 frame holds at the chapter joins, and a
//   container that reports 14:58.35 for a picture that is exactly 898.000 s.
//
//   Stripping audio first makes each part's duration exactly its video
//   duration, so the joined picture is gapless and frame-exact. The audio then
//   comes from motu-avb-longform-{music-bed,transition-sfx-timeline}.flac —
//   both already exactly 898.000 s, both lossless, and summed here the same way
//   Remotion's FullAudio sums them. That also means the master's audio is a
//   single AAC generation from a lossless source rather than a re-encode of an
//   encode.
//
// Video is never re-encoded: -c:v copy throughout.
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, statSync, rmSync, mkdtempSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";
import { PROJ } from "./_load.mjs";

const FF = createRequire(import.meta.url)("ffmpeg-static");
const PARTS = resolve(PROJ, "out/parts");
const OUT = resolve(PROJ, "out");
const FINAL = resolve(OUT, "motu-avb-ecosystem-longform.mp4");
const MUSIC = resolve(OUT, "motu-avb-longform-music-bed.flac");
const SFX = resolve(OUT, "motu-avb-longform-transition-sfx-timeline.flac");

for (const f of [MUSIC, SFX]) {
  if (!existsSync(f)) throw new Error(`missing ${f} — run \`npm run render:audio\` first`);
}

const files = readdirSync(PARTS).filter((f) => f.endsWith(".mp4") && !f.startsWith("_")).sort();
if (files.length === 0) throw new Error("no parts found in out/parts/");

const tmp = mkdtempSync(join(tmpdir(), "motu-join-"));
const stripped = files.map((f, i) => {
  const dst = join(tmp, `v-${String(i).padStart(2, "0")}.mp4`);
  execFileSync(FF, ["-v", "error", "-y", "-i", resolve(PARTS, f), "-map", "0:v", "-c", "copy", dst]);
  return dst;
});

const list = join(tmp, "concat.txt");
writeFileSync(list, stripped.map((f) => `file '${f}'`).join("\n"));
const videoOnly = join(tmp, "video.mp4");
execFileSync(FF, ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", videoOnly]);

execFileSync(FF, ["-v", "error", "-y",
  "-i", videoOnly, "-i", MUSIC, "-i", SFX,
  // normalize=0 sums the two layers at unity, exactly as FullAudio does
  "-filter_complex", "[1:a][2:a]amix=inputs=2:duration=longest:normalize=0[a]",
  "-map", "0:v", "-c:v", "copy",
  "-map", "[a]", "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-ac", "2",
  "-movflags", "+faststart", FINAL]);

rmSync(tmp, { recursive: true, force: true });
console.log(`joined ${files.length} parts -> ${FINAL}  ${(statSync(FINAL).size / 1e6).toFixed(0)} MB`);
