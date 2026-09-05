// Film-grain tile (brief §5 "subtle grain/noise texture ... present in every
// frame"). A 1024² mid-grey noise tile written as an 8-bit greyscale PNG in
// pure node (deterministic xorshift noise, zlib deflate). The Grain component
// tiles it and re-offsets it every frame — far cheaper than an SVG
// feTurbulence filter over a 2160×3840 frame at 60 fps.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "branding");
fs.mkdirSync(OUT, { recursive: true });
const N = 1024;
let s = 0x1234567;
const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 0xffffffff; };
// Gaussian-ish grain: sum of 3 uniforms, centred on mid-grey, ±~28 levels
const raw = Buffer.alloc((N + 1) * N);
for (let y = 0; y < N; y++) {
  raw[y * (N + 1)] = 0; // filter: none
  for (let x = 0; x < N; x++) raw[y * (N + 1) + 1 + x] = Math.max(0, Math.min(255, Math.round(128 + (rnd() + rnd() + rnd() - 1.5) * 56)));
}
const crcTable = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc = (buf) => { let c = -1; for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4); ihdr[8] = 8; ihdr[9] = 0; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
const dst = path.join(OUT, "grain.png");
fs.writeFileSync(dst, png);
console.log("grain tile:", dst, `${(png.length / 1024).toFixed(0)} kB`);
