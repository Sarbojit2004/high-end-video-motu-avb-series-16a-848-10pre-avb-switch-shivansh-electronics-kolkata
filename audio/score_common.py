"""
Shared scoring engine for the MOTU AVB Series reels.

One sonic identity carries across all three parts (brief s10) - same key, same
harmonic language, same palette - while each part re-weights the arrangement:

  Part 1  10pre  driving, drum-forward groove      (see score_part1.py)
  Part 2  16A    tightly sequenced arpeggio
  Part 3  848    expansive, wide-panned, reverb-heavy

Everything is synthesised from first principles with numpy/scipy. No samples,
no libraries, no third-party generation service (prompt s9/s10).

score_part1.py predates this module and carries its own copy of the engine; it
is left untouched because Part 1 is already rendered and delivered.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np

import synth as S

FPS = 30

# Duration is set per format: 88 s for the reels, 298 s for the long-form parts.
# Instruments read the module-level DUR/N, so callers set it once up front.
DUR = 88.0
N = S.secs(DUR)


def set_duration(seconds: float) -> None:
    """Reconfigure the engine for a different runtime before rendering."""
    global DUR, N
    DUR = float(seconds)
    N = S.secs(DUR)

# Shared harmony across the whole series: A natural minor, i - VI - III - VII.
PROG = [
    ('A2', ['A3', 'C4', 'E4']),
    ('F2', ['F3', 'A3', 'C4']),
    ('C3', ['C4', 'E4', 'G4']),
    ('G2', ['G3', 'B3', 'D4']),
]


@dataclass
class Voicing:
    """Per-part arrangement weights."""
    bpm: float = 120.0
    pad: float = 1.30
    sub: float = 0.30
    kick: float = 0.52
    snare: float = 0.85
    hats: float = 1.50
    arp: float = 1.70
    arp_rate: float = 0.5        # in beats; 0.25 = 16ths (busier)
    arp_gate: float = 0.55       # intensity above which the arp plays
    reverb_mix: float = 0.34
    reverb_decay: float = 0.76
    pad_bright: float = 2100.0
    width_ms: float = 13.0
    intensity: dict = field(default_factory=dict)
    seg: dict = field(default_factory=dict)


def beat(v: Voicing) -> float:
    return 60.0 / v.bpm


def curve_for(v: Voicing) -> np.ndarray:
    """Per-sample arrangement intensity, smoothed so sections glide."""
    c = np.zeros(N)
    for k, (a, b) in v.seg.items():
        c[S.secs(a):S.secs(b)] = v.intensity[k]
    w = S.secs(0.6)
    kern = np.hanning(w)
    kern /= kern.sum()
    return np.convolve(c, kern, mode='same')


def chord_at(sec: float, v: Voicing):
    return PROG[int(sec // (beat(v) * 8)) % len(PROG)]


# --------------------------------------------------------------------------- #
# instruments
# --------------------------------------------------------------------------- #

def pad(v: Voicing, curve: np.ndarray, chan: int = 0) -> np.ndarray:
    out = np.zeros(N)
    step = beat(v) * 8
    for i in range(int(np.ceil(DUR / step))):
        t0 = i * step
        n0 = S.secs(t0)
        n1 = min(N, S.secs(t0 + step + 1.4))
        ln = n1 - n0
        if ln <= 0:
            continue
        _, notes = chord_at(t0, v)
        voice = np.zeros(ln)
        dets = (-0.17, 0.02, 0.19) if chan == 0 else (-0.11, -0.03, 0.24)
        for j, nm in enumerate(notes):
            base = S.f(nm)
            for det in dets:
                voice += S.saw(base * (1 + det / 100.0), ln,
                               phase=(j * 0.13 + det) + (0.41 if chan else 0.0))
        voice /= (len(notes) * 3)
        out[n0:n1] += voice * S.env_adsr(ln, 0.85, 0.5, 0.72, 1.2)

    lfo = 0.5 + 0.5 * np.sin(
        2 * np.pi * (np.arange(N) / S.SR / 11.0 + (0.0 if chan == 0 else 0.37))
    )
    open_amt = np.clip(0.22 + 0.78 * curve, 0, 1) * (0.35 + 0.65 * lfo)
    return S.biquad_lp(out, 430.0) * (1 - open_amt) + S.biquad_lp(out, v.pad_bright) * open_amt


def sub(v: Voicing, curve: np.ndarray) -> np.ndarray:
    out = np.zeros(N)
    step = beat(v) * 2
    for i in range(int(np.ceil(DUR / step))):
        t0 = i * step
        n0 = S.secs(t0)
        ln = min(N - n0, S.secs(step * 1.05))
        if ln <= 0:
            continue
        fq = S.f(chord_at(t0, v)[0])
        body = S.sine(fq, ln) * 0.85 + S.sine(fq * 2, ln) * 0.12
        out[n0:n0 + ln] += body * S.env_ad(ln, 0.006, step * 0.98, 1.7) * (0.45 + 0.55 * curve[n0])
    return S.soft_clip(out, 1.4) * 0.9


def kick(v: Voicing, curve: np.ndarray) -> np.ndarray:
    out = np.zeros(N)
    ln = S.secs(0.34)
    tt = S.t(ln)
    pitch = 118.0 * np.exp(-tt * 34.0) + 41.0
    hit = np.sin(2 * np.pi * np.cumsum(pitch) / S.SR) * S.env_ad(ln, 0.001, 0.32, 2.2)
    hit = hit + S.biquad_hp(S.noise(ln, 7), 1800.0) * S.env_ad(ln, 0.0005, 0.012, 3.0) * 0.25
    b = beat(v)
    for i in range(int(DUR / b)):
        n0 = S.secs(i * b)
        if n0 + ln > N:
            break
        g = curve[n0]
        if g < 0.30:
            if i % 4 != 0:
                continue
            g *= 0.8
        out[n0:n0 + ln] += hit * min(1.0, g * 1.15)
    return out


def snare(v: Voicing, curve: np.ndarray) -> np.ndarray:
    out = np.zeros(N)
    ln = S.secs(0.22)
    hit = (S.biquad_bp(S.noise(ln, 11), 1900.0, 0.9) * 0.8
           + S.sine(196.0, ln) * 0.35 + S.sine(263.0, ln) * 0.2) * S.env_ad(ln, 0.001, 0.20, 2.6)
    b = beat(v)
    for i in range(int(DUR / b)):
        if i % 4 not in (1, 3):
            continue
        n0 = S.secs(i * b)
        if n0 + ln > N or curve[n0] < 0.45:
            continue
        out[n0:n0 + ln] += hit * curve[n0] * 0.62
    return out


def hats(v: Voicing, curve: np.ndarray, chan: int = 0) -> np.ndarray:
    out = np.zeros(N)
    sd = 0 if chan == 0 else 100

    def tick(dur, seed, hp, amp):
        ln = S.secs(dur)
        return S.biquad_hp(S.noise(ln, seed), hp) * S.env_ad(ln, 0.0004, dur * 0.85, 3.4) * amp

    short = tick(0.045, 3 + sd, 7200.0, 0.30)
    open_ = tick(0.16, 5 + sd, 6200.0, 0.24)
    six = beat(v) / 4
    for i in range(int(DUR / six)):
        n0 = S.secs(i * six)
        if n0 >= N or curve[n0] < 0.34:
            continue
        h = open_ if i % 8 == 6 else short
        acc = 1.0 if i % 4 == 0 else (0.62 if i % 2 == 0 else 0.44)
        ln = min(h.size, N - n0)
        out[n0:n0 + ln] += h[:ln] * acc * curve[n0]

    three = beat(v) * 2 / 3
    tk = tick(0.038, 9 + sd, 9000.0, 0.17)
    for i in range(int(DUR / three)):
        n0 = S.secs(i * three)
        if n0 >= N or curve[n0] < 0.66:
            continue
        ln = min(tk.size, N - n0)
        out[n0:n0 + ln] += tk[:ln] * (curve[n0] - 0.4)
    return out


def arp(v: Voicing, curve: np.ndarray) -> np.ndarray:
    """Plucked arpeggio. `arp_rate` in beats sets how tightly sequenced it is."""
    out = np.zeros(N)
    step = beat(v) * v.arp_rate
    pattern = [0, 2, 1, 2, 0, 1, 2, 1]
    for i in range(int(DUR / step)):
        t0 = i * step
        n0 = S.secs(t0)
        if n0 >= N or curve[n0] < v.arp_gate:
            continue
        _, notes = chord_at(t0, v)
        fq = S.f(notes[pattern[i % len(pattern)]]) * 2.0
        ln = min(N - n0, S.secs(step * 1.6))
        vv = S.tri(fq, ln) * 0.6 + S.saw(fq, ln) * 0.4
        vv = S.biquad_lp(vv, 2600.0 + 2200.0 * curve[n0])
        out[n0:n0 + ln] += vv * S.env_ad(ln, 0.003, step * 1.5, 2.8) * 0.16 * curve[n0]
    return out


# --------------------------------------------------------------------------- #
# mix
# --------------------------------------------------------------------------- #

def render_music(v: Voicing) -> tuple[np.ndarray, np.ndarray]:
    curve = curve_for(v)

    pd_l = pad(v, curve, 0) * v.pad
    pd_r = pad(v, curve, 1) * v.pad
    sb = sub(v, curve) * v.sub
    kk = kick(v, curve) * v.kick
    sn = snare(v, curve) * v.snare
    ht_l = hats(v, curve, 0) * v.hats
    ht_r = hats(v, curve, 1) * v.hats
    ar = arp(v, curve) * v.arp

    dyn = 0.30 + 0.70 * curve

    # Sub kept tight: below 30 Hz only eats headroom, above 120 Hz it masks the pad.
    sb = S.biquad_lp(S.biquad_hp(sb, 30.0), 120.0)

    # Low end and backbeat stay mono so a wide mix survives a phone speaker.
    centre = sb + (kk + sn) * dyn

    pd_l = S.schroeder_reverb(pd_l, v.reverb_mix, v.reverb_decay)
    pd_r = S.schroeder_reverb(pd_r, v.reverb_mix, v.reverb_decay + 0.04)

    ar_l = ar * 0.78
    ar_r = np.pad(ar, (S.secs(v.width_ms / 1000.0), 0))[:N] * 0.78

    left = centre + pd_l + ar_l + ht_l * dyn
    right = centre + pd_r + ar_r * 0.85 + ht_r * dyn

    def tilt(x):
        return x + S.biquad_hp(x, 2200.0) * 0.35 + S.biquad_bp(x, 700.0, 0.7) * 0.18

    return S.soft_clip(tilt(left) * 0.46, 1.2), S.soft_clip(tilt(right) * 0.46, 1.2)


def place(dst: np.ndarray, src: np.ndarray, frame: int, gain: float = 1.0) -> None:
    """Drop a cue at an exact video frame."""
    n0 = S.secs(frame / FPS)
    ln = min(src.size, dst.size - n0)
    if ln > 0:
        dst[n0:n0 + ln] += src[:ln] * gain


def write_part(part: int, music: tuple[np.ndarray, np.ndarray], fx: np.ndarray) -> None:
    ml, mr = music
    S.write_wav(f'out/music_part{part}.wav', S.normalize(ml, 0.80), S.normalize(mr, 0.80))
    fl, fr = S.haas(fx, ms=8, spread=0.55)
    S.write_wav(f'out/sfx_part{part}.wav', S.normalize(fl, 0.72), S.normalize(fr, 0.72))
    S.write_wav(
        f'out/bed_part{part}.wav',
        S.normalize(ml * 0.58 + fl * 0.85, 0.86),
        S.normalize(mr * 0.58 + fr * 0.85, 0.86),
    )
    print(f'part {part} audio: {DUR:.3f}s @ {S.SR} Hz -> music / sfx / bed')
