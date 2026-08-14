import React from 'react';
import { Img, interpolate, staticFile } from 'remotion';
import { BRAND, C, F } from '../theme';

/**
 * The close of the whole three-part series (prompt s7).
 *
 * The two brand logos are the ONLY logo usage in the project - the reel bodies
 * and all three thumbnails carry none (prompt s4a). Per the established
 * treatment they sit directly on the light field rather than in boxes, and
 * change position as they appear and disappear rather than holding a fixed
 * lockup.
 *
 * Pricing uses the brief's "identical investment" framing: one MOP for all
 * three units, never three prices listed side by side, which would read as a
 * comparison between them.
 */

const ramp = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/** A logo that fades in at one position, holds, then fades out at another. */
const DriftLogo: React.FC<{
  src: string;
  f: number;
  in_: number;
  out: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  h: number;
}> = ({ src, f, in_, out, from, to, h }) => {
  const appear = ramp(f, in_, in_ + 22);
  const leave = ramp(f, out, out + 20);
  const o = Math.min(appear, 1 - leave);
  if (o <= 0.001) return null;
  const t = ramp(f, in_, out + 20);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: from.x + (to.x - from.x) * t,
        top: from.y + (to.y - from.y) * t,
        height: h,
        objectFit: 'contain',
        opacity: o,
        filter: 'drop-shadow(0 8px 24px rgba(12,18,32,0.16))',
      }}
    />
  );
};

export const FinalCta: React.FC<{ f: number }> = ({ f }) => (
  <>
    {/* logos: two appearances each, at changing positions, never boxed */}
    <DriftLogo src="img/logo-motu.png" f={f} in_={10} out={96}
      from={{ x: 96, y: 300 }} to={{ x: 150, y: 276 }} h={104} />
    <DriftLogo src="img/logo-shivansh.png" f={f} in_={40} out={120}
      from={{ x: 600, y: 330 }} to={{ x: 548, y: 300 }} h={140} />
    <DriftLogo src="img/logo-shivansh.png" f={f} in_={168} out={252}
      from={{ x: 120, y: 312 }} to={{ x: 96, y: 286 }} h={144} />
    <DriftLogo src="img/logo-motu.png" f={f} in_={196} out={262}
      from={{ x: 648, y: 334 }} to={{ x: 688, y: 302 }} h={96} />

    <div style={{ position: 'absolute', left: 90, right: 90, top: 500 }}>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 62,
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: '-0.022em',
          color: C.ink,
          opacity: ramp(f, 60, 92),
        }}
      >
        One engine.
        <br />
        Three specialized
        <br />
        front-ends.
      </div>

      {/* identical-investment framing, not three prices side by side */}
      <div
        style={{
          marginTop: 38,
          padding: '30px 34px',
          borderLeft: `4px solid ${C.accent}`,
          background: 'rgba(255,255,255,0.72)',
          borderRadius: 12,
          opacity: ramp(f, 96, 128),
        }}
      >
        <div
          style={{
            fontFamily: F.body,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: C.inkFaint,
          }}
        >
          One identical investment
        </div>
        <div
          style={{
            fontFamily: F.mono,
            fontSize: 72,
            fontWeight: 700,
            color: C.ink,
            marginTop: 10,
            letterSpacing: '-0.02em',
          }}
        >
          MOP {BRAND.mop}
        </div>
        <div style={{ fontFamily: F.body, fontSize: 23, color: C.inkSoft, marginTop: 4 }}>
          incl. GST · per unit · 16A · 848 · 10pre
        </div>
      </div>

      <div
        style={{
          marginTop: 42,
          fontFamily: F.head,
          fontSize: 54,
          fontWeight: 800,
          color: C.ink,
          letterSpacing: '-0.015em',
          opacity: ramp(f, 132, 164),
        }}
      >
        {BRAND.distributor}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: 27,
          fontWeight: 700,
          color: C.accent,
          marginTop: 8,
          lineHeight: 1.3,
          opacity: ramp(f, 140, 172),
        }}
      >
        {BRAND.designation}
      </div>

      <div style={{ height: 1, background: C.rule, margin: '28px 0' }} />

      <div
        style={{
          fontFamily: F.mono,
          fontSize: 26,
          color: C.inkSoft,
          lineHeight: 1.6,
          opacity: ramp(f, 158, 190),
        }}
      >
        {BRAND.whatsapp.join('  ·  ')}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: 30,
          fontWeight: 700,
          color: C.ink,
          marginTop: 12,
          opacity: ramp(f, 168, 200),
        }}
      >
        {BRAND.web}
      </div>
      <div
        style={{
          fontFamily: F.body,
          fontSize: 22,
          color: C.inkFaint,
          marginTop: 20,
          lineHeight: 1.45,
          maxWidth: 830,
          opacity: ramp(f, 180, 214),
        }}
      >
        {BRAND.address}
      </div>
    </div>
  </>
);
