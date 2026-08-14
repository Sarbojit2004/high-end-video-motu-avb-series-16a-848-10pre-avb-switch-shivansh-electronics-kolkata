// PART 1 - "The Tracking Room" (MOTU 10pre)
// 2640 frames @ 30fps = 88.000s exactly.
//
// This file is the single source of truth for Part 1. Every visual beat is
// anchored to the voiceover segment it belongs to (audio-anchored timeline -
// see toolkit CLAUDE.md), so narration and picture change together and drift
// is structurally impossible rather than corrected after the fact.
//
// Tone: "Warm & Trustworthy / The Integrator's Perspective" (brief s9 opt.3).
// Planning pace: 2.2-2.5 words per second. Actual: 198 words / 88s = 2.25 w/s.

export type VoSegment = {
  id: string;
  label: string;
  /** spoken text for this beat */
  text: string;
  start: number;
  end: number;
  /** catalogue indices on screen during this segment */
  assets: number[];
};

export const SEGMENTS: VoSegment[] = [
  {
    id: 's1',
    label: 'Hook — one engine, three doors',
    text: 'Three MOTU interfaces. One identical engine. One identical price. The only thing that changes is the door you walk in through.',
    start: 0,
    end: 285,
    assets: [5],
  },
  {
    id: 's2',
    label: 'The shared engine',
    text: 'Every unit runs the same ESS Sabre32 Ultra conversion. The same forty-gigabit Thunderbolt 4. The same one-point-eight millisecond round trip. Nothing is held back.',
    start: 285,
    end: 615,
    assets: [33, 35, 19, 17, 6],
  },
  {
    id: 's3',
    label: 'Enter the 10pre',
    text: 'This is the 10pre. The tracking-room specialist, built for the moment a whole band plays at once.',
    start: 615,
    end: 870,
    assets: [26, 10],
  },
  {
    id: 's4',
    label: 'Ten microphone preamps',
    text: 'Ten microphone preamps. Seventy-four decibels of gain each, and one master clock across all of them. A full drum kit no longer runs you out of inputs.',
    start: 870,
    end: 1215,
    assets: [18, 8],
  },
  {
    id: 's5',
    label: 'Eight rear, two front',
    text: 'Eight live on the rear panel for your permanent snake. Two on the front, for whatever walks in.',
    start: 1215,
    end: 1470,
    assets: [13, 15],
  },
  {
    id: 's6',
    label: 'Hardware inserts, channels 1-2',
    text: 'Channels one and two carry hardware inserts. Your outboard compressor, patched in before conversion.',
    start: 1470,
    end: 1680,
    assets: [14, 2],
  },
  {
    id: 's7',
    label: 'Dual headphone outputs',
    text: 'Two independent headphone outputs. The drummer gets their cue mix. You keep your own.',
    start: 1680,
    end: 1875,
    assets: [36, 22, 25],
  },
  {
    id: 's8',
    label: 'One-decibel gain calibration',
    text: 'Gain steps in exact one-decibel increments, so your overhead pair matches, take after take.',
    start: 1875,
    end: 2070,
    assets: [7, 4, 3],
  },
  {
    id: 's9',
    label: 'CueMix Pro — the DSP mixer',
    text: 'All of it routed in CueMix Pro. Sixty-four channels of DSP mixing, with EQ, compression and reverb, running on the hardware, not on your CPU.',
    start: 2070,
    end: 2385,
    assets: [1, 12, 9, 11, 20, 21, 31],
  },
  {
    id: 's10',
    label: 'Continuation + branding',
    text: "One engine. The signal moves on. Available from Shivansh Electronics, MOTU's Authorized Distributor for East and North East India.",
    start: 2385,
    end: 2640,
    assets: [16, 24, 0, 23],
  },
];

export const PART1_ASSETS = SEGMENTS.flatMap((s) => s.assets);

/** words-per-second implied by each segment, for pacing QC */
export const pacing = () =>
  SEGMENTS.map((s) => {
    const words = s.text.trim().split(/\s+/).length;
    const secs = (s.end - s.start) / 30;
    return { id: s.id, words, secs: +secs.toFixed(2), wps: +(words / secs).toFixed(2) };
  });
