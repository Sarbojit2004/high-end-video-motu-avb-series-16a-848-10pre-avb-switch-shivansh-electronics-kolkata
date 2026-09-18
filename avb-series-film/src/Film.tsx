import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, FONT, GROUND, TYPE_OPACITY, sec, safeW, type Canvas, type ProductKey } from "./theme.ts";
import type { TimedSegment } from "./script.ts";
import { buildShots, type Pin, type Shot } from "./shots.ts";
import { Caption } from "./components/Caption.tsx";
import { BleedShot, MosaicBleed, PanelBleed, SplitBleed, StillShot, VideoShot } from "./components/Staged.tsx";
import { TRANS, TRANS_CUE, TransitionIn, transitionFor, type TransitionKind } from "./components/Transitions.tsx";
import {
  ChapterTitle, IoLadder, LadderCompare, LatencyTrace, NetworkGraph, ProductTag, ProgressRule, ScaleMeter, SpecChips,
} from "./components/Demonstratives.tsx";
import { Outro } from "./components/Outro.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// THE FILM — one composition, two canvases.
//
// Three data structures drive everything and there is not one hand-typed frame
// number below:
//
//   script.ts  what is said, and when  — spoken word count sets every duration
//   shots.ts   what is shown, and when — pinned to the captions
//   this file  how it is staged, transitioned, annotated and mixed
//
// THE LAYER STACK, bottom to top:
//   1. picture   full-bleed stills, B-roll and photography under camera moves,
//                overlapping sequences so every shot change is a transition
//   2. scrim     a gradient where the dense text sits
//   3. overlay   everything typographic, held at TYPE_OPACITY (0.64) — one
//                multiplier, applied once, so nothing can drift
//   4. outro     the end screen, the only place any brand mark appears
// ─────────────────────────────────────────────────────────────────────────────

export type FilmProps = {
  canvas: Canvas;
  segments: TimedSegment[];
  pins: Pin[];
  /** When the end screen takes the frame. */
  outroAt: number;
  bed: string;
  vo: string;
  title: string;
};

type Placed = Shot & { trans: TransitionKind };

const place = (shots: Shot[]): Placed[] =>
  shots.map((s, i) => {
    const firstOfSeg = i === 0 || shots[i - 1].segment !== s.segment;
    return { ...s, trans: transitionFor(s.seed, firstOfSeg, i === 0) };
  });

const Stage: React.FC<{ shot: Placed; f: number; dur: number; canvas: Canvas }> = ({ shot, f, dur, canvas }) => {
  const p = dur > 0 ? Math.min(1, Math.max(0, f / dur)) : 0;
  const common = { canvas, env: shot.env, product: shot.product, p, f, seed: shot.seed };
  const r = shot.res;
  switch (r.kind) {
    case "still":
      return <StillShot file={r.still.file} bgFile={r.still.bg} ar={r.still.ar} {...common} />;
    case "video":
      return <VideoShot file={r.clip.file} ar={r.clip.ar} {...common} />;
    case "panel":
      return <PanelBleed asset={r.asset} {...common} />;
    case "split":
      return <SplitBleed asset={r.assets[0]} second={r.assets[1]} {...common} />;
    case "mosaic":
      return <MosaicBleed assets={r.assets} labels={r.labels} {...common} />;
    default:
      return <BleedShot asset={r.asset} {...common} />;
  }
};

const ShotLayer: React.FC<{ shot: Placed; canvas: Canvas }> = ({ shot, canvas }) => {
  const f = useCurrentFrame();
  const dur = Math.max(1, sec(shot.end) - sec(shot.start));
  return (
    <TransitionIn kind={shot.trans} f={f} accent={ACCENT[shot.product].glow} canvas={canvas}>
      <Stage shot={shot} f={f} dur={dur} canvas={canvas} />
    </TransitionIn>
  );
};

/** Extra product text the voice has no time to say — never a restatement of the narration. */
const CHIPS: Record<string, string[]> = {
  hook: [],
  platform: ["THUNDERBOLT 4 · USB4 · 40 Gbps", "44.1 – 192 kHz", "MILAN CERTIFIED AVB", "64-CH MIXER · 26 AUX", "WORD CLOCK IN / OUT"],
  s16a: ["16 × TRS LINE IN", "16 × DC-COUPLED TRS OUT", "2 × ADAT OPTICAL BANKS", "DUAL 3.9 in TFT DISPLAYS", "32 IN / 34 OUT"],
  s848: ["4 × COMBO PREAMPS · +74 dB", "INSERTS ON 3 – 4", "12 × TRS LINE OUT · 7.1.4", "A / B / C MONITOR · TALKBACK", "28 IN / 32 OUT"],
  s10pre: ["10 × COMBO PREAMPS", "8 REAR + 2 FRONT", "48 V · −20 dB PAD PER CH", "8 × TRS LINE OUT · 2 × PHONES", "26 IN / 28 OUT"],
  sswitch: ["5 AVB + 1 GIGABIT PORTS", "CAT-5e / CAT-6 · 100 m", "IEEE 802.1AS gPTP CLOCK", "UP TO 8 UNITS CHAINED", "128 CH PER UNIT"],
  software: ["CueMix Pro · macOS · WINDOWS · iOS", "4-BAND EQ · COMP · GATE · REVERB", "WI-FI CONTROL · MANY DEVICES", "STANDALONE · NO COMPUTER"],
  close: [],
};

export const Film: React.FC<FilmProps> = ({ canvas, segments, pins, outroAt, bed, vo }) => {
  const S = canvas.scale;
  const shots = React.useMemo(() => place(buildShots(segments, pins, canvas, outroAt)), [segments, pins, canvas, outroAt]);
  const outroFrom = sec(outroAt);
  const sw = safeW(canvas);

  // Contiguous windows per segment, so the overlay never has a gap to fall through.
  const windows = segments.map((s, i) => ({
    seg: s,
    start: s.start,
    end: segments[i + 1] ? segments[i + 1].start : outroAt,
  }));

  const capStart = (segId: string, frag: string) =>
    segments.find((s) => s.id === segId)?.captions.find((c) => c.t.includes(frag))?.start ?? -1;
  const T_DR = capStart("platform", "125 dB") - 0.15;
  const T_RTL = capStart("platform", "2 ms") - 0.15;

  // ── SFX plan, derived rather than typed ──────────────────────────────────
  type Cue = { at: number; cue: string };
  const sfx: Cue[] = [];
  for (const s of shots) sfx.push({ at: Math.max(0, s.start - 0.06), cue: TRANS_CUE[s.trans] });
  for (const seg of segments) {
    sfx.push({ at: Math.max(0, seg.speakAt - 0.45), cue: "riser-short" });
    for (const c of seg.captions) if (c.beat) sfx.push({ at: c.start + 0.04, cue: "tick-glass" });
    if (seg.product === "p16a" || seg.product === "p848" || seg.product === "p10pre") {
      const n = { p16a: 16, p848: 12, p10pre: 10 }[seg.product];
      for (let i = 0; i < n; i += 2) sfx.push({ at: seg.speakAt + (10 + i * 2) / canvas.fps, cue: "count-blip" });
    }
    if (seg.product === "pswitch") for (let i = 0; i < 4; i++) sfx.push({ at: seg.speakAt + (12 + i * 9) / canvas.fps, cue: "net-lock" });
  }
  const close = segments.find((s) => s.id === "close");
  if (close) for (let i = 0; i < 3; i++) sfx.push({ at: close.speakAt + (8 + i * 10) / canvas.fps, cue: "count-blip" });
  sfx.push({ at: outroAt - 0.2, cue: "outro-bloom" });
  sfx.sort((a, b) => a.at - b.at);

  const TopBlock: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps;
    const w = windows.find((x) => t >= x.start && t < x.end);
    if (!w) return null;
    const seg = w.seg;
    const hold = seg.hold ?? 0;
    const inHold = hold > 0 && t < seg.speakAt;
    const f = frame - sec(seg.speakAt);
    const durF = Math.max(1, sec(w.end) - sec(seg.speakAt));
    const fade = Math.min(
      interpolate(f, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(f, [durF - 8, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    );
    const intro = interpolate(f, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const width = canvas.portrait ? sw : sw * 0.56;

    if (inHold) {
      const hf = frame - sec(seg.start);
      return (
        <div style={{ position: "absolute", left: canvas.safe.left, top: canvas.portrait ? canvas.height * 0.36 : canvas.height * 0.4, width: sw }}>
          <ChapterTitle product={seg.product} title={seg.label} sub={seg.chapter ?? ""} f={hf} s={canvas.portrait ? 1 : 0.9} />
        </div>
      );
    }

    let demo: React.ReactNode = null;
    if (seg.id === "platform") {
      if (t >= T_RTL && T_RTL > 0) demo = <LatencyTrace product="shared" f={frame - sec(T_RTL)} width={width} s={S} />;
      else if (t >= T_DR && T_DR > 0) demo = <ScaleMeter title="DYNAMIC RANGE" value={125} min={0} max={140} unit="dB" product="shared" f={frame - sec(T_DR)} width={width} s={S} />;
    } else if (seg.product === "p16a" || seg.product === "p848" || seg.product === "p10pre") {
      demo = <IoLadder product={seg.product} f={f} width={width} s={S} />;
    } else if (seg.product === "pswitch") {
      demo = <NetworkGraph f={f} width={width} s={S} />;
    } else if (seg.id === "close") {
      demo = <LadderCompare f={f} width={width} s={S} />;
    }
    const chips = CHIPS[seg.id] ?? [];
    return (
      <div style={{ position: "absolute", left: canvas.safe.left, top: canvas.safe.top + 36 * S, width, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 30 * S, opacity: fade }}>
        {seg.product !== "shared" ? <ProductTag product={seg.product} intro={intro} s={S} /> : null}
        {demo}
        {chips.length ? <SpecChips items={chips} product={seg.product} f={f} width={width} s={S} /> : null}
      </div>
    );
  };

  const Progress: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps;
    const w = windows.find((x) => t >= x.start && t < x.end);
    return (
      <div style={{ position: "absolute", left: canvas.safe.left, top: canvas.safe.top, width: sw }}>
        <ProgressRule p={t / outroAt} product={(w?.seg.product ?? "shared") as ProductKey} />
      </div>
    );
  };

  const OutroLayer: React.FC = () => {
    const f = useCurrentFrame();
    return (
      <AbsoluteFill style={{ opacity: interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" }) }}>
        <Outro canvas={canvas} />
      </AbsoluteFill>
    );
  };

  return (
    <AbsoluteFill style={{ background: GROUND.dark, fontFamily: FONT.display }}>
      {/* ── 1. picture ─────────────────────────────────────────────────── */}
      {shots.map((s, i) => {
        const from = sec(s.start);
        const tail = shots[i + 1] ? TRANS[shots[i + 1].trans] : 0;
        const dur = Math.max(1, sec(s.end) - from + tail);
        return (
          <Sequence key={s.seed} from={from} durationInFrames={dur}>
            <ShotLayer shot={s} canvas={canvas} />
          </Sequence>
        );
      })}

      {/* ── 2. scrim — where the dense text lives ───────────────────────── */}
      <Sequence from={0} durationInFrames={outroFrom}>
        {canvas.portrait ? (
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,4,6,0.66) 0%, rgba(4,4,6,0.48) 26%, rgba(4,4,6,0.18) 62%, rgba(4,4,6,0) 100%)", height: canvas.height * 0.36 }} />
        ) : (
          <>
            <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(4,4,6,0.62) 0%, rgba(4,4,6,0.34) 34%, rgba(4,4,6,0.06) 60%, rgba(4,4,6,0) 100%)" }} />
            <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(4,4,6,0.5) 0%, rgba(4,4,6,0) 32%)" }} />
          </>
        )}
      </Sequence>

      {/* ── 3. overlay — the whole typographic layer, at 64% ───────────── */}
      <Sequence from={0} durationInFrames={outroFrom}>
        <AbsoluteFill style={{ opacity: TYPE_OPACITY }}>
          <Progress />
          <TopBlock />
          {segments.map((seg) =>
            seg.captions.map((c, i) => (
              <Sequence key={`${seg.id}-${i}`} from={sec(c.start)} durationInFrames={Math.max(1, sec(c.end) - sec(c.start))}>
                <div style={{ position: "absolute", left: canvas.safe.left, width: canvas.portrait ? sw : sw * 0.72, bottom: canvas.safe.bottom }}>
                  <Caption caption={c} startFrame={0} product={seg.product} env="dark" scale={S} />
                </div>
              </Sequence>
            )),
          )}
        </AbsoluteFill>
      </Sequence>

      {/* ── 4. the end screen ──────────────────────────────────────────── */}
      <Sequence from={outroFrom} durationInFrames={canvas.durationInFrames - outroFrom}>
        <OutroLayer />
      </Sequence>

      {/* ── audio — every source mastered to its final loudness, so unity here ── */}
      <Audio src={staticFile(`audio/${vo}`)} volume={1} />
      <Audio src={staticFile(`audio/${bed}`)} volume={1} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={sec(s.at)} durationInFrames={90}>
          <Audio src={staticFile(`audio/sfx/${s.cue}.wav`)} volume={1} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
