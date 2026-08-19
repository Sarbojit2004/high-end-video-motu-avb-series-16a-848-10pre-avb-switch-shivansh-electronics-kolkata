import { readFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";
const REPO = resolve(process.cwd(), "..");
const m = JSON.parse(readFileSync("../reels/asset-manifest.json", "utf8"));
mkdirSync("scripts/sheets", { recursive: true });
const groups = {};
for (const a of m) { if (a.product === "Brand") continue; (groups[a.product] ??= []).push(a); }
for (const [prod, list] of Object.entries(groups)) {
  list.sort((a, b) => (a.tier === b.tier ? a.idx - b.idx : a.tier === "hero" ? -1 : 1));
  const COLS = 6, W = 300, H = 300;
  const rows = Math.ceil(list.length / COLS);
  const comps = [];
  for (let i = 0; i < list.length; i++) {
    const a = list[i];
    const buf = await sharp(resolve(REPO, a.file))
      .flatten({ background: "#ffffff" })
      .resize(W - 8, H - 34, { fit: "contain", background: "#ffffff" }).toBuffer();
    comps.push({ input: buf, left: (i % COLS) * W + 4, top: Math.floor(i / COLS) * H + 30 });
    const lbl = `${a.idx}${a.tier === "hero" ? " *" : ""}  ${a.ar.toFixed(2)}`;
    comps.push({
      input: Buffer.from(`<svg width="${W}" height="28"><rect width="${W}" height="28" fill="${a.tier === "hero" ? "#0B5FD0" : "#444"}"/><text x="6" y="20" font-size="17" font-family="sans-serif" fill="#fff">${lbl}</text></svg>`),
      left: (i % COLS) * W, top: Math.floor(i / COLS) * H,
    });
  }
  await sharp({ create: { width: W * COLS, height: H * rows, channels: 3, background: "#d8d8d8" } })
    .composite(comps).png().toFile(`scripts/sheets/${prod}.png`);
  console.log(`${prod.padEnd(10)} ${String(list.length).padStart(3)} images -> scripts/sheets/${prod}.png`);
}
