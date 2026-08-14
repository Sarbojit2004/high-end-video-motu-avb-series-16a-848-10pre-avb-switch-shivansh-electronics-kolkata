import React from 'react';
import { interpolate } from 'remotion';
import { C, F } from './theme';

/**
 * The AVB daisy-chain motif (prompt s5).
 *
 * A Cat-6 cable seats into a rear Gigabit port and a stylised glowing pulse
 * travels the cable to the next unit. This replaces a paragraph of spoken
 * explanation about network daisy-chaining with a single legible visual beat.
 *
 * Drawn as vector rather than composited from photography so the pulse can
 * actually travel the cable path, and so it stays crisp on the light stage.
 *
 * @param t      0..1 progress of the whole beat
 * @param units  how many chassis to draw in the chain
 */
export const AvbChain: React.FC<{ t: number; units?: number; label?: string }> = ({
  t,
  units = 3,
  label,
}) => {
  const boxW = 290;
  const boxH = 86;
  const X = 24;
  const rowGap = 132;
  const W = X + boxW + 150;                  // chassis + cable bend + margin
  const H = 30 + units * rowGap + 34;        // rows + label line
  const rowY = (i: number) => 24 + i * rowGap;

  // cable seating happens first, then the pulse runs the chain
  const seat = interpolate(t, [0, 0.22], [0, 1], { extrapolateRight: 'clamp' });
  const run = interpolate(t, [0.22, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const Chassis: React.FC<{ x: number; y: number; on: number; name: string }> = ({
    x, y, on, name,
  }) => (
    <g>
      <rect x={x} y={y} width={boxW} height={boxH} rx={7} fill="#1B212C" />
      <rect x={x} y={y} width={boxW} height={boxH} rx={7} fill="none" stroke="#39424F" strokeWidth={1.5} />
      {/* rack ears */}
      <rect x={x - 11} y={y + 9} width={11} height={boxH - 18} rx={2} fill="#232B37" />
      <rect x={x + boxW} y={y + 9} width={11} height={boxH - 18} rx={2} fill="#232B37" />
      {/* front display, lighting as the node comes online */}
      <rect
        x={x + 112} y={y + 22} width={112} height={44} rx={3}
        fill={`rgba(18,183,106,${0.16 + on * 0.7})`}
      />
      {Array.from({ length: 11 }).map((_, k) => (
        <rect
          key={k}
          x={x + 117 + k * 9}
          y={y + 60 - (7 + ((k * 7) % 26)) * (0.35 + on * 0.65)}
          width={6}
          height={(7 + ((k * 7) % 26)) * (0.35 + on * 0.65)}
          fill={on > 0.4 ? '#7BE8AF' : '#2E7D55'}
        />
      ))}
      {/* two Gigabit AVB ports */}
      <rect x={x + 18} y={y + 30} width={19} height={16} rx={2} fill="#0E1218" stroke="#4A5464" />
      <rect x={x + 42} y={y + 30} width={19} height={16} rx={2} fill="#0E1218" stroke="#4A5464" />
      <text x={x + 18} y={y + 68} fill="#6C7686" fontSize={13} fontFamily={F.mono}>AVB</text>
      <text x={x + boxW - 14} y={y + 28} fill="#8A93A2" fontSize={15} fontFamily={F.mono} textAnchor="end">
        {name}
      </text>
    </g>
  );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id="pulseGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="cableGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.accent} stopOpacity="0.30" />
          <stop offset="100%" stopColor={C.accent} stopOpacity="0.30" />
        </linearGradient>
      </defs>

      {Array.from({ length: units }).map((_, i) => {
        // each node lights as the pulse reaches it
        const arrive = i / (units - 1);
        const on = interpolate(run, [arrive * 0.82, arrive * 0.82 + 0.16], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <Chassis
            key={i}
            x={X}
            y={rowY(i)}
            on={i === 0 ? Math.max(on, seat) : on}
            name={['16A', '16A #2', '16A #3'][i] ?? `#${i + 1}`}
          />
        );
      })}

      {/* cable runs down the right edge, port to port */}
      {Array.from({ length: units - 1 }).map((_, i) => {
        const y0 = rowY(i) + 40;
        const y1 = rowY(i + 1) + 40;
        const xPort = X + 46;
        const bend = X + boxW + 74 + i * 30;
        const d = `M ${xPort} ${y0 + 7} C ${bend} ${y0 + 4}, ${bend} ${y1 - 4}, ${xPort} ${y1 - 7}`;

        const segStart = i / (units - 1);
        const segEnd = (i + 1) / (units - 1);
        const local = interpolate(run, [segStart * 0.82, segEnd * 0.82], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <g key={i}>
            {/* the cable itself, drawing in as it seats */}
            <path
              d={d}
              fill="none"
              stroke="#39424F"
              strokeWidth={7}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - seat}
            />
            <path
              d={d}
              fill="none"
              stroke="url(#cableGrad)"
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - seat}
            />
            {/* the travelling pulse */}
            {local > 0 && local < 1 ? (
              <path
                d={d}
                fill="none"
                stroke={C.accentLift}
                strokeWidth={5}
                strokeLinecap="round"
                filter="url(#pulseGlow)"
                pathLength={1}
                strokeDasharray="0.16 0.84"
                strokeDashoffset={1 - local * 1.16}
              />
            ) : null}
          </g>
        );
      })}

      {label ? (
        <text
          x={W - 10}
          y={H - 6}
          textAnchor="end"
          fill={C.inkFaint}
          fontSize={17}
          fontFamily={F.mono}
          opacity={interpolate(t, [0.55, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};
