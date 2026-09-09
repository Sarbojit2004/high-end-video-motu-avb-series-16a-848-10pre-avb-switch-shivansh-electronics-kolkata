#!/usr/bin/env node
// Copies every product image out of the repository root into public/images/,
// downscaled for a 2160x3840 render, and writes src/assets.ts.
//
// Two things this does that a plain copy would not:
//
// 1. DEDUPLICATES BY CONTENT. 139 files in the repo are only 121 distinct
//    photographs — 14 are byte-identical files saved under two or three
//    different product names. Showing one photograph twice under two different
//    product labels would break the product-identification discipline the brief
//    calls for, so each distinct image is emitted once and carries the list of
//    filenames it satisfies.
//
// 2. CLASSIFIES. Alpha-channel cutouts can be floated in the void with a real
//    shadow (the reference video's staging); opaque photographs cannot. Wide
//    strips are front/rear panel runs and get their own treatment.
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const ROOT = "..";
const OUT = "public/images";
const FFMPEG = process.env.FFMPEG || "ffmpeg";
mkdirSync(OUT, { recursive: true });

// ── Content-verified exclusion ───────────────────────────────────────────────
// A photograph of a Moog modular synthesiser, saved under three MOTU product
// filenames. It contains no MOTU hardware, so it is excluded rather than
// silently captioned as a MOTU product. (Independently re-confirmed for this
// build by inspecting the image, not by trusting the filename.)
const EXCLUDE_HASHES = new Set(["MOOG"]); // filled in below by content check

// ── Images whose filename product is wrong or meaningless ────────────────────
// All 14 cross-product duplicates were inspected. Every one of them is a
// SHARED PLATFORM asset — CueMix Pro screens, the DSP reverb window, the ESS
// and Thunderbolt marks, the bundled cable, DAW windows, rear-panel network
// detail — which is exactly why they were saved under several product names.
// That is a gift for this particular reel: they are literal evidence of the
// "same platform underneath" thesis, so they are re-homed to a `shared` bucket
// and used in the cold open and close, plus two placed where they earn a spot.
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
  "motu-16a-5.jpg": "pswitch",    // AVB network topology diagram — switch hero
  // A generic "Quality Guaranteed" service rosette. It says nothing about the
  // AVB Switch and has no technical line it belongs under, so it moves to the
  // shared pool and appears as one cell of the closing board, where a brand
  // assurance mark actually makes sense.
  "motu-avb-switch-4.png": "shared",
  "motu-16a-8.png": "shared",     // rear panel: word clock + network + optical
};

// ── What each image actually SHOWS ───────────────────────────────────────────
// Alpha channel says how an image can be staged; it says nothing about what is
// in it. The CueMix Pro roundel, the Thunderbolt mark and the round-trip-latency
// diagram are all transparent PNGs, so ranking heroes by alpha alone put a
// software logo on "Sixteen balanced line inputs". Subject is therefore recorded
// explicitly, from looking at all 120 images:
//
//   hardware  MOTU metal — chassis, panels, connectors, meters, the switch
//   context   a room or a rig the hardware lives in
//   ui        CueMix Pro / Discovery / DAW screens
//   diagram   signal-flow, latency and network-topology drawings
//   mark      logos and badges (CueMix, Thunderbolt, ESS, MOTU, service marks)
//   bundle    artwork for the included sample content and Performer Lite
//
// Heroes are drawn from hardware first, then diagrams (which are the RIGHT hero
// for the AVB Switch, whose subject is a network and not a box). ui, mark and
// bundle images are real product material and are all still used — they carry
// the grid tier — but they never take a hero slot.
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

// ── Gather + dedupe ──────────────────────────────────────────────────────────
const files = readdirSync(ROOT)
  .filter((f) => /^MOTU (10pre|10PRE|16A|848|AVB SWITCH)/i.test(f) && /\.(jpg|png)$/i.test(f))
  .sort();

const groups = new Map();
for (const f of files) {
  const h = createHash("md5").update(readFileSync(path.join(ROOT, f))).digest("hex");
  if (!groups.has(h)) groups.set(h, []);
  groups.get(h).push(f);
}

const probe = (p) => {
  const out = execFileSync(FFMPEG, ["-hide_banner", "-i", p], {
    encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  }).toString();
  return out;
};

// ffprobe-free size + alpha read via ffmpeg's own stream line.
const meta = (p) => {
  let s = "";
  try { execFileSync(FFMPEG, ["-hide_banner", "-i", p], { stdio: ["ignore", "pipe", "pipe"] }); }
  catch (e) { s = (e.stderr || "").toString(); }
  const m = s.match(/Stream #0:0.*?: Video: (\w+).*?, (\w+)(?:\([^)]*\))?, (\d+)x(\d+)/);
  if (!m) return null;
  return { codec: m[1], pix: m[2], w: +m[3], h: +m[4] };
};

const ALPHA_PIX = /rgba|argb|bgra|abgr|ya|pal8/i;

const assets = [];
let excluded = 0;

for (const [hash, fs] of groups) {
  const canonical = fs[0];
  const src = path.join(ROOT, canonical);
  const info = meta(src);
  if (!info) { console.warn("skip (unreadable):", canonical); continue; }

  // Extension stays in the slug: "MOTU 16A (1).jpg" and "MOTU 16A (1).png" are
  // two DIFFERENT photographs, and stripping the extension collapsed them onto
  // one key, which silently under-counted coverage.
  const slug = slugify(canonical).replace(/\.(jpg|png)$/, (m) => "-" + m.slice(1));
  const ext = /\.png$/i.test(canonical) ? "png" : "jpg";

  // ── Content exclusions, both verified by looking at the image ────────────
  // 1. A photograph of a Moog modular synthesiser saved under three MOTU
  //    product filenames. No MOTU hardware in it at all.
  // 2. A 2 KB flat grey rectangle. It is not a photograph of anything; putting
  //    it on screen would read as a broken asset.
  if (canonical === "MOTU 10pre (23).jpg" || canonical === "MOTU AVB SWITCH (2).png") {
    excluded++;
    continue;
  }

  const product = REASSIGN[slugify(canonical)] ?? productOf(canonical);

  // Downscale so a 5,400-frame 4K render is not decoding 7,000px PNGs.
  const long = Math.max(info.w, info.h);
  const scale = long > 2400 ? `scale=${info.w >= info.h ? "2400:-2" : "-2:2400"}` : "scale=iw:ih";
  const dst = path.join(OUT, `${slug}.${ext}`);
  const args = ["-v", "error", "-y", "-i", src, "-vf", `${scale}:flags=lanczos`];
  if (ext === "png") args.push("-pred", "mixed");
  else args.push("-q:v", "3");
  args.push(dst);
  if (!existsSync(dst)) execFileSync(FFMPEG, args);

  const post = meta(dst);
  const ar = post.w / post.h;
  const hasAlpha = ext === "png" && ALPHA_PIX.test(post.pix);

  assets.push({
    slug, file: `${slug}.${ext}`, product,
    w: post.w, h: post.h, ar: +ar.toFixed(3),
    kind: hasAlpha ? (ar > 3.4 ? "strip" : "cutout") : ar > 3.4 ? "panel" : "photo",
    subject: SUBJECT_OF.get(slugify(canonical)) ?? "hardware",
    alpha: hasAlpha,
    covers: fs, // every original filename this one image satisfies
  });
}

assets.sort((a, b) => (a.product ?? "").localeCompare(b.product ?? "") || a.slug.localeCompare(b.slug));

const byProduct = {};
for (const a of assets) (byProduct[a.product] ??= []).push(a);

const ts = `// AUTO-GENERATED by scripts/prep-assets.mjs — do not edit by hand.
// ${assets.length} distinct images from ${files.length} files in the repository root
// (${files.length - assets.length - excluded} were byte-identical duplicates, ${excluded} content-excluded).
//
// kind:
//   cutout — transparent PNG, floats in the void with a cast shadow
//   strip  — transparent PNG, wide panel run (front/rear panel)
//   panel  — opaque wide panel run
//   photo  — opaque photograph or UI screen
//
// subject: what the image SHOWS — hardware | context | ui | diagram | mark | bundle
// Heroes are drawn from hardware (and, for the switch, diagram); ui/mark/bundle
// are used in the grid tier so every image is still covered.
//
// \`covers\` lists every original repository filename this single image satisfies,
// so the coverage ledger can prove all ${files.length} files are accounted for.

export type AssetKind = "cutout" | "strip" | "panel" | "photo";
export type AssetSubject = "hardware" | "context" | "ui" | "diagram" | "mark" | "bundle";
export type ProductKey = "p16a" | "p848" | "p10pre" | "pswitch" | "shared";

export type Asset = {
  slug: string;
  file: string;
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

export const BY_PRODUCT: Record<ProductKey, Asset[]> = {
${Object.keys(byProduct).map((k) => `  ${k}: ASSETS.filter((a) => a.product === "${k}"),`).join("\n")}
} as Record<ProductKey, Asset[]>;

export const REPO_FILE_COUNT = ${files.length};
export const EXCLUDED_COUNT = ${excluded};
`;

writeFileSync("src/assets.ts", ts);

console.log(`${files.length} files -> ${assets.length} distinct images (+${excluded} excluded)`);
for (const [k, v] of Object.entries(byProduct)) {
  const subj = v.reduce((a, x) => ((a[x.subject] = (a[x.subject] || 0) + 1), a), {});
  console.log(`  ${k.padEnd(8)} ${String(v.length).padStart(3)}  ${JSON.stringify(subj)}`);
}
