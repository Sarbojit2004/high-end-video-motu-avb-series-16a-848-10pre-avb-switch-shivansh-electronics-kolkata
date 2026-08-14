import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Plate } from '../components';
import { BRAND, C, F, SHADOW } from '../theme';

/**
 * Part 2 thumbnail - the sixteen-channel patchbay story.
 *
 * English only (prompt s11). No added MOTU or Shivansh logo; any mark visible
 * is already baked into the supplied photograph. Distinct hook from Parts 1
 * and 3, same visual family.
 */
export const Thumb2: React.FC = () => (
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

    <div
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: 12,
        background: C.accent,
      }}
    />

    <AbsoluteFill style={{ padding: '150px 84px 120px', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          fontFamily: F.body, fontSize: 30, fontWeight: 800, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: C.accent,
        }}
      >
        MOTU 16A
      </div>

      <div
        style={{
          fontFamily: F.head, fontSize: 210, fontWeight: 900, lineHeight: 0.8,
          letterSpacing: '-0.05em', color: C.ink, marginTop: 30,
        }}
      >
        16×16
      </div>
      <div
        style={{
          fontFamily: F.head, fontSize: 78, fontWeight: 800, lineHeight: 1.0,
          letterSpacing: '-0.025em', color: C.ink, marginTop: 16,
        }}
      >
        BALANCED TRS.
        <br />
        <span style={{ color: C.accent }}>ZERO PREAMPS.</span>
      </div>

      <div
        style={{
          fontFamily: F.body, fontSize: 34, fontWeight: 500, color: C.inkSoft,
          marginTop: 24, lineHeight: 1.25,
        }}
      >
        The patchbay hub for a room
        <br />
        already full of outboard gear.
      </div>

      {/* hero: the 16A rear panel - the dense TRS array that is the story */}
      <div style={{ marginTop: 40 }}>
        <Plate a={59} height={330} radius={20} />
      </div>
      <div style={{ marginTop: 16 }}>
        <Plate a={51} height={250} radius={20} />
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: 'flex', gap: 40, marginBottom: 30 }}>
        {[
          ['66', 'CHANNELS'],
          ['2×', 'RGB DISPLAYS'],
          ['DC', 'COUPLED OUTS'],
        ].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontFamily: F.mono, fontSize: 44, fontWeight: 700, color: C.ink }}>{v}</div>
            <div
              style={{
                fontFamily: F.body, fontSize: 19, fontWeight: 700,
                letterSpacing: '0.1em', color: C.inkFaint,
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `2px solid ${C.rule}`, paddingTop: 24 }}>
        <div
          style={{
            fontFamily: F.head, fontSize: 40, fontWeight: 800, color: C.ink,
            letterSpacing: '-0.015em',
          }}
        >
          {BRAND.distributor}
        </div>
        <div
          style={{
            fontFamily: F.body, fontSize: 25, fontWeight: 700, color: C.accent, marginTop: 6,
          }}
        >
          Authorized Distributor — East &amp; North East India
        </div>
      </div>
    </AbsoluteFill>

    <div
      style={{
        position: 'absolute', top: 150, right: 84, background: C.ink, color: '#fff',
        fontFamily: F.mono, fontSize: 24, fontWeight: 700, padding: '12px 20px',
        borderRadius: 8, letterSpacing: '0.05em', boxShadow: SHADOW.chip,
      }}
    >
      PART 2 / 3
    </div>
  </AbsoluteFill>
);
