"""
PART 3 - "The Control Room" (MOTU 848)

Arrangement: expansive, wide-panned and reverb-heavy, underscoring the
spatial-audio monitoring story (brief s10). Slowest tempo of the three, the
most open pad, the sparsest sequencing - the series resolves here.
"""
from __future__ import annotations

import numpy as np

import score_common as K
import synth as S

# Segment boundaries in seconds, from remotion/src/part3/timeline.ts (frames/30).
SEG = {
    's1': (0.0, 6.83), 's2': (6.83, 17.07), 's3': (17.07, 24.87), 's4': (24.87, 36.03),
    's5': (36.03, 44.6), 's6': (44.6, 51.93), 's7': (51.93, 60.97), 's8': (60.97, 69.07),
    's9': (69.07, 78.1), 's10': (78.1, 88.0),
}

INTENSITY = {
    's1': 0.20,   # the room, before anything plays
    's2': 0.74,   # twelve outputs - the central claim
    's3': 0.50,   # one clock, no aggregation
    's4': 0.66,   # four combo inputs
    's5': 0.58,   # inserts
    's6': 0.70,   # monitor control
    's7': 0.80,   # renderer routed to the array
    's8': 0.64,   # the shared engine again
    's9': 0.86,   # the network completes - peak
    's10': 0.34,  # CTA - opens out and resolves
}

VOICE = K.Voicing(
    bpm=112.0,          # slowest of the three
    pad=1.75,           # the pad is the lead voice in this part
    sub=0.30,
    kick=0.44,
    snare=0.62,
    hats=1.05,          # sparser than Parts 1-2
    arp=1.15,
    arp_rate=0.5,       # 8ths - unhurried
    arp_gate=0.62,
    reverb_mix=0.52,    # markedly wetter: the spatial-audio part
    reverb_decay=0.84,
    pad_bright=2600.0,
    width_ms=19.0,      # widest of the three
    intensity=INTENSITY,
    seg=SEG,
)


# --------------------------------------------------------------------------- #
# sound design
# --------------------------------------------------------------------------- #

def sfx_transition(dur=0.72, seed=21) -> np.ndarray:
    """Slower, more cinematic sweep than Parts 1-2."""
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    band = S.biquad_bp(S.noise(ln, seed), 1200.0, 0.6) * (0.12 + 0.88 * tt) ** 2
    band = S.biquad_hp(band, 260.0)
    tail = S.sine(np.linspace(280, 620, ln), ln)
    out = (band * 0.55 + tail * 0.12) * (np.sin(np.pi * tt) ** 1.3) * 0.5
    return S.schroeder_reverb(out, mix=0.34, decay=0.80)


def sfx_reveal(dur=1.35, seed=33) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    nz = S.biquad_bp(S.noise(ln, seed), 820.0, 0.55) * (tt ** 2)
    tone = sum(S.sine(fq * (0.985 + 0.03 * tt), ln)
               for fq in (S.f('A3'), S.f('E4'), S.f('A4'), S.f('C5'))) / 4
    cut = int(ln * 0.70)
    env = np.concatenate([np.linspace(0, 1, cut) ** 1.6, np.linspace(1, 0, ln - cut) ** 1.2])
    return S.schroeder_reverb((nz * 0.40 + tone * 0.34) * env * 0.55, mix=0.40, decay=0.84)


def sfx_click(bright=1.0, seed=41) -> np.ndarray:
    ln = S.secs(0.08)
    nz = S.biquad_hp(S.noise(ln, seed), 3100.0 * bright)
    return (nz * 0.6 + S.sine(2000.0 * bright, ln) * 0.35) * S.env_ad(ln, 0.0006, 0.075, 4.0) * 0.30


def sfx_monitor_switch(seed=63) -> np.ndarray:
    """An A/B/C monitor-select button depressing - a firm, damped switch."""
    ln = S.secs(0.26)
    click = S.biquad_hp(S.noise(ln, seed), 2600.0) * S.env_ad(ln, 0.0004, 0.035, 5.0)
    body = S.sine(148.0, ln) * S.env_ad(ln, 0.0015, 0.095, 3.2) * 0.34
    thunk = S.biquad_lp(S.noise(ln, seed + 1), 420.0) * S.env_ad(ln, 0.001, 0.06, 4.0) * 0.30
    return (click * 0.55 + body + thunk) * 0.52


def sfx_array_sweep(dur=2.0, seed=77) -> np.ndarray:
    """
    A tone traversing the speaker array - the 7.1.4 beat.
    Twelve short bursts stepping upward, each further back in the reverb.
    """
    ln = S.secs(dur)
    out = np.zeros(ln)
    for k in range(12):
        t0 = k * (dur * 0.062)
        n0 = S.secs(t0)
        segn = S.secs(0.30)
        if n0 + segn > ln:
            break
        s = np.linspace(0, 1, segn)
        fq = S.f('A4') * (2 ** (k / 24.0))
        v = (S.sine(fq, segn) * 0.7 + S.tri(fq * 2, segn) * 0.3) * (np.sin(np.pi * s) ** 1.6)
        out[n0:n0 + segn] += v * (0.85 - k * 0.045)
    return S.schroeder_reverb(out * 0.34, mix=0.55, decay=0.86)


def sfx_display_wake(dur=0.9, seed=57) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    sh = sum(
        S.sine(fq * (1 + 0.004 * np.sin(2 * np.pi * tt * (3 + k))), ln) / (k + 2)
        for k, fq in enumerate((1180.0, 1770.0, 2360.0, 3540.0))
    )
    hum = S.sine(120.0, ln) * 0.2 * (1 - tt)
    return (sh * 0.24 + hum) * ((1 - np.exp(-tt * 9)) * np.exp(-tt * 3.0)) * 0.42


def sfx_resolve(dur=3.0, seed=91) -> np.ndarray:
    """The series' closing chord - opens out under the CTA."""
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    tone = np.zeros(ln)
    for fq in (S.f('A2'), S.f('A3'), S.f('C4'), S.f('E4'), S.f('A4')):
        tone += S.sine(fq, ln) * 0.6 + S.saw(fq, ln) * 0.12
    tone /= 5
    env = (1 - np.exp(-tt * 5.0)) * np.exp(-tt * 1.05)
    return S.schroeder_reverb(S.biquad_lp(tone, 3000.0) * env * 0.42, mix=0.55, decay=0.86)


def sound_design() -> np.ndarray:
    fx = np.zeros(K.N)

    for fr in (205, 512, 746, 1081, 1338, 1558, 1829, 2072, 2343):
        K.place(fx, sfx_transition(seed=fr % 97), fr - 9, 0.85)

    # macro-to-scale pull-outs
    K.place(fx, sfx_reveal(seed=5), 215, 0.9)     # s2 twelve outputs
    K.place(fx, sfx_reveal(seed=9), 758, 0.75)    # s4 combo inputs
    K.place(fx, sfx_reveal(seed=13), 1092, 0.72)  # s5 inserts

    # the 7.1.4 array sweep, under the twelve-output claim
    K.place(fx, sfx_array_sweep(seed=77), 300, 0.95)

    # monitor-select buttons depressing on the A/B/C beat
    for i, fr in enumerate((1352, 1392, 1432)):
        K.place(fx, sfx_monitor_switch(seed=63 + i * 7), fr, 0.85)

    # displays waking
    K.place(fx, sfx_display_wake(seed=23), 1726, 0.75)
    K.place(fx, sfx_display_wake(seed=29), 1766, 0.6)

    # UI ticks on highlights and chips
    for fr, b in ((420, 1.0), (438, 1.05), (1210, 1.0), (1605, 1.0),
                  (2006, 1.0), (2020, 1.05)):
        K.place(fx, sfx_click(bright=b, seed=fr % 89), fr, 0.7)

    # the close
    K.place(fx, sfx_resolve(seed=91), 2352, 1.0)

    return fx


if __name__ == '__main__':
    K.write_part(3, K.render_music(VOICE), sound_design())
