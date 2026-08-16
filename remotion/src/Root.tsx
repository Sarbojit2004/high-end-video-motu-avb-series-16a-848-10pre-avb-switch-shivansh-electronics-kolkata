import React from 'react';
import { Composition } from 'remotion';
import { Part1 } from './part1/Part1';
import { Part2 } from './part2/Part2';
import { Part3 } from './part3/Part3';
import { Thumb1 } from './thumbnails/Thumb1';
import { Thumb2 } from './thumbnails/Thumb2';
import { Thumb3 } from './thumbnails/Thumb3';
import { LongPart1 } from './long/part1/LongPart1';
import { LongPart2 } from './long/part2/LongPart2';
import { LongPart3 } from './long/part3/LongPart3';
import { LONG_FRAMES, LW, LH } from './long/layout';
import { LongThumb1, LongThumb2, LongThumb3 } from './long/LongThumb';
import { FPS, H, PART_FRAMES, W } from './theme';

const reel = { durationInFrames: PART_FRAMES, fps: FPS, width: W, height: H };
const still = { durationInFrames: 1, fps: FPS, width: W, height: H };
// Long-form: 1920x1080 landscape, 298 s
const long = { durationInFrames: LONG_FRAMES, fps: FPS, width: LW, height: LH };
const longStill = { durationInFrames: 1, fps: FPS, width: LW, height: LH };

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Part1" component={Part1} {...reel} />
    <Composition id="Part2" component={Part2} {...reel} />
    <Composition id="Part3" component={Part3} {...reel} />
    <Composition id="LongPart1" component={LongPart1} {...long} />
    <Composition id="LongPart2" component={LongPart2} {...long} />
    <Composition id="LongPart3" component={LongPart3} {...long} />
    <Composition id="LongThumb1" component={LongThumb1} {...longStill} />
    <Composition id="LongThumb2" component={LongThumb2} {...longStill} />
    <Composition id="LongThumb3" component={LongThumb3} {...longStill} />
    <Composition id="Thumb1" component={Thumb1} {...still} />
    <Composition id="Thumb2" component={Thumb2} {...still} />
    <Composition id="Thumb3" component={Thumb3} {...still} />
  </>
);
