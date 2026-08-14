import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Plate } from '../components';
import { BRAND, C, F, SHADOW } from '../theme';

/**
 * Part 1 thumbnail - the ten-preamp tracking story.
 *
 * English only (prompt s11). No added MOTU or Shivansh logo anywhere: any mark
 * visible here is one already baked into the supplied photograph. Same light
 * field, typography hierarchy and restraint as the reel itself.
 */
export const Thumb1: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(172deg, ${C.bgWarm} 0%, ${C.bg} 44%, ${C.bgSink} 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(105% 58% at 50% 30%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)',
      }}
    />

    {/* accent rule */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 12,
        background: C.accent,
      }}
    />

    <AbsoluteFill
      style={{
        padding: '150px 84px 120px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontFamily: F.body,
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: C.accent,
        }}
      >
        MOTU 10pre
      </div>

      <div
        style={{
          fontFamily: F.head,
          fontSize: 230,
          fontWeight: 900,
          lineHeight: 0.8,
          letterSpacing: '-0.05em',
          color: C.ink,
          marginTop: 30,
        }}
      >
        TEN
      </div>
      <div
        style={{
          fontFamily: F.head,
          fontSize: 80,
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-0.025em',
          color: C.ink,
          marginTop: 14,
        }}
      >
        MIC PREAMPS.
        <br />
        <span style={{ color: C.accent }}>ONE MASTER CLOCK.</span>
      </div>

      <div
        style={{
          fontFamily: F.body,
          fontSize: 34,
          fontWeight: 500,
          color: C.inkSoft,
          marginTop: 24,
          lineHeight: 1.25,
        }}
      >
        Track the whole band at once —
        <br />
        eight on the rear, two on the front.
      </div>

      {/* hero shot: the 10pre front panel, shown complete */}
      <div style={{ marginTop: 40 }}>
        <Plate a={5} height={620} radius={20} />
      </div>

      <div style={{ flex: 1 }} />

      {/* specs */}
      <div style={{ display: 'flex', gap: 40, marginBottom: 30 }}>
        {[
          ['74 dB', 'GAIN'],
          ['125 dB', 'DYNAMIC RANGE'],
          ['1.8 ms', 'LATENCY'],
        ].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontFamily: F.mono, fontSize: 44, fontWeight: 700, color: C.ink }}>
              {v}
            </div>
            <div
              style={{
                fontFamily: F.body,
                fontSize: 19,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: C.inkFaint,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: `2px solid ${C.rule}`,
          paddingTop: 24,
        }}
      >
        <div
          style={{
            fontFamily: F.head,
            fontSize: 40,
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
            fontSize: 25,
            fontWeight: 700,
            color: C.accent,
            marginTop: 6,
          }}
        >
          Authorized Distributor — East &amp; North East India
        </div>
      </div>
    </AbsoluteFill>

    {/* part marker */}
    <div
      style={{
        position: 'absolute',
        top: 150,
        right: 84,
        background: C.ink,
        color: '#fff',
        fontFamily: F.mono,
        fontSize: 24,
        fontWeight: 700,
        padding: '12px 20px',
        borderRadius: 8,
        letterSpacing: '0.05em',
        boxShadow: SHADOW.chip,
      }}
    >
      PART 1 / 3
    </div>
  </AbsoluteFill>
);
