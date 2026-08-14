"""
LONG-FORM PART 1 - "The Tracking Room" (MOTU 10pre)
Original 298.000s score + sound design.

Same sonic identity as the reel series (A minor, i-VI-III-VII, same palette) so
the two formats read as one campaign, but arranged for a five-minute runtime:
the shared-engine passage sits low and patient, the product segments lift, and
the arrangement breathes rather than driving continuously as an 88 s reel can.
"""
from __future__ import annotations

import numpy as np

import score_common as K
import synth as S

K.set_duration(298.0)

FPS = 30

# Segment boundaries in frames, mirroring src/long/part1/timeline.ts.
FRAMES = {
    's1': (0, 429),      's2': (429, 965),    's3': (965, 1537),
    's4': (1537, 1907),  's5': (1907, 2455),  's6': (2455, 2980),
    's7': (2980, 3469),  's8': (3469, 3993),  's9': (3993, 4696),
    's10': (4696, 5173), 's11': (5173, 5650), 's12': (5650, 6198),
    's13': (6198, 6615), 's14': (6615, 7044), 's15': (7044, 7533),
    's16': (7533, 8010), 's17': (8010, 8368), 's18': (8368, 8940),
}
SEG = {k: (a / FPS, b / FPS) for k, (a, b) in FRAMES.items()}

INTENSITY = {
    's1': 0.26,   # series open
    's2': 0.38,   # the problem - restrained
    's3': 0.58,   # ESS conversion
    's4': 0.66,   # Thunderbolt / latency
    's5': 0.70,   # CueMix DSP
    's6': 0.74,   # Milan AVB - engine passage peaks
    's7': 0.52,   # 10pre reveal - pulls back so the hardware lands
    's8': 0.84,   # ten preamps
    's9': 0.62,   # the split - a talking beat, music steps back
    's10': 0.70,  # inserts
    's11': 0.60,  # gain calibration
    's12': 0.76,  # dual headphones
    's13': 0.72,  # DC-coupled outs
    's14': 0.64,  # display
    's15': 0.82,  # patchbay
    's16': 0.74,  # EQ / dynamics
    's17': 0.68,  # wireless
    's18': 0.44,  # close
}

VOICE = K.Voicing(
    bpm=120.0,
    pad=1.45,          # more pad than the reel: five minutes needs air
    sub=0.28,
    kick=0.46,
    snare=0.72,
    hats=1.30,
    arp=1.55,
    arp_rate=0.5,
    arp_gate=0.58,
    reverb_mix=0.38,
    reverb_decay=0.78,
    pad_bright=2200.0,
    width_ms=15.0,
    intensity=INTENSITY,
    seg=SEG,
)


# --------------------------------------------------------------------------- #
# sound design
# --------------------------------------------------------------------------- #

def sfx_transition(dur=0.68, seed=21) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    band = S.biquad_bp(S.noise(ln, seed), 1300.0, 0.65) * (0.14 + 0.86 * tt) ** 2
    band = S.biquad_hp(band, 280.0)
    tail = S.sine(np.linspace(300, 660, ln), ln)
    return (band * 0.52 + tail * 0.11) * (np.sin(np.pi * tt) ** 1.35) * 0.46


def sfx_reveal(dur=1.30, seed=33) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    nz = S.biquad_bp(S.noise(ln, seed), 880.0, 0.58) * (tt ** 2)
    tone = sum(S.sine(fq * (0.985 + 0.03 * tt), ln)
               for fq in (S.f('A3'), S.f('E4'), S.f('A4'))) / 3
    cut = int(ln * 0.71)
    env = np.concatenate([np.linspace(0, 1, cut) ** 1.65, np.linspace(1, 0, ln - cut) ** 1.25])
    return (nz * 0.40 + tone * 0.30) * env * 0.52


def sfx_click(bright=1.0, seed=41) -> np.ndarray:
    ln = S.secs(0.075)
    nz = S.biquad_hp(S.noise(ln, seed), 3200.0 * bright)
    return (nz * 0.6 + S.sine(2100.0 * bright, ln) * 0.35) * S.env_ad(ln, 0.0006, 0.07, 4.0) * 0.28


def sfx_connect(seed=63) -> np.ndarray:
    """A locking XLR tab seating - two-stage mechanical click."""
    out = np.zeros(S.secs(0.32))
    for off, amp, hp in ((0.0, 1.0, 2400.0), (0.054, 0.74, 3800.0)):
        ln = S.secs(0.055)
        c = S.biquad_hp(S.noise(ln, seed + int(off * 1000)), hp) * S.env_ad(ln, 0.0005, 0.05, 5.0)
        n0 = S.secs(off)
        out[n0:n0 + ln] += c * amp
    body = S.sine(178.0, out.size) * S.env_ad(out.size, 0.002, 0.10, 3.0) * 0.18
    return (out + body) * 0.50


def sfx_display_wake(dur=0.9, seed=57) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    sh = sum(
        S.sine(fq * (1 + 0.004 * np.sin(2 * np.pi * tt * (3 + k))), ln) / (k + 2)
        for k, fq in enumerate((1180.0, 1770.0, 2360.0, 3540.0))
    )
    hum = S.sine(120.0, ln) * 0.2 * (1 - tt)
    return (sh * 0.24 + hum) * ((1 - np.exp(-tt * 9)) * np.exp(-tt * 3.0)) * 0.40


def sfx_knob(seed=71) -> np.ndarray:
    """A detented gain knob stepping - the 1 dB increment beat."""
    out = np.zeros(S.secs(1.1))
    for i in range(7):
        n0 = S.secs(0.06 + i * 0.135)
        ln = S.secs(0.03)
        if n0 + ln > out.size:
            break
        tick = S.biquad_bp(S.noise(ln, seed + i), 4200.0, 3.0) * S.env_ad(ln, 0.0004, 0.026, 5.0)
        out[n0:n0 + ln] += tick * (0.85 - i * 0.04)
    return out * 0.55


def sfx_brand(seed=83) -> np.ndarray:
    """Soft mark for a recurring branding appearance - felt, not announced."""
    ln = S.secs(0.75)
    tt = np.linspace(0, 1, ln)
    tone = (S.sine(S.f('A4'), ln) * 0.5 + S.sine(S.f('E4'), ln) * 0.35
            + S.sine(S.f('A3'), ln) * 0.3)
    env = (1 - np.exp(-tt * 14)) * np.exp(-tt * 3.6)
    return S.schroeder_reverb(tone * env * 0.16, mix=0.4, decay=0.8)


def sound_design() -> np.ndarray:
    fx = np.zeros(K.N)
    place = K.place

    # one sweep per segment change
    for k, (a, _b) in FRAMES.items():
        if a == 0:
            continue
        place(fx, sfx_transition(seed=a % 97), a - 9, 0.8)

    # macro-to-scale pull-outs, at the frame each reveal resolves
    for fr, seed in ((60, 5), (1010, 9), (2500, 13), (3020, 17),
                     (3510, 21), (4240, 25), (4720, 29), (6222, 33)):
        place(fx, sfx_reveal(seed=seed), fr, 0.8)

    # connectors seating on the combo-input and insert macros
    place(fx, sfx_connect(seed=31), 3500, 0.75)
    place(fx, sfx_connect(seed=37), 4740, 0.75)

    # the detented gain knob under the 1 dB passage
    place(fx, sfx_knob(seed=71), 5240, 0.8)

    # displays waking
    place(fx, sfx_display_wake(seed=23), 6650, 0.75)
    place(fx, sfx_display_wake(seed=29), 6700, 0.55)

    # UI ticks on CueMix highlights and spec chips
    for fr, b in ((1290, 1.0), (1320, 1.05), (1350, 1.1),
                  (1750, 1.0), (1990, 1.0), (2160, 1.05),
                  (2790, 1.0), (3760, 1.0), (5000, 1.0),
                  (7130, 1.0), (7200, 1.05), (7800, 1.0)):
        place(fx, sfx_click(bright=b, seed=fr % 89), fr, 0.62)

    # recurring Shivansh lower-thirds (LOWER_THIRDS in LongPart1.tsx)
    for fr in (700, 2100, 3600, 5000, 6400, 7700):
        place(fx, sfx_brand(seed=fr % 71), fr, 0.9)

    return fx


if __name__ == '__main__':
    music = K.render_music(VOICE)
    fx = sound_design()
    ml, mr = music
    S.write_wav('out/music_long1.wav', S.normalize(ml, 0.80), S.normalize(mr, 0.80))
    fl, fr = S.haas(fx, ms=8, spread=0.55)
    S.write_wav('out/sfx_long1.wav', S.normalize(fl, 0.72), S.normalize(fr, 0.72))
    S.write_wav(
        'out/bed_long1.wav',
        S.normalize(ml * 0.56 + fl * 0.85, 0.86),
        S.normalize(mr * 0.56 + fr * 0.85, 0.86),
    )
    print(f'long part 1 audio: {K.DUR:.3f}s @ {S.SR} Hz -> music / sfx / bed')
