import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, continueRender, delayRender } from "remotion";
import { BEATS, BEAT_STARTS, frames, TOTAL_FRAMES } from "./schedule";
import { BeatScene } from "./Scenes";
import { FullAudio } from "./Audio";
import { FONT_FACE_CSS, loadFonts } from "./fonts";
import { COLORS } from "./theme";
import { Progress } from "./components/Shell";

/**
 * Global box model. Remotion ships no `box-sizing` reset, so a nested
 * `height: 100%` plus padding — which every Plate card uses — grew each element
 * past its slot and compounded through the nesting, pushing montage tiles clean
 * off the bottom of the frame. Border-box makes the layout arithmetic hold.
 */
const RESET_CSS = `
*, *::before, *::after { box-sizing: border-box; }
`;

/** Injects the ported @font-face rules and blocks render until they resolve. */
export const Fonts: React.FC = () => {
  const [handle] = React.useState(() => delayRender("Loading ported Fraunces + Archivo"));
  React.useEffect(() => {
    loadFonts().then(() => continueRender(handle)).catch(() => continueRender(handle));
  }, [handle]);
  return <style>{RESET_CSS + FONT_FACE_CSS}</style>;
};

export const Beats: React.FC = () => (
  <>
    {BEATS.map((b, i) => (
      <Sequence key={b.id} from={BEAT_STARTS[i]} durationInFrames={frames(b.sec)} name={`${b.ch}·${b.id}`}>
        <BeatScene b={b} />
      </Sequence>
    ))}
  </>
);

export const LongForm: React.FC = () => {
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

/** Picture-only build, used by the QA still pass. */
export const LongFormSilent: React.FC = () => {
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

export { TOTAL_FRAMES };
