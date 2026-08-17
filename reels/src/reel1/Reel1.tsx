import React from "react";
import { BEATS, BEAT_STARTS } from "./schedule";
import { FullAudio } from "./Audio";
import { makeReel } from "../Reel";

const { Full } = makeReel(BEATS, BEAT_STARTS);

export const Reel1: React.FC = () => <Full audio={<FullAudio />} />;

/** Picture-only build for the QA still pass. */
export const Reel1Silent: React.FC = () => <Full />;
