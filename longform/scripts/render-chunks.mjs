// Chunked render (Checkpoint 10). 898 s at 1920x1080 is a long single pass; a
// crash at frame 25,000 would otherwise cost the whole render. This splits the
// timeline into chapter-aligned chunks, renders each, then concatenates with a
// stream copy so there is no second encode and no quality loss.
//
// Chunk boundaries are placed on chapter seams so an audio crossfade never
// straddles a join.
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, statSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { loadSchedule, PROJ } from "./_load.mjs";

const FF = createRequire(import.meta.url)("ffmpeg-static");
const { CHAPTER_SPANS, TOTAL_FRAMES } = await loadSchedule();

const OUT = resolve(PROJ, "out");
const TMP = resolve(OUT, "parts");  // tracked in git — see longform/.gitignore
mkdirSync(TMP, { recursive: true });

const FINAL = resolve(OUT, "motu-avb-ecosystem-longform.mp4");
const CONCURRENCY = process.env.RENDER_CONCURRENCY ?? "3";

// One chunk per chapter (7 chunks: 90/150/150/150/150/120/88 s).
const chunks = CHAPTER_SPANS.map((c, i) => ({
  i,
  name: `chunk-${String(i).padStart(2, "0")}-ch${c.ch}`,
  start: c.start,
  end: c.end,
}));

console.log(`total frames: ${TOTAL_FRAMES}  chunks: ${chunks.length}\n`);

const done = [];
for (const c of chunks) {
  const file = resolve(TMP, `${c.name}.mp4`);
  const frames = c.end - c.start;
  if (existsSync(file) && process.env.RESUME === "1") {
    console.log(`  skip  ${c.name} (exists, RESUME=1)`);
    done.push(file);
    continue;
  }
  console.log(`  render ${c.name}  frames ${c.start}–${c.end - 1} (${frames})`);
  const t0 = Date.now();
  const r = spawnSync(
    "npx",
    ["remotion", "render", "LongForm", file,
     "--frames", `${c.start}-${c.end - 1}`,
     `--concurrency=${CONCURRENCY}`, "--log=error"],
    { cwd: PROJ, stdio: ["ignore", "inherit", "inherit"] }
  );
  if (r.status !== 0) {
    console.error(`\nchunk ${c.name} failed (exit ${r.status}). Re-run with RESUME=1 to continue.`);
    process.exit(1);
  }
  console.log(`         done in ${((Date.now() - t0) / 1000).toFixed(0)}s  ${(statSync(file).size / 1e6).toFixed(0)} MB`);
  done.push(file);
}

// Concat without re-encoding.
const listFile = resolve(TMP, "concat.txt");
writeFileSync(listFile, done.map((f) => `file '${f.replace(/'/g, "'\\''")}'`).join("\n"));
console.log("\nconcatenating (stream copy, no re-encode)…");
execFileSync(FF, ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", FINAL]);

const size = statSync(FINAL).size;
console.log(`wrote ${FINAL}  ${(size / 1e6).toFixed(0)} MB`);
// Parts are KEPT and committed: at ~240 MB the joined master exceeds GitHub's
// 100 MB per-file limit and git-lfs is unavailable here, so the master is
// delivered through the repo as chapter parts plus scripts/join-parts.mjs,
// which recombines them with a stream copy into a bit-identical file.
console.log("parts retained in out/parts/ for delivery (see scripts/join-parts.mjs)");
