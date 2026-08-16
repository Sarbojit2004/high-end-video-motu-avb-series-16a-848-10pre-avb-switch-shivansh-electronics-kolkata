// Render the three portrait thumbnails (1080×1920) into out/.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });

const THUMBS = [
  ["Thumbnail1", "thumbnail-motu-avb-reel-part1-10pre.png"],
  ["Thumbnail2", "thumbnail-motu-avb-reel-part2-16a.png"],
  ["Thumbnail3", "thumbnail-motu-avb-reel-part3-848-avbswitch.png"],
];

for (const [comp, file] of THUMBS) {
  const out = path.join(ROOT, "out", file);
  execFileSync("npx", ["remotion", "still", comp, out, "--image-format=png"], {
    cwd: ROOT,
    stdio: ["ignore", "ignore", "inherit"],
  });
  console.log(`${file}  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}
