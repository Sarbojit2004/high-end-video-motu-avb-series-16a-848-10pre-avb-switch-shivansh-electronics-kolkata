import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, continueRender, delayRender } from "remotion";
import { BEATS, BEAT_STARTS, frames } from "./schedule";
import { BeatScene } from "./Scenes";
import { FullAudio } from "./Audio";
import { FONT_FACE_CSS, loadFonts } from "../fonts";
import { COLORS } from "../theme";
import { Progress } from "../components/Shell";

/**
 * Global box model. Remotion ships no `box-sizing` reset, and every Plate card
 * uses padding with `height: 100%` — without border-box those compound through
 * the nesting and push media clean out of the caption-safe zone.
 */
const RESET_CSS = `*, *::before, *::after { box-sizing: border-box; }`;

export const Fonts: React.FC = () => {
  const [handle] = React.useState(() => delayRender("Loading ported Fraunces + Archivo"));
  React.useEffect(() => {
    loadFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  return <style>{RESET_CSS + FONT_FACE_CSS}</style>;
};

const Beats: React.FC = () => (
  <>
    {BEATS.map((b, i) => (
      <Sequence key={b.id} from={BEAT_STARTS[i]} durationInFrames={frames(b.sec)} name={b.id}>
        <BeatScene b={b} />
      </Sequence>
    ))}
  </>
);

export const Reel1: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <Fonts />
      <Beats />
      <Progress progress={frame / durationInFrames} />
      <FullAudio />
    </AbsoluteFill>
  );
};

/** Picture-only build for the QA still pass. */
export const Reel1Silent: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.paper }}>
      <Fonts />
      <Beats />
      <Progress progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};
