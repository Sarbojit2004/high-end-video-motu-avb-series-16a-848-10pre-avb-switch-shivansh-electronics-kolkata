import React, { useEffect, useState } from "react";
import { AbsoluteFill, Audio, Sequence, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { TIMELINE, TAIL } from "./data/timeline.ts";
import { TOTAL_FRAMES, PARTS, ACTS, beatFrame, FPS } from "./data/grid.ts";
import { ACT_PALETTES, inkFor } from "./design/palette.ts";
import { loadFonts } from "./design/fonts.ts";
import { ShotView } from "./components/Shot.tsx";
import { ColdOpen } from "./acts/ColdOpen.tsx";
import { BrandClose } from "./acts/BrandClose.tsx";
import { Grain } from "./components/Grain.tsx";
import { Flash } from "./components/Transitions.tsx";
import { CornerMark } from "./components/Brand.tsx";

const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => { loadFonts().then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); }); }, [handle]);
};

/** The whole 90 s as one continuous composition; export parts wrap it with an offset. */
export const Reel: React.FC<{ offsetFrames?: number; audioFile?: string }> = ({ offsetFrames = 0, audioFile = "audio/bed.wav" }) => {
  useFonts();
  const frame = useCurrentFrame();
  const flashes = TIMELINE.shots.filter((s) => s.enter === "flash").map((s) => ({ color: ACT_PALETTES[s.act].flash, frames: [s.startFrame - 1, s.startFrame, s.startFrame + TAIL.flash - 1] }));
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile(audioFile)} startFrom={offsetFrames} volume={1} />
      <Sequence from={-offsetFrames} durationInFrames={TOTAL_FRAMES + offsetFrames} layout="none">
        {/* persistent act ground beneath every shot: a whip or punch never exposes black */}
        {ACTS.map((a) => (
          <Sequence key={a.id} from={beatFrame(a.startBeat)} durationInFrames={beatFrame(a.endBeat) - beatFrame(a.startBeat)} layout="none">
            <AbsoluteFill style={{ background: ACT_PALETTES[a.id].bg[0] }} />
          </Sequence>
        ))}
        {TIMELINE.shots.map((s) => {
          const from = s.startFrame - s.lead;
          const dur = s.endFrame - from + TAIL[s.enter];
          if (s.kind === "cold") return <Sequence key={s.index} from={s.startFrame} durationInFrames={s.endFrame - s.startFrame} layout="none"><ColdOpen text={{ value: s.text!.value, sub: s.text!.sub }} /></Sequence>;
          if (s.kind === "brand") return <Sequence key={s.index} from={s.startFrame} durationInFrames={s.endFrame - s.startFrame} layout="none"><BrandClose tagline={s.text!.value} /></Sequence>;
          return (
            <Sequence key={s.index} from={from} durationInFrames={dur} layout="none">
              <ShotView shot={s} />
            </Sequence>
          );
        })}
        {flashes.map((f, i) => <Flash key={i} color={f.color} frames={f.frames} />)}
        {/* understated persistent corner mark through the product acts only (brief §6) */}
        <Sequence from={beatFrame(9)} durationInFrames={beatFrame(125) - beatFrame(9)} layout="none">
          <CornerMarkForFrame />
        </Sequence>
        <Grain opacity={0.085} />
      </Sequence>
    </AbsoluteFill>
  );
};

const CornerMarkForFrame: React.FC = () => {
  const f = useCurrentFrame() + beatFrame(9);
  const shot = TIMELINE.shots.find((s) => f >= s.startFrame && f < s.endFrame);
  if (!shot) return null;
  const p = ACT_PALETTES[shot.act];
  const bg = p.bg[Math.min(shot.bg ?? 0, p.bg.length - 1)];
  return <CornerMark ink={inkFor(p, bg)} opacity={0.5} />;
};

export const partOf = (id: (typeof PARTS)[number]["id"]) => PARTS.find((p) => p.id === id)!;
export const partFrames = (id: (typeof PARTS)[number]["id"]) => { const p = partOf(id); return { from: beatFrame(p.startBeat), duration: beatFrame(p.endBeat) - beatFrame(p.startBeat) }; };
export { TOTAL_FRAMES, FPS };
