import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { byIdx, img } from './assets';
import { BRAND, C, F, SAFE, SHADOW } from './theme';

/* ------------------------------------------------------------------ */
/* Stage                                                               */
/* ------------------------------------------------------------------ */

/** The light field every scene sits on. A very soft vertical gradient plus a
 *  barely-there vignette keeps it from reading as flat white. */
export const LightStage: React.FC<{ children: React.ReactNode; tint?: string }> = ({
  children,
  tint,
}) => (
  <AbsoluteFill style={{ background: tint ?? C.bg }}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(176deg, ${C.bgWarm} 0%, ${C.bg} 46%, ${C.bgSink} 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(120% 70% at 50% 34%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 62%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

/** Content region inside the Instagram safe zone (prompt s4). */
export const Safe: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{
      paddingTop: SAFE.top,
      paddingBottom: 1920 - SAFE.bottom + 22,
      paddingLeft: SAFE.side,
      paddingRight: SAFE.side,
      display: 'flex',
      flexDirection: 'column',
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Imagery - every asset is shown COMPLETE, never cropped (prompt s5)  */
/* ------------------------------------------------------------------ */

type PlateProps = {
  /** catalogue index */
  a: number;
  /** plate height in px */
  height: number;
  width?: number;
  /** progress 0..1 of a macro-to-scale reveal; 1 = fully revealed & complete */
  reveal?: number;
  /** focal point of the macro push, in 0..1 image space */
  focus?: [number, number];
  /** peak magnification at reveal=0 */
  zoom?: number;
  radius?: number;
  style?: React.CSSProperties;
};

/**
 * Shows one catalogued image completely inside a rounded plate.
 *
 * The image is always `contain`-fitted, so no part of the product is ever
 * trimmed off-frame. The plate is filled with that image's own sampled edge
 * colour, so a letterboxed image dissolves into its frame instead of showing
 * hard bars. A blurred copy of the image backs the plate to extend the field.
 *
 * `reveal` drives the macro-to-scale camera move: at 0 the image is magnified
 * about `focus`; at 1 it has settled to the complete, uncropped frame.
 */
export const Plate: React.FC<PlateProps> = ({
  a,
  height,
  width,
  reveal = 1,
  focus = [0.5, 0.5],
  zoom = 2.6,
  radius = 22,
  style,
}) => {
  const asset = byIdx(a);
  const scale = interpolate(reveal, [0, 1], [zoom, 1]);
  // Pan so `focus` sits centred while magnified, easing to centre when revealed.
  const panX = interpolate(reveal, [0, 1], [(0.5 - focus[0]) * 100 * (zoom - 1), 0]);
  const panY = interpolate(reveal, [0, 1], [(0.5 - focus[1]) * 100 * (zoom - 1), 0]);

  return (
    <div
      style={{
        position: 'relative',
        width: width ?? '100%',
        height,
        borderRadius: radius,
        overflow: 'hidden',
        background: asset.edge,
        boxShadow: SHADOW.plate,
        ...style,
      }}
    >
      {/* extended field - blurred copy fills any letterbox area */}
      <Img
        src={staticFile(img(a))}
        style={{
          position: 'absolute',
          inset: -40,
          width: 'calc(100% + 80px)',
          height: 'calc(100% + 80px)',
          objectFit: 'cover',
          filter: 'blur(34px) saturate(0.7)',
          opacity: 0.5,
        }}
      />
      {/* the asset itself - contained, complete */}
      <Img
        src={staticFile(img(a))}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `scale(${scale}) translate(${panX}%, ${panY}%)`,
          transformOrigin: 'center center',
        }}
      />
      {/* edge light along the top bevel */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.06)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

/** Two or more assets in one grouped composition (prompt s3). */
export const PlateRow: React.FC<{
  items: number[];
  height: number;
  gap?: number;
  enter?: number; // 0..1 stagger progress
}> = ({ items, height, gap = 16, enter = 1 }) => (
  <div style={{ display: 'flex', gap, width: '100%' }}>
    {items.map((a, i) => {
      const t = interpolate(enter, [i * 0.12, i * 0.12 + 0.5], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      return (
        <div
          key={a}
          style={{
            flex: 1,
            opacity: t,
            transform: `translateY(${(1 - t) * 26}px)`,
          }}
        >
          <Plate a={a} height={height} radius={16} />
        </div>
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  enter?: number;
  color?: string;
  align?: React.CSSProperties['textAlign'];
}> = ({ children, size = 92, enter = 1, color = C.ink, align = 'left' }) => (
  <div
    style={{
      fontFamily: F.head,
      fontSize: size,
      fontWeight: 800,
      letterSpacing: '-0.022em',
      lineHeight: 0.98,
      color,
      textAlign: align,
      opacity: enter,
      transform: `translateY(${(1 - enter) * 22}px)`,
    }}
  >
    {children}
  </div>
);

export const Subhead: React.FC<{
  children: React.ReactNode;
  size?: number;
  enter?: number;
  color?: string;
}> = ({ children, size = 38, enter = 1, color = C.inkSoft }) => (
  <div
    style={{
      fontFamily: F.body,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: '-0.006em',
      lineHeight: 1.28,
      color,
      opacity: enter,
      transform: `translateY(${(1 - enter) * 14}px)`,
    }}
  >
    {children}
  </div>
);

/** Monospaced verified-specification callout (brief s8). */
export const SpecChip: React.FC<{
  label: string;
  value: string;
  enter?: number;
  accent?: string;
}> = ({ label, value, enter = 1, accent = C.accent }) => (
  <div
    style={{
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 4,
      padding: '14px 20px',
      background: 'rgba(255,255,255,0.86)',
      border: `1px solid ${C.rule}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 10,
      boxShadow: SHADOW.chip,
      opacity: enter,
      transform: `translateY(${(1 - enter) * 12}px)`,
    }}
  >
    <span
      style={{
        fontFamily: F.mono,
        fontSize: 34,
        fontWeight: 700,
        color: C.ink,
        letterSpacing: '-0.01em',
      }}
    >
      {value}
    </span>
    <span
      style={{
        fontFamily: F.body,
        fontSize: 19,
        fontWeight: 600,
        color: C.inkFaint,
        letterSpacing: '0.09em',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  </div>
);

/** Small kicker above a headline. */
export const Kicker: React.FC<{ children: React.ReactNode; enter?: number }> = ({
  children,
  enter = 1,
}) => (
  <div
    style={{
      fontFamily: F.body,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: '0.20em',
      textTransform: 'uppercase',
      color: C.accent,
      opacity: enter,
      transform: `translateX(${(1 - enter) * -16}px)`,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

/** Eased 0..1 ramp between two absolute frames of the current sequence. */
export const useRamp = (from: number, to: number, delay = 0) => {
  const f = useCurrentFrame();
  return interpolate(f, [from + delay, to + delay], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};

export const useSpringIn = (delay = 0, damping = 200) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - delay, fps, config: { damping } });
};

/** Slow continuous drift, for keeping held frames alive. */
export const useDrift = (amp = 8, period = 240) => {
  const f = useCurrentFrame();
  return Math.sin((f / period) * Math.PI * 2) * amp;
};

/* ------------------------------------------------------------------ */
/* CueMix Pro software treatment (prompt s5, brief s11)                */
/* ------------------------------------------------------------------ */

/**
 * A glowing bounding box that sweeps onto a region of a software screenshot,
 * so CueMix material reads as an interactive UI rather than a pasted grab.
 * Coordinates are fractions of the plate.
 */
export const UiHighlight: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  enter: number;
  label?: string;
}> = ({ x, y, w, h, enter, label }) => {
  const pulse = 0.5 + 0.5 * Math.sin(enter * Math.PI * 3);
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x * 100}%`,
        top: `${y * 100}%`,
        width: `${w * 100}%`,
        height: `${h * 100}%`,
        border: `2px solid ${C.accentLift}`,
        borderRadius: 8,
        boxShadow: `0 0 ${14 + pulse * 18}px rgba(62,147,245,${0.45 + pulse * 0.3}), inset 0 0 22px rgba(62,147,245,0.16)`,
        opacity: interpolate(enter, [0, 0.14], [0, 1], { extrapolateRight: 'clamp' }),
        transform: `scale(${interpolate(enter, [0, 0.2], [1.06, 1], {
          extrapolateRight: 'clamp',
        })})`,
      }}
    >
      {label ? (
        <div
          style={{
            position: 'absolute',
            top: -34,
            left: 0,
            fontFamily: F.mono,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: '#fff',
            background: C.accent,
            padding: '4px 10px',
            borderRadius: 5,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Branding                                                            */
/* ------------------------------------------------------------------ */

/** Text-only contact block used at the close of Parts 1 and 2 (prompt s6). */
export const ContactBlock: React.FC<{ enter: number; compact?: boolean }> = ({
  enter,
  compact,
}) => {
  return (
    <div style={{ opacity: enter, transform: `translateY(${(1 - enter) * 18}px)` }}>
      <div
        style={{
          fontFamily: F.head,
          fontSize: compact ? 42 : 48,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: '-0.015em',
        }}
      >
        {BRAND.distributor}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: compact ? 23 : 26,
          fontWeight: 600,
          color: C.accent,
          marginTop: 8,
          lineHeight: 1.3,
        }}
      >
        {BRAND.designation}
      </div>
      <div
        style={{
          height: 1,
          background: C.rule,
          margin: `${compact ? 18 : 24}px 0`,
        }}
      />
      <div
        style={{
          fontFamily: F.mono,
          fontSize: compact ? 22 : 25,
          color: C.inkSoft,
          lineHeight: 1.5,
          letterSpacing: '-0.01em',
        }}
      >
        {BRAND.whatsapp.join('  ·  ')}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: compact ? 24 : 27,
          fontWeight: 700,
          color: C.ink,
          marginTop: 10,
        }}
      >
        {BRAND.web}
      </div>
    </div>
  );
};
