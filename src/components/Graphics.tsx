import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { ramp, drift, hash01, settle, CLAMP } from "../lib/anim";
import * as F from "../fonts";

// ═════════════════════════════════════════════════════════════════════════════
// MG-5 · FRONT-END IDENTITY BADGE / ICON SYSTEM
// Elegantly lined vector icons, one per front-end. Reused across all 3 parts.
// ═════════════════════════════════════════════════════════════════════════════
type IconProps = { size?: number; color?: string; stroke?: number; progress?: number };

const Ico: React.FC<IconProps & { children: React.ReactNode }> = ({
  size = 96,
  color = COLORS.ink,
  stroke = 4,
  progress = 1,
  children,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <g
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        strokeDasharray: 400,
        strokeDashoffset: 400 * (1 - progress),
      }}
    >
      {children}
    </g>
  </svg>
);

/** 10pre — microphone capsule (the source). */
export const IconMicCapsule: React.FC<IconProps> = (p) => (
  <Ico {...p}>
    <rect x="36" y="12" width="28" height="46" rx="14" />
    <path d="M26 50a24 24 0 0 0 48 0" />
    <path d="M50 74v14M36 88h28" />
    <path d="M42 24h16M42 34h16M42 44h16" />
  </Ico>
);

/** 16A — patch-cable matrix (the routing grid). */
export const IconMatrix: React.FC<IconProps> = (p) => (
  <Ico {...p}>
    <rect x="14" y="14" width="72" height="72" rx="8" />
    <path d="M38 14v72M62 14v72M14 38h72M14 62h72" />
    <circle cx="26" cy="26" r="5" />
    <circle cx="74" cy="74" r="5" />
    <path d="M26 26 74 74" />
  </Ico>
);

/** 848 — studio monitor / control surface (the command center). */
export const IconMonitor: React.FC<IconProps> = (p) => (
  <Ico {...p}>
    <rect x="16" y="14" width="68" height="72" rx="8" />
    <circle cx="50" cy="44" r="18" />
    <circle cx="50" cy="44" r="6" />
    <circle cx="50" cy="72" r="7" />
  </Ico>
);

/** AVB Switch — network node (the fabric). */
export const IconNetworkNode: React.FC<IconProps> = (p) => (
  <Ico {...p}>
    <circle cx="50" cy="50" r="12" />
    <circle cx="18" cy="20" r="7" />
    <circle cx="82" cy="20" r="7" />
    <circle cx="18" cy="80" r="7" />
    <circle cx="82" cy="80" r="7" />
    <path d="M41 42 24 26M59 42 76 26M41 58 24 74M59 58 76 74" />
  </Ico>
);

export const IdentityBadge: React.FC<{
  icon: "mic" | "matrix" | "monitor" | "node";
  label: string;
  caption?: string;
  delay?: number;
  accent?: string;
  size?: number;
}> = ({ icon, label, caption, delay = 0, accent = COLORS.signal, size = 96 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = settle(frame, fps, delay);
  const draw = ramp(frame, delay + 2, 22);
  const Cmp =
    icon === "mic" ? IconMicCapsule : icon === "matrix" ? IconMatrix : icon === "monitor" ? IconMonitor : IconNetworkNode;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: ramp(frame, delay, 10),
        transform: `translateY(${interpolate(s, [0, 1], [26, 0])}px)`,
      }}
    >
      <div
        style={{
          width: size + 46,
          height: size + 46,
          borderRadius: 28,
          background: COLORS.paperLift,
          border: `2px solid ${COLORS.paperEdge}`,
          boxShadow: `0 14px 34px ${COLORS.shadow}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Cmp size={size} color={accent} stroke={4} progress={draw} />
      </div>
      <div style={{ ...F.micro(21, COLORS.ink, 800, "0.16em"), textAlign: "center" }}>{label}</div>
      {caption ? (
        <div style={{ ...F.micro(16, COLORS.graphite, 600, "0.14em"), textAlign: "center" }}>{caption}</div>
      ) : null}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MG-1 · THE "IDENTICAL ENGINE" SYNCHRONIZATION GRAPHIC
// Three interfaces in aligned silhouette. A single light sweep crosses all
// three in perfect sync, then one shared readout resolves over all three at
// once — confirming the architecture is the same silicon, not a family
// resemblance.
// ═════════════════════════════════════════════════════════════════════════════
const RackSilhouette: React.FC<{
  label: string;
  variant: 0 | 1 | 2;
  sweep: number;
  accent: string;
  width?: number;
  height?: number;
}> = ({ label, variant, sweep, accent, width = 820, height = 118 }) => {
  // Front-panel furniture differs per unit; the engine behind it does not.
  const knobs = variant === 0 ? 4 : variant === 1 ? 4 : 2;
  const combos = variant === 0 ? 2 : variant === 1 ? 2 : 0;
  return (
    <div style={{ position: "relative", width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
        <defs>
          <linearGradient id={`sweep${variant}`} x1="0" x2="1">
            <stop offset={Math.max(0, sweep - 0.16)} stopColor={accent} stopOpacity="0" />
            <stop offset={sweep} stopColor={accent} stopOpacity="0.95" />
            <stop offset={Math.min(1, sweep + 0.16)} stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* chassis */}
        <rect x="2" y="2" width={width - 4} height={height - 4} rx="10" fill={COLORS.chassis} stroke={COLORS.paperEdge} strokeWidth="2" />
        {/* rack ears */}
        <rect x="8" y="14" width="26" height={height - 28} rx="4" fill={COLORS.chassisSoft} />
        <rect x={width - 34} y="14" width="26" height={height - 28} rx="4" fill={COLORS.chassisSoft} />
        {/* combo jacks */}
        {Array.from({ length: combos }).map((_, i) => (
          <circle key={`c${i}`} cx={168 + i * 46} cy={height / 2} r="17" fill="#0E1012" stroke={COLORS.graphiteDim} strokeWidth="2" />
        ))}
        {/* knobs */}
        {Array.from({ length: knobs }).map((_, i) => (
          <circle
            key={`k${i}`}
            cx={(combos ? 268 : 168) + i * 34}
            cy={height / 2}
            r="12"
            fill={COLORS.chassisSoft}
            stroke={COLORS.graphiteDim}
            strokeWidth="1.5"
          />
        ))}
        {/* TFT display(s) — the glowing element on a light page */}
        {variant === 2 ? (
          <>
            <rect x={width * 0.40} y="26" width={width * 0.14} height={height - 52} rx="5" fill="#07130A" stroke={accent} strokeWidth="1.5" />
            <rect x={width * 0.55} y="26" width={width * 0.14} height={height - 52} rx="5" fill="#07130A" stroke={accent} strokeWidth="1.5" />
          </>
        ) : (
          <rect x={width * 0.48} y="24" width={width * 0.21} height={height - 48} rx="5" fill="#07130A" stroke={accent} strokeWidth="1.5" />
        )}
        {/* meter ticks inside the display */}
        {Array.from({ length: 16 }).map((_, i) => {
          const bx = (variant === 2 ? width * 0.41 : width * 0.49) + i * 9;
          const h = 8 + hash01(i + variant * 13) * 34;
          return <rect key={`m${i}`} x={bx} y={height - 34 - h} width="5" height={h} rx="1.5" fill={i > 12 ? "#E4B23A" : "#4FD07A"} opacity="0.92" />;
        })}
        {/* the synchronized sweep */}
        <rect x="2" y="2" width={width - 4} height={height - 4} rx="10" fill={`url(#sweep${variant})`} />
      </svg>
      <div style={{ position: "absolute", left: 46, top: height / 2 - 13, ...F.micro(20, "#EDEDEA", 800, "0.18em") }}>
        {label}
      </div>
    </div>
  );
};

export const IdenticalEngine: React.FC<{
  total: number;
  delay?: number;
  accent?: string;
  readout?: string;
  readoutSub?: string;
  width?: number;
}> = ({ total, delay = 0, accent = COLORS.signalBright, readout = "~1.8 ms RTL", readoutSub = "ESS SABRE32 ULTRA · 32-BIT FLOAT DSP", width = 820 }) => {
  const frame = useCurrentFrame();
  // one sweep position shared by all three units — that is the whole point
  const sweep = interpolate(frame, [delay + 16, delay + 74], [-0.2, 1.2], CLAMP);
  const readoutIn = ramp(frame, delay + 78, 18);
  const units: Array<{ label: string; variant: 0 | 1 | 2 }> = [
    { label: "10pre", variant: 0 },
    { label: "848", variant: 1 },
    { label: "16A", variant: 2 },
  ];
  return (
    <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", gap: 26, alignItems: "center" }}>
      {units.map((u, i) => {
        const a = ramp(frame, delay + i * 6, 16);
        return (
          <div
            key={u.label}
            style={{ position: "relative", opacity: a, transform: `translateX(${(1 - a) * (i % 2 ? 30 : -30)}px)` }}
          >
            <RackSilhouette label={u.label} variant={u.variant} sweep={sweep} accent={accent} width={width} height={140} />
            {/* per-unit readout chip — all three land on the SAME frame, which is
                the entire claim: one identical figure, three different boxes. */}
            <div
              style={{
                position: "absolute",
                right: 46,
                top: "50%",
                transform: `translateY(-50%) scale(${interpolate(readoutIn, [0, 1], [0.86, 1])})`,
                opacity: readoutIn,
                background: "rgba(250,250,248,0.97)",
                border: `2px solid ${accent}`,
                borderRadius: 12,
                padding: "8px 16px",
                whiteSpace: "nowrap",
                boxShadow: `0 8px 22px ${COLORS.shadow}`,
              }}
            >
              <div style={{ ...F.spec(28, COLORS.ink) }}>{readout}</div>
            </div>
          </div>
        );
      })}

      {/* the shared architecture line, resolving under all three */}
      <div
        style={{
          opacity: readoutIn,
          transform: `translateY(${interpolate(readoutIn, [0, 1], [14, 0])}px)`,
          background: COLORS.paperLift,
          border: `2px solid ${accent}`,
          borderRadius: 16,
          padding: "14px 30px",
          textAlign: "center",
          whiteSpace: "nowrap",
          boxShadow: `0 14px 36px ${COLORS.shadow}`,
        }}
      >
        <div style={{ ...F.micro(19, COLORS.inkSoft, 800, "0.16em") }}>{readoutSub}</div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MG-2 · AVB NETWORK-TOPOLOGY PATH ANIMATION
// The series' visual through-line. `level` grows across the three parts:
//   1 → one device lighting its built-in AVB port
//   2 → two devices daisy-chained
//   3 → the full fabric, the AVB Switch anchoring multiple connected devices
// ═════════════════════════════════════════════════════════════════════════════
type Node = { id: string; x: number; y: number; label: string; kind: "iface" | "switch" | "host" | "port" };

const LEVELS: Record<1 | 2 | 3, { nodes: Node[]; edges: [string, string][] }> = {
  1: {
    nodes: [
      { id: "host", x: 450, y: 76, label: "HOST", kind: "host" },
      { id: "a", x: 450, y: 250, label: "10pre", kind: "iface" },
      { id: "p1", x: 268, y: 400, label: "AVB PORT 1", kind: "port" },
      { id: "p2", x: 632, y: 400, label: "AVB PORT 2", kind: "port" },
    ],
    edges: [
      ["host", "a"],
      ["a", "p1"],
      ["a", "p2"],
    ],
  },
  2: {
    nodes: [
      { id: "host", x: 450, y: 70, label: "HOST", kind: "host" },
      { id: "a", x: 450, y: 250, label: "10pre", kind: "iface" },
      { id: "b", x: 450, y: 420, label: "16A", kind: "iface" },
    ],
    edges: [
      ["host", "a"],
      ["a", "b"],
    ],
  },
  3: {
    nodes: [
      { id: "host", x: 450, y: 46, label: "HOST", kind: "host" },
      { id: "sw", x: 450, y: 236, label: "AVB SWITCH", kind: "switch" },
      { id: "a", x: 150, y: 430, label: "10pre", kind: "iface" },
      { id: "b", x: 380, y: 470, label: "16A", kind: "iface" },
      { id: "c", x: 620, y: 430, label: "848", kind: "iface" },
      { id: "d", x: 820, y: 340, label: "848", kind: "iface" },
      { id: "e", x: 80, y: 320, label: "16A", kind: "iface" },
    ],
    edges: [
      ["host", "sw"],
      ["sw", "a"],
      ["sw", "b"],
      ["sw", "c"],
      ["sw", "d"],
      ["sw", "e"],
    ],
  },
};

export const NetworkTopology: React.FC<{
  level: 1 | 2 | 3;
  total: number;
  delay?: number;
  accent?: string;
  counterTo?: number;
  counterLabel?: string;
  width?: number;
  height?: number;
}> = ({
  level,
  total,
  delay = 0,
  accent = COLORS.signal,
  counterTo = 64,
  counterLabel = "CHANNELS ON THE NETWORK",
  width = 900,
  height = 560,
}) => {
  const frame = useCurrentFrame();
  const { nodes, edges } = LEVELS[level];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const edgeStep = 16;

  return (
    <div style={{ width, display: "flex", flexDirection: "column", gap: 10 }}>
      <svg width={width} height={height} viewBox={`0 0 900 ${height}`} fill="none" style={{ flexShrink: 0 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {edges.map(([from, to], i) => {
          const a = byId[from];
          const b = byId[to];
          const d = delay + 20 + i * edgeStep;
          const grow = ramp(frame, d, 20);
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          return (
            <g key={`${from}-${to}`}>
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={COLORS.paperEdge} strokeWidth="3"
                strokeDasharray={len} strokeDashoffset={len * (1 - grow)}
              />
              <line
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={accent} strokeWidth="3" opacity="0.9"
                strokeDasharray={`${len * 0.16} ${len}`}
                strokeDashoffset={-((frame - d) * 6) % (len * 1.16)}
                filter="url(#glow)"
                style={{ opacity: grow > 0.98 ? 0.9 : 0 }}
              />
            </g>
          );
        })}

        {nodes.map((n, i) => {
          const d = delay + i * 10;
          const a = ramp(frame, d, 14);
          const w = n.kind === "switch" ? 210 : n.kind === "port" ? 168 : 150;
          const h = n.kind === "switch" ? 54 : n.kind === "port" ? 34 : 40;
          return (
            <g key={n.id} opacity={a} transform={`translate(${n.x - w / 2} ${n.y - h / 2}) scale(${0.94 + a * 0.06})`}>
              <rect
                width={w} height={h} rx={n.kind === "switch" ? 12 : 8}
                fill={n.kind === "host" ? COLORS.paperLift : n.kind === "port" ? "transparent" : COLORS.chassis}
                stroke={n.kind === "switch" || n.kind === "port" ? accent : COLORS.paperEdge}
                strokeWidth={n.kind === "switch" ? 3 : 2}
                strokeDasharray={n.kind === "port" ? "7 5" : undefined}
              />
              {n.kind === "switch"
                ? Array.from({ length: 6 }).map((_, p) => (
                    <rect key={p} x={22 + p * 29} y={h - 17} width="20" height="11" rx="2"
                      fill={ramp(frame, delay + 40 + p * 5, 8) > 0.5 ? "#4FD07A" : COLORS.graphiteDim} />
                  ))
                : null}
              <text
                x={w / 2} y={n.kind === "switch" ? 24 : n.kind === "port" ? h / 2 + 5 : h / 2 + 6}
                textAnchor="middle"
                fill={n.kind === "host" ? COLORS.ink : n.kind === "port" ? accent : "#EDEDEA"}
                style={{ fontFamily: "Archivo", fontWeight: 800, fontSize: n.kind === "port" ? 14 : 17, letterSpacing: "0.12em" }}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* the counter ticking upward as connections are added — laid out under
          the diagram rather than absolutely placed, so it cannot collide with
          nodes at any level */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "flex-end",
          gap: 16,
          width: "100%",
          opacity: ramp(frame, delay + 34, 14),
        }}
      >
        <div style={{ ...F.micro(18, COLORS.graphite, 700, "0.18em") }}>{counterLabel}</div>
        <div style={{ ...F.spec(72, accent) }}>
          {Math.round(
            interpolate(frame, [delay + 34, delay + 34 + 52], [0, counterTo], CLAMP)
          ).toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MG-3 · CUEMIX PRO SOFTWARE-INTERFACE OVERLAY (CSS/SVG-animated)
// The front-panel TFT push resolves into a live 64-channel routing/mixing
// surface — depth of software control without screen-recording footage.
// ═════════════════════════════════════════════════════════════════════════════
export const CueMixOverlay: React.FC<{
  total: number;
  delay?: number;
  accent?: string;
  channels?: number;
  width?: number;
  height?: number;
  mode?: "mixer" | "patch";
}> = ({ total, delay = 0, accent = COLORS.signal, channels = 14, width = 900, height = 660, mode = "mixer" }) => {
  const frame = useCurrentFrame();
  const open = ramp(frame, delay, 22);
  const t = frame - delay;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 20,
        overflow: "hidden",
        background: "#16181C",
        border: `2px solid ${COLORS.paperEdge}`,
        boxShadow: `0 26px 70px ${COLORS.shadow}`,
        opacity: open,
        transform: `scale(${interpolate(open, [0, 1], [0.9, 1])})`,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* title bar */}
      <div style={{ height: 46, background: "#22262B", display: "flex", alignItems: "center", padding: "0 16px", gap: 8, flexShrink: 0 }}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 999, background: c }} />
        ))}
        <div style={{ ...F.micro(15, "#B9BFC7", 700, "0.16em"), marginLeft: 16 }}>CUEMIX PRO — 64-CHANNEL MIXER</div>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* sidebar */}
        <div style={{ width: 150, background: "#1B1F24", padding: 14, flexShrink: 0 }}>
          {["DISCOVERY", "DEVICE", "INPUTS", "OUTPUTS", "PATCHBAY", "ROUTING", "MIXING", "AUX MIXING"].map((s, i) => {
            const active = mode === "mixer" ? s === "MIXING" : s === "PATCHBAY";
            return (
              <div
                key={s}
                style={{
                  ...F.micro(12, active ? accent : "#8A9199", 700, "0.1em"),
                  padding: "9px 8px",
                  borderRadius: 6,
                  background: active ? `${accent}22` : "transparent",
                  opacity: ramp(frame, delay + 8 + i * 2, 10),
                  marginBottom: 2,
                }}
              >
                {s}
              </div>
            );
          })}
        </div>

        {/* channel strips */}
        <div style={{ flex: 1, padding: 18, display: "flex", gap: 7, alignItems: "flex-end", minWidth: 0 }}>
          {Array.from({ length: channels }).map((_, i) => {
            const seed = hash01(i * 5.7);
            const lvl =
              0.24 +
              0.6 *
                Math.abs(
                  Math.sin(t * (0.055 + seed * 0.05) + i * 0.9) * 0.6 +
                    Math.sin(t * 0.021 + i * 2.3) * 0.4
                );
            const fader = 0.34 + seed * 0.42;
            const rise = ramp(frame, delay + 14 + i * 2, 14);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: rise, minWidth: 0 }}>
                {/* meter */}
                <div style={{ width: "100%", height: 260, background: "#0D0F12", borderRadius: 3, position: "relative", overflow: "hidden" }}>
                  <div
                    style={{
                      position: "absolute", bottom: 0, left: 0, width: "100%",
                      height: `${lvl * 100 * rise}%`,
                      background: `linear-gradient(to top, #35C46B 0%, #35C46B 62%, #E3C13C 82%, #E0553C 100%)`,
                    }}
                  />
                </div>
                {/* fader */}
                <div style={{ width: "100%", height: 150, background: "#0D0F12", borderRadius: 3, position: "relative" }}>
                  <div style={{ position: "absolute", left: "50%", top: 8, bottom: 8, width: 2, background: "#2E343B", transform: "translateX(-50%)" }} />
                  <div
                    style={{
                      position: "absolute", left: "50%",
                      bottom: `${fader * 100 * rise}%`,
                      width: "84%", height: 16, borderRadius: 3,
                      background: "#C3C9D1", transform: "translateX(-50%)",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.6)",
                    }}
                  />
                </div>
                <div style={{ ...F.micro(9, "#7E858D", 700, "0.04em") }}>{i + 1}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// MG-4 · PER-PART ANIMATED SPEC-REVEAL INFOGRAPHIC
// Rows build in with a drawn bar + counted numeral, never a static text block.
// ═════════════════════════════════════════════════════════════════════════════
export type SpecRow = { label: string; value: string; num?: number; suffix?: string; decimals?: number; bar?: number };

export const SpecReveal: React.FC<{
  rows: SpecRow[];
  delay?: number;
  accent?: string;
  step?: number;
  labelSize?: number;
  valueSize?: number;
}> = ({ rows, delay = 0, accent = COLORS.signal, step = 14, labelSize = 21, valueSize = 46 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
      {rows.map((r, i) => {
        const d = delay + i * step;
        const a = ramp(frame, d, 14);
        const bar = ramp(frame, d + 4, 24);
        return (
          <div key={r.label} style={{ width: "100%", opacity: a, transform: `translateX(${(1 - a) * -22}px)` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 18 }}>
              <div style={{ ...F.micro(labelSize, COLORS.graphite, 700, "0.18em") }}>{r.label}</div>
              <div style={{ ...F.spec(valueSize, COLORS.ink), whiteSpace: "nowrap" }}>
                {r.num !== undefined
                  ? `${interpolate(frame, [d + 2, d + 30], [0, r.num], CLAMP).toFixed(r.decimals ?? 0)}${r.suffix ?? ""}`
                  : r.value}
              </div>
            </div>
            <div style={{ marginTop: 10, height: 4, width: "100%", background: COLORS.paperSink, borderRadius: 999, overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${(r.bar ?? 1) * 100}%`,
                  background: accent,
                  transform: `scaleX(${bar})`,
                  transformOrigin: "0% 50%",
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Gain-arc dial used for the preamp beats (+74 dB / EIN). */
export const GainArc: React.FC<{
  delay?: number;
  accent?: string;
  size?: number;
  to?: number;
  label?: string;
  suffix?: string;
}> = ({ delay = 0, accent = COLORS.amber, size = 260, to = 74, label = "PREAMP GAIN", suffix = " dB" }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, delay, 34);
  const R = size / 2 - 18;
  const C = 2 * Math.PI * R;
  const sweep = 0.78;
  return (
    <div style={{ position: "relative", width: size, height: size, opacity: ramp(frame, delay, 12) }}>
      <svg width={size} height={size} style={{ transform: "rotate(137deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={COLORS.paperSink} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C * sweep} ${C}`} />
        <circle cx={size / 2} cy={size / 2} r={R} fill="none" stroke={accent} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${C * sweep * p} ${C}`} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...F.spec(58, COLORS.ink) }}>
          +{Math.round(interpolate(frame, [delay, delay + 34], [0, to], CLAMP))}
          {suffix}
        </div>
        <div style={{ ...F.micro(15, COLORS.graphite, 700, "0.18em"), marginTop: 6 }}>{label}</div>
      </div>
    </div>
  );
};
