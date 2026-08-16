import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { VIDEO } from "./theme";
import { Reel1, Reel1Silent } from "./reel1/Reel1";
import { MusicBed as R1Music, SfxTimeline as R1Sfx } from "./reel1/Audio";
import { TOTAL_FRAMES as R1_FRAMES } from "./reel1/schedule";
import { Thumb1 } from "./reel1/Thumbnail";

/**
 * Each reel's schedule must sum to exactly 178 s x 30 fps. A drift is a build
 * error here rather than something discovered in a render.
 */
for (const [name, got] of [["Reel 1", R1_FRAMES]] as const) {
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

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Reel1" component={Reel1} {...portrait} />
    <Composition id="Reel1Silent" component={Reel1Silent} {...portrait} />
    <Composition id="Reel1Music" component={() => (<AudioOnly><R1Music /></AudioOnly>)}
                 durationInFrames={VIDEO.durationInFrames} fps={VIDEO.fps} width={270} height={480} />
    <Composition id="Reel1Sfx" component={() => (<AudioOnly><R1Sfx /></AudioOnly>)}
                 durationInFrames={VIDEO.durationInFrames} fps={VIDEO.fps} width={270} height={480} />
    <Composition id="Thumb1" component={Thumb1} durationInFrames={1}
                 fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  </>
);
