import React from "react";
import { useCurrentFrame } from "remotion";
import { COLORS, hexA } from "../theme";
import { micro, spec } from "../fonts";
import { EASE, ramp, mapClamp, countUp, group, rand } from "../lib/anim";

/**
 * Brief Stage 14's required synthesised graphics, built natively as SVG/CSS.
 * These do the structural explaining that photography cannot — and they are
 * what lets the Network chapter run 120 s honestly on only three photographs
 * of the AVB Switch, instead of looping those three to fill time.
 */

/** Minimal 1U rack silhouette — the vocabulary unit for every diagram here. */
export const RackGlyph: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  active?: number;
  accent?: string;
}> = ({ x, y, w = 190, h = 40, label, active = 1, accent = COLORS.motuBlue }) => (
  <g transform={`translate(${x} ${y})`} opacity={active}>
    <rect x={0} y={0} width={w} height={h} rx={6} fill={COLORS.paperLift} stroke={COLORS.lineStrong} strokeWidth={2} />
    <rect x={8} y={h / 2 - 7} width={16} height={14} rx={2} fill={hexA(COLORS.ink, 0.3)} />
    {/* meter strip — the RGB TFT the brief keeps pointing at */}
    <rect x={w * 0.42} y={h / 2 - 9} width={w * 0.3} height={18} rx={2} fill={hexA(accent, 0.16)} stroke={hexA(accent, 0.5)} />
    {Array.from({ length: 7 }).map((_, i) => (
      <rect
        key={i}
        x={w * 0.43 + i * (w * 0.28 / 7)}
        y={h / 2 - 6 + (i % 3) * 2}
        width={w * 0.02}
        height={12 - (i % 3) * 3}
        fill={COLORS.signalBright}
        opacity={0.85}
      />
    ))}
    <circle cx={w - 18} cy={h / 2} r={7} fill="none" stroke={COLORS.lineStrong} strokeWidth={2} />
    {label ? (
      <text x={w / 2} y={h + 21} textAnchor="middle" fill={COLORS.slate} style={{ ...micro(15, 700, "0.12em") }}>
        {label}
      </text>
    ) : null}
  </g>
);

/**
 * "IDENTICAL ENGINE" DIAGRAM (Stage 14). A central DSP core branches to the
 * three interface silhouettes; a spec value appearing at the core pushes
 * outward to all three simultaneously — the synchrony is the whole argument.
 */
export const IdenticalEngine: React.FC<{
  duration: number;
  value?: string;
  caption?: string;
}> = ({ duration, value = "ESS Sabre32", caption = "One engine. Three front-ends." }) => {
  const frame = useCurrentFrame();
  const core = ramp(frame, 6, 26, EASE.out);
  const branch = ramp(frame, 30, 30, EASE.out);
  // Pulse travelling core -> each rack, repeating so the sync reads clearly.
  const cycle = 84;
  const pulse = ((frame - 46) % cycle) / cycle;
  const pulseOn = frame > 46 && pulse >= 0 && pulse <= 1;

  const CX = 640, CY = 150;
  const targets = [
    { x: 250, y: 420, label: "MOTU 16A" },
    { x: 640, y: 420, label: "MOTU 848" },
    { x: 1030, y: 420, label: "MOTU 10pre" },
  ];

  return (
    <svg viewBox="0 0 1280 560" style={{ width: "100%", height: "100%" }}>
      {targets.map((t, i) => {
        const path = `M ${CX} ${CY + 62} C ${CX} ${CY + 170}, ${t.x + 95} ${CY + 140}, ${t.x + 95} ${t.y - 16}`;
        return (
          <g key={t.label}>
            <path
              d={path}
              fill="none"
              stroke={hexA(COLORS.motuBlue, 0.34)}
              strokeWidth={3}
              strokeDasharray={620}
              strokeDashoffset={620 * (1 - branch)}
            />
            {pulseOn ? (
              <circle
                r={8}
                fill={COLORS.signalBright}
                opacity={Math.sin(pulse * Math.PI)}
                style={{ offsetPath: `path("${path}")`, offsetDistance: `${pulse * 100}%` } as React.CSSProperties}
              />
            ) : null}
            <RackGlyph x={t.x} y={t.y} label={t.label} active={ramp(frame, 34 + i * 4, 22)} />
          </g>
        );
      })}

      {/* DSP core */}
      <g opacity={core} transform={`translate(${CX} ${CY}) scale(${0.9 + core * 0.1})`}>
        <rect x={-118} y={-58} width={236} height={116} rx={16} fill={COLORS.paperLift} stroke={COLORS.motuBlue} strokeWidth={3} />
        {[-1, 1].map((s) =>
          Array.from({ length: 6 }).map((_, i) => (
            <rect key={`${s}-${i}`} x={-92 + i * 33} y={s * 58} width={16} height={9} rx={2} fill={hexA(COLORS.motuBlue, 0.45)} />
          ))
        )}
        <text textAnchor="middle" y={-12} fill={COLORS.slate} style={{ ...micro(15, 700, "0.16em") }}>
          SHARED ENGINE
        </text>
        <text textAnchor="middle" y={24} fill={COLORS.ink} style={{ ...spec(30, 800, "0") }}>
          {value}
        </text>
      </g>

      <text x={640} y={534} textAnchor="middle" fill={COLORS.slate} style={{ ...micro(19, 700, "0.16em") }}>
        {caption}
      </text>
      <rect x={0} y={0} width={0} height={0} opacity={mapClamp(frame, [duration - 10, duration], [1, 0])} />
    </svg>
  );
};

/**
 * NETWORK SCALING TOPOLOGY MAP (Stage 14). Two nodes on a direct daisy-chain,
 * then the AVB Switch drops in and the map expands to a star topology, with a
 * counter ticking to the verified 4,096-channel ceiling.
 */
export const TopologyMap: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const phase1 = ramp(frame, 8, 26, EASE.out); // two nodes + direct link
  const switchIn = ramp(frame, Math.round(duration * 0.26), 24, EASE.out);
  const expand = ramp(frame, Math.round(duration * 0.4), 44, EASE.out);
  const counters = Math.round(duration * 0.52);

  const CX = 640, CY = 300;
  const r = rand(9);
  const leaves = React.useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2 + 0.28;
        const rad = 205 + r() * 62;
        return { x: CX + Math.cos(a) * rad * 1.42, y: CY + Math.sin(a) * rad * 0.82, d: i * 2.2 };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <svg viewBox="0 0 1280 600" style={{ width: "100%", height: "100%" }}>
      {/* expanded star links */}
      {leaves.map((l, i) => {
        const t = ramp(frame, Math.round(duration * 0.4) + l.d, 22, EASE.out);
        return (
          <g key={i} opacity={t * expand}>
            <line x1={CX} y1={CY} x2={l.x} y2={l.y} stroke={hexA(COLORS.motuBlue, 0.3)} strokeWidth={2} />
            <rect
              x={l.x - 42}
              y={l.y - 11}
              width={84}
              height={22}
              rx={4}
              fill={COLORS.paperLift}
              stroke={COLORS.lineStrong}
              strokeWidth={1.5}
            />
            <rect x={l.x - 30} y={l.y - 4} width={26} height={8} rx={1.5} fill={hexA(COLORS.signalBright, 0.8)} />
          </g>
        );
      })}

      {/* phase 1 — the built-in two-port daisy chain, no extra hardware */}
      <g opacity={phase1 * (1 - expand * 0.55)}>
        <line
          x1={330}
          y1={CY}
          x2={950}
          y2={CY}
          stroke={hexA(COLORS.signal, 0.55)}
          strokeWidth={3}
          strokeDasharray="10 8"
          strokeDashoffset={-frame * 1.6}
        />
        <RackGlyph x={140} y={CY - 20} label="MOTU 10pre · live room" />
        <RackGlyph x={950} y={CY - 20} label="MOTU 848 · control room" />
      </g>

      {/* the switch drops in */}
      <g opacity={switchIn} transform={`translate(${CX} ${CY}) scale(${0.86 + switchIn * 0.14})`}>
        <rect x={-96} y={-40} width={192} height={80} rx={10} fill={COLORS.paperLift} stroke={COLORS.signal} strokeWidth={3} />
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i}>
            <rect x={-76 + i * 26} y={4} width={19} height={22} rx={2} fill={hexA(COLORS.ink, 0.2)} stroke={hexA(COLORS.ink, 0.3)} />
            <circle
              cx={-66.5 + i * 26}
              cy={-2}
              r={3.4}
              fill={COLORS.signalBright}
              opacity={0.45 + 0.55 * Math.abs(Math.sin(frame / 9 + i * 1.1))}
            />
          </g>
        ))}
        <text textAnchor="middle" y={-18} fill={COLORS.ink} style={{ ...micro(15, 800, "0.14em") }}>
          MOTU AVB SWITCH
        </text>
      </g>

      {/* verified scale counters */}
      <g opacity={ramp(frame, counters, 22)}>
        <text x={92} y={556} fill={COLORS.ink} style={{ ...spec(44, 800, "0") }}>
          {group(countUp(frame, counters, 50, 150))}
        </text>
        <text x={92} y={584} fill={COLORS.slate} style={{ ...micro(16, 700, "0.14em") }}>
          AVB DEVICES
        </text>
        <text x={432} y={556} fill={COLORS.ink} style={{ ...spec(44, 800, "0") }}>
          {group(countUp(frame, counters + 8, 50, 512))}
        </text>
        <text x={432} y={584} fill={COLORS.slate} style={{ ...micro(16, 700, "0.14em") }}>
          SIMULTANEOUS STREAMS
        </text>
        <text x={856} y={556} fill={COLORS.motuBlue} style={{ ...spec(44, 800, "0") }}>
          {group(countUp(frame, counters + 16, 56, 4096))}
        </text>
        <text x={856} y={584} fill={COLORS.slate} style={{ ...micro(16, 700, "0.14em") }}>
          AUDIO CHANNELS
        </text>
      </g>
    </svg>
  );
};

/**
 * DATA FLOW REVEAL (Section 3). A glowing vector Ethernet path animating out of
 * a port cluster — overlaid on real photography so the invisible becomes
 * concrete, per Stage 13's network vocabulary.
 */
export const DataFlow: React.FC<{
  duration: number;
  path?: string;
  label?: string;
  delay?: number;
  color?: string;
}> = ({ duration, path = "M 120 620 C 420 620, 460 300, 780 300 S 1160 210, 1400 210", label, delay = 10, color = COLORS.signal }) => {
  const frame = useCurrentFrame();
  const draw = ramp(frame, delay, Math.min(60, duration * 0.5), EASE.out);
  const LEN = 2200;
  const flow = (frame * 2.2) % 46;
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
      <path d={path} fill="none" stroke={hexA(color, 0.2)} strokeWidth={10} strokeLinecap="round"
        strokeDasharray={LEN} strokeDashoffset={LEN * (1 - draw)} />
      <path d={path} fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round"
        strokeDasharray={LEN} strokeDashoffset={LEN * (1 - draw)} />
      {draw > 0.98 ? (
        <path d={path} fill="none" stroke={COLORS.paperLift} strokeWidth={3.4} strokeLinecap="round"
          strokeDasharray="16 30" strokeDashoffset={-flow} opacity={0.9} />
      ) : null}
      {label && draw > 0.6 ? (
        <text x={960} y={168} textAnchor="middle" fill={COLORS.ink} style={{ ...micro(23, 800, "0.16em") }}
          opacity={ramp(frame, delay + 34, 20)}>
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
}> = ({ kind, size = 72, color = COLORS.motuBlue }) => {
  const s = { width: size, height: size, fill: "none", stroke: color, strokeWidth: 1.7 } as const;
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
        <circle cx={16} cy={13} r={5} />
        <circle cx={16} cy={23} r={2.4} />
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

/** Horizontal connector row used to visualise I/O density inline. */
export const ConnectorRow: React.FC<{
  count: number;
  delay?: number;
  color?: string;
  label?: string;
  width?: number;
}> = ({ count, delay = 0, color = COLORS.motuBlue, label, width = 1200 }) => {
  const frame = useCurrentFrame();
  const gap = width / count;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <svg viewBox={`0 0 ${width} 60`} style={{ width, height: 60 }}>
        {Array.from({ length: count }).map((_, i) => {
          const t = ramp(frame, delay + i * 1.3, 14, EASE.out);
          return (
            <g key={i} opacity={t}>
              <circle cx={gap * (i + 0.5)} cy={30} r={13} fill="none" stroke={hexA(color, 0.55)} strokeWidth={2} />
              <circle cx={gap * (i + 0.5)} cy={30} r={6} fill={hexA(COLORS.ink, 0.55)} />
            </g>
          );
        })}
      </svg>
      {label ? <span style={{ ...micro(19, 700, "0.14em"), color: COLORS.slate }}>{label}</span> : null}
    </div>
  );
};
