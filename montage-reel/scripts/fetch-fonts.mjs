// Fetch the reel's typefaces from Google Fonts (OFL / Apache licensed) as TTF
// files into public/fonts/ and write public/fonts/manifest.json, which
// src/design/fonts.ts registers at render time.
//
// TTF rather than WOFF2 on purpose: the container's Playwright Chromium build
// reports WOFF2 faces as "loaded" but paints fallbacks (verified with a
// standalone page); TrueType renders correctly.
//
// Telegraf (Pangram Pangram) is NOT on Google Fonts and is a paid commercial
// licence; see README "Typefaces" for how licensed files are slotted in.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "fonts");
fs.mkdirSync(OUT, { recursive: true });
// A legacy UA makes the Google Fonts CSS API answer with TrueType URLs.
const UA = "Mozilla/4.0";

const FAMILIES = [
  { family: "Alfa Slab One", css: "Alfa+Slab+One" },
  { family: "Bricolage Grotesque", css: "Bricolage+Grotesque:wght@300;500;700;800" },
  { family: "Bodoni Moda", css: "Bodoni+Moda:ital,wght@0,500;0,700;1,500;1,700" },
  { family: "Caveat", css: "Caveat:wght@600;700" },
  { family: "Tinos", css: "Tinos:ital,wght@0,400;0,700;1,400" },
];
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const manifest = [];
for (const fam of FAMILIES) {
  const css = await (await fetch(`https://fonts.googleapis.com/css2?family=${fam.css}&display=swap`, { headers: { "User-Agent": UA } })).text();
  const seen = new Set();
  for (const b of css.split("@font-face").slice(1)) {
    const url = (b.match(/url\((https:[^)]+)\)/) || [])[1];
    const style = (b.match(/font-style:\s*(\w+)/) || [, "normal"])[1];
    const weight = (b.match(/font-weight:\s*(\d+)/) || [, "400"])[1];
    if (!url) continue;
    const key = `${style}-${weight}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const fmt = (b.match(/format\(['"](\w+)['"]\)/) || [, "truetype"])[1];
    const ext = fmt === "opentype" ? "otf" : fmt === "woff2" ? "woff2" : fmt === "woff" ? "woff" : "ttf";
    const file = `${slug(fam.family)}-${key}.${ext}`;
    const dst = path.join(OUT, file);
    if (!fs.existsSync(dst)) fs.writeFileSync(dst, Buffer.from(await (await fetch(url, { headers: { "User-Agent": UA } })).arrayBuffer()));
    manifest.push({ family: fam.family, style, weight, file, bytes: fs.statSync(dst).size });
  }
  if (!seen.size) throw new Error(`no faces returned for ${fam.family}`);
}
// Licensed Telegraf (Pangram Pangram) — never fetched, only registered if present.
const TG = path.join(OUT, "telegraf");
const TG_WEIGHTS = { hairline: "100", thin: "100", ultralight: "200", light: "300", regular: "400", book: "400", medium: "500", semibold: "600", bold: "700", black: "900", ultrabold: "800" };
if (fs.existsSync(TG)) {
  for (const f of fs.readdirSync(TG).filter((f) => /\.(ttf|otf|woff2?)$/i.test(f))) {
    const m = f.match(/telegraf[-_ ]?(\w+)\./i);
    const w = m ? m[1].toLowerCase() : "regular";
    manifest.push({ family: "Telegraf", style: /italic|oblique/i.test(f) ? "italic" : "normal", weight: TG_WEIGHTS[w.replace(/italic|oblique/g, "")] ?? "400", file: `telegraf/${f}`, bytes: fs.statSync(path.join(TG, f)).size });
  }
  console.log(`Telegraf: ${manifest.filter((m) => m.family === "Telegraf").length} licensed file(s) registered from public/fonts/telegraf/`);
} else {
  console.log("Telegraf: not present (public/fonts/telegraf/ missing) — Bricolage Grotesque carries the grotesk role");
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
for (const m of manifest) console.log(`${m.file.padEnd(44)} ${m.family.padEnd(20)} ${m.style}/${m.weight}  ${(m.bytes / 1024).toFixed(0)} kB`);
