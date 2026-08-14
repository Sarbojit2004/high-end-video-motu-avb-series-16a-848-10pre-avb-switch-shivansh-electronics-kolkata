"""
LONG-FORM PART 3 - "The Control Room" (MOTU 848)
Original 298.000s score + sound design.

Expansive, wide-panned and reverb-heavy, underscoring the spatial-audio story.
Slowest tempo and widest image of the three; the series resolves here, and the
closing chord is the last thing the whole campaign plays.
"""
from __future__ import annotations

import numpy as np

import score_common as K
import synth as S

K.set_duration(298.0)
FPS = 30

# Segment boundaries in frames, mirroring src/long/part3/timeline.ts.
FRAMES = {
    's1': (0, 409),
    's2': (409, 942),
    's3': (942, 1413),
    's4': (1413, 2045),
    's5': (2045, 2566),
    's6': (2566, 3087),
    's7': (3087, 3633),
    's8': (3633, 4055),
    's9': (4055, 4563),
    's10': (4563, 5146),
    's11': (5146, 5754),
    's12': (5754, 6225),
    's13': (6225, 6684),
    's14': (6684, 7044),
    's15': (7044, 7490),
    's16': (7490, 8023),
    's17': (8023, 8494),
    's18': (8494, 8940),
}
SEG = {k: (a / FPS, b / FPS) for k, (a, b) in FRAMES.items() if b > a}

INTENSITY = {
    's1': 0.24, 's2': 0.70, 's3': 0.62, 's4': 0.50, 's5': 0.68, 's6': 0.66,
    's7': 0.58, 's8': 0.64, 's9': 0.74, 's10': 0.62, 's11': 0.70, 's12': 0.80,
    's13': 0.64, 's14': 0.66, 's15': 0.54, 's16': 0.86, 's17': 0.78,
    's18': 0.36,
}

VOICE = K.Voicing(
    bpm=112.0,
    pad=1.80, sub=0.28, kick=0.42, snare=0.60, hats=1.00,
    arp=1.10, arp_rate=0.5, arp_gate=0.64,
    reverb_mix=0.54, reverb_decay=0.85,
    pad_bright=2600.0, width_ms=20.0,
    intensity=INTENSITY, seg=SEG,
)


def sfx_transition(dur=0.75, seed=21):
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    band = S.biquad_bp(S.noise(ln, seed), 1200.0, 0.6) * (0.12 + 0.88 * tt) ** 2
    band = S.biquad_hp(band, 260.0)
    tail = S.sine(np.linspace(280, 620, ln), ln)
    out = (band * 0.52 + tail * 0.12) * (np.sin(np.pi * tt) ** 1.3) * 0.46
    return S.schroeder_reverb(out, mix=0.32, decay=0.80)


def sfx_reveal(dur=1.4, seed=33):
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    nz = S.biquad_bp(S.noise(ln, seed), 840.0, 0.55) * (tt ** 2)
    tone = sum(S.sine(fq * (0.985 + 0.03 * tt), ln)
               for fq in (S.f('A3'), S.f('E4'), S.f('A4'), S.f('C5'))) / 4
    cut = int(ln * 0.70)
    env = np.concatenate([np.linspace(0, 1, cut) ** 1.6, np.linspace(1, 0, ln - cut) ** 1.2])
    return S.schroeder_reverb((nz * 0.40 + tone * 0.32) * env * 0.52, mix=0.40, decay=0.84)


def sfx_click(bright=1.0, seed=41):
    ln = S.secs(0.08)
    nz = S.biquad_hp(S.noise(ln, seed), 3100.0 * bright)
    return (nz * 0.6 + S.sine(2000.0 * bright, ln) * 0.35) * S.env_ad(ln, 0.0006, 0.075, 4.0) * 0.28


def sfx_array_sweep(dur=2.4, seed=77):
    """A tone traversing the 7.1.4 array - twelve bursts, each further back."""
    ln = S.secs(dur)
    out = np.zeros(ln)
    for k in range(12):
        n0 = S.secs(k * (dur * 0.062))
        segn = S.secs(0.32)
        if n0 + segn > ln:
            break
        s = np.linspace(0, 1, segn)
        fq = S.f('A4') * (2 ** (k / 24.0))
        v = (S.sine(fq, segn) * 0.7 + S.tri(fq * 2, segn) * 0.3) * (np.sin(np.pi * s) ** 1.6)
        out[n0:n0 + segn] += v * (0.85 - k * 0.045)
    return S.schroeder_reverb(out * 0.34, mix=0.55, decay=0.86)


def sfx_monitor_switch(seed=63):
    """An A/B/C monitor-select button depressing."""
    ln = S.secs(0.26)
    click = S.biquad_hp(S.noise(ln, seed), 2600.0) * S.env_ad(ln, 0.0004, 0.035, 5.0)
    body = S.sine(148.0, ln) * S.env_ad(ln, 0.0015, 0.095, 3.2) * 0.34
    thunk = S.biquad_lp(S.noise(ln, seed + 1), 420.0) * S.env_ad(ln, 0.001, 0.06, 4.0) * 0.30
    return (click * 0.55 + body + thunk) * 0.52


def sfx_brand(seed=83):
    ln = S.secs(0.75)
    tt = np.linspace(0, 1, ln)
    tone = (S.sine(S.f('A4'), ln) * 0.5 + S.sine(S.f('E4'), ln) * 0.35
            + S.sine(S.f('A3'), ln) * 0.3)
    env = (1 - np.exp(-tt * 14)) * np.exp(-tt * 3.6)
    return S.schroeder_reverb(tone * env * 0.16, mix=0.4, decay=0.8)


def sfx_resolve(dur=3.6, seed=91):
    """The closing chord of the whole campaign."""
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    tone = sum(S.sine(S.f(n), ln) * 0.6 + S.saw(S.f(n), ln) * 0.12
               for n in ('A2', 'A3', 'C4', 'E4', 'A4')) / 5
    env = (1 - np.exp(-tt * 5.0)) * np.exp(-tt * 0.95)
    return S.schroeder_reverb(S.biquad_lp(tone, 3000.0) * env * 0.42, mix=0.55, decay=0.86)


def sound_design():
    fx = np.zeros(K.N)
    for _k, (a, b) in FRAMES.items():
        if a == 0 or b <= a:
            continue
        K.place(fx, sfx_transition(seed=a % 97), a - 10, 0.8)

    for fr, seed in ((40, 5), (520, 9), (1000, 13), (2900, 17),
                     (4100, 21), (4600, 25), (5800, 29), (8040, 33)):
        K.place(fx, sfx_reveal(seed=seed), fr, 0.8)

    # the twelve-output array sweep, under the 7.1.4 explanation
    K.place(fx, sfx_array_sweep(seed=77), 1020, 0.95)

    # A/B/C monitor buttons depressing
    for i, fr in enumerate((4620, 4690, 4760)):
        K.place(fx, sfx_monitor_switch(seed=63 + i * 7), fr, 0.85)

    for fr in (1180, 1240, 3000, 3060, 4150, 5560, 5620, 6340, 6400, 8320):
        K.place(fx, sfx_click(seed=fr % 89), fr, 0.62)

    for fr in (660, 2050, 3500, 4900, 6300, 7500):
        K.place(fx, sfx_brand(seed=fr % 71), fr, 0.9)

    # the series resolves
    K.place(fx, sfx_resolve(seed=91), 8520, 1.0)
    return fx


if __name__ == '__main__':
    ml, mr = K.render_music(VOICE)
    S.write_wav('out/music_long3.wav', S.normalize(ml, 0.80), S.normalize(mr, 0.80))
    fx = sound_design()
    fl, fr = S.haas(fx, ms=8, spread=0.55)
    S.write_wav('out/sfx_long3.wav', S.normalize(fl, 0.72), S.normalize(fr, 0.72))
    S.write_wav('out/bed_long3.wav',
                S.normalize(ml * 0.56 + fl * 0.85, 0.86),
                S.normalize(mr * 0.56 + fr * 0.85, 0.86))
    print(f'long part 3 audio: {K.DUR:.3f}s -> music / sfx / bed')
