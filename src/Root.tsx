import React from "react";
import { Composition } from "remotion";
import { VIDEO } from "./theme";
import { Part1 } from "./Part1";
import { Part2 } from "./Part2";
import { Part3 } from "./Part3";
import { Thumbnail1, Thumbnail2, Thumbnail3 } from "./Thumbnails";

const reel = { durationInFrames: VIDEO.durationInFrames, fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };
const still = { durationInFrames: 1, fps: VIDEO.fps, width: VIDEO.width, height: VIDEO.height };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Part1" component={Part1} {...reel} />
    <Composition id="Part2" component={Part2} {...reel} />
    <Composition id="Part3" component={Part3} {...reel} />
    <Composition id="Thumbnail1" component={Thumbnail1} {...still} />
    <Composition id="Thumbnail2" component={Thumbnail2} {...still} />
    <Composition id="Thumbnail3" component={Thumbnail3} {...still} />
  </>
);
