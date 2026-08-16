import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { COLORS } from "../theme";
import * as F from "../fonts";
import { ramp, settle, stagger, CLAMP } from "../lib/anim";

/**
 * Tier 1 — HEADLINE. Mask-up reveal per line, then a spring settle.
 * Reserved for the product name plus its defining ecosystem trait.
 */
export const Headline: React.FC<{
  lines: string[];
  size?: number;
  color?: string;
  delay?: number;
  weight?: number;
  align?: "left" | "center";
  lineStep?: number;
}> = ({
  lines,
  size = F.T1_HEADLINE,
  color = COLORS.ink,
  delay = 0,
  weight = 700,
  align = "left",
  lineStep = 7,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ width: "100%", textAlign: align }}>
      {lines.map((ln, i) => {
        const d = delay + stagger(i, lineStep);
        const s = settle(frame, fps, d);
        const y = interpolate(s, [0, 1], [size * 0.9, 0]);
        return (
          <div key={i} style={{ overflow: "hidden", paddingBottom: size * 0.06 }}>
            <div
              style={{
                ...F.headline(size, color, weight),
                transform: `translateY(${y}px)`,
                opacity: ramp(frame, d, 8),
                whiteSpace: "pre",
              }}
            >
              {ln}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Tier 2 — SUBHEADLINE. Fade + 18px rise. Contextual narrative. */
export const Sub: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  weight?: number;
  maxWidth?: number | string;
  align?: "left" | "center";
}> = ({
  children,
  size = F.T2_SUB,
  color = COLORS.inkSoft,
  delay = 0,
  weight = 500,
  maxWidth = "100%",
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 16);
  return (
    <div
      style={{
        ...F.sub(size, color, weight),
        maxWidth,
        textAlign: align,
        opacity: a,
        transform: `translateY(${(1 - a) * 18}px)`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Tier 3 — SPEC NUMERALS. Odometer count-up for anything numeric, so verified
 * figures land as an event rather than appearing all at once.
 */
export const SpecNumber: React.FC<{
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  size?: number;
  color?: string;
  delay?: number;
  dur?: number;
}> = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  size = F.T3_SPEC,
  color = COLORS.ink,
  delay = 0,
  dur = 26,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + dur], [0, 1], {
    ...CLAMP,
    easing: (x) => 1 - Math.pow(1 - x, 4),
  });
  const shown = (value * t).toFixed(decimals);
  return (
    <span style={{ ...F.spec(size, color), opacity: ramp(frame, delay, 6) }}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
};

/** Tier 3 — static spec text (non-numeric or pre-formatted). */
export const Spec: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
}> = ({ children, size = F.T3_SPEC, color = COLORS.ink, delay = 0 }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 14);
  return (
    <div style={{ ...F.spec(size, color), opacity: a, transform: `translateY(${(1 - a) * 12}px)` }}>
      {children}
    </div>
  );
};

/** Tier 4 — MICRO LABEL. Wipes in from the left behind a clip mask. */
export const Micro: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  tracking?: string;
  weight?: number;
}> = ({
  children,
  size = F.T4_MICRO,
  color = COLORS.graphite,
  delay = 0,
  tracking = "0.24em",
  weight = 700,
}) => {
  const frame = useCurrentFrame();
  const w = ramp(frame, delay, 14);
  return (
    <div
      style={{
        ...F.micro(size, color, weight, tracking),
        clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`,
        opacity: ramp(frame, delay, 6),
      }}
    >
      {children}
    </div>
  );
};

/** Tier 5 — CTA. Scale-in 0.96→1, the last and most important element. */
export const Cta: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  align?: "left" | "center";
}> = ({ children, size = F.T5_CTA, color = COLORS.ink, delay = 0, align = "left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = settle(frame, fps, delay);
  return (
    <div
      style={{
        ...F.cta(size, color),
        width: "100%",
        textAlign: align,
        opacity: ramp(frame, delay, 10),
        transform: `scale(${interpolate(s, [0, 1], [0.96, 1])})`,
        transformOrigin: align === "center" ? "50% 50%" : "0% 50%",
      }}
    >
      {children}
    </div>
  );
};

/** Support body text. */
export const Body: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  weight?: number;
  maxWidth?: number | string;
  align?: "left" | "center";
}> = ({
  children,
  size = 30,
  color = COLORS.inkSoft,
  delay = 0,
  weight = 500,
  maxWidth = "100%",
  align = "left",
}) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 14);
  return (
    <div
      style={{
        ...F.body(size, color, weight),
        maxWidth,
        textAlign: align,
        opacity: a,
        transform: `translateY(${(1 - a) * 12}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Hairline rule that draws itself out from the left. */
export const Rule: React.FC<{ delay?: number; color?: string; width?: number | string; thickness?: number }> = ({
  delay = 0,
  color = COLORS.lineStrong,
  width = "100%",
  thickness = 2,
}) => {
  const frame = useCurrentFrame();
  const w = ramp(frame, delay, 20);
  return (
    <div style={{ width, height: thickness, background: color, transform: `scaleX(${w})`, transformOrigin: "0% 50%" }} />
  );
};

/** Small uppercase chip — used for chapter marks and spec tags. */
export const Chip: React.FC<{
  children: React.ReactNode;
  delay?: number;
  bg?: string;
  fg?: string;
  border?: string;
}> = ({ children, delay = 0, bg = COLORS.paperLift, fg = COLORS.inkSoft, border = COLORS.lineStrong }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 12);
  return (
    <div
      style={{
        ...F.micro(22, fg, 700, "0.2em"),
        display: "inline-block",
        padding: "12px 22px",
        borderRadius: 999,
        background: bg,
        border: `2px solid ${border}`,
        opacity: a,
        transform: `translateY(${(1 - a) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};
