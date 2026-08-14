import React from 'react';
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
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

/** local eased ramp inside a Sequence */
const ramp = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

/** fade the whole scene in/out so cuts breathe instead of snapping */
const SceneWrap: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, 0, 12), 1 - ramp(f, dur - 10, dur));
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/* ================================================================== */
/* s1 — Hook                                                          */
/* ================================================================== */
const S1: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s1').end - seg('s1').start;
  const drift = useDrift(6, 300);

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe style={{ justifyContent: 'flex-start' }}>
          <Kicker enter={ramp(f, 6, 24)}>MOTU AVB Series</Kicker>

          <div style={{ marginTop: 26 }}>
            <Headline size={104} enter={ramp(f, 14, 40)}>
              One engine.
            </Headline>
            <Headline size={104} enter={ramp(f, 30, 58)} color={C.accent}>
              Three doors.
            </Headline>
          </div>

          <Subhead size={34} enter={ramp(f, 52, 82)}>
            Identical conversion. Identical price.
            <br />
            Only the front panel changes.
          </Subhead>

          <div
            style={{
              marginTop: 44,
              transform: `translateY(${drift}px)`,
              opacity: ramp(f, 60, 96),
            }}
          >
            <Plate
              a={5}
              height={585}
              reveal={ramp(f, 60, 240)}
              focus={[0.22, 0.55]}
              zoom={2.1}
            />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 12, opacity: ramp(f, 150, 190) }}>
            <SpecChip label="Part 1 of 3" value="The Tracking Room" />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s2 — The shared engine                                             */
/* ================================================================== */
const S2: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s2').end - seg('s2').start;

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 20)}>Shared architecture</Kicker>
          <Headline size={70} enter={ramp(f, 10, 34)} >
            The same engine
            <br />
            in every unit.
          </Headline>

          {/* ESS + Thunderbolt marks, then the cable, then the latency proof */}
          <div style={{ marginTop: 34, opacity: ramp(f, 34, 58) }}>
            <PlateRow items={[33, 35]} height={190} gap={14} enter={ramp(f, 34, 90)} />
          </div>

          <div style={{ marginTop: 14, opacity: ramp(f, 96, 124) }}>
            <PlateRow items={[19, 17]} height={300} gap={14} enter={ramp(f, 96, 160)} />
          </div>

          <div style={{ marginTop: 14, opacity: ramp(f, 168, 196) }}>
            <Plate a={6} height={250} radius={16} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <SpecChip label="Dynamic range" value="125 dB" enter={ramp(f, 200, 226)} />
            <SpecChip label="Thunderbolt 4 / USB4" value="40 Gbps" enter={ramp(f, 216, 242)} />
            <SpecChip label="Round-trip latency" value="1.8 ms" enter={ramp(f, 232, 258)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s3 — Enter the 10pre (macro-to-scale reveal)                       */
/* ================================================================== */
const S3: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s3').end - seg('s3').start;
  // macro push across the combo inputs, then a precise pull-out to the whole 1U
  const reveal = ramp(f, 10, 140);

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 22)}>MOTU 10pre</Kicker>
          <Headline size={84} enter={ramp(f, 10, 36)}>
            The tracking
            <br />
            room.
          </Headline>

          <div style={{ marginTop: 40 }}>
            <Plate a={26} height={560} reveal={reveal} focus={[0.13, 0.52]} zoom={3.2} />
          </div>

          <div style={{ marginTop: 16, opacity: ramp(f, 150, 186) }}>
            <Plate a={10} height={370} radius={16} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={30} enter={ramp(f, 178, 210)}>
            54 channels · 1U · built for a room with a band in it.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s4 — Ten microphone preamps                                        */
/* ================================================================== */
const S4: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s4').end - seg('s4').start;
  const count = Math.round(interpolate(f, [24, 96], [0, 10], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }));

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 20)}>Source capture</Kicker>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <div
              style={{
                fontFamily: F.head,
                fontSize: 190,
                fontWeight: 900,
                lineHeight: 0.85,
                color: C.accent,
                letterSpacing: '-0.04em',
                opacity: ramp(f, 10, 30),
              }}
            >
              {count}
            </div>
            <Headline size={62} enter={ramp(f, 22, 48)}>
              microphone
              <br />
              preamps.
            </Headline>
          </div>

          {/* macro across the gain-labelled combo locking tabs, then pull out */}
          <div style={{ marginTop: 30 }}>
            <Plate a={18} height={480} reveal={ramp(f, 40, 190)} focus={[0.30, 0.5]} zoom={2.9} />
          </div>

          {/* CueMix showing all ten inputs live */}
          <div style={{ marginTop: 16, position: 'relative', opacity: ramp(f, 196, 226) }}>
            <Plate a={8} height={410} radius={16} />
            <UiHighlight
              x={0.16}
              y={0.14}
              w={0.68}
              h={0.60}
              enter={ramp(f, 214, 300)}
              label="MIC INPUTS 1–10"
            />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <SpecChip label="Gain per channel" value="74 dB" enter={ramp(f, 250, 276)} />
            <SpecChip label="EIN" value="−129 dBu" enter={ramp(f, 264, 290)} />
          </div>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s5 — Eight rear, two front                                         */
/* ================================================================== */
const S5: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s5').end - seg('s5').start;

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 20)}>Ergonomic split</Kicker>
          <Headline size={72} enter={ramp(f, 10, 34)}>
            Eight rear.
            <br />
            <span style={{ color: C.accent }}>Two front.</span>
          </Headline>

          <div style={{ marginTop: 34, opacity: ramp(f, 34, 62) }}>
            <Plate a={13} height={385} radius={16} />
          </div>

          <div style={{ marginTop: 16, opacity: ramp(f, 96, 128) }}>
            <Plate a={15} height={480} reveal={ramp(f, 96, 220)} focus={[0.5, 0.5]} zoom={1.7} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={29} enter={ramp(f, 180, 212)}>
            The snake stays wired. The overdub never goes behind the rack.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s6 — Hardware inserts on channels 1-2                              */
/* ================================================================== */
const S6: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s6').end - seg('s6').start;

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 20)}>Channels 1–2</Kicker>
          <Headline size={70} enter={ramp(f, 10, 34)}>
            Hardware
            <br />
            inserts.
          </Headline>

          <div style={{ marginTop: 34, position: 'relative' }}>
            <Plate a={14} height={565} reveal={ramp(f, 16, 150)} focus={[0.72, 0.45]} zoom={2.4} />
            <UiHighlight x={0.60} y={0.20} w={0.34} h={0.62} enter={ramp(f, 120, 200)} label="SEND / RETURN" />
          </div>

          <div style={{ marginTop: 16, opacity: ramp(f, 140, 172) }}>
            <Plate a={2} height={320} radius={16} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={29} enter={ramp(f, 160, 192)}>
            Your compressor, in the path — before the converter.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s7 — Dual headphone outputs                                        */
/* ================================================================== */
const S7: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s7').end - seg('s7').start;

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 20)}>Two cue mixes</Kicker>
          <Headline size={70} enter={ramp(f, 10, 34)}>
            Independent
            <br />
            headphone outs.
          </Headline>

          <div style={{ marginTop: 32 }}>
            <Plate a={36} height={545} reveal={ramp(f, 14, 130)} focus={[0.5, 0.55]} zoom={2.2} />
          </div>

          <div style={{ marginTop: 16, opacity: ramp(f, 108, 138) }}>
            <PlateRow items={[22, 25]} height={330} gap={14} enter={ramp(f, 108, 168)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={29} enter={ramp(f, 150, 182)}>
            The drummer hears theirs. You hear yours. Zero latency, both.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s8 — One-decibel gain calibration                                  */
/* ================================================================== */
const S8: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s8').end - seg('s8').start;

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 20)}>Repeatable gain staging</Kicker>
          <Headline size={70} enter={ramp(f, 10, 34)}>
            Steps of
            <br />
            <span style={{ color: C.accent }}>exactly 1 dB.</span>
          </Headline>

          <div style={{ marginTop: 32, position: 'relative', opacity: ramp(f, 26, 54) }}>
            <Plate a={7} height={470} radius={16} />
            <UiHighlight x={0.06} y={0.30} w={0.26} h={0.40} enter={ramp(f, 48, 130)} label="GAIN" />
          </div>

          <div style={{ marginTop: 16, opacity: ramp(f, 112, 142) }}>
            <PlateRow items={[4, 3]} height={355} gap={14} enter={ramp(f, 112, 172)} />
          </div>

          <div style={{ flex: 1 }} />
          <Subhead size={29} enter={ramp(f, 150, 182)}>
            Match your overheads once. Recall them exactly.
          </Subhead>
        </Safe>
      </LightStage>
    </SceneWrap>
  );
};

/* ================================================================== */
/* s9 — CueMix Pro (grouped montage)                                  */
/* ================================================================== */
const S9: React.FC = () => {
  const f = useCurrentFrame();
  const d = seg('s9').end - seg('s9').start;

  return (
    <SceneWrap dur={d}>
      <LightStage>
        <Safe>
          <Kicker enter={ramp(f, 4, 20)}>On-board DSP</Kicker>
          <Headline size={70} enter={ramp(f, 10, 34)}>
            CueMix Pro.
          </Headline>
          <Subhead size={30} enter={ramp(f, 26, 52)}>
            64 channels of mixing, on the hardware.
          </Subhead>

          {/* routing + patchbay */}
          <div style={{ marginTop: 26, position: 'relative', opacity: ramp(f, 34, 60) }}>
            <Plate a={1} height={300} radius={16} />
            <UiHighlight x={0.10} y={0.16} w={0.55} h={0.56} enter={ramp(f, 56, 130)} label="ROUTING MATRIX" />
          </div>

          <div style={{ marginTop: 14, opacity: ramp(f, 118, 146) }}>
            <PlateRow items={[12, 9]} height={230} gap={12} enter={ramp(f, 118, 178)} />
          </div>

          <div style={{ marginTop: 14, opacity: ramp(f, 176, 204) }}>
            <PlateRow items={[11, 20]} height={210} gap={12} enter={ramp(f, 176, 234)} />
          </div>

          <div style={{ marginTop: 14, opacity: ramp(f, 232, 260) }}>
            <PlateRow items={[21, 31]} height={210} gap={12} enter={ramp(f, 232, 290)} />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', gap: 10 }}>
            <SpecChip label="DSP mixer" value="64 ch" enter={ramp(f, 268, 294)} />
            <SpecChip label="Aux buses" value="26" enter={ramp(f, 280, 306)} />
          </div>
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
          <div style={{ opacity: ramp(f, 4, 30) }}>
            <PlateRow items={[16, 24]} height={210} gap={12} enter={ramp(f, 4, 60)} />
          </div>

          <div style={{ marginTop: 14, opacity: ramp(f, 46, 74) }}>
            <PlateRow items={[0, 23]} height={250} gap={12} enter={ramp(f, 46, 104)} />
          </div>

          <div style={{ marginTop: 40 }}>
            <Headline size={62} enter={ramp(f, 86, 116)}>
              One engine.
            </Headline>
            <Headline size={62} enter={ramp(f, 100, 130)} color={C.accent}>
              The signal moves on.
            </Headline>
            <Subhead size={27} enter={ramp(f, 118, 146)}>
              Part 2 — The Patchbay · MOTU 16A
            </Subhead>
          </div>

          <div style={{ flex: 1 }} />
          <div
            style={{
              borderTop: `1px solid ${C.rule}`,
              paddingTop: 26,
            }}
          >
            <ContactBlock enter={ramp(f, 150, 190)} compact />
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

export const Part1: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    {/* Original score + sound design (audio/score_part1.py). The bed is mixed
        low so a voiceover track can be laid over it without re-balancing. */}
    <Audio src={staticFile('audio/bed_part1.wav')} volume={0.9} />
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
