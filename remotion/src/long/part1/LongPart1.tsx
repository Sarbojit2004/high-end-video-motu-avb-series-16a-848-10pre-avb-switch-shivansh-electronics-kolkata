import React from 'react';
import {
  AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame,
} from 'remotion';
import { C, F } from '../../theme';
import {
  BannerScene, BrandLowerThird, LHead, LKicker, LONG_FRAMES, LPlate, LPlateRow,
  LSpec, LSub, LUiHighlight, LongStage, MotuMark, PersistentBrand, ProgressRule,
  SplitScene, ramp,
} from '../layout';
import { SEGMENTS } from './timeline';

const seg = (id: string) => {
  const s = SEGMENTS.find((x) => x.id === id);
  if (!s) throw new Error(`no segment ${id}`);
  return s;
};
const dur = (id: string) => seg(id).end - seg(id).start;

const Wrap: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const f = useCurrentFrame();
  const d = dur(id);
  const o = Math.min(ramp(f, 0, 14), 1 - ramp(f, d - 12, d));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/* ================================================================== */
/* s1 — Series open                                                   */
/* ================================================================== */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s1">
      <LongStage>
        <SplitScene
          ratio={0.44}
          left={
            <>
              <LKicker enter={ramp(f, 8, 28)}>MOTU AVB Series · Part 1 of 3</LKicker>
              <div style={{ marginTop: 26 }}>
                <LHead size={96} enter={ramp(f, 16, 44)}>One engine.</LHead>
                <LHead size={96} enter={ramp(f, 32, 60)} color={C.accent}>Three doors.</LHead>
              </div>
              <div style={{ marginTop: 30 }}>
                <LSub size={31} enter={ramp(f, 56, 92)}>
                  Identical conversion. Identical price.
                  <br />
                  Only the front panel changes.
                </LSub>
              </div>
              <div style={{ marginTop: 40, display: 'flex' }}>
                <LSpec label="The Tracking Room" value="MOTU 10pre" enter={ramp(f, 150, 190)} />
              </div>
            </>
          }
          right={
            <LPlate a={5} h={720} reveal={ramp(f, 40, 300)} focus={[0.24, 0.54]} zoom={2.2} />
          }
        />
        <MotuMark frame={f} in_={210} hold={150} x={104} y={912} h={54} />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s2 — The scaling problem                                           */
/* ================================================================== */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s2">
      <LongStage>
        <SplitScene
          ratio={0.42}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>The problem</LKicker>
              <div style={{ marginTop: 22 }}>
                <LHead size={68} enter={ramp(f, 12, 40)}>
                  Needs change
                  <br />
                  faster than
                  <br />
                  <span style={{ color: C.accent }}>budgets do.</span>
                </LHead>
              </div>
              <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  ['Live room', '10 preamps'],
                  ['Mix suite', '16 line inputs'],
                  ['Immersive control room', '12 outputs'],
                ].map(([k, v], i) => (
                  <div
                    key={k}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                      borderBottom: `1px solid ${C.rule}`, paddingBottom: 10,
                      opacity: ramp(f, 90 + i * 40, 130 + i * 40),
                    }}
                  >
                    <span style={{ fontFamily: F.body, fontSize: 25, color: C.inkSoft }}>{k}</span>
                    <span style={{ fontFamily: F.mono, fontSize: 29, fontWeight: 700, color: C.ink }}>{v}</span>
                  </div>
                ))}
              </div>
            </>
          }
          right={<LPlate a={23} h={700} reveal={ramp(f, 20, 260)} focus={[0.5, 0.5]} zoom={1.6} />}
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s3 — Shared engine: ESS Sabre32                                    */
/* ================================================================== */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s3">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>The shared engine · 1 of 4</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={76} enter={ramp(f, 12, 40)}>
                  The same conversion stage, in all three.
                </LHead>
              </div>
            </>
          }
          body={
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <div style={{ width: '38%', opacity: ramp(f, 40, 76) }}>
                <LPlate a={33} h={340} radius={16} />
              </div>
              <div style={{ flex: 1, opacity: ramp(f, 90, 130) }}>
                <LPlate a={24} h={430} reveal={ramp(f, 90, 330)} focus={[0.5, 0.45]} zoom={1.9} />
              </div>
            </div>
          }
          foot={
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <LSpec label="Dynamic range" value="125 dB" enter={ramp(f, 330, 370)} />
              <LSpec label="THD + N" value="−114 dB" enter={ramp(f, 350, 390)} />
              <LSpec label="Across" value="16A · 848 · 10pre" enter={ramp(f, 370, 410)} />
            </div>
          }
        />
        <MotuMark frame={f} in_={60} hold={200} x={1560} y={880} h={50} />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s4 — Shared engine: Thunderbolt 4 / latency                        */
/* ================================================================== */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s4">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>The shared engine · 2 of 4</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={74} enter={ramp(f, 12, 40)}>
                  40 Gbps in. <span style={{ color: C.accent }}>1.8 ms back.</span>
                </LHead>
              </div>
            </>
          }
          body={
            <div style={{ opacity: ramp(f, 36, 72) }}>
              <LPlateRow items={[35, 19, 17]} h={480} gap={20} enter={ramp(f, 36, 190)} />
            </div>
          }
          foot={
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <LSpec label="Thunderbolt 4 / USB4" value="40 Gbps" enter={ramp(f, 210, 250)} />
              <LSpec label="Round-trip @ 96 kHz" value="1.8 ms" enter={ramp(f, 228, 268)} />
            </div>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s5 — Shared engine: CueMix Pro DSP                                 */
/* ================================================================== */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s5">
      <LongStage>
        <SplitScene
          ratio={0.36}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>The shared engine · 3 of 4</LKicker>
              <div style={{ marginTop: 20 }}>
                <LHead size={70} enter={ramp(f, 12, 40)}>
                  64 channels,
                  <br />
                  <span style={{ color: C.accent }}>on the hardware.</span>
                </LHead>
              </div>
              <div style={{ marginTop: 28 }}>
                <LSub size={28} enter={ramp(f, 40, 80)}>
                  Your track count never touches your monitoring.
                </LSub>
              </div>
              <div style={{ marginTop: 34, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <LSpec label="Mixer" value="64 channels" enter={ramp(f, 300, 340)} />
                <LSpec label="Aux buses" value="26" enter={ramp(f, 320, 360)} />
              </div>
            </>
          }
          right={
            <>
              <div style={{ position: 'relative', opacity: ramp(f, 30, 70) }}>
                <LPlate a={6} h={420} radius={16} />
                <LUiHighlight x={0.30} y={0.30} w={0.52} h={0.46} enter={ramp(f, 80, 200)} label="THREE UNITS, ONE NETWORK" />
              </div>
              <div style={{ position: 'relative', opacity: ramp(f, 200, 240) }}>
                <LPlate a={1} h={420} radius={16} />
                <LUiHighlight x={0.14} y={0.14} w={0.56} h={0.60} enter={ramp(f, 250, 380)} label="CUEMIX PRO MIXER" />
              </div>
            </>
          }
        />
        <MotuMark frame={f} in_={40} hold={170} x={104} y={928} h={48} />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s6 — Shared engine: Milan AVB                                      */
/* ================================================================== */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s6">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>The shared engine · 4 of 4</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={74} enter={ramp(f, 12, 40)}>
                  An open standard, not a private protocol.
                </LHead>
              </div>
            </>
          }
          body={
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <div style={{ flex: 1, opacity: ramp(f, 36, 76) }}>
                <LPlate a={15} h={460} reveal={ramp(f, 36, 300)} focus={[0.5, 0.5]} zoom={1.7} />
              </div>
              <div style={{ width: '34%', opacity: ramp(f, 150, 190) }}>
                <LPlate a={2} h={340} reveal={ramp(f, 150, 380)} focus={[0.18, 0.5]} zoom={2.1} />
              </div>
            </div>
          }
          foot={
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <LSpec label="Certification" value="Milan · Avnu Alliance" enter={ramp(f, 320, 360)} />
              <LSpec label="Network latency" value="2 ms fixed" enter={ramp(f, 340, 380)} />
              <LSpec label="Daisy-chain" value="up to 8 units" enter={ramp(f, 360, 400)} />
            </div>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s7 — Enter the 10pre                                               */
/* ================================================================== */
const S7: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s7">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Door one</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={92} enter={ramp(f, 12, 44)}>
                  MOTU <span style={{ color: C.accent }}>10pre</span>
                </LHead>
              </div>
            </>
          }
          body={
            <>
              <div style={{ opacity: ramp(f, 40, 80) }}>
                <LPlate a={26} h={420} reveal={ramp(f, 40, 300)} focus={[0.12, 0.52]} zoom={3.0} />
              </div>
              <div style={{ opacity: ramp(f, 250, 300) }}>
                <LPlate a={10} h={300} radius={16} />
              </div>
            </>
          }
          foot={
            <div style={{ marginTop: 14 }}>
              <LSub size={29} enter={ramp(f, 330, 380)}>
                54 channels · 1U · built for a room with a whole band in it.
              </LSub>
            </div>
          }
        />
        <MotuMark frame={f} in_={30} hold={190} x={1560} y={132} h={54} />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s8 — Ten microphone preamps                                        */
/* ================================================================== */
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const n = Math.round(
    Math.min(10, Math.max(0, ((f - 30) / 90) * 10)),
  );
  return (
    <Wrap id="s8">
      <LongStage>
        <SplitScene
          ratio={0.34}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Source capture</LKicker>
              <div
                style={{
                  fontFamily: F.head, fontSize: 240, fontWeight: 900, lineHeight: 0.82,
                  color: C.accent, letterSpacing: '-0.05em', marginTop: 10,
                  opacity: ramp(f, 14, 36),
                }}
              >
                {n}
              </div>
              <LHead size={58} enter={ramp(f, 30, 60)}>
                microphone
                <br />
                preamps.
              </LHead>
              <div style={{ marginTop: 30, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <LSpec label="Gain, each channel" value="74 dB" enter={ramp(f, 300, 340)} />
                <LSpec label="Equivalent input noise" value="−129 dBu" enter={ramp(f, 320, 360)} />
              </div>
            </>
          }
          right={
            <>
              <div style={{ opacity: ramp(f, 40, 80) }}>
                <LPlate a={18} h={430} reveal={ramp(f, 40, 260)} focus={[0.32, 0.5]} zoom={2.7} />
              </div>
              <div style={{ position: 'relative', opacity: ramp(f, 230, 270) }}>
                <LPlate a={8} h={420} radius={16} />
                <LUiHighlight x={0.16} y={0.14} w={0.68} h={0.58} enter={ramp(f, 280, 420)} label="MIC INPUTS 1–10" />
              </div>
            </>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s9 — The 8-rear / 2-front split                                    */
/* ================================================================== */
const S9: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s9">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Ergonomics, not spec sheet</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={76} enter={ramp(f, 12, 42)}>
                  Eight on the back. <span style={{ color: C.accent }}>Two on the front.</span>
                </LHead>
              </div>
            </>
          }
          body={
            <>
              <div style={{ opacity: ramp(f, 40, 84) }}>
                <LPlate a={13} h={330} radius={16} />
              </div>
              <div style={{ display: 'flex', gap: 22, alignItems: 'stretch' }}>
                <div style={{ flex: 1, opacity: ramp(f, 240, 290) }}>
                  <LPlate a={0} h={330} reveal={ramp(f, 240, 520)} focus={[0.42, 0.5]} zoom={1.8} />
                </div>
                <div
                  style={{
                    width: '34%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                    gap: 20, opacity: ramp(f, 330, 380),
                  }}
                >
                  {[
                    ['8 REAR', 'The permanent snake. Set once, never touched.'],
                    ['2 FRONT', 'The overdub nobody planned for.'],
                  ].map(([k, v]) => (
                    <div key={k} style={{ borderLeft: `3px solid ${C.accent}`, paddingLeft: 18 }}>
                      <div style={{ fontFamily: F.mono, fontSize: 30, fontWeight: 700, color: C.ink }}>{k}</div>
                      <div style={{ fontFamily: F.body, fontSize: 22, color: C.inkSoft, marginTop: 6, lineHeight: 1.35 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s10 — Hardware inserts, channels 1-2                               */
/* ================================================================== */
const S10: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s10">
      <LongStage>
        <SplitScene
          ratio={0.36}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Channels 1–2</LKicker>
              <div style={{ marginTop: 20 }}>
                <LHead size={74} enter={ramp(f, 12, 42)}>
                  Hardware
                  <br />
                  inserts.
                </LHead>
              </div>
              <div style={{ marginTop: 28 }}>
                <LSub size={28} enter={ramp(f, 40, 80)}>
                  Send and return, ahead of the converter — so the compressor prints
                  to the take rather than being applied after it.
                </LSub>
              </div>
            </>
          }
          right={
            <div style={{ position: 'relative' }}>
              <LPlate a={14} h={720} reveal={ramp(f, 20, 300)} focus={[0.72, 0.46]} zoom={2.3} />
              <LUiHighlight x={0.58} y={0.22} w={0.36} h={0.58} enter={ramp(f, 300, 430)} label="SEND / RETURN" />
            </div>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s11 — One-decibel gain calibration                                 */
/* ================================================================== */
const S11: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s11">
      <LongStage>
        <SplitScene
          ratio={0.36}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Repeatable gain staging</LKicker>
              <div style={{ marginTop: 20 }}>
                <LHead size={74} enter={ramp(f, 12, 42)}>
                  Steps of
                  <br />
                  <span style={{ color: C.accent }}>exactly 1 dB.</span>
                </LHead>
              </div>
              <div style={{ marginTop: 28 }}>
                <LSub size={28} enter={ramp(f, 40, 80)}>
                  A drum overhead pair only images correctly when both channels sit at
                  genuinely the same gain.
                </LSub>
              </div>
            </>
          }
          right={
            <>
              <div style={{ position: 'relative', opacity: ramp(f, 24, 64) }}>
                <LPlate a={7} h={440} radius={16} />
                <LUiHighlight x={0.05} y={0.28} w={0.24} h={0.42} enter={ramp(f, 70, 210)} label="GAIN" />
              </div>
              <div style={{ opacity: ramp(f, 220, 262) }}>
                <LPlate a={3} h={390} radius={16} />
              </div>
            </>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s12 — Dual headphone outputs                                       */
/* ================================================================== */
const S12: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s12">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Two cue mixes at once</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={74} enter={ramp(f, 12, 42)}>
                  The drummer hears theirs. <span style={{ color: C.accent }}>You hear yours.</span>
                </LHead>
              </div>
            </>
          }
          body={
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <div style={{ flex: 1, opacity: ramp(f, 36, 78) }}>
                <LPlate a={36} h={470} reveal={ramp(f, 36, 300)} focus={[0.5, 0.55]} zoom={2.1} />
              </div>
              <div style={{ width: '40%', opacity: ramp(f, 250, 300) }}>
                <LPlate a={22} h={340} radius={16} />
              </div>
            </div>
          }
          foot={
            <div style={{ marginTop: 16 }}>
              <LSub size={28} enter={ramp(f, 380, 430)}>
                Both mixes are built by the on-board DSP, so both are latency-free.
              </LSub>
            </div>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s13 — Eight DC-coupled line outputs                                */
/* ================================================================== */
const S13: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s13">
      <LongStage>
        <SplitScene
          ratio={0.36}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Output side</LKicker>
              <div style={{ marginTop: 20 }}>
                <LHead size={70} enter={ramp(f, 12, 42)}>
                  Eight outs,
                  <br />
                  <span style={{ color: C.accent }}>DC-coupled.</span>
                </LHead>
              </div>
              <div style={{ marginTop: 28 }}>
                <LSub size={28} enter={ramp(f, 40, 80)}>
                  The same connector that feeds a monitor can instead sequence an
                  analog synthesizer.
                </LSub>
              </div>
            </>
          }
          right={
            <>
              <div style={{ opacity: ramp(f, 24, 64) }}>
                <LPlate a={25} h={430} reveal={ramp(f, 24, 240)} focus={[0.5, 0.5]} zoom={2.0} />
              </div>
              <div style={{ opacity: ramp(f, 210, 252) }}>
                <LPlate a={11} h={370} radius={16} />
              </div>
            </>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s14 — The front-panel display                                      */
/* ================================================================== */
const S14: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s14">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>At the unit, not the screen</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={72} enter={ramp(f, 12, 42)}>
                  Live metering, <span style={{ color: C.accent }}>every channel.</span>
                </LHead>
              </div>
            </>
          }
          body={
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              <div style={{ flex: 1, opacity: ramp(f, 34, 76) }}>
                <LPlate a={16} h={430} reveal={ramp(f, 34, 280)} focus={[0.5, 0.5]} zoom={1.9} />
              </div>
              <div style={{ width: '42%', opacity: ramp(f, 230, 274) }}>
                <LPlate a={9} h={380} radius={16} />
              </div>
            </div>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s15 — CueMix Pro: routing and patchbay                             */
/* ================================================================== */
const S15: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s15">
      <LongStage>
        <SplitScene
          ratio={0.34}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>CueMix Pro</LKicker>
              <div style={{ marginTop: 20 }}>
                <LHead size={70} enter={ramp(f, 12, 42)}>
                  Point to
                  <br />
                  point.
                </LHead>
              </div>
              <div style={{ marginTop: 28 }}>
                <LSub size={27} enter={ramp(f, 40, 80)}>
                  One microphone can feed the recording, the drummer's headphones and a
                  network stream at once — with independent level on each.
                </LSub>
              </div>
            </>
          }
          right={
            <>
              <div style={{ position: 'relative', opacity: ramp(f, 26, 68) }}>
                <LPlate a={12} h={450} radius={16} />
                <LUiHighlight x={0.05} y={0.12} w={0.34} h={0.74} enter={ramp(f, 80, 220)} label="SOURCES" />
                <LUiHighlight x={0.60} y={0.12} w={0.34} h={0.74} enter={ramp(f, 150, 300)} label="DESTINATIONS" />
              </div>
              <div style={{ opacity: ramp(f, 300, 344) }}>
                <LPlate a={20} h={370} radius={16} />
              </div>
            </>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s16 — CueMix Pro: EQ and dynamics                                  */
/* ================================================================== */
const S16: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s16">
      <LongStage>
        <SplitScene
          ratio={0.34}
          left={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Per-channel processing</LKicker>
              <div style={{ marginTop: 20 }}>
                <LHead size={64} enter={ramp(f, 12, 42)}>
                  EQ. Compressor.
                  <br />
                  Gate. <span style={{ color: C.accent }}>Every channel.</span>
                </LHead>
              </div>
              <div style={{ marginTop: 28 }}>
                <LSub size={27} enter={ramp(f, 40, 80)}>
                  Shape a cue mix so the drummer hears more of themselves — without
                  touching what is being recorded.
                </LSub>
              </div>
              <div style={{ marginTop: 32, display: 'flex' }}>
                <LSpec label="Processing" value="32-bit float" enter={ramp(f, 330, 370)} />
              </div>
            </>
          }
          right={
            <div style={{ position: 'relative' }}>
              <LPlate a={4} h={700} reveal={ramp(f, 22, 250)} focus={[0.5, 0.32]} zoom={1.8} />
              <LUiHighlight x={0.26} y={0.10} w={0.66} h={0.36} enter={ramp(f, 250, 400)} label="4-BAND PARAMETRIC" />
            </div>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s17 — Wireless control                                             */
/* ================================================================== */
const S17: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s17">
      <LongStage>
        <BannerScene
          head={
            <>
              <LKicker enter={ramp(f, 6, 24)}>Wireless control</LKicker>
              <div style={{ marginTop: 16 }}>
                <LHead size={70} enter={ramp(f, 12, 42)}>
                  Set the mix <span style={{ color: C.accent }}>standing next to them.</span>
                </LHead>
              </div>
            </>
          }
          body={
            <div style={{ opacity: ramp(f, 34, 78) }}>
              <LPlateRow items={[21, 31]} h={520} gap={22} enter={ramp(f, 34, 200)} />
            </div>
          }
        />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */
/* s18 — Continuation + branding                                      */
/* ================================================================== */
const S18: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wrap id="s18">
      <LongStage>
        <AbsoluteFill style={{ padding: '76px 104px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ opacity: ramp(f, 20, 60) }}>
            <LHead size={82}>One engine.</LHead>
            <div style={{ marginTop: 10 }}>
              <LHead size={82} color={C.accent}>The signal moves on.</LHead>
            </div>
          </div>
          <div style={{ marginTop: 30, opacity: ramp(f, 90, 130) }}>
            <LSub size={32}>Part 2 — The Patchbay · MOTU 16A</LSub>
          </div>

          <div
            style={{
              marginTop: 56, borderTop: `1px solid ${C.rule}`, paddingTop: 34,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              opacity: ramp(f, 150, 200),
            }}
          >
            <div>
              <div style={{ fontFamily: F.head, fontSize: 46, fontWeight: 800, color: C.ink }}>
                Shivansh Electronics
              </div>
              <div style={{ fontFamily: F.body, fontSize: 26, fontWeight: 700, color: C.accent, marginTop: 8 }}>
                MOTU's Authorized Distributor for East and North East India
              </div>
              <div style={{ fontFamily: F.mono, fontSize: 24, color: C.inkSoft, marginTop: 18 }}>
                +91 98316 62458 · +91 91477 00677 · +91 89818 07755
              </div>
              <div style={{ fontFamily: F.body, fontSize: 28, fontWeight: 700, color: C.ink, marginTop: 10 }}>
                shivanshelectronics.in
              </div>
            </div>
          </div>
        </AbsoluteFill>
        <MotuMark frame={f} in_={180} hold={280} x={1520} y={210} h={62} />
      </LongStage>
    </Wrap>
  );
};

/* ================================================================== */

const SCENES: Record<string, React.FC> = {
  s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6,
  s7: S7, s8: S8, s9: S9, s10: S10, s11: S11, s12: S12,
  s13: S13, s14: S14, s15: S15, s16: S16, s17: S17, s18: S18,
};

/**
 * Recurring Shivansh lower-thirds. Spread across the runtime so the brand is a
 * genuinely constant presence (prompt s5), each carrying a different contact
 * detail from the rotation (prompt s8).
 */
const LOWER_THIRDS = [700, 2100, 3600, 5000, 6400, 7700];

export const LongPart1: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Audio src={staticFile('audio/bed_long1.wav')} volume={0.9} />

      {SEGMENTS.map((s) => {
        const Cmp = SCENES[s.id];
        return (
          <Sequence key={s.id} from={s.start} durationInFrames={s.end - s.start} name={`${s.id} · ${s.label}`}>
            <Cmp />
          </Sequence>
        );
      })}

      {/* branding layer sits above the scenes, on the absolute timeline */}
      <PersistentBrand frame={f} />
      {LOWER_THIRDS.map((fr, i) => (
        <BrandLowerThird key={fr} frame={f} in_={fr} hold={165} index={i} />
      ))}
      <ProgressRule frame={f} total={LONG_FRAMES} />
    </AbsoluteFill>
  );
};
