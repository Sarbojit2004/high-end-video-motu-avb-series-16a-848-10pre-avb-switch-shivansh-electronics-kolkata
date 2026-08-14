// LONG-FORM PART 1 - "The Tracking Room" (MOTU 10pre)
// 8,940 frames @ 30fps = 298.000s exactly.
//
// This part carries the full shared-engine explanation for the whole series
// (brief s12): the ESS conversion stage, Thunderbolt 4, the CueMix Pro DSP and
// Milan AVB are established once here, so Parts 2 and 3 can reference them
// briefly instead of re-explaining. The remaining time then goes to 10pre's own
// story, with real depth on WHY the 8-rear/2-front preamp split matters
// ergonomically rather than just stating that it exists.
//
// At ~9.6 s/asset this format has room for individually composed, unhurried
// treatment as the default; grouped rows are reserved for genuinely repetitive
// detail (prompt s3).
//
// Tone: "Warm & Trustworthy - the integrator's perspective" (brief s9 opt.3).

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
    label: 'Series open',
    text: 'Three audio interfaces. One identical engine inside all of them. One identical price on all three. What changes is not how good they sound, or what they cost — but the door you walk in through.',
    start: 0,
    end: 429,
    assets: [5],
  },
  {
    id: 's2',
    label: 'The scaling problem',
    text: 'A studio grows, and its input and output needs change faster than its budget. A live room needs ten preamps. A mix suite needs sixteen line inputs. A control room going immersive needs twelve outputs. Traditionally, each of those means another box and another compromise.',
    start: 429,
    end: 965,
    assets: [23],
  },
  {
    id: 's3',
    label: 'Shared engine — ESS Sabre32',
    text: 'MOTU answered that by decoupling the engine from the front panel. Every unit converts through the same ESS Sabre32 Ultra stage — one hundred and twenty-five decibels of dynamic range, minus one hundred and fourteen decibels of distortion. Identical on all three, because it is the same hardware.',
    start: 965,
    end: 1537,
    assets: [33, 24],
  },
  {
    id: 's4',
    label: 'Shared engine — Thunderbolt 4 / latency',
    text: 'The host connection is the same too. Forty gigabits per second over Thunderbolt 4 and USB4. Round-trip latency measures one point eight milliseconds at ninety-six kilohertz, on a thirty-two sample buffer.',
    start: 1537,
    end: 1907,
    assets: [35, 19, 17],
  },
  {
    id: 's5',
    label: 'Shared engine — CueMix Pro DSP',
    text: 'Inside every unit, the same thirty-two-bit floating point DSP runs a sixty-four channel mixer called CueMix Pro. Twenty-six aux buses. Parametric EQ and a compressor on every bus. All computed on the interface, not on your processor — so your track count never touches your monitoring.',
    start: 1907,
    end: 2455,
    assets: [6, 1],
  },
  {
    id: 's6',
    label: 'Shared engine — Milan AVB',
    text: 'The last shared piece is the network. Two gigabit Ethernet ports per unit, running Milan — an open standard governed by the Avnu Alliance. It interoperates with other Milan-certified equipment across the industry, and daisy-chains up to eight units at a fixed two milliseconds.',
    start: 2455,
    end: 2980,
    assets: [15, 2],
  },
  {
    id: 's7',
    label: 'Enter the 10pre',
    text: 'That is the engine. Now the first of the three doors. This is the MOTU 10pre, built for one specific situation: an entire band playing at the same time, in the same room, and every one of them needs a microphone.',
    start: 2980,
    end: 3469,
    assets: [26, 10],
  },
  {
    id: 's8',
    label: 'Ten microphone preamps',
    text: 'Ten microphone preamplifiers. Seventy-four decibels of gain on each, with equivalent input noise of minus one hundred and twenty-nine dBu. All ten identical, all ten on one master clock. No second preamp unit with a different character, no optical link to keep in sync.',
    start: 3469,
    end: 3993,
    assets: [18, 8],
  },
  {
    id: 's9',
    label: 'The 8-rear / 2-front split — why it matters',
    text: 'Where those preamps physically sit is the detail that changes a working day. Eight are on the rear panel — the snake from the live room, wiring you set up once and never touch again. Two are on the front, for the guitarist who has just arrived. Without that split, every unplanned input means walking behind a loaded rack.',
    start: 3993,
    end: 4696,
    assets: [13, 0],
  },
  {
    id: 's10',
    label: 'Hardware inserts, channels 1-2',
    text: 'Those two front channels carry something the other eight do not: dedicated hardware insert points. Send and return on channels one and two, sitting in the signal path before conversion. Your outboard compressor goes there and prints to the recording.',
    start: 4696,
    end: 5173,
    assets: [14],
  },
  {
    id: 's11',
    label: 'One-decibel gain calibration',
    text: 'Gain is set in exact one-decibel increments, and that precision matters. A drum overhead pair only images correctly when both channels sit at genuinely the same gain. Repeatable steps mean you match them once and recall it exactly next session.',
    start: 5173,
    end: 5650,
    assets: [7, 3],
  },
  {
    id: 's12',
    label: 'Dual headphone outputs',
    text: 'Two independent headphone outputs, each with its own level control and its own selectable source. The drummer gets a cue mix heavy on click and bass. You keep a flat mix for judging the take. Both are built by the on-board DSP, so both are latency-free.',
    start: 5650,
    end: 6198,
    assets: [36, 22],
  },
  {
    id: 's13',
    label: 'Eight DC-coupled line outputs',
    text: 'On the output side, eight balanced TRS line outputs, all of them DC-coupled. They carry control voltage as well as audio, so the same connector that feeds a monitor can instead sequence an analog synthesizer.',
    start: 6198,
    end: 6615,
    assets: [25, 11],
  },
  {
    id: 's14',
    label: 'The front-panel display',
    text: 'The front-panel display is a full-colour RGB screen showing live metering across every input and output at once, plus sample rate and clock source. You confirm signal at the unit, without turning back to the computer.',
    start: 6615,
    end: 7044,
    assets: [16, 9],
  },
  {
    id: 's15',
    label: 'CueMix Pro — routing and patchbay',
    text: 'Everything routes through CueMix Pro. The patchbay is a true point-to-point matrix: any physical input, any network stream, any host channel, to any destination. One microphone can feed the recording, the drummer\'s headphones, and a stream to another room at once.',
    start: 7044,
    end: 7533,
    assets: [12, 20],
  },
  {
    id: 's16',
    label: 'CueMix Pro — EQ and dynamics',
    text: 'Every one of those channels carries its own processing — four-band double-precision parametric EQ, a compressor, a gate, a high-pass filter. You can shape a cue mix so the drummer hears more of themselves, without touching what is being recorded.',
    start: 7533,
    end: 8010,
    assets: [4],
  },
  {
    id: 's17',
    label: 'Wireless control',
    text: 'All of it is controllable from an iPad on the same network, which in practice means setting a performer\'s headphone mix while standing next to them in the live room.',
    start: 8010,
    end: 8368,
    assets: [21, 31],
  },
  {
    id: 's18',
    label: 'Continuation + branding',
    text: 'That is the tracking room: ten identical preamps, split eight and two, feeding the same converters as every unit in the series. One engine. The signal moves on — in Part 2, it reaches the patchbay. From Shivansh Electronics, MOTU\'s Authorized Distributor for East and North East India.',
    start: 8368,
    end: 8940,
    assets: [],
  },
];

export const LONG1_ASSETS = SEGMENTS.flatMap((s) => s.assets);
