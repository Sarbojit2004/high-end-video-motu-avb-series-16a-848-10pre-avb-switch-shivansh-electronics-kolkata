#!/usr/bin/env node
// Copies every product image out of the repository root into public/images/,
// downscaled for a 4K render, and writes src/assets.ts.
//
// Content-hash deduplication: the 139 product filenames are only ~120 distinct
// photographs. Showing one photograph twice under two different product labels
// would break the product-identification discipline the films depend on, so
// each distinct image is emitted once and carries every filename it satisfies.
//
// Subject classification is DECLARED, not inferred — recorded from looking at
// every image (contact sheets), because the alpha channel says how an image can
// be staged and nothing about what is in it.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const ROOT = "..";
const OUT = "public/images";
const FFMPEG = process.env.FFMPEG || "ffmpeg";
mkdirSync(OUT, { recursive: true });
mkdirSync(path.join(OUT, "bg"), { recursive: true });

// Cross-product duplicates that are really SHARED PLATFORM material.
const REASSIGN = {
  "motu-10pre-20.jpg": "p848",    // A/B/C + MUTE/MONO/TALK monitor buttons
  "motu-10pre-21.jpg": "shared",  // CueMix Pro routing grid
  "motu-10pre-22.jpg": "shared",  // rear panel: network + optical banks
  "motu-10pre-24.jpg": "shared",  // CueMix Pro on iPad
  "motu-10pre-26.jpg": "shared",  // ESS Technology mark
  "motu-10pre-27.jpg": "shared",  // DSP reverb window
  "motu-10pre-28.jpg": "shared",  // Thunderbolt mark
  "motu-16a-19.jpg": "shared",    // Performer Lite / instrument collage
  "motu-16a-2.png": "shared",     // DAW mixer window
  "motu-16a-23.jpg": "shared",    // MOTU USB-C cable
  "motu-16a-3.png": "shared",     // DAW timeline
  "motu-16a-5.jpg": "pswitch",    // AVB network topology diagram
  "motu-avb-switch-4.png": "shared",
  "motu-16a-8.png": "shared",     // rear panel: word clock + network + optical
};

const SUBJECT = {
  ui: [
    "motu-16a-10.jpg","motu-16a-11.jpg","motu-16a-12.jpg","motu-16a-13.jpg",
    "motu-16a-14.jpg","motu-16a-15.jpg","motu-16a-16.jpg","motu-16a-17.jpg",
    "motu-16a-26.jpg","motu-16a-6.jpg","motu-16a-7.jpg","motu-16a-2.png",
    "motu-16a-3.png",
    "motu-848-24.jpg","motu-848-26.jpg","motu-848-3.jpg",
    "motu-10pre-1.png","motu-10pre-10.jpg","motu-10pre-14.jpg","motu-10pre-3.jpg",
    "motu-10pre-4.jpg","motu-10pre-5.jpg","motu-10pre-6.jpg","motu-10pre-7.jpg",
    "motu-10pre-8.jpg","motu-10pre-9.jpg","motu-10pre-21.jpg","motu-10pre-24.jpg",
    "motu-10pre-27.jpg",
  ],
  diagram: [
    "motu-16a-5.png","motu-16a-6.png",
    "motu-848-7.png","motu-848-8.png",
    "motu-10pre-11.png","motu-10pre-12.png","motu-10pre-25.jpg",
    "motu-16a-5.jpg","motu-avb-switch-1.png",
  ],
  mark: [
    "motu-16a-1.png","motu-848-1.png","motu-848-13.jpg","motu-848-3.png",
    "motu-10pre-26.jpg","motu-10pre-28.jpg",
    "motu-avb-switch-4.jpg","motu-avb-switch-4.png","motu-avb-switch-5.png",
  ],
  bundle: [
    "motu-848-10.jpg","motu-848-11.jpg","motu-848-5.jpg","motu-848-2.png",
    "motu-16a-19.jpg",
  ],
  context: [
    "motu-848-1.jpg","motu-10pre-16.jpg","motu-avb-switch-3.png",
  ],
  // Crops of one control or connector group — real hardware, but not a
  // picture of the product, so never a hero.
  detail: [
    "motu-16a-24.jpg","motu-16a-25.jpg","motu-16a-28.jpg",
    "motu-848-15.jpg","motu-848-16.jpg","motu-848-17.jpg","motu-848-18.jpg",
    "motu-848-20.jpg","motu-848-22.jpg","motu-848-23.jpg","motu-848-25.jpg","motu-848-27.jpg",
    "motu-10pre-1.jpg","motu-10pre-11.jpg","motu-10pre-12.jpg","motu-10pre-13.jpg",
    "motu-10pre-15.jpg","motu-10pre-17.jpg","motu-10pre-18.jpg","motu-10pre-2.jpg",
    "motu-10pre-22.jpg","motu-10pre-29.jpg","motu-10pre-20.jpg","motu-16a-8.png",
  ],
};
const SUBJECT_OF = new Map();
for (const [k, list] of Object.entries(SUBJECT)) for (const f of list) SUBJECT_OF.set(f, k);

const productOf = (f) => {
  const u = f.toUpperCase();
  if (u.includes("AVB SWITCH")) return "pswitch";
  if (u.includes("10PRE")) return "p10pre";
  if (u.includes("16A")) return "p16a";
  if (u.includes("848")) return "p848";
  return null;
};
const slugify = (f) =>
  f.toLowerCase().replace(/^motu /, "motu-").replace(/[()]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const files = readdirSync(ROOT)
  .filter((f) => /^MOTU (10pre|10PRE|16A|848|AVB SWITCH)/i.test(f) && /\.(jpg|png)$/i.test(f))
  .sort();

const groups = new Map();
for (const f of files) {
  const h = createHash("md5").update(readFileSync(path.join(ROOT, f))).digest("hex");
  if (!groups.has(h)) groups.set(h, []);
  groups.get(h).push(f);
}

const meta = (p) => {
  let s = "";
  try { execFileSync(FFMPEG, ["-hide_banner", "-i", p], { stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { s = (e.stderr || "").toString(); }
  const m = s.match(/Stream #0:0.*?: Video: (\w+).*?, (\w+)(?:\([^)]*\))?, (\d+)x(\d+)/);
  return m ? { codec: m[1], pix: m[2], w: +m[3], h: +m[4] } : null;
};
const ALPHA_PIX = /rgba|argb|bgra|abgr|ya|pal8/i;

const assets = [];
let excluded = 0;
for (const [, fs] of groups) {
  const canonical = fs[0];
  const src = path.join(ROOT, canonical);
  const info = meta(src);
  if (!info) { console.warn("skip (unreadable):", canonical); continue; }
  // A Moog modular photograph saved under three MOTU names, and a 2 KB grey
  // rectangle — neither is a picture of a MOTU product.
  if (canonical === "MOTU 10pre (23).jpg" || canonical === "MOTU AVB SWITCH (2).png") { excluded++; continue; }

  const slug = slugify(canonical).replace(/\.(jpg|png)$/, (m) => "-" + m.slice(1));
  const ext = /\.png$/i.test(canonical) ? "png" : "jpg";
  const product = REASSIGN[slugify(canonical)] ?? productOf(canonical);

  const long = Math.max(info.w, info.h);
  const scale = long > 3000 ? `scale=${info.w >= info.h ? "3000:-2" : "-2:3000"}` : "scale=iw:ih";
  const dst = path.join(OUT, `${slug}.${ext}`);
  const args = ["-v", "error", "-y", "-i", src, "-vf", `${scale}:flags=lanczos`];
  if (ext === "png") args.push("-pred", "mixed"); else args.push("-q:v", "2");
  args.push(dst);
  if (!existsSync(dst)) execFileSync(FFMPEG, args);

  // The ambient wash plate behind a full-bleed still: 512 px, scaled up and
  // darkened before anyone sees it.
  const bg = path.join(OUT, "bg", `${slug}.jpg`);
  if (!existsSync(bg)) execFileSync(FFMPEG, ["-v", "error", "-y", "-i", src, "-vf", "scale=512:-2:flags=lanczos", "-q:v", "6", bg]);

  const post = meta(dst);
  const ar = post.w / post.h;
  const hasAlpha = ext === "png" && ALPHA_PIX.test(post.pix);
  assets.push({
    slug, file: `${slug}.${ext}`, bg: `bg/${slug}.jpg`, product,
    w: post.w, h: post.h, ar: +ar.toFixed(3),
    kind: hasAlpha ? (ar > 3.4 ? "strip" : "cutout") : ar > 3.4 ? "panel" : "photo",
    subject: SUBJECT_OF.get(slugify(canonical)) ?? "hardware",
    alpha: hasAlpha,
    covers: fs,
  });
}
assets.sort((a, b) => (a.product ?? "").localeCompare(b.product ?? "") || a.slug.localeCompare(b.slug));

const ts = `// AUTO-GENERATED by scripts/prep-assets.mjs — do not edit by hand.
// ${assets.length} distinct images from ${files.length} files in the repository root
// (${files.length - assets.length - excluded} byte-identical duplicates collapsed, ${excluded} content-excluded).
//
// kind:    cutout (transparent) | strip (transparent ultra-wide panel run) | panel (opaque ultra-wide) | photo
// subject: hardware | detail | context | ui | diagram | mark | bundle
// \`covers\` lists every original repository filename this one image satisfies.

export type AssetKind = "cutout" | "strip" | "panel" | "photo";
export type AssetSubject = "hardware" | "detail" | "context" | "ui" | "diagram" | "mark" | "bundle";
export type ProductKey = "p16a" | "p848" | "p10pre" | "pswitch" | "shared";

export type Asset = {
  slug: string;
  file: string;
  /** A 512 px copy, for the darkened wash behind a full-bleed shot. */
  bg: string;
  product: ProductKey;
  w: number;
  h: number;
  ar: number;
  kind: AssetKind;
  subject: AssetSubject;
  alpha: boolean;
  covers: string[];
};

export const ASSETS: Asset[] = ${JSON.stringify(assets, null, 1)};

export const REPO_FILE_COUNT = ${files.length};
export const EXCLUDED_COUNT = ${excluded};
`;
writeFileSync("src/assets.ts", ts);
const by = {};
for (const a of assets) (by[a.product] ??= []).push(a);
console.log(`${files.length} filenames -> ${assets.length} distinct images (${excluded} excluded)`);
for (const [k, v] of Object.entries(by)) {
  const subj = v.reduce((a, x) => ((a[x.subject] = (a[x.subject] || 0) + 1), a), {});
  console.log(`  ${k.padEnd(8)} ${String(v.length).padStart(3)}  ${JSON.stringify(subj)}`);
}
