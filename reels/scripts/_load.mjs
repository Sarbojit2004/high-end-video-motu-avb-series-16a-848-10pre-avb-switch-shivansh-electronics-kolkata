// Compiles src/schedule.ts to a temp ESM bundle so the verification scripts
// can reason about the real schedule rather than a re-typed copy of it.
import { build } from "esbuild";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export async function loadSchedule(reel = 1) {
  // Emit inside the project so Node resolves `remotion` from ./node_modules —
  // a temp dir outside the tree cannot see it.
  const dir = resolve(PROJ, ".cache");
  mkdirSync(dir, { recursive: true });
  const out = join(dir, `schedule-r${reel}-${process.pid}.mjs`);
  await build({
    entryPoints: [resolve(PROJ, `src/reel${reel}/schedule.ts`)],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile: out,
    external: ["remotion", "react", "react-dom"],
    logLevel: "silent",
  });
  const mod = await import(pathToFileURL(out).href);
  rmSync(out, { force: true });
  return mod;
}
