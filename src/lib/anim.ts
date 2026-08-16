import { interpolate, spring } from "remotion";

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Ease-out cubic ramp 0→1 over [from, from+dur). */
export const ramp = (frame: number, from: number, dur: number) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    ...CLAMP,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/** Symmetric in/out envelope for a beat of length `total`. */
export const inOut = (frame: number, total: number, inDur = 18, outDur = 16) =>
  Math.min(ramp(frame, 0, inDur), 1 - ramp(frame, total - outDur, outDur));

/** Springy settle used by Tier-1 headlines. */
export const settle = (frame: number, fps: number, delay = 0) =>
  spring({ frame: frame - delay, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 26 });

/** Slow continuous drift for Ken-Burns style motion on stills. */
export const drift = (frame: number, total: number, amount: number) =>
  interpolate(frame, [0, total], [0, amount], CLAMP);

/** Staggered per-item delay helper. */
export const stagger = (i: number, step = 5) => i * step;

/** 0→1 progress across a beat. */
export const progress = (frame: number, total: number) =>
  interpolate(frame, [0, total], [0, 1], CLAMP);

/** Deterministic hash-based pseudo-random in [0,1) for stable "organic" motion. */
export const hash01 = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export { CLAMP };
