import React from "react";
import { BEATS, BEAT_STARTS } from "./schedule";
import { FullAudio } from "./Audio";
import { makeReel } from "./Reel";

const { Full } = makeReel(BEATS, BEAT_STARTS);

export const MasterReel: React.FC = () => <Full audio={<FullAudio />} />;

/** Picture-only build for the QA still pass. */
export const MasterReelSilent: React.FC = () => <Full />;
