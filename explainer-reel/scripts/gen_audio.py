#!/usr/bin/env python3
"""Synthesises every audio asset for the 180-second MOTU AVB explainer reel.

NOTHING HERE IS SAMPLED, SOURCED OR FETCHED. Every waveform is generated from
scratch with the same class of DSP the TASCAM Recording Series repository uses
for its own audio — biquad filters, explicit envelopes, comb-filter reverb,
stereo widening — which is what the brief asks for. What it deliberately does
NOT do is import that repository's audio files: its 35-cue palette is named for
TASCAM mixer actions (fader-slide, knob-detent, relay-click, meter-ripple,
sd-insert, db25-lock, transport-arm) that describe mechanical things a TASCAM
mixer does. A MOTU AVB interface does none of them. So the sonic character is
replicated and the vocabulary is re-authored around what this ecosystem
actually does: links coming up, clocks locking, streams reserving.

Three families are produced:

  1. music-bed.wav    180.000 s. Six energy zones, one per segment of the reel,
                      so the bed follows this film's own structure rather than
                      looping.
  2. ambient-bed.wav  180.000 s. A continuous room/drone layer underneath.
  3. sfx/*.wav        13 transition and technical-accent cues.

THE MIX IS BUILT FOR A SPOKEN VOICE, which is the opposite of the silent
montage reels elsewhere in this pipeline where music was the driving layer.
Two things follow from that:

  * SPEECH POCKET. The music bed is carved with a broad -7 dB dip centred on
    1.6 kHz (see `speech_pocket`). Narration intelligibility lives in roughly
    300 Hz - 4 kHz; the bed is shaped to leave that band open rather than
    relying on ducking alone to rescue it later.
  * EVERY CUE IS SHORT AND PLACED OUT OF THE WAY. Transition sounds are either
    bright (> 2.5 kHz) or sub (< 120 Hz), never mid-heavy, so they never mask a
    consonant. Nothing rings long enough to sit under a following word.

Run:  python3 scripts/gen_audio.py
"""
import math
import os
import subprocess
import sys
import wave

import numpy as np
from scipy.signal import lfilter

SR = 48000
FPS = 30
TOTAL_FRAMES = 5400
DUR = TOTAL_FRAMES / FPS  # 180.000 s exactly

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
OUT = os.path.join(PROJ, "public", "audio")
SFX_OUT = os.path.join(OUT, "sfx")
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
rng = np.random.default_rng(0x16A848)


# ─────────────────────────────────────────────────────────── primitives ──
def t(n):
    """Time axis for a SAMPLE COUNT."""
    return np.arange(n) / SR


def tsec(dur):
    """Time axis for a DURATION IN SECONDS.

    Kept separate from t() on purpose: passing seconds to a sample-count axis
    silently yields a one-element array that then broadcasts against the real
    buffer, which produces a flat envelope instead of an error.
    """
    return np.arange(int(dur * SR)) / SR


def expd(n, tau):
    return np.exp(-t(n) / tau)


def noise(n):
    return rng.standard_normal(n)


def _bq(fc, q, kind, gain_db=0.0):
    """Biquad coefficients — lowpass, highpass, or peaking."""
    fc = float(np.clip(fc, 20.0, SR / 2 * 0.97))
    w = 2 * math.pi * fc / SR
    al = math.sin(w) / (2 * q)
    c = math.cos(w)
    if kind == "peak":
        A = 10 ** (gain_db / 40)
        a0 = 1 + al / A
        b = [(1 + al * A) / a0, (-2 * c) / a0, (1 - al * A) / a0]
        a = [1.0, (-2 * c) / a0, (1 - al / A) / a0]
        return b, a
    a0 = 1 + al
    if kind == "lp":
        b = [(1 - c) / 2 / a0, (1 - c) / a0, (1 - c) / 2 / a0]
    else:
        b = [(1 + c) / 2 / a0, -(1 + c) / a0, (1 + c) / 2 / a0]
    return b, [1.0, -2 * c / a0, (1 - al) / a0]


def lpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "lp")
    return lfilter(b, a, x)


def hpf(x, fc, q=0.707):
    b, a = _bq(fc, q, "hp")
    return lfilter(b, a, x)


def peak(x, fc, gain_db, q=0.9):
    b, a = _bq(fc, q, "peak", gain_db)
    return lfilter(b, a, x)


def lpf_tv(x, fc_curve, q=0.707, blk=2048):
    """Low-pass whose cutoff moves over time.

    The music bed's brightness opens and closes per segment, which means the
    filter cutoff is a signal, not a number. Processed in blocks with the
    filter state carried across the boundary (`zi`), so the cutoff can sweep
    without the discontinuity a naive per-block filter would click on.
    """
    x = np.asarray(x, dtype=np.float64)
    fc_curve = np.asarray(fc_curve, dtype=np.float64)
    out = np.zeros_like(x)
    zi = np.zeros(2)
    for i in range(0, len(x), blk):
        j = min(i + blk, len(x))
        b, a = _bq(float(fc_curve[i]), q, "lp")
        out[i:j], zi = lfilter(b, a, x[i:j], zi=zi)
    return out


def saw(f, n, det=0.0, parts=14):
    ph = np.cumsum(np.full(n, f / SR))
    o = np.zeros(n)
    for k in range(1, parts):
        o += np.sin(2 * np.pi * k * (ph + det * k * 0.001)) / k
    return o * 0.5


def sine(f, n):
    return np.sin(2 * np.pi * np.cumsum(np.full(n, f / SR)))


def stereo(x, width=0.25, pre=0.012):
    """Haas-style widening — a short pre-delay cross-fed between the channels."""
    d = int(pre * SR)
    r = np.concatenate([np.zeros(d), x[:-d]]) if d else x.copy()
    return np.stack(
        [x * (1 - width * 0.5) + r * width * 0.5, r * (1 - width * 0.5) + x * width * 0.5], 1
    )


def verb(x, taps=((0.029, 0.33), (0.043, 0.25), (0.067, 0.18), (0.097, 0.12)), mix=0.26):
    """Comb-filter reverb — enough tail to place a sound in a room."""
    y = np.zeros_like(x)
    for dt, g in taps:
        d = int(dt * SR)
        if d < len(x):
            y[d:] += x[:-d] * g
    return x * (1 - mix) + y * mix


def declick(x, ms=4.0):
    k = max(2, int(ms / 1000 * SR))
    if len(x) < 2 * k:
        return x
    w = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, k))
    x[:k] *= w
    x[-k:] *= w[::-1]
    return x


def speech_pocket(x):
    """Carve room for the narration.

    A broad dip through the band a voice occupies, so the bed can sit at a
    usable level without competing with words. This is done at synthesis time
    rather than left to a mixing pass, because the bed is generated here and
    there is no later stage that would otherwise EQ it.
    """
    x = peak(x, 1600, -7.0, q=0.55)
    x = peak(x, 500, -3.2, q=0.8)
    return x


def write_wav(path, x, peak_db=-1.0):
    x = np.asarray(x, dtype=np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    m = np.abs(x).max()
    if m > 0:
        x = x * (10 ** (peak_db / 20)) / m
    os.makedirs(os.path.dirname(path), exist_ok=True)
    d = (np.clip(x, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(d.tobytes())
    return x


# ═══════════════════════════════════════════════════════════ MUSIC BED ══
# 180.000 s. Six zones, one per segment of the reel (script.ts), so the bed
# carries the film's own shape. Segment boundaries are the derived narration
# timestamps, not a musical grid — the words come first here.
N = int(round(DUR * SR))
BPM = 84.0  # slow. A narrated technical piece should not feel driven.
BEAT = 60 / BPM
BAR = BEAT * 4

# A minor family. Low, wide, unhurried — this is a bed, not a track.
PROG = [
    [110.00, 130.81, 164.81],  # Am
    [ 98.00, 123.47, 146.83],  # G
    [ 87.31, 110.00, 130.81],  # F
    [ 82.41, 103.83, 123.47],  # E
]

# (start, end, energy, brightness, pulse, arp) per segment, from script.ts.
SEG = [
    (  0.00,  16.31, 0.72, 1.02, True,  False),  # cold open   — dark, stated
    ( 16.86,  49.23, 0.60, 0.88, False, False),  # 16A         — light, clean
    ( 49.78,  84.69, 0.74, 1.06, True,  False),  # 848         — dark, warmer
    ( 85.24, 116.98, 0.62, 0.92, False, True),   # 10pre       — light, moving
    (117.53, 152.08, 0.86, 1.24, True,  False),  # AVB Switch  — dark, systemic
    (152.63, 180.00, 0.70, 1.10, True,  False),  # close       — light, resolve
]


def zone(ts, idx, smooth=1.4):
    """Sample a zone parameter, smoothed so zones cross-fade instead of step."""
    out = np.zeros_like(ts)
    for (a, b, e, br, pu, ar) in SEG:
        out[(ts >= a) & (ts < b)] = float((e, br, pu, ar)[idx])
    out[ts >= SEG[-1][1]] = float(SEG[-1][idx + 2])
    k = int(smooth * SR)
    if k > 1:
        out = np.convolve(out, np.ones(k) / k, mode="same")
    return out


def build_music():
    ts = np.arange(N) / SR
    energy = zone(ts, 0)
    bright = zone(ts, 1)
    pulse_on = zone(ts, 2)
    arp_on = zone(ts, 3)

    mus = np.zeros(N)

    # ── pad / chord bed ──────────────────────────────────────────────────
    bar_len = int(BAR * SR)
    for i in range(0, N, bar_len):
        n = min(bar_len, N - i)
        ch = PROG[(i // bar_len) % len(PROG)]
        seg = np.zeros(n)
        for j, f in enumerate(ch):
            seg += saw(f, n, det=1.1 + j * 0.6) * (0.30 - j * 0.06)
            seg += sine(f * 2, n) * 0.045
        a = np.minimum(np.linspace(0, 1, n) * 5.0, 1.0)
        seg *= a * np.minimum(np.linspace(1, 0, n) * 5.0 + 0.55, 1.0)
        mus[i:i + n] += seg

    # ── sub weight, well below the voice ─────────────────────────────────
    sub = np.zeros(N)
    for i in range(0, N, bar_len):
        n = min(bar_len, N - i)
        f = PROG[(i // bar_len) % len(PROG)][0] / 2
        sub[i:i + n] += sine(f, n) * 0.5 * np.minimum(np.linspace(0, 1, n) * 4, 1.0)
    mus += lpf(sub, 110) * 0.55

    # ── pulse: a soft filtered tick, only in the zones that ask for it ───
    beat_len = int(BEAT * SR)
    pul = np.zeros(N)
    for i in range(0, N, beat_len):
        n = min(int(0.34 * SR), N - i)
        if n <= 0:
            break
        e = expd(n, 0.075)
        pul[i:i + n] += (sine(62, n) * 0.7 + noise(n) * 0.05) * e
    mus += lpf(pul, 220) * pulse_on * 0.5

    # ── arp: sparse, only in the 10pre zone ──────────────────────────────
    step = int(BEAT / 2 * SR)
    arp = np.zeros(N)
    degrees = [0, 3, 7, 10, 7, 3]
    for k, i in enumerate(range(0, N, step)):
        n = min(int(0.5 * SR), N - i)
        if n <= 0:
            break
        root = PROG[(i // bar_len) % len(PROG)][0]
        f = root * 2 * (2 ** (degrees[k % len(degrees)] / 12))
        arp[i:i + n] += sine(f, n) * expd(n, 0.16) * 0.30
    mus += hpf(arp, 400) * arp_on * 0.5

    # ── air: a high shimmer that tracks brightness ───────────────────────
    air = hpf(noise(N), 5200) * 0.05
    mus += air * bright * 0.5

    # ── shape ────────────────────────────────────────────────────────────
    mus *= energy
    mus = lpf_tv(mus, 1400 + 2600 * np.clip(bright, 0, 2))  # brightness -> opening
    mus = speech_pocket(mus)                              # carve the voice band
    mus = hpf(mus, 34)                                    # clear the rumble

    st = stereo(mus, width=0.34, pre=0.016)
    st = np.stack([verb(st[:, 0], mix=0.16), verb(st[:, 1], mix=0.16)], 1)

    # In and out of the film cleanly.
    env = np.ones(N)
    fi, fo = int(1.6 * SR), int(3.4 * SR)
    env[:fi] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi))
    env[-fo:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    st *= env[:, None]
    return st


# ═════════════════════════════════════════════════════════ AMBIENT BED ══
def build_ambient():
    """A continuous room tone — the film never sits on digital silence."""
    ts = np.arange(N) / SR
    a = lpf(noise(N), 240) * 0.35
    a += lpf(noise(N), 70) * 0.5
    # Two slow detuned drones, breathing against each other.
    a += sine(55.0, N) * 0.10 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.031 * ts))
    a += sine(82.5, N) * 0.06 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.019 * ts))
    a += hpf(noise(N), 8200) * 0.012  # a hint of air so it is not a dead pad
    a = hpf(a, 28)
    st = stereo(a, width=0.55, pre=0.031)
    env = np.ones(N)
    fi, fo = int(2.5 * SR), int(3.0 * SR)
    env[:fi] = 0.5 - 0.5 * np.cos(np.linspace(0, np.pi, fi))
    env[-fo:] = 0.5 + 0.5 * np.cos(np.linspace(0, np.pi, fo))
    return st * env[:, None]


# ═════════════════════════════════════════════════════════════════ SFX ══
# The vocabulary of an AVB network, not of a mixer's moving parts.
def port_link():
    """A Gigabit port coming up — two contacts, then the link LED going solid."""
    d = 0.26
    n = int(d * SR)
    s = np.zeros(n)
    for at, f in ((0.004, 3400), (0.026, 4300)):
        k = int(at * SR)
        seg = n - k
        s[k:] += (sine(f, seg) * 0.5 + sine(f * 1.6, seg) * 0.2) * expd(seg, 0.016)
    k = int(0.07 * SR)
    seg = n - k
    s[k:] += sine(5200, seg) * 0.18 * expd(seg, 0.05)
    return hpf(s, 1800)


def net_lock():
    """gPTP lock — two clocks pulling into unison, then settling.

    The pitch of the second oscillator glides onto the first and the beating
    between them disappears. That IS what a clock lock sounds like as a
    metaphor, and it is the one cue in this palette doing real narrative work
    in the AVB Switch segment.
    """
    d = 0.92
    n = int(d * SR)
    x = tsec(d)
    base = 1760.0
    drift = np.exp(-3.4 * x)
    a = sine(base, n)
    ph = np.cumsum(base * (1 + 0.045 * drift) / SR)
    b = np.sin(2 * np.pi * ph)
    s = (a * 0.45 + b * 0.45) * (0.35 + 0.65 * (1 - drift))
    s *= np.minimum(x / 0.05, 1.0) * np.exp(-1.5 * np.maximum(x - 0.45, 0))
    s += hpf(noise(n), 6000) * 0.05 * np.exp(-7 * x)
    return verb(hpf(s, 900), mix=0.22)


def stream_open():
    """An AVB stream reserving — a short ascending chirp that latches."""
    d = 0.34
    n = int(d * SR)
    f = np.linspace(900, 3100, n)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * expd(n, 0.10)
    k = int(0.26 * SR)
    seg = n - k
    s[k:] += sine(3100, seg) * 0.4 * expd(seg, 0.02)
    return hpf(s, 800)


def clock_tick():
    """A single precision tick. Very short, very high, no tail."""
    d = 0.05
    n = int(d * SR)
    s = (sine(6400, n) * 0.5 + sine(9600, n) * 0.22) * expd(n, 0.008)
    return hpf(s, 3000)


def spec_latch():
    """A figure landing on screen."""
    d = 0.20
    n = int(d * SR)
    s = sine(2600, n) * 0.5 + sine(3900, n) * 0.28 + sine(5900, n) * 0.14
    return hpf(s * expd(n, 0.035), 1500)


def data_sweep():
    """A channel count filling up — a rising filtered noise band."""
    d = 0.70
    n = int(d * SR)
    s = noise(n)
    out = np.zeros(n)
    blk = 512
    for i in range(0, n, blk):
        j = min(i + blk, n)
        fc = 700 + 6400 * (i / n) ** 1.6
        out[i:j] = lpf(hpf(s[i:j], fc * 0.7), fc * 1.5)
    out *= np.sin(np.pi * np.clip(np.arange(n) / n, 0, 1)) ** 0.8 * 0.55
    return hpf(out, 600)


def whoosh(dur, f0, f1, curve=1.0, rev=False):
    n = int(dur * SR)
    p = np.linspace(0, 1, n) ** curve
    s = noise(n)
    out = np.zeros(n)
    blk = 512
    for i in range(0, n, blk):
        j = min(i + blk, n)
        fc = f0 + (f1 - f0) * p[i]
        out[i:j] = hpf(lpf(s[i:j], min(fc * 2.4, 19000)), fc)
    env = np.sin(np.pi * np.linspace(0, 1, n)) ** 1.1
    if rev:
        env = env[::-1]
    return out * env * 0.6


def seg_swell():
    """The segment boundary — a soft wide rise, never an impact."""
    d = 1.15
    n = int(d * SR)
    x = tsec(d)
    s = np.zeros(n)
    for f, a in ((1500, 0.26), (2250, 0.19), (3400, 0.13), (5100, 0.07)):
        s += a * np.sin(2 * np.pi * f * x) * np.exp(-2.0 * x)
    s += hpf(noise(n), 2400) * 0.10 * np.exp(-2.6 * x)
    rise = np.sin(np.pi * np.clip(x / 0.55, 0, 1)) ** 1.4
    s *= np.where(x < 0.55, rise, np.exp(-3.2 * (x - 0.55)))
    return verb(hpf(s, 900), mix=0.30)


def sub_drop():
    """Entering a dark environment. Sub only — nowhere near the voice."""
    d = 0.90
    n = int(d * SR)
    f = np.linspace(120, 32, n)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * expd(n, 0.30)
    return lpf(s, 160)


def caption_in():
    """The soft mark under a caption reveal. Almost subliminal."""
    d = 0.09
    n = int(d * SR)
    s = (sine(3200, n) * 0.34 + sine(4800, n) * 0.16) * expd(n, 0.018)
    return hpf(s, 2200)


SOUNDS = {
    "port-link": port_link,
    "net-lock": net_lock,
    "stream-open": stream_open,
    "clock-tick": clock_tick,
    "spec-latch": spec_latch,
    "data-sweep": data_sweep,
    "seg-swell": seg_swell,
    "sub-drop": sub_drop,
    "caption-in": caption_in,
    "whoosh-soft": lambda: whoosh(0.44, 520, 2600, 1.25),
    "whoosh-bright": lambda: whoosh(0.50, 1700, 6800, 0.95),
    "whoosh-rev": lambda: whoosh(0.62, 3900, 800, 0.9, rev=True),
    "whoosh-air": lambda: whoosh(0.58, 760, 5200, 0.85),
}

# Per-cue level. These are not all the same loudness — a caption mark must be
# far quieter than a segment swell or it will step on the narration.
LEVELS = {
    "caption-in": -26.0, "clock-tick": -22.0, "spec-latch": -19.0,
    "port-link": -18.0, "stream-open": -17.0, "data-sweep": -18.0,
    "net-lock": -15.0, "seg-swell": -14.0, "sub-drop": -16.0,
    "whoosh-soft": -19.0, "whoosh-bright": -18.0, "whoosh-rev": -18.0,
    "whoosh-air": -19.0,
}


def to_mp3(wav):
    mp3 = wav[:-4] + ".mp3"
    subprocess.run([FFMPEG, "-v", "error", "-y", "-i", wav, "-b:a", "192k", mp3], check=True)


if __name__ == "__main__":
    os.makedirs(SFX_OUT, exist_ok=True)

    print(f"music bed   {DUR:.3f}s ...", flush=True)
    m = build_music()
    write_wav(os.path.join(OUT, "music-bed.wav"), m, peak_db=-15.5)

    print(f"ambient bed {DUR:.3f}s ...", flush=True)
    a = build_ambient()
    write_wav(os.path.join(OUT, "ambient-bed.wav"), a, peak_db=-27.0)

    print(f"{len(SOUNDS)} sfx cues ...", flush=True)
    for name, fn in SOUNDS.items():
        s = declick(np.asarray(fn(), dtype=np.float64))
        st = stereo(s, width=0.30, pre=0.006) if s.ndim == 1 else s
        write_wav(os.path.join(SFX_OUT, f"{name}.wav"), st, peak_db=LEVELS[name])
        print(f"  {name:15s} {len(s) / SR:5.3f}s  {LEVELS[name]:+.1f} dBFS")

    # A silent VO placeholder at exactly the film's runtime, so the client can
    # drop their recording straight in with no code change (brief Section 6).
    write_wav(os.path.join(OUT, "vo.wav"), np.zeros((N, 2)), peak_db=0.0)
    print(f"\nvo.wav placeholder — {DUR:.3f}s of silence, replace with the recorded take")
    print("done.")
