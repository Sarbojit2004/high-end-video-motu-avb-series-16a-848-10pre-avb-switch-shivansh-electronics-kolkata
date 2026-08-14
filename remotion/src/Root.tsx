import React from 'react';
import { Composition } from 'remotion';
import { Part1 } from './part1/Part1';
import { Part2 } from './part2/Part2';
import { Part3 } from './part3/Part3';
import { Thumb1 } from './thumbnails/Thumb1';
import { Thumb2 } from './thumbnails/Thumb2';
import { Thumb3 } from './thumbnails/Thumb3';
import { FPS, H, PART_FRAMES, W } from './theme';

const reel = { durationInFrames: PART_FRAMES, fps: FPS, width: W, height: H };
const still = { durationInFrames: 1, fps: FPS, width: W, height: H };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Part1" component={Part1} {...reel} />
    <Composition id="Part2" component={Part2} {...reel} />
    <Composition id="Part3" component={Part3} {...reel} />
    <Composition id="Thumb1" component={Thumb1} {...still} />
    <Composition id="Thumb2" component={Thumb2} {...still} />
    <Composition id="Thumb3" component={Thumb3} {...still} />
  </>
);
