// CHECKPOINT 3 (content half) — forbidden-content guard.
//
// Scans everything that can reach the screen for:
//   * any mention of TASCAM (Fact 5 — explicitly excluded from this project)
//   * any competing audio-interface manufacturer (Fact 4 — no comparisons)
//   * any OTHER Shivansh brand relationship (Fact 3 — this project's confirmed
//     relationship is MOTU Authorized Distributor, and only that)
//   * incorrect, rounded, "starting from" or blended pricing (Fact 2)
//
// Comments are stripped before scanning, so source annotations that legitimately
// reference the Neumann project as a structural precedent do not trip the guard
// — only text that can actually be rendered is checked.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { PROJ } from "./_load.mjs";

const SRC = resolve(PROJ, "src");

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(p) ? [p] : [];
  });
}

/** Remove /* *\/ and // comments so annotations are not scanned as content. */
function stripComments(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/**
 * Extract only what can actually reach the screen: string/template literals and
 * JSX text nodes. Scanning raw source instead would flag identifiers and CSS
 * property names — `zoom={2.4}` is a camera prop, not a manufacturer.
 */
function renderableText(src) {
  const out = [];
  const push = (re) => {
    let m;
    while ((m = re.exec(src)) !== null) out.push({ text: m[1] ?? m[0], index: m.index });
  };
  push(/"((?:[^"\\]|\\.)*)"/g);
  push(/'((?:[^'\\]|\\.)*)'/g);
  push(/`((?:[^`\\]|\\.)*)`/g);
  push(/>\s*([A-Za-z][^<>{}\n]{2,})</g); // JSX text nodes
  return out;
}

const FORBIDDEN = [
  // Fact 5 — explicit exclusion
  { re: /\bTASCAM\b/i, why: "TASCAM must not appear anywhere in this video (Fact 5)" },
  // Fact 4 — no comparison with any other audio-interface brand
  ...[
    "Focusrite", "Scarlett", "Clarett", "Universal Audio", "Apollo", "UAD",
    "RME", "Fireface", "Babyface", "Apogee", "Symphony", "Antelope",
    "PreSonus", "Behringer", "Audient", "Solid State Logic", "Zoom",
    "Steinberg", "Arturia", "Native Instruments", "Komplete Audio",
    "SSL 2", "Quantum", "Volt", "Duet ", "Ensemble",
  ].map((b) => ({ re: new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"),
                  why: `competing audio-interface brand "${b}" (Fact 4)` })),
  // Fact 3 — no other Shivansh brand relationship in this project
  { re: /\bNeumann\b/i, why: "another brand's relationship must not appear here (Fact 3)" },
  { re: /Authorized Partner/i, why: 'wrong designation — this project is "Authorized Distributor" (Fact 3)' },
  // Fact 2 — pricing discipline
  { re: /starting (from|at)/i, why: '"starting from" is forbidden on the fixed MOPs (Fact 2)' },
  { re: /1,\s?88,?000|1\.88\s?lakh|1,87,900\s*[-–—]\s*52,990/i, why: "rounded or blended pricing (Fact 2)" },
  { re: /\b1,87,000\b|\b1,78,900\b/, why: "incorrect interface MOP (Fact 2)" },
  { re: /\b52,900\b|\b52,999\b/, why: "incorrect AVB Switch MOP (Fact 2)" },
];

let failures = 0;
const files = walk(SRC);
for (const f of files) {
  const raw = readFileSync(f, "utf8");
  const body = stripComments(raw);
  for (const chunk of renderableText(body)) {
    for (const rule of FORBIDDEN) {
      const m = chunk.text.match(rule.re);
      if (m) {
        const line = body.slice(0, chunk.index).split("\n").length;
        console.error(`   FAIL ${f.replace(PROJ + "/", "")}:${line}  "${m[0]}" in ${JSON.stringify(chunk.text.slice(0, 70))} — ${rule.why}`);
        failures++;
      }
    }
  }
}
console.log(`scanned ${files.length} source files for forbidden content`);

// Positive assertions — the two MOPs must be present, exact, and separate.
const theme = readFileSync(resolve(SRC, "theme.ts"), "utf8");
const checks = [
  { ok: /interface:\s*"Rs\. 1,87,900"/.test(theme), msg: 'interface MOP is exactly "Rs. 1,87,900"' },
  { ok: /switch:\s*"Rs\. 52,990"/.test(theme), msg: 'AVB Switch MOP is exactly "Rs. 52,990"' },
  { ok: /MOP, incl\. GST/.test(theme), msg: '"MOP, incl. GST" wording present' },
  { ok: /Authorized Distributor of MOTU \(Mark of the Unicorn, USA\) Interfaces/.test(theme), msg: "distributor designation exact" },
  { ok: /East and North East India/.test(theme), msg: "region exact" },
  { ok: /www\.shivanshelectronics\.in/.test(theme), msg: "primary website present" },
];
for (const c of checks) {
  console.log(`   ${c.ok ? "ok  " : "FAIL"} ${c.msg}`);
  if (!c.ok) failures++;
}

console.log(failures === 0 ? "\nCONTENT GUARD: PASS" : `\nCONTENT GUARD: FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
