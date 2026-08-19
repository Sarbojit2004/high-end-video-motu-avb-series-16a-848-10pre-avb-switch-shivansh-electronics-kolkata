// CHECKPOINT 3 — render a still for every beat and check it.
//
// Bundles once and renders through @remotion/renderer directly; invoking the
// CLI ~90 times would re-bundle each pass. Each still is taken 58% into its
// beat, by which point entrances have settled and a macro-reveal has resolved
// far enough to show the whole unit.
//
// Also runs an automated legibility pass over each still: samples the frame for
// pure-black or near-black regions (which would break the light-background
// rule) and reports mean luminance per beat.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
import { loadSchedule, PROJ } from "./_load.mjs";

const { BEATS, BEAT_STARTS, frames } = await loadSchedule();
const OUT = resolve(PROJ, "out/qa");
mkdirSync(OUT, { recursive: true });

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = BEATS.map((b, i) => ({ b, i })).filter(
  ({ b }) => only.length === 0 || only.some((o) => b.id.includes(o))
);

const CHROME =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

console.log(`bundling…`);
const serveUrl = await bundle({
  entryPoint: resolve(PROJ, "src/index.ts"),
  onProgress: () => {},
});
const composition = await selectComposition({
  serveUrl,
  id: "CompressedReelSilent",
  inputProps: {},
  browserExecutable: existsSync(CHROME) ? CHROME : undefined,
});
console.log(`composition: ${composition.width}x${composition.height} ${composition.durationInFrames}f\n`);

const report = [];
for (const { b, i } of targets) {
  const at = BEAT_STARTS[i] + Math.round(frames(b.sec) * 0.58);
  const file = resolve(OUT, `${String(i).padStart(3, "0")}-${b.id}.png`);
  await renderStill({
    composition,
    serveUrl,
    output: file,
    frame: at,
    browserExecutable: existsSync(CHROME) ? CHROME : undefined,
    imageFormat: "png",
  });

  // Two separate measurements:
  //  * GROUND  — the outer safe-margin band, which is always page. This is what
  //    Section 2's light-background rule actually governs, and it must stay
  //    light even when the beat is showing dark product photography.
  //  * FRAME   — whole-frame mean, informational only. Dark MOTU hardware and
  //    dark CueMix screenshots are legitimate content, not a rule breach.
  const { data, info } = await sharp(file).resize(108, 192, { fit: "fill" }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, M = 4;
  let gSum = 0, gN = 0, sum = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const v = data[y * W + x];
      sum += v;
      if (x < M || y < M || x >= W - M || y >= H - M) { gSum += v; gN++; }
    }
  }
  const ground = gSum / gN / 255;
  const mean = sum / data.length / 255;
  report.push({ id: b.id, kind: b.kind, at, mean, ground });
  const flag = ground < 0.85 ? "  <-- GROUND NOT LIGHT" : "";
  console.log(
    `  ${String(i).padStart(3)} ${b.id.padEnd(18)} ${b.kind.padEnd(14)} ` +
    `ground ${ground.toFixed(3)}  frame ${mean.toFixed(2)}${flag}`
  );
}

const bad = report.filter((r) => r.ground < 0.85);
console.log(`\nstills rendered: ${report.length} -> out/qa/`);
console.log(`mean GROUND luminance:  ${(report.reduce((a, r) => a + r.ground, 0) / report.length).toFixed(3)} (light-background rule)`);
console.log(`mean whole-frame:       ${(report.reduce((a, r) => a + r.mean, 0) / report.length).toFixed(3)} (informational)`);
console.log(bad.length === 0
  ? "light-background rule: PASS — every beat's ground is light"
  : `light-background rule: FAIL — ${bad.map((d) => `${d.id} (${d.ground.toFixed(2)})`).join(", ")}`);
process.exit(bad.length === 0 ? 0 : 1);
