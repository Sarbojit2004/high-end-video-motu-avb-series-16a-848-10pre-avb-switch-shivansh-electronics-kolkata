import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, hexA } from "../theme";
import { headline, subhead, spec, micro, editorial } from "../fonts";
import { EASE, ramp, countUp, group } from "../lib/anim";

/** Staggered rise-in used by every text element so beats feel authored. */
export const Rise: React.FC<{
  delay?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 22, children, style }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 20, EASE.out);
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * y}px)`, ...style }}>{children}</div>
  );
};

/** Small uppercase kicker with a leading accent rule. */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  color?: string;
  accent?: string;
  size?: number;
  delay?: number;
}> = ({ children, color = COLORS.slate, accent = COLORS.motuBlue, size = 30, delay = 0 }) => (
  <Rise delay={delay} y={12}>
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 52, height: 5, background: accent, borderRadius: 3 }} />
      <span style={{ ...micro(size, 700, "0.2em"), color }}>{children}</span>
    </div>
  </Rise>
);

/** Stage 10 headline tier. Section 8b floor: never below 96px here. */
export const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size = 112, color = COLORS.ink, delay = 6, weight = 800, style }) => (
  <Rise delay={delay} y={28}>
    <div style={{ ...headline(size, weight), color, ...style }}>{children}</div>
  </Rise>
);

/** Stage 10 subheadline tier — muted slate, contextual. */
export const Subhead: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  maxWidth?: number;
}> = ({ children, size = 42, color = COLORS.slate, delay = 16, maxWidth = 940 }) => (
  <Rise delay={delay} y={18}>
    <div style={{ ...subhead(size), color, maxWidth }}>{children}</div>
  </Rise>
);

/** Editorial serif statement — Hook/Problem and Transformation beats only. */
export const Editorial: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  delay?: number;
  maxWidth?: number;
  italic?: boolean;
}> = ({ children, size = 84, color = COLORS.ink, delay = 8, maxWidth = 940, italic = false }) => (
  <Rise delay={delay} y={26}>
    <div style={{ ...editorial(size), color, maxWidth, fontStyle: italic ? "italic" : "normal" }}>
      {children}
    </div>
  </Rise>
);

/**
 * Stage 10 specification callout. Tracked, tabular numerals, on a light chip
 * so it reads as hard engineering data rather than marketing copy.
 */
export const SpecChip: React.FC<{
  label: string;
  value: string;
  delay?: number;
  accent?: string;
  size?: number;
}> = ({ label, value, delay = 0, accent = COLORS.motuBlue, size = 54 }) => (
  <Rise delay={delay} y={16}>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "20px 28px",
        background: COLORS.paperLift,
        border: `1px solid ${COLORS.line}`,
        borderLeft: `5px solid ${accent}`,
        borderRadius: 14,
        boxShadow: `0 2px 10px ${COLORS.shadow}`,
      }}
    >
      <span style={{ ...micro(24, 700, "0.16em"), color: COLORS.slate }}>{label}</span>
      <span style={{ ...spec(size, 800, "0.005em"), color: COLORS.ink, lineHeight: 1.05 }}>{value}</span>
    </div>
  </Rise>
);

/** Animated counter — Stage 10's "numbers build visual momentum". */
export const Counter: React.FC<{
  to: number;
  suffix?: string;
  prefix?: string;
  start?: number;
  len?: number;
  size?: number;
  color?: string;
}> = ({ to, suffix = "", prefix = "", start = 6, len = 34, size = 112, color = COLORS.ink }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ ...spec(size, 800, "-0.01em"), color }}>
      {prefix}
      {group(countUp(frame, start, len, to))}
      {suffix}
    </span>
  );
};

/**
 * Micro callout pointing at hardware via a thin vector line (Stage 10).
 * `side` is which way the line runs from the label.
 */
export const MicroCallout: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  len?: number;
  side?: "left" | "right";
  delay?: number;
  color?: string;
}> = ({ children, x, y, len = 110, side = "right", delay = 0, color = COLORS.motuBlue }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 18, EASE.out);
  const lineW = len * t;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        flexDirection: side === "right" ? "row" : "row-reverse",
        alignItems: "center",
        gap: 12,
        opacity: t,
      }}
    >
      <div style={{ width: 9, height: 9, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ width: lineW, height: 2, background: hexA(color, 0.65), flexShrink: 0 }} />
      <span
        style={{
          ...micro(25, 700, "0.1em"),
          color: COLORS.ink,
          background: hexA(COLORS.paperLift, 0.94),
          padding: "7px 13px",
          borderRadius: 8,
          border: `1px solid ${COLORS.line}`,
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </span>
    </div>
  );
};

/** Numbered list row for problem/solution beats. */
export const PointRow: React.FC<{
  n: number;
  title: string;
  body?: string;
  delay?: number;
  accent?: string;
}> = ({ n, title, body, delay = 0, accent = COLORS.alert }) => (
  <Rise delay={delay} y={18}>
    <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
      <div
        style={{
          ...spec(26, 800, "0"),
          color: "#FFFFFF",
          background: accent,
          width: 48,
          height: 48,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ ...subhead(42, 700), color: COLORS.ink }}>{title}</div>
        {body ? <div style={{ ...subhead(32), color: COLORS.slate, maxWidth: 820 }}>{body}</div> : null}
      </div>
    </div>
  </Rise>
);

/** Chapter marker shown at the head of each of the seven segments. */
export const ChapterMark: React.FC<{ n: string; title: string; delay?: number }> = ({
  n,
  title,
  delay = 0,
}) => (
  <Rise delay={delay} y={14}>
    <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
      <span style={{ ...spec(26, 800, "0.24em"), color: COLORS.motuBlue }}>{n}</span>
      <span style={{ ...micro(24, 700, "0.22em"), color: COLORS.slate }}>{title}</span>
    </div>
  </Rise>
);
