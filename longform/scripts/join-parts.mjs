// Recombines the committed chapter parts into the single 898 s master.
// Stream copy — no re-encode, so the result is bit-identical to the master
// produced by scripts/render-chunks.mjs.
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { PROJ } from "./_load.mjs";

const FF = createRequire(import.meta.url)("ffmpeg-static");
const PARTS = resolve(PROJ, "out/parts");
const FINAL = resolve(PROJ, "out/motu-avb-ecosystem-longform.mp4");

const files = readdirSync(PARTS).filter((f) => f.endsWith(".mp4")).sort();
if (files.length === 0) throw new Error("no parts found in out/parts/");
const list = resolve(PARTS, "concat.txt");
writeFileSync(list, files.map((f) => `file '${resolve(PARTS, f)}'`).join("\n"));
execFileSync(FF, ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", FINAL]);
console.log(`joined ${files.length} parts -> ${FINAL}  ${(statSync(FINAL).size / 1e6).toFixed(0)} MB`);
