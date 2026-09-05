import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { WIDTH, HEIGHT, FPS, ENDING_STOP_SECONDS, actStartFrame } from "../data/grid.ts";
import { ACT_PALETTES, rgba } from "../design/palette.ts";
import { ScriptLine } from "../components/Text.tsx";
import { LogoPair, ContactRow } from "../components/Brand.tsx";
import { beatPulse } from "../components/SignalField.tsx";
import { easeOut, clamp01 } from "../components/Picture.tsx";

/**
 * Act V — branding close (9 beats). Mirrors Act 0: Deep Navy ground, both
 * logos together and static, WhatsApp + website legible for the full act, the
 * script tagline's single use. The Danny hard-stop lands at 1:26.43; the line
 * motif settles to a single still rule on that frame.
 */
export const BrandClose: React.FC<{ tagline: string }> = ({ tagline }) => {
  const frame = useCurrentFrame();
  const p = ACT_PALETTES.act5;
  const stopFrame = Math.round(ENDING_STOP_SECONDS * FPS) - actStartFrame("act5");
  const alive = frame < stopFrame ? 1 : 0;
  const pulse = beatPulse(frame, 0.07) * alive;
  const settle = easeOut(clamp01((frame - stopFrame) / 20));
  const cx = WIDTH / 2;
  const ly = HEIGHT * 0.5;
  const lineW = easeOut(frame / 30) * WIDTH * 0.8;
  return (
    <AbsoluteFill style={{ background: p.bg[0] }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 48%, ${rgba(p.accent, 0.22 * (pulse + settle * 0.35))} 0%, transparent 50%)` }} />
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <line x1={cx - lineW / 2} x2={cx + lineW / 2} y1={ly} y2={ly} stroke={p.accent} strokeWidth={4} opacity={0.4 + 0.6 * pulse + 0.3 * settle} />
        <circle cx={cx} cy={ly} r={12 + 24 * pulse + 6 * settle} fill={p.ink} opacity={0.9} />
      </svg>
      <div style={{ position: "absolute", top: HEIGHT * 0.25, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <LogoPair start={2} width={640} gap={52} />
      </div>
      <div style={{ position: "absolute", top: ly + 140, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <ScriptLine value={tagline} ink={p.ink2} start={10} size={330} />
      </div>
      <div style={{ position: "absolute", top: HEIGHT * 0.66, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 70 }}>
        <ContactRow kind="whatsapp" ink={p.ink} accent={p.accent} start={18} size={92} />
        <ContactRow kind="website" ink={p.ink} accent={p.accent} start={26} size={92} />
      </div>
    </AbsoluteFill>
  );
};
