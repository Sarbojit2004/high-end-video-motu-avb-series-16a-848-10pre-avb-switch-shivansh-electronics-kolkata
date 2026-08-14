// Allocates each segment's frame range in proportion to its word count, so a
// part lands on a uniform speaking pace and an exact total runtime.
//
//   node retime.mjs long2 8940
//
// Reads and rewrites src/long/partN/timeline.ts (or src/partN/timeline.ts).
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const part = process.argv[2];
const TOTAL = Number(process.argv[3] ?? 8940);
const MIN = Number(process.argv[4] ?? 300);

const isLong = part.startsWith('long');
const n = isLong ? part.slice(4) : part;
const path = isLong
  ? join(here, 'src', 'long', `part${n}`, 'timeline.ts')
  : join(here, 'src', `part${n}`, 'timeline.ts');

let src = readFileSync(path, 'utf8');

const re =
  /id: '(\w+)',\s*label: '[^']*',\s*text:\s*'((?:[^'\\]|\\.)*)',\s*start: (\d+),\s*end: (\d+)/gs;
const segs = [...src.matchAll(re)].map((m) => ({
  id: m[1],
  words: m[2].replace(/\\'/g, "'").trim().split(/\s+/).length,
}));
if (!segs.length) {
  console.error('no segments parsed - check the timeline format');
  process.exit(1);
}

const totalWords = segs.reduce((s, x) => s + x.words, 0);
const raw = segs.map((s) => (TOTAL * s.words) / totalWords);
const alloc = raw.map((r) => Math.max(MIN, Math.floor(r)));

// largest-remainder rebalance so the frames sum to TOTAL exactly
let diff = TOTAL - alloc.reduce((a, b) => a + b, 0);
const order = raw
  .map((r, i) => ({ i, frac: r - Math.floor(r) }))
  .sort((a, b) => (diff > 0 ? b.frac - a.frac : a.frac - b.frac))
  .map((x) => x.i);
let k = 0;
while (diff !== 0) {
  const i = order[k % order.length];
  const step = diff > 0 ? 1 : -1;
  if (alloc[i] + step >= MIN) {
    alloc[i] += step;
    diff -= step;
  }
  k++;
  if (k > 100000) break;
}

let cur = 0;
const bounds = alloc.map((a) => {
  const b = [cur, cur + a];
  cur += a;
  return b;
});
if (cur !== TOTAL) {
  console.error(`allocation failed: ${cur} != ${TOTAL}`);
  process.exit(1);
}

segs.forEach((s, i) => {
  const [a, b] = bounds[i];
  const pat = new RegExp(`(id: '${s.id}',[\\s\\S]*?start: )\\d+([\\s\\S]*?end: )\\d+`);
  src = src.replace(pat, `$1${a}$2${b}`);
});
writeFileSync(path, src);

console.log(`seg   words  frames   secs    w/s`);
segs.forEach((s, i) => {
  const [a, b] = bounds[i];
  const secs = (b - a) / 30;
  console.log(
    `${s.id.padEnd(5)} ${String(s.words).padStart(5)} ${String(b - a).padStart(7)} ` +
      `${secs.toFixed(1).padStart(6)} ${(s.words / secs).toFixed(2).padStart(6)}`,
  );
});
console.log(
  `total ${totalWords} words | ${cur} frames | ${(totalWords / (TOTAL / 30)).toFixed(2)} w/s overall`,
);
