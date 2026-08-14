// PART 3 - "The Control Room" (MOTU 848)
// 2640 frames @ 30fps = 88.000s exactly.
//
// The signal's final stop. Per the brief's Timing Allocation Logic this
// segment gets deliberate, unhurried time to explain the twelve outputs and
// why they map exactly onto a 7.1.4 Dolby Atmos array - the most complex,
// highest-value workflow concept in the series.
//
// This part carries the full CTA: it is the close of the whole three-part
// series, so there is no continuation line.
//
// Tone: "Cinematic & Aspirational" (brief s9 opt.2).

export type VoSegment = {
  id: string;
  label: string;
  text: string;
  start: number;
  end: number;
  assets: number[];
};

export const SEGMENTS: VoSegment[] = [
  {
    id: 's1',
    label: 'Hook — where the mix is heard',
    text: 'The signal has been captured, and routed. This is where it is finally heard.',
    start: 0,
    end: 205,
    assets: [86],
  },
  {
    id: 's2',
    label: 'Twelve outputs → 7.1.4',
    text: 'Twelve balanced analog outputs. Not eleven, not sixteen. Exactly the count a seven-one-four Dolby Atmos array needs, from one clock source.',
    start: 205,
    end: 512,
    assets: [90, 87, 92],
  },
  {
    id: 's3',
    label: 'One clock, no aggregation',
    text: 'No aggregated devices. No second interface fighting for sync. No phase smearing across the speaker array.',
    start: 512,
    end: 746,
    assets: [72, 91, 81],
  },
  {
    id: 's4',
    label: 'Four combo inputs',
    text: 'Four combo inputs handle the everyday work: a vocal overdub, a bass direct, a stereo synth. Seventy-four decibels of gain when you need it.',
    start: 746,
    end: 1081,
    assets: [95, 83, 74],
  },
  {
    id: 's5',
    label: 'Inserts on channels 3-4',
    text: 'Channels three and four carry dedicated analog inserts, so your favourite vocal compressor stays patched into the path.',
    start: 1081,
    end: 1338,
    assets: [93, 80],
  },
  {
    id: 's6',
    label: 'Monitor control: A/B/C + talkback',
    text: 'Hardware A, B and C speaker switching. Talkback. Two independent headphone outputs with programmable sources.',
    start: 1338,
    end: 1558,
    assets: [27, 89, 97],
  },
  {
    id: 's7',
    label: 'The renderer, routed',
    text: 'CueMix Pro maps the renderer output straight onto the physical array, point to point, with metering on every leg.',
    start: 1558,
    end: 1829,
    assets: [98, 28, 76, 94, 78],
  },
  {
    id: 's8',
    label: 'The shared engine, again',
    text: 'And beneath it, the same engine as the other two. Same converters, same DSP, same forty-gigabit connection.',
    start: 1829,
    end: 2072,
    assets: [88, 82, 96, 73, 75],
  },
  {
    id: 's9',
    label: 'The network completes',
    text: 'One Cat-6 cable ties the tracking room, the mix suite and this control room into a single Milan-certified network.',
    start: 2072,
    end: 2343,
    assets: [32, 29, 77, 84, 85, 79],
  },
  {
    id: 's10',
    label: 'Final CTA',
    text: 'One engine. Three specialized front-ends. One identical investment. Available now from Shivansh Electronics, MOTU’s Authorized Distributor for East and North East India.',
    start: 2343,
    end: 2640,
    assets: [],
  },
];

export const PART3_ASSETS = SEGMENTS.flatMap((s) => s.assets);
