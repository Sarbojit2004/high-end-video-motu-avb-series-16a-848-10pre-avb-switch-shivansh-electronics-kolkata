// Analyse the supplied music beds: tempo, onset density, band balance and
// dynamics, so the bed choice is made on the actual audio, not the filename.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SFX = path.resolve(__dirname, "..", "sound-effects");
const SR = 22050;

const TRACKS = [
  "ES_Black & Blue (Instrumental Version) - Torii Wolf",
  "ES_DIABLO - BLUE STEEL",
  "ES_ETERNITY - BLUE STEEL",
  "ES_GIFTED (Instrumental Version) - Bhris Drip",
  "ES_Mindscape - Lennon Hutton",
];

function decode(file, start, dur) {
  const tmp = path.join(os.tmpdir(), `dec-${Date.now()}-${Math.random().toString(36).slice(2)}.raw`);
  execFileSync(
    ffmpegPath,
    ["-ss", String(start), "-t", String(dur), "-i", file, "-ac", "1", "-ar", String(SR),
     "-f", "f32le", "-y", tmp],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  const buf = fs.readFileSync(tmp);
  fs.unlinkSync(tmp);
  const n = Math.floor(buf.length / 4);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = buf.readFloatLE(i * 4);
  return out;
}

// simple one-pole band split energies
function bands(x) {
  let lo = 0, mid = 0, prev = 0;
  let eLo = 0, eMid = 0, eHi = 0;
  const aLo = Math.exp((-2 * Math.PI * 200) / SR);
  const aMid = Math.exp((-2 * Math.PI * 2000) / SR);
  for (let i = 0; i < x.length; i++) {
    lo = aLo * lo + (1 - aLo) * x[i];
    mid = aMid * mid + (1 - aMid) * x[i];
    const hi = x[i] - mid;
    const md = mid - lo;
    eLo += lo * lo; eMid += md * md; eHi += hi * hi;
    prev = x[i];
  }
  const t = eLo + eMid + eHi || 1;
  return { lo: eLo / t, mid: eMid / t, hi: eHi / t };
}

// RMS envelope + onset (positive spectral-flux-ish) density
function envelope(x, hop = 512) {
  const env = [];
  for (let i = 0; i + hop <= x.length; i += hop) {
    let s = 0;
    for (let j = 0; j < hop; j++) s += x[i + j] * x[i + j];
    env.push(Math.sqrt(s / hop));
  }
  return env;
}

function analyse(name) {
  const file = path.join(SFX, `${name}.mp3`);
  const x = decode(file, 45, 40); // 40s from a settled part of the track
  const b = bands(x);
  const env = envelope(x);
  const hopRate = SR / 512;

  const mean = env.reduce((a, c) => a + c, 0) / env.length;
  const sd = Math.sqrt(env.reduce((a, c) => a + (c - mean) ** 2, 0) / env.length);
  const crest = Math.max(...env) / (mean || 1);

  // onsets: rising edges above a local threshold
  let onsets = 0;
  for (let i = 1; i < env.length; i++) {
    if (env[i] > mean * 1.35 && env[i] > env[i - 1] * 1.3) onsets++;
  }
  const onsetsPerSec = onsets / (env.length / hopRate);

  // crude tempo: autocorrelation of the (mean-removed) envelope, 60-180 bpm
  const e = env.map((v) => v - mean);
  let best = 0, bestLag = 0;
  const minLag = Math.round((60 / 180) * hopRate);
  const maxLag = Math.round((60 / 60) * hopRate);
  for (let lag = minLag; lag <= maxLag; lag++) {
    let s = 0;
    for (let i = 0; i + lag < e.length; i++) s += e[i] * e[i + lag];
    s /= e.length - lag;
    if (s > best) { best = s; bestLag = lag; }
  }
  const bpm = bestLag ? (60 * hopRate) / bestLag : 0;

  const stems = fs
    .readdirSync(SFX)
    .filter((f) => f.includes("STEMS") && f.includes(name.split(" - ")[1] || ""))
    .filter((f) => f.startsWith(name.split(" (")[0].split(" - ")[0]))
    .map((f) => (f.match(/STEMS (\w+)/) || [])[1])
    .filter(Boolean);

  return {
    name,
    bpm: bpm.toFixed(1),
    onsetsPerSec: onsetsPerSec.toFixed(2),
    crest: crest.toFixed(2),
    dynamism: (sd / (mean || 1)).toFixed(3),
    lo: (b.lo * 100).toFixed(1),
    mid: (b.mid * 100).toFixed(1),
    hi: (b.hi * 100).toFixed(1),
    stems: stems.join("+"),
  };
}

console.log(
  ["track", "bpm", "onset/s", "crest", "dyn", "low%", "mid%", "high%", "stems"].join("\t")
);
for (const t of TRACKS) {
  const r = analyse(t);
  console.log(
    [r.name.slice(0, 34), r.bpm, r.onsetsPerSec, r.crest, r.dynamism, r.lo, r.mid, r.hi, r.stems].join("\t")
  );
}
