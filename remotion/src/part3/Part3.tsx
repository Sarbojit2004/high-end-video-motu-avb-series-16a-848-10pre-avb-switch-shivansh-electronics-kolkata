import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
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
import { FinalCta } from './FinalCta';
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
  const o = Math.min(ramp(f, 0, 12), 1 - ramp(f, dur - 10, dur));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/* ================================================================== */
/* s1 — Where the mix is heard                                        */
/* ================================================================== */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s1').end - seg('s1').start;
  const drift = useDrift(6, 300);
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 5, 22)}>MOTU AVB Series · Part 3</Kicker>
          <div style={{ marginTop: 22 }}>
            <Headline size={96} enter={ramp(f, 12, 38)}>
              The control
            </Headline>
            <Headline size={96} enter={ramp(f, 26, 52)} color={C.accent}>
              room.
            </Headline>
          </div>
          <Subhead size={33} enter={ramp(f, 46, 76)}>
            Captured. Routed.
            <br />
            This is where it is heard.
          </Subhead>

          <div
            style={{
              marginTop: 40,
              transform: `translateY(${drift}px)`,
              opacity: ramp(f, 52, 86),
            }}
          >
            <Plate a={86} height={580} reveal={ramp(f, 52, 190)} focus={[0.30, 0.52]} zoom={2.5} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex' }}>
            <SpecChip label="Part 3 of 3" value="MOTU 848" enter={ramp(f, 124, 162)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s2 — Twelve outputs → 7.1.4                                        */
/* ================================================================== */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s2').end - seg('s2').start;
  const count = Math.round(
    interpolate(f, [18, 84], [0, 12], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
  );
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Immersive monitoring</Kicker>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 186,
                fontWeight: 900,
                lineHeight: 0.85,
                color: C.accent,
                letterSpacing: '-0.045em',
                opacity: ramp(f, 10, 28),
              }}
            >
              {count}
            </div>
            <Headline size={58} enter={ramp(f, 20, 46)}>
              analog
              <br />
              outputs.
            </Headline>
          </div>

          {/* macro along the output bank, pulling out to the full rear panel */}
          <div style={{ marginTop: 28 }}>
            <Plate a={90} height={440} reveal={ramp(f, 34, 168)} focus={[0.55, 0.45]} zoom={2.8} />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 150, 180) }}>
            <PlateRow items={[87, 92]} height={300} gap={13} enter={ramp(f, 150, 220)} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <SpecChip label="Atmos array" value="7.1.4" enter={ramp(f, 214, 240)} />
            <SpecChip label="From one clock" value="12 × TRS" enter={ramp(f, 226, 252)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s3 — One clock, no aggregation                                     */
/* ================================================================== */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s3').end - seg('s3').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>One clock source</Kicker>
          <Headline size={70} enter={ramp(f, 8, 30)}>
            No aggregation.
            <br />
            <span style={{ color: C.accent }}>No phase smear.</span>
          </Headline>

          <div style={{ marginTop: 28, opacity: ramp(f, 24, 54) }}>
            <Plate a={72} height={430} radius={18} />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 92, 122) }}>
            <PlateRow items={[91, 81]} height={300} gap={13} enter={ramp(f, 92, 158)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={28} enter={ramp(f, 160, 192)}>
            One interface drives the whole array. Nothing to sync, nothing to drift.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s4 — Four combo inputs                                             */
/* ================================================================== */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s4').end - seg('s4').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Everyday capture</Kicker>
          <Headline size={70} enter={ramp(f, 8, 32)}>
            Four combo
            <br />
            inputs. <span style={{ color: C.accent }}>74 dB.</span>
          </Headline>

          <div style={{ marginTop: 28 }}>
            <Plate a={95} height={470} reveal={ramp(f, 18, 152)} focus={[0.36, 0.5]} zoom={2.6} />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 148, 178) }}>
            <PlateRow items={[83, 74]} height={310} gap={13} enter={ramp(f, 148, 216)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={28} enter={ramp(f, 224, 258)}>
            A vocal overdub, a bass direct, a stereo synth — without a second box.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s5 — Inserts on channels 3-4                                       */
/* ================================================================== */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s5').end - seg('s5').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Channels 3–4</Kicker>
          <Headline size={70} enter={ramp(f, 8, 30)}>
            Dedicated
            <br />
            analog inserts.
          </Headline>

          <div style={{ marginTop: 30, position: 'relative' }}>
            <Plate a={93} height={520} reveal={ramp(f, 16, 150)} focus={[0.22, 0.48]} zoom={2.5} />
            <UiHighlight x={0.05} y={0.20} w={0.26} h={0.60} enter={ramp(f, 128, 210)} label="SEND / RETURN 3–4" />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 158, 188) }}>
            <Plate a={80} height={280} radius={16} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={28} enter={ramp(f, 198, 230)}>
            Your vocal compressor stays patched in, permanently.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s6 — Monitor control                                               */
/* ================================================================== */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s6').end - seg('s6').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Monitor control</Kicker>
          <Headline size={70} enter={ramp(f, 8, 30)}>
            A / B / C.
            <br />
            <span style={{ color: C.accent }}>Talkback.</span>
          </Headline>

          <div style={{ marginTop: 28 }}>
            <Plate a={27} height={470} reveal={ramp(f, 14, 132)} focus={[0.5, 0.5]} zoom={2.0} />
          </div>
          <div style={{ marginTop: 14, opacity: ramp(f, 118, 148) }}>
            <PlateRow items={[89, 97]} height={290} gap={13} enter={ramp(f, 118, 184)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={28} enter={ramp(f, 172, 204)}>
            Two headphone outputs, each with a programmable source.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s7 — The renderer, routed                                          */
/* ================================================================== */
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s7').end - seg('s7').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>CueMix Pro</Kicker>
          <Headline size={68} enter={ramp(f, 8, 30)}>
            Renderer to
            <br />
            <span style={{ color: C.accent }}>speaker, direct.</span>
          </Headline>

          <div style={{ marginTop: 26, position: 'relative', opacity: ramp(f, 20, 48) }}>
            <Plate a={98} height={390} radius={16} />
            <UiHighlight x={0.58} y={0.12} w={0.34} h={0.74} enter={ramp(f, 46, 124)} label="→ ANALOG OUTS" />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 118, 146) }}>
            <PlateRow items={[28, 76]} height={250} gap={12} enter={ramp(f, 118, 182)} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 168, 196) }}>
            <PlateRow items={[94, 78]} height={230} gap={12} enter={ramp(f, 168, 230)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={27} enter={ramp(f, 214, 244)}>
            Metering on every leg of the array.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s8 — The shared engine, again                                      */
/* ================================================================== */
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s8').end - seg('s8').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Beneath all three</Kicker>
          <Headline size={68} enter={ramp(f, 8, 30)}>
            The same engine.
          </Headline>

          <div style={{ marginTop: 26, opacity: ramp(f, 22, 50) }}>
            <PlateRow items={[88, 82]} height={280} gap={13} enter={ramp(f, 22, 88)} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 88, 116) }}>
            <PlateRow items={[96, 73]} height={260} gap={13} enter={ramp(f, 88, 152)} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 142, 170) }}>
            <Plate a={75} height={230} radius={14} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <SpecChip label="Conversion" value="ESS Sabre32" enter={ramp(f, 176, 202)} />
            <SpecChip label="Host" value="40 Gbps" enter={ramp(f, 188, 214)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s9 — The network completes                                         */
/* ================================================================== */
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s9').end - seg('s9').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 18)}>Milan-certified AVB</Kicker>
          <Headline size={66} enter={ramp(f, 8, 30)}>
            Three rooms.
            <br />
            <span style={{ color: C.accent }}>One network.</span>
          </Headline>

          <div style={{ marginTop: 26, opacity: ramp(f, 22, 50) }}>
            <Plate a={32} height={370} radius={16} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 88, 116) }}>
            <PlateRow items={[29, 77]} height={250} gap={12} enter={ramp(f, 88, 152)} />
          </div>
          <div style={{ marginTop: 13, opacity: ramp(f, 148, 176) }}>
            <PlateRow items={[84, 85, 79]} height={200} gap={11} enter={ramp(f, 148, 212)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={26} enter={ramp(f, 200, 232)}>
            Interoperable with other Milan-certified equipment across the industry.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s10 — Final CTA (close of the series)                              */
/* ================================================================== */
const S10: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s10').end - seg('s10').start;
  return (
    <SceneWrap dur={d}>
      <LightStage>
        <FinalCta f={f} />
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */

const SCENES: Record<string, React.FC> = {
  s1: S1, s2: S2, s3: S3, s4: S4, s5: S5,
  s6: S6, s7: S7, s8: S8, s9: S9, s10: S10,
};

export const Part3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Audio src={staticFile('audio/bed_part3.wav')} volume={0.9} />
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
