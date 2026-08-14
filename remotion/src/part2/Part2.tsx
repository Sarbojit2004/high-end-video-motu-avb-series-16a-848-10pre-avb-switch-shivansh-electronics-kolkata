import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { AvbChain } from '../AvbChain';
import {
  ContactBlock,
  Headline,
  Kicker,
  LightStage,
  Plate,
  PlateRow,
  Safe,
  SpecChip,
  Subhead,
  UiHighlight,
  useDrift,
} from '../components';
import { C, F } from '../theme';
import { SEGMENTS } from './timeline';

const seg = (id: string) => {
  const s = SEGMENTS.find((x) => x.id === id);
  if (!s) throw new Error(`no segment ${id}`);
  return s;
};

const ramp = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

const SceneWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, 0, 10), 1 - ramp(f, dur - 9, dur));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/* ================================================================== */
/* s1 — Hook                                                          */
/* ================================================================== */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s1').end - seg('s1').start;
  const drift = useDrift(5, 260);
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 5, 22)}>MOTU AVB Series · Part 2</Kicker>
          <div style={{ marginTop: 22 }}>
            <Headline size={98} enter={ramp(f, 12, 38)}>
              The
            </Headline>
            <Headline size={98} enter={ramp(f, 26, 52)} color={C.accent}>
              patchbay.
            </Headline>
          </div>
          <Subhead size={33} enter={ramp(f, 46, 76)}>
            Same engine. Same price.
            <br />
            A different door.
          </Subhead>

          <div
            style={{
              marginTop: 40,
              transform: `translateY(${drift}px)`,
              opacity: ramp(f, 54, 88),
            }}
          >
            <Plate a={51} height={560} reveal={ramp(f, 54, 210)} focus={[0.44, 0.5]} zoom={2.4} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex' }}>
            <SpecChip label="Part 2 of 3" value="MOTU 16A" enter={ramp(f, 140, 180)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s2 — Sixteen in, sixteen out                                       */
/* ================================================================== */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s2').end - seg('s2').start;
  const count = Math.round(
    interpolate(f, [16, 74], [0, 16], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Line-level density</Kicker>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 176,
                fontWeight: 900,
                lineHeight: 0.85,
                color: C.accent,
                letterSpacing: '-0.045em',
                opacity: ramp(f, 8, 26),
              }}
            >
              {count}
            </div>
            <Headline size={56} enter={ramp(f, 18, 42)}>
              in.
              <br />
              {count} out.
            </Headline>
          </div>

          {/* macro along the endless rows of TRS jacks, then pull out */}
          <div style={{ marginTop: 26 }}>
            <Plate a={66} height={430} reveal={ramp(f, 30, 150)} focus={[0.62, 0.42]} zoom={3.0} />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 130, 158) }}>
            <PlateRow items={[68, 59]} height={300} gap={13} enter={ramp(f, 130, 196)} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <SpecChip label="Balanced TRS" value="16 × 16" enter={ramp(f, 176, 200)} />
            <SpecChip label="Total channels" value="66" enter={ramp(f, 188, 212)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s3 — Dual displays                                                 */
/* ================================================================== */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s3').end - seg('s3').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Only on the 16A</Kicker>
          <Headline size={72} enter={ramp(f, 8, 30)}>
            <span style={{ color: C.accent }}>Two</span> RGB displays.
            <br />
            Not one.
          </Headline>

          <div style={{ marginTop: 28, position: 'relative' }}>
            <Plate a={39} height={330} reveal={ramp(f, 14, 110)} focus={[0.5, 0.5]} zoom={1.9} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 84, 110) }}>
            <Plate a={53} height={230} radius={14} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 108, 134) }}>
            <Plate a={55} height={230} radius={14} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={28} enter={ramp(f, 132, 160)}>
            66 channels of metering, readable across the room.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s4 — No preamps, by design                                         */
/* ================================================================== */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s4').end - seg('s4').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>By design</Kicker>
          <Headline size={74} enter={ramp(f, 8, 32)}>
            Zero preamps.
            <br />
            <span style={{ color: C.accent }}>That is the point.</span>
          </Headline>

          <div style={{ marginTop: 30, opacity: ramp(f, 26, 56) }}>
            <Plate a={64} height={470} radius={18} />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 108, 138) }}>
            <PlateRow items={[57, 42]} height={280} gap={13} enter={ramp(f, 108, 176)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={28} enter={ramp(f, 190, 224)}>
            You already own the preamps you like. Nothing here is spent twice.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s5 — DC-coupled outputs / CV                                       */
/* ================================================================== */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s5').end - seg('s5').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Control voltage</Kicker>
          <Headline size={72} enter={ramp(f, 8, 32)}>
            All sixteen,
            <br />
            <span style={{ color: C.accent }}>DC-coupled.</span>
          </Headline>

          <div style={{ marginTop: 28, opacity: ramp(f, 24, 54) }}>
            <Plate a={30} height={430} radius={18} />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 96, 126) }}>
            <PlateRow items={[44, 69]} height={300} gap={13} enter={ramp(f, 96, 164)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={28} enter={ramp(f, 180, 212)}>
            Sequence a modular rig straight from the session timeline.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s6 — ADAT + word clock                                             */
/* ================================================================== */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s6').end - seg('s6').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Expansion</Kicker>
          <Headline size={70} enter={ramp(f, 8, 30)}>
            Two ADAT banks.
            <br />
            <span style={{ color: C.accent }}>66 channels.</span>
          </Headline>

          <div style={{ marginTop: 28, position: 'relative' }}>
            <Plate a={49} height={400} reveal={ramp(f, 14, 118)} focus={[0.30, 0.5]} zoom={2.5} />
            <UiHighlight x={0.05} y={0.24} w={0.20} h={0.50} enter={ramp(f, 96, 168)} label="WORD CLOCK" />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 108, 136) }}>
            <PlateRow items={[71, 46]} height={290} gap={13} enter={ramp(f, 108, 172)} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex' }}>
            <SpecChip label="Word clock" value="In · Out · Thru" enter={ramp(f, 170, 198)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s7 — The patchbay in software                                      */
/* ================================================================== */
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s7').end - seg('s7').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>CueMix Pro</Kicker>
          <Headline size={70} enter={ramp(f, 8, 30)}>
            Point to point.
          </Headline>

          <div style={{ marginTop: 26, position: 'relative', opacity: ramp(f, 20, 48) }}>
            <Plate a={62} height={420} radius={16} />
            <UiHighlight x={0.06} y={0.10} w={0.32} h={0.78} enter={ramp(f, 44, 120)} label="LINE INPUTS 1–16" />
            <UiHighlight x={0.62} y={0.10} w={0.33} h={0.78} enter={ramp(f, 78, 150)} label="DESTINATIONS" />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 128, 156) }}>
            <PlateRow items={[63, 52]} height={250} gap={12} enter={ramp(f, 128, 190)} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 178, 206) }}>
            <Plate a={60} height={230} radius={14} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={27} enter={ramp(f, 206, 232)}>
            Any input, to any output, in any combination.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s8 — DSP on every channel                                          */
/* ================================================================== */
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s8').end - seg('s8').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>On-board DSP</Kicker>
          <Headline size={68} enter={ramp(f, 8, 30)}>
            EQ. Compressor.
            <br />
            Gate. <span style={{ color: C.accent }}>Every channel.</span>
          </Headline>

          <div style={{ marginTop: 26, position: 'relative', opacity: ramp(f, 20, 48) }}>
            <Plate a={61} height={400} radius={16} />
            <UiHighlight x={0.30} y={0.14} w={0.62} h={0.44} enter={ramp(f, 44, 116)} label="4-BAND PARAMETRIC" />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 112, 140) }}>
            <PlateRow items={[47, 54]} height={260} gap={12} enter={ramp(f, 112, 172)} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 158, 186) }}>
            <Plate a={34} height={210} radius={14} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex' }}>
            <SpecChip label="Processing" value="32-bit float" enter={ramp(f, 186, 212)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s9 — AVB daisy-chain (the network motif)                           */
/* ================================================================== */
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s9').end - seg('s9').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Milan-certified AVB</Kicker>
          <Headline size={68} enter={ramp(f, 8, 30)}>
            One cable
            <br />
            <span style={{ color: C.accent }}>adds the next.</span>
          </Headline>

          {/* the daisy-chain motif: cable seats, pulse runs the chain */}
          <div style={{ marginTop: 24, opacity: ramp(f, 18, 44) }}>
            <AvbChain t={ramp(f, 24, 200)} units={3} label="up to 8 devices · 2 ms deterministic" />
          </div>

          <div style={{ marginTop: 6, opacity: ramp(f, 150, 178) }}>
            <PlateRow items={[45, 43]} height={250} gap={12} enter={ramp(f, 150, 214)} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 208, 236) }}>
            <PlateRow items={[48, 37, 67]} height={200} gap={11} enter={ramp(f, 208, 272)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={26} enter={ramp(f, 250, 280)}>
            Interoperable with other Milan-certified equipment across the industry.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s10 — Continuation + branding                                      */
/* ================================================================== */
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s10').end - seg('s10').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <div style={{ opacity: ramp(f, 4, 28) }}>
            <PlateRow items={[56, 58]} height={200} gap={11} enter={ramp(f, 4, 62)} />
          </div>
          <div style={{ marginTop: 11, opacity: ramp(f, 44, 70) }}>
            <PlateRow items={[70, 65]} height={190} gap={11} enter={ramp(f, 44, 104)} />
          </div>
          <div style={{ marginTop: 11, opacity: ramp(f, 84, 110) }}>
            <PlateRow items={[50, 40]} height={185} gap={11} enter={ramp(f, 84, 144)} />
          </div>
          <div style={{ marginTop: 11, opacity: ramp(f, 122, 148) }}>
            <PlateRow items={[41, 38]} height={185} gap={11} enter={ramp(f, 122, 182)} />
          </div>

          <div style={{ marginTop: 26 }}>
            <Headline size={54} enter={ramp(f, 168, 198)}>
              Routed.
            </Headline>
            <Headline size={54} enter={ramp(f, 182, 212)} color={C.accent}>
              Now, where it lands.
            </Headline>
            <Subhead size={25} enter={ramp(f, 198, 226)}>
              Part 3 — The Control Room · MOTU 848
            </Subhead>
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ borderTop: `1px solid ${C.rule}`, paddingTop: 22 }}>
            <ContactBlock enter={ramp(f, 232, 274)} compact />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */

const SCENES: Record<string, React.FC> = {
  s1: S1, s2: S2, s3: S3, s4: S4, s5: S5,
  s6: S6, s7: S7, s8: S8, s9: S9, s10: S10,
};

export const Part2: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Audio src={staticFile('audio/bed_part2.wav')} volume={0.9} />
    {SEGMENTS.map((s) => {
      const Cmp = SCENES[s.id];
      return (
        <Sequence
          key={s.id}
          from={s.start}
          durationInFrames={s.end - s.start}
          name={`${s.id} · ${s.label}`}
        >
          <Cmp />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
