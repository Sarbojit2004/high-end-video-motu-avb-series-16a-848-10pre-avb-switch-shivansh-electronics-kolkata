import React from "react";
import { accents, makeMusicBed, makeSfxTimeline, makeVoiceover } from "./audio-pipeline";
import { BEATS, BEAT_STARTS, MUSIC_PLAN, TOTAL_FRAMES } from "./schedule";

/**
 * MASTER REEL audio — the two-layer pipeline pulled from the approved reel
 * build (src/audio.tsx), bound to this reel's own 298 s schedule.
 *
 * Every segment's music window (30-50 s) is shorter than its track's own
 * length, so nothing loops: each segment makes one musical pass and hands over
 * at a 1 s crossfade. That is a real advantage of the blend at this length —
 * the three-part reels had to relay a 128 s track across a 145 s body window.
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
