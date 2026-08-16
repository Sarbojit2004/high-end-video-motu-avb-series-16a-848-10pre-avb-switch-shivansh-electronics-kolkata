// ─────────────────────────────────────────────────────────────────────────────
// TRANSITION-SFX PALETTE — freshly synthesized here, in-process.
// Not sourced from ElevenLabs or any external audio service.
//
// Brief direction: evoke tactile hardware and invisible data transfer without
// competing with the music bed. NO large cinematic low-frequency whooshes —
// every element here is deliberately band-limited above ~150 Hz so it sits in
// the gaps of the bed rather than under it.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "..", "public", "audio", "sfx");
fs.mkdirSync(OUT, { recursive: true });

export const SR = 48000;
const TAU = Math.PI * 2;

// ── deterministic noise ──────────────────────────────────────────────────────
let _s = 0x2f6e2b1;
const rnd = () => {
  _s ^= _s << 13; _s >>>= 0;
  _s ^= _s >> 17;
  _s ^= _s << 5; _s >>>= 0;
  return (_s / 0xffffffff) * 2 - 1;
};
const seed = (v) => { _s = v >>> 0; };

// ── WAV (16-bit PCM stereo) ──────────────────────────────────────────────────
export function writeWav(file, L, R = L) {
  const n = L.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    const l = Math.max(-1, Math.min(1, L[i]));
    const r = Math.max(-1, Math.min(1, R[i]));
    buf.writeInt16LE((l * 32767) | 0, o);
    buf.writeInt16LE((r * 32767) | 0, o + 2);
    o += 4;
  }
  fs.writeFileSync(file, buf);
  return n / SR;
}

// ── DSP helpers ──────────────────────────────────────────────────────────────
/** Damped resonator: rings at `f` with 60 dB decay in `decay` seconds. */
function resonate(buf, f, decay, amp, startSample = 0, excite) {
  const w = TAU * f / SR;
  const r = Math.exp(-6.9078 / (decay * SR));
  const c1 = 2 * r * Math.cos(w);
  const c2 = -r * r;
  let y1 = 0, y2 = 0;
  for (let i = startSample; i < buf.length; i++) {
    const x = excite(i - startSample);
    const y = x + c1 * y1 + c2 * y2;
    y2 = y1; y1 = y;
    buf[i] += y * amp;
  }
}

function onePoleHP(buf, fc) {
  const a = Math.exp((-TAU * fc) / SR);
  let px = 0, py = 0;
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i];
    py = a * (py + x - px); px = x;
    buf[i] = py;
  }
}
function onePoleLP(buf, fc) {
  const a = Math.exp((-TAU * fc) / SR);
  let y = 0;
  for (let i = 0; i < buf.length; i++) { y = a * y + (1 - a) * buf[i]; buf[i] = y; }
}
function normalize(buf, peak) {
  let m = 0;
  for (let i = 0; i < buf.length; i++) m = Math.max(m, Math.abs(buf[i]));
  if (m < 1e-9) return;
  const g = peak / m;
  for (let i = 0; i < buf.length; i++) buf[i] *= g;
}
function fadeOut(buf, secs) {
  const n = Math.min(buf.length, (secs * SR) | 0);
  for (let i = 0; i < n; i++) buf[buf.length - 1 - i] *= i / n;
}
const alloc = (secs) => new Float32Array(Math.ceil(secs * SR));
/** Short noise burst envelope (exponential). */
const burst = (decaySec) => {
  const k = 1 / (decaySec * SR);
  return (i) => rnd() * Math.exp(-i * k * 6.9078);
};

// ═════════════════════════════════════════════════════════════════════════════
// 1. ENCODER CLICK — high-end aluminium encoder detent.
//    Tight metallic double-resonance, no low end at all.
// ═════════════════════════════════════════════════════════════════════════════
function encoderClick() {
  seed(1013);
  const b = alloc(0.09);
  resonate(b, 2840, 0.018, 0.55, 0, burst(0.0016));
  resonate(b, 5680, 0.010, 0.30, 0, burst(0.0012));
  resonate(b, 8900, 0.006, 0.14, 0, burst(0.0008));
  // tiny mechanical body so it reads as metal, not a beep
  resonate(b, 620, 0.012, 0.10, 0, burst(0.0022));
  onePoleHP(b, 320);
  normalize(b, 0.82);
  fadeOut(b, 0.02);
  return b;
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. RJ-45 SNAP — the definitive lock of an Ethernet plug seating in a port.
//    Two transients: the latch compressing, then the plug seating home.
// ═════════════════════════════════════════════════════════════════════════════
function rj45Snap() {
  seed(4517);
  const b = alloc(0.22);
  // (a) latch compress — duller, plastic
  resonate(b, 1450, 0.020, 0.34, 0, burst(0.0030));
  resonate(b, 3100, 0.012, 0.18, 0, burst(0.0020));
  // (b) seat/lock — brighter, louder, 21 ms later
  const d = (0.021 * SR) | 0;
  resonate(b, 2250, 0.026, 0.62, d, burst(0.0022));
  resonate(b, 4700, 0.014, 0.34, d, burst(0.0015));
  resonate(b, 7400, 0.008, 0.16, d, burst(0.0010));
  // small housing thunk so it feels like a physical port, kept above 150 Hz
  resonate(b, 240, 0.030, 0.16, d, burst(0.0040));
  onePoleHP(b, 190);
  normalize(b, 0.86);
  fadeOut(b, 0.04);
  return b;
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. AVB HANDSHAKE PING — clean, resonant confirmation of a successful
//    network handshake. Pitched, consonant, unmistakably "locked".
// ═════════════════════════════════════════════════════════════════════════════
function avbPing() {
  seed(7717);
  const b = alloc(0.55);
  const n = b.length;
  const f0 = 1174.66; // D6
  const partials = [
    [1.0, 1.0, 0.34],
    [1.5, 0.52, 0.28], // fifth above
    [2.0, 0.26, 0.20],
    [3.0, 0.11, 0.13],
  ];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const atk = Math.min(1, t / 0.0022);
    let s = 0;
    for (const [mult, amp, dec] of partials) {
      s += amp * Math.sin(TAU * f0 * mult * t) * Math.exp(-t / dec);
    }
    // faint strike transient so it isn't a pure sine
    if (i < 90) s += rnd() * 0.28 * (1 - i / 90);
    b[i] = s * atk;
  }
  onePoleHP(b, 400);
  normalize(b, 0.72);
  fadeOut(b, 0.09);
  return b;
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. DATA-STREAM TEXTURE — subtle high-frequency shimmer for the network
//    topology sequences. Doubles as ambient top/bottom-zone fill (Section 2b).
//    4.0 s and seamlessly loopable (all modulators have periods dividing 4 s).
// ═════════════════════════════════════════════════════════════════════════════
function dataStream() {
  seed(2287);
  const dur = 4.0;
  const b = alloc(dur);
  const n = b.length;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    // sparse deterministic "bit" activity, period 0.25 s → divides 4 s
    const cell = Math.floor(t / 0.0078125);
    const bit = ((cell * 2654435761) >>> 0) / 0xffffffff > 0.72 ? 1 : 0.18;
    const lfo =
      0.55 +
      0.25 * Math.sin(TAU * t * 0.5) + // 2 s period
      0.20 * Math.sin(TAU * t * 1.25); // 0.8 s period
    b[i] = rnd() * bit * lfo;
  }
  onePoleHP(b, 5200);
  onePoleLP(b, 13500);
  normalize(b, 0.34);
  return b;
}

// ═════════════════════════════════════════════════════════════════════════════
// 5. TALKBACK ENGAGE — the 848's front-panel talkback button (Part 3).
//    Softer, rubberier and lower than the encoder detent.
// ═════════════════════════════════════════════════════════════════════════════
function talkbackClick() {
  seed(9091);
  const b = alloc(0.13);
  resonate(b, 780, 0.028, 0.52, 0, burst(0.0038));
  resonate(b, 1560, 0.016, 0.24, 0, burst(0.0026));
  resonate(b, 320, 0.040, 0.22, 0, burst(0.0050));
  // release tick — the button coming back up, 46 ms later
  const d = (0.046 * SR) | 0;
  resonate(b, 1120, 0.012, 0.20, d, burst(0.0018));
  onePoleHP(b, 170);
  onePoleLP(b, 6800);
  normalize(b, 0.78);
  fadeOut(b, 0.03);
  return b;
}

// ── build ────────────────────────────────────────────────────────────────────
const PALETTE = {
  "encoder-click": encoderClick,
  "rj45-snap": rj45Snap,
  "avb-ping": avbPing,
  "data-stream": dataStream,
  "talkback-click": talkbackClick,
};

const report = [];
for (const [name, fn] of Object.entries(PALETTE)) {
  const mono = fn();
  // Gentle stereo: tiny haas offset keeps the clicks from feeling dead-centre.
  const off = name === "data-stream" ? 220 : 12;
  const R = new Float32Array(mono.length);
  for (let i = 0; i < mono.length; i++) R[i] = mono[Math.max(0, i - off)] * 0.94;

  const wav = path.join(OUT, `${name}.wav`);
  const dur = writeWav(wav, mono, R);
  report.push({ name, dur: dur.toFixed(3), wav });
}

console.log("Synthesized transition-SFX palette:");
for (const r of report) console.log(`  ${r.name.padEnd(16)} ${r.dur}s  ${path.basename(r.wav)}`);

// Validate every file actually decodes.
let ok = 0;
for (const r of report) {
  const out = execFileSync(
    ffmpegPath,
    ["-v", "error", "-i", r.wav, "-f", "null", "-"],
    { stdio: ["ignore", "pipe", "pipe"] }
  );
  if (out.toString().trim() === "") ok++;
}
console.log(`\nvalidated: ${ok}/${report.length} decode cleanly`);
if (ok !== report.length) process.exit(1);
