import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, F } from '../theme';
import {
  BannerScene, LHead, LKicker, LPlate, LPlateRow, LSpec, LSub, LUiHighlight,
  LongStage, SplitScene, ramp,
} from './layout';

/**
 * Declarative scene spec for the long-form parts.
 *
 * Part 1 was written as eighteen bespoke components, which was useful for
 * finding the right landscape vocabulary but is a lot of near-duplicate JSX.
 * Parts 2 and 3 reuse that vocabulary through this spec instead: the same
 * layouts, driven by data, so a scene is a few lines rather than fifty and the
 * enter timings stay consistent by construction.
 */

export type PlateSpec = {
  a: number;
  h: number;
  /** run the macro-to-scale reveal over these local frames */
  reveal?: [number, number];
  focus?: [number, number];
  zoom?: number;
  /** animated CueMix highlight: [x, y, w, h, fromFrame, toFrame, label] */
  hi?: [number, number, number, number, number, number, string?];
  /** fade the plate in over these local frames */
  enter?: [number, number];
};

export type LongScene = {
  id: string;
  kicker: string;
  /** headline lines; a line prefixed with '~' renders in the accent colour */
  head: string[];
  headSize?: number;
  sub?: string;
  /** big numeric hook counted up, e.g. 16 */
  count?: { to: number; label: string[]; from?: number; to_?: number };
  specs?: [string, string][];
  specsAt?: number;
  /** left/right split (default) or full-width banner */
  layout?: 'split' | 'banner';
  ratio?: number;
  plates: PlateSpec[];
  /** render these as one grouped row instead of stacked plates */
  row?: { items: number[]; h: number; at: number };
  foot?: string;
  footAt?: number;
};

const Line: React.FC<{ s: string }> = ({ s }) =>
  s.startsWith('~') ? <span style={{ color: C.accent }}>{s.slice(1)}</span> : <>{s}</>;

const Heading: React.FC<{ scene: LongScene; f: number }> = ({ scene, f }) => (
  <>
    <LKicker enter={ramp(f, 6, 24)}>{scene.kicker}</LKicker>
    <div style={{ marginTop: 18 }}>
      <LHead size={scene.headSize ?? 70} enter={ramp(f, 12, 42)}>
        {scene.head.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <br /> : null}
            <Line s={l} />
          </React.Fragment>
        ))}
      </LHead>
    </div>
    {scene.sub ? (
      <div style={{ marginTop: 24 }}>
        <LSub size={28} enter={ramp(f, 40, 80)}>
          {scene.sub}
        </LSub>
      </div>
    ) : null}
  </>
);

const Plates: React.FC<{ scene: LongScene; f: number }> = ({ scene, f }) => (
  <>
    {scene.row ? (
      <div style={{ opacity: ramp(f, scene.row.at, scene.row.at + 40) }}>
        <LPlateRow
          items={scene.row.items}
          h={scene.row.h}
          gap={20}
          enter={ramp(f, scene.row.at, scene.row.at + 160)}
        />
      </div>
    ) : null}
    {scene.plates.map((p, i) => {
      const [ea, eb] = p.enter ?? [20 + i * 90, 60 + i * 90];
      return (
        <div key={`${p.a}-${i}`} style={{ position: 'relative', opacity: ramp(f, ea, eb) }}>
          <LPlate
            a={p.a}
            h={p.h}
            radius={16}
            reveal={p.reveal ? ramp(f, p.reveal[0], p.reveal[1]) : 1}
            focus={p.focus}
            zoom={p.zoom}
          />
          {p.hi ? (
            <LUiHighlight
              x={p.hi[0]}
              y={p.hi[1]}
              w={p.hi[2]}
              h={p.hi[3]}
              enter={ramp(f, p.hi[4], p.hi[5])}
              label={p.hi[6]}
            />
          ) : null}
        </div>
      );
    })}
  </>
);

const CountHook: React.FC<{ scene: LongScene; f: number }> = ({ scene, f }) => {
  if (!scene.count) return null;
  const { to, label, from = 20, to_ = 100 } = scene.count;
  const n = Math.round(
    Math.min(to, Math.max(0, ((f - from) / (to_ - from)) * to)),
  );
  return (
    <>
      <div
        style={{
          fontFamily: F.head, fontSize: 210, fontWeight: 900, lineHeight: 0.82,
          color: C.accent, letterSpacing: '-0.05em', marginTop: 8,
          opacity: ramp(f, 12, 34),
        }}
      >
        {n}
      </div>
      <LHead size={54} enter={ramp(f, 30, 62)}>
        {label.map((l, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <br /> : null}
            {l}
          </React.Fragment>
        ))}
      </LHead>
    </>
  );
};

const Specs: React.FC<{ scene: LongScene; f: number; column?: boolean }> = ({
  scene, f, column,
}) => {
  if (!scene.specs) return null;
  const at = scene.specsAt ?? 260;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        gap: column ? 12 : 16,
        marginTop: column ? 30 : 18,
        flexWrap: 'wrap',
        alignItems: column ? 'flex-start' : 'center',
      }}
    >
      {scene.specs.map(([l, v], i) => (
        <LSpec key={l} label={l} value={v} enter={ramp(f, at + i * 18, at + 40 + i * 18)} />
      ))}
    </div>
  );
};

export const renderScene = (scene: LongScene, dur: number): React.FC => {
  const Cmp: React.FC = () => {
    const f = useCurrentFrame();
    const o = Math.min(ramp(f, 0, 14), 1 - ramp(f, dur - 12, dur));
    const body = (
      <LongStage>
        {scene.layout === 'banner' ? (
          <BannerScene
            head={<Heading scene={scene} f={f} />}
            body={<Plates scene={scene} f={f} />}
            foot={
              <>
                {scene.foot ? (
                  <div style={{ marginTop: 14 }}>
                    <LSub size={28} enter={ramp(f, scene.footAt ?? 300, (scene.footAt ?? 300) + 46)}>
                      {scene.foot}
                    </LSub>
                  </div>
                ) : null}
                <Specs scene={scene} f={f} />
              </>
            }
          />
        ) : (
          <SplitScene
            ratio={scene.ratio ?? 0.36}
            left={
              <>
                {scene.count ? (
                  <>
                    <LKicker enter={ramp(f, 6, 24)}>{scene.kicker}</LKicker>
                    <CountHook scene={scene} f={f} />
                    {scene.sub ? (
                      <div style={{ marginTop: 22 }}>
                        <LSub size={27} enter={ramp(f, 46, 88)}>
                          {scene.sub}
                        </LSub>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <Heading scene={scene} f={f} />
                )}
                <Specs scene={scene} f={f} column />
              </>
            }
            right={<Plates scene={scene} f={f} />}
          />
        )}
      </LongStage>
    );
    return <AbsoluteFill style={{ opacity: o }}>{body}</AbsoluteFill>;
  };
  return Cmp;
};
