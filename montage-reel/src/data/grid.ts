// ─────────────────────────────────────────────────────────────────────────────
// MASTER BEAT GRID — single source of truth for every cut, act boundary, audio
// section and export split. Pure TypeScript (no Remotion imports) so the node
// audio/coverage scripts can import it directly (node --experimental-strip-types).
// Derived in TIMING_MAP.md from the analysis in public/audio/analysis/.
// ─────────────────────────────────────────────────────────────────────────────
export const FPS = 60;
export const WIDTH = 2160;
export const HEIGHT = 3840;

export const BPM = 89.52;
export const SPB = 60 / BPM; // 0.670241 s
export const FRAMES_PER_BEAT = SPB * FPS; // 40.2145

export const TOTAL_BEATS = 134;

/** Frame index of a beat position (fractional beats allowed). */
export const beatFrame = (beat: number): number => Math.round(beat * FRAMES_PER_BEAT);
export const beatSeconds = (beat: number): number => beat * SPB;
export const TOTAL_FRAMES = beatFrame(TOTAL_BEATS); // 5389

export type ActId = "act0" | "act1" | "act2" | "act3" | "act4" | "act5";
export interface ActSpan { id: ActId; name: string; startBeat: number; endBeat: number }
export const ACTS: ActSpan[] = [
  { id: "act0", name: "Cold open", startBeat: 0, endBeat: 9 },
  { id: "act1", name: "MOTU 16A", startBeat: 9, endBeat: 41 },
  { id: "act2", name: "MOTU 848", startBeat: 41, endBeat: 73 },
  { id: "act3", name: "MOTU 10pre", startBeat: 73, endBeat: 105 },
  { id: "act4", name: "AVB Switch / ecosystem", startBeat: 105, endBeat: 125 },
  { id: "act5", name: "Branding close", startBeat: 125, endBeat: 134 },
];
export const actStartFrame = (id: ActId) => beatFrame(ACTS.find((a) => a.id === id)!.startBeat);
export const actEndFrame = (id: ActId) => beatFrame(ACTS.find((a) => a.id === id)!.endBeat);

/** Export parts (brief §9): split exactly on the two Danny↔Ian handoffs. */
export const PARTS = [
  { id: "Part1", file: "motu-avb-montage-reel-part1-of-3", startBeat: 0, endBeat: 41 },
  { id: "Part2", file: "motu-avb-montage-reel-part2-of-3", startBeat: 41, endBeat: 105 },
  { id: "Part3", file: "motu-avb-montage-reel-part3-of-3", startBeat: 105, endBeat: 134 },
] as const;

/** Music sections of the bed (see TIMING_MAP.md). Source times in seconds of the original files. */
export interface MusicSection {
  track: "danny" | "ian";
  reelStartBeat: number;
  reelEndBeat: number;
  srcStart: number;
  /** native seconds-per-beat of the source in this section (measured) */
  srcSpb: number;
  note: string;
}
export const MUSIC: MusicSection[] = [
  { track: "danny", reelStartBeat: 0, reelEndBeat: 41, srcStart: 19.478, srcSpb: 0.670241, note: "build + drop #1 (drop downbeat 25.510 s = reel beat 9)" },
  { track: "ian", reelStartBeat: 41, reelEndBeat: 73, srcStart: 24.990, srcSpb: 0.68603, note: "chorus #1 (downbeat 24.990 s = reel beat 41)" },
  { track: "ian", reelStartBeat: 73, reelEndBeat: 105, srcStart: 68.886, srcSpb: 0.6854, note: "chorus #2, loudest (downbeat 68.886 s = reel beat 73)" },
  { track: "danny", reelStartBeat: 105, reelEndBeat: 134, srcStart: 111.476, srcSpb: 0.67537, note: "final drop → hard-stop ending at 127.65 s (reel 86.43 s)" },
];

/** Reel-time (seconds) of the Danny ending hard stop, used for a visual accent in Act V. */
export const ENDING_STOP_SECONDS = beatSeconds(105) + (127.65 - 111.476) / (0.67537 / SPB);
