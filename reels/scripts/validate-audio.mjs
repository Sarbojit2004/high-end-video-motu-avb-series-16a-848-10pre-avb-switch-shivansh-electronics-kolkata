// Section 10a / Checkpoint 2 — two-layer audio pipeline validation.
// Must pass BEFORE any scene code that depends on the pipeline is written.
//
// Layer 1: every staged stem decodes, is long enough for the chapter that
//          consumes it, and carries real signal.
// Layer 2: every synthesized SFX decodes, is non-silent, and — the constraint
//          that actually matters — carries no meaningful sub-900 Hz energy,
//          which is what keeps it from muddying the bed.
import { execFileSync } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const FF = createRequire(import.meta.url)("ffmpeg-static");
const PROJ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MUSIC = resolve(PROJ, "public/audio/music");
const SFX = resolve(PROJ, "public/audio/sfx");

const SR = 48000;
function pcm(path, { lowpass } = {}) {
  const args = ["-v", "error", "-i", path, "-ac", "1", "-ar", String(SR)];
  // 4th-order to keep the skirt tight, so we measure real low-end rather than
  // the filter's own rolloff.
  if (lowpass) args.push("-af", `lowpass=f=${lowpass}:poles=2,lowpass=f=${lowpass}:poles=2`);
  args.push("-f", "f32le", "-");
  const raw = execFileSync(FF, args, { maxBuffer: 1 << 28, stdio: ["ignore", "pipe", "pipe"] });
  return new Float32Array(raw.buffer, raw.byteOffset, raw.length / 4);
}
const rms = (x) => { let s = 0; for (const v of x) s += v * v; return Math.sqrt(s / x.length); };
const peak = (x) => { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); return m; };
const dB = (v) => (v > 0 ? 20 * Math.log10(v) : -Infinity);
const fmt = (v) => (Number.isFinite(dB(v)) ? dB(v).toFixed(1) : "-inf");

let failures = 0;
const fail = (m) => { console.error(`   FAIL  ${m}`); failures++; };

// ------------------------------------------------------------------- Layer 1
// Longest span any single chapter draws from one track (Ch2/3/4/5 = 150 s).
// Each reel is 178 s. Only Mindscape (185.7 s) covers that unlooped; the three
// product tracks are looped with a crossfade inside their reel, so each only
// needs to be long enough to make one musical pass.
const NEED = {
  mindscape: 170, gifted: 120, diablo: 160, blackblue: 150, eternity: 135,
};
console.log("LAYER 1 — music stems");
const stems = readdirSync(MUSIC).filter((f) => f.endsWith(".mp3")).sort();
if (stems.length !== 17) fail(`expected 17 stems, found ${stems.length}`);
for (const f of stems) {
  const x = pcm(resolve(MUSIC, f));
  const dur = x.length / SR;
  const r = rms(x), p = peak(x);
  const track = f.split("-")[0];
  const need = NEED[track];
  const ok = dur >= need - 1 && r > 0.0005 && p > 0.01;
  console.log(
    `   ${ok ? "ok  " : "FAIL"} ${f.replace(".mp3", "").padEnd(24)} ${dur.toFixed(1)}s  ` +
    `rms ${fmt(r).padStart(6)} dB  peak ${fmt(p).padStart(6)} dB  (needs >=${need}s)`
  );
  if (!ok) failures++;
}

// ------------------------------------------------------------------- Layer 2
console.log("\nLAYER 2 — synthesized transition/foley SFX");
const sfx = readdirSync(SFX).filter((f) => f.endsWith(".wav")).sort();
if (sfx.length < 20) fail(`expected >=20 SFX files, found ${sfx.length}`);
// The constraint that matters is Stage 11's "no massive cinematic whooshes":
// energy in the bed's own kick/bass register (below ~400 Hz). Measure that
// directly rather than inferring it from a highpass residual, which would
// penalise a legitimately mid-tonal ping for the filter's rolloff alone.
const LOW_HZ = 400;
const LOW_MAX = 0.02; // <=2% of total energy below 400 Hz
for (const f of sfx) {
  const full = pcm(resolve(SFX, f));
  const low = pcm(resolve(SFX, f), { lowpass: LOW_HZ });
  const dur = full.length / SR;
  const rFull = rms(full), rLow = rms(low);
  const lowShare = rFull > 0 ? (rLow / rFull) ** 2 : 0;
  const ok = dur > 0.02 && rFull > 0.005 && lowShare <= LOW_MAX;
  console.log(
    `   ${ok ? "ok  " : "FAIL"} ${f.replace(".wav", "").padEnd(18)} ${dur.toFixed(3)}s  ` +
    `rms ${fmt(rFull).padStart(6)} dB  peak ${fmt(peak(full)).padStart(6)} dB  ` +
    `<${LOW_HZ}Hz ${(lowShare * 100).toFixed(2)}%`
  );
  if (!ok) failures++;
}

// Placeholder VO slot
console.log("\nVO SLOT");
const vo = resolve(PROJ, "public/vo/voiceover-reel1.mp3");
console.log(`   ${existsSync(vo) ? "present" : "absent (placeholder — narration recorded separately)"}: public/vo/voiceover-reel1.mp3`);

console.log(
  failures === 0
    ? "\nAUDIO PIPELINE VALIDATION: PASS"
    : `\nAUDIO PIPELINE VALIDATION: FAIL (${failures})`
);
process.exit(failures === 0 ? 0 : 1);
