import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { VIDEO } from "./theme";
import { MasterReel, MasterReelSilent } from "./MasterReel";
import { MusicBed, SfxTimeline } from "./Audio";
import { TOTAL_FRAMES, TOTAL_SECONDS, SEGMENTS, BEATS } from "./schedule";
import { Thumb } from "./Thumbnail";

/**
 * The schedule must sum to exactly 298 s x 30 fps, and each segment must hit
 * its own allocation. Both are build errors here rather than something
 * discovered in a render.
 */
if (TOTAL_FRAMES !== VIDEO.durationInFrames) {
  throw new Error(
    `Schedule is ${TOTAL_FRAMES} frames but the delivery spec is ` +
      `${VIDEO.durationInFrames} (298 s @ ${VIDEO.fps}fps). Diff: ${TOTAL_FRAMES - VIDEO.durationInFrames}.`
  );
}
for (const s of SEGMENTS) {
  const got = BEATS.filter((b) => b.seg === s.id).reduce((a, b) => a + b.sec, 0);
  if (got !== s.sec) {
    throw new Error(`Segment "${s.id}" is ${got}s but its allocation is ${s.sec}s.`);
  }
}
if (TOTAL_SECONDS !== 298) throw new Error(`TOTAL_SECONDS is ${TOTAL_SECONDS}, expected 298.`);

const AudioOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#000" }}>{children}</AbsoluteFill>
);

const portrait = {
  durationInFrames: VIDEO.durationInFrames,
  fps: VIDEO.fps,
  width: VIDEO.width,
  height: VIDEO.height,
};
const stem = {
  durationInFrames: VIDEO.durationInFrames,
  fps: VIDEO.fps,
  width: 270,
  height: 480,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MasterReel" component={MasterReel} {...portrait} />
    <Composition id="MasterReelSilent" component={MasterReelSilent} {...portrait} />
    <Composition id="MasterReelMusic" component={() => (<AudioOnly><MusicBed /></AudioOnly>)} {...stem} />
    <Composition id="MasterReelSfx" component={() => (<AudioOnly><SfxTimeline /></AudioOnly>)} {...stem} />
    <Composition id="Thumb" component={Thumb} durationInFrames={1}
                 fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  </>
);
