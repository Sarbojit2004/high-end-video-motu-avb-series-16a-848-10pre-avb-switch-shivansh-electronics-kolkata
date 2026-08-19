// Reports the Layer 2 placement list the delivered transition-SFX timeline WAV
// contains, so the audio deliverable can be checked against the picture rather
// than taken on trust: how many sounds land, which files are used, where the
// first and last fall, and whether any beat's transition sound never places.
import { loadSchedule } from "./_load.mjs";
const { BEATS, BEAT_STARTS, TOTAL_FRAMES, frames } = await loadSchedule();
// The placement arithmetic is mirrored from accents() in src/audio-pipeline.tsx.
// It cannot be imported here — that module is TSX and pulls in Remotion — so
// this file restates it, and the totals below are what the delivered
// transition-SFX WAV actually contains.
const out = [];
BEATS.forEach((b, i) => {
  const start = BEAT_STARTS[i], len = frames(b.sec);
  out.push({ at: Math.max(0, start - 4), sfx: b.sfx, why: "beat transition" });
  if (b.kind === "specGrid") (b.specs ?? []).forEach((_, k) => out.push({ at: start + 18 + k * 8, sfx: k % 2 ? "counter-tick" : "relay-tick-hi", why: "spec chip" }));
  if (b.kind === "montage") b.images.forEach((_, k) => out.push({ at: start + 10 + k * 4, sfx: k % 2 ? "relay-tick" : "relay-tick-hi", why: "montage tile" }));
  if (b.kind === "ecosystemSplit") [0,1,2].forEach((k) => out.push({ at: start + 14 + k * 2, sfx: "avb-ping-top", why: "split rack" }));
  if (b.kind === "portSweep") for (let k = 0; k < 6; k++) out.push({ at: start + 14 + k * Math.round(len * 0.11), sfx: k % 2 ? "encoder-detent-hi" : "encoder-detent-lo", why: "sweep detent" });
  if (b.kind === "macroReveal" || b.kind === "hook") out.push({ at: start + Math.round(len * 0.35), sfx: "panel-air-soft", why: "reveal" });
  if (b.kind === "dataFlow") { out.push({ at: start + 22, sfx: "data-stream-short", why: "flow" }); out.push({ at: start + Math.round(len * 0.5), sfx: "rj45-snap-soft", why: "flow" }); out.push({ at: start + Math.round(len * 0.72), sfx: "gptp-sync", why: "flow" }); }
  if (b.kind === "badges") (b.labels ?? []).forEach((_, k) => out.push({ at: start + 12 + k * 8, sfx: k ? "avb-ping-hi" : "avb-ping-mid", why: "badge" }));
  if (b.kind === "price" || b.kind === "outro") { out.push({ at: start + 20, sfx: "avb-ping-mid", why: "lockup" }); out.push({ at: start + 34, sfx: "avb-ping-top", why: "lockup" }); }
});
const placed = out.filter((a) => a.at >= 0 && a.at < TOTAL_FRAMES);
const used = new Set(placed.map((p) => p.sfx));
console.log(`Layer 2 placements on the 298 s timeline: ${placed.length}`);
console.log(`distinct SFX files used: ${used.size} of 28`);
console.log(`first at frame ${placed[0].at}, last at frame ${Math.max(...placed.map(p=>p.at))} (of ${TOTAL_FRAMES})`);
const per = {};
for (const p of placed) per[p.why] = (per[p.why] ?? 0) + 1;
console.log("by role:", per);
const unused = [...new Set(BEATS.map(b=>b.sfx))].filter(s=>!used.has(s));
console.log("beat SFX never placed:", unused.length ? unused : "none");
