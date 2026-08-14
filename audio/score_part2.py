"""
PART 2 - "The Patchbay" (MOTU 16A)

Arrangement: a tightly sequenced arpeggio carries this part, standing in for
complex patchbay routing (brief s10). Faster tempo and 16th-note sequencing
than Part 1, matching the punchier edit the brief's timing logic calls for.
"""
from __future__ import annotations

import numpy as np

import score_common as K
import synth as S

# Segment boundaries in seconds, from remotion/src/part2/timeline.ts (frames/30).
SEG = {
    's1': (0.0, 8.0), 's2': (8.0, 16.1), 's3': (16.1, 22.5), 's4': (22.5, 32.1),
    's5': (32.1, 40.9), 's6': (40.9, 48.4), 's7': (48.4, 56.9), 's8': (56.9, 64.5),
    's9': (64.5, 74.7), 's10': (74.7, 88.0),
}

INTENSITY = {
    's1': 0.24,   # hook
    's2': 0.80,   # sixteen in / sixteen out - arrives hard
    's3': 0.62,   # dual displays
    's4': 0.55,   # no preamps, by design
    's5': 0.84,   # DC-coupled / modular CV - most sequenced
    's6': 0.70,   # ADAT
    's7': 0.76,   # software patchbay
    's8': 0.72,   # per-channel DSP
    's9': 0.90,   # AVB daisy-chain - peak
    's10': 0.46,  # resolve into branding
}

VOICE = K.Voicing(
    bpm=126.0,          # a touch quicker than Part 1's 120
    pad=1.05,
    sub=0.30,
    kick=0.50,
    snare=0.80,
    hats=1.45,
    arp=2.35,           # the arpeggio is the lead voice here
    arp_rate=0.25,      # 16ths - tightly sequenced
    arp_gate=0.40,      # plays across most of the part
    reverb_mix=0.28,    # drier than Part 3, keeps the sequence articulate
    reverb_decay=0.70,
    pad_bright=2400.0,
    width_ms=11.0,
    intensity=INTENSITY,
    seg=SEG,
)


# --------------------------------------------------------------------------- #
# sound design - one purpose-built cue per visual beat
# --------------------------------------------------------------------------- #

def sfx_transition(dur=0.55, seed=21) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    band = S.biquad_bp(S.noise(ln, seed), 1500.0, 0.7) * (0.15 + 0.85 * tt) ** 2
    band = S.biquad_hp(band, 320.0)
    tail = S.sine(np.linspace(340, 700, ln), ln)
    return (band * 0.55 + tail * 0.10) * (np.sin(np.pi * tt) ** 1.4) * 0.5


def sfx_reveal(dur=1.05, seed=33) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    nz = S.biquad_bp(S.noise(ln, seed), 950.0, 0.6) * (tt ** 2)
    tone = sum(S.sine(fq * (0.985 + 0.03 * tt), ln) for fq in (S.f('A3'), S.f('E4'), S.f('A4'))) / 3
    cut = int(ln * 0.72)
    env = np.concatenate([np.linspace(0, 1, cut) ** 1.7, np.linspace(1, 0, ln - cut) ** 1.3])
    return (nz * 0.42 + tone * 0.30) * env * 0.55


def sfx_click(bright=1.0, seed=41) -> np.ndarray:
    ln = S.secs(0.07)
    nz = S.biquad_hp(S.noise(ln, seed), 3400.0 * bright)
    return (nz * 0.6 + S.sine(2200.0 * bright, ln) * 0.35) * S.env_ad(ln, 0.0006, 0.065, 4.0) * 0.30


def sfx_patch(seed=63) -> np.ndarray:
    """A TRS jack seating into a patchbay - the signature sound of this part."""
    out = np.zeros(S.secs(0.34))
    for off, amp, hp in ((0.0, 1.0, 2200.0), (0.048, 0.78, 3600.0)):
        ln = S.secs(0.05)
        c = S.biquad_hp(S.noise(ln, seed + int(off * 1000)), hp) * S.env_ad(ln, 0.0005, 0.045, 5.0)
        n0 = S.secs(off)
        out[n0:n0 + ln] += c * amp
    body = S.sine(165.0, out.size) * S.env_ad(out.size, 0.002, 0.11, 3.0) * 0.20
    return (out + body) * 0.52


def sfx_net_pulse(dur=1.5, seed=71) -> np.ndarray:
    """The glowing pulse travelling the Cat-6 cable: a rising filtered zip."""
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    # three staged bursts, one per hop in the chain
    out = np.zeros(ln)
    for k in range(3):
        t0 = k * 0.30
        seg = S.secs(0.42)
        n0 = S.secs(t0)
        if n0 + seg > ln:
            break
        s = np.linspace(0, 1, seg)
        zip_ = S.sine(np.linspace(420 + k * 90, 1500 + k * 160, seg), seg)
        nz = S.biquad_bp(S.noise(seg, seed + k), 2400.0, 1.4) * 0.5
        out[n0:n0 + seg] += (zip_ * 0.5 + nz) * (np.sin(np.pi * s) ** 1.5) * (0.9 - k * 0.12)
    return out * 0.40


def sfx_display_wake(dur=0.8, seed=57) -> np.ndarray:
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    sh = sum(
        S.sine(fq * (1 + 0.004 * np.sin(2 * np.pi * tt * (3 + k))), ln) / (k + 2)
        for k, fq in enumerate((1180.0, 1770.0, 2360.0, 3540.0))
    )
    hum = S.sine(120.0, ln) * 0.2 * (1 - tt)
    return (sh * 0.24 + hum) * ((1 - np.exp(-tt * 9)) * np.exp(-tt * 3.1)) * 0.42


def sound_design() -> np.ndarray:
    fx = np.zeros(K.N)

    # scene changes
    for fr in (240, 483, 675, 963, 1227, 1452, 1707, 1935, 2241):
        K.place(fx, sfx_transition(seed=fr % 97), fr - 7, 0.85)

    # macro-to-scale pull-outs
    K.place(fx, sfx_reveal(seed=5), 250, 0.85)    # s2 TRS jack rows
    K.place(fx, sfx_reveal(seed=9), 492, 0.75)    # s3 display macro
    K.place(fx, sfx_reveal(seed=13), 1236, 0.75)  # s6 word clock / rear

    # patch-cable seating on the density beats
    for fr in (300, 360, 420):
        K.place(fx, sfx_patch(seed=fr), fr, 0.7)
    K.place(fx, sfx_patch(seed=1100), 1090, 0.65)   # s5 modular CV

    # displays waking on the dual-TFT beat
    K.place(fx, sfx_display_wake(seed=23), 560, 0.8)
    K.place(fx, sfx_display_wake(seed=29), 600, 0.6)

    # the AVB daisy-chain pulse, timed to the motif animation in s9
    K.place(fx, sfx_net_pulse(seed=71), 1962, 1.0)

    # UI ticks on highlights and chips
    for fr, b in ((430, 1.0), (452, 1.05), (1330, 1.0), (1500, 1.0),
                  (1530, 1.05), (1755, 1.0), (1790, 1.05), (2120, 1.0)):
        K.place(fx, sfx_click(bright=b, seed=fr % 89), fr, 0.7)

    return fx


if __name__ == '__main__':
    K.write_part(2, K.render_music(VOICE), sound_design())
