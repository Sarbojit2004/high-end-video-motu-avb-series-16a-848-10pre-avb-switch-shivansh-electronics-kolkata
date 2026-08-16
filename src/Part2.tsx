import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { FontGate, AudioLayer } from "./components/Shell";
import { PartSeries, TX, type TransitionSpec } from "./components/PartSeries";
import schedule from "./schedule.json";
import * as S from "./scenes/part2";

const P = schedule.parts["2"];
export const P2_SCHEDULED = P.scenes.map((s) => s.dur);

// Deliberately a different ordering from Part 1 so ~534 s of series runtime
// never leans on the same two or three transition types.
export const P2_TRANSITIONS: TransitionSpec[] = [
  TX.clock,      // S01 → S02
  TX.wipeUp,     // S02 → S03
  TX.slideLeft,  // S03 → S04
  TX.fadeSoft,   // S04 → S05
  TX.wipeRight,  // S05 → S06
  TX.slideUp,    // S06 → S07
  TX.flipTop,    // S07 → S08
  TX.fadeQuick,  // S08 → S09
  TX.wipeDiag,   // S09 → S10
  TX.slideDown,  // S10 → S11
  TX.fadeSoft,   // S11 → S12
  TX.clock,      // S12 → S13
  TX.slideLeft,  // S13 → S14
  TX.fadeSoft,   // S14 → S15
];

export const Part2: React.FC = () => {
  const { width, height } = useVideoConfig();
  const d = P2_SCHEDULED;
  return (
    <FontGate>
      <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
        <AudioLayer part="part2" />
        <PartSeries
          width={width}
          height={height}
          scheduled={d}
          transitions={P2_TRANSITIONS}
          scenes={[
            <S.S01_RecapHook total={d[0]} />,
            <S.S02_ChapterCard total={d[1]} />,
            <S.S03_SixteenAReveal total={d[2]} />,
            <S.S04_ZeroPreamps total={d[3]} />,
            <S.S05_SixteenIn total={d[4]} />,
            <S.S06_SixteenOut total={d[5]} />,
            <S.S07_DualDisplays total={d[6]} />,
            <S.S08_PatchMatrix total={d[7]} />,
            <S.S09_AdatOptical total={d[8]} />,
            <S.S10_EngineCallback total={d[9]} />,
            <S.S11_DawIntegration total={d[10]} />,
            <S.S12_AvbChain total={d[11]} />,
            <S.S13_MultiDevice total={d[12]} />,
            <S.S14_IdentityBadges total={d[13]} />,
            <S.S15_CtaTease total={d[14]} />,
          ]}
        />
      </AbsoluteFill>
    </FontGate>
  );
};
