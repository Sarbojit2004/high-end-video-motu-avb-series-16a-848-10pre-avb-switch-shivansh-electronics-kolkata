import React from 'react';
import {
  AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame,
} from 'remotion';
import { BRAND, C, F } from '../../theme';
import {
  BrandLowerThird, LONG_FRAMES, LongStage, M, MotuMark, PersistentBrand,
  ProgressRule, ramp,
} from '../layout';
import { LongScene, renderScene } from '../SceneRenderer';
import { SEGMENTS } from './timeline';

const SPECS: Record<string, Omit<LongScene, 'id'>> = {
  s1: {
    kicker: 'MOTU AVB Series · Part 3 of 3',
    head: ['The control', '~room.'],
    headSize: 92,
    sub: 'Captured. Routed. This is where it is finally heard.',
    ratio: 0.44,
    plates: [{ a: 86, h: 720, reveal: [40, 320], focus: [0.30, 0.52], zoom: 2.4, enter: [30, 80] }],
    specs: [['Part 3 of 3', 'MOTU 848']],
    specsAt: 220,
  },
  s2: {
    kicker: 'Immersive monitoring',
    head: ['analog', 'outputs.'],
    count: { to: 12, label: ['analog', 'outputs.'], from: 20, to_: 110 },
    sub: 'Not eight. Not sixteen. Twelve — and the reason is the point of this unit.',
    ratio: 0.34,
    plates: [
      { a: 90, h: 420, reveal: [40, 300], focus: [0.55, 0.45], zoom: 2.5, enter: [30, 80] },
      { a: 87, h: 340, enter: [250, 300] },
    ],
  },
  s3: {
    kicker: 'Why twelve',
    head: ['7 + 1 + 4.'],
    headSize: 104,
    sub: 'Seven ear-level speakers. One subwoofer channel. Four height speakers overhead. Twelve discrete feeds, each needing its own analog output.',
    ratio: 0.42,
    plates: [
      { a: 92, h: 400, reveal: [30, 280], focus: [0.5, 0.5], zoom: 1.8, enter: [24, 74] },
      { a: 72, h: 320, enter: [260, 310] },
    ],
  },
  s4: {
    kicker: 'The usual compromise',
    head: ['Two boxes.', '~Two clocks.'],
    sub: 'Aggregating interfaces works on paper. In a room it drifts, and phase smear across the array is exactly what an immersive mix exists to reveal.',
    ratio: 0.40,
    plates: [
      { a: 91, h: 420, enter: [24, 74] },
      { a: 81, h: 320, enter: [260, 310] },
    ],
  },
  s5: {
    kicker: 'One clock source',
    head: ['Nothing to sync.', '~Nothing to drift.'],
    layout: 'banner',
    plates: [
      { a: 82, h: 400, enter: [30, 80] },
      { a: 88, h: 260, enter: [240, 290] },
    ],
    specs: [['Conversion', 'ESS Sabre32 Ultra'], ['Outputs', '12 × balanced TRS']],
    specsAt: 340,
  },
  s6: {
    kicker: 'Everyday capture',
    head: ['Four combo', 'inputs. ~74 dB.'],
    ratio: 0.36,
    plates: [
      { a: 95, h: 440, reveal: [24, 300], focus: [0.36, 0.5], zoom: 2.4, enter: [20, 70] },
      { a: 74, h: 320, enter: [270, 320] },
    ],
    specs: [['Gain', '74 dB'], ['EIN', '−129 dBu']],
    specsAt: 400,
  },
  s7: {
    kicker: 'What they are for',
    head: ['A vocal fix.', '~Without leaving the chair.'],
    headSize: 62,
    layout: 'banner',
    plates: [
      { a: 83, h: 400, enter: [30, 80] },
      { a: 96, h: 280, enter: [240, 290] },
    ],
  },
  s8: {
    kicker: 'Channels 3–4',
    head: ['Dedicated', 'analog inserts.'],
    sub: 'Ahead of conversion, so the sound you print is the sound you approved.',
    ratio: 0.36,
    plates: [
      {
        a: 93, h: 460, reveal: [24, 300], focus: [0.22, 0.48], zoom: 2.4, enter: [20, 70],
        hi: [0.05, 0.20, 0.26, 0.60, 300, 430, 'SEND / RETURN 3–4'],
      },
      { a: 80, h: 280, enter: [300, 350] },
    ],
  },
  s9: {
    kicker: 'Monitor control',
    head: ['A / B / C,', '~switched in analog.'],
    ratio: 0.36,
    plates: [
      { a: 27, h: 440, reveal: [24, 260], focus: [0.5, 0.5], zoom: 1.9, enter: [20, 70] },
      { a: 97, h: 300, enter: [280, 330] },
    ],
  },
  s10: {
    kicker: 'Two listeners',
    head: ['Talkback.', '~Two headphone mixes.'],
    layout: 'banner',
    plates: [
      { a: 89, h: 400, reveal: [30, 280], focus: [0.5, 0.55], zoom: 2.0, enter: [24, 74] },
      { a: 78, h: 280, enter: [250, 300] },
    ],
  },
  s11: {
    kicker: 'At the hardware',
    head: ['All twelve legs,', '~metered.'],
    layout: 'banner',
    plates: [
      { a: 94, h: 470, reveal: [30, 300], focus: [0.5, 0.5], zoom: 1.8, enter: [24, 74] },
    ],
    foot: 'Not in a plug-in window behind three other windows.',
    footAt: 340,
  },
  s12: {
    kicker: 'CueMix Pro',
    head: ['Renderer to', '~speaker, direct.'],
    ratio: 0.34,
    plates: [
      {
        a: 98, h: 430, enter: [20, 66],
        hi: [0.58, 0.12, 0.34, 0.74, 70, 220, '→ ANALOG OUTS'],
      },
      { a: 76, h: 330, enter: [280, 330] },
    ],
  },
  s13: {
    kicker: 'Level-matching',
    head: ['Trim the array,', '~not the renderer.'],
    ratio: 0.36,
    plates: [
      { a: 28, h: 420, enter: [20, 66] },
      { a: 73, h: 300, enter: [240, 290] },
    ],
  },
  s14: {
    kicker: 'Beneath all three',
    head: ['The same engine.'],
    layout: 'banner',
    row: { items: [75, 84], h: 440, at: 30 },
    plates: [],
    specs: [['Host', '40 Gbps TB4 / USB4'], ['Round trip', '1.8 ms']],
    specsAt: 260,
  },
  s15: {
    kicker: 'In the box',
    head: ['Instruments,', '~loops and effects.'],
    layout: 'banner',
    row: { items: [85, 79], h: 420, at: 30 },
    plates: [],
  },
  s16: {
    kicker: 'Milan-certified AVB',
    head: ['Three rooms.', '~One network.'],
    ratio: 0.36,
    plates: [
      { a: 32, h: 420, reveal: [24, 300], focus: [0.5, 0.5], zoom: 1.6, enter: [20, 70] },
      { a: 29, h: 300, enter: [280, 330] },
    ],
  },
  s17: {
    kicker: 'One platform',
    head: ['8 devices.', '~128 channels each.'],
    layout: 'banner',
    plates: [{ a: 77, h: 420, enter: [30, 80] }],
    specs: [['Network latency', '2 ms fixed'], ['Standard', 'Milan · Avnu Alliance']],
    specsAt: 220,
  },
};

/**
 * The close of the whole long-form series (prompt s7): both logos, the full
 * contact block, the address, and the identical-investment price framing.
 */
const FinalCta: React.FC = () => {
  const f = useCurrentFrame();
  const t = ramp(f, 0, 300);
  return (
    <LongStage>
      <AbsoluteFill style={{ padding: `${M.y}px ${M.x}px`, display: 'flex', flexDirection: 'row' }}>
        {/* left: the claim + price */}
        <div style={{ width: '52%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div
            style={{
              fontFamily: F.head, fontSize: 62, fontWeight: 800, lineHeight: 1.04,
              letterSpacing: '-0.022em', color: C.ink, opacity: ramp(f, 20, 60),
            }}
          >
            One engine.
            <br />
            Three specialized
            <br />
            front-ends.
          </div>
          <div
            style={{
              marginTop: 34, padding: '26px 32px', borderLeft: `4px solid ${C.accent}`,
              background: 'rgba(255,255,255,0.74)', borderRadius: 12,
              opacity: ramp(f, 70, 110),
            }}
          >
            <div
              style={{
                fontFamily: F.body, fontSize: 20, fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: C.inkFaint,
              }}
            >
              One identical investment
            </div>
            <div
              style={{
                fontFamily: F.mono, fontSize: 62, fontWeight: 700, color: C.ink,
                marginTop: 8, letterSpacing: '-0.02em',
              }}
            >
              MOP {BRAND.mop}
            </div>
            <div style={{ fontFamily: F.body, fontSize: 21, color: C.inkSoft, marginTop: 4 }}>
              incl. GST · per unit · 16A · 848 · 10pre
            </div>
          </div>
        </div>

        {/* right: the distributor block */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, opacity: ramp(f, 100, 140) }}>
            <Img src={staticFile('img/logo-shivansh.png')} style={{ height: 96, objectFit: 'contain' }} />
          </div>
          <div
            style={{
              fontFamily: F.head, fontSize: 44, fontWeight: 800, color: C.ink,
              marginTop: 22, opacity: ramp(f, 120, 160),
            }}
          >
            {BRAND.distributor}
          </div>
          <div
            style={{
              fontFamily: F.body, fontSize: 24, fontWeight: 700, color: C.accent,
              marginTop: 8, lineHeight: 1.3, opacity: ramp(f, 132, 172),
            }}
          >
            {BRAND.designation}
          </div>
          <div style={{ height: 1, background: C.rule, margin: '22px 0' }} />
          <div
            style={{
              fontFamily: F.mono, fontSize: 23, color: C.inkSoft, lineHeight: 1.6,
              opacity: ramp(f, 150, 190),
            }}
          >
            {BRAND.whatsapp.join('  ·  ')}
          </div>
          <div
            style={{
              fontFamily: F.body, fontSize: 27, fontWeight: 700, color: C.ink,
              marginTop: 10, opacity: ramp(f, 162, 202),
            }}
          >
            {BRAND.web}
          </div>
          <div
            style={{
              fontFamily: F.body, fontSize: 19, color: C.inkFaint, marginTop: 16,
              lineHeight: 1.45, maxWidth: 700, opacity: ramp(f, 176, 216),
            }}
          >
            {BRAND.address}
          </div>
        </div>
      </AbsoluteFill>

      {/* MOTU joins for the close, drifting rather than pinned */}
      <Img
        src={staticFile('img/logo-motu.png')}
        style={{
          position: 'absolute', right: M.x, top: M.y + 6 - t * 8, height: 58,
          objectFit: 'contain', opacity: ramp(f, 40, 90),
          filter: 'drop-shadow(0 6px 18px rgba(12,18,32,0.16))',
        }}
      />
    </LongStage>
  );
};

const SCENES: Record<string, React.FC> = Object.fromEntries(
  SEGMENTS.filter((s) => s.id !== 's18').map((s) => [
    s.id,
    renderScene({ id: s.id, ...SPECS[s.id] }, s.end - s.start),
  ]),
);
SCENES.s18 = FinalCta;

const LOWER_THIRDS = [660, 2050, 3500, 4900, 6300, 7500];

export const LongPart3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio src={staticFile('audio/bed_long3.wav')} volume={0.9} />
      {SEGMENTS.map((s) => {
        const Cmp = SCENES[s.id];
        return (
          <Sequence key={s.id} from={s.start} durationInFrames={s.end - s.start} name={`${s.id} · ${s.label}`}>
            <Cmp />
          </Sequence>
        );
      })}
      <PersistentBrand frame={f} />
      {LOWER_THIRDS.map((fr, i) => (
        <BrandLowerThird key={fr} frame={f} in_={fr} hold={165} index={i + 2} />
      ))}
      {/* MOTU: the shared-engine beat and the network payoff, then the CTA
          carries its own mark */}
      <MotuMark frame={f} in_={6950} hold={180} x={104} y={928} h={50} />
      <MotuMark frame={f} in_={7700} hold={200} x={1560} y={132} h={54} />
      <ProgressRule frame={f} total={LONG_FRAMES} />
    </AbsoluteFill>
  );
};
