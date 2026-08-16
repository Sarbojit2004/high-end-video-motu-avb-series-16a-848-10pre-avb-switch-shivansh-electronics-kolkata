import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { VIDEO } from "./theme";
import { LongForm, LongFormSilent } from "./LongForm";
import { MusicBed, SfxTimeline } from "./Audio";
import { Thumbnail } from "./Thumbnail";
import { TOTAL_FRAMES } from "./schedule";

/**
 * TOTAL_FRAMES is derived from the beat list, and must equal 898 s x 30 fps.
 * A mismatch is a build error rather than something to discover in the render.
 */
if (TOTAL_FRAMES !== VIDEO.durationInFrames) {
  throw new Error(
    `Schedule is ${TOTAL_FRAMES} frames but the delivery spec is ` +
      `${VIDEO.durationInFrames} (898 s @ ${VIDEO.fps}fps). ` +
      `Difference: ${TOTAL_FRAMES - VIDEO.durationInFrames} frames.`
  );
}

const AudioOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#000" }}>{children}</AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="LongForm"
      component={LongForm}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition
      id="LongFormSilent"
      component={LongFormSilent}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    {/* Standalone Layer 1 — full music bed as deployed, 898 s. */}
    <Composition
      id="MusicBedOnly"
      component={() => (<AudioOnly><MusicBed /></AudioOnly>)}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={480}
      height={270}
    />
    {/* Standalone Layer 2 — every transition/foley hit at its exact position. */}
    <Composition
      id="SfxTimelineOnly"
      component={() => (<AudioOnly><SfxTimeline /></AudioOnly>)}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={480}
      height={270}
    />
    <Composition
      id="Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
