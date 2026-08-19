import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SAFE, hexA } from "../theme";
import { EASE, ramp, rand } from "../lib/anim";

/**
 * The light ground. Present in every scene for the whole 178 s — Section 2's
 * "no exceptions" rule. Near-white so the logos' own white background reads as
 * continuous with the page (Section 7's no-box requirement).
 */
export const Ground: React.FC<{
  bloom?: string;
  bloomX?: number;
  bloomY?: number;
  bloomStrength?: number;
  grid?: boolean;
  flat?: boolean;
}> = ({
  bloom = COLORS.motuBlue, bloomX = 50, bloomY = 30,
  bloomStrength = 0.07, grid = false, flat = false,
}) => (
  <AbsoluteFill
    style={{
      background: flat
        ? COLORS.paperLift
        : `linear-gradient(180deg, ${COLORS.paperLift} 0%, ${COLORS.paper} 48%, ${COLORS.paperEdge} 100%)`,
    }}
  >
    <AbsoluteFill
      style={{
        background: `radial-gradient(62% 34% at ${bloomX}% ${bloomY}%, ${hexA(bloom, bloomStrength)} 0%, ${hexA(bloom, 0)} 72%)`,
      }}
    />
    {grid ? <TechGrid /> : null}
  </AbsoluteFill>
);

/** Faint engineering grid — drafting paper, never texture noise. */
export const TechGrid: React.FC<{ opacity?: number; size?: number }> = ({
  opacity = 0.45, size = 54,
}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      maskImage: "radial-gradient(70% 52% at 50% 44%, #000 0%, transparent 100%)",
      WebkitMaskImage: "radial-gradient(70% 52% at 50% 44%, #000 0%, transparent 100%)",
    }}
  />
);

/** Sparse drifting motes so large flat areas stay alive at reel pace. */
export const Motes: React.FC<{ seed?: number; count?: number; opacity?: number }> = ({
  seed = 3, count = 20, opacity = 0.45,
}) => {
  const frame = useCurrentFrame();
  const r = rand(seed);
  const dots = React.useMemo(
    () => Array.from({ length: count }, () => ({
      x: r() * 100, y: r() * 100, s: 1.6 + r() * 3.2,
      sp: 0.12 + r() * 0.4, ph: r() * Math.PI * 2,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, count]
  );
  return (
    <AbsoluteFill style={{ opacity }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: `${d.x}%`,
          top: `${(d.y + Math.sin((frame / 30) * d.sp + d.ph) * 1.4) % 100}%`,
          width: d.s, height: d.s, borderRadius: "50%",
          background: hexA(COLORS.motuBlue, 0.34),
        }} />
      ))}
    </AbsoluteFill>
  );
};

export type Enter = "fade" | "rise" | "pushUp" | "pushLeft" | "scaleIn";

/**
 * Scene shell. Background renders untransformed and full-bleed so every cut is
 * seamless; the content layer gets a kinetic entrance. Reel pace wants shorter,
 * punchier entrances than the long format — 12 frames, not 22.
 */
export const Scene: React.FC<{
  enter?: Enter;
  duration: number;
  bg?: React.ReactNode;
  children: React.ReactNode;
}> = ({ enter = "rise", duration, bg, children }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 0, 12, EASE.out);
  const out = ramp(frame, duration - 9, 9, EASE.inOut);

  let transform = "none";
  if (enter === "rise") transform = `translateY(${(1 - t) * 40}px)`;
  if (enter === "pushUp") transform = `translateY(${(1 - t) * 84}px)`;
  if (enter === "pushLeft") transform = `translateX(${(1 - t) * 72}px)`;
  if (enter === "scaleIn") transform = `scale(${0.975 + t * 0.025})`;

  return (
    <AbsoluteFill>
      {bg ?? <Ground />}
      <AbsoluteFill style={{ transform, opacity: t }}>{children}</AbsoluteFill>
      {/* exit lift — a light bloom, never a dark flash */}
      <AbsoluteFill style={{ background: COLORS.paperLift, opacity: out * 0.5, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

/**
 * Content frame honouring the caption-safe zone: nothing inside this box can
 * land under platform UI. Section 2 — top 180px, bottom 220px, 64px inboard.
 */
export const Frame: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{
      paddingLeft: SAFE.marginX,
      paddingRight: SAFE.marginX,
      paddingTop: SAFE.top,
      paddingBottom: SAFE.bottom,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/**
 * Pins media into a flex slot. A bare `height: 100%` inside a flex item
 * resolves against the flex CONTAINER, not the item, and grid `1fr` tracks take
 * an `auto` minimum from their content — both push images clean out of the safe
 * zone. Absolute positioning inside a relative slot is exact.
 */
export const Fill: React.FC<{ children: React.ReactNode; grow?: number }> = ({
  children, grow = 1,
}) => (
  <div style={{ flex: grow, minHeight: 0, minWidth: 0, position: "relative" }}>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);

/** Thin progress hairline, pinned below the safe zone so it never covers text. */
export const Progress: React.FC<{ progress: number }> = ({ progress }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 4, background: hexA(COLORS.ink, 0.06) }}>
    <div style={{
      height: "100%",
      width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
      background: `linear-gradient(90deg, ${COLORS.motuBlue}, ${COLORS.signalBright})`,
    }} />
  </div>
);
