import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { byIdx, img } from '../assets';
import { BRAND, C, F, SHADOW } from '../theme';

/**
 * Landscape (1920x1080) layout system for the long-form series.
 *
 * 16:9 is not the reel layout re-flowed - a portrait reel stacks headline over
 * image, while landscape has room to set text and hardware side by side and to
 * let a single wide rear-panel shot run nearly full-bleed. These components are
 * built for that, and share only the palette and catalogue with the reels.
 */

export const LW = 1920;
export const LH = 1080;
export const LONG_FRAMES = 298 * 30; // 8,940

/** Generous landscape margins. No platform UI to dodge here, unlike the reels. */
export const M = { x: 104, y: 76 } as const;

export const ramp = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/* ------------------------------------------------------------------ */
/* Stage                                                               */
/* ------------------------------------------------------------------ */

export const LongStage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(168deg, ${C.bgWarm} 0%, ${C.bg} 48%, ${C.bgSink} 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(80% 90% at 62% 40%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 64%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Imagery - always complete, never cropped (prompt s6)                */
/* ------------------------------------------------------------------ */

type PlateProps = {
  a: number;
  w?: number | string;
  h: number;
  reveal?: number;
  focus?: [number, number];
  zoom?: number;
  radius?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
};

/**
 * One catalogued image, contain-fitted inside a plate tinted to that image's
 * own sampled edge colour so a letterboxed source dissolves into its frame.
 * `reveal` runs the macro-to-scale camera move, resolving to the complete frame.
 */
export const LPlate: React.FC<PlateProps> = ({
  a, w = '100%', h, reveal = 1, focus = [0.5, 0.5], zoom = 2.4, radius = 20, style, children,
}) => {
  const asset = byIdx(a);
  const scale = interpolate(reveal, [0, 1], [zoom, 1]);
  const panX = interpolate(reveal, [0, 1], [(0.5 - focus[0]) * 100 * (zoom - 1), 0]);
  const panY = interpolate(reveal, [0, 1], [(0.5 - focus[1]) * 100 * (zoom - 1), 0]);
  return (
    <div
      style={{
        position: 'relative', width: w, height: h, borderRadius: radius,
        overflow: 'hidden', background: asset.edge, boxShadow: SHADOW.plate, ...style,
      }}
    >
      <Img
        src={staticFile(img(a))}
        style={{
          position: 'absolute', inset: -30, width: 'calc(100% + 60px)',
          height: 'calc(100% + 60px)', objectFit: 'cover',
          filter: 'blur(22px) saturate(0.65)', opacity: 0.5,
        }}
      />
      <Img
        src={staticFile(img(a))}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain',
          transform: `scale(${scale}) translate(${panX}%, ${panY}%)`,
          transformOrigin: 'center center',
        }}
      />
      <div
        style={{
          position: 'absolute', inset: 0, borderRadius: radius,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      />
      {children}
    </div>
  );
};

/** Several plates across the frame - reserved for genuinely repetitive detail. */
export const LPlateRow: React.FC<{
  items: number[]; h: number; gap?: number; enter?: number;
}> = ({ items, h, gap = 18, enter = 1 }) => (
  <div style={{ display: 'flex', gap, width: '100%' }}>
    {items.map((a, i) => {
      const t = interpolate(enter, [i * 0.14, i * 0.14 + 0.5], [0, 1], {
        extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
      });
      return (
        <div key={a} style={{ flex: 1, opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>
          <LPlate a={a} h={h} radius={16} />
        </div>
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

export const LHead: React.FC<{
  children: React.ReactNode; size?: number; enter?: number; color?: string;
}> = ({ children, size = 84, enter = 1, color = C.ink }) => (
  <div
    style={{
      fontFamily: F.head, fontSize: size, fontWeight: 800, letterSpacing: '-0.022em',
      lineHeight: 1.0, color, opacity: enter, transform: `translateY(${(1 - enter) * 20}px)`,
    }}
  >
    {children}
  </div>
);

export const LSub: React.FC<{
  children: React.ReactNode; size?: number; enter?: number; color?: string;
}> = ({ children, size = 32, enter = 1, color = C.inkSoft }) => (
  <div
    style={{
      fontFamily: F.body, fontSize: size, fontWeight: 500, lineHeight: 1.38, color,
      opacity: enter, transform: `translateY(${(1 - enter) * 12}px)`,
    }}
  >
    {children}
  </div>
);

export const LKicker: React.FC<{ children: React.ReactNode; enter?: number }> = ({
  children, enter = 1,
}) => (
  <div
    style={{
      fontFamily: F.body, fontSize: 21, fontWeight: 700, letterSpacing: '0.22em',
      textTransform: 'uppercase', color: C.accent, opacity: enter,
      transform: `translateX(${(1 - enter) * -14}px)`,
    }}
  >
    {children}
  </div>
);

export const LSpec: React.FC<{
  label: string; value: string; enter?: number;
}> = ({ label, value, enter = 1 }) => (
  <div
    style={{
      display: 'inline-flex', flexDirection: 'column', gap: 4, padding: '14px 22px',
      background: 'rgba(255,255,255,0.86)', border: `1px solid ${C.rule}`,
      borderLeft: `3px solid ${C.accent}`, borderRadius: 10, boxShadow: SHADOW.chip,
      opacity: enter, transform: `translateY(${(1 - enter) * 10}px)`,
    }}
  >
    <span style={{ fontFamily: F.mono, fontSize: 32, fontWeight: 700, color: C.ink }}>{value}</span>
    <span
      style={{
        fontFamily: F.body, fontSize: 17, fontWeight: 600, color: C.inkFaint,
        letterSpacing: '0.09em', textTransform: 'uppercase',
      }}
    >
      {label}
    </span>
  </div>
);

/** Animated highlight over a software screenshot (brief s11). */
export const LUiHighlight: React.FC<{
  x: number; y: number; w: number; h: number; enter: number; label?: string;
}> = ({ x, y, w, h, enter, label }) => {
  const pulse = 0.5 + 0.5 * Math.sin(enter * Math.PI * 3);
  return (
    <div
      style={{
        position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`,
        width: `${w * 100}%`, height: `${h * 100}%`,
        border: `2px solid ${C.accentLift}`, borderRadius: 8,
        boxShadow: `0 0 ${16 + pulse * 20}px rgba(62,147,245,${0.45 + pulse * 0.3}), inset 0 0 24px rgba(62,147,245,0.16)`,
        opacity: interpolate(enter, [0, 0.14], [0, 1], { extrapolateRight: 'clamp' }),
      }}
    >
      {label ? (
        <div
          style={{
            position: 'absolute', top: -36, left: 0, fontFamily: F.mono, fontSize: 18,
            fontWeight: 700, color: '#fff', background: C.accent, padding: '5px 11px',
            borderRadius: 5, whiteSpace: 'nowrap', letterSpacing: '0.05em',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene shells - the three landscape compositions                     */
/* ------------------------------------------------------------------ */

/** Text column left, hardware right. The workhorse landscape layout. */
export const SplitScene: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: number;      // left column share
  gap?: number;
}> = ({ left, right, ratio = 0.40, gap = 64 }) => (
  <AbsoluteFill
    style={{
      padding: `${M.y}px ${M.x}px`,
      display: 'flex',
      // AbsoluteFill defaults to flexDirection: column - this layout is two
      // side-by-side columns, so the direction must be set explicitly.
      flexDirection: 'row',
      alignItems: 'center',
      gap,
    }}
  >
    <div
      style={{
        width: `${ratio * 100}%`,
        flexShrink: 0,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {left}
    </div>
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
      {right}
    </div>
  </AbsoluteFill>
);

/** Headline band across the top, wide imagery beneath - for rear-panel shots. */
export const BannerScene: React.FC<{
  head: React.ReactNode;
  body: React.ReactNode;
  foot?: React.ReactNode;
}> = ({ head, body, foot }) => (
  <AbsoluteFill
    style={{
      padding: `${M.y}px ${M.x}px`,
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <div>{head}</div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
      {body}
    </div>
    {foot ? <div>{foot}</div> : null}
  </AbsoluteFill>
);

/* ------------------------------------------------------------------ */
/* Branding (prompt s5) - Shivansh constant, MOTU occasional           */
/* ------------------------------------------------------------------ */

/**
 * The persistent Shivansh Electronics mark. Present across the whole runtime
 * but unobtrusive, and it drifts slowly rather than sitting as a fixed
 * watermark, per the established treatment.
 */
export const PersistentBrand: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = Math.sin((frame / 900) * Math.PI * 2) * 5;
  const o = ramp(frame, 40, 90) * 0.92;
  return (
    <div
      style={{
        position: 'absolute',
        right: M.x,
        top: M.y - 22 + drift,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        opacity: o,
      }}
    >
      <Img
        src={staticFile('img/logo-shivansh.png')}
        style={{ height: 46, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(12,18,32,0.14))' }}
      />
    </div>
  );
};

/** Contact details rotate so a 298 s runtime never repeats the same block. */
export const CONTACT_ROTATION = [
  BRAND.web,
  BRAND.whatsapp[0],
  BRAND.designation,
  BRAND.whatsapp[1],
  BRAND.web,
  BRAND.whatsapp[2],
  BRAND.designation,
] as const;

/**
 * Recurring lower-third. Appears periodically through each part rather than
 * only at the close, carrying a different contact detail each time (prompt s8).
 */
export const BrandLowerThird: React.FC<{
  frame: number; in_: number; hold?: number; index: number;
}> = ({ frame, in_, hold = 150, index }) => {
  const appear = ramp(frame, in_, in_ + 22);
  const leave = ramp(frame, in_ + hold, in_ + hold + 22);
  const o = Math.min(appear, 1 - leave);
  if (o <= 0.002) return null;
  const detail = CONTACT_ROTATION[index % CONTACT_ROTATION.length];
  return (
    <div
      style={{
        position: 'absolute',
        left: M.x,
        bottom: M.y - 12,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        opacity: o,
        transform: `translateX(${(1 - appear) * -26}px)`,
      }}
    >
      <Img
        src={staticFile('img/logo-shivansh.png')}
        style={{ height: 54, objectFit: 'contain' }}
      />
      <div style={{ borderLeft: `2px solid ${C.rule}`, paddingLeft: 18 }}>
        <div style={{ fontFamily: F.head, fontSize: 27, fontWeight: 800, color: C.ink }}>
          {BRAND.distributor}
        </div>
        <div style={{ fontFamily: F.body, fontSize: 20, fontWeight: 600, color: C.accent, marginTop: 3 }}>
          {detail}
        </div>
      </div>
    </div>
  );
};

/**
 * The MOTU mark - deliberately less frequent than the Shivansh presence.
 * Reserved for the shared-engine passage, hero reveals and the CTA (prompt s5).
 */
export const MotuMark: React.FC<{
  frame: number; in_: number; hold?: number; x?: number; y?: number; h?: number;
}> = ({ frame, in_, hold = 130, x = M.x, y = M.y - 16, h = 52 }) => {
  const appear = ramp(frame, in_, in_ + 20);
  const leave = ramp(frame, in_ + hold, in_ + hold + 20);
  const o = Math.min(appear, 1 - leave);
  if (o <= 0.002) return null;
  const t = ramp(frame, in_, in_ + hold + 20);
  return (
    <Img
      src={staticFile('img/logo-motu.png')}
      style={{
        position: 'absolute',
        left: x,
        top: y + (1 - t) * 10,
        height: h,
        objectFit: 'contain',
        opacity: o,
        filter: 'drop-shadow(0 6px 16px rgba(12,18,32,0.15))',
      }}
    />
  );
};

/** Thin progress rule so a 5-minute video shows where it is. */
export const ProgressRule: React.FC<{ frame: number; total: number }> = ({ frame, total }) => (
  <div style={{ position: 'absolute', left: 0, bottom: 0, width: '100%', height: 4, background: 'rgba(18,22,31,0.07)' }}>
    <div
      style={{
        width: `${(frame / total) * 100}%`,
        height: '100%',
        background: C.accent,
        opacity: 0.55,
      }}
    />
  </div>
);
