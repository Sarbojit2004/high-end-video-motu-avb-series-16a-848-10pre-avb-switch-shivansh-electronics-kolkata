import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SPACE, hexA } from "../theme";
import { EASE, ramp, rand } from "../lib/anim";

/**
 * The light ground. Present in every scene for the entire 898 s — Section 2's
 * "no exceptions" rule. Built from a very shallow vertical gradient plus an
 * optional accent bloom so the page has depth without ever going dark.
 */
export const Ground: React.FC<{
  bloom?: string;
  bloomX?: number;
  bloomY?: number;
  bloomStrength?: number;
  grid?: boolean;
  /**
   * Flat, near-white page instead of the usual vertical gradient. Used by the
   * full-frame branding beats. Both logos are used exactly as supplied — opaque,
   * with their own white background, never keyed and never boxed — and at the
   * sizes those beats use them (up to 660px wide) even the gradient's 4% step
   * down to paperEdge reads as a faint rectangle behind the artwork, which is
   * the one thing the logo treatment must not do. A flat paperLift page puts the
   * step at ~1%, below the threshold of visibility.
   */
  flat?: boolean;
}> = ({ bloom = COLORS.motuBlue, bloomX = 50, bloomY = 34, bloomStrength = 0.06, grid = false, flat = false }) => (
  <AbsoluteFill
    style={{
      background: flat
        ? COLORS.paperLift
        : `linear-gradient(180deg, ${COLORS.paperLift} 0%, ${COLORS.paper} 46%, ${COLORS.paperEdge} 100%)`,
    }}
  >
    <AbsoluteFill
      style={{
        background: `radial-gradient(58% 46% at ${bloomX}% ${bloomY}%, ${hexA(bloom, bloomStrength)} 0%, ${hexA(bloom, 0)} 70%)`,
      }}
    />
    {grid ? <TechGrid /> : null}
  </AbsoluteFill>
);

/** Faint engineering grid — reads as drafting paper, never as texture noise. */
export const TechGrid: React.FC<{ opacity?: number; size?: number }> = ({
  opacity = 0.4,
  size = 60,
}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      maskImage: "radial-gradient(72% 62% at 50% 46%, #000 0%, transparent 100%)",
      WebkitMaskImage: "radial-gradient(72% 62% at 50% 46%, #000 0%, transparent 100%)",
    }}
  />
);

/** Drifting specular motes — very sparse, keeps large flat areas alive. */
export const Motes: React.FC<{ seed?: number; count?: number; opacity?: number }> = ({
  seed = 3,
  count = 26,
  opacity = 0.5,
}) => {
  const frame = useCurrentFrame();
  const r = rand(seed);
  const dots = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: r() * 100,
        y: r() * 100,
        s: 1.6 + r() * 3.4,
        sp: 0.12 + r() * 0.4,
        ph: r() * Math.PI * 2,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed, count]
  );
  return (
    <AbsoluteFill style={{ opacity }}>
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${d.x}%`,
            top: `${(d.y + Math.sin(frame / 30 * d.sp + d.ph) * 1.4) % 100}%`,
            width: d.s,
            height: d.s,
            borderRadius: "50%",
            background: hexA(COLORS.motuBlue, 0.34),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export type Enter = "fade" | "riseUp" | "wipeRight" | "scaleIn" | "none";

/**
 * Scene wrapper. Handles the beat's own entrance and a light sweep on exit so
 * cuts read as deliberate transitions rather than hard splices.
 */
export const Scene: React.FC<{
  enter?: Enter;
  duration: number;
  bg?: React.ReactNode;
  children: React.ReactNode;
}> = ({ enter = "fade", duration, bg, children }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 0, 22, EASE.out);
  const out = ramp(frame, duration - 14, 14, EASE.inOut);

  let transform = "none";
  let opacity = 1;
  if (enter === "fade") opacity = t;
  if (enter === "riseUp") {
    transform = `translateY(${(1 - t) * 34}px)`;
    opacity = t;
  }
  if (enter === "scaleIn") {
    transform = `scale(${0.985 + t * 0.015})`;
    opacity = t;
  }
  if (enter === "wipeRight") opacity = t;

  return (
    <AbsoluteFill>
      {bg ?? <Ground />}
      <AbsoluteFill style={{ transform, opacity }}>{children}</AbsoluteFill>
      {/* exit bloom — a light lift, never a dark flash */}
      <AbsoluteFill
        style={{ background: COLORS.paperLift, opacity: out * 0.55, pointerEvents: "none" }}
      />
    </AbsoluteFill>
  );
};

/** Standard content frame honouring the 56px inboard safe padding. */
export const Frame: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{
      paddingLeft: SPACE.marginX,
      paddingRight: SPACE.marginX,
      paddingTop: SPACE.marginY,
      paddingBottom: SPACE.marginY,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Thin progress hairline — orients the viewer across a 15-minute runtime. */
export const Progress: React.FC<{ progress: number }> = ({ progress }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 3, background: hexA(COLORS.ink, 0.06) }}>
    <div
      style={{
        height: "100%",
        width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
        background: `linear-gradient(90deg, ${COLORS.motuBlue}, ${COLORS.signalBright})`,
      }}
    />
  </div>
);
