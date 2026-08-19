// Stages public/ from the repository's own source assets.
//
// Images are RESIZED ONLY (aspect preserved, `fit: inside`). Nothing is ever
// cropped, clipped or trimmed — Section 3's hard rule, and the specific failure
// the prior reel build made. The long edge is capped purely to bound render
// memory; the 9021px topology diagram would otherwise cost ~260 MB decoded.
import sharp from "sharp";
import { readFileSync, mkdirSync, copyFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO = resolve(PROJ, "..");
// Fonts come from the APPROVED MOTU portrait build in this repository.
// Section 0 forbids reading anything from the Neumann project, and it is
// unnecessary: `reels/public/fonts` already holds the exact staged woff2
// files that build renders with.
const REELS_FONTS = resolve(REPO, "reels/public/fonts");
const MAX_EDGE = 2400;

const manifest = JSON.parse(readFileSync(resolve(PROJ, "asset-manifest.json"), "utf8"));
const PREFIX = { "10pre": "tenpre", "16A": "s16a", "848": "s848", AVBSwitch: "avbsw",
                 Network: "net", Shared: "shared", Brand: "brand" };

mkdirSync(resolve(PROJ, "public/images"), { recursive: true });
mkdirSync(resolve(PROJ, "public/fonts"), { recursive: true });
mkdirSync(resolve(PROJ, "public/vo"), { recursive: true });

const out = [];
for (const a of manifest) {
  const slug = `${PREFIX[a.product]}-${String(a.idx).padStart(3, "0")}`;
  const isLogo = a.product === "Brand";
  const ext = isLogo || a.fmt === "png" ? "png" : "jpg";
  const dest = resolve(PROJ, `public/images/${slug}.${ext}`);
  let pipe = sharp(resolve(REPO, a.file)).rotate();
  // Logos are used EXACTLY as supplied: opaque, with their own white
  // background, never alpha-keyed and never boxed. Flattening here makes that
  // explicit rather than depending on the source file's alpha channel.
  if (isLogo) pipe = pipe.flatten({ background: "#ffffff" });
  if (Math.max(a.w, a.h) > MAX_EDGE) {
    pipe = pipe.resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true });
  }
  await (ext === "png" ? pipe.png({ compressionLevel: 9 }) : pipe.jpeg({ quality: 92, mozjpeg: true })).toFile(dest);

  // Detect the image's own ground from its four CORNERS at native resolution,
  // so a scene can present a white-ground image bare (it dissolves into the
  // light page) and a black-ground image in a deliberate card. Corners rather
  // than the whole border: wide flat elevations push product through the top
  // and bottom edges and would misread as "mixed".
  const dm = await sharp(dest).metadata();
  const cw = Math.max(4, Math.round(dm.width * 0.06));
  const ch = Math.max(4, Math.round(dm.height * 0.06));
  const corners = [];
  for (const [left, top] of [[0,0],[dm.width-cw,0],[0,dm.height-ch],[dm.width-cw,dm.height-ch]]) {
    // NB: sharp's .stats() reports on the INPUT and ignores the pipeline, so a
    // transparent PNG would read as black. Pull raw pixels instead.
    const px = await sharp(dest).extract({ left, top, width: cw, height: ch })
      .flatten({ background: "#ffffff" }).greyscale().raw().toBuffer();
    let s = 0; for (const v of px) s += v;
    corners.push(s / px.length / 255);
  }
  corners.sort((x, y) => x - y);
  const border = (corners[1] + corners[2]) / 2;
  out.push({ ...a, slug, ext, bg: border > 0.7 ? "light" : border < 0.3 ? "dark" : "mixed",
             border: +border.toFixed(3) });
}
writeFileSync(resolve(PROJ, "asset-manifest.json"), JSON.stringify(out, null, 1));
console.log(`images: ${out.length} -> public/images/`);

// Type system taken from the approved MOTU three-part reel build (Section 0/7).
const FONTS = ["fraunces-normal.woff2","fraunces-italic.woff2","archivo-normal.woff2","archivo-italic.woff2"];
for (const f of FONTS) {
  const src = resolve(REELS_FONTS, f);
  if (!existsSync(src)) throw new Error(`Missing font ${f} at ${REELS_FONTS}. Run \`npm run setup\` in ../reels first — Section 7 requires this reel's type system be pulled from the approved build, not invented.`);
  copyFileSync(src, resolve(PROJ, "public/fonts", f));
}
console.log(`fonts: ${FONTS.length} pulled from the approved reels/ build`);
const t = {}; for (const o of out) (t[o.bg] ??= 0, t[o.bg]++);
console.log("image grounds:", JSON.stringify(t));
