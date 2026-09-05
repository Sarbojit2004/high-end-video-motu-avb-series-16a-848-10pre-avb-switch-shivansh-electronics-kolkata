import React from "react";
import { Composition } from "remotion";
import { Reel, partFrames } from "./Reel.tsx";
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES, PARTS } from "./data/grid.ts";

/**
 * One continuous 90 s composition ("Full", for Studio preview) and the three
 * sequential export parts (brief §9). Each Part is the SAME timeline offset by
 * its start frame, with the shared audio bed offset identically, so the three
 * MP4s join back-to-back with no gap and no re-sync.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Full" component={Reel} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ offsetFrames: 0 }} />
    {PARTS.map((p) => {
      const { from, duration } = partFrames(p.id);
      return <Composition key={p.id} id={p.id} component={Reel} durationInFrames={duration} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ offsetFrames: from }} />;
    })}
  </>
);
