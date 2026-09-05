// Inventory + copy the repository's product photography into public/images/.
//
//  * Every image in the repo root is hashed. Byte-identical files saved under
//    different product names (15 groups) are ONE image for coverage: copied once,
//    all aliases recorded in public/images/manifest.json.
//  * The one confirmed content mismatch (a Moog modular synthesizer saved as
//    three different MOTU filenames) is excluded here, once, so no scene can
//    reference it.
//  * Long edges above MAX_EDGE are downscaled (lanczos) purely for decoder
//    safety at 4K render concurrency; 4400 px is still ≥ 2× the 2160 canvas.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ffmpeg } from "./ffmpeg.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(HERE, "..");
const REPO = path.resolve(PROJ, "..");
const IMG_OUT = path.join(PROJ, "public", "images");
const BRAND_OUT = path.join(PROJ, "public", "branding");
const MAX_EDGE = 4400;

export const EXCLUDED = {
  "MOTU 10pre (23).jpg": "Moog modular synthesizer — third-party hardware, not a MOTU product",
  "MOTU 16A (3).jpg": "byte-identical to MOTU 10pre (23).jpg (same Moog photograph)",
  "MOTU 848 (6).jpg": "byte-identical to MOTU 10pre (23).jpg (same Moog photograph)",
};

function dims(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20), fmt: "png", alpha: [4, 6].includes(buf[25]) };
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5), fmt: "jpg", alpha: false };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error("cannot read dimensions");
}
const productOf = (f) => (/10pre/i.test(f) ? "10pre" : /16A/.test(f) ? "16A" : /848/.test(f) ? "848" : /SWITCH/.test(f) ? "switch" : "brand");
const slugOf = (f) =>
  f.replace(/\.(jpg|jpeg|png)$/i, "").toLowerCase().replace(/newly added/g, "new").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + path.extname(f).toLowerCase();

fs.mkdirSync(IMG_OUT, { recursive: true });
fs.mkdirSync(BRAND_OUT, { recursive: true });

const files = fs.readdirSync(REPO).filter((f) => /\.(jpg|jpeg|png)$/i.test(f)).sort();
const byHash = new Map();
for (const f of files) {
  const buf = fs.readFileSync(path.join(REPO, f));
  const hash = crypto.createHash("md5").update(buf).digest("hex");
  if (!byHash.has(hash)) byHash.set(hash, { files: [], buf, ...dims(buf) });
  byHash.get(hash).files.push(f);
}

const manifest = [];
let copied = 0, downscaled = 0, excluded = 0;
for (const [hash, e] of byHash) {
  const primary = e.files[0];
  if (e.files.some((f) => EXCLUDED[f])) { excluded++; continue; }
  const isLogo = /LOGO/i.test(primary);
  const slug = isLogo ? (/MOTU/.test(primary) ? "motu-logo.png" : "shivansh-logo.png") : slugOf(primary);
  const dst = path.join(isLogo ? BRAND_OUT : IMG_OUT, slug);
  const src = path.join(REPO, primary);
  if (!fs.existsSync(dst)) {
    if (Math.max(e.w, e.h) > MAX_EDGE) {
      const scale = e.w >= e.h ? `${MAX_EDGE}:-2` : `-2:${MAX_EDGE}`;
      execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", src, "-vf", `scale=${scale}:flags=lanczos`, dst], { stdio: "inherit" });
      downscaled++;
    } else fs.copyFileSync(src, dst);
    copied++;
  }
  if (!isLogo) manifest.push({ slug, hash, aliases: e.files, product: productOf(primary), w: e.w, h: e.h, ar: +(e.w / e.h).toFixed(4), fmt: e.fmt, alpha: e.alpha });
}
manifest.sort((a, b) => a.slug.localeCompare(b.slug));
fs.writeFileSync(path.join(IMG_OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
// tracked copy (without hashes/aliases) so the composition knows every image's
// pixel size at bundle time without a runtime fetch
fs.writeFileSync(path.join(PROJ, "src", "data", "image-manifest.json"), JSON.stringify(Object.fromEntries(manifest.map((m) => [m.slug, { w: m.w, h: m.h, alpha: m.alpha }])), null, 0));
const perProduct = {};
for (const m of manifest) perProduct[m.product] = (perProduct[m.product] ?? 0) + 1;
console.log(`source files      : ${files.length}`);
console.log(`unique images     : ${manifest.length} product + 2 logos  ${JSON.stringify(perProduct)}`);
console.log(`excluded (Moog)   : ${excluded} unique image (${Object.keys(EXCLUDED).length} filenames)`);
console.log(`copied this run   : ${copied} (downscaled ${downscaled} with long edge > ${MAX_EDGE}px)`);
