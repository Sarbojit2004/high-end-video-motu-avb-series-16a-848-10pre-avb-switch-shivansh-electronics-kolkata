// Verify brief §4's contrast rule (≥ 4.5:1 for every piece of type) for every
// declared act palette: each ink on each flat ground, and the scrim case for
// type over a photograph in its worst case (scrim over pure white AND over
// pure black underlying pixels).
import { ACT_PALETTES, contrast, scrimContrast, inkFor, SCRIM_ALPHA } from "../src/data/../design/palette.ts";

let fails = 0;
const row = (label, ratio, note = "") => {
  const ok = ratio >= 4.5;
  if (!ok) fails++;
  console.log(`${ok ? "ok  " : "FAIL"} ${ratio.toFixed(2).padStart(6)}  ${label} ${note}`);
};
for (const [act, p] of Object.entries(ACT_PALETTES)) {
  console.log(`\n── ${act}`);
  for (const bg of p.bg) {
    const ink = inkFor(p, bg);
    row(`headline ink ${ink} on ground ${bg}`, contrast(ink, bg), ink !== p.ink ? "(auto-substituted)" : "");
    for (const c of new Set([p.ink, p.ink2])) {
      const r = contrast(c, bg);
      console.log(`      ${r >= 4.5 ? "pass" : "avoid"} ${r.toFixed(2).padStart(6)}  ${c} on ${bg}${r < 4.5 ? "  → inkFor() never returns this pairing" : ""}`);
    }
  }
  row(`scrim ink ${p.scrimInk} on ${p.scrim}@${SCRIM_ALPHA} over WHITE photo region`, scrimContrast(p.scrimInk, p.scrim, SCRIM_ALPHA, 1));
  row(`scrim ink ${p.scrimInk} on ${p.scrim}@${SCRIM_ALPHA} over BLACK photo region`, scrimContrast(p.scrimInk, p.scrim, SCRIM_ALPHA, 0));
}
console.log(fails ? `\n${fails} FAILING pairings` : "\nall declared type pairings ≥ 4.5:1");
process.exit(fails ? 1 : 0);
