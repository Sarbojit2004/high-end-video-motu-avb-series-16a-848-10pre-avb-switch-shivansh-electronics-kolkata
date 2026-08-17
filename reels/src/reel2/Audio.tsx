import React from "react";
import { accents, makeMusicBed, makeSfxTimeline, makeVoiceover } from "../audio";
import { BEATS, BEAT_STARTS, MUSIC_PLAN, TOTAL_FRAMES } from "./schedule";

/**
 * REEL 2 audio — the shared two-layer pipeline in src/audio.tsx, bound to this
 * reel's own schedule. DIABLO is 170.5 s, so it covers Reel 2's 145 s body with
 * a single pass and no relay at all; the Mindscape bookends are the set's
 * common signature and are identical in all three reels.
 *
 * Four DIABLO stems are deployed rather than three: the melody stem carries the
 * software middle third, where the picture is screenshots rather than hardware
 * and the bed is doing more of the work.
 */
export const MusicBed = makeMusicBed(MUSIC_PLAN);
export const SfxTimeline = makeSfxTimeline(accents(BEATS, BEAT_STARTS, TOTAL_FRAMES));

export const HAS_VOICEOVER = false;
export const Voiceover = makeVoiceover(2, HAS_VOICEOVER);

export const FullAudio: React.FC = () => (
  <>
    <MusicBed />
    <SfxTimeline />
    <Voiceover />
  </>
);
