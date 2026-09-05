// ─────────────────────────────────────────────────────────────────────────────
// SHOT LIST — the whole 90 seconds as one continuous timeline (brief §3, §5,
// §7, §8). Every shot lands on a beat of the master grid; durations are in
// beats (½-beat minimum, used only in stutter bursts). Shots are sequenced for
// rhythm, not file order: angle types are interleaved so no two consecutive
// frames read as the same picture.
//
// Pure TypeScript — imported by the Remotion composition AND by
// scripts/make-audio.mjs (SFX placement) and scripts/coverage.mjs.
// ─────────────────────────────────────────────────────────────────────────────
import { ACTS, beatFrame, type ActId } from "./grid.ts";

/** Transition INTO a shot (brief §5, six types; consecutive cuts never repeat one). */
export type Transition = "hard" | "glitch" | "whip" | "line" | "punch" | "flash";
export type ShotKind =
  | "cold"   // Act 0 typography + pulse
  | "hero"   // one full-frame product image, held
  | "single" // one image, rapid-fire
  | "stack"  // 2–3 images stacked vertically, staggered entry
  | "strip"  // 3–4 small graphics in a row
  | "grid"   // 4 images in a 2×2 callback grid
  | "close"  // act close: serif mood word, flat ground, optional small inset
  | "brand"; // Act V lockup
export type Dir = "l" | "r" | "u" | "d";
export interface ShotText {
  /** title = product-name card (grotesk/display + Tinos subtitle), word = Alfa Slab hero word,
   *  mood = serif contrast voice, label = small grotesk reference line, script = Caveat tagline */
  role: "title" | "word" | "mood" | "label" | "script";
  value: string;
  sub?: string;
  /** which display face carries a title/word: "display" = Alfa Slab One, "grotesk" = Telegraf/Bricolage */
  face?: "display" | "grotesk";
}
export interface Shot {
  act: ActId;
  /** beat offset from the act start */
  rel: number;
  dur: number;
  kind: ShotKind;
  images: string[];
  enter: Transition;
  text?: ShotText;
  /** index into the act palette's bg[] */
  bg?: number;
  dir?: Dir;
}
export interface BuiltShot extends Shot {
  index: number;
  beat: number;
  startFrame: number;
  endFrame: number;
  /** frames the incoming transition begins BEFORE the landing beat */
  lead: number;
  /** transition of the shot that follows (what this shot exits into) */
  exit: Transition | null;
  exitLead: number;
  actOpen: boolean;
}
export interface Cut { beat: number; frame: number; transition: Transition; act: ActId; actOpen: boolean; kind: ShotKind }

/** Frames of motion before the landing beat, per transition type. */
export const LEAD: Record<Transition, number> = { hard: 0, glitch: 3, whip: 10, line: 14, punch: 8, flash: 2 };
/** Frames the effect continues AFTER the landing beat (glitch straddles, flash holds). */
export const TAIL: Record<Transition, number> = { hard: 0, glitch: 3, whip: 0, line: 0, punch: 0, flash: 2 };

const S = (rel: number, dur: number, kind: ShotKind, images: string[], enter: Transition, extra: Partial<Shot> = {}): Omit<Shot, "act"> =>
  ({ rel, dur, kind, images, enter, ...extra });
const title = (value: string, sub: string, face: "display" | "grotesk" = "grotesk"): ShotText => ({ role: "title", value, sub, face });
const word = (value: string): ShotText => ({ role: "word", value, face: "display" });
const label = (value: string): ShotText => ({ role: "label", value });
const mood = (value: string): ShotText => ({ role: "mood", value });

const SUB = "AVB audio interface";

// ── Act 0 — cold open (9 beats) ──────────────────────────────────────────────
const ACT0: Omit<Shot, "act">[] = [
  S(0, 9, "cold", [], "hard", { text: { role: "word", value: "SIGNAL", sub: "the MOTU AVB ecosystem", face: "display" } }),
];

// ── Act I — MOTU 16A (32 beats, 40 images incl. the network diagram held for Act IV) ──
const ACT1: Omit<Shot, "act">[] = [
  S(0, 3, "hero", ["motu-16a-new.jpg"], "line", { text: title("MOTU 16A", SUB), dir: "r", bg: 0 }),
  S(3, 2, "hero", ["motu-16a-new-3.png"], "punch", { bg: 1 }),
  S(5, 1, "single", ["motu-16a-13.png"], "hard", { bg: 0 }),
  S(6, 1, "single", ["motu-16a-new-1.png"], "whip", { dir: "l", bg: 1 }),
  S(7, 1, "single", ["motu-16a-24.jpg"], "hard", { text: label("MOTU 16A") }),
  S(8, 1, "single", ["motu-16a-28.jpg"], "punch"),
  S(9, 1, "single", ["motu-16a-8.png"], "glitch", { bg: 0 }),
  S(10, 2, "stack", ["motu-16a-9.jpg", "motu-16a-6.jpg", "motu-16a-10.jpg"], "line", { dir: "d", text: label("CueMix Pro"), bg: 1 }),
  S(12, 1, "single", ["motu-16a-18.jpg"], "punch"),
  S(13, 1, "single", ["motu-16a-1.jpg"], "whip", { dir: "r" }),
  S(14, 1, "single", ["motu-16a-12.jpg"], "hard"),
  S(15, 1, "single", ["motu-16a-2.jpg"], "flash", { bg: 0 }),
  S(16, 2, "stack", ["motu-16a-7.jpg", "motu-16a-15.jpg", "motu-16a-13.jpg"], "glitch", { text: label("channel strip"), bg: 0 }),
  S(18, 1, "single", ["motu-16a-new-4.png"], "flash", { bg: 1 }),
  S(19, 1, "single", ["motu-16a-new-2.png"], "whip", { dir: "l", bg: 0 }),
  S(20, 1.5, "stack", ["motu-16a-10.png", "motu-16a-11.png", "motu-16a-12.png"], "hard", { text: word("16A"), bg: 1 }),
  S(21.5, 1.5, "stack", ["motu-16a-9.png", "motu-16a-4.png"], "line", { dir: "r", bg: 0 }),
  S(23, 1.5, "stack", ["motu-16a-16.jpg", "motu-16a-17.jpg", "motu-16a-2.png"], "whip", { dir: "u", text: label("patch bay"), bg: 1 }),
  S(24.5, 1, "single", ["motu-16a-21.jpg"], "hard"),
  S(25.5, 0.5, "single", ["motu-16a-23.jpg"], "punch"),
  S(26, 1, "single", ["motu-16a-25.jpg"], "whip", { dir: "r" }),
  S(27, 1, "stack", ["motu-16a-14.jpg", "motu-16a-11.jpg", "motu-16a-3.png"], "glitch", { bg: 0, text: label("MOTU 16A") }),
  S(28, 1, "stack", ["motu-16a-26.jpg", "motu-16a-19.jpg"], "line", { dir: "d", bg: 1 }),
  S(29, 1, "strip", ["motu-16a-1.png", "motu-16a-6.png", "motu-16a-5.png"], "hard", { bg: 0 }),
  S(30, 2, "close", ["motu-16a-7.png"], "punch", { text: mood("precision"), bg: 1 }),
];

// ── Act II — MOTU 848 (32 beats, 31 images + the shared A/B/C detail) ────────
const ACT2: Omit<Shot, "act">[] = [
  S(0, 2, "hero", ["motu-848-new-1.png"], "line", { text: title("MOTU 848", SUB), dir: "d" }),
  S(2, 2, "hero", ["motu-848-new-1.jpg"], "punch"),
  S(4, 1, "single", ["motu-848-23.jpg"], "hard"),
  S(5, 1, "single", ["motu-848-20.jpg"], "flash"),
  S(6, 1, "single", ["motu-848-15.jpg"], "whip", { dir: "r" }),
  S(7, 1, "single", ["motu-848-4.jpg"], "hard", { text: label("MOTU 848") }),
  S(8, 2, "stack", ["motu-848-9.png", "motu-848-24.jpg", "motu-848-1.jpg"], "line", { dir: "r", text: label("control room") }),
  S(10, 1, "single", ["motu-848-new-3.png"], "flash"),
  S(11, 1, "single", ["motu-848-12.png"], "whip", { dir: "l" }),
  S(12, 1, "single", ["motu-848-18.jpg"], "hard"),
  S(13, 1, "single", ["motu-848-16.jpg"], "punch"),
  S(14, 2, "stack", ["motu-848-26.jpg", "motu-848-3.jpg"], "glitch", { text: label("patch bay") }),
  S(16, 1.5, "stack", ["motu-848-11.png"], "punch", { text: word("848") }),
  S(17.5, 1, "single", ["motu-848-new-4.png"], "whip", { dir: "u" }),
  S(18.5, 1, "single", ["motu-848-17.jpg"], "hard"),
  S(19.5, 0.5, "single", ["motu-848-22.jpg"], "glitch"),
  S(20, 1, "single", ["motu-848-25.jpg"], "hard"),
  S(21, 1, "single", ["motu-10pre-20.jpg"], "punch"),
  S(22, 2, "stack", ["motu-848-2.png", "motu-848-5.jpg", "motu-848-10.jpg"], "line", { dir: "d", text: label("sound library") }),
  S(24, 1, "strip", ["motu-848-11.jpg", "motu-848-13.jpg", "motu-848-3.png"], "hard", { text: label("MOTU 848") }),
  S(25, 1, "single", ["motu-848-new-2.png"], "whip", { dir: "r" }),
  S(26, 1, "strip", ["motu-848-6.png", "motu-848-7.png", "motu-848-8.png"], "glitch"),
  S(27, 1, "single", ["motu-848-1.png"], "hard"),
  S(28, 4, "close", [], "punch", { text: mood("presence") }),
];

// ── Act III — MOTU 10pre (32 beats, 38 images; fastest cut rate) ─────────────
const ACT3: Omit<Shot, "act">[] = [
  S(0, 2, "hero", ["motu-10pre-new.jpg"], "glitch", { text: title("MOTU 10pre", SUB) }),
  S(2, 1, "hero", ["motu-10pre-new-3.png"], "line", { dir: "r" }),
  S(3, 1, "single", ["motu-10pre-new.png"], "whip", { dir: "l" }),
  S(4, 0.5, "single", ["motu-10pre-13.jpg"], "hard"),
  S(4.5, 0.5, "single", ["motu-10pre-11.jpg"], "punch"),
  S(5, 1, "single", ["motu-10pre-29.jpg"], "hard"),
  S(6, 1, "single", ["motu-10pre-12.jpg"], "punch"),
  S(7, 1, "single", ["motu-10pre-new-1.png"], "whip", { dir: "r", text: label("MOTU 10pre") }),
  S(8, 2, "stack", ["motu-10pre-6.jpg", "motu-10pre-5.jpg", "motu-10pre-7.jpg"], "line", { dir: "d", text: label("CueMix Pro") }),
  S(10, 1, "single", ["motu-10pre-14.png"], "flash"),
  S(11, 1, "single", ["motu-10pre-24.jpg"], "hard"),
  S(12, 1, "single", ["motu-10pre-14.jpg"], "glitch"),
  S(13, 1, "single", ["motu-10pre-16.jpg"], "punch"),
  S(14, 1.5, "stack", ["motu-10pre-4.png", "motu-10pre-10.png"], "hard", { text: word("10pre") }),
  S(15.5, 1, "single", ["motu-10pre-8.png"], "whip", { dir: "u" }),
  S(16.5, 0.5, "single", ["motu-10pre-2.jpg"], "hard"),
  S(17, 0.5, "single", ["motu-10pre-22.jpg"], "flash"),
  S(17.5, 0.5, "single", ["motu-10pre-18.jpg"], "hard"),
  S(18, 1, "single", ["motu-10pre-17.jpg"], "glitch"),
  S(19, 1, "single", ["motu-10pre-new-2.png"], "whip", { dir: "l" }),
  S(20, 2, "stack", ["motu-10pre-3.jpg", "motu-10pre-4.jpg", "motu-10pre-8.jpg"], "line", { dir: "r", text: label("channel strip") }),
  S(22, 1, "single", ["motu-10pre-1.jpg"], "punch"),
  S(23, 1, "single", ["motu-10pre-13.png"], "hard"),
  S(24, 1, "single", ["motu-10pre-15.jpg"], "flash", { text: label("MOTU 10pre") }),
  S(25, 1.5, "stack", ["motu-10pre-10.jpg", "motu-10pre-21.jpg", "motu-10pre-9.jpg"], "glitch", { text: label("patch bay") }),
  S(26.5, 1.5, "stack", ["motu-10pre-1.png", "motu-10pre-27.jpg"], "line", { dir: "d" }),
  S(28, 1, "strip", ["motu-10pre-26.jpg", "motu-10pre-28.jpg", "motu-10pre-12.png"], "hard"),
  S(29, 1, "single", ["motu-10pre-11.png"], "whip", { dir: "r" }),
  S(30, 2, "close", [], "punch", { text: mood("momentum") }),
];

// ── Act IV — AVB Switch / ecosystem payoff (20 beats) ────────────────────────
const ACT4: Omit<Shot, "act">[] = [
  S(0, 1, "single", ["motu-16a-new.jpg"], "flash", { bg: 0, text: label("16A") }),
  S(1, 1, "single", ["motu-848-new-1.jpg"], "glitch", { bg: 1, text: label("848") }),
  S(2, 1, "single", ["motu-10pre-new.jpg"], "flash", { bg: 2, text: label("10pre") }),
  S(3, 1, "single", ["motu-16a-5.jpg"], "glitch", { bg: 0 }),
  S(4, 2, "hero", ["motu-avb-switch-2.jpg"], "line", { dir: "r", bg: 1, text: title("AVB SWITCH", "everything talks to everything", "display") }),
  S(6, 1, "single", ["motu-avb-switch-3.jpg"], "punch", { bg: 2 }),
  S(7, 1, "single", ["motu-avb-switch-1.jpg"], "whip", { dir: "l", bg: 0 }),
  S(8, 2, "stack", ["motu-avb-switch-1.png", "motu-10pre-25.jpg"], "line", { dir: "d", bg: 1, text: label("one network") }),
  S(10, 1, "single", ["motu-avb-switch-3.png"], "whip", { dir: "r", bg: 2 }),
  S(11, 1, "strip", ["motu-avb-switch-2.png", "motu-avb-switch-4.jpg", "motu-avb-switch-5.png", "motu-avb-switch-4.png"], "hard", { bg: 0 }),
  S(12, 2, "grid", ["motu-16a-new-1.png", "motu-848-new-3.png", "motu-10pre-new-1.png", "motu-avb-switch-2.jpg"], "glitch", { bg: 0, text: word("ONE NETWORK") }),
  S(14, 2, "stack", ["motu-16a-13.png", "motu-848-12.png", "motu-10pre-8.png"], "line", { dir: "d", bg: 1, text: label("in sync") }),
  S(16, 2, "hero", ["motu-avb-switch-1.jpg"], "punch", { bg: 2, text: word("ONE CLOCK") }),
  S(18, 2, "grid", ["motu-16a-new-4.png", "motu-848-new-4.png", "motu-10pre-new.png", "motu-avb-switch-1.png"], "flash", { bg: 0, text: label("the MOTU AVB ecosystem") }),
];

// ── Act V — branding close (9 beats) ─────────────────────────────────────────
const ACT5: Omit<Shot, "act">[] = [
  S(0, 9, "brand", [], "hard", { text: { role: "script", value: "in perfect sync" } }),
];

const RAW: Record<ActId, Omit<Shot, "act">[]> = { act0: ACT0, act1: ACT1, act2: ACT2, act3: ACT3, act4: ACT4, act5: ACT5 };

export function buildTimeline(): { shots: BuiltShot[]; cuts: Cut[] } {
  const shots: BuiltShot[] = [];
  for (const act of ACTS) {
    const list = RAW[act.id];
    let expect = 0;
    list.forEach((s, i) => {
      if (Math.abs(s.rel - expect) > 1e-9) throw new Error(`${act.id} shot ${i}: rel ${s.rel} ≠ expected ${expect}`);
      expect += s.dur;
      const beat = act.startBeat + s.rel;
      shots.push({ ...s, act: act.id, index: shots.length, beat, startFrame: beatFrame(beat), endFrame: beatFrame(beat + s.dur), lead: LEAD[s.enter], exit: null, exitLead: 0, actOpen: i === 0 });
    });
    if (Math.abs(expect - (act.endBeat - act.startBeat)) > 1e-9) throw new Error(`${act.id}: shots total ${expect} beats, act is ${act.endBeat - act.startBeat}`);
  }
  shots.forEach((s, i) => { const n = shots[i + 1]; if (n) { s.exit = n.enter; s.exitLead = n.lead; } });
  // no two consecutive cuts use the same transition (brief §5)
  for (let i = 1; i < shots.length; i++) {
    const a = shots[i - 1], b = shots[i];
    if (a.enter === b.enter && a.kind !== "cold" && b.kind !== "brand") throw new Error(`consecutive identical transition "${b.enter}" at ${b.act} rel ${b.rel} (prev ${a.act} rel ${a.rel})`);
  }
  const cuts: Cut[] = shots.map((s) => ({ beat: s.beat, frame: s.startFrame, transition: s.enter, act: s.act, actOpen: s.actOpen, kind: s.kind }));
  return { shots, cuts };
}

export const TIMELINE = buildTimeline();
