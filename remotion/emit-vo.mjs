// Emits the voiceover -> timeline deliverable for a part (prompt s8).
//   node emit-vo.mjs 1
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..');
const part = process.argv[2] ?? '1';

const META = {
  '1': {
    title: 'The Tracking Room',
    product: 'MOTU 10pre',
    tone: 'Warm & Trustworthy — the integrator’s perspective (brief §9, option 3)',
  },
  '2': {
    title: 'The Patchbay',
    product: 'MOTU 16A',
    tone: 'Precise & Technical-but-Accessible (brief §9, option 1)',
  },
  '3': {
    title: 'The Control Room',
    product: 'MOTU 848',
    tone: 'Cinematic & Aspirational (brief §9, option 2)',
  },
}[part];

const src = readFileSync(join(here, 'src', `part${part}`, 'timeline.ts'), 'utf8');
const assets = JSON.parse(readFileSync(join(here, 'assets.json'), 'utf8'));
const byIdx = Object.fromEntries(assets.map((a) => [String(a.idx), a]));

const re =
  /id: '(\w+)',\s*label: '([^']*)',\s*text:\s*["'](.+?)["'],\s*start: (\d+),\s*end: (\d+),\s*assets: \[([^\]]*)\]/gs;
const segs = [...src.matchAll(re)].map((m) => ({
  id: m[1],
  label: m[2],
  text: m[3],
  start: +m[4],
  end: +m[5],
  assets: m[6].split(',').map((x) => x.trim()).filter(Boolean),
}));

const tc = (f) => {
  const s = f / 30;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(2).padStart(5, '0')}`;
};

const L = [];
L.push(`# MOTU AVB Series — Reel Part ${part} of 3`);
L.push(`## "${META.title}" · ${META.product}`);
L.push('');
L.push('**Runtime** 88.000 s (2,640 frames @ 30 fps) · **Format** 1080×1920 portrait 9:16  ');
L.push(`**Language** English only · **Tone** ${META.tone}`);
L.push('');
L.push(
  'The voiceover is written as discrete timeline-mapped segments, each locked to one visual',
);
L.push(
  'beat. Picture and narration change together: there is no beat where the voice has moved on',
);
L.push('while the screen lingers, and none where new imagery arrives unnarrated.');
L.push('');
L.push(
  'Pace is planned at 2.2–2.5 words/second. Record to the frame ranges below — if a read comes',
);
L.push('in long or short, move the **segment boundary**, never rush the delivery.');
L.push('');
L.push('---');
L.push('');
L.push('## Voiceover → timeline');
L.push('');
L.push('| # | Segment | Script | Start | End | Frames | Sec | Words | w/s | On-screen assets |');
L.push('|---|---------|--------|-------|-----|--------|-----|-------|-----|------------------|');

let totalWords = 0;
for (const s of segs) {
  const w = s.text.trim().split(/\s+/).length;
  totalWords += w;
  const secs = (s.end - s.start) / 30;
  const names = s.assets
    .map((i) => byIdx[i].src.replace('MOTU ', '').replace(/\.(jpg|png)$/, ''))
    .join(', ');
  L.push(
    `| ${s.id} | ${s.label} | ${s.text} | ${tc(s.start)} | ${tc(s.end)} | ${s.start}–${s.end} | ` +
      `${secs.toFixed(1)} | ${w} | ${(w / secs).toFixed(2)} | ${names} |`,
  );
}
L.push('');
L.push(
  `**Total** 2,640 frames · 88.000 s · ${totalWords} words · ` +
    `${(totalWords / 88).toFixed(2)} w/s overall`,
);
L.push('');
L.push('---');
L.push('');
L.push('## Continuous read (for the voice talent)');
L.push('');
for (const s of segs) {
  L.push(`**${s.id}** (${tc(s.start)})  ${s.text}`);
  L.push('');
}
L.push('---');
L.push('');
L.push('## Notes');
L.push('');
L.push(
  '- **No competitor or interoperability-partner brands** are named anywhere. Milan',
);
L.push(
  '  certification is conveyed as the substance of the claim — that these units interoperate',
);
L.push(
  '  with other Milan-certified equipment across the professional audio industry — without',
);
L.push('  naming third-party manufacturers.');
L.push(
  '- **Pricing** appears only as Market Operating Price (MOP), in the Part 3 CTA, framed as one',
);
L.push('  identical investment rather than three separate prices.');
L.push(
  '- **Distributor designation** is used unabbreviated: "Shivansh Electronics, MOTU\'s Authorized',
);
L.push('  Distributor for East and North East India."');
L.push(
  `- The reel ships with an original score and original synthesised sound design mixed low`,
);
L.push(
  `  (\`audio/score_part${part}.py\`), so a recorded voiceover can be laid over`,
);
L.push(`  \`audio/out/bed_part${part}.wav\` without re-balancing the bed.`);
L.push('');

mkdirSync(join(repo, 'voiceover'), { recursive: true });
const out = join(repo, 'voiceover', `VOICEOVER-PART${part}.md`);
writeFileSync(out, L.join('\n'));
console.log(`wrote voiceover/VOICEOVER-PART${part}.md  (${segs.length} segments, ${totalWords} words)`);
