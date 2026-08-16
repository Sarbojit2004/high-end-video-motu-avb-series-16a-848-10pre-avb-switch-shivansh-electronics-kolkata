import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, hexA } from "../theme";
import { micro } from "../fonts";
import { EASE, ramp } from "../lib/anim";

/**
 * Portrait-native motion graphics. Built for a 1080-wide column rather than a
 * 1920-wide stage, so the network and engine diagrams stack vertically instead
 * of fanning horizontally.
 */

/** Minimal 1U rack silhouette — the vocabulary unit for the diagrams here. */
export const RackGlyph: React.FC<{
  x: number; y: number; w?: number; h?: number;
  label?: string; active?: number; accent?: string;
}> = ({ x, y, w = 300, h = 58, label, active = 1, accent = COLORS.motuBlue }) => (
  <g transform={`translate(${x} ${y})`} opacity={active}>
    <rect x={0} y={0} width={w} height={h} rx={8} fill={COLORS.paperLift} stroke={COLORS.lineStrong} strokeWidth={2.5} />
    <rect x={12} y={h / 2 - 10} width={22} height={20} rx={3} fill={hexA(COLORS.ink, 0.28)} />
    <rect x={w * 0.4} y={h / 2 - 13} width={w * 0.32} height={26} rx={3}
          fill={hexA(accent, 0.14)} stroke={hexA(accent, 0.5)} />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={w * 0.41 + i * (w * 0.3 / 8)} y={h / 2 - 9 + (i % 3) * 3}
            width={w * 0.018} height={18 - (i % 3) * 4} fill={COLORS.signalBright} opacity={0.85} />
    ))}
    <circle cx={w - 26} cy={h / 2} r={10} fill="none" stroke={COLORS.lineStrong} strokeWidth={2.5} />
    {label ? (
      <text x={w / 2} y={h + 30} textAnchor="middle" fill={COLORS.slate} style={{ ...micro(20, 700, "0.1em") }}>
        {label}
      </text>
    ) : null}
  </g>
);

/**
 * ECOSYSTEM SPLIT (Section 3) — the three interfaces as peers, revealed by one
 * synchronized light sweep crossing all three at the same instant. The
 * synchrony is the argument: never a ladder, never an upgrade path. Stacked
 * vertically because portrait has height, not width.
 */
export const EcosystemSplit: React.FC<{ duration: number; labels: string[] }> = ({
  duration, labels,
}) => {
  const frame = useCurrentFrame();
  const sweep = ramp(frame, 10, Math.min(46, duration * 0.55), EASE.inOut);
  return (
    <svg viewBox="0 0 900 620" style={{ width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="es-sweep" x1="0" x2="1">
          <stop offset={`${Math.max(0, sweep * 140 - 40)}%`} stopColor={hexA(COLORS.signalBright, 0)} />
          <stop offset={`${Math.max(0, sweep * 140 - 16)}%`} stopColor={hexA(COLORS.signalBright, 0.32)} />
          <stop offset={`${Math.max(0, sweep * 140 + 4)}%`} stopColor={hexA(COLORS.signalBright, 0)} />
        </linearGradient>
      </defs>
      {[0, 1, 2].map((i) => {
        const y = 40 + i * 190;
        const t = ramp(frame, 6 + i * 3, 16, EASE.out); // near-simultaneous, not staggered
        return (
          <g key={i}>
            <RackGlyph x={110} y={y} w={520} h={80} label={labels[i]} active={t} />
            <rect x={110} y={y} width={520} height={80} rx={8} fill="url(#es-sweep)" />
            <text x={680} y={y + 36} fill={COLORS.motuBlue} style={{ ...micro(26, 800, "0.02em") }}>
              Rs. 1,87,900
            </text>
            <text x={680} y={y + 62} fill={COLORS.slateDim} style={{ ...micro(16, 600, "0.06em") }}>
              per unit · incl. GST
            </text>
          </g>
        );
      })}
      <text x={450} y={608} textAnchor="middle" fill={COLORS.slate} style={{ ...micro(21, 700, "0.12em") }}>
        One engine · Three front-ends · One price
      </text>
    </svg>
  );
};

/**
 * DATA FLOW REVEAL (Section 3) — a glowing vector Ethernet path animating out
 * of a port cluster, overlaid on real photography so the invisible becomes
 * concrete. Routed for a portrait frame.
 */
export const DataFlow: React.FC<{
  duration: number;
  path?: string;
  label?: string;
  delay?: number;
  color?: string;
}> = ({
  duration,
  path = "M 140 1180 C 380 1180, 420 860, 660 860 S 940 700, 980 560",
  label,
  delay = 8,
  color = COLORS.signal,
}) => {
  const frame = useCurrentFrame();
  const draw = ramp(frame, delay, Math.min(44, duration * 0.5), EASE.out);
  const LEN = 1800;
  const flow = (frame * 2.4) % 42;
  return (
    <svg viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <path d={path} fill="none" stroke={hexA(color, 0.2)} strokeWidth={12} strokeLinecap="round"
            strokeDasharray={LEN} strokeDashoffset={LEN * (1 - draw)} />
      <path d={path} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round"
            strokeDasharray={LEN} strokeDashoffset={LEN * (1 - draw)} />
      {draw > 0.98 ? (
        <path d={path} fill="none" stroke={COLORS.paperLift} strokeWidth={4} strokeLinecap="round"
              strokeDasharray="14 28" strokeDashoffset={-flow} opacity={0.9} />
      ) : null}
      {label && draw > 0.55 ? (
        <text x={540} y={1330} textAnchor="middle" fill={COLORS.ink}
              style={{ ...micro(26, 800, "0.1em") }} opacity={ramp(frame, delay + 26, 14)}>
          {label}
        </text>
      ) : null}
    </svg>
  );
};

/** Front-end identity badges (Stage 14) — patch matrix / monitor / capsule. */
export const FrontEndBadge: React.FC<{
  kind: "matrix" | "monitor" | "capsule" | "network";
  size?: number;
  color?: string;
}> = ({ kind, size = 56, color = COLORS.motuBlue }) => {
  const s = { width: size, height: size, fill: "none", stroke: color, strokeWidth: 1.8 } as const;
  if (kind === "matrix")
    return (
      <svg viewBox="0 0 32 32" {...s}>
        {[8, 16, 24].map((y) => [8, 16, 24].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={3} />))}
        <path d="M8 8 L24 24 M24 8 L8 24" opacity={0.45} />
      </svg>
    );
  if (kind === "monitor")
    return (
      <svg viewBox="0 0 32 32" {...s}>
        <rect x={5} y={5} width={22} height={22} rx={3} />
        <circle cx={16} cy={13} r={5} /><circle cx={16} cy={23} r={2.4} />
      </svg>
    );
  if (kind === "capsule")
    return (
      <svg viewBox="0 0 32 32" {...s}>
        <rect x={11} y={4} width={10} height={15} rx={5} />
        <path d="M7 15 a9 9 0 0 0 18 0 M16 24 v4 M11 28 h10" />
      </svg>
    );
  return (
    <svg viewBox="0 0 32 32" {...s}>
      <rect x={4} y={12} width={24} height={11} rx={2} />
      {[9, 14, 19, 24].map((x) => <rect key={x} x={x - 1.6} y={15} width={3.2} height={5} rx={0.6} />)}
      <path d="M16 12 V5 M9 5 h14" />
    </svg>
  );
};

/** Connector row — visualises I/O density inline, sized for the portrait column. */
export const ConnectorRow: React.FC<{
  count: number; delay?: number; color?: string; label?: string; width?: number;
}> = ({ count, delay = 0, color = COLORS.motuBlue, label, width = 900 }) => {
  const frame = useCurrentFrame();
  const gap = width / count;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
      <svg viewBox={`0 0 ${width} 74`} style={{ width: "100%", height: 74 }}>
        {Array.from({ length: count }).map((_, i) => {
          const t = ramp(frame, delay + i * 1.4, 12, EASE.out);
          return (
            <g key={i} opacity={t}>
              <circle cx={gap * (i + 0.5)} cy={37} r={16} fill="none" stroke={hexA(color, 0.55)} strokeWidth={2.5} />
              <circle cx={gap * (i + 0.5)} cy={37} r={7} fill={hexA(COLORS.ink, 0.55)} />
            </g>
          );
        })}
      </svg>
      {label ? <span style={{ ...micro(23, 700, "0.1em"), color: COLORS.slate }}>{label}</span> : null}
    </div>
  );
};
