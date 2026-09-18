import { ASSETS, type Asset } from "./assets.ts";
import { HF_CLIPS, HF_STILLS, type HfClip, type HfStill } from "./higgsfield.ts";
import type { Canvas, ProductKey } from "./theme.ts";
import type { TimedCaption, TimedSegment } from "./script.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE SHOT PLANS — what is shown, and when. Stated by hand, caption by caption,
// because a rule can distribute images fairly but cannot know that "10 mic
// preamps. 8 rear, 2 front." has exactly one right picture (the 10pre's rear
// panel) and that "Track the whole band in 1 pass." wants the tracking-room
// B-roll and nothing else.
//
// Every shot is matched on a distinctive fragment of the caption it starts
// on. Captions without a pin keep the previous shot on screen, so a shot's
// length is derived from the script, never typed.
//
// SIX KINDS (see components/Staged.tsx):
//   still   a generated Higgsfield workflow scene
//   video   a generated Higgsfield B-roll clip, falling back to a still if the
//           clip has not been generated
//   bleed   a real product photograph, complete, over a wash of itself
//   panel   a real transparent panel plan, tracked laterally
//   split   two real photographs on a diagonal
//   mosaic  three to six real images drifting as one plane — how the software
//           screens are clubbed together
// ─────────────────────────────────────────────────────────────────────────────

export type ShotSpec =
  | { kind: "still"; id: string }
  | { kind: "video"; id: string; fallback: string }
  | { kind: "bleed"; slug: string }
  | { kind: "panel"; slug: string }
  | { kind: "split"; slugs: [string, string] }
  | { kind: "mosaic"; slugs: string[]; labels?: boolean };

export type Pin = { seg: string; find: string; shot: ShotSpec };

/** The four products, on white, directly comparable — the lineup mosaic. */
const LINEUP: ShotSpec = {
  kind: "mosaic",
  slugs: ["motu-16a-newly-added-jpg", "motu-848-newly-added-1-jpg", "motu-10pre-newly-added-jpg", "motu-avb-switch-1-jpg"],
  labels: true,
};
/** CueMix Pro, clubbed: mixer, EQ, dynamics, patchbay, routing, iPad. */
const SOFTWARE_A: ShotSpec = { kind: "mosaic", slugs: ["motu-16a-14-jpg", "motu-10pre-4-jpg", "motu-10pre-3-jpg", "motu-16a-6-jpg", "motu-10pre-21-jpg", "motu-10pre-24-jpg"] };
const SOFTWARE_B: ShotSpec = { kind: "mosaic", slugs: ["motu-848-24-jpg", "motu-16a-7-jpg", "motu-10pre-27-jpg", "motu-16a-10-jpg", "motu-10pre-5-jpg", "motu-16a-13-jpg"] };
const SOFTWARE_C: ShotSpec = { kind: "mosaic", slugs: ["motu-10pre-14-jpg", "motu-16a-16-jpg", "motu-10pre-8-jpg", "motu-848-26-jpg", "motu-16a-15-jpg", "motu-10pre-9-jpg"] };
const DAWS: ShotSpec = { kind: "mosaic", slugs: ["motu-16a-2-png", "motu-16a-3-png", "motu-848-3-jpg", "motu-16a-26-jpg", "motu-10pre-1-png", "motu-16a-19-jpg"] };
const BUNDLE: ShotSpec = { kind: "mosaic", slugs: ["motu-848-2-png", "motu-848-10-jpg", "motu-848-11-jpg", "motu-848-5-jpg", "motu-10pre-26-jpg", "motu-10pre-28-jpg"] };

const V = (id: string, fallback: string): ShotSpec => ({ kind: "video", id, fallback });
const S = (id: string): ShotSpec => ({ kind: "still", id });
const B = (slug: string): ShotSpec => ({ kind: "bleed", slug });
const P = (slug: string): ShotSpec => ({ kind: "panel", slug });
const X = (a: string, b: string): ShotSpec => ({ kind: "split", slugs: [a, b] });

// ═════════════════════════════════════════════════════════ THE 90 s REEL ══
export const REEL_PINS: Pin[] = [
  { seg: "hook", find: "Your interface has 8", shot: V("hero-rack", "hero-rack") },
  { seg: "hook", find: "The band needs 24", shot: S("10pre-tracking") },
  { seg: "hook", find: "The stage needs", shot: S("10pre-stage") },
  { seg: "hook", find: "The mix room", shot: S("16a-mixroom") },
  { seg: "hook", find: "What if 1 cable", shot: V("switch-foh", "switch-foh") },

  { seg: "platform", find: "MOTU AVB.", shot: LINEUP },
  { seg: "platform", find: "The same ESS", shot: P("motu-16a-newly-added-4-png") },
  { seg: "platform", find: "125 dB", shot: B("motu-848-newly-added-1-jpg") },
  { seg: "platform", find: "Under 2 ms", shot: B("motu-16a-18-jpg") },
  { seg: "platform", find: "128 channels", shot: B("motu-10pre-22-jpg") },

  { seg: "s16a", find: "The 16A.", shot: V("16a-mixroom", "16a-mixroom") },
  { seg: "s16a", find: "16 line inputs", shot: P("motu-16a-newly-added-1-png") },
  { seg: "s16a", find: "No preamps", shot: B("motu-16a-1-jpg") },
  { seg: "s16a", find: "Every output is DC", shot: B("motu-16a-24-jpg") },
  { seg: "s16a", find: "modular synth", shot: S("16a-modular") },

  { seg: "s848", find: "The 848.", shot: V("848-desk", "848-desk") },
  { seg: "s848", find: "4 mic preamps", shot: P("motu-848-newly-added-1-png") },
  { seg: "s848", find: "Talkback", shot: B("motu-10pre-20-jpg") },
  { seg: "s848", find: "2 headphone", shot: B("motu-848-15-jpg") },
  { seg: "s848", find: "A podcast", shot: S("848-podcast") },

  { seg: "s10pre", find: "The 10pre.", shot: V("10pre-tracking", "10pre-tracking") },
  { seg: "s10pre", find: "10 mic preamps", shot: P("motu-10pre-newly-added-1-png") },
  { seg: "s10pre", find: "Minus 129", shot: B("motu-10pre-13-jpg") },
  { seg: "s10pre", find: "Track the whole band", shot: S("10pre-tracking") },

  { seg: "sswitch", find: "Then the AVB Switch", shot: B("motu-avb-switch-1-jpg") },
  { seg: "sswitch", find: "1 CAT-6 run", shot: V("10pre-stage", "10pre-stage") },
  { seg: "sswitch", find: "Up to 100", shot: S("switch-foh") },
  { seg: "sswitch", find: "Every device on 1 clock", shot: B("motu-16a-5-jpg") },
  { seg: "sswitch", find: "Daisy-chain", shot: S("auditorium") },
  { seg: "sswitch", find: "Add 1 when", shot: V("hero-rack", "hero-rack") },

  { seg: "close", find: "1 engine.", shot: SOFTWARE_A },
  { seg: "close", find: "CueMix Pro on every", shot: SOFTWARE_B },
  { seg: "close", find: "MOTU AVB Series.", shot: LINEUP },
];

// ═══════════════════════════════════════════════════════ THE 5 min FILM ══
// `find: ""` pins the segment's picture-only hold before its first word.
export const FILM_PINS: Pin[] = [
  { seg: "hook", find: "", shot: V("hero-rack", "hero-rack") },
  { seg: "hook", find: "Your interface has 8", shot: B("motu-848-newly-added-1-jpg") },
  { seg: "hook", find: "The band needs 24", shot: S("10pre-tracking") },
  { seg: "hook", find: "The stage needs", shot: S("10pre-stage") },
  { seg: "hook", find: "The mix room", shot: S("16a-mixroom") },
  { seg: "hook", find: "And the podcast", shot: S("848-podcast") },
  { seg: "hook", find: "4 rooms.", shot: LINEUP },

  { seg: "platform", find: "", shot: V("switch-foh", "switch-foh") },
  { seg: "platform", find: "MOTU AVB Series.", shot: LINEUP },
  { seg: "platform", find: "Under the front panels", shot: P("motu-16a-newly-added-1-png") },
  { seg: "platform", find: "ESS Sabre32", shot: X("motu-10pre-26-jpg", "motu-10pre-28-jpg") },
  { seg: "platform", find: "125 dB", shot: B("motu-848-newly-added-1-jpg") },
  { seg: "platform", find: "Thunderbolt 4 and USB4", shot: B("motu-16a-23-jpg") },
  { seg: "platform", find: "256 channels", shot: B("motu-16a-18-jpg") },
  { seg: "platform", find: "Under 2 ms", shot: B("motu-848-22-jpg") },
  { seg: "platform", find: "Word clock", shot: B("motu-16a-28-jpg") },
  { seg: "platform", find: "A 64-channel mixer", shot: SOFTWARE_A },
  { seg: "platform", find: "EQ, compression", shot: SOFTWARE_B },
  { seg: "platform", find: "128 channels", shot: B("motu-10pre-22-jpg") },
  { seg: "platform", find: "Milan certified", shot: B("motu-848-13-jpg") },

  { seg: "s16a", find: "", shot: V("16a-mixroom", "16a-mixroom") },
  { seg: "s16a", find: "The 16A.", shot: B("motu-16a-newly-added-jpg") },
  { seg: "s16a", find: "16 balanced line inputs", shot: P("motu-16a-newly-added-1-png") },
  { seg: "s16a", find: "16 balanced line outputs", shot: B("motu-16a-24-jpg") },
  { seg: "s16a", find: "2 optical banks", shot: B("motu-16a-28-jpg") },
  { seg: "s16a", find: "No microphone preamps", shot: P("motu-16a-newly-added-4-png") },
  { seg: "s16a", find: "Your console has", shot: S("16a-mixroom") },
  { seg: "s16a", find: "The 16A gives every", shot: B("motu-16a-25-jpg") },
  { seg: "s16a", find: "Wire it into", shot: B("motu-16a-1-jpg") },
  { seg: "s16a", find: "2 colour displays", shot: P("motu-16a-newly-added-3-png") },
  { seg: "s16a", find: "Rack it once", shot: B("motu-16a-18-jpg") },
  { seg: "s16a", find: "Every output is DC", shot: V("16a-modular", "16a-modular") },
  { seg: "s16a", find: "16 CV lanes", shot: DAWS },
  { seg: "s16a", find: "A synth studio", shot: S("16a-modular") },

  { seg: "s848", find: "", shot: V("848-desk", "848-desk") },
  { seg: "s848", find: "The 848.", shot: B("motu-848-newly-added-1-jpg") },
  { seg: "s848", find: "4 mic preamps with", shot: B("motu-848-23-jpg") },
  { seg: "s848", find: "Each one takes", shot: P("motu-848-newly-added-1-png") },
  { seg: "s848", find: "Minus 129", shot: B("motu-848-20-jpg") },
  { seg: "s848", find: "8 more line inputs", shot: B("motu-848-16-jpg") },
  { seg: "s848", find: "28 in", shot: B("motu-848-18-jpg") },
  { seg: "s848", find: "On the front", shot: B("motu-10pre-20-jpg") },
  { seg: "s848", find: "A, B, C speaker", shot: B("motu-848-25-jpg") },
  { seg: "s848", find: "Talkback to the live", shot: P("motu-848-newly-added-4-png") },
  { seg: "s848", find: "2 headphone outputs", shot: B("motu-848-15-jpg") },
  { seg: "s848", find: "A producer's desk", shot: S("848-desk") },
  { seg: "s848", find: "A 4-mic podcast", shot: V("848-podcast", "848-podcast") },
  { seg: "s848", find: "And 12 outputs", shot: S("848-atmos") },
  { seg: "s848", find: "Same box.", shot: B("motu-848-4-jpg") },

  { seg: "s10pre", find: "", shot: V("10pre-tracking", "10pre-tracking") },
  { seg: "s10pre", find: "The 10pre.", shot: B("motu-10pre-newly-added-jpg") },
  { seg: "s10pre", find: "10 mic preamps.", shot: P("motu-10pre-newly-added-1-png") },
  { seg: "s10pre", find: "8 on the rear", shot: B("motu-10pre-13-jpg") },
  { seg: "s10pre", find: "2 on the front", shot: P("motu-10pre-newly-added-3-png") },
  { seg: "s10pre", find: "48 volts", shot: B("motu-10pre-11-jpg") },
  { seg: "s10pre", find: "Minus 129", shot: B("motu-10pre-12-jpg") },
  { seg: "s10pre", find: "Set gain", shot: B("motu-10pre-29-jpg") },
  { seg: "s10pre", find: "Kick, snare", shot: S("10pre-tracking") },
  { seg: "s10pre", find: "Or a choir", shot: S("auditorium") },
  { seg: "s10pre", find: "Every player mixes", shot: B("motu-10pre-24-jpg") },
  { seg: "s10pre", find: "CueMix Pro. Over", shot: B("motu-16a-7-jpg") },

  { seg: "sswitch", find: "", shot: V("10pre-stage", "10pre-stage") },
  { seg: "sswitch", find: "Now the cable", shot: B("motu-avb-switch-3-png") },
  { seg: "sswitch", find: "Every unit has 2", shot: B("motu-848-18-jpg") },
  { seg: "sswitch", find: "Daisy-chain", shot: B("motu-16a-5-jpg") },
  { seg: "sswitch", find: "Or add the MOTU AVB Switch", shot: B("motu-avb-switch-1-jpg") },
  { seg: "sswitch", find: "5 AVB ports", shot: B("motu-avb-switch-3-jpg") },
  { seg: "sswitch", find: "CAT-6 up to", shot: B("motu-avb-switch-2-jpg") },
  { seg: "sswitch", find: "Every device locked", shot: B("motu-avb-switch-1-png") },
  { seg: "sswitch", find: "Automatic device", shot: B("motu-10pre-25-jpg") },
  { seg: "sswitch", find: "Bandwidth is reserved", shot: B("motu-avb-switch-5-png") },
  { seg: "sswitch", find: "10pre on the stage", shot: S("10pre-stage") },
  { seg: "sswitch", find: "1 cable between", shot: V("switch-foh", "switch-foh") },
  { seg: "sswitch", find: "Live room, control room", shot: V("auditorium", "auditorium") },
  { seg: "sswitch", find: "Up to 128 channels", shot: B("motu-848-7-png") },
  { seg: "sswitch", find: "Add a unit", shot: V("hero-rack", "hero-rack") },

  { seg: "software", find: "", shot: SOFTWARE_A },
  { seg: "software", find: "1 software", shot: SOFTWARE_B },
  { seg: "software", find: "Mac, Windows", shot: B("motu-10pre-24-jpg") },
  { seg: "software", find: "Every input, every output", shot: B("motu-10pre-14-jpg") },
  { seg: "software", find: "4-band EQ", shot: SOFTWARE_C },
  { seg: "software", find: "Talkback, monitor groups", shot: B("motu-10pre-21-jpg") },
  { seg: "software", find: "Save the session", shot: BUNDLE },
  { seg: "software", find: "Run it standalone", shot: B("motu-848-1-jpg") },

  { seg: "close", find: "", shot: LINEUP },
  { seg: "close", find: "Choose by the front panel", shot: LINEUP },
  { seg: "close", find: "Keep the engine", shot: V("hero-rack", "hero-rack") },
  { seg: "close", find: "MOTU AVB Series.", shot: S("hero-rack") },
  { seg: "close", find: "Exclusively from", shot: S("auditorium") },
];

// ── Resolution ───────────────────────────────────────────────────────────────

export type Resolved =
  | { kind: "still"; still: HfStill }
  | { kind: "video"; clip: HfClip }
  | { kind: "bleed"; asset: Asset }
  | { kind: "panel"; asset: Asset }
  | { kind: "split"; assets: [Asset, Asset] }
  | { kind: "mosaic"; assets: Asset[]; labels?: boolean };

export type Shot = {
  segment: string;
  product: ProductKey;
  env: "light" | "dark";
  start: number;
  end: number;
  seed: number;
  res: Resolved;
  /** The caption this shot starts on, if any. */
  caption?: TimedCaption;
};

const asset = (slug: string): Asset => {
  const a = ASSETS.find((x) => x.slug === slug);
  if (!a) throw new Error(`[shots] unknown asset slug: ${slug}`);
  return a;
};

/** A 9:16 native variant, when one was generated, for the portrait reel. */
const stillFor = (id: string, canvas: Canvas): HfStill => {
  if (canvas.portrait) {
    const v = HF_STILLS.find((s) => s.id === `${id}-9x16`);
    if (v) return v;
  }
  const s = HF_STILLS.find((x) => x.id === id);
  if (!s) throw new Error(`[shots] unknown Higgsfield still: ${id}`);
  return s;
};

const clipFor = (id: string, canvas: Canvas): HfClip | undefined => {
  if (canvas.portrait) {
    const v = HF_CLIPS.find((c) => c.id === `${id}-9x16`);
    if (v) return v;
  }
  return HF_CLIPS.find((c) => c.id === id);
};

export const resolve = (spec: ShotSpec, canvas: Canvas): Resolved => {
  switch (spec.kind) {
    case "still":
      return { kind: "still", still: stillFor(spec.id, canvas) };
    case "video": {
      const c = clipFor(spec.id, canvas);
      return c ? { kind: "video", clip: c } : { kind: "still", still: stillFor(spec.fallback, canvas) };
    }
    case "bleed":
      return { kind: "bleed", asset: asset(spec.slug) };
    case "panel":
      return { kind: "panel", asset: asset(spec.slug) };
    case "split":
      return { kind: "split", assets: [asset(spec.slugs[0]), asset(spec.slugs[1])] };
    case "mosaic":
      return { kind: "mosaic", assets: spec.slugs.map(asset), labels: spec.labels };
  }
};

/**
 * Lays the pins on the timeline. A pin starts a shot at its caption's start
 * (or at the segment's hold); the shot runs until the next pin. Unmatched pins
 * are reported loudly rather than silently dropped.
 */
export const buildShots = (segments: TimedSegment[], pins: Pin[], canvas: Canvas, outroAt: number): Shot[] => {
  const shots: Shot[] = [];
  let seed = 1;
  for (const seg of segments) {
    const segPins = pins.filter((p) => p.seg === seg.id);
    for (const pin of segPins) {
      let start: number;
      let cap: TimedCaption | undefined;
      if (pin.find === "") {
        start = seg.start;
      } else {
        cap = seg.captions.find((c) => c.t.startsWith(pin.find) || c.t.includes(pin.find));
        if (!cap) {
          console.warn(`[shots] unresolved pin in ${seg.id}: "${pin.find}"`);
          continue;
        }
        start = cap.start;
      }
      shots.push({
        segment: seg.id,
        product: seg.product,
        env: seg.env,
        start,
        end: 0,
        seed: seed++,
        res: resolve(pin.shot, canvas),
        caption: cap,
      });
    }
  }
  shots.sort((a, b) => a.start - b.start);
  for (let i = 0; i < shots.length; i++) shots[i].end = shots[i + 1] ? shots[i + 1].start : outroAt + 0.7;
  return shots;
};

/** Every distinct real image the plan puts on screen — for the coverage ledger. */
export const coveredSlugs = (pins: Pin[]): Set<string> => {
  const out = new Set<string>();
  for (const p of pins) {
    const s = p.shot;
    if (s.kind === "bleed" || s.kind === "panel") out.add(s.slug);
    if (s.kind === "split" || s.kind === "mosaic") for (const x of s.slugs) out.add(x);
  }
  return out;
};
