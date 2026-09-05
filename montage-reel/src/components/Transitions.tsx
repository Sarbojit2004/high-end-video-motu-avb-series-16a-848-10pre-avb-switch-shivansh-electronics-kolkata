import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { Dir, Transition } from "../data/timeline.ts";
import { WIDTH, HEIGHT } from "../data/grid.ts";
import { rgba } from "../design/palette.ts";
import { easeInOut, easeOut, clamp01 } from "./Picture.tsx";

/**
 * The six transition types of brief §5, applied as ENTER (incoming shot, on top)
 * and EXIT (outgoing shot, beneath) treatments around a landing beat.
 *   t  = 0 → 1 progress of the incoming move; it lands (t = 1) ON the beat.
 */
const vec = (dir: Dir | undefined): [number, number] => (dir === "l" ? [-1, 0] : dir === "r" ? [1, 0] : dir === "u" ? [0, -1] : dir === "d" ? [0, 1] : [1, 0]);

export const Enter: React.FC<{
  type: Transition;
  /** frame (relative to this shot's sequence) at which the move lands = the beat */
  land: number;
  lead: number;
  dir?: Dir;
  accent: string;
  children: React.ReactNode;
}> = ({ type, land, lead, dir, accent, children }) => {
  const frame = useCurrentFrame();
  const t = lead > 0 ? clamp01((frame - (land - lead)) / lead) : 1;
  const [vx, vy] = vec(dir);
  if (type === "hard" || type === "flash") return <AbsoluteFill>{children}</AbsoluteFill>;
  if (type === "whip") {
    const e = easeInOut(t);
    const off = (1 - e) * 1.0;
    // directional motion blur (SVG, axis-locked) scaled by the instantaneous speed
    const speed = t > 0 && t < 1 ? Math.sin(Math.PI * t) : 0;
    const blur = 70 * speed;
    const id = `whip-in-${land}`;
    return (
      <AbsoluteFill style={{ transform: `translate(${-vx * off * WIDTH}px, ${-vy * off * HEIGHT}px)` }}>
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={vx !== 0 ? `${blur} 0` : `0 ${blur}`} /></filter>
        </svg>
        <AbsoluteFill style={{ filter: blur > 0.5 ? `url(#${id})` : "none" }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (type === "punch") {
    const e = easeOut(t);
    return <AbsoluteFill style={{ opacity: Math.min(1, t * 2.5), transform: `scale(${0.72 + 0.28 * e})` }}>{children}</AbsoluteFill>;
  }
  if (type === "line") {
    const e = easeInOut(t);
    const horizontal = vx !== 0;
    const p = e * 100;
    const clip = horizontal ? (vx > 0 ? `inset(0 ${100 - p}% 0 0)` : `inset(0 0 0 ${100 - p}%)`) : vy > 0 ? `inset(0 0 ${100 - p}% 0)` : `inset(${100 - p}% 0 0 0)`;
    const pos = horizontal ? (vx > 0 ? e * WIDTH : WIDTH - e * WIDTH) : vy > 0 ? e * HEIGHT : HEIGHT - e * HEIGHT;
    return (
      <AbsoluteFill>
        <AbsoluteFill style={{ clipPath: clip, WebkitClipPath: clip }}>{children}</AbsoluteFill>
        {t > 0 && t < 1 ? (
          <div
            style={{
              position: "absolute",
              left: horizontal ? pos - 4 : 0,
              top: horizontal ? 0 : pos - 4,
              width: horizontal ? 8 : WIDTH,
              height: horizontal ? HEIGHT : 8,
              background: accent,
              boxShadow: `0 0 40px 12px ${rgba(accent, 0.9)}, 0 0 140px 40px ${rgba(accent, 0.45)}`,
            }}
          />
        ) : null}
      </AbsoluteFill>
    );
  }
  // glitch: RGB split + sliced offsets for ±3 frames around the beat
  const g = Math.abs(frame - land) <= lead ? 1 - Math.abs(frame - land) / (lead + 1) : 0;
  if (g <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const h = (frame * 7919) % 97;
  const slices = 8;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.9, mixBlendMode: "screen", filter: "saturate(2)", transform: `translateX(${-26 * g}px)` }}>
        <AbsoluteFill style={{ background: "#ff0040", mixBlendMode: "multiply", opacity: 0 }} />
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.9, mixBlendMode: "screen", transform: `translateX(${26 * g}px)` }}>{children}</AbsoluteFill>
      {Array.from({ length: slices }, (_, i) => {
        const top = (i / slices) * 100, bottom = ((i + 1) / slices) * 100;
        const off = (((h * (i + 3)) % 41) - 20) * 3 * g;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${top}% 0 ${100 - bottom}% 0)`, WebkitClipPath: `inset(${top}% 0 ${100 - bottom}% 0)`, transform: `translateX(${off}px)` }}>
            {children}
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ backgroundImage: `repeating-linear-gradient(0deg, ${rgba("#000", 0.35 * g)} 0px, ${rgba("#000", 0.35 * g)} 3px, transparent 3px, transparent 8px)`, mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};

export const Exit: React.FC<{ type: Transition | null; end: number; lead: number; dir?: Dir; children: React.ReactNode }> = ({ type, end, lead, dir, children }) => {
  const frame = useCurrentFrame();
  if (!type || lead <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = clamp01((frame - (end - lead)) / lead);
  const [vx, vy] = vec(dir);
  if (type === "whip") {
    // the outgoing frame is pushed out at the same speed the incoming arrives, with the same axis-locked blur
    const e = easeInOut(t);
    const speed = t > 0 && t < 1 ? Math.sin(Math.PI * t) : 0;
    const blur = 70 * speed;
    const id = `whip-out-${end}`;
    return (
      <AbsoluteFill style={{ transform: `translate(${vx * e * WIDTH}px, ${vy * e * HEIGHT}px)` }}>
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id={id} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={vx !== 0 ? `${blur} 0` : `0 ${blur}`} /></filter>
        </svg>
        <AbsoluteFill style={{ filter: blur > 0.5 ? `url(#${id})` : "none" }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  if (type === "punch") {
    const e = easeInOut(t);
    return <AbsoluteFill style={{ transform: `scale(${1 + 0.22 * e})`, opacity: 1 - e * 0.8 }}>{children}</AbsoluteFill>;
  }
  if (type === "line") {
    return <AbsoluteFill style={{ transform: `scale(${1 + 0.04 * t})`, filter: `brightness(${1 - 0.25 * t})` }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

/** Colour-flash cut: 1–3 frames of solid act colour on top of everything. */
export const Flash: React.FC<{ color: string; frames: number[] }> = ({ color, frames }) => {
  const f = useCurrentFrame();
  const i = frames.indexOf(f);
  if (i < 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: i === 0 ? 1 : 0.65 }} />;
};

/** 2-frame brightness pop on hard cuts so the cut "hits like a clock edge". */
export const HitPop: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < 0 || d > 2) return null;
  return <AbsoluteFill style={{ background: "#fff", opacity: d === 0 ? 0.18 : 0.06, mixBlendMode: "screen" }} />;
};
