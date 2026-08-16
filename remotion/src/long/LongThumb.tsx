import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { BRAND, C, F, SHADOW } from '../theme';
import { LPlate } from './layout';

/**
 * Long-form thumbnails, 1920x1080 (prompt s12).
 *
 * Unlike the reel thumbnails (which carry no logos at all), these carry both
 * marks with the Section 5 hierarchy: Shivansh Electronics primary and larger,
 * MOTU present but secondary.
 *
 * Each part gets its own hook rather than a repeated series label, while the
 * light field, type scale and restraint stay shared across the set.
 */
export type LongThumbProps = {
  part: 1 | 2 | 3;
  product: string;
  /** big numeric/─short hook, e.g. "TEN" */
  hook: string;
  line1: string;
  line2: string;
  blurb: string;
  /** hero asset, then a supporting asset */
  heroA: number;
  heroB: number;
  specs: [string, string][];
};

export const LongThumb: React.FC<LongThumbProps> = ({
  part, product, hook, line1, line2, blurb, heroA, heroB, specs,
}) => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill
      style={{ background: `linear-gradient(168deg, ${C.bgWarm} 0%, ${C.bg} 46%, ${C.bgSink} 100%)` }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(78% 88% at 66% 42%, rgba(255,255,255,0.66) 0%, rgba(255,255,255,0) 62%)',
      }}
    />
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 10, background: C.accent }} />

    <AbsoluteFill
      style={{
        padding: '64px 84px 58px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 56,
      }}
    >
      {/* text column */}
      <div style={{ width: '46%', flexShrink: 0, minWidth: 0 }}>
        <div
          style={{
            fontFamily: F.body, fontSize: 25, fontWeight: 800, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: C.accent,
          }}
        >
          {product}
        </div>
        <div
          style={{
            fontFamily: F.head, fontSize: 168, fontWeight: 900, lineHeight: 0.82,
            letterSpacing: '-0.05em', color: C.ink, marginTop: 14,
          }}
        >
          {hook}
        </div>
        <div
          style={{
            fontFamily: F.head, fontSize: 60, fontWeight: 800, lineHeight: 1.02,
            letterSpacing: '-0.025em', color: C.ink, marginTop: 14,
          }}
        >
          {line1}
          <br />
          <span style={{ color: C.accent }}>{line2}</span>
        </div>
        <div
          style={{
            fontFamily: F.body, fontSize: 26, fontWeight: 500, color: C.inkSoft,
            marginTop: 18, lineHeight: 1.3,
          }}
        >
          {blurb}
        </div>

        <div style={{ display: 'flex', gap: 34, marginTop: 26 }}>
          {specs.map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: F.mono, fontSize: 34, fontWeight: 700, color: C.ink }}>{v}</div>
              <div
                style={{
                  fontFamily: F.body, fontSize: 15, fontWeight: 700,
                  letterSpacing: '0.1em', color: C.inkFaint,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* hardware column */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <LPlate a={heroA} h={430} radius={18} />
        <LPlate a={heroB} h={300} radius={18} />
      </div>
    </AbsoluteFill>

    {/* branding: Shivansh primary, MOTU secondary (prompt s5 hierarchy) */}
    <div
      style={{
        position: 'absolute', left: 84, bottom: 40, display: 'flex',
        alignItems: 'center', gap: 20,
      }}
    >
      <Img src={staticFile('img/logo-shivansh.png')} style={{ height: 74, objectFit: 'contain' }} />
      <div style={{ borderLeft: `2px solid ${C.rule}`, paddingLeft: 20 }}>
        <div style={{ fontFamily: F.head, fontSize: 30, fontWeight: 800, color: C.ink }}>
          {BRAND.distributor}
        </div>
        <div style={{ fontFamily: F.body, fontSize: 20, fontWeight: 700, color: C.accent, marginTop: 3 }}>
          Authorized Distributor — East &amp; North East India
        </div>
      </div>
    </div>

    <Img
      src={staticFile('img/logo-motu.png')}
      style={{ position: 'absolute', right: 88, bottom: 52, height: 40, objectFit: 'contain', opacity: 0.9 }}
    />

    <div
      style={{
        position: 'absolute', top: 62, right: 84, background: C.ink, color: '#fff',
        fontFamily: F.mono, fontSize: 21, fontWeight: 700, padding: '10px 18px',
        borderRadius: 8, letterSpacing: '0.05em', boxShadow: SHADOW.chip,
      }}
    >
      PART {part} / 3
    </div>
  </AbsoluteFill>
);

export const LongThumb1: React.FC = () => (
  <LongThumb
    part={1}
    product="MOTU 10pre"
    hook="TEN"
    line1="MIC PREAMPS."
    line2="ONE MASTER CLOCK."
    blurb="Track the whole band at once — eight on the rear, two on the front."
    heroA={5}
    heroB={10}
    specs={[['74 dB', 'GAIN'], ['125 dB', 'DYNAMIC RANGE'], ['1.8 ms', 'LATENCY']]}
  />
);

export const LongThumb2: React.FC = () => (
  <LongThumb
    part={2}
    product="MOTU 16A"
    hook="16×16"
    line1="BALANCED TRS."
    line2="ZERO PREAMPS."
    blurb="The patchbay hub for a room already full of outboard gear."
    heroA={59}
    heroB={51}
    specs={[['66', 'CHANNELS'], ['2×', 'RGB DISPLAYS'], ['DC', 'COUPLED OUTS']]}
  />
);

export const LongThumb3: React.FC = () => (
  <LongThumb
    part={3}
    product="MOTU 848"
    hook="7.1.4"
    line1="NATIVE ATMOS."
    line2="ONE CLOCK SOURCE."
    blurb="Twelve analog outputs — exactly what the array needs. No aggregation."
    heroA={90}
    heroB={86}
    specs={[['12', 'TRS OUTPUTS'], ['74 dB', 'COMBO GAIN'], ['A/B/C', 'MONITORING']]}
  />
);
