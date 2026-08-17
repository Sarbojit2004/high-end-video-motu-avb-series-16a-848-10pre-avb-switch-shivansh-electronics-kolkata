import React from "react";
import { accents, makeMusicBed, makeSfxTimeline, makeVoiceover } from "../audio";
import { BEATS, BEAT_STARTS, MUSIC_PLAN, TOTAL_FRAMES } from "./schedule";

/**
 * REEL 3 audio — the shared two-layer pipeline in src/audio.tsx, bound to this
 * reel's own schedule. ETERNITY is 142.7 s, so it relays once inside Reel 3's
 * 145 s body window; the relay lands at 2:22 into the track rather than at its
 * top, so the seam reads as an arrangement change rather than a loop. The
 * Mindscape bookends are the set's common signature and are identical in all
 * three reels.
 */
export const MusicBed = makeMusicBed(MUSIC_PLAN);
export const SfxTimeline = makeSfxTimeline(accents(BEATS, BEAT_STARTS, TOTAL_FRAMES));

export const HAS_VOICEOVER = false;
export const Voiceover = makeVoiceover(3, HAS_VOICEOVER);

export const FullAudio: React.FC = () => (
  <>
    <MusicBed />
    <SfxTimeline />
    <Voiceover />
  </>
);
