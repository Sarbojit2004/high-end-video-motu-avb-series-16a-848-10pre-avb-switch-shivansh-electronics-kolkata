// Mandatory-coverage audit (prompt s0).
//
// The hard requirement is that every one of the 117 product images in the repo
// appears somewhere across the three reels combined. 18 of those 117 are
// byte-identical duplicates of others, so the catalogue carries 99 unique
// images; showing all 99 covers all 117 filenames, because each duplicate's
// pixels are on screen under its twin's slug.
//
// This script proves that end to end: repo file -> md5 group -> catalogue
// entry -> a segment in a part timeline.
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');

const files = readdirSync(repo).filter(
  (f) => /\.(jpg|png)$/i.test(f) && !/LOGO/i.test(f),
);

const md5 = (p) => createHash('md5').update(readFileSync(p)).digest('hex');
const hashOf = Object.fromEntries(files.map((f) => [f, md5(join(repo, f))]));

const assets = JSON.parse(readFileSync(join(here, 'assets.json'), 'utf8'));
const catalogueHash = Object.fromEntries(
  assets.map((a) => [a.idx, md5(join(repo, a.src))]),
);

// which catalogue indices actually appear in a timeline
const re = /assets: \[([^\]]*)\]/g;
const placed = new Set();
const perPart = {};
for (const p of [1, 2, 3]) {
  const src = readFileSync(join(here, 'src', `part${p}`, 'timeline.ts'), 'utf8');
  const ids = [...src.matchAll(re)]
    .flatMap((m) => m[1].split(',').map((x) => x.trim()).filter(Boolean))
    .map(Number);
  perPart[p] = ids.length;
  ids.forEach((i) => placed.add(i));
}

const shownHashes = new Set([...placed].map((i) => catalogueHash[i]));

const covered = [];
const uncovered = [];
for (const f of files) {
  (shownHashes.has(hashOf[f]) ? covered : uncovered).push(f);
}

const uniqueHashes = new Set(Object.values(hashOf));

console.log('MANDATORY COVERAGE AUDIT');
console.log('========================');
console.log(`repo product images        : ${files.length}`);
console.log(`unique by content (md5)    : ${uniqueHashes.size}`);
console.log(`redundant duplicate copies : ${files.length - uniqueHashes.size}`);
console.log(`catalogue entries          : ${assets.length}`);
console.log(`placed in a timeline       : ${placed.size}`);
console.log(`  part 1 / 2 / 3           : ${perPart[1]} / ${perPart[2]} / ${perPart[3]}`);
console.log('');
console.log(`FILENAMES COVERED          : ${covered.length} / ${files.length}`);
if (uncovered.length) {
  console.log('NOT COVERED:');
  uncovered.forEach((f) => console.log(`  - ${f}`));
} else {
  console.log('every repo product image appears on screen across the three reels');
}

const unplaced = assets.filter((a) => !placed.has(a.idx));
if (unplaced.length) {
  console.log('\ncatalogued but never shown:');
  unplaced.forEach((a) => console.log(`  #${a.idx} ${a.src}`));
}

const ok = uncovered.length === 0 && unplaced.length === 0;
console.log(`\n${ok ? 'PASS' : 'FAIL'}`);
process.exit(ok ? 0 : 1);
