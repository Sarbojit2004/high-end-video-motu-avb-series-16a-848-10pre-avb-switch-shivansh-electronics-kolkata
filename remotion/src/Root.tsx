import React from 'react';
import { Composition } from 'remotion';
import { Part1 } from './part1/Part1';
import { Thumb1 } from './thumbnails/Thumb1';
import { FPS, H, PART_FRAMES, W } from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Part1"
      component={Part1}
      durationInFrames={PART_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="Thumb1"
      component={Thumb1}
      durationInFrames={1}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
