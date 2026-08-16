// Self-contained project zip: `npm install && npm run setup && npm run render:partN`
// reproduces every render from it independently.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
fs.mkdirSync(OUT, { recursive: true });
const zip = path.join(OUT, "motu-avb-reels-project-source.zip");
if (fs.existsSync(zip)) fs.unlinkSync(zip);

const include = [
  "src", "scripts", "package.json", "package-lock.json", "tsconfig.json",
  "remotion.config.ts", "README.md", "ASSET_COVERAGE.md",
  "VO_SCRIPT_REEL_PART1_10PRE.md", "VO_SCRIPT_REEL_PART2_16A.md",
  "VO_SCRIPT_REEL_PART3_848_AVBSWITCH.md",
  "sound-effects", ".gitignore",
].filter((p) => fs.existsSync(path.join(ROOT, p)));

// product imagery lives at the repo root; setup copies it into public/
const images = fs.readdirSync(ROOT).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

execFileSync("zip", ["-r", "-q", zip, ...include, ...images], { cwd: ROOT });
console.log(`${zip}  ${(fs.statSync(zip).size / 1048576).toFixed(1)} MB`);
