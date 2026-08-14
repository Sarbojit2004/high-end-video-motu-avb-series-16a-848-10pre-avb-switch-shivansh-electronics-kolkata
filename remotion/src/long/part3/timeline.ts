// LONG-FORM PART 3 - "The Control Room" (MOTU 848)
// 8,940 frames @ 30fps = 298.000s exactly.
//
// The close of the series. This part takes the time the brief asks for on the
// one genuinely complex, high-value concept: why twelve analog outputs is not
// an arbitrary number but the exact channel count a 7.1.4 Dolby Atmos array
// needs, and why driving all twelve from one ESS Sabre32 clock avoids the
// phase and sync problems a multi-box monitoring chain introduces.
//
// It also carries the AVB network payoff (all three units have been introduced
// by now) and the full CTA.
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
    label: 'Door three',
    text: 'The signal has been captured in the live room, and routed through the mix suite. This is the last place it goes — the room where somebody finally decides whether it is finished.',
    start: 0, end: 409, assets: [86],
  },
  {
    id: 's2',
    label: 'Twelve outputs',
    text: 'Twelve balanced analog outputs. Not eight, not sixteen. Twelve is a very specific number, and the reason it is twelve is the single most important thing about this unit — it is the difference between a stereo mix room and an immersive one.',
    start: 409, end: 942, assets: [90, 87],
  },
  {
    id: 's3',
    label: 'Why twelve — the 7.1.4 array',
    text: 'A seven-one-four Dolby Atmos monitoring array is seven ear-level speakers, one subwoofer channel, and four height speakers overhead. Seven, plus one, plus four. That is twelve discrete feeds, and every one of them needs its own analog output.',
    start: 942, end: 1413, assets: [92, 72],
  },
  {
    id: 's4',
    label: 'One clock source',
    text: 'The usual way to reach twelve outputs is to aggregate two interfaces. That works on paper and causes trouble in practice: two converters, two clocks, and a drift between them that shows up as phase smearing across the speaker array — precisely the thing an immersive mix is supposed to reveal.',
    start: 1413, end: 2045, assets: [91, 81],
  },
  {
    id: 's5',
    label: 'No aggregation',
    text: 'Here all twelve outputs come off one unit, from one ESS Sabre32 clock. There is nothing to synchronise, nothing to drift apart over a long session, and no aggregate device sitting between the renderer and the room pretending two boxes are one.',
    start: 2045, end: 2566, assets: [82, 88],
  },
  {
    id: 's6',
    label: 'Four combo inputs',
    text: 'Capture here is deliberately modest, because a control room is not a tracking room. Four combo inputs take microphone, line or high-impedance instrument signals, with seventy-four decibels of gain and an equivalent input noise figure of minus one hundred and twenty-nine dBu.',
    start: 2566, end: 3087, assets: [95, 74],
  },
  {
    id: 's7',
    label: 'What those four are for',
    text: 'That covers what actually happens in a mix room. A vocal fix. A bass guitar taken direct. A stereo synthesizer. A voiceover pickup for a picture session. Enough capture to keep the work moving without anyone leaving the chair or booking the live room.',
    start: 3087, end: 3633, assets: [83, 96],
  },
  {
    id: 's8',
    label: 'Inserts on channels 3-4',
    text: 'Channels three and four carry dedicated analog send and return inserts, ahead of conversion. Your favourite vocal compressor stays permanently patched into the path, so the sound you print is the sound you approved.',
    start: 3633, end: 4055, assets: [93, 80],
  },
  {
    id: 's9',
    label: 'A/B/C monitor switching',
    text: 'On the front, hardware monitor control. A, B and C speaker selection, switched in the analog domain, so you can check a mix on the mains, the nearfields and the reference pair without touching a plug-in or leaving the listening position.',
    start: 4055, end: 4563, assets: [27, 97],
  },
  {
    id: 's10',
    label: 'Talkback and headphones',
    text: 'There is talkback built in, and two independent headphone outputs, each with its own programmable source. The engineer and the client can be listening to entirely different mixes while the room monitors stay muted — useful when someone needs to check a stem without stopping the session.',
    start: 4563, end: 5146, assets: [89, 78],
  },
  {
    id: 's11',
    label: 'The display',
    text: 'The front-panel display carries live metering for inputs, outputs, monitor level and clock status. In an immersive session, being able to see all twelve legs of the array metered at the hardware — not in a plug-in window behind three other windows — is worth more than it sounds.',
    start: 5146, end: 5754, assets: [94],
  },
  {
    id: 's12',
    label: 'CueMix — renderer to array',
    text: 'CueMix Pro maps the renderer output straight onto the physical array. Each channel of the Atmos bed lands on the speaker it belongs to, point to point, and you can confirm that mapping visually rather than trusting it.',
    start: 5754, end: 6225, assets: [98, 76],
  },
  {
    id: 's13',
    label: 'CueMix — routing and trim',
    text: 'Individual output trim lets you level-match the array without touching the renderer at all. That matters in a real room, where one height speaker almost always ends up closer to the listening position than the other three.',
    start: 6225, end: 6684, assets: [28, 73],
  },
  {
    id: 's14',
    label: 'The shared engine, once more',
    text: 'Underneath, it is the same platform as the other two units. The same converters, the same thirty-two-bit DSP, the same forty-gigabit Thunderbolt 4 connection, the same sub-two-millisecond round trip.',
    start: 6684, end: 7044, assets: [75, 84],
  },
  {
    id: 's15',
    label: 'Bundled content',
    text: 'And the same bundled production library arrives with it — instruments, loops and effects, rather than a bare driver package, which is not nothing when the unit is already doing the work of a monitor controller.',
    start: 7044, end: 7490, assets: [85, 79],
  },
  {
    id: 's16',
    label: 'The network completes',
    text: 'Now the three rooms connect. A single Cat-6 cable ties the tracking room, the mix suite and this control room into one Milan-certified network — an open standard governed by the Avnu Alliance, interoperating with other Milan-certified equipment across the professional audio industry.',
    start: 7490, end: 8023, assets: [32, 29],
  },
  {
    id: 's17',
    label: 'One platform',
    text: 'Eight devices. One hundred and twenty-eight channels per device. Two milliseconds of fixed, deterministic latency. And one routing matrix covering the whole facility, from the microphone in the live room to the height speaker above the mix position.',
    start: 8023, end: 8494, assets: [77],
  },
  {
    id: 's18',
    label: 'Final CTA',
    text: 'One engine. Three specialized front-ends. One identical investment: Market Operating Price one lakh eighty-seven thousand nine hundred rupees, including GST, per unit. Available now from Shivansh Electronics, MOTU\'s Authorized Distributor for East and North East India.',
    start: 8494, end: 8940, assets: [],
  },
];

export const LONG3_ASSETS = SEGMENTS.flatMap((s) => s.assets);
