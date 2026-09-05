// ─────────────────────────────────────────────────────────────────────────────
// TRANSITION-SFX PALETTE — synthesized here, in-process, from first principles.
// Nothing is sourced from the repository's sound-effects/ folder or from any
// external library/service. Six elements, one per transition type in brief §5:
//
//   whoosh   directional band-passed noise sweep       → whip-pan cuts
//   impact   sub thump + click + short noise tail      → hard cuts on the beat
//   glitch   8-slice stutter of ring-modulated noise   → glitch / digital-tear
//   riser    2-beat filtered-noise + pitch riser       → into act openings
//   sweep    thin, bright resonant line "zip"          → line-reveal wipes
//   pop      1-frame bright transient                  → color-flash cuts
//   tick     tiny clock-edge click                     → Act 0 pulse
//
// All elements are gain-staged well below the music (README "Audio mix") and
// band-limited so they sit *on top of* the bed rather than fighting its lows.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "audio", "sfx");
fs.mkdirSync(OUT, { recursive: true });
export const SR = 48000;
const TAU = Math.PI * 2;

let _s = 0x9e3779b9;
const seed = (v) => { _s = v >>> 0 || 1; };
const rnd = () => { _s ^= _s << 13; _s >>>= 0; _s ^= _s >> 17; _s ^= _s << 5; _s >>>= 0; return (_s / 0xffffffff) * 2 - 1; };

function writeWav(file, L, R = L) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0, o = 44; i < n; i++, o += 4) {
    buf.writeInt16LE((Math.max(-1, Math.min(1, L[i])) * 32767) | 0, o);
    buf.writeInt16LE((Math.max(-1, Math.min(1, R[i])) * 32767) | 0, o + 2);
  }
  fs.writeFileSync(file, buf);
  return n / SR;
}
const alloc = (s) => new Float32Array(Math.ceil(s * SR));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// biquad band-pass, time-varying centre via callback
function bandpass(x, fcAt, q = 2) {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const fc = clamp(fcAt(i / SR), 30, 18000);
    const w = TAU * fc / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
    const b0 = a, b1 = 0, b2 = -a, a0 = 1 + a, a1 = -2 * c, a2 = 1 - a;
    const v = (b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0;
    x2 = x1; x1 = x[i]; y2 = y1; y1 = v; y[i] = v;
  }
  return y;
}
function hp(x, fc) { const a = Math.exp(-TAU * fc / SR); let px = 0, py = 0; for (let i = 0; i < x.length; i++) { py = a * (py + x[i] - px); px = x[i]; x[i] = py; } return x; }
function lp(x, fc) { const a = Math.exp(-TAU * fc / SR); let y = 0; for (let i = 0; i < x.length; i++) { y = a * y + (1 - a) * x[i]; x[i] = y; } return x; }
function normalize(x, peak) { let m = 0; for (const v of x) m = Math.max(m, Math.abs(v)); if (m > 1e-9) for (let i = 0; i < x.length; i++) x[i] *= peak / m; return x; }
function env(x, fn) { for (let i = 0; i < x.length; i++) x[i] *= fn(i / SR); return x; }
const noise = (s) => { const b = alloc(s); for (let i = 0; i < b.length; i++) b[i] = rnd(); return b; };
const mix = (...bufs) => { const n = Math.max(...bufs.map((b) => b.length)); const o = new Float32Array(n); for (const b of bufs) for (let i = 0; i < b.length; i++) o[i] += b[i]; return o; };
const stereoWiden = (x, delayMs, amt) => { const d = Math.round(delayMs * SR / 1000); const R = new Float32Array(x.length); for (let i = 0; i < x.length; i++) R[i] = x[i] * (1 - amt) + (i >= d ? x[i - d] : 0) * amt; return R; };

// 1. WHOOSH — 0.42 s, noise swept 300 Hz → 6 kHz, peaks 60 % in
function whoosh() {
  seed(11);
  const d = 0.42;
  let x = bandpass(noise(d), (t) => 300 * Math.pow(20, t / d), 1.4);
  env(x, (t) => Math.pow(Math.sin(Math.PI * clamp(t / d, 0, 1)), 1.6) * (t < d * 0.6 ? 1 : 1 - (t - d * 0.6) / (d * 0.4) * 0.3));
  hp(x, 250); normalize(x, 0.9);
  return [x, stereoWiden(x, 9, 0.5)];
}
// 2. IMPACT — 0.55 s, 55 Hz sine thump with fast pitch drop + click + air
function impact() {
  seed(23);
  const d = 0.55, x = alloc(d);
  let ph = 0;
  for (let i = 0; i < x.length; i++) {
    const t = i / SR, f = 42 + 110 * Math.exp(-t * 22);
    ph += TAU * f / SR;
    x[i] = Math.sin(ph) * Math.exp(-t * 6.5) * 0.9;
  }
  const click = env(hp(noise(0.03), 1800), (t) => Math.exp(-t * 260));
  const air = env(lp(hp(noise(d), 900), 6000), (t) => Math.exp(-t * 9) * 0.35);
  const y = mix(x, click, air); normalize(y, 0.95);
  return [y, y];
}
// 3. GLITCH — 0.30 s, 8 stuttered slices of ring-modulated noise, no sub
function glitch() {
  seed(37);
  const d = 0.3, x = alloc(d), slices = 8, sl = Math.floor(x.length / slices);
  for (let s = 0; s < slices; s++) {
    const f = 700 + Math.abs(rnd()) * 3200, gate = rnd() > -0.35 ? 1 : 0.15, hold = Math.floor(sl * (0.25 + Math.abs(rnd()) * 0.6));
    for (let i = 0; i < sl; i++) {
      const t = i / SR, n = i < hold ? rnd() : 0;
      x[s * sl + i] = n * Math.sin(TAU * f * t) * gate * (0.5 + 0.5 * Math.cos(Math.PI * i / sl)) * (1 - s / slices * 0.45);
    }
  }
  hp(x, 400); normalize(x, 0.8);
  return [x, stereoWiden(x, 4, 0.8)];
}
// 4. RISER — 1.35 s (2 beats @ 89.5 bpm), noise 200 Hz → 9 kHz + rising tone, ends hard
function riser() {
  seed(41);
  const d = 1.35;
  const n = bandpass(noise(d), (t) => 200 * Math.pow(45, t / d), 1.1);
  env(n, (t) => Math.pow(t / d, 1.8));
  const tone = alloc(d); let ph = 0;
  for (let i = 0; i < tone.length; i++) { const t = i / SR; ph += TAU * (110 * Math.pow(4, t / d)) / SR; tone[i] = (Math.sin(ph) + 0.4 * Math.sin(2 * ph)) * Math.pow(t / d, 2.5) * 0.35; }
  const y = mix(n, tone); hp(y, 180); normalize(y, 0.85);
  return [y, stereoWiden(y, 12, 0.6)];
}
// 5. SWEEP — 0.35 s thin resonant "zip" for the line-reveal wipe
function sweep() {
  seed(53);
  const d = 0.35;
  const x = bandpass(noise(d), (t) => 1200 + 5200 * Math.sin(Math.PI * t / d), 9);
  env(x, (t) => Math.sin(Math.PI * clamp(t / d, 0, 1)) * 0.9);
  hp(x, 900); normalize(x, 0.75);
  return [x, stereoWiden(x, 6, 0.7)];
}
// 6. POP — 0.06 s bright transient for the 1–3 frame colour flash
function pop() {
  seed(67);
  const x = env(hp(noise(0.06), 2500), (t) => Math.exp(-t * 120));
  normalize(x, 0.7);
  return [x, x];
}
// 7. TICK — 0.05 s clock-edge click for the Act 0 pulse
function tick() {
  seed(71);
  const x = alloc(0.05); let ph = 0;
  for (let i = 0; i < x.length; i++) { const t = i / SR; ph += TAU * 3200 / SR; x[i] = Math.sin(ph) * Math.exp(-t * 180) + rnd() * Math.exp(-t * 400) * 0.4; }
  hp(x, 800); normalize(x, 0.6);
  return [x, x];
}

const palette = { whoosh, impact, glitch, riser, sweep, pop, tick };
const report = {};
for (const [name, fn] of Object.entries(palette)) {
  const [L, R] = fn();
  report[name] = +writeWav(path.join(OUT, `${name}.wav`), L, R).toFixed(3);
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(report, null, 2));
console.log("sfx written:", Object.entries(report).map(([k, v]) => `${k} ${v}s`).join(", "));
