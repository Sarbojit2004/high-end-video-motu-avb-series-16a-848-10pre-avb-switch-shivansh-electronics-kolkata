// Reports the Layer 2 placement list the SFX-timeline WAV will actually
// contain.
//
// This calls the REAL accents() out of src/audio-pipeline.tsx rather than
// re-implementing its arithmetic. The master reel's version of this script did
// re-implement it, which meant the report could drift from what rendered — and
// it duly did: it kept reporting the old numbers after accents() gained
// ecosystemMontage handling.
import { build } from "esbuild";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { PROJ } from "./_load.mjs";

const dir = resolve(PROJ, ".cache");
mkdirSync(dir, { recursive: true });
const entry = join(dir, `sfxmap-entry-${process.pid}.ts`);
const out = join(dir, `sfxmap-${process.pid}.mjs`);
writeFileSync(entry, `
import { accents } from "../src/audio-pipeline";
import { BEATS, BEAT_STARTS, TOTAL_FRAMES } from "../src/schedule";
export const PLACED = accents(BEATS, BEAT_STARTS, TOTAL_FRAMES);
export const FRAMES = TOTAL_FRAMES;
export const BEAT_COUNT = BEATS.length;
`);
await build({
  entryPoints: [entry], bundle: true, format: "esm", platform: "node",
  outfile: out, external: ["remotion", "react", "react-dom"], logLevel: "silent",
  loader: { ".tsx": "tsx", ".ts": "ts" }, jsx: "automatic",
});
const { PLACED, FRAMES, BEAT_COUNT } = await import(pathToFileURL(out).href);
rmSync(out, { force: true }); rmSync(entry, { force: true });

const used = new Set(PLACED.map((p) => p.sfx));
const secs = FRAMES / 30;
console.log(`Layer 2 placements across ${secs} s: ${PLACED.length}`);
console.log(`firing rate: ${(PLACED.length / secs).toFixed(2)} per second`);
console.log(`distinct SFX files used: ${used.size}`);
console.log(`first at frame ${Math.min(...PLACED.map((p) => p.at))}, last at ${Math.max(...PLACED.map((p) => p.at))} of ${FRAMES}`);
console.log(`beats: ${BEAT_COUNT}`);
const unused = [];
for (const f of (await import("node:fs")).readdirSync(resolve(PROJ, "public/audio/sfx")))
  if (f.endsWith(".wav") && !used.has(f.replace(".wav", ""))) unused.push(f.replace(".wav", ""));
console.log(unused.length ? `NOT used by any placement (${unused.length}): ${unused.join(", ")}` : "every synthesized file is used");
