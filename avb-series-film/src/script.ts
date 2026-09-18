// ─────────────────────────────────────────────────────────────────────────────
// THE SPEECH SCRIPTS — single source of truth for both deliverables.
//
// One file produces BOTH the timestamped read-aloud script the client records
// and every on-screen caption, so the two cannot drift apart.
//
// Written at 165 wpm with beats and segment gaps, which lands the effective
// rate at ~152–154 wpm — the pace the client found easy to read and sync on the
// M-Series reel. Every number is a numeral, never a word, by instruction.
// No pricing anywhere. No competitor named or implied.
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductKey } from "./theme.ts";

/** Words per minute each script is written to. The film carries fewer beats per
 *  word than the reel, so it is written a shade slower to land the same ~153 wpm
 *  effective narration rate the client found easy to read on the M-Series reel. */
export const REEL_WPM = 162;
export const FILM_WPM = 160;
/** @deprecated use REEL_WPM / FILM_WPM */
export const WPM = REEL_WPM;
/** Gap held after each segment so the reader can breathe and the edit can cut. */
export const SEGMENT_GAP = 0.4;
/** Extra beat after a caption that ends a thought. */
export const BEAT = 0.2;

export type Caption = {
  /** The phrase, exactly as spoken and exactly as captioned on screen. */
  t: string;
  /** The word the script face carries — the term the sentence turns on. */
  e: string;
  /** How many words this really is when read aloud (numerals expand). */
  sw?: number;
  /** Hold an extra beat after this caption. */
  beat?: boolean;
};

export type Segment = {
  id: string;
  product: ProductKey;
  label: string;
  /** Chapter title shown during the segment's un-narrated hold (film only). */
  chapter?: string;
  env: "light" | "dark";
  /** Seconds of picture-only hold BEFORE the first word (film only). */
  hold?: number;
  captions: Caption[];
};

// ═════════════════════════════════════════════════════════ THE 90 s REEL ══
export const REEL_SEGMENTS: Segment[] = [
  {
    id: "hook",
    product: "shared",
    label: "MOTU AVB Series",
    env: "dark",
    captions: [
      { t: "Your interface has 8 inputs.", e: "8", sw: 5 },
      { t: "The band needs 24.", e: "24", sw: 4 },
      { t: "The stage needs a snake.", e: "snake" },
      { t: "The mix room needs a patchbay.", e: "patchbay", beat: true },
      { t: "What if 1 cable did all of it?", e: "1 cable", sw: 8, beat: true },
    ],
  },
  {
    id: "platform",
    product: "shared",
    label: "One Engine",
    env: "dark",
    captions: [
      { t: "MOTU AVB.", e: "AVB", sw: 4 },
      { t: "3 interfaces. 1 switch.", e: "1 switch", sw: 4 },
      { t: "The same ESS Sabre32 engine.", e: "Sabre32", sw: 6 },
      { t: "125 dB of dynamic range.", e: "125 dB", sw: 8 },
      { t: "Under 2 ms, round trip.", e: "2 ms", sw: 6, beat: true },
      { t: "128 channels over 1 network cable.", e: "128", sw: 9, beat: true },
    ],
  },
  {
    id: "s16a",
    product: "p16a",
    label: "MOTU 16A",
    env: "light",
    captions: [
      { t: "The 16A.", e: "16A", sw: 4 },
      { t: "16 line inputs. 16 outputs.", e: "16", sw: 6 },
      { t: "No preamps. Your console already has them.", e: "console", sw: 7, beat: true },
      { t: "Every output is DC-coupled.", e: "DC-coupled", sw: 5 },
      { t: "So it drives a modular synth directly.", e: "modular", sw: 7, beat: true },
    ],
  },
  {
    id: "s848",
    product: "p848",
    label: "MOTU 848",
    env: "dark",
    captions: [
      { t: "The 848.", e: "848", sw: 5 },
      { t: "4 mic preamps. 8 line ins. 12 outs.", e: "4", sw: 9 },
      { t: "Talkback. A, B, C speaker select.", e: "Talkback", sw: 7 },
      { t: "2 headphone cues.", e: "2", sw: 3 },
      { t: "A podcast, a mix, a 7.1.4 room.", e: "7.1.4", sw: 11, beat: true },
    ],
  },
  {
    id: "s10pre",
    product: "p10pre",
    label: "MOTU 10pre",
    env: "light",
    captions: [
      { t: "The 10pre.", e: "10pre", sw: 3 },
      { t: "10 mic preamps. 8 rear, 2 front.", e: "10", sw: 8 },
      { t: "Minus 129 dBu of noise.", e: "129", sw: 8 },
      { t: "Track the whole band in 1 pass.", e: "whole band", sw: 7, beat: true },

    ],
  },
  {
    id: "sswitch",
    product: "pswitch",
    label: "MOTU AVB Switch",
    env: "dark",
    captions: [
      { t: "Then the AVB Switch.", e: "Switch", sw: 5 },
      { t: "1 CAT-6 run from the stage.", e: "CAT-6", sw: 8 },
      { t: "Up to 100 metres.", e: "100 metres", sw: 5 },
      { t: "Every device on 1 clock.", e: "1 clock", sw: 5, beat: true },
      { t: "Daisy-chain up to 8 units.", e: "8 units", sw: 6 },
      { t: "Add 1 when the room grows.", e: "grows", sw: 6, beat: true },
    ],
  },
  {
    id: "close",
    product: "shared",
    label: "MOTU AVB Series",
    env: "dark",
    captions: [
      { t: "1 engine. 1 software. 1 cable.", e: "1 cable", sw: 6, beat: true },
      { t: "CueMix Pro on every one of them.", e: "CueMix Pro", sw: 8, beat: true },
      { t: "MOTU AVB Series.", e: "AVB Series", sw: 5, beat: true },
    ],
  },
];

// ═══════════════════════════════════════════════════════ THE 5 min FILM ══
export const FILM_SEGMENTS: Segment[] = [
  {
    id: "hook",
    product: "shared",
    label: "MOTU AVB Series",
    chapter: "4 ROOMS · 1 ANSWER",
    env: "dark",
    hold: 3.0,
    captions: [
      { t: "Your interface has 8 inputs.", e: "8", sw: 5 },
      { t: "The band needs 24.", e: "24", sw: 4 },
      { t: "The stage needs a 30-metre snake.", e: "snake", sw: 7 },
      { t: "The mix room needs a patchbay.", e: "patchbay" },
      { t: "And the podcast needs talkback.", e: "talkback", beat: true },
      { t: "4 rooms. 4 problems.", e: "4 problems", sw: 4 },
      { t: "1 answer.", e: "1 answer", sw: 2, beat: true },
    ],
  },
  {
    id: "platform",
    product: "shared",
    label: "One Engine",
    chapter: "THE PLATFORM",
    env: "dark",
    hold: 4.0,
    captions: [
      { t: "MOTU AVB Series.", e: "AVB", sw: 5 },
      { t: "3 rack interfaces and 1 switch.", e: "1 switch", sw: 6 },
      { t: "Under the front panels, they are the same machine.", e: "same machine", sw: 9, beat: true },
      { t: "ESS Sabre32 Ultra conversion.", e: "Sabre32", sw: 6 },
      { t: "125 dB of dynamic range.", e: "125 dB", sw: 8 },
      { t: "Thunderbolt 4 and USB4. 40 gigabits.", e: "Thunderbolt 4", sw: 8 },
      { t: "256 channels to the computer.", e: "256", sw: 8 },
      { t: "Under 2 ms round trip.", e: "2 ms", sw: 6, beat: true },
      { t: "Word clock in and out. 44.1 to 192 kHz.", e: "192 kHz", sw: 11 },
      { t: "A 64-channel mixer runs in the hardware.", e: "64-channel", sw: 9 },
      { t: "26 aux buses.", e: "26", sw: 4 },
      { t: "EQ, compression, gate and reverb on every channel.", e: "every channel", sw: 9 },
      { t: "With the computer on or off.", e: "on or off", sw: 6, beat: true },
      { t: "128 channels over 1 network cable.", e: "128", sw: 9 },
      { t: "Milan certified, so it joins any AVB network.", e: "Milan", sw: 9, beat: true },
    ],
  },
  {
    id: "s16a",
    product: "p16a",
    label: "MOTU 16A",
    chapter: "THE MATRIX",
    env: "light",
    hold: 4.0,
    captions: [
      { t: "The 16A.", e: "16A", sw: 4 },
      { t: "16 balanced line inputs.", e: "16", sw: 6 },
      { t: "16 balanced line outputs.", e: "16", sw: 6 },
      { t: "2 optical banks. 32 in, 34 out.", e: "32", sw: 9, beat: true },
      { t: "No microphone preamps. On purpose.", e: "On purpose", sw: 6, beat: true },
      { t: "Your console has preamps.", e: "console", sw: 4 },
      { t: "Your outboard rack has preamps.", e: "outboard", sw: 5 },
      { t: "The 16A gives every one of them a channel.", e: "every one", sw: 10, beat: true },
      { t: "Wire it into the patchbay once.", e: "once", sw: 6 },
      { t: "2 colour displays meter all 32.", e: "2", sw: 8, beat: true },
      { t: "Rack it once. Meter everything from the front.", e: "once", sw: 8, beat: true },
      { t: "Every output is DC-coupled.", e: "DC-coupled", sw: 5 },
      { t: "So it sends control voltage into a modular synth.", e: "control voltage", sw: 9 },
      { t: "16 CV lanes from your DAW.", e: "16", sw: 7, beat: true },
      { t: "A synth studio. A mastering room. A broadcast truck.", e: "mastering", sw: 8, beat: true },
    ],
  },
  {
    id: "s848",
    product: "p848",
    label: "MOTU 848",
    chapter: "THE COMMAND CENTRE",
    env: "dark",
    hold: 4.0,
    captions: [
      { t: "The 848.", e: "848", sw: 5 },
      { t: "The command centre.", e: "command centre", sw: 3, beat: true },
      { t: "4 mic preamps with 74 dB of gain.", e: "4", sw: 10 },
      { t: "Each one takes a mic, a line or a guitar.", e: "guitar", sw: 10 },
      { t: "Minus 129 dBu of input noise.", e: "129", sw: 8 },
      { t: "Inserts on channels 3 and 4.", e: "Inserts", sw: 7, beat: true },
      { t: "8 more line inputs. 12 line outputs.", e: "12", sw: 9 },
      { t: "28 in, 32 out.", e: "28", sw: 6, beat: true },
      { t: "On the front: talkback.", e: "talkback", sw: 4 },
      { t: "A, B, C speaker select.", e: "A, B, C", sw: 6 },
      { t: "Talkback to the live room from the front panel.", e: "live room", sw: 9 },
      { t: "2 headphone outputs, each with its own cue.", e: "own cue", sw: 10, beat: true },
      { t: "A producer's desk in the morning.", e: "producer's", sw: 6 },
      { t: "A 4-mic podcast in the afternoon.", e: "4-mic", sw: 7 },
      { t: "And 12 outputs for a 7.1.4 Atmos room at night.", e: "7.1.4", sw: 13, beat: true },
      { t: "Same box.", e: "Same box", sw: 2, beat: true },
    ],
  },
  {
    id: "s10pre",
    product: "p10pre",
    label: "MOTU 10pre",
    chapter: "THE SOURCE",
    env: "light",
    hold: 4.0,
    captions: [
      { t: "The 10pre.", e: "10pre", sw: 3 },
      { t: "The source.", e: "source", sw: 2, beat: true },
      { t: "10 mic preamps.", e: "10", sw: 3 },
      { t: "8 on the rear, wired once.", e: "8", sw: 6 },
      { t: "2 on the front, for the guest who just walked in.", e: "2", sw: 11, beat: true },
      { t: "48 volts and a 20 dB pad on every channel.", e: "48 volts", sw: 12 },
      { t: "Inserts on 1 and 2.", e: "Inserts", sw: 5 },
      { t: "Minus 129 dBu of noise.", e: "129", sw: 7, beat: true },
      { t: "Set gain from the front panel or from the app.", e: "app", sw: 10 },
      { t: "Kick, snare, 3 toms, 2 overheads, bass, 2 guitars.", e: "3 toms", sw: 11 },
      { t: "The whole band. 1 pass.", e: "1 pass", sw: 5, beat: true },
      { t: "Or a choir on 8 mics, with 2 to spare.", e: "choir", sw: 10, beat: true },
      { t: "Every player mixes their own headphones on an iPad.", e: "own", sw: 9 },
      { t: "CueMix Pro. Over Wi-Fi.", e: "Wi-Fi", sw: 5, beat: true },
    ],
  },
  {
    id: "sswitch",
    product: "pswitch",
    label: "MOTU AVB Switch",
    chapter: "THE NETWORK",
    env: "dark",
    hold: 4.0,
    captions: [
      { t: "Now the cable.", e: "cable", sw: 3, beat: true },
      { t: "Every unit has 2 Gigabit AVB ports.", e: "2", sw: 8 },
      { t: "Daisy-chain up to 8 of them.", e: "8", sw: 7 },
      { t: "Or add the MOTU AVB Switch.", e: "AVB Switch", sw: 7, beat: true },
      { t: "5 AVB ports and 1 for the computer.", e: "5", sw: 9 },
      { t: "CAT-6 up to 100 metres.", e: "100 metres", sw: 7 },
      { t: "Every device locked to 1 clock.", e: "1 clock", sw: 6 },
      { t: "Accurate to the nanosecond.", e: "nanosecond", sw: 4, beat: true },
      { t: "Automatic device discovery. No IT department needed.", e: "No IT", sw: 8, beat: true },
      { t: "Bandwidth is reserved in hardware.", e: "reserved", sw: 5 },
      { t: "Office traffic on the same wire cannot touch it.", e: "cannot touch", sw: 9, beat: true },
      { t: "10pre on the stage. 16A at front of house.", e: "front of house", sw: 10 },
      { t: "1 cable between them.", e: "1 cable", sw: 4 },
      { t: "No snake. No hum. No dropouts.", e: "No", sw: 6, beat: true },
      { t: "Live room, control room, auditorium.", e: "auditorium", sw: 5 },
      { t: "Up to 128 channels from each unit.", e: "128", sw: 7 },
      { t: "Add a unit when the room grows.", e: "grows", sw: 7 },
      { t: "Nothing else changes.", e: "Nothing", sw: 3, beat: true },
    ],
  },
  {
    id: "software",
    product: "shared",
    label: "CueMix Pro",
    chapter: "ONE SOFTWARE",
    env: "dark",
    hold: 2.7,
    captions: [
      { t: "1 software for all 3.", e: "1 software", sw: 6 },
      { t: "CueMix Pro.", e: "CueMix Pro", sw: 3, beat: true },
      { t: "Mac, Windows, iPad and iPhone.", e: "iPad", sw: 5 },
      { t: "Every input, every output, every bus, on 1 screen.", e: "1 screen", sw: 10 },
      { t: "4-band EQ. Compressor. Gate. Reverb.", e: "4-band", sw: 7 },
      { t: "Talkback, monitor groups, a patchbay you route with a fingertip.", e: "fingertip", sw: 10, beat: true },
      { t: "Save the session. Walk away.", e: "Walk away", sw: 5 },
      { t: "The mixer keeps running in the hardware.", e: "keeps running", sw: 7, beat: true },
      { t: "Run it standalone. No computer in the rack at all.", e: "standalone", sw: 10, beat: true },
    ],
  },
  {
    id: "close",
    product: "shared",
    label: "MOTU AVB Series",
    chapter: "CHOOSE THE FRONT PANEL",
    env: "dark",
    hold: 2.0,
    captions: [
      { t: "Choose by the front panel.", e: "front panel", sw: 5 },
      { t: "16 line inputs. 4 preamps. Or 10.", e: "Or 10", sw: 8, beat: true },
      { t: "Keep the engine.", e: "engine", sw: 3 },
      { t: "Grow on 1 cable.", e: "1 cable", sw: 4, beat: true },
      { t: "MOTU AVB Series.", e: "AVB Series", sw: 5, beat: true },
      { t: "Exclusively from Shivansh Electronics, Kolkata.", e: "Shivansh Electronics", sw: 6 },
      { t: "For East and North East India.", e: "North East", sw: 6, beat: true },
    ],
  },
];

// ── Derived timing ───────────────────────────────────────────────────────────

export const spokenWords = (c: Caption): number =>
  c.sw ?? c.t.trim().split(/\s+/).length;

export type TimedCaption = Caption & { start: number; end: number; i: number };

export type TimedSegment = Omit<Segment, "captions"> & {
  /** Segment start, including any hold. */
  start: number;
  /** First word. */
  speakAt: number;
  end: number;
  words: number;
  captions: TimedCaption[];
};

/**
 * Lays every caption on an absolute timeline from its spoken length. No scene
 * duration is ever estimated — it is derived from how long the words take to
 * say, which is what keeps the edit honest to the recorded read.
 */
export const buildTimeline = (
  segs: Segment[],
  lead = 0,
  wpm = REEL_WPM,
): { segments: TimedSegment[]; total: number; words: number } => {
  let t = lead;
  let allWords = 0;
  const segments = segs.map((seg) => {
    const start = t;
    t += seg.hold ?? 0;
    const speakAt = t;
    let words = 0;
    const captions = seg.captions.map((c, i) => {
      const w = spokenWords(c);
      words += w;
      const dur = (w / wpm) * 60 + (c.beat ? BEAT : 0);
      const cap: TimedCaption = { ...c, i, start: t, end: t + dur };
      t += dur;
      return cap;
    });
    allWords += words;
    const end = t;
    t += SEGMENT_GAP;
    return { ...seg, start, speakAt, end, words, captions };
  });
  return { segments, total: t - SEGMENT_GAP, words: allWords };
};

/** The reel opens on the first word. */
export const REEL_TL = buildTimeline(REEL_SEGMENTS, 0, REEL_WPM);
export const FILM_TL = buildTimeline(FILM_SEGMENTS, 0, FILM_WPM);
