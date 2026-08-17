import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { VIDEO } from "./theme";
import { Reel1, Reel1Silent } from "./reel1/Reel1";
import { MusicBed as R1Music, SfxTimeline as R1Sfx } from "./reel1/Audio";
import { TOTAL_FRAMES as R1_FRAMES } from "./reel1/schedule";
import { Thumb1 } from "./reel1/Thumbnail";
import { Reel2, Reel2Silent } from "./reel2/Reel2";
import { MusicBed as R2Music, SfxTimeline as R2Sfx } from "./reel2/Audio";
import { TOTAL_FRAMES as R2_FRAMES } from "./reel2/schedule";
import { Thumb2 } from "./reel2/Thumbnail";
import { Reel3, Reel3Silent } from "./reel3/Reel3";
import { MusicBed as R3Music, SfxTimeline as R3Sfx } from "./reel3/Audio";
import { TOTAL_FRAMES as R3_FRAMES } from "./reel3/schedule";
import { Thumb3 } from "./reel3/Thumbnail";

/**
 * Each reel's schedule must sum to exactly 178 s x 30 fps. A drift is a build
 * error here rather than something discovered in a render.
 */
for (const [name, got] of [["Reel 1", R1_FRAMES], ["Reel 2", R2_FRAMES], ["Reel 3", R3_FRAMES]] as const) {
  if (got !== VIDEO.durationInFrames) {
    throw new Error(
      `${name} schedule is ${got} frames but the delivery spec is ` +
        `${VIDEO.durationInFrames} (178 s @ ${VIDEO.fps}fps). Diff: ${got - VIDEO.durationInFrames}.`
    );
  }
}

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
const still = { durationInFrames: 1, fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };

export const RemotionRoot: React.FC = () => (
  <>
    {/* ───────────────────────────────── Reel 1 — "The Source" (MOTU 10pre) */}
    <Composition id="Reel1" component={Reel1} {...portrait} />
    <Composition id="Reel1Silent" component={Reel1Silent} {...portrait} />
    <Composition id="Reel1Music" component={() => (<AudioOnly><R1Music /></AudioOnly>)} {...stem} />
    <Composition id="Reel1Sfx" component={() => (<AudioOnly><R1Sfx /></AudioOnly>)} {...stem} />
    <Composition id="Thumb1" component={Thumb1} {...still} />

    {/* ───────────────────────────────── Reel 2 — "The Matrix" (MOTU 16A) */}
    <Composition id="Reel2" component={Reel2} {...portrait} />
    <Composition id="Reel2Silent" component={Reel2Silent} {...portrait} />
    <Composition id="Reel2Music" component={() => (<AudioOnly><R2Music /></AudioOnly>)} {...stem} />
    <Composition id="Reel2Sfx" component={() => (<AudioOnly><R2Sfx /></AudioOnly>)} {...stem} />
    <Composition id="Thumb2" component={Thumb2} {...still} />

    {/* ─────────── Reel 3 — "The Command Center & Scale" (848 + AVB Switch) */}
    <Composition id="Reel3" component={Reel3} {...portrait} />
    <Composition id="Reel3Silent" component={Reel3Silent} {...portrait} />
    <Composition id="Reel3Music" component={() => (<AudioOnly><R3Music /></AudioOnly>)} {...stem} />
    <Composition id="Reel3Sfx" component={() => (<AudioOnly><R3Sfx /></AudioOnly>)} {...stem} />
    <Composition id="Thumb3" component={Thumb3} {...still} />
  </>
);
