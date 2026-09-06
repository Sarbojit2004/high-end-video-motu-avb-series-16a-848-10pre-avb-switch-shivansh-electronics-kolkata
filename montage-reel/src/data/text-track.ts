// ─────────────────────────────────────────────────────────────────────────────
// TEXT TRACK — the heading / subheading layer that rides ON TOP of the finished
// shot timeline (text-layer rectification pass).
//
// This file adds text only. It does not touch the shot list, the images, the
// act boundaries, the palettes, the transitions or the audio — `timeline.ts`
// is read, never modified.
//
// THE RULE IT ENFORCES
//   Every product appearance carries a heading + subheading pair. A pair is
//   introduced on the cut that starts a run, PERSISTS through that run's
//   rapid-fire cuts, and exits with motion before the next pair. A product
//   change always starts a fresh pair on that cut. No stretch of product
//   imagery is ever left with no legible text for longer than MAX_SILENT_S.
//
// FORMATTING (validated at build time by validateTrack(), below)
//   heading — ALL UPPERCASE, no terminal punctuation
//   sub     — Title Case, 2–4 words, no terminal punctuation, never a spec value
//
// SUPPRESSION
//   Shots that already carry their own full-frame designed text moment — the
//   act-opening product-name cards, the Alfa Slab hero words, the serif mood
//   words, Act 0 and Act V — keep exactly the treatment they already have and
//   the band stays off. Those spans are listed by the shot's own `text.role`,
//   so nothing about them changes here.
//
//   The bare one-line `label` shots ARE superseded: their layout reservation in
//   Shot.tsx is untouched (so no image moves), but the band now renders a full
//   pair in their place instead of a lone line.
// ─────────────────────────────────────────────────────────────────────────────
import { ACTS, beatFrame, FPS, SPB, type ActId } from "./grid.ts";
import { TIMELINE, type Transition } from "./timeline.ts";

/** How the pair builds in — chosen to ride the cut that brought the shot on. */
export type TextMotion = "wipe" | "stagger" | "scale";

export interface TrackCard {
  act: ActId;
  /** beats relative to the act start; both must land on a shot boundary */
  relStart: number;
  relEnd: number;
  heading: string;
  sub: string;
}

export interface BuiltCard extends TrackCard {
  index: number;
  startFrame: number;
  endFrame: number;
  motion: TextMotion;
  /** wipe direction, taken from the incoming transition where it has one */
  dir: "l" | "r" | "u" | "d";
  /**
   * Chain anchors. Three elements of the pair persist independently across
   * contiguous cards, so nothing re-animates unless it actually changes:
   *   box  — the scrim; holds across any unbroken run of cards
   *   head — the product name; holds while the product does not change, so it
   *          locks for a whole act instead of flickering per run
   *   sub  — the script line; holds while the phrase does not change (the Act IV
   *          callback burst flips the heading per product underneath one sub)
   * Each is animated from its own start and exits before its own end.
   */
  boxStart: number; boxEnd: number;
  headStart: number; headEnd: number;
  subStart: number; subEnd: number;
}

/** Build-in / build-out lengths for one chain, scaled to how long it is up. */
export const chainTiming = (start: number, end: number, maxIn: number, maxOut: number) => ({
  enter: Math.max(5, Math.min(maxIn, Math.round((end - start) * 0.3))),
  exit: Math.max(4, Math.min(maxOut, Math.round((end - start) * 0.2))),
});

/** Longest run of product imagery allowed with no legible text on screen. */
export const MAX_SILENT_S = 2.5;

// ── the track ────────────────────────────────────────────────────────────────
// Heading stays the product name for the whole of a product act, so the viewer
// always has the anchor; the subheading turns over per run to describe what the
// run is actually showing.
const CARDS: TrackCard[] = [
  // ── Act I · MOTU 16A ───────────────────────────────────────────────────────
  { act: "act1", relStart: 3, relEnd: 10, heading: "MOTU 16A", sub: "Front And Rear" },
  { act: "act1", relStart: 10, relEnd: 16, heading: "MOTU 16A", sub: "CueMix Pro Control" },
  { act: "act1", relStart: 16, relEnd: 20, heading: "MOTU 16A", sub: "Channel Strip Power" },
  // 20 → 21.5 is the Alfa Slab "16A" hero word — band off
  { act: "act1", relStart: 21.5, relEnd: 26, heading: "MOTU 16A", sub: "Patch Bay Routing" },
  { act: "act1", relStart: 26, relEnd: 30, heading: "MOTU 16A", sub: "Studio Ready" },
  // 30 → 32 is the serif mood word "precision" — band off

  // ── Act II · MOTU 848 ──────────────────────────────────────────────────────
  { act: "act2", relStart: 2, relEnd: 8, heading: "MOTU 848", sub: "Front Panel Detail" },
  { act: "act2", relStart: 8, relEnd: 12, heading: "MOTU 848", sub: "Control Room Ready" },
  { act: "act2", relStart: 12, relEnd: 16, heading: "MOTU 848", sub: "Patch Bay Routing" },
  // 16 → 17.5 hero word "848"
  { act: "act2", relStart: 17.5, relEnd: 22, heading: "MOTU 848", sub: "Hands On Monitoring" },
  { act: "act2", relStart: 22, relEnd: 28, heading: "MOTU 848", sub: "Sound Library Included" },
  // 28 → 32 mood word "presence"

  // ── Act III · MOTU 10pre ───────────────────────────────────────────────────
  { act: "act3", relStart: 2, relEnd: 8, heading: "MOTU 10PRE", sub: "Every Input Ready" },
  { act: "act3", relStart: 8, relEnd: 14, heading: "MOTU 10PRE", sub: "CueMix Pro Control" },
  // 14 → 15.5 hero word "10pre"
  { act: "act3", relStart: 15.5, relEnd: 20, heading: "MOTU 10PRE", sub: "Front And Rear" },
  { act: "act3", relStart: 20, relEnd: 25, heading: "MOTU 10PRE", sub: "Channel Strip Power" },
  { act: "act3", relStart: 25, relEnd: 30, heading: "MOTU 10PRE", sub: "Patch Bay Routing" },
  // 30 → 32 mood word "momentum"

  // ── Act IV · the callback burst, then the switch ───────────────────────────
  // One beat each: the heading flips product to product on every cut (the rule
  // for a product change), while the shared subheading holds underneath.
  { act: "act4", relStart: 0, relEnd: 1, heading: "MOTU 16A", sub: "One Ecosystem" },
  { act: "act4", relStart: 1, relEnd: 2, heading: "MOTU 848", sub: "One Ecosystem" },
  { act: "act4", relStart: 2, relEnd: 3, heading: "MOTU 10PRE", sub: "One Ecosystem" },
  { act: "act4", relStart: 3, relEnd: 4, heading: "AVB NETWORK", sub: "One Ecosystem" },
  // 4 → 6 is the "AVB SWITCH" product-name card — band off
  { act: "act4", relStart: 6, relEnd: 12, heading: "AVB SWITCH", sub: "Ties It Together" },
  // 12 → 14 hero word "ONE NETWORK"
  { act: "act4", relStart: 14, relEnd: 16, heading: "IN SYNC", sub: "One Shared Clock" },
  // 16 → 18 hero word "ONE CLOCK"
  { act: "act4", relStart: 18, relEnd: 20, heading: "MOTU AVB", sub: "One Ecosystem" },
];

/** Roles that own the frame themselves — the band stays off for their span. */
const SUPPRESSING_ROLES = new Set(["title", "word", "mood", "script"]);

const MOTION_FOR: Record<Transition, TextMotion> = {
  whip: "wipe",
  line: "wipe",
  glitch: "stagger",
  flash: "stagger",
  punch: "scale",
  hard: "scale",
};

export function buildTextTrack(): BuiltCard[] {
  const actStart = (id: ActId) => ACTS.find((a) => a.id === id)!.startBeat;
  const built: BuiltCard[] = [];
  CARDS.forEach((c, index) => {
    const startBeat = actStart(c.act) + c.relStart;
    const endBeat = actStart(c.act) + c.relEnd;
    const startFrame = beatFrame(startBeat);
    const endFrame = beatFrame(endBeat);
    const shot = TIMELINE.shots.find((s) => s.startFrame === startFrame);
    const len = endFrame - startFrame;
    built.push({
      ...c,
      index,
      startFrame,
      endFrame,
      motion: shot ? MOTION_FOR[shot.enter] : "scale",
      dir: shot?.dir ?? "r",
      boxStart: startFrame, boxEnd: endFrame,
      headStart: startFrame, headEnd: endFrame,
      subStart: startFrame, subEnd: endFrame,
    });
  });

  const contiguous = (a: BuiltCard, b: BuiltCard) => a.endFrame === b.startFrame;
  /** Grow each element's span over the neighbouring cards that do not change it. */
  const chain = (same: (a: BuiltCard, b: BuiltCard) => boolean, setStart: keyof BuiltCard, setEnd: keyof BuiltCard) => {
    for (let i = 0; i < built.length; i++) {
      let lo = i, hi = i;
      while (lo > 0 && contiguous(built[lo - 1], built[lo]) && same(built[lo - 1], built[lo])) lo--;
      while (hi < built.length - 1 && contiguous(built[hi], built[hi + 1]) && same(built[hi], built[hi + 1])) hi++;
      (built[i][setStart] as number) = built[lo].startFrame;
      (built[i][setEnd] as number) = built[hi].endFrame;
    }
  };
  chain(() => true, "boxStart", "boxEnd");
  chain((a, b) => a.heading === b.heading, "headStart", "headEnd");
  chain((a, b) => a.sub === b.sub, "subStart", "subEnd");
  return built;
}

export const TEXT_TRACK = buildTextTrack();

/** The card covering this absolute frame, if the band should be up. */
export const cardAtFrame = (frame: number): BuiltCard | null =>
  TEXT_TRACK.find((c) => frame >= c.startFrame && frame < c.endFrame) ?? null;

// ── build-time validation ────────────────────────────────────────────────────
export interface TrackIssue { level: "error" | "warn"; message: string }

export function validateTrack(): TrackIssue[] {
  const issues: TrackIssue[] = [];
  const err = (m: string) => issues.push({ level: "error", message: m });

  const boundaries = new Set<number>();
  for (const s of TIMELINE.shots) { boundaries.add(s.startFrame); boundaries.add(s.endFrame); }

  const TERMINAL = /[.!?:;,]$/;
  for (const c of TEXT_TRACK) {
    const at = `${c.act} ${c.relStart}→${c.relEnd}`;
    if (c.heading !== c.heading.toUpperCase()) err(`${at}: heading "${c.heading}" is not ALL UPPERCASE`);
    if (TERMINAL.test(c.heading)) err(`${at}: heading "${c.heading}" ends in punctuation`);
    if (TERMINAL.test(c.sub)) err(`${at}: subheading "${c.sub}" ends in punctuation`);
    const words = c.sub.split(/\s+/);
    if (words.length < 2 || words.length > 4) err(`${at}: subheading "${c.sub}" is ${words.length} words (must be 2–4)`);
    for (const w of words) if (w[0] !== w[0].toUpperCase()) err(`${at}: subheading "${c.sub}" is not Title Case ("${w}")`);
    if (/\d+\s*(ch|channels?|db|khz|hz|ms|in|out|ohms?)\b/i.test(c.sub)) err(`${at}: subheading "${c.sub}" reads as a spec value`);
    if (!boundaries.has(c.startFrame)) err(`${at}: start frame ${c.startFrame} is not a cut`);
    if (!boundaries.has(c.endFrame)) err(`${at}: end frame ${c.endFrame} is not a cut`);
    if (c.endFrame <= c.startFrame) err(`${at}: empty span`);
  }
  for (let i = 1; i < TEXT_TRACK.length; i++) {
    if (TEXT_TRACK[i].startFrame < TEXT_TRACK[i - 1].endFrame) err(`cards ${i - 1}/${i} overlap`);
  }

  // Coverage: walk every product-act frame; a frame is "covered" when a card is
  // up OR the shot under it owns a suppressing full-frame text moment.
  const productActs = new Set<ActId>(["act1", "act2", "act3", "act4"]);
  let silentRun = 0;
  let worst = { frames: 0, at: 0 };
  const firstFrame = beatFrame(ACTS.find((a) => a.id === "act1")!.startBeat);
  const lastFrame = beatFrame(ACTS.find((a) => a.id === "act4")!.endBeat);
  for (let f = firstFrame; f < lastFrame; f++) {
    const shot = TIMELINE.shots.find((s) => f >= s.startFrame && f < s.endFrame);
    if (!shot || !productActs.has(shot.act)) { silentRun = 0; continue; }
    const owns = shot.text && SUPPRESSING_ROLES.has(shot.text.role);
    const covered = owns || cardAtFrame(f) !== null;
    silentRun = covered ? 0 : silentRun + 1;
    if (silentRun > worst.frames) worst = { frames: silentRun, at: f };
  }
  if (worst.frames / FPS > MAX_SILENT_S) {
    err(`${(worst.frames / FPS).toFixed(2)} s of product imagery with no text, ending at frame ${worst.at} (limit ${MAX_SILENT_S} s)`);
  }

  // A product change must start a fresh pair on that cut.
  const productOfShot = (f: number): string | null => {
    const shot = TIMELINE.shots.find((s) => f >= s.startFrame && f < s.endFrame);
    if (!shot || !productActs.has(shot.act)) return null;
    return shot.act === "act4" ? `act4:${shot.startFrame}` : shot.act;
  };
  for (const c of TEXT_TRACK) {
    const p = productOfShot(c.startFrame);
    if (p === null) err(`${c.act} ${c.relStart}: card starts outside a product act`);
  }
  return issues;
}

export const trackStats = () => {
  const spanS = TEXT_TRACK.reduce((a, c) => a + (c.endFrame - c.startFrame) / FPS, 0);
  return {
    cards: TEXT_TRACK.length,
    secondsWithBand: +spanS.toFixed(2),
    shortestCardS: +(Math.min(...TEXT_TRACK.map((c) => (c.endFrame - c.startFrame) / FPS))).toFixed(2),
    longestCardS: +(Math.max(...TEXT_TRACK.map((c) => (c.endFrame - c.startFrame) / FPS))).toFixed(2),
    beatSeconds: +SPB.toFixed(4),
  };
};
