// Section 10a Layer 2 — transition/foley palette, synthesized here from raw
// PCM. Nothing is sourced from ElevenLabs or any other external audio service,
// and nothing is taken from the toolkit's bundled SFX tooling.
//
// REEL VARIANT: at reel cadence a transition fires roughly every 6-9 s and
// accents land between them, so a 15-sound palette would start to repeat
// audibly inside a single 178 s reel — let alone across three. This build
// synthesizes 21, adding pitch/character variants of the tactile and network
// families so no two adjacent beats reach for the same file.
//
// Design constraints, straight from Brief Stage 11:
//   * NO large cinematic low-frequency whooshes — they muddy the music bed.
//     Every element here is high-passed at 900 Hz or above.
//   * Tactile: aluminium encoder detents, the RJ-45 lock snap, the 848's
//     talkback button, relay ticks.
//   * Digital/network: resonant AVB handshake pings, gPTP sync chimes, a
//     high-frequency data-stream texture for the topology animations.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../public/audio/sfx");
mkdirSync(OUT, { recursive: true });

const SR = 48000;

// ---------------------------------------------------------------- primitives
const buf = (sec) => new Float32Array(Math.round(SR * sec));

/** Exponential decay envelope. */
const decay = (i, n, tau) => Math.exp((-i / n) * tau);

/** Raised-cosine fade so nothing starts or ends on a discontinuity. */
function deClick(x, ms = 3) {
  const n = Math.min(Math.round((ms / 1000) * SR), Math.floor(x.length / 2));
  for (let i = 0; i < n; i++) {
    const g = 0.5 - 0.5 * Math.cos((Math.PI * i) / n);
    x[i] *= g;
    x[x.length - 1 - i] *= g;
  }
  return x;
}

/** Transposed-direct-form-II biquad. */
function biquad(x, b0, b1, b2, a1, a2) {
  let z1 = 0, z2 = 0;
  const y = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    const out = b0 * x[i] + z1;
    z1 = b1 * x[i] - a1 * out + z2;
    z2 = b2 * x[i] - a2 * out;
    y[i] = out;
  }
  return y;
}

function hp(x, f, q = 0.707) {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
  const a0 = 1 + a;
  return biquad(x, (1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0, (-2 * c) / a0, (1 - a) / a0);
}
function bp(x, f, q = 4) {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
  const a0 = 1 + a;
  return biquad(x, a / a0, 0, -a / a0, (-2 * c) / a0, (1 - a) / a0);
}
function lp(x, f, q = 0.707) {
  const w = (2 * Math.PI * f) / SR, a = Math.sin(w) / (2 * q), c = Math.cos(w);
  const a0 = 1 + a;
  return biquad(x, (1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0, (-2 * c) / a0, (1 - a) / a0);
}

/** Deterministic PRNG so every build produces byte-identical SFX. */
function rng(seed) {
  let s = seed >>> 0;
  return () => (((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1);
}

function noise(sec, seed) {
  const x = buf(sec), r = rng(seed);
  for (let i = 0; i < x.length; i++) x[i] = r();
  return x;
}

/** Damped sine partial — the body of every metallic/resonant element. */
function partial(x, freq, tau, amp, phase = 0) {
  for (let i = 0; i < x.length; i++) {
    x[i] += amp * Math.sin((2 * Math.PI * freq * i) / SR + phase) * decay(i, x.length, tau);
  }
  return x;
}

function mix(target, src, gain = 1, offsetSec = 0) {
  const off = Math.round(offsetSec * SR);
  for (let i = 0; i < src.length; i++) {
    const j = i + off;
    if (j >= 0 && j < target.length) target[j] += src[i] * gain;
  }
  return target;
}

function normalize(x, peak = 0.9) {
  let m = 0;
  for (const v of x) m = Math.max(m, Math.abs(v));
  if (m > 0) for (let i = 0; i < x.length; i++) x[i] = (x[i] / m) * peak;
  return x;
}

/** 48 kHz / 16-bit / stereo WAV. */
function writeWav(name, mono, width = 0.12) {
  const n = mono.length;
  const data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    // Tiny inter-channel delay for a hint of stereo width without phase damage.
    const d = Math.max(0, i - Math.round(width * 0.001 * SR));
    const l = Math.max(-1, Math.min(1, mono[i]));
    const r = Math.max(-1, Math.min(1, mono[d]));
    data.writeInt16LE((l * 32767) | 0, i * 4);
    data.writeInt16LE((r * 32767) | 0, i * 4 + 2);
  }
  const head = Buffer.alloc(44);
  head.write("RIFF", 0);
  head.writeUInt32LE(36 + data.length, 4);
  head.write("WAVE", 8);
  head.write("fmt ", 12);
  head.writeUInt32LE(16, 16);
  head.writeUInt16LE(1, 20);
  head.writeUInt16LE(2, 22);
  head.writeUInt32LE(SR, 24);
  head.writeUInt32LE(SR * 4, 28);
  head.writeUInt16LE(4, 32);
  head.writeUInt16LE(16, 34);
  head.write("data", 36);
  head.writeUInt32LE(data.length, 40);
  writeFileSync(resolve(OUT, `${name}.wav`), Buffer.concat([head, data]));
  return { name, samples: n, sec: +(n / SR).toFixed(3) };
}

// ------------------------------------------------------------------- tactile
/** Aluminium encoder detent: hard transient + short metallic ring. */
function encoderDetent(seed = 11, f = 3100) {
  let x = buf(0.075);
  const tick = hp(noise(0.008, seed), 2400);
  mix(x, tick, 0.55);
  partial(x, f, 22, 0.30);
  partial(x, f * 1.61, 26, 0.16);
  partial(x, f * 2.42, 30, 0.08);
  return deClick(normalize(hp(x, 1200), 0.82), 1.5);
}

/** Several detents in sequence — a knob being turned. */
function encoderTurn() {
  const x = buf(0.62);
  const steps = [0, 0.085, 0.163, 0.246, 0.318, 0.402, 0.474];
  steps.forEach((t, i) => mix(x, encoderDetent(31 + i * 7, 3000 + i * 55), 0.62 - i * 0.05, t));
  return deClick(normalize(x, 0.8), 2);
}

/** RJ-45 lock: plastic click, then the small sprung latch seating. */
function rj45Snap(gain = 1) {
  const x = buf(0.20);
  mix(x, deClick(normalize(hp(noise(0.010, 77), 1800), 0.9), 1), 0.85 * gain, 0);
  const latch = buf(0.10);
  partial(latch, 1750, 18, 0.5);
  partial(latch, 2680, 22, 0.28);
  partial(latch, 4300, 26, 0.12);
  mix(x, deClick(latch, 1), 0.8, 0.036);
  return deClick(normalize(hp(x, 1000), 0.86), 2);
}

/**
 * The 848's front-panel talkback switch — softer and rubberised relative to the
 * encoder, but still sitting well clear of the bed. Partials start at 1.45 kHz
 * so the whole element survives the 900 Hz floor with margin.
 */
function talkbackEngage() {
  const x = buf(0.16);
  mix(x, deClick(normalize(bp(noise(0.012, 133), 2100, 2.0), 0.8), 1.5), 0.7, 0);
  const body = buf(0.11);
  partial(body, 1450, 20, 0.45);
  partial(body, 2320, 24, 0.22);
  partial(body, 3480, 28, 0.09);
  mix(x, deClick(body, 1.5), 0.75, 0.018);
  return deClick(normalize(hp(hp(x, 1150), 1150), 0.78), 2);
}

/** Very short relay/logic tick for counters and micro-callouts. */
function relayTick(seed = 205, f = 5200) {
  const x = buf(0.030);
  mix(x, hp(noise(0.004, seed), 3200), 0.5);
  partial(x, f, 26, 0.34);
  return deClick(normalize(hp(x, 2000), 0.7), 1);
}

/** Rack ear seating against a rail — metallic, and kept clear of the bed. */
function rackSeat() {
  const x = buf(0.34);
  mix(x, deClick(normalize(bp(noise(0.016, 401), 2800, 2.0), 0.85), 1.5), 0.6, 0);
  partial(x, 1720, 12, 0.34);
  partial(x, 2740, 15, 0.22);
  partial(x, 4370, 19, 0.13);
  partial(x, 6180, 24, 0.07);
  return deClick(normalize(hp(hp(x, 1250), 1250), 0.8), 2);
}

// ----------------------------------------------------------- digital/network
/** AVB handshake confirmation ping — clean, resonant, bell-like. */
function avbPing(f, seed = 900) {
  const x = buf(0.55);
  partial(x, f, 7.5, 0.62);
  partial(x, f * 2.0, 10, 0.20);
  partial(x, f * 3.01, 13, 0.09);
  partial(x, f * 4.2, 17, 0.04);
  mix(x, hp(noise(0.005, seed), 5000), 0.16); // attack sparkle
  return deClick(normalize(hp(x, 900), 0.72), 3);
}

/**
 * gPTP nanosecond-sync chime — two clean partials locking to an interval.
 * `root` and `ratio` are parameters so the master reel can carry two genuinely
 * different lock tones: the default rising fifth, and a settling fourth used
 * where the network is being confirmed rather than negotiated. Passing no
 * arguments reproduces the three-part reels' tone exactly.
 */
function gptpSync(root = 1568, ratio = 1.4983, tailRatio = 2) {
  const x = buf(0.95);
  partial(x, root, 6.0, 0.5);
  mix(x, (() => { const y = buf(0.8); partial(y, root * ratio, 6.5, 0.42); return deClick(y, 3); })(), 1, 0.10);
  partial(x, root * tailRatio, 9, 0.14);
  return deClick(normalize(hp(x, 1000), 0.68), 4);
}

/** Airy high-frequency data-stream texture for the topology animations. */
function dataStream(sec = 1.6) {
  let x = noise(sec, 555);
  x = bp(x, 6200, 1.1);
  x = hp(x, 3000);
  const n = x.length;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    // swell in, hold, fall away
    const env = Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 1.6;
    // shimmer so it reads as moving data, not static hiss
    const shimmer = 1 + 0.35 * Math.sin((2 * Math.PI * 7.3 * i) / SR) * Math.sin((2 * Math.PI * 2.1 * i) / SR);
    x[i] *= env * shimmer;
  }
  return deClick(normalize(x, 0.5), 30);
}

/** Rising three-note blip — a device joining the network. */
function linkEstablish() {
  const x = buf(0.5);
  [1318, 1760, 2637].forEach((f, i) => {
    const y = buf(0.26);
    partial(y, f, 11, 0.5);
    partial(y, f * 2, 15, 0.14);
    mix(x, deClick(y, 2), 0.8 + i * 0.06, i * 0.062);
  });
  return deClick(normalize(hp(x, 1000), 0.7), 3);
}

/**
 * Panel move — deliberately NOT a whoosh. Band-limited air 3–9 kHz, very
 * short, so it marks a transition without occupying the bed's register.
 */
function panelAir(sec = 0.42, seed = 616) {
  let x = noise(sec, seed);
  x = bp(x, 5200, 0.9);
  x = hp(x, 2600);
  const n = x.length;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    x[i] *= Math.sin(Math.PI * t) ** 2.2 * (0.6 + 0.4 * t);
  }
  return deClick(normalize(x, 0.42), 12);
}

// --------------------------------------------------------------------- build
const built = [
  writeWav("encoder-detent", encoderDetent()),
  writeWav("encoder-detent-hi", encoderDetent(53, 3900)),
  writeWav("encoder-detent-lo", encoderDetent(97, 2450)),
  writeWav("relay-tick-hi", relayTick(419, 7300)),
  writeWav("rj45-snap-soft", rj45Snap(0.62)),
  writeWav("avb-ping-top", avbPing(2637, 903)),
  writeWav("encoder-turn", encoderTurn()),
  writeWav("rj45-snap", rj45Snap()),
  writeWav("talkback-engage", talkbackEngage()),
  writeWav("relay-tick", relayTick()),
  writeWav("counter-tick", relayTick(311, 6400)),
  writeWav("rack-seat", rackSeat()),
  writeWav("avb-ping-hi", avbPing(2093)),
  writeWav("avb-ping-mid", avbPing(1568, 901)),
  writeWav("avb-ping-lo", avbPing(1046, 902)),
  writeWav("gptp-sync", gptpSync()),
  writeWav("data-stream", dataStream()),
  writeWav("data-stream-short", dataStream(0.7)),
  writeWav("link-establish", linkEstablish()),
  writeWav("panel-air", panelAir()),
  writeWav("panel-air-soft", panelAir(0.52, 717)),

  // ── MASTER-REEL EXTENSION ────────────────────────────────────────────────
  // The three-part reels needed 21 voices for 178 s; the 298 s master reel
  // widened that to 28. Every addition is a new pitch or a new envelope built
  // from the same primitives, so the character is unchanged and the sub-400 Hz
  // constraint still holds for all of them.
  writeWav("encoder-detent-top", encoderDetent(151, 4700)),
  writeWav("relay-tick-lo", relayTick(163, 4300)),
  writeWav("counter-tick-hi", relayTick(577, 8100)),
  writeWav("avb-ping-alt", avbPing(1318, 907)),
  writeWav("gptp-lock", gptpSync(1175, 1.3348, 2.67)),
  writeWav("data-stream-long", dataStream(2.4)),
  writeWav("panel-air-hi", panelAir(0.34, 941)),

  // ── COMPRESSED-REEL EXTENSION ────────────────────────────────────────────
  // Density, not duration, is what forces this. The master reel placed 118
  // sounds across 298 s (0.40/s); this reel places a comparable number across
  // 88 s, roughly double the rate. A palette that never repeats inside 298 s
  // will absolutely repeat inside 88 s at twice the firing rate, so six more
  // voices are added — 34 in total, the widest in the pipeline.
  writeWav("encoder-detent-mid", encoderDetent(211, 3500)),
  writeWav("relay-tick-top", relayTick(733, 9200)),
  writeWav("counter-tick-lo", relayTick(281, 5000)),
  writeWav("avb-ping-warm", avbPing(880, 911)),
  writeWav("gptp-drift", gptpSync(1976, 1.2599, 3.17)),
  writeWav("panel-air-tight", panelAir(0.26, 1103)),
];

console.log(`sfx: ${built.length} files synthesized -> public/audio/sfx/`);
for (const b of built) console.log(`   ${b.name.padEnd(18)} ${b.sec}s  ${b.samples} samples`);
