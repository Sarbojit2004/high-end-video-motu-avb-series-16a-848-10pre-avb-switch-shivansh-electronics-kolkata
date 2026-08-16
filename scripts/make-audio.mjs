// ─────────────────────────────────────────────────────────────────────────────
// Builds, per part, the two audio deliverables that are also embedded in the
// rendered reel:
//
//   1. music-bed-partN.mp3  — the SELECTED bed with its SELECTED stems, mixed
//      with per-chapter stem automation, exactly 178.000 s.
//   2. sfx-timeline-partN.mp3 — the transition SFX ONLY (music fully silent),
//      each placed at the exact frame it fires in the finished video, as ONE
//      file spanning the full 5,340-frame timeline. This is what allows the
//      loudness to be raised later without losing sync.
//
// Plus a silent VO placeholder slot.
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SFXSRC = path.resolve(ROOT, "sound-effects");
const SFXWAV = path.resolve(ROOT, "public", "audio", "sfx");
const OUT = path.resolve(ROOT, "public", "audio");
const VO = path.resolve(ROOT, "public", "vo");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(VO, { recursive: true });

const SCHEDULE = JSON.parse(fs.readFileSync(path.resolve(ROOT, "src", "schedule.json"), "utf8"));
const SR = 48000;
const FPS = SCHEDULE.fps;
const TOTAL_FRAMES = SCHEDULE.durationInFrames;
const TOTAL_SEC = TOTAL_FRAMES / FPS; // 178.000
const N = Math.round(TOTAL_SEC * SR);

const parts = process.argv.slice(2).filter((a) => /^[123]$/.test(a));
const TARGETS = parts.length ? parts : Object.keys(SCHEDULE.parts);

// ── io helpers ───────────────────────────────────────────────────────────────
function decodeStereo(file, seconds) {
  const tmp = path.join(os.tmpdir(), `mx-${Math.random().toString(36).slice(2)}.raw`);
  execFileSync(
    ffmpegPath,
    ["-i", file, "-t", String(seconds), "-ac", "2", "-ar", String(SR), "-f", "f32le", "-y", tmp],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  const buf = fs.readFileSync(tmp);
  fs.unlinkSync(tmp);
  const frames = Math.floor(buf.length / 8);
  const L = new Float32Array(N);
  const R = new Float32Array(N);
  for (let i = 0; i < Math.min(frames, N); i++) {
    L[i] = buf.readFloatLE(i * 8);
    R[i] = buf.readFloatLE(i * 8 + 4);
  }
  return { L, R, decoded: frames };
}

function readWav(file) {
  const b = fs.readFileSync(file);
  // minimal RIFF walk to find 'data'
  let off = 12;
  let fmt = null;
  while (off + 8 <= b.length) {
    const id = b.toString("ascii", off, off + 4);
    const size = b.readUInt32LE(off + 4);
    if (id === "fmt ") fmt = { ch: b.readUInt16LE(off + 10), sr: b.readUInt32LE(off + 12), bits: b.readUInt16LE(off + 22) };
    if (id === "data") {
      const ch = fmt.ch, bytes = fmt.bits / 8;
      const n = Math.floor(size / (ch * bytes));
      const L = new Float32Array(n), R = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const p = off + 8 + i * ch * bytes;
        L[i] = b.readInt16LE(p) / 32768;
        R[i] = ch > 1 ? b.readInt16LE(p + 2) / 32768 : L[i];
      }
      return { L, R, sr: fmt.sr };
    }
    off += 8 + size + (size % 2);
  }
  throw new Error(`no data chunk in ${file}`);
}

function writeWav(file, L, R) {
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
}

function toMp3(wav, mp3) {
  execFileSync(
    ffmpegPath,
    ["-i", wav, "-codec:a", "libmp3lame", "-b:a", "320k", "-ar", String(SR), "-y", mp3],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  fs.unlinkSync(wav);
}

/** piecewise-linear breakpoint envelope, sampled per audio frame */
function envelope(points) {
  const e = new Float32Array(N);
  let seg = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    while (seg < points.length - 2 && t > points[seg + 1][0]) seg++;
    const [t0, v0] = points[seg];
    const [t1, v1] = points[Math.min(seg + 1, points.length - 1)];
    e[i] = t1 === t0 ? v1 : v0 + ((v1 - v0) * Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));
  }
  return e;
}

const stemFile = (base, stem) => {
  // "ES_Mindscape - Lennon Hutton" → "ES_Mindscape STEMS BASS - Lennon Hutton.mp3"
  const [head, tail] = base.split(" - ");
  return path.join(SFXSRC, `${head} STEMS ${stem} - ${tail}.mp3`);
};

// ═════════════════════════════════════════════════════════════════════════════
for (const key of TARGETS) {
  const P = SCHEDULE.parts[key];
  if (!P) continue;
  console.log(`\n━━ PART ${key} — ${P.chapter} (${P.product}) ━━`);

  // ── 1. MUSIC BED (selected stems + per-chapter automation) ────────────────
  const bedL = new Float32Array(N);
  const bedR = new Float32Array(N);
  const usedStems = [];
  for (const [stem, pts] of Object.entries(P.stems)) {
    const f = stemFile(SCHEDULE.musicSource, stem);
    if (!fs.existsSync(f)) throw new Error(`missing stem: ${f}`);
    const { L, R, decoded } = decodeStereo(f, TOTAL_SEC);
    if (decoded < N) console.log(`   ! ${stem}: source shorter than timeline (${(decoded / SR).toFixed(1)}s)`);
    const env = envelope(pts);
    for (let i = 0; i < N; i++) { bedL[i] += L[i] * env[i]; bedR[i] += R[i] * env[i]; }
    usedStems.push(stem);
  }
  // headroom: the user raises loudness later to match the recorded VO, so the
  // bed is delivered peak-safe rather than pushed.
  let pk = 0;
  for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(bedL[i]), Math.abs(bedR[i]));
  const g = pk > 0 ? 0.72 / pk : 1;
  for (let i = 0; i < N; i++) { bedL[i] *= g; bedR[i] *= g; }
  // 1.2 s top & tail so nothing clicks in or out
  const fade = Math.round(1.2 * SR);
  for (let i = 0; i < fade; i++) {
    const k = i / fade;
    bedL[i] *= k; bedR[i] *= k;
    bedL[N - 1 - i] *= k; bedR[N - 1 - i] *= k;
  }

  const bedWav = path.join(OUT, `music-bed-${P.id}.wav`);
  const bedMp3 = path.join(OUT, `music-bed-${P.id}.mp3`);
  writeWav(bedWav, bedL, bedR);
  toMp3(bedWav, bedMp3);
  console.log(`   music bed  : ${path.basename(bedMp3)}  stems=[${usedStems.join("+")}]`);

  // ── 2. SFX TIMELINE (music silent; SFX at exact frame positions) ──────────
  const sfxL = new Float32Array(N);
  const sfxR = new Float32Array(N);
  const cache = {};
  const load = (cue) => (cache[cue] ||= readWav(path.join(SFXWAV, `${cue}.wav`)));

  const place = (cue, atFrame, gain, rate = 1) => {
    const s = load(cue);
    const start = Math.round((atFrame / FPS) * SR);
    const len = Math.floor(s.L.length / rate);
    for (let i = 0; i < len; i++) {
      const d = start + i;
      if (d >= N) break;
      // linear resample for rate variation so repeats aren't identical
      const sp = i * rate;
      const i0 = Math.floor(sp), fr = sp - i0, i1 = Math.min(i0 + 1, s.L.length - 1);
      sfxL[d] += (s.L[i0] * (1 - fr) + s.L[i1] * fr) * gain;
      sfxR[d] += (s.R[i0] * (1 - fr) + s.R[i1] * fr) * gain;
    }
  };

  for (const c of P.sfx) place(c.cue, c.at, c.gain, c.rate ?? 1);

  // ambient beds (looped, with equal-power edges so loops are inaudible)
  for (const a of P.ambient ?? []) {
    const s = load(a.cue);
    const start = Math.round((a.from / FPS) * SR);
    const end = Math.round((a.to / FPS) * SR);
    const ramp = Math.round(0.5 * SR);
    for (let d = start, i = 0; d < Math.min(end, N); d++, i++) {
      const k = i % s.L.length;
      let env = a.gain;
      if (i < ramp) env *= i / ramp;
      const rem = end - d;
      if (rem < ramp) env *= rem / ramp;
      sfxL[d] += s.L[k] * env;
      sfxR[d] += s.R[k] * env;
    }
  }

  let sp = 0;
  for (let i = 0; i < N; i++) sp = Math.max(sp, Math.abs(sfxL[i]), Math.abs(sfxR[i]));
  if (sp > 0.95) {
    const sg = 0.95 / sp;
    for (let i = 0; i < N; i++) { sfxL[i] *= sg; sfxR[i] *= sg; }
  }

  const sfxWav = path.join(OUT, `sfx-timeline-${P.id}.wav`);
  const sfxMp3 = path.join(OUT, `sfx-timeline-${P.id}.mp3`);
  writeWav(sfxWav, sfxL, sfxR);
  toMp3(sfxWav, sfxMp3);
  console.log(
    `   sfx timeline: ${path.basename(sfxMp3)}  cues=${P.sfx.length}  ambient=${(P.ambient ?? []).length}  peak=${sp.toFixed(3)}`
  );

  // ── 3. silent VO placeholder ──────────────────────────────────────────────
  const voMp3 = path.join(VO, `voiceover-reel-${P.id}.mp3`);
  execFileSync(
    ffmpegPath,
    ["-f", "lavfi", "-i", `anullsrc=r=${SR}:cl=stereo`, "-t", String(TOTAL_SEC),
     "-codec:a", "libmp3lame", "-b:a", "192k", "-y", voMp3],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  console.log(`   vo slot    : ${path.basename(voMp3)} (silent placeholder)`);

  // ── validate ──────────────────────────────────────────────────────────────
  for (const f of [bedMp3, sfxMp3, voMp3]) {
    const probe = execFileSync(
      ffmpegPath, ["-v", "error", "-i", f, "-f", "null", "-"],
      { stdio: ["ignore", "pipe", "pipe"] }
    ).toString();
    if (probe.trim()) throw new Error(`decode error in ${f}: ${probe}`);
  }
  console.log(`   validated  : bed + sfx-timeline + vo all decode cleanly`);
}
console.log("\ndone.");
