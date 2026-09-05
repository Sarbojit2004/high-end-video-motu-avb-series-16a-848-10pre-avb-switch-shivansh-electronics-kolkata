#!/usr/bin/env python3
"""Beat-grid + energy analysis of the two supplied music tracks (brief §5 / §10 step 3).

Consolidated single pass. Writes public/audio/analysis/{energy,sections}.json.
Requires: librosa, numpy (pip install librosa). ffmpeg is taken from Remotion's
compositor package (same binary scripts/make-audio.mjs uses).

Method
  * decode → 22.05 kHz mono
  * 4-s RMS + onset-density profile of each whole track (energy.json) — this is
    what picked the highest-energy sections listed in TIMING_MAP.md
  * per candidate section: grid-search tempo (0.02 BPM steps) and phase (5 ms)
    maximising onset strength + low-band (35–140 Hz) kick flux sampled on the
    grid; downbeat phase = the beat-in-bar with the strongest kick flux.
    (Plain beat trackers locked onto off-beats in the Danny sections; kick flux
    disambiguates — the drop downbeats coincide with the strongest transients.)
"""
import json, os, subprocess, sys, tempfile
import numpy as np, librosa

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
REPO = os.path.dirname(PROJ)
OUT = os.path.join(PROJ, "public", "audio", "analysis")
os.makedirs(OUT, exist_ok=True)
FFMPEG = os.path.join(PROJ, "node_modules", "@remotion", "compositor-linux-x64-gnu", "ffmpeg")
TRACKS = {
    "danny": os.path.join(REPO, "sound-effects", "D A N N Y - TAKE ME.mp3"),
    "ian": os.path.join(REPO, "sound-effects", "Ian Asher - Take Me (To The Moon) (Official Audio).mp3"),
}
# candidate high-energy sections (from the 4-s energy pass), search bands
SECTIONS = {
    "dannyA": ("danny", 18.0, 47.0, 88.5, 90.5),
    "dannyB": ("danny", 46.0, 66.0, 88.5, 90.5),
    "dannyC": ("danny", 65.0, 86.0, 88.5, 90.5),
    "dannyD": ("danny", 109.0, 128.0, 88.5, 91.0),
    "ianA": ("ian", 23.0, 47.0, 86.0, 88.5),
    "ianB": ("ian", 67.0, 91.0, 86.0, 88.5),
    "ianC": ("ian", 133.0, 156.0, 86.0, 88.5),
}
HOP = 256
SR = 22050

def decode(path):
    tmp = tempfile.mktemp(suffix=".wav")
    subprocess.run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-i", path, "-ac", "1", "-ar", str(SR), tmp], check=True)
    y, sr = librosa.load(tmp, sr=SR, mono=True)
    os.unlink(tmp)
    return y, sr

def features(y, sr):
    oe = librosa.onset.onset_strength(y=y, sr=sr, hop_length=HOP)
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=HOP)); fr = librosa.fft_frequencies(sr=sr, n_fft=2048)
    low = S[(fr >= 35) & (fr <= 140)].mean(0); lf = np.maximum(0, np.diff(low, prepend=low[0]))
    lf = lf / (lf.max() + 1e-9) * oe.max()
    return oe, lf

def energy_profile(y, sr, win=4.0):
    rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
    oe = librosa.onset.onset_strength(y=y, sr=sr, hop_length=512, aggregate=np.median)
    t = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=512)
    out = []
    for i in range(int(len(y) / sr // win)):
        m = (t >= i * win) & (t < (i + 1) * win)
        out.append({"t": i * win, "rms": round(float(np.sqrt(np.mean(rms[m] ** 2))), 4), "onset": round(float(np.mean(oe[m])), 3)})
    return out

def score(env, sr, t0, spb, a, b):
    ts = t0 + np.arange(0, int((b - a) / spb) + 1) * spb; ts = ts[(ts >= a) & (ts < b)]
    idx = np.round(ts * sr / HOP).astype(int); idx = idx[(idx > 0) & (idx < len(env) - 1)]
    return float(np.mean(np.maximum.reduce([env[idx - 1], env[idx], env[idx + 1]]))), ts

def search(oe, lf, sr, a, b, lo, hi):
    env = oe + lf; best = None
    for bpm in np.arange(lo, hi, 0.02):
        spb = 60 / bpm
        for ph in np.arange(0, spb, 0.005):
            s, _ = score(env, sr, a + ph, spb, a, b)
            if best is None or s > best[0]: best = (s, bpm, a + ph)
    s, bpm, t0 = best; spb = 60 / bpm
    for ph in np.arange(-0.01, 0.01, 0.001):
        s2, _ = score(env, sr, t0 + ph, spb, a, b)
        if s2 > s: s, t0 = s2, t0 + ph
    _, beats = score(env, sr, t0, spb, a, b)
    idx = np.round(beats * sr / HOP).astype(int)
    lb = np.array([lf[i - 1:i + 2].max() for i in idx]); ob = np.array([env[i - 1:i + 2].max() for i in idx])
    # downbeat = beat-in-bar with the strongest kick flux ON the beat vs the half-beat
    ph_scores = []
    for p in range(4):
        on = lb[p::4].mean(); half_idx = np.round((beats[p::4] + spb / 2) * sr / HOP).astype(int)
        half = np.mean([lf[i - 1:i + 2].max() for i in half_idx if i < len(lf) - 1])
        ph_scores.append(float(on * 1.5 + ob[p::4].mean() - half))
    dp = int(np.argmax(ph_scores))
    base = float(np.mean(env[int(a * sr / HOP):int(b * sr / HOP)]))
    return {"bpm": round(float(bpm), 3), "spb": round(float(spb), 6), "t0": round(float(t0), 4), "onGridRatio": round(s / base, 2),
            "downbeatPhase": dp, "downbeats": [round(float(x), 3) for x in beats[dp::4]], "phaseScores": [round(x, 2) for x in ph_scores]}

def half_beat_check(oe, lf, sr, downbeat, spb, bars=8):
    """Kick flux on the proposed beats vs. on the half-beats — guards against off-beat lock."""
    beats = downbeat + np.arange(0, bars * 4) * spb
    at = lambda arr, t: arr[max(0, int(round(t * sr / HOP)) - 1):int(round(t * sr / HOP)) + 2].max()
    on = float(np.mean([at(lf, t) for t in beats])); half = float(np.mean([at(lf, t + spb / 2) for t in beats]))
    return {"kickFluxOnBeat": round(on, 3), "kickFluxHalfBeat": round(half, 3)}

energy, sections, feats = {}, {}, {}
for name, path in TRACKS.items():
    y, sr = decode(path)
    feats[name] = (y, sr, *features(y, sr))
    energy[name] = {"duration": round(len(y) / sr, 3), "profile4s": energy_profile(y, sr)}
    print(f"{name}: {len(y)/sr:.2f} s")
for key, (track, a, b, lo, hi) in SECTIONS.items():
    y, sr, oe, lf = feats[track]
    r = search(oe, lf, sr, a, b, lo, hi)
    r.update({"track": track, "range": [a, b]})
    # the strongest transient in the section start window — a drop's first hit
    # the strongest transient around the section's third downbeat (± 1 beat) — a
    # drop's first hit; used to cross-check the downbeat phase
    env = oe + lf; c = r["downbeats"][2] if len(r["downbeats"]) > 2 else r["downbeats"][0]
    w0, w1 = int((c - r["spb"]) * sr / HOP), int((c + r["spb"]) * sr / HOP)
    r["strongestHit"] = round((w0 + int(np.argmax(env[w0:w1]))) * HOP / sr, 3)
    sections[key] = r
    print(f"{key}: {r['bpm']} bpm  downbeats {r['downbeats'][:3]} …  strongest hit {r['strongestHit']}  on-grid×{r['onGridRatio']}")

# Danny A: the tracker-found grid and the strongest-hit grid differ by half a
# beat; decide by kick flux (the drop hit at ~25.51 s is the true downbeat).
y, sr, oe, lf = feats["danny"]
sections["dannyA"]["halfBeatCheck"] = {
    "gridDownbeat": half_beat_check(oe, lf, sr, sections["dannyA"]["downbeats"][2], sections["dannyA"]["spb"]),
    "strongestHit": half_beat_check(oe, lf, sr, sections["dannyA"]["strongestHit"], sections["dannyA"]["spb"]),
}
print("dannyA half-beat check:", sections["dannyA"]["halfBeatCheck"])
json.dump(energy, open(os.path.join(OUT, "energy.json"), "w"))
json.dump(sections, open(os.path.join(OUT, "sections.json"), "w"), indent=1)
print("wrote", OUT)
