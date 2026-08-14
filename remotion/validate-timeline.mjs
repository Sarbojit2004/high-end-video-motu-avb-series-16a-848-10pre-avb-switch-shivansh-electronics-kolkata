// Validates a part's timeline: frame continuity, total runtime, pacing, and
// full coverage of that part's catalogue slice.
//   node validate-timeline.mjs 1 2 3
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assets = JSON.parse(readFileSync(join(here, 'assets.json'), 'utf8'));

const re =
  /id: '(\w+)',\s*label: '([^']*)',\s*text:\s*["'](.+?)["'],\s*start: (\d+),\s*end: (\d+),\s*assets: \[([^\]]*)\]/gs;

let failed = false;

for (const part of process.argv.slice(2)) {
  const isLong = part.startsWith('long');
  const n = isLong ? part.slice(4) : part;
  const total = isLong ? 8940 : 2640;
  const relPath = isLong
    ? ['src', 'long', `part${n}`, 'timeline.ts']
    : ['src', `part${n}`, 'timeline.ts'];
  let src;
  try {
    src = readFileSync(join(here, ...relPath), 'utf8');
  } catch {
    console.log(`\npart ${part}: no timeline yet`);
    continue;
  }
  const segs = [...src.matchAll(re)].map((m) => ({
    id: m[1],
    text: m[3],
    start: +m[4],
    end: +m[5],
    assets: m[6].split(',').map((x) => x.trim()).filter(Boolean),
  }));

  console.log(`\n=== ${isLong ? 'LONG PART ' + n : 'PART ' + n} (${total} frames) ===`);
  console.log('SEG  FRAMES        SECS  WORDS   W/S  ASSETS  S/ASSET  FLAGS');

  let prev = 0;
  let words = 0;
  const placed = [];
  for (const s of segs) {
    const w = s.text.trim().split(/\s+/).length;
    words += w;
    const secs = (s.end - s.start) / 30;
    const wps = w / secs;
    const spa = secs / s.assets.length;
    placed.push(...s.assets);

    const flags = [];
    if (s.start !== prev) { flags.push(`GAP(expected ${prev})`); failed = true; }
    if (wps > 2.55 || wps < 1.9) flags.push(`pace ${wps.toFixed(2)}`);
    if (spa < 0.9) flags.push(`rushed ${spa.toFixed(2)}s`);
    prev = s.end;

    console.log(
      `${s.id.padEnd(4)} ${`${s.start}-${s.end}`.padEnd(13)} ${secs.toFixed(1).padStart(4)} ` +
        `${String(w).padStart(6)} ${wps.toFixed(2).padStart(5)} ${String(s.assets.length).padStart(7)} ` +
        `${spa.toFixed(2).padStart(8)}  ${flags.join(' ') || 'ok'}`,
    );
  }

  const expect = new Set(
    assets.filter((a) => a.part === +n).map((a) => String(a.idx)),
  );
  const uniq = new Set(placed);
  const missing = [...expect].filter((x) => !uniq.has(x));
  const extra = [...uniq].filter((x) => !expect.has(x));
  const repeats = placed.filter((x, i) => placed.indexOf(x) !== i);

  const okFrames = prev === total;
  console.log('---');
  console.log(`frames      : ${prev} ${okFrames ? `OK (${(total/30).toFixed(3)}s)` : `MISMATCH — must be ${total}`}`);
  console.log(`words       : ${words} → ${(words / (total/30)).toFixed(2)} w/s overall`);
  console.log(`assets      : ${placed.length} placed, ${uniq.size} unique of ${expect.size} catalogued`);
  console.log(`missing     : ${missing.join(',') || 'none'}`);
  console.log(`extra       : ${extra.join(',') || 'none'}`);
  console.log(`repeated    : ${repeats.join(',') || 'none'}`);

  if (!okFrames || missing.length || extra.length || repeats.length) failed = true;
}

console.log(failed ? '\nFAILED' : '\nALL CHECKS PASSED');
process.exit(failed ? 1 : 0);
