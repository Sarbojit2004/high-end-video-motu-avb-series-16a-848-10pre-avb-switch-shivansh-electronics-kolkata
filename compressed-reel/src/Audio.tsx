import React from "react";
import { accents, makeMusicBed, makeSfxTimeline, makeVoiceover } from "./audio-pipeline";
import { BEATS, BEAT_STARTS, MUSIC_PLAN, TOTAL_FRAMES } from "./schedule";

/**
 * COMPRESSED REEL audio — the two-layer pipeline pulled from the 298 s master
 * reel (src/audio-pipeline.tsx), bound to this reel's own 88 s schedule.
 *
 * Layer 2 fires harder here than anywhere else in the pipeline: a transition on
 * every one of 16 cuts plus accents inside each beat, inside 88 s. That is why
 * the palette was widened from 28 voices to 34 — see scripts/make-sfx.mjs.
 */
export const MusicBed = makeMusicBed(MUSIC_PLAN);
export const SfxTimeline = makeSfxTimeline(accents(BEATS, BEAT_STARTS, TOTAL_FRAMES));

export const HAS_VOICEOVER = false;
export const Voiceover = makeVoiceover(0, HAS_VOICEOVER);

export const FullAudio: React.FC = () => (
  <>
    <MusicBed />
    <SfxTimeline />
    <Voiceover />
  </>
);
