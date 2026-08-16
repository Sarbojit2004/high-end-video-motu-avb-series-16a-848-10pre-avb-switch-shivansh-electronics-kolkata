import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { FontGate, AudioLayer } from "./components/Shell";
import { PartSeries, TX, type TransitionSpec } from "./components/PartSeries";
import schedule from "./schedule.json";
import * as S from "./scenes/part1";

const P = schedule.parts["1"];
export const P1_SCHEDULED = P.scenes.map((s) => s.dur);

export const P1_TRANSITIONS: TransitionSpec[] = [
  TX.slideUp,    // S01 → S02
  TX.fadeSoft,   // S02 → S03
  TX.clock,      // S03 → S04
  TX.wipeUp,     // S04 → S05
  TX.slideLeft,  // S05 → S06
  TX.fadeQuick,  // S06 → S07
  TX.wipeLeft,   // S07 → S08
  TX.slideUp,    // S08 → S09
  TX.flipLeft,   // S09 → S10
  TX.fadeSoft,   // S10 → S11
  TX.clock,      // S11 → S12
  TX.slideRight, // S12 → S13
  TX.wipeDiag,   // S13 → S14
  TX.fadeSoft,   // S14 → S15
];

export const Part1: React.FC = () => {
  const { width, height } = useVideoConfig();
  const d = P1_SCHEDULED;
  return (
    <FontGate>
      <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
        <AudioLayer part="part1" />
        <PartSeries
          width={width}
          height={height}
          scheduled={d}
          transitions={P1_TRANSITIONS}
          scenes={[
            <S.S01_Hook total={d[0]} />,
            <S.S02_IdenticalEngine total={d[1]} />,
            <S.S03_EngineSpecs total={d[2]} />,
            <S.S04_ChapterCard total={d[3]} />,
            <S.S05_TenPreReveal total={d[4]} />,
            <S.S06_Preamps total={d[5]} />,
            <S.S07_EightTwoSplit total={d[6]} />,
            <S.S08_FrontPanel total={d[7]} />,
            <S.S09_CueMix total={d[8]} />,
            <S.S10_OpticalExpansion total={d[9]} />,
            <S.S11_Monitoring total={d[10]} />,
            <S.S12_AvbSeed total={d[11]} />,
            <S.S13_StudioContext total={d[12]} />,
            <S.S14_IdentityBadges total={d[13]} />,
            <S.S15_CtaTease total={d[14]} />,
          ]}
        />
      </AbsoluteFill>
    </FontGate>
  );
};
