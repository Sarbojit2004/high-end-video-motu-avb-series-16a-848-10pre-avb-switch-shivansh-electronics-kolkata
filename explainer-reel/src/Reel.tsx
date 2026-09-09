import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ACCENT, FONT, GROUND, INK, SAFE, VIDEO, sec } from "./theme.ts";
import { buildTimeline } from "./script.ts";
import { buildShots, type Shot } from "./shots.ts";
import { Caption } from "./components/Caption.tsx";
import { Ground, GridField, Particles, TechMark } from "./components/Environment.tsx";
import { ProductRule, StandingMark } from "./components/Chrome.tsx";
import { ShotVisual, BAND } from "./components/Layouts.tsx";
import { ContactPlate } from "./components/ContactPlate.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// MOTU AVB ECOSYSTEM — 180 s narrated technical explainer, 2160 x 3840.
//
// Everything below is driven by two derived data structures and nothing else:
//   script.ts  → what is said, when          (narration governs the timing)
//   shots.ts   → what is shown, when         (derived from the caption groups)
//
// There are no hand-typed frame numbers in this file.
// ─────────────────────────────────────────────────────────────────────────────

const { segments } = buildTimeline();
const { shots } = buildShots();

/** The one-line differentiator carried under each product's name. */
const SPEC_LINE: Record<string, string> = {
  open: "16A · 848 · 10pre · AVB Switch",
  s16a: "0 preamps · 16 line in · 16 DC-coupled out",
  s848: "4 preamps · 8 line in · A/B/C · 2 cue mixes",
  s10pre: "10 preamps · 4 front + 6 rear",
  sswitch: "6 Gigabit ports · 512 streams · no analogue I/O",
  close: "one platform · four products",
};

/** Which technical accent sits in the corner of each segment. */
const MARK: Record<string, "ports" | "clock" | "flow" | "rate"> = {
  open: "flow",
  s16a: "rate",
  s848: "rate",
  s10pre: "rate",
  sswitch: "ports",
  close: "clock",
};

const ShotBlock: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  const from = sec(shot.start);
  const dur = Math.max(1, sec(shot.end) - from);
  const f = frame - from;
  const p = dur > 0 ? Math.min(1, Math.max(0, f / dur)) : 0;

  // Shots cross-fade rather than cut — narration runs continuously across a
  // shot boundary, so a hard cut would fight the voice.
  const fade = Math.min(
    interpolate(f, [0, 7], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(f, [dur - 7, dur], [1, 0], { extrapolateLeft: "clamp" }),
  );

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <ShotVisual
        kind={shot.kind}
        reprise={shot.reprise}
        assets={shot.assets}
        env={shot.env}
        product={shot.product}
        f={f}
        dur={dur}
        seed={shot.seed}
      />
    </AbsoluteFill>
  );
};

const SegmentBlock: React.FC<{ seg: (typeof segments)[number] }> = ({ seg }) => {
  const frame = useCurrentFrame();
  const from = sec(seg.start);
  const dur = sec(seg.end) - from;
  const f = frame - from;
  const progress = dur > 0 ? f / dur : 0;

  const product = seg.product ?? "shared";
  const accent = ACCENT[product];
  const intro = interpolate(f, [0, 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const segShots = shots.filter((s) => s.segment === seg.id);

  return (
    <AbsoluteFill>
      <Ground env={seg.env} product={product} lightY={0.36}>
        <GridField env={seg.env} product={product} extent={0.86} y={0.36} opacity={seg.env === "light" ? 1 : 0.7} />
        <Particles env={seg.env} product={product} seed={seg.id} count={seg.env === "dark" ? 30 : 22} cy={0.38} />
      </Ground>

      {/* visuals */}
      {segShots.map((s) => (
        <Sequence key={s.seed} from={sec(s.start) - from} durationInFrames={Math.max(1, sec(s.end) - sec(s.start))}>
          <ShotBlockRelative shot={s} />
        </Sequence>
      ))}

      {/* the persistent product identifier */}
      <ProductRule
        product={product}
        env={seg.env}
        name={seg.label}
        spec={SPEC_LINE[seg.id]}
        progress={progress}
        intro={intro}
      />

      {/* captions */}
      {seg.captions.map((c, i) => (
        <Sequence
          key={i}
          from={sec(c.start) - from}
          durationInFrames={Math.max(1, sec(c.end) - sec(c.start))}
        >
          <div
            style={{
              position: "absolute",
              left: SAFE.x,
              top: BAND.bottom + 110,
              width: SAFE.w,
              minHeight: 520,
            }}
          >
            <Caption caption={c} startFrame={0} product={product} env={seg.env} />
          </div>
        </Sequence>
      ))}

      <TechMark env={seg.env} product={product} kind={MARK[seg.id]} x={SAFE.x} y={VIDEO.height - 430} opacity={intro} />
      <StandingMark env={seg.env} opacity={intro} />
    </AbsoluteFill>
  );
};

/** Shot rendered inside a Sequence, so its own frame counter starts at 0. */
const ShotBlockRelative: React.FC<{ shot: Shot }> = ({ shot }) => {
  const f = useCurrentFrame();
  const dur = Math.max(1, sec(shot.end) - sec(shot.start));
  const fade = Math.min(
    interpolate(f, [0, 8], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(f, [dur - 8, dur], [1, 0], { extrapolateLeft: "clamp" }),
  );
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <ShotVisual
        kind={shot.kind}
        reprise={shot.reprise}
        assets={shot.assets}
        env={shot.env}
        product={shot.product}
        f={f}
        dur={dur}
        seed={shot.seed}
      />
    </AbsoluteFill>
  );
};

/**
 * SFX placement.
 *
 * Cues are hung off the derived timeline, not typed in: a segment boundary gets
 * a swell, the AVB Switch's clock-lock line gets the net-lock cue underneath the
 * word "nanosecond", and each caption that ends a thought gets a near-subliminal
 * mark. Everything is short and sits outside the voice band by construction
 * (see gen_audio.py).
 */
const SFX_PLAN: { at: number; cue: string; vol: number }[] = (() => {
  const out: { at: number; cue: string; vol: number }[] = [];
  for (const seg of segments) {
    // Boundary swell, a beat before the segment lands.
    out.push({ at: Math.max(0, seg.start - 0.5), cue: "seg-swell", vol: 0.8 });
    if (seg.env === "dark") out.push({ at: Math.max(0, seg.start - 0.2), cue: "sub-drop", vol: 0.6 });
    else out.push({ at: Math.max(0, seg.start - 0.2), cue: "whoosh-soft", vol: 0.6 });

    for (const c of seg.captions) {
      // A specification landing.
      if (/\d/.test(c.t) && c.e) out.push({ at: c.start + 0.12, cue: "spec-latch", vol: 0.55 });
      else if (c.beat) out.push({ at: c.start, cue: "caption-in", vol: 0.5 });
    }
  }
  // The one narrative cue: the clock actually locking, under the line about it.
  const sw = segments.find((s) => s.id === "sswitch");
  if (sw) {
    const lock = sw.captions.find((c) => c.t.includes("nanosecond"));
    if (lock) out.push({ at: lock.start - 0.25, cue: "net-lock", vol: 1.0 });
    const streams = sw.captions.find((c) => c.t.includes("512"));
    if (streams) out.push({ at: streams.start, cue: "data-sweep", vol: 0.75 });
    const ports = sw.captions.find((c) => c.t.includes("Gigabit"));
    if (ports) out.push({ at: ports.start, cue: "port-link", vol: 0.8 });
  }
  return out;
})();

export const Reel: React.FC = () => {
  const closeSeg = segments.find((s) => s.id === "close")!;
  // The contact plate takes over the frame for the last stretch of the close.
  const plateAt = sec(closeSeg.end - 11.5);

  return (
    <AbsoluteFill style={{ background: GROUND.dark, fontFamily: FONT.ui }}>
      {segments.map((seg) => (
        <Sequence
          key={seg.id}
          from={sec(seg.start)}
          durationInFrames={Math.max(1, sec(seg.end) - sec(seg.start) + 18)}
        >
          <SegmentBlock seg={seg} />
        </Sequence>
      ))}

      {/* ── the close: contact, logos, all three numbers ─────────────────── */}
      <Sequence from={plateAt} durationInFrames={VIDEO.durationInFrames - plateAt}>
        <AbsoluteFill>
          <Ground env="light" product="shared" lightY={0.42}>
            <GridField env="light" product="shared" extent={0.94} y={0.42} />
            <Particles env="light" product="shared" seed="close-plate" count={20} cy={0.4} />
          </Ground>
          <ContactPlate startFrame={0} env="light" />
        </AbsoluteFill>
      </Sequence>

      {/* ── audio ────────────────────────────────────────────────────────── */}
      {/* The narration the client records drops in here. A silent placeholder
          of exactly 180.000 s already sits at this path, so replacing the file
          is the only step — no code changes. */}
      <Audio src={staticFile("audio/vo.wav")} volume={1} />
      <Audio src={staticFile("audio/ambient-bed.wav")} volume={0.5} />
      {/* The bed is already carved for the voice at synthesis time and mastered
          to -15.5 dBFS peak; this holds it well under a spoken track. */}
      <Audio src={staticFile("audio/music-bed.wav")} volume={0.42} />

      {SFX_PLAN.map((s, i) => (
        <Sequence key={i} from={sec(s.at)} durationInFrames={90}>
          <Audio src={staticFile(`audio/sfx/${s.cue}.wav`)} volume={s.vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
