import React from "react";
import { accents, makeMusicBed, makeSfxTimeline, makeVoiceover } from "../audio";
import { BEATS, BEAT_STARTS, MUSIC_PLAN, TOTAL_FRAMES } from "./schedule";

/**
 * REEL 1 audio — the shared two-layer pipeline in src/audio.tsx, bound to this
 * reel's own schedule. GIFTED's 128.4 s body relays once inside Reel 1's 145 s
 * body window; the Mindscape bookends carry the hook and the close.
 */
export const MusicBed = makeMusicBed(MUSIC_PLAN);
export const SfxTimeline = makeSfxTimeline(accents(BEATS, BEAT_STARTS, TOTAL_FRAMES));

export const HAS_VOICEOVER = false;
export const Voiceover = makeVoiceover(1, HAS_VOICEOVER);

export const FullAudio: React.FC = () => (
  <>
    <MusicBed />
    <SfxTimeline />
    <Voiceover />
  </>
);
