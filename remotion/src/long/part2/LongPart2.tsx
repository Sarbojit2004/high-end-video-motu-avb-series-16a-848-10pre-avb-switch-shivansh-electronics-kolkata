import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { C } from '../../theme';
import {
  BrandLowerThird, LONG_FRAMES, MotuMark, PersistentBrand, ProgressRule,
} from '../layout';
import { LongScene, renderScene } from '../SceneRenderer';
import { SEGMENTS } from './timeline';

/** Scene specs, keyed to the segment ids in timeline.ts. */
const SPECS: Record<string, Omit<LongScene, 'id'>> = {
  s1: {
    kicker: 'MOTU AVB Series · Part 2 of 3',
    head: ['The', '~patchbay.'],
    headSize: 96,
    sub: 'Same engine. Same price. A different door.',
    ratio: 0.44,
    plates: [{ a: 51, h: 720, reveal: [40, 320], focus: [0.44, 0.5], zoom: 2.3, enter: [30, 80] }],
    specs: [['Part 2 of 3', 'MOTU 16A']],
    specsAt: 200,
  },
  s2: {
    kicker: 'Line-level density',
    head: ['in.', '16 out.'],
    count: { to: 16, label: ['in.', '16 out.'], from: 20, to_: 100 },
    ratio: 0.34,
    plates: [
      { a: 59, h: 400, reveal: [40, 300], focus: [0.5, 0.5], zoom: 1.9, enter: [30, 80] },
      { a: 66, h: 400, reveal: [260, 500], focus: [0.6, 0.44], zoom: 2.5, enter: [250, 300] },
    ],
    specs: [['Balanced TRS', '16 × 16'], ['Total channels', '66']],
    specsAt: 400,
  },
  s3: {
    kicker: 'The jack field',
    head: ['Nothing else', '~competing for space.'],
    layout: 'banner',
    plates: [
      { a: 68, h: 400, reveal: [30, 300], focus: [0.5, 0.5], zoom: 2.4, enter: [24, 74] },
      { a: 71, h: 300, enter: [230, 280] },
    ],
  },
  s4: {
    kicker: 'Only on the 16A',
    head: ['~Two', 'RGB displays.'],
    sub: 'The 10pre and the 848 each carry one. This carries two.',
    ratio: 0.36,
    plates: [
      { a: 39, h: 400, reveal: [24, 260], focus: [0.5, 0.5], zoom: 1.8, enter: [20, 66] },
      { a: 53, h: 340, enter: [220, 270] },
    ],
  },
  s5: {
    kicker: 'Why two',
    head: ['Inputs and outputs,', '~at the same time.'],
    layout: 'banner',
    plates: [
      { a: 55, h: 340, enter: [30, 80] },
      { a: 57, h: 340, enter: [240, 290] },
    ],
    foot: 'One screen would have to page between them. Two do not.',
    footAt: 420,
  },
  s6: {
    kicker: 'By design',
    head: ['Zero preamps.', '~That is the point.'],
    sub: 'If you already own the preamps you like, built-in ones are money spent twice.',
    ratio: 0.38,
    plates: [
      { a: 64, h: 440, enter: [24, 74] },
      { a: 42, h: 300, enter: [250, 300] },
    ],
  },
  s7: {
    kicker: 'Control voltage',
    head: ['All sixteen,', '~DC-coupled.'],
    sub: 'The interface that drives your monitors can sequence a modular rig from the timeline.',
    ratio: 0.38,
    plates: [
      { a: 30, h: 440, reveal: [24, 300], focus: [0.5, 0.5], zoom: 1.6, enter: [20, 70] },
      { a: 44, h: 300, enter: [260, 310] },
    ],
  },
  s8: {
    kicker: 'Fully patched',
    head: ['Wired once.', '~Reachable from software.'],
    layout: 'banner',
    plates: [
      { a: 69, h: 420, reveal: [30, 320], focus: [0.5, 0.5], zoom: 1.7, enter: [24, 74] },
      { a: 49, h: 280, enter: [240, 290] },
    ],
  },
  s9: {
    kicker: 'Expansion',
    head: ['Two ADAT banks.', '~66 channels.'],
    ratio: 0.36,
    plates: [
      { a: 46, h: 420, enter: [24, 74] },
      { a: 45, h: 320, enter: [250, 300] },
    ],
    specs: [['Word clock', 'In · Out · Thru']],
    specsAt: 380,
  },
  s10: {
    kicker: 'CueMix Pro',
    head: ['Every channel,', '~one page.'],
    ratio: 0.32,
    plates: [
      { a: 52, h: 320, enter: [20, 66], hi: [0.05, 0.14, 0.9, 0.5, 60, 200, 'INPUT TRIM 1–16'] },
      { a: 60, h: 300, enter: [200, 250], hi: [0.05, 0.16, 0.9, 0.48, 240, 380, 'OUTPUT TRIM 1–16'] },
      { a: 50, h: 260, enter: [380, 430] },
    ],
  },
  s11: {
    kicker: 'CueMix Pro',
    head: ['Point to point.'],
    sub: 'Any input, optical channel or network stream, to any destination — no fixed signal path.',
    ratio: 0.34,
    plates: [
      {
        a: 62, h: 440, enter: [20, 66],
        hi: [0.05, 0.10, 0.34, 0.80, 70, 220, 'LINE INPUTS 1–16'],
      },
      { a: 63, h: 340, enter: [280, 330] },
    ],
  },
  s12: {
    kicker: 'Per-channel processing',
    head: ['EQ. Compressor.', 'Gate. ~Every channel.'],
    headSize: 62,
    ratio: 0.34,
    plates: [
      { a: 61, h: 420, enter: [20, 66], hi: [0.28, 0.12, 0.66, 0.38, 70, 220, '4-BAND PARAMETRIC'] },
      { a: 47, h: 320, enter: [260, 310] },
    ],
    specs: [['Processing', '32-bit float']],
    specsAt: 380,
  },
  s13: {
    kicker: 'Aux buses',
    head: ['One input,', '~several mixes.'],
    ratio: 0.36,
    plates: [
      { a: 54, h: 420, enter: [20, 66] },
      { a: 58, h: 320, enter: [240, 290] },
    ],
    specs: [['Aux buses', '26']],
    specsAt: 340,
  },
  s14: {
    kicker: 'On the same DSP',
    head: ['Effects, included.'],
    layout: 'banner',
    row: { items: [34, 65], h: 460, at: 30 },
    plates: [],
  },
  s15: {
    kicker: 'In the session',
    head: ['One large,', '~stable interface.'],
    layout: 'banner',
    row: { items: [40, 41], h: 460, at: 30 },
    plates: [],
    foot: 'Three decades of driver engineering, doing its job quietly.',
    footAt: 300,
  },
  s16: {
    kicker: 'Control surfaces',
    head: ['At the rack,', '~not the desk.'],
    layout: 'banner',
    row: { items: [48, 56], h: 460, at: 30 },
    plates: [],
  },
  s17: {
    kicker: 'Milan-certified AVB',
    head: ['One cable', '~adds the next.'],
    ratio: 0.34,
    plates: [
      { a: 43, h: 400, enter: [20, 66] },
      { a: 67, h: 280, enter: [230, 280] },
      { a: 70, h: 260, enter: [380, 430] },
    ],
    specs: [['Devices', 'up to 8'], ['Network latency', '2 ms fixed']],
    specsAt: 420,
  },
  s18: {
    kicker: 'Next',
    head: ['Routed.', '~Now, where it lands.'],
    headSize: 78,
    sub: 'Part 3 — The Control Room · MOTU 848',
    ratio: 0.46,
    plates: [
      { a: 38, h: 360, enter: [30, 80] },
      { a: 37, h: 300, enter: [200, 250] },
    ],
  },
};

const SCENES: Record<string, React.FC> = Object.fromEntries(
  SEGMENTS.map((s) => [
    s.id,
    renderScene({ id: s.id, ...SPECS[s.id] }, s.end - s.start),
  ]),
);

const LOWER_THIRDS = [640, 2000, 3400, 4800, 6200, 7600];

export const LongPart2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio src={staticFile('audio/bed_long2.wav')} volume={0.9} />
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
        <BrandLowerThird key={fr} frame={f} in_={fr} hold={165} index={i + 1} />
      ))}
      {/* MOTU appears far less often than Shivansh (prompt s5) */}
      <MotuMark frame={f} in_={300} hold={170} x={104} y={928} h={50} />
      <MotuMark frame={f} in_={7900} hold={200} x={1560} y={132} h={54} />
      <ProgressRule frame={f} total={LONG_FRAMES} />
    </AbsoluteFill>
  );
};
