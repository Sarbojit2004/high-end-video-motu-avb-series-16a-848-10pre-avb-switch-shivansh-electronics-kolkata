import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WIDTH, HEIGHT, FRAMES_PER_BEAT, beatFrame } from "../data/grid.ts";
import { ACT_PALETTES, rgba } from "../design/palette.ts";
import { HeroWord } from "../components/Text.tsx";
import { LogoPair } from "../components/Brand.tsx";
import { beatPulse } from "../components/SignalField.tsx";
import { easeOut, easeInOut, clamp01 } from "../components/Picture.tsx";

/**
 * Act 0 — cold open (9 beats). Black frame; one pulse of light on each clock
 * edge, growing into the reel's line motif; both logos small and top-anchored,
 * held for the whole act; one Alfa Slab word. Ends on the riser into the Act I
 * drop with a hard line-reveal (handled by Act I's first shot).
 */
export const ColdOpen: React.FC<{ text: { value: string; sub?: string } }> = ({ text }) => {
  const frame = useCurrentFrame();
  const p = ACT_PALETTES.act0;
  const beat = frame / FRAMES_PER_BEAT;
  const pulse = beatPulse(frame, 0.07);
  const build = clamp01(beat / 9); // energy rises through the act
  const wordAt = beatFrame(2);
  const cx = WIDTH / 2, cy = HEIGHT * 0.52;
  // expanding rings, one per beat, that fade as they grow
  const rings = Array.from({ length: 9 }, (_, b) => {
    const age = frame - beatFrame(b);
    if (age < 0) return null;
    const r = 60 + age * (9 + b * 1.5);
    const o = Math.max(0, 0.55 - age / 90) * (0.4 + 0.6 * build);
    return { r, o, w: 3 + (b % 4 === 0 ? 3 : 0) };
  });
  const lineLen = easeOut(build) * WIDTH * 0.9;
  const flicker = beat > 7.5 ? 0.5 + 0.5 * beatPulse(frame, 0.3, 4) : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* the signal wakes: black → deep navy as the build rises */}
      <AbsoluteFill style={{ background: p.bg[0], opacity: build * 0.9 }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 52%, ${rgba(p.accent, 0.25 * pulse * (0.3 + build))} 0%, transparent 45%)` }} />
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <defs><filter id="coldglow"><feGaussianBlur stdDeviation="10" /></filter></defs>
        {rings.map((rg, i) => rg ? (
          <g key={i}>
            <circle cx={cx} cy={cy} r={rg.r} fill="none" stroke={p.accent} strokeWidth={rg.w + 8} opacity={rg.o * 0.5} filter="url(#coldglow)" />
            <circle cx={cx} cy={cy} r={rg.r} fill="none" stroke={p.ink} strokeWidth={rg.w} opacity={rg.o} />
          </g>
        ) : null)}
        {/* the signal line: a horizontal rule that grows from the centre pulse */}
        <line x1={cx - lineLen / 2} x2={cx + lineLen / 2} y1={cy} y2={cy} stroke={p.accent} strokeWidth={4} opacity={0.35 + 0.65 * pulse} />
        <line x1={cx - lineLen / 2} x2={cx + lineLen / 2} y1={cy} y2={cy} stroke={p.accent} strokeWidth={14} opacity={0.25 * pulse} filter="url(#coldglow)" />
        {/* travelling packet on the line */}
        <circle cx={cx - lineLen / 2 + ((frame * 22) % Math.max(1, lineLen))} cy={cy} r={12 + 8 * pulse} fill={p.ink} opacity={0.9 * build} />
        <circle cx={cx} cy={cy} r={14 + 26 * pulse} fill={p.ink} opacity={0.9} />
      </svg>
      {/* both logos, small, top-anchored, together for the full act */}
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: easeOut(frame / 20) * flicker }}>
        <LogoPair start={4} width={470} gap={40} />
      </div>
      {/* the one word */}
      <div style={{ position: "absolute", left: 0, right: 0, top: cy + 120, display: "flex", justifyContent: "center", opacity: flicker }}>
        <HeroWord value={text.value} sub={text.sub} ink={p.ink} ink2={p.ink2} start={wordAt} size={560} />
      </div>
      {/* final beat: the frame tightens toward the drop */}
      <AbsoluteFill style={{ transform: `scale(${1 + 0.03 * easeInOut(clamp01((beat - 7) / 2))})` }} />
    </AbsoluteFill>
  );
};
