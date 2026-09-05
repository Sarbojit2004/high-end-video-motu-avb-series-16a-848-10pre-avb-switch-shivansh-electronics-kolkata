import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FRAMES_PER_BEAT, WIDTH, HEIGHT } from "../data/grid.ts";
import { rgba } from "../design/palette.ts";

/** 0..1 pulse that fires on every beat of the master grid and decays (exp). */
export const beatPulse = (frame: number, decay = 0.09, subdiv = 1): number => {
  const fpb = FRAMES_PER_BEAT / subdiv;
  const phase = ((frame % fpb) + fpb) % fpb;
  return Math.exp(-phase * decay);
};
/** Beat index at a frame (floored). */
export const beatIndex = (frame: number) => Math.floor(frame / FRAMES_PER_BEAT);

const hash = (n: number) => { let x = (n | 0) * 374761393 + 668265263; x = (x ^ (x >>> 13)) * 1274126177; return ((x ^ (x >>> 16)) >>> 0) / 4294967295; };

/**
 * The reel's motion-graphics substrate (brief §1, §5): a gradient field that
 * breathes with the beat, plus thin abstract routing lines with travelling
 * "packets" — energy/connection, never a literal circuit diagram.
 */
export const SignalField: React.FC<{
  bg: string;
  accent: string;
  line: string;
  /** 0..1 how busy the line-work is */
  density?: number;
  /** overall opacity of the line layer */
  lineOpacity?: number;
  /** seed to vary the routing per act */
  seed?: number;
  /** field glow strength */
  glow?: number;
}> = ({ bg, accent, line, density = 0.6, lineOpacity = 0.5, seed = 1, glow = 0.35 }) => {
  const frame = useCurrentFrame();
  const pulse = beatPulse(frame, 0.08);
  const bar = beatPulse(frame, 0.02, 0.25); // 4-beat swell
  const lines = useMemo(() => {
    const n = Math.round(6 + density * 10);
    return Array.from({ length: n }, (_, i) => {
      const r = (k: number) => hash(seed * 1000 + i * 17 + k);
      const y = 200 + r(1) * (HEIGHT - 400);
      const x0 = -100, x1 = WIDTH + 100;
      const kink = 300 + r(2) * (WIDTH - 600);
      const dy = (r(3) - 0.5) * 900;
      return { y, x0, x1, kink, dy, speed: 0.35 + r(4) * 0.9, w: 2 + Math.round(r(5) * 2), phase: r(6), dash: 40 + r(7) * 220 };
    });
  }, [density, seed]);
  const cx = 50 + Math.sin(frame / 240) * 12;
  const cy = 42 + Math.cos(frame / 310) * 10;
  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      {/* breathing signal-meter field */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at ${cx}% ${cy}%, ${rgba(accent, glow * (0.35 + 0.65 * pulse))} 0%, ${rgba(accent, glow * 0.12 * bar)} 35%, transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 0%, ${rgba("#000000", 0.18)} 100%)` }} />
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity: lineOpacity }}>
        <defs>
          <filter id="sfglow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {lines.map((l, i) => {
          const d = `M ${l.x0} ${l.y} L ${l.kink - 140} ${l.y} L ${l.kink} ${l.y + l.dy} L ${l.x1} ${l.y + l.dy}`;
          const len = WIDTH + 200 + Math.abs(l.dy) * 1.2;
          const t = ((frame * l.speed * 3 + l.phase * len) % (len + l.dash)) - l.dash;
          const flash = beatPulse(frame + Math.round(l.phase * 40), 0.12);
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={line} strokeWidth={l.w} opacity={0.22 + 0.14 * pulse} />
              <path d={d} fill="none" stroke={line} strokeWidth={l.w + 6} opacity={0.45 + 0.55 * flash} strokeDasharray={`${l.dash} ${len}`} strokeDashoffset={-t} filter="url(#sfglow)" />
              <path d={d} fill="none" stroke="#ffffff" strokeWidth={l.w} opacity={0.55 + 0.45 * flash} strokeDasharray={`${l.dash * 0.35} ${len}`} strokeDashoffset={-t} />
            </g>
          );
        })}
        {/* node dots that flash on the beat */}
        {lines.slice(0, 7).map((l, i) => (
          <circle key={`n${i}`} cx={l.kink - 140} cy={l.y} r={8 + 10 * beatPulse(frame + i * 5, 0.15)} fill={accent} opacity={0.3 + 0.7 * beatPulse(frame + i * 5, 0.15)} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
