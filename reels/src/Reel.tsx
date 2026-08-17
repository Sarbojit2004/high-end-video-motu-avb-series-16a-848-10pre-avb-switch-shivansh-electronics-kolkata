import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, continueRender, delayRender } from "remotion";
import { BeatScene } from "./BeatScene";
import { FONT_FACE_CSS, loadFonts } from "./fonts";
import { COLORS } from "./theme";
import { Progress } from "./components/Shell";
import type { Beat } from "./beat";
import { frames } from "./beat";

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

/**
 * Builds a reel's picture from its schedule. Each of the three reels is an
 * entirely separate film — separate schedule, separate images, separate music
 * — but they share this shell so the type, safe margins and progress rule are
 * provably identical across the set rather than identical by inspection.
 */
export function makeReel(beats: Beat[], startsArr: number[]) {
  const Beats: React.FC = () => (
    <>
      {beats.map((b, i) => (
        <Sequence key={b.id} from={startsArr[i]} durationInFrames={frames(b.sec)} name={b.id}>
          <BeatScene b={b} />
        </Sequence>
      ))}
    </>
  );

  const Full: React.FC<{ audio?: React.ReactNode }> = ({ audio }) => {
    const frame = useCurrentFrame();
    const { durationInFrames } = useVideoConfig();
    return (
      <AbsoluteFill style={{ background: COLORS.paper }}>
        <Fonts />
        <Beats />
        <Progress progress={frame / durationInFrames} />
        {audio}
      </AbsoluteFill>
    );
  };

  return { Beats, Full };
}
