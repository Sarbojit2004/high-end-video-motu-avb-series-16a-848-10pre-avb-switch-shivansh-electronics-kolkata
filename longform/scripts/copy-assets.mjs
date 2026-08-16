// Populates longform/public/ from the repository's source assets.
//
// Images are RESIZED ONLY (aspect ratio preserved, `fit: inside`). Nothing is
// ever cropped, clipped or trimmed — Section 3's hard rule. The long edge is
// capped at 2600px purely to keep render memory and repo size sane; the 9021px
// topology diagram would otherwise cost ~260MB decoded per frame.
import sharp from "sharp";
import { readFileSync, mkdirSync, copyFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const REPO = resolve(PROJ, "..");
const NEUMANN = resolve(REPO, "..", "neumann-tlm-107-new");

const MAX_EDGE = 2600;
const manifest = JSON.parse(readFileSync(resolve(PROJ, "asset-manifest.json"), "utf8"));

const PREFIX = {
  "10pre": "tenpre",
  "16A": "s16a",
  "848": "s848",
  AVBSwitch: "avbsw",
  Network: "net",
  Shared: "shared",
  Brand: "brand",
};

mkdirSync(resolve(PROJ, "public/images"), { recursive: true });
mkdirSync(resolve(PROJ, "public/fonts"), { recursive: true });
mkdirSync(resolve(PROJ, "public/vo"), { recursive: true });

let copied = 0;
const slugs = [];
for (const a of manifest) {
  const slug = `${PREFIX[a.product]}-${String(a.idx).padStart(3, "0")}`;
  const isLogo = a.product === "Brand";
  const ext = isLogo || a.fmt === "png" ? "png" : "jpg";
  const dest = resolve(PROJ, `public/images/${slug}.${ext}`);
  let pipe = sharp(resolve(REPO, a.file)).rotate();
  // Logos are used exactly as supplied: opaque, white-background, NOT made
  // transparent. They are placed directly on the video with no box, card or
  // plate of any kind — the Logo component composites them with
  // `mix-blend-mode: multiply`, which drops the white ground against the light
  // page while leaving the artwork untouched.
  if (isLogo) pipe = pipe.flatten({ background: "#ffffff" });
  if (Math.max(a.w, a.h) > MAX_EDGE) {
    pipe = pipe.resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true });
  }
  await (ext === "png"
    ? pipe.png({ compressionLevel: 9 })
    : pipe.jpeg({ quality: 92, mozjpeg: true })
  ).toFile(dest);

  // Classify the image's own ground so scenes can pick the right treatment on
  // a light canvas: images already on white blend seamlessly into the page and
  // are presented bare; images on black are given a deliberate rounded card so
  // they read as an intentional frame rather than a stray dark rectangle.
  // Measured from the outer 6% border only, flattened onto white so that
  // transparent PNGs (the logos) correctly read as light.
  // Sampled from the four CORNERS rather than the whole border: wide flat
  // elevations (a 3000x466 rack unit on white) push the product through the
  // top and bottom border, which drags a mean-of-border reading toward "mixed"
  // even though the actual ground is white. Corners stay background.
  const dm = await sharp(dest).metadata();
  const cw = Math.max(4, Math.round(dm.width * 0.06));
  const ch = Math.max(4, Math.round(dm.height * 0.06));
  const corners = [];
  for (const [left, top] of [
    [0, 0], [dm.width - cw, 0], [0, dm.height - ch], [dm.width - cw, dm.height - ch],
  ]) {
    // NB: sharp's .stats() reports on the *input* image and ignores the
    // pipeline, so a transparent PNG would read as black. Pull raw pixels.
    const px = await sharp(dest)
      .extract({ left, top, width: cw, height: ch })
      .flatten({ background: "#ffffff" })
      .greyscale()
      .raw()
      .toBuffer();
    let sum = 0;
    for (const v of px) sum += v;
    corners.push(sum / px.length / 255);
  }
  corners.sort((a, b) => a - b);
  const border = (corners[1] + corners[2]) / 2; // median of the four corners
  const bg = border > 0.7 ? "light" : border < 0.3 ? "dark" : "mixed";

  slugs.push({ ...a, slug, ext, bg, border: +border.toFixed(3) });
  copied++;
}
writeFileSync(resolve(PROJ, "asset-manifest.json"), JSON.stringify(slugs, null, 1));
console.log(`images: ${copied} written to public/images/`);

// Fonts ported from the Neumann long-form reference (Section 8a).
const FONTS = [
  "fraunces-normal.woff2",
  "fraunces-italic.woff2",
  "archivo-normal.woff2",
  "archivo-italic.woff2",
];
let fonts = 0;
for (const f of FONTS) {
  const src = resolve(NEUMANN, "public/fonts", f);
  if (!existsSync(src)) {
    throw new Error(
      `Missing ported font ${f}. Expected the Neumann reference repo at ${NEUMANN}. ` +
        `Section 8a requires the type system be inherited from it, not invented.`
    );
  }
  copyFileSync(src, resolve(PROJ, "public/fonts", f));
  fonts++;
}
console.log(`fonts: ${fonts} ported from neumann-tlm-107-new`);

// Placeholder VO slot (Section 10) — silent 898s WAV so the composition renders
// before narration is recorded.
const vo = resolve(PROJ, "public/vo/voiceover-longform.mp3");
if (!existsSync(vo)) console.log("vo: public/vo/voiceover-longform.mp3 not present (placeholder slot, expected)");
