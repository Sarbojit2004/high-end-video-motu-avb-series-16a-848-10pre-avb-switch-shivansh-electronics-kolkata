"""
LONG-FORM PART 2 - "The Patchbay" (MOTU 16A)
Original 298.000s score + sound design.

Arpeggio-led, matching the reel series' Part 2: the tightly sequenced figure
stands in for patchbay routing. Quicker than Part 1 and drier than Part 3, so
the sequence stays articulate across a five-minute runtime.
"""
from __future__ import annotations

import numpy as np

import score_common as K
import synth as S

K.set_duration(298.0)
FPS = 30

# Segment boundaries in frames, mirroring src/long/part2/timeline.ts.
FRAMES = {
    's1': (0, 560),
    's2': (560, 1096),
    's3': (1096, 1559),
    's4': (1559, 1985),
    's5': (1985, 2594),
    's6': (2594, 3191),
    's7': (3191, 3642),
    's8': (3642, 4202),
    's9': (4202, 4677),
    's10': (4677, 5140),
    's11': (5140, 5773),
    's12': (5773, 6248),
    's13': (6248, 6699),
    's14': (6699, 7065),
    's15': (7065, 7479),
    's16': (7479, 8027),
    's17': (8027, 8514),
    's18': (8514, 8940),
}
SEG = {k: (a / FPS, b / FPS) for k, (a, b) in FRAMES.items()}

INTENSITY = {
    's1': 0.28, 's2': 0.80, 's3': 0.72, 's4': 0.62, 's5': 0.66, 's6': 0.54,
    's7': 0.84, 's8': 0.70, 's9': 0.64, 's10': 0.74, 's11': 0.86, 's12': 0.72,
    's13': 0.68, 's14': 0.60, 's15': 0.58, 's16': 0.66, 's17': 0.90, 's18': 0.44,
}

VOICE = K.Voicing(
    bpm=126.0,
    pad=1.15, sub=0.28, kick=0.48, snare=0.78, hats=1.40,
    arp=2.10, arp_rate=0.25, arp_gate=0.42,
    reverb_mix=0.30, reverb_decay=0.72,
    pad_bright=2400.0, width_ms=12.0,
    intensity=INTENSITY, seg=SEG,
)


def sfx_transition(dur=0.62, seed=21):
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    band = S.biquad_bp(S.noise(ln, seed), 1450.0, 0.65) * (0.14 + 0.86 * tt) ** 2
    band = S.biquad_hp(band, 300.0)
    tail = S.sine(np.linspace(320, 700, ln), ln)
    return (band * 0.52 + tail * 0.11) * (np.sin(np.pi * tt) ** 1.35) * 0.46


def sfx_reveal(dur=1.15, seed=33):
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    nz = S.biquad_bp(S.noise(ln, seed), 900.0, 0.58) * (tt ** 2)
    tone = sum(S.sine(fq * (0.985 + 0.03 * tt), ln)
               for fq in (S.f('A3'), S.f('E4'), S.f('A4'))) / 3
    cut = int(ln * 0.71)
    env = np.concatenate([np.linspace(0, 1, cut) ** 1.65, np.linspace(1, 0, ln - cut) ** 1.25])
    return (nz * 0.40 + tone * 0.30) * env * 0.52


def sfx_click(bright=1.0, seed=41):
    ln = S.secs(0.075)
    nz = S.biquad_hp(S.noise(ln, seed), 3300.0 * bright)
    return (nz * 0.6 + S.sine(2150.0 * bright, ln) * 0.35) * S.env_ad(ln, 0.0006, 0.07, 4.0) * 0.28


def sfx_patch(seed=63):
    """A TRS jack seating into a patchbay - this part's signature sound."""
    out = np.zeros(S.secs(0.34))
    for off, amp, hp in ((0.0, 1.0, 2200.0), (0.048, 0.78, 3600.0)):
        ln = S.secs(0.05)
        c = S.biquad_hp(S.noise(ln, seed + int(off * 1000)), hp) * S.env_ad(ln, 0.0005, 0.045, 5.0)
        n0 = S.secs(off)
        out[n0:n0 + ln] += c * amp
    body = S.sine(165.0, out.size) * S.env_ad(out.size, 0.002, 0.11, 3.0) * 0.20
    return (out + body) * 0.52


def sfx_net_pulse(dur=1.6, seed=71):
    """The glowing pulse travelling the Cat-6 chain."""
    ln = S.secs(dur)
    out = np.zeros(ln)
    for k in range(3):
        n0 = S.secs(k * 0.32)
        segn = S.secs(0.44)
        if n0 + segn > ln:
            break
        s = np.linspace(0, 1, segn)
        zip_ = S.sine(np.linspace(420 + k * 90, 1500 + k * 160, segn), segn)
        nz = S.biquad_bp(S.noise(segn, seed + k), 2400.0, 1.4) * 0.5
        out[n0:n0 + segn] += (zip_ * 0.5 + nz) * (np.sin(np.pi * s) ** 1.5) * (0.9 - k * 0.12)
    return out * 0.40


def sfx_brand(seed=83):
    ln = S.secs(0.75)
    tt = np.linspace(0, 1, ln)
    tone = (S.sine(S.f('A4'), ln) * 0.5 + S.sine(S.f('E4'), ln) * 0.35
            + S.sine(S.f('A3'), ln) * 0.3)
    env = (1 - np.exp(-tt * 14)) * np.exp(-tt * 3.6)
    return S.schroeder_reverb(tone * env * 0.16, mix=0.4, decay=0.8)


def sound_design():
    fx = np.zeros(K.N)
    for _k, (a, _b) in FRAMES.items():
        if a == 0:
            continue
        K.place(fx, sfx_transition(seed=a % 97), a - 9, 0.8)

    for fr, seed in ((40, 5), (470, 9), (1030, 13), (3050, 17), (3620, 21), (7850, 25)):
        K.place(fx, sfx_reveal(seed=seed), fr, 0.8)

    # patch cables seating over the density and patchbay beats
    for fr in (1060, 1140, 1220, 3640, 3720):
        K.place(fx, sfx_patch(seed=fr % 97), fr, 0.68)

    # the AVB chain pulse in s17
    K.place(fx, sfx_net_pulse(seed=71), 7860, 1.0)

    for fr in (1200, 1240, 4600, 4700, 5120, 5180, 5700, 5760, 7900, 7960):
        K.place(fx, sfx_click(seed=fr % 89), fr, 0.62)

    for fr in (640, 2000, 3400, 4800, 6200, 7600):
        K.place(fx, sfx_brand(seed=fr % 71), fr, 0.9)
    return fx


if __name__ == '__main__':
    ml, mr = K.render_music(VOICE)
    S.write_wav('out/music_long2.wav', S.normalize(ml, 0.80), S.normalize(mr, 0.80))
    fx = sound_design()
    fl, fr = S.haas(fx, ms=8, spread=0.55)
    S.write_wav('out/sfx_long2.wav', S.normalize(fl, 0.72), S.normalize(fr, 0.72))
    S.write_wav('out/bed_long2.wav',
                S.normalize(ml * 0.56 + fl * 0.85, 0.86),
                S.normalize(mr * 0.56 + fr * 0.85, 0.86))
    print(f'long part 2 audio: {K.DUR:.3f}s -> music / sfx / bed')
