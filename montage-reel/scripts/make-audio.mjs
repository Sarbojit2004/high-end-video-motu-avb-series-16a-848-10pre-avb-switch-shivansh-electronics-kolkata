// ─────────────────────────────────────────────────────────────────────────────
// MUSIC BED + TRANSITION-SFX MASTER (brief header "Audio", §5, §9, TIMING_MAP.md)
//
//   1. cut the four high-energy sections out of the two supplied tracks
//   2. tempo-match each to the 89.52 BPM master grid (pitch-preserving atempo)
//   3. two-pass loudnorm every section to the same target (−10 LUFS / −1 dBTP)
//   4. butt-join them on the reel's beat grid with 12 ms crossfades
//   5. place one synthesized SFX per cut (from the shot list), peaks ON the beat
//   6. sum, look-ahead brick-wall limit, write public/audio/bed.wav + per-part slices
//
// ffmpeg (Remotion's bundled build) does the decode / atempo / loudnorm;
// the assembly, fades, SFX placement and limiter run in node on float PCM
// because that build ships without afade/alimiter.
//
// The two tracks are read from the repository root's sound-effects/ folder
// only because that is the sole place the user-supplied files exist in the
// repo; nothing else in that folder is referenced (see README "Audio").
// ─────────────────────────────────────────────────────────────────────────────
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ffmpeg, ffprobe } from "./ffmpeg.mjs";
import { FPS, SPB, TOTAL_FRAMES, MUSIC, PARTS, beatFrame, beatSeconds, ENDING_STOP_SECONDS } from "../src/data/grid.ts";
import { TIMELINE, LEAD } from "../src/data/timeline.ts";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(HERE, "..");
const REPO = path.resolve(PROJ, "..");
const AUDIO = path.join(PROJ, "public", "audio");
const WORK = path.join(AUDIO, ".work");
const SFX = path.join(AUDIO, "sfx");
fs.mkdirSync(WORK, { recursive: true });

const SRC = {
  danny: path.join(REPO, "sound-effects", "D A N N Y - TAKE ME.mp3"),
  ian: path.join(REPO, "sound-effects", "Ian Asher - Take Me (To The Moon) (Official Audio).mp3"),
};
for (const f of Object.values(SRC)) if (!fs.existsSync(f)) throw new Error(`missing music track: ${f}`);

const SR = 48000;
const TOTAL_S = TOTAL_FRAMES / FPS;
const N = Math.round(TOTAL_S * SR);
const TARGET_LUFS = -10; // "music-video loud" — the bed is the whole soundscape
const TP = -1.0;
const SFX_GAIN = 0.5; // −6 dB under the music
const CEILING = 0.78; // −2.2 dBFS sample peak; measured true peak of the finished bed is reported in bed-report.json
const run = (args) => execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: ["ignore", "pipe", "pipe"] });
const runStderr = (args) => spawnSync(ffmpeg, ["-hide_banner", "-y", ...args], { encoding: "utf8", maxBuffer: 1 << 26 }).stderr;
const dur = (f) => +execFileSync(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString();
/** Parse a 16-bit stereo PCM WAV (walks RIFF chunks, so ffmpeg's LIST chunks are fine). */
const readWav16 = (file) => {
  const b = fs.readFileSync(file);
  let o = 12, dataOff = -1, dataLen = 0, ch = 2;
  while (o + 8 <= b.length) {
    const id = b.toString("ascii", o, o + 4), len = b.readUInt32LE(o + 4);
    if (id === "fmt ") ch = b.readUInt16LE(o + 10);
    if (id === "data") { dataOff = o + 8; dataLen = Math.min(len, b.length - dataOff); break; }
    o += 8 + len + (len & 1);
  }
  if (dataOff < 0) throw new Error(`no data chunk in ${file}`);
  const n = Math.floor(dataLen / (2 * ch)), l = new Float32Array(n), r = new Float32Array(n);
  for (let i = 0; i < n; i++) { l[i] = b.readInt16LE(dataOff + i * 2 * ch) / 32768; r[i] = b.readInt16LE(dataOff + i * 2 * ch + (ch > 1 ? 2 : 0)) / 32768; }
  return [l, r];
};
/** Decode any input to 48 kHz stereo float via a 16-bit WAV (this ffmpeg build has no raw f32le muxer). */
const decodeStereo = (file) => { const tmp = path.join(WORK, `dec-${Math.random().toString(36).slice(2)}.wav`); run(["-i", file, "-ac", "2", "-ar", String(SR), "-c:a", "pcm_s16le", tmp]); const out = readWav16(tmp); fs.unlinkSync(tmp); return out; };

// ── 1–3. sections ────────────────────────────────────────────────────────────
const L = new Float32Array(N), R = new Float32Array(N);
const XF = Math.round(0.012 * SR);
const report = [];
for (const [i, m] of MUSIC.entries()) {
  const reelLen = beatSeconds(m.reelEndBeat - m.reelStartBeat);
  const stretch = m.srcSpb / SPB; // > 1 → source is slower → speed up
  const srcLen = Math.min(reelLen * stretch + 0.5, dur(SRC[m.track]) - m.srcStart);
  const raw = path.join(WORK, `sec${i}-raw.wav`);
  run(["-ss", m.srcStart.toFixed(4), "-t", srcLen.toFixed(4), "-i", SRC[m.track], "-af", `atempo=${stretch.toFixed(6)}`, "-ar", String(SR), "-ac", "2", raw]);
  const meas = JSON.parse((runStderr(["-i", raw, "-af", `loudnorm=I=${TARGET_LUFS}:TP=${TP}:LRA=11:print_format=json`, "-f", "null", "-"]).match(/\{[\s\S]*\}/) ?? ["{}"])[0]);
  const out = path.join(WORK, `sec${i}.wav`);
  const ln = meas.input_i
    ? `loudnorm=I=${TARGET_LUFS}:TP=${TP}:LRA=11:measured_I=${meas.input_i}:measured_TP=${meas.input_tp}:measured_LRA=${meas.input_lra}:measured_thresh=${meas.input_thresh}:offset=${meas.target_offset}:linear=true`
    : `loudnorm=I=${TARGET_LUFS}:TP=${TP}:LRA=11`;
  run(["-i", raw, "-af", `${ln},aresample=${SR}`, "-ar", String(SR), out]);
  const [pl, pr] = decodeStereo(out);
  const start = Math.round(beatSeconds(m.reelStartBeat) * SR);
  const len = Math.min(Math.round(reelLen * SR), pl.length, N - start);
  const isFirst = i === 0, isLast = i === MUSIC.length - 1;
  for (let k = 0; k < len; k++) {
    let g = 1;
    if (!isFirst && k < XF) g = k / XF;
    if (!isLast && k > len - XF) g = Math.min(g, (len - k) / XF);
    L[start + k] += pl[k] * g; R[start + k] += pr[k] * g;
  }
  report.push({ section: i, track: m.track, srcStart: m.srcStart, stretch: +stretch.toFixed(5), reelStart: +beatSeconds(m.reelStartBeat).toFixed(3), length: +(len / SR).toFixed(3), measured: meas.input_i ? { lufs: +(+meas.input_i).toFixed(2), tp: +(+meas.input_tp).toFixed(2), lra: +(+meas.input_lra).toFixed(2) } : null });
  console.log(`section ${i} ${m.track.padEnd(5)} src ${m.srcStart.toFixed(3)}s ×${stretch.toFixed(5)} → reel ${beatSeconds(m.reelStartBeat).toFixed(3)}s +${(len / SR).toFixed(3)}s  source ${meas.input_i ? `${(+meas.input_i).toFixed(1)} LUFS / ${(+meas.input_tp).toFixed(1)} dBTP` : "n/a"} → ${TARGET_LUFS} LUFS`);
}
// the Danny ending: keep its natural hard stop, just kill any residual tail after it
{ const stop = Math.round((ENDING_STOP_SECONDS + 0.9) * SR); for (let k = stop; k < N; k++) { const g = Math.max(0, 1 - (k - stop) / (0.3 * SR)); L[k] *= g; R[k] *= g; } }

// ── 5. SFX events from the cut list ──────────────────────────────────────────
const sfxDur = JSON.parse(fs.readFileSync(path.join(SFX, "manifest.json"), "utf8"));
const sfxPcm = Object.fromEntries(Object.keys(sfxDur).map((k) => [k, readWav16(path.join(SFX, `${k}.wav`))]));
/** events: [name, startTime(s), gain]. Impacts/pops/ticks START on the beat; whooshes/sweeps/risers END on the beat. */
const events = [];
const beatT = (frame) => frame / FPS;
for (const c of TIMELINE.cuts) {
  const t = beatT(c.frame);
  if (c.kind === "cold" || c.kind === "brand") continue;
  if (c.actOpen) events.push(["riser", t - sfxDur.riser, 0.9], ["impact", t, 1.0]);
  switch (c.transition) {
    case "hard": events.push(["impact", t, c.kind === "single" && !c.actOpen ? 0.55 : 0.8]); break;
    case "glitch": events.push(["glitch", t - LEAD.glitch / FPS, 0.9], ["impact", t, 0.7]); break;
    case "whip": events.push(["whoosh", t - sfxDur.whoosh * 0.85, 0.9], ["pop", t, 0.5]); break;
    case "line": events.push(["sweep", t - sfxDur.sweep + 0.02, 0.8], ["tick", t, 0.6]); break;
    case "punch": events.push(["impact", t, 0.85], ["pop", t, 0.4]); break;
    case "flash": events.push(["pop", t - 1 / FPS, 0.9], ["impact", t, 0.6]); break;
  }
}
for (let b = 0; b < 9; b++) events.push(["tick", beatT(beatFrame(b)), b % 4 === 0 ? 0.8 : 0.45]); // Act 0 clock edges
events.push(["riser", beatT(beatFrame(9)) - sfxDur.riser, 1.0]);
events.push(["tick", ENDING_STOP_SECONDS, 0.5]); // Act V settle
events.sort((a, b) => a[1] - b[1]);
fs.writeFileSync(path.join(AUDIO, "sfx-events.json"), JSON.stringify(events.map(([n, t, g]) => ({ sfx: n, t: +t.toFixed(4), gain: g })), null, 1));
const SL = new Float32Array(N), SRr = new Float32Array(N);
for (const [name, t, gain] of events) {
  const [l, r] = sfxPcm[name]; const s0 = Math.round(t * SR);
  for (let k = 0; k < l.length; k++) { const i = s0 + k; if (i < 0 || i >= N) continue; SL[i] += l[k] * gain; SRr[i] += r[k] * gain; }
}

// ── 6. master: music + SFX, look-ahead brick-wall limiter at −1 dBFS ─────────
const ML = new Float32Array(N), MR = new Float32Array(N);
for (let i = 0; i < N; i++) { ML[i] = L[i] + SL[i] * SFX_GAIN; MR[i] = R[i] + SRr[i] * SFX_GAIN; }
function limiter(l, r, ceiling, lookahead = Math.round(0.002 * SR), release = 0.08) {
  const n = l.length, gain = new Float32Array(n).fill(1);
  // required gain per sample, spread back over the look-ahead window (min hold)
  const need = new Float32Array(n);
  for (let i = 0; i < n; i++) { const p = Math.max(Math.abs(l[i]), Math.abs(r[i])); need[i] = p > ceiling ? ceiling / p : 1; }
  let g = 1; const rel = Math.exp(-1 / (release * SR));
  for (let i = 0; i < n; i++) {
    let m = 1; for (let k = 0; k <= lookahead && i + k < n; k++) m = Math.min(m, need[i + k]);
    g = m < g ? m : m + (g - m) * rel; // instant attack (via look-ahead), smooth release
    gain[i] = g;
  }
  const oL = new Float32Array(n), oR = new Float32Array(n);
  for (let i = 0; i < n; i++) { oL[i] = Math.max(-1, Math.min(1, l[i] * gain[i])); oR[i] = Math.max(-1, Math.min(1, r[i] * gain[i])); }
  return [oL, oR];
}
const [BL, BR] = limiter(ML, MR, CEILING);
const writeWav = (file, l, r, from = 0, to = l.length) => {
  const n = to - from, buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12); buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0, o = 44; i < n; i++, o += 4) { buf.writeInt16LE(Math.round(l[from + i] * 32767), o); buf.writeInt16LE(Math.round(r[from + i] * 32767), o + 2); }
  fs.writeFileSync(file, buf);
};
const bedWav = path.join(AUDIO, "bed.wav");
writeWav(bedWav, BL, BR);
writeWav(path.join(AUDIO, "music-only.wav"), ...limiter(L, R, CEILING));
writeWav(path.join(AUDIO, "sfx-timeline.wav"), ...limiter(SL, SRr, CEILING));
for (const p of PARTS) writeWav(path.join(AUDIO, `${p.file}-bed.wav`), BL, BR, Math.round((beatFrame(p.startBeat) / FPS) * SR), Math.round((beatFrame(p.endBeat) / FPS) * SR));

const stats = JSON.parse((runStderr(["-i", bedWav, "-af", "loudnorm=print_format=json", "-f", "null", "-"]).match(/\{[\s\S]*\}/) ?? ["{}"])[0]);
console.log(`bed: ${bedWav}  ${dur(bedWav).toFixed(3)} s  integrated ${(+stats.input_i).toFixed(1)} LUFS  true-peak ${(+stats.input_tp).toFixed(1)} dBTP  LRA ${(+stats.input_lra).toFixed(1)}`);
console.log(`sfx events: ${events.length}   music sections: ${MUSIC.length}   parts: ${PARTS.map((p) => p.file).join(", ")}`);
fs.writeFileSync(path.join(AUDIO, "bed-report.json"), JSON.stringify({ target: { lufs: TARGET_LUFS, truePeak: TP }, sections: report, master: { lufs: +(+stats.input_i).toFixed(2), truePeak: +(+stats.input_tp).toFixed(2), lra: +(+stats.input_lra).toFixed(2) }, sfxEvents: events.length }, null, 2));
fs.rmSync(WORK, { recursive: true, force: true });
