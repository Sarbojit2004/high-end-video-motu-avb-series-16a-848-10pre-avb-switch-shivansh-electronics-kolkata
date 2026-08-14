"""
PART 1 - "The Tracking Room" (MOTU 10pre)
Original 88.000s score + sound design. Nothing sampled, nothing licensed.

Music direction (brief s10 / prompt s10): deep synthesised sub-bass, crisp
polyrhythmic hi-hats, evolving ambient pads, wide and pristine. Part 1 carries
the driving, rhythmic, drum-forward groove that belongs to the tracking room.

Arrangement intensity is keyed to the ten voiceover segments in
remotion/src/part1/timeline.ts, so the music lifts and settles with the
picture instead of running underneath it as a loop.
"""
from __future__ import annotations

import numpy as np

import synth as S

FPS = 30
DUR = 88.0
N = S.secs(DUR)
BPM = 120.0
BEAT = 60.0 / BPM          # 0.5 s
BAR = BEAT * 4             # 2.0 s

# Segment boundaries in seconds, from the Remotion timeline (frames / 30).
SEG = {
    's1': (0.0, 9.5), 's2': (9.5, 20.5), 's3': (20.5, 29.0), 's4': (29.0, 40.5),
    's5': (40.5, 49.0), 's6': (49.0, 56.0), 's7': (56.0, 62.5), 's8': (62.5, 69.0),
    's9': (69.0, 79.5), 's10': (79.5, 88.0),
}

# Per-segment arrangement intensity 0..1 -> drives drums / arp / brightness.
INTENSITY = {
    's1': 0.18,   # intro, pad only
    's2': 0.52,   # shared engine - kick + hats arrive
    's3': 0.34,   # the reveal breathes
    's4': 0.86,   # ten preamps - full groove
    's5': 0.78,
    's6': 0.66,
    's7': 0.72,
    's8': 0.62,
    's9': 0.88,   # CueMix montage - busiest
    's10': 0.40,  # resolve into the branding
}


def _seg_curve() -> np.ndarray:
    """Per-sample intensity, smoothed so sections glide rather than step."""
    c = np.zeros(N)
    for k, (a, b) in SEG.items():
        c[S.secs(a):S.secs(b)] = INTENSITY[k]
    # ~0.6 s smoothing
    w = S.secs(0.6)
    kern = np.hanning(w)
    kern /= kern.sum()
    return np.convolve(c, kern, mode='same')


# --------------------------------------------------------------------------- #
# harmony - A natural minor: Am - F - C - G, two bars each
# --------------------------------------------------------------------------- #
PROG = [
    ('A2', ['A3', 'C4', 'E4']),
    ('F2', ['F3', 'A3', 'C4']),
    ('C3', ['C4', 'E4', 'G4']),
    ('G2', ['G3', 'B3', 'D4']),
]


def chord_at(sec: float):
    idx = int(sec // (BAR * 2)) % len(PROG)
    return PROG[idx]


# --------------------------------------------------------------------------- #
# instruments
# --------------------------------------------------------------------------- #

def pad(chan: int = 0, curve: np.ndarray | None = None) -> np.ndarray:
    """Evolving three-voice detuned saw pad, slow filter motion.

    `chan` seeds a genuinely different voicing per side (distinct detune and
    phase), so L and R are decorrelated signals rather than one delayed copy -
    that is what makes the bed read as wide instead of mono.
    """
    out = np.zeros(N)
    step = BAR * 2
    n_steps = int(np.ceil(DUR / step))
    for i in range(n_steps):
        t0 = i * step
        n0 = S.secs(t0)
        n1 = min(N, S.secs(t0 + step + 1.2))   # overlap tails
        ln = n1 - n0
        if ln <= 0:
            continue
        _, notes = chord_at(t0)
        voice = np.zeros(ln)
        dets = (-0.17, 0.02, 0.19) if chan == 0 else (-0.11, -0.03, 0.24)
        for j, nm in enumerate(notes):
            base = S.f(nm)
            for det in dets:
                ph = (j * 0.13 + det) + (0.41 if chan else 0.0)
                voice += S.saw(base * (1 + det / 100.0), ln, phase=ph)
        voice /= (len(notes) * 3)
        e = S.env_adsr(ln, a=0.85, d=0.5, s=0.72, r=1.1)
        out[n0:n1] += voice * e
    # Brightness follows both a slow LFO and the arrangement intensity, so the
    # intro pad is genuinely darker and smaller than the full-groove pad.
    ph = 0.0 if chan == 0 else 0.37
    lfo = 0.5 + 0.5 * np.sin(2 * np.pi * (np.arange(N) / S.SR / 11.0 + ph))
    c = curve if curve is not None else np.ones(N)
    open_amt = np.clip(0.22 + 0.78 * c, 0.0, 1.0) * (0.35 + 0.65 * lfo)
    bright = S.biquad_lp(out, 2100.0)
    dark = S.biquad_lp(out, 430.0)
    return dark * (1 - open_amt) + bright * open_amt


def sub(curve: np.ndarray) -> np.ndarray:
    """Deep sub-bass, one note per half-bar with a soft pluck envelope."""
    out = np.zeros(N)
    step = BEAT * 2
    for i in range(int(np.ceil(DUR / step))):
        t0 = i * step
        root, _ = chord_at(t0)
        n0 = S.secs(t0)
        ln = min(N - n0, S.secs(step * 1.05))
        if ln <= 0:
            continue
        fq = S.f(root)
        body = S.sine(fq, ln) * 0.85 + S.sine(fq * 2, ln) * 0.12
        g = 0.45 + 0.55 * curve[n0]
        out[n0:n0 + ln] += body * S.env_ad(ln, 0.006, step * 0.98, curve=1.7) * g
    return S.soft_clip(out, 1.4) * 0.9


def kick(curve: np.ndarray) -> np.ndarray:
    """Four-on-the-floor with a pitch-dropping sine body."""
    out = np.zeros(N)
    ln = S.secs(0.34)
    tt = S.t(ln)
    pitch = 118.0 * np.exp(-tt * 34.0) + 41.0
    body = np.sin(2 * np.pi * np.cumsum(pitch) / S.SR) * S.env_ad(ln, 0.001, 0.32, 2.2)
    click = S.biquad_hp(S.noise(ln, 7), 1800.0) * S.env_ad(ln, 0.0005, 0.012, 3.0) * 0.25
    hit = body + click
    for i in range(int(DUR / BEAT)):
        t0 = i * BEAT
        n0 = S.secs(t0)
        if n0 + ln > N:
            break
        g = curve[n0]
        if g < 0.30:                       # sparse intro: downbeats only
            if i % 4 != 0:
                continue
            g *= 0.8
        out[n0:n0 + ln] += hit * min(1.0, g * 1.15)
    return out


def snare(curve: np.ndarray) -> np.ndarray:
    """Backbeat layer - filtered noise plus a tuned body."""
    out = np.zeros(N)
    ln = S.secs(0.22)
    nz = S.biquad_bp(S.noise(ln, 11), 1900.0, q=0.9)
    body = S.sine(196.0, ln) * 0.35 + S.sine(263.0, ln) * 0.2
    hit = (nz * 0.8 + body) * S.env_ad(ln, 0.001, 0.20, 2.6)
    for i in range(int(DUR / BEAT)):
        if i % 4 not in (1, 3):
            continue
        n0 = S.secs(i * BEAT)
        if n0 + ln > N:
            break
        g = curve[n0]
        if g < 0.45:
            continue
        out[n0:n0 + ln] += hit * g * 0.62
    return out


def hats(curve: np.ndarray, chan: int = 0) -> np.ndarray:
    """Crisp polyrhythmic hats: straight 16ths plus a 3-against-4 counter-layer.

    `chan` reseeds the noise so the two sides are independent - hats are the
    main width source once sub and kick are locked to the centre.
    """
    out = np.zeros(N)
    sd = 0 if chan == 0 else 100

    def tick(dur: float, seed: int, hp: float, amp: float) -> np.ndarray:
        ln = S.secs(dur)
        n = S.biquad_hp(S.noise(ln, seed), hp)
        return n * S.env_ad(ln, 0.0004, dur * 0.85, 3.4) * amp

    short = tick(0.045, 3 + sd, 7200.0, 0.30)
    open_ = tick(0.16, 5 + sd, 6200.0, 0.24)
    six = BEAT / 4
    for i in range(int(DUR / six)):
        n0 = S.secs(i * six)
        if n0 >= N:
            break
        g = curve[n0]
        if g < 0.34:
            continue
        h = open_ if i % 8 == 6 else short
        accent = 1.0 if i % 4 == 0 else (0.62 if i % 2 == 0 else 0.44)
        ln = min(h.size, N - n0)
        out[n0:n0 + ln] += h[:ln] * accent * g

    # 3-against-4 counter pulse, only when the arrangement is dense
    three = BEAT * 2 / 3
    tk = tick(0.038, 9 + sd, 9000.0, 0.17)
    for i in range(int(DUR / three)):
        n0 = S.secs(i * three)
        if n0 >= N:
            break
        g = curve[n0]
        if g < 0.66:
            continue
        ln = min(tk.size, N - n0)
        out[n0:n0 + ln] += tk[:ln] * (g - 0.4)
    return out


def arp(curve: np.ndarray) -> np.ndarray:
    """Plucked 16th arpeggio - the 'signal moving' figure."""
    out = np.zeros(N)
    step = BEAT / 2
    for i in range(int(DUR / step)):
        t0 = i * step
        n0 = S.secs(t0)
        if n0 >= N:
            break
        g = curve[n0]
        if g < 0.55:
            continue
        _, notes = chord_at(t0)
        nm = notes[[0, 2, 1, 2][i % 4]]
        fq = S.f(nm) * 2.0
        ln = min(N - n0, S.secs(step * 1.6))
        v = (S.tri(fq, ln) * 0.6 + S.saw(fq, ln) * 0.4)
        v = S.biquad_lp(v, 2600.0 + 2200.0 * g)
        out[n0:n0 + ln] += v * S.env_ad(ln, 0.003, step * 1.5, 2.8) * 0.16 * g
    return out


# --------------------------------------------------------------------------- #
# sound design - one purpose-built cue per visual beat
# --------------------------------------------------------------------------- #

def sfx_transition(dur=0.62, up=True, seed=21) -> np.ndarray:
    """Air whoosh for a scene change: swept noise + a short tonal tail."""
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    nz = S.noise(ln, seed)
    band = S.biquad_bp(nz, 1400.0, q=0.7)
    sweep = (tt if up else (1 - tt))
    band *= (0.15 + 0.85 * sweep) ** 2
    band = S.biquad_hp(band, 300.0)
    env = np.sin(np.pi * tt) ** 1.4
    tail = S.sine(np.linspace(320, 640, ln) if up else np.linspace(640, 300, ln), ln)
    return (band * 0.55 + tail * 0.10) * env * 0.5


def sfx_reveal(dur=1.15, seed=33) -> np.ndarray:
    """Macro-to-scale pull-out: rising filtered swell resolving to a soft chord."""
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    nz = S.biquad_bp(S.noise(ln, seed), 900.0, q=0.6) * (tt ** 2)
    tone = np.zeros(ln)
    for fq in (S.f('A3'), S.f('E4'), S.f('A4')):
        tone += S.sine(fq * (0.985 + 0.03 * tt), ln)
    tone /= 3
    env = np.concatenate([np.linspace(0, 1, int(ln * 0.72)) ** 1.7,
                          np.linspace(1, 0, ln - int(ln * 0.72)) ** 1.3])
    return (nz * 0.42 + tone * 0.30) * env * 0.55


def sfx_click(bright=1.0, seed=41) -> np.ndarray:
    """Control-surface tick for a spec chip / UI highlight landing."""
    ln = S.secs(0.075)
    nz = S.biquad_hp(S.noise(ln, seed), 3200.0 * bright)
    tone = S.sine(2100.0 * bright, ln) * 0.35
    return (nz * 0.6 + tone) * S.env_ad(ln, 0.0006, 0.07, 4.0) * 0.30


def sfx_display_wake(dur=0.85, seed=57) -> np.ndarray:
    """A TFT display coming alive - soft power-on shimmer."""
    ln = S.secs(dur)
    tt = np.linspace(0, 1, ln)
    shimmer = np.zeros(ln)
    for k, fq in enumerate((1180.0, 1770.0, 2360.0, 3540.0)):
        shimmer += S.sine(fq * (1 + 0.004 * np.sin(2 * np.pi * tt * (3 + k))), ln) / (k + 2)
    hum = S.sine(120.0, ln) * 0.2 * (1 - tt)
    env = (1 - np.exp(-tt * 9)) * np.exp(-tt * 3.1)
    return (shimmer * 0.24 + hum) * env * 0.42


def sfx_connect(seed=63) -> np.ndarray:
    """A jack / locking XLR tab seating - mechanical two-stage click."""
    out = np.zeros(S.secs(0.30))
    for off, amp, hp in ((0.0, 1.0, 2400.0), (0.052, 0.72, 3800.0)):
        ln = S.secs(0.055)
        c = S.biquad_hp(S.noise(ln, seed + int(off * 1000)), hp)
        c = c * S.env_ad(ln, 0.0005, 0.05, 5.0) * amp
        n0 = S.secs(off)
        out[n0:n0 + ln] += c
    body = S.sine(180.0, out.size) * S.env_ad(out.size, 0.002, 0.10, 3.0) * 0.18
    return (out + body) * 0.5


def place(dst: np.ndarray, src: np.ndarray, frame: int, gain: float = 1.0) -> None:
    """Drop a cue at an exact video frame."""
    n0 = S.secs(frame / FPS)
    ln = min(src.size, dst.size - n0)
    if ln > 0:
        dst[n0:n0 + ln] += src[:ln] * gain


def sound_design() -> np.ndarray:
    """All Part 1 cues, anchored to the frames they punctuate."""
    fx = np.zeros(N)

    # scene changes (segment starts, skipping frame 0)
    for fr in (285, 615, 870, 1215, 1470, 1680, 1875, 2070, 2385):
        place(fx, sfx_transition(up=True, seed=fr % 97), fr - 8, 0.85)

    # macro-to-scale pull-outs resolving to the full unit
    place(fx, sfx_reveal(seed=5), 625, 0.9)     # s3 10pre front
    place(fx, sfx_reveal(seed=9), 880, 0.75)    # s4 rear combos
    place(fx, sfx_reveal(seed=13), 1480, 0.7)   # s6 inserts
    place(fx, sfx_reveal(seed=17), 1690, 0.7)   # s7 headphones

    # TFT displays waking
    place(fx, sfx_display_wake(seed=23), 700, 0.8)
    place(fx, sfx_display_wake(seed=29), 2395, 0.7)

    # connector seating on the combo-input macros
    place(fx, sfx_connect(seed=31), 905, 0.8)
    place(fx, sfx_connect(seed=37), 1500, 0.8)

    # UI ticks - spec chips and CueMix highlights landing
    for fr, b in ((492, 1.0), (508, 1.05), (524, 1.1),        # s2 chips
                  (1084, 1.0), (1134, 1.05),                   # s4 highlight + chips
                  (1923, 1.0), (2183, 1.0),                    # s8 gain, s9 routing
                  (2338, 1.0), (2350, 1.05)):                  # s9 chips
        place(fx, sfx_click(bright=b, seed=fr % 89), fr, 0.7)

    return fx


# --------------------------------------------------------------------------- #

def build() -> None:
    curve = _seg_curve()

    # Level balance is set for phone playback: most viewers hear this on a
    # speaker that rolls off below ~200 Hz, so the sub is kept tight and the
    # musical information lives in the mids and highs.
    pd_l = pad(0, curve) * 1.30
    pd_r = pad(1, curve) * 1.30
    sb = sub(curve) * 0.30
    kk = kick(curve) * 0.52
    sn = snare(curve) * 0.85
    ht_l = hats(curve, 0) * 1.50
    ht_r = hats(curve, 1) * 1.50
    ar = arp(curve) * 1.70

    dyn = 0.30 + 0.70 * curve

    # Sub is shelved off below 30 Hz (inaudible, only eats headroom) and rolled
    # off above 120 Hz so it never masks the pad.
    sb = S.biquad_hp(sb, 30.0)
    sb = S.biquad_lp(sb, 120.0)

    # Low end and the backbeat stay mono - that is what keeps a wide mix from
    # falling apart on a phone speaker. Everything above them is decorrelated.
    centre = sb + (kk + sn) * dyn

    pd_l = S.schroeder_reverb(pd_l, mix=0.34, decay=0.74)
    pd_r = S.schroeder_reverb(pd_r, mix=0.34, decay=0.79)

    ar_l = ar * 0.78
    ar_r = np.pad(ar, (S.secs(0.013), 0))[:N] * 0.78

    left = centre + pd_l + ar_l + ht_l * dyn
    right = centre + pd_r + ar_r * 0.85 + ht_r * dyn

    # Bus tilt: gentle presence lift so the track reads on a small speaker.
    def _tilt(x):
        return x + S.biquad_hp(x, 2200.0) * 0.35 + S.biquad_bp(x, 700.0, q=0.7) * 0.18

    music_l = S.soft_clip(_tilt(left) * 0.46, 1.2)
    music_r = S.soft_clip(_tilt(right) * 0.46, 1.2)
    S.write_wav('out/music_part1.wav', S.normalize(music_l, 0.80), S.normalize(music_r, 0.80))

    fx = sound_design()
    fl, fr_ = S.haas(fx, ms=8, spread=0.55)
    S.write_wav('out/sfx_part1.wav', S.normalize(fl, 0.72), S.normalize(fr_, 0.72))

    # Combined bed. Music sits low so a voiceover can be laid over it without
    # re-balancing; SFX ride slightly above the music.
    bed_l = music_l * 0.58 + fl * 0.85
    bed_r = music_r * 0.58 + fr_ * 0.85
    S.write_wav('out/bed_part1.wav', S.normalize(bed_l, 0.86), S.normalize(bed_r, 0.86))

    print(f'part 1 audio: {DUR:.3f}s @ {S.SR} Hz')
    for nm in ('music_part1', 'sfx_part1', 'bed_part1'):
        print(f'  out/{nm}.wav')


if __name__ == '__main__':
    build()
