import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { COLORS } from "./theme";
import { FontGate, AudioLayer } from "./components/Shell";
import { PartSeries, TX, type TransitionSpec } from "./components/PartSeries";
import schedule from "./schedule.json";
import * as S from "./scenes/part3";

const P = schedule.parts["3"];
export const P3_SCHEDULED = P.scenes.map((s) => s.dur);

// Third distinct ordering — across the series, every transition in the
// vocabulary is used, and no part repeats another part's sequence.
export const P3_TRANSITIONS: TransitionSpec[] = [
  TX.wipeDiag,   // S01 → S02
  TX.clock,      // S02 → S03
  TX.slideUp,    // S03 → S04
  TX.fadeQuick,  // S04 → S05
  TX.slideLeft,  // S05 → S06
  TX.wipeUp,     // S06 → S07
  TX.fadeSoft,   // S07 → S08
  TX.flipLeft,   // S08 → S09
  TX.wipeRight,  // S09 → S10
  TX.slideDown,  // S10 → S11
  TX.fadeSoft,   // S11 → S12
  TX.clock,      // S12 → S13
  TX.flipTop,    // S13 → S14
  TX.fadeSoft,   // S14 → S15
];

export const Part3: React.FC = () => {
  const { width, height } = useVideoConfig();
  const d = P3_SCHEDULED;
  return (
    <FontGate>
      <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
        <AudioLayer part="part3" />
        <PartSeries
          width={width}
          height={height}
          scheduled={d}
          transitions={P3_TRANSITIONS}
          scenes={[
            <S.S01_RecapHook total={d[0]} />,
            <S.S02_ChapterCard total={d[1]} />,
            <S.S03_EightFortyEightReveal total={d[2]} />,
            <S.S04_FourPreamps total={d[3]} />,
            <S.S05_ControlRoom total={d[4]} />,
            <S.S06_AtmosMonitoring total={d[5]} />,
            <S.S07_HeadphonesInserts total={d[6]} />,
            <S.S08_PatchAndMix total={d[7]} />,
            <S.S09_EngineCallback total={d[8]} />,
            <S.S10_AvbSwitchReveal total={d[9]} />,
            <S.S11_SwitchSpecs total={d[10]} />,
            <S.S12_FullNetwork total={d[11]} />,
            <S.S13_ScaleNumbers total={d[12]} />,
            <S.S14_IdentityBadges total={d[13]} />,
            <S.S15_SeriesOutro total={d[14]} />,
          ]}
        />
      </AbsoluteFill>
    </FontGate>
  );
};
