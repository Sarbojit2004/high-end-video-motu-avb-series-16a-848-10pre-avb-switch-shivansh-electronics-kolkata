import { VIDEO } from "./theme";
import type { SfxKey } from "./assets";
import type { BrandMode } from "./components/Brand";

/**
 * One beat of the master reel. Structure pulled from the approved three-part
 * reel build; `ecosystemMontage` is added here for this reel's new
 * cross-product technique (Section 3).
 */
export type Beat = {
  id: string;
  seg: SegmentId;
  sec: number;
  kind:
    | "hook" | "macroReveal" | "portSweep" | "ecosystemSplit" | "ecosystemMontage"
    | "badges" | "specGrid" | "hero" | "montage" | "software" | "dataFlow"
    | "brandBeat" | "price" | "cta" | "outro";
  images: number[];
  idx?: number;
  eyebrow?: string;
  heading?: string;
  sub?: string;
  specs?: { label: string; value: string }[];
  labels?: string[];
  cols?: number;
  /** ecosystemMontage only — frames each member holds the frame alone. */
  soloHold?: number;
  focal?: [number, number];
  macroScale?: number;
  brand: BrandMode;
  motu?: boolean;
  sfx: SfxKey;
};

/** Which narrative segment a beat belongs to (Section 4). */
export type SegmentId = "hook" | "thesis" | "capture" | "route" | "command" | "network" | "cta";

export const frames = (sec: number): number => Math.round(sec * VIDEO.fps);

export const starts = (beats: Beat[]): number[] => {
  const out: number[] = [];
  let acc = 0;
  for (const b of beats) { out.push(acc); acc += frames(b.sec); }
  return out;
};

export const totalFrames = (beats: Beat[]): number =>
  beats.reduce((a, b) => a + frames(b.sec), 0);

/** One stem's deployment inside a music segment. */
export type MusicSeg = {
  from: number;
  to: number;
  track: string;
  stems: readonly { slug: string; gain: number; from?: number }[];
};
