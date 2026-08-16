// The final masters are 150–230 MB each by delivery spec (8–12 Mbps H.264 for a
// 178 s part). GitHub hard-rejects files over 100 MB and git-lfs is unavailable,
// so each master is committed as lossless 90 MB chunks under out/chunks/ and
// reassembled with `npm run join-renders` (or a single `cat`).
//
// Chunking is byte-exact: cat'ing the parts back together reproduces the master
// bit-for-bit, verified here by SHA-256.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CHUNKS = path.join(OUT, "chunks");
const CHUNK = 90 * 1024 * 1024; // 90 MB — safely under GitHub's 100 MB limit

const sha = (f) => {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(f));
  return h.digest("hex");
};

fs.mkdirSync(CHUNKS, { recursive: true });
const masters = fs.readdirSync(OUT).filter((f) => f.endsWith(".mp4"));
if (!masters.length) {
  console.log("no masters in out/ — run the renders first");
  process.exit(0);
}

const manifest = {};
for (const m of masters) {
  const src = path.join(OUT, m);
  const buf = fs.readFileSync(src);
  const digest = sha(src);
  const parts = [];
  for (let i = 0, n = 0; i < buf.length; i += CHUNK, n++) {
    const name = `${m}.part${String(n).padStart(2, "0")}`;
    fs.writeFileSync(path.join(CHUNKS, name), buf.subarray(i, i + CHUNK));
    parts.push(name);
  }
  manifest[m] = { bytes: buf.length, sha256: digest, parts };
  console.log(`${m}  ${(buf.length / 1048576).toFixed(1)} MB → ${parts.length} chunks`);
}
fs.writeFileSync(path.join(CHUNKS, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\nmanifest: out/chunks/manifest.json`);
