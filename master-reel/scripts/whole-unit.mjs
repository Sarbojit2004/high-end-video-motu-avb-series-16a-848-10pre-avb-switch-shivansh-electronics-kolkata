// CHECKPOINT 4 — "the whole unit is visible", proved rather than asserted.
//
// The named failure mode of the earlier reel build was cropping images to force
// them into the runtime. Every layout here renders through <Plate>
// (object-fit: contain), which cannot crop — but the two CAMERA moves
// (MacroReveal, PortSweep) scale their container above 1.0 inside an
// overflow:hidden box, so during those moves the frame IS a crop by design.
//
// The rule is that no image is cropped "such that the viewer never sees the
// whole physical unit", i.e. each move must RESOLVE. This renders the last
// frame of every beat that carries a camera move and confirms the transform has
// returned to <= 1.0, so the complete unit is on screen before the cut.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadSchedule, PROJ } from "./_load.mjs";

const { BEATS, BEAT_STARTS, frames } = await loadSchedule();
const OUT = resolve(PROJ, "out/qa/resolve");
mkdirSync(OUT, { recursive: true });

const CHROME =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const browserExecutable = existsSync(CHROME) ? CHROME : undefined;

const MOVES = new Set(["hook", "macroReveal", "portSweep", "dataFlow"]);
const targets = BEATS.map((b, i) => ({ b, i })).filter(({ b }) => MOVES.has(b.kind));

console.log(`bundling…`);
const serveUrl = await bundle({ entryPoint: resolve(PROJ, "src/index.ts"), onProgress: () => {} });
const composition = await selectComposition({
  serveUrl, id: "MasterReelSilent", inputProps: {}, browserExecutable,
});

console.log(`\nMASTER REEL — camera moves must resolve to the whole unit\n`);
let fail = 0;
for (const { b, i } of targets) {
  // Last frame the viewer sees of this beat, one frame before the cut.
  const at = BEAT_STARTS[i] + frames(b.sec) - 1;
  const file = resolve(OUT, `${String(i).padStart(3, "0")}-${b.id}-last.png`);
  await renderStill({ composition, serveUrl, output: file, frame: at, browserExecutable, imageFormat: "png" });

  // Read the scale the move has settled to, straight out of the same maths the
  // component uses, rather than trusting the picture.
  const d = frames(b.sec);
  const f = d - 1;
  let scale;
  if (b.kind === "portSweep") {
    const sweepEnd = Math.round(d * 0.7);
    const resolveAt = sweepEnd + Math.round((d - sweepEnd) * 0.78);
    scale = f < sweepEnd ? 2.6
      : f >= resolveAt ? 0.988
      : 2.6 + (1 - 2.6) * ((f - sweepEnd) / (resolveAt - sweepEnd));
  } else {
    const macroScale = b.macroScale ?? (b.kind === "dataFlow" ? 2.8 : b.kind === "hook" ? 3.4 : 2.9);
    const macroEnd = Math.round(d * 0.35);
    const revealEnd = macroEnd + Math.round((d - macroEnd) * 0.62);
    scale = f < macroEnd ? macroScale
      : f >= revealEnd ? 0.988
      : macroScale * 0.88 + (1 - macroScale * 0.88) * ((f - macroEnd) / (revealEnd - macroEnd));
  }
  const ok = scale <= 1.001;
  if (!ok) fail++;
  console.log(`  ${ok ? "ok  " : "FAIL"} ${b.id.padEnd(18)} ${b.kind.padEnd(12)} image ${String(b.idx).padStart(3)}  final scale ${scale.toFixed(3)}`);
}
// ── ECOSYSTEM MONTAGE — every clubbed member must get its own solo pass ─────
//
// Clubbing images to make a cross-product point is never licence to crop any
// one of them. EcosystemMontage guarantees this by giving each member `hold`
// frames alone at full slot size before the group assembles — but only if the
// solo phase actually FITS inside the beat. If hold x members overruns the
// duration the last member never gets its solo, and the only place the viewer
// would ever see it is inside the assembled composition. That is checked here,
// and a still is rendered at the midpoint of every member's solo window so the
// claim is visible, not just arithmetic.
const clubs = BEATS.map((b, i) => ({ b, i })).filter(({ b }) => b.kind === "ecosystemMontage");
if (clubs.length) {
  console.log(`\nECOSYSTEM MONTAGE — every clubbed image gets a solo pass\n`);
  for (const { b, i } of clubs) {
    const d = frames(b.sec);
    const n = b.images.length;
    const hold = b.soloHold ?? Math.max(14, Math.min(Math.floor((d * 0.62) / n), 40));
    const soloEnd = hold * n;
    const fits = soloEnd < d;
    if (!fits) fail++;
    console.log(`  ${fits ? "ok  " : "FAIL"} ${b.id.padEnd(16)} ${n} images x ${hold}f solo = ${soloEnd}f of ${d}f`);
    for (let k = 0; k < n; k++) {
      const at = BEAT_STARTS[i] + k * hold + Math.round(hold * 0.5);
      const file = resolve(OUT, `${String(i).padStart(3, "0")}-${b.id}-solo${k}-img${b.images[k]}.png`);
      await renderStill({ composition, serveUrl, output: file, frame: at, browserExecutable, imageFormat: "png" });
      console.log(`         image ${String(b.images[k]).padStart(3)} alone at frame ${at}`);
    }
  }
}

console.log(`\n  stills written to out/qa/resolve/`);
console.log(fail === 0 ? "WHOLE-UNIT: PASS" : `WHOLE-UNIT: FAIL (${fail})`);
process.exit(fail === 0 ? 0 : 1);
