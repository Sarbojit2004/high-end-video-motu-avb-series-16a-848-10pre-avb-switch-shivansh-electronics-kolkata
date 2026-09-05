// Render QA stills of key frames from ONE bundle (much faster than repeated
// `remotion still`). Usage: node scripts/qa-stills.mjs [scale] [frame,frame,...]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const PROJ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(PROJ, "out", "qa");
fs.mkdirSync(OUT, { recursive: true });
const scale = Number(process.argv[2] ?? 0.25);
const frames = (process.argv[3] ?? "").split(",").filter(Boolean).map(Number);
const CHROME = process.env.REMOTION_BROWSER_EXECUTABLE ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";

const serveUrl = await bundle({ entryPoint: path.join(PROJ, "src", "index.ts"), webpackOverride: (c) => c });
const composition = await selectComposition({ serveUrl, id: "Full", browserExecutable: fs.existsSync(CHROME) ? CHROME : undefined });
const t0 = Date.now();
for (const f of frames) {
  const out = path.join(OUT, `f${String(f).padStart(5, "0")}.png`);
  await renderStill({ composition, serveUrl, frame: f, output: out, scale, imageFormat: "png", browserExecutable: fs.existsSync(CHROME) ? CHROME : undefined, chromiumOptions: { disableWebSecurity: false } });
  console.log(`frame ${f} → ${path.relative(PROJ, out)}  (${((Date.now() - t0) / 1000).toFixed(1)} s)`);
}
