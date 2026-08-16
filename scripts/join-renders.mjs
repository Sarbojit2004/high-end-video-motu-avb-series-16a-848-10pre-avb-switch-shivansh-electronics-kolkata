// Reassemble the final masters from out/chunks/ and verify each against the
// SHA-256 recorded at split time.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "out");
const CHUNKS = path.join(OUT, "chunks");
const manifestPath = path.join(CHUNKS, "manifest.json");

if (!fs.existsSync(manifestPath)) {
  console.error("out/chunks/manifest.json not found");
  process.exit(1);
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

let bad = 0;
for (const [master, info] of Object.entries(manifest)) {
  const dest = path.join(OUT, master);
  const buf = Buffer.concat(info.parts.map((p) => fs.readFileSync(path.join(CHUNKS, p))));
  fs.writeFileSync(dest, buf);
  const digest = crypto.createHash("sha256").update(buf).digest("hex");
  const ok = digest === info.sha256 && buf.length === info.bytes;
  console.log(
    `${master}  ${(buf.length / 1048576).toFixed(1)} MB  ${ok ? "✓ sha256 matches" : "✗ MISMATCH"}`
  );
  if (!ok) bad++;
}
process.exit(bad ? 1 : 0);
