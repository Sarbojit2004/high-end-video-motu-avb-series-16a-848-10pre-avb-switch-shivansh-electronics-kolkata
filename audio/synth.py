"""
Original sound design for the MOTU AVB Series reels.

Everything here is synthesised from first principles with numpy - no licensed
sample packs, no library sound-effect packs, no third-party generation service
(prompt s9/s10). Each transition, reveal and interaction sound is built for the
specific visual beat it lands on.

Shared DSP primitives live here; per-part scores import from this module.
"""
from __future__ import annotations

import struct
import wave
from pathlib import Path

import numpy as np
from scipy.signal import lfilter

SR = 48_000


# --------------------------------------------------------------------------- #
# helpers
# --------------------------------------------------------------------------- #

def t(n: int) -> np.ndarray:
    """time axis of n samples"""
    return np.arange(n, dtype=np.float64) / SR


def secs(s: float) -> int:
    return int(round(s * SR))


def env_ad(n: int, a: float, d: float, curve: float = 2.5) -> np.ndarray:
    """attack/decay envelope, decay shaped by `curve`"""
    x = np.zeros(n)
    na = max(1, secs(a))
    nd = max(1, min(n - na, secs(d)))
    if na > 0:
        x[:na] = np.linspace(0.0, 1.0, na) ** 0.6
    if nd > 0:
        x[na:na + nd] = (1.0 - np.linspace(0.0, 1.0, nd)) ** curve
    return x


def env_adsr(n: int, a: float, d: float, s: float, r: float) -> np.ndarray:
    na, nd, nr = secs(a), secs(d), secs(r)
    ns = max(0, n - na - nd - nr)
    parts = [
        np.linspace(0, 1, na) if na else np.array([]),
        np.linspace(1, s, nd) if nd else np.array([]),
        np.full(ns, s),
        np.linspace(s, 0, nr) if nr else np.array([]),
    ]
    out = np.concatenate([p for p in parts if p.size])
    return np.pad(out, (0, max(0, n - out.size)))[:n]


def onepole_lp(x: np.ndarray, cutoff: np.ndarray | float) -> np.ndarray:
    """Time-varying one-pole low-pass; cutoff in Hz (scalar or per-sample).

    Scalar cutoffs take the fast C path; only genuinely swept cutoffs fall back
    to the per-sample loop, and callers keep those short.
    """
    c = np.asarray(cutoff, dtype=np.float64)
    if c.ndim == 0:
        a = float(np.clip(1.0 - np.exp(-2.0 * np.pi * c / SR), 1e-6, 1.0))
        return lfilter([a], [1.0, -(1.0 - a)], x)
    c = np.broadcast_to(c, x.shape)
    a = np.clip(1.0 - np.exp(-2.0 * np.pi * c / SR), 1e-6, 1.0)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(x.size):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def biquad_lp(x: np.ndarray, f0: float, q: float = 0.707) -> np.ndarray:
    """Static resonant low-pass (RBJ cookbook)."""
    b, a = _rbj(f0, q, 'lp')
    return lfilter(b, a, x)


def biquad_hp(x: np.ndarray, f0: float, q: float = 0.707) -> np.ndarray:
    b, a = _rbj(f0, q, 'hp')
    return lfilter(b, a, x)


def biquad_bp(x: np.ndarray, f0: float, q: float = 2.0) -> np.ndarray:
    b, a = _rbj(f0, q, 'bp')
    return lfilter(b, a, x)


def _rbj(f0: float, q: float, kind: str):
    w0 = 2 * np.pi * min(f0, SR * 0.45) / SR
    alpha = np.sin(w0) / (2 * q)
    cw = np.cos(w0)
    if kind == 'lp':
        b = np.array([(1 - cw) / 2, 1 - cw, (1 - cw) / 2])
    elif kind == 'hp':
        b = np.array([(1 + cw) / 2, -(1 + cw), (1 + cw) / 2])
    else:  # band-pass (constant peak gain)
        b = np.array([alpha, 0.0, -alpha])
    a = np.array([1 + alpha, -2 * cw, 1 - alpha])
    return b / a[0], a / a[0]


def saw(freq: np.ndarray | float, n: int, phase: float = 0.0) -> np.ndarray:
    f = np.broadcast_to(np.asarray(freq, dtype=np.float64), (n,))
    ph = (np.cumsum(f) / SR + phase) % 1.0
    return 2.0 * ph - 1.0


def sine(freq: np.ndarray | float, n: int, phase: float = 0.0) -> np.ndarray:
    f = np.broadcast_to(np.asarray(freq, dtype=np.float64), (n,))
    ph = np.cumsum(f) / SR + phase
    return np.sin(2 * np.pi * ph)


def tri(freq: np.ndarray | float, n: int) -> np.ndarray:
    f = np.broadcast_to(np.asarray(freq, dtype=np.float64), (n,))
    ph = (np.cumsum(f) / SR) % 1.0
    return 4.0 * np.abs(ph - 0.5) - 1.0


def noise(n: int, seed: int | None = None) -> np.ndarray:
    rng = np.random.default_rng(seed)
    return rng.standard_normal(n)


def soft_clip(x: np.ndarray, drive: float = 1.0) -> np.ndarray:
    return np.tanh(x * drive) / np.tanh(drive) if drive > 0 else x


def haas(mono: np.ndarray, ms: float = 12.0, spread: float = 0.5):
    """cheap wide stereo - short delay on one side"""
    d = secs(ms / 1000.0)
    left = mono.copy()
    right = np.pad(mono, (d, 0))[: mono.size]
    return (
        left * (1 - spread * 0.35) + right * (spread * 0.35),
        right * (1 - spread * 0.35) + left * (spread * 0.35),
    )


def schroeder_reverb(x: np.ndarray, mix: float = 0.25, decay: float = 0.72) -> np.ndarray:
    """Schroeder reverb: four parallel feedback combs into two allpasses.

    Each comb is y[n] = x[n] + g*y[n-d], expressed as an IIR so scipy runs it
    in C rather than a Python sample loop.
    """
    wet = np.zeros_like(x)
    for delay_ms, g in ((29.7, decay), (37.1, decay * 0.96),
                        (41.1, decay * 0.92), (43.7, decay * 0.88)):
        d = secs(delay_ms / 1000.0)
        a = np.zeros(d + 1)
        a[0] = 1.0
        a[d] = -g
        wet += lfilter([1.0], a, x)
    wet /= 4.0

    for delay_ms, g in ((5.0, 0.7), (1.7, 0.7)):
        d = secs(delay_ms / 1000.0)
        b = np.zeros(d + 1)
        b[0] = -g
        b[d] = 1.0
        a = np.zeros(d + 1)
        a[0] = 1.0
        a[d] = -g
        wet = lfilter(b, a, wet)

    # tame the tail so it sits behind the mix
    wet = biquad_lp(wet, 5200.0)
    return x * (1 - mix) + wet * mix


def normalize(x: np.ndarray, peak: float = 0.89) -> np.ndarray:
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 1e-9 else x


def write_wav(path: str | Path, left: np.ndarray, right: np.ndarray | None = None) -> Path:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    if right is None:
        right = left
    n = min(left.size, right.size)
    inter = np.empty(n * 2, dtype=np.float64)
    inter[0::2] = left[:n]
    inter[1::2] = right[:n]
    inter = np.clip(inter, -1.0, 1.0)
    pcm = (inter * 32767.0).astype('<i2')
    with wave.open(str(p), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    return p


# --------------------------------------------------------------------------- #
# musical helpers
# --------------------------------------------------------------------------- #

def note(semitone_from_a4: float) -> float:
    return 440.0 * (2.0 ** (semitone_from_a4 / 12.0))


# scale degrees relative to A4 = 0
NOTES = {
    'A1': -36, 'C2': -33, 'D2': -31, 'E2': -29, 'F2': -28, 'G2': -26,
    'A2': -24, 'C3': -21, 'D3': -19, 'E3': -17, 'F3': -16, 'G3': -14,
    'A3': -12, 'B3': -10, 'C4': -9, 'D4': -7, 'E4': -5, 'F4': -4, 'G4': -2,
    'A4': 0, 'C5': 3, 'D5': 5, 'E5': 7, 'G5': 10, 'A5': 12,
}


def f(name: str) -> float:
    return note(NOTES[name])
