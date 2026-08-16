// Recomputes each VO script's arithmetic block directly from its own timeline
// table, so the stated numbers can never drift from the script itself.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TOTAL = 5340;

const FILES = [
  "VO_SCRIPT_REEL_PART1_10PRE.md",
  "VO_SCRIPT_REEL_PART2_16A.md",
  "VO_SCRIPT_REEL_PART3_848_AVBSWITCH.md",
];

const countWords = (t) =>
  (t.replace(/\[pause[^\]]*\]/g, "").match(/[A-Za-z0-9’'\-.]+/g) || []).filter((w) =>
    /[A-Za-z0-9]/.test(w)
  ).length;

let failures = 0;

for (const f of FILES) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) continue;
  const src = fs.readFileSync(p, "utf8");
  const table = src.split("## VO-to-timeline table")[1].split("## Arithmetic check")[0];

  const rows = [];
  for (const line of table.trim().split("\n")) {
    if (!line.startsWith("|") || !line.includes("**") || line.includes("Script Text")) continue;
    const c = line.split("|").map((x) => x.trim());
    if (c.length < 6) continue;
    const txt = c[2];
    const pauses = [...txt.matchAll(/\[pause\s*([\d.]+)s\]/g)].reduce((a, m) => a + parseFloat(m[1]), 0);
    rows.push({ start: +c[3], end: +c[4], words: countWords(txt), pauses });
  }

  const overlaps = rows.filter((r, i) => i && r.start <= rows[i - 1].end).length;
  const gaps = rows.slice(1).map((r, i) => r.start - rows[i].end);
  const window = rows.reduce((a, r) => a + (r.end - r.start), 0);
  const words = rows.reduce((a, r) => a + r.words, 0);
  const pauses = rows.reduce((a, r) => a + r.pauses, 0);
  const speech = window / 30 - pauses;
  const wpm = (words / speech) * 60;
  const densest = rows
    .map((r) => ({ ...r, sp: (r.end - r.start) / 30 - r.pauses }))
    .map((r) => ({ ...r, wpm: (r.words / r.sp) * 60 }))
    .sort((a, b) => b.wpm - a.wpm)[0];

  const bad = [];
  if (overlaps) bad.push(`${overlaps} overlapping segments`);
  if (rows.at(-1).end > TOTAL) bad.push(`final end ${rows.at(-1).end} > ${TOTAL}`);
  if (densest.wpm > 175) bad.push(`densest segment ${densest.wpm.toFixed(1)} wpm > 175`);
  if (wpm < 120 || wpm > 170) bad.push(`overall ${wpm.toFixed(1)} wpm outside 120–170`);

  console.log(
    `${f}\n  segments ${rows.length} | end ${rows.at(-1).end} | overlaps ${overlaps} | ` +
      `gaps ${Math.min(...gaps)}–${Math.max(...gaps)} | words ${words} | pauses ${pauses.toFixed(1)}s | ` +
      `speech ${speech.toFixed(1)}s | ${wpm.toFixed(1)} wpm | densest ${densest.wpm.toFixed(1)} wpm` +
      (bad.length ? `\n  ✗ ${bad.join("; ")}` : "\n  ✓ all checks pass")
  );
  if (bad.length) failures++;
}

process.exit(failures ? 1 : 0);
