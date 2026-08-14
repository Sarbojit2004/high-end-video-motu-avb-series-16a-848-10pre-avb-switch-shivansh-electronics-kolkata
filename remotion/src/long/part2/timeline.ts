// LONG-FORM PART 2 - "The Patchbay" (MOTU 16A)
// 8,940 frames @ 30fps = 298.000s exactly.
//
// The shared engine was established in Part 1, so this part references it
// briefly and spends its runtime on what is genuinely 16A-specific.
//
// The brief asks for this segment to move faster than Parts 1 and 3. At this
// runtime that is carried by asset density, not speech rate: 37 assets against
// Part 1's 31 (8.05 s/asset vs 9.61), with the spoken pace held at a natural
// ~2.5 w/s. Speeding the narration instead would just make it sound rushed.
//
// Tone: "Precise & Technical-but-Accessible" (brief s9 opt.1).

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
    label: 'Door two',
    text: 'Same engine. Same converters. Same Market Operating Price. The second door opens onto a completely different front panel, and a completely different kind of room — one where the microphones were dealt with a long time ago, and the problem now is everything downstream of them.',
    start: 0, end: 560, assets: [51],
  },
  {
    id: 's2',
    label: 'Sixteen in, sixteen out',
    text: 'Sixteen balanced TRS inputs. Sixteen balanced outputs. Thirty-two analog connections in a single rack space, every one of them converting through the same ESS Sabre32 Ultra stage you met in Part 1. The conversion quality is not the variable here. The connector count is.',
    start: 560, end: 1096, assets: [59, 66],
  },
  {
    id: 's3',
    label: 'The jack field',
    text: 'Up close, that is what line-level density actually looks like. Rows of quarter-inch jacks, numbered and labelled, running the full width of the chassis. There is no wasted panel area, because there is nothing else competing for it.',
    start: 1096, end: 1559, assets: [68, 71],
  },
  {
    id: 's4',
    label: 'Dual RGB displays',
    text: 'The front panel is the other giveaway. Where the 10pre and the 848 each carry a single display, the 16A carries two three-point-nine-inch full-colour RGB screens — the only unit in the series that does.',
    start: 1559, end: 1985, assets: [39, 53],
  },
  {
    id: 's5',
    label: 'Why two displays',
    text: 'That is not decoration. With sixty-six channels running, a single screen has to page between inputs and outputs. Two screens show you both at the same time, which is exactly what you want when you are patching under time pressure and need to see signal arrive and leave at once.',
    start: 1985, end: 2594, assets: [55, 57],
  },
  {
    id: 's6',
    label: 'No preamps, by design',
    text: 'There are no microphone preamps here at all, and that is a deliberate design decision rather than an omission. If you already own the preamps you like — the 500-series rack, the vintage channel strip — then chassis space and cost spent on built-in ones is money spent twice.',
    start: 2594, end: 3191, assets: [64, 42],
  },
  {
    id: 's7',
    label: 'DC-coupled outputs',
    text: 'All sixteen outputs are DC-coupled. They carry control voltage as readily as they carry audio, so the same interface that drives your monitors can sequence an analog modular rig directly from the session timeline, with sample-accurate timing.',
    start: 3191, end: 3642, assets: [30, 44],
  },
  {
    id: 's8',
    label: 'The rear, fully patched',
    text: 'Fully loaded, this becomes a patchbay hub. Every outboard compressor, equaliser and preamp you own is wired once into the back of the unit, and from that point on it is reachable entirely from software — no re-patching behind the rack to change a signal path.',
    start: 3642, end: 4202, assets: [69, 49],
  },
  {
    id: 's9',
    label: 'ADAT and word clock',
    text: 'Two banks of ADAT optical take the total channel count to sixty-six at forty-eight kilohertz, and BNC word clock in, out and thru keeps older digital gear locked to the same master clock as everything else in the room.',
    start: 4202, end: 4677, assets: [46, 45],
  },
  {
    id: 's10',
    label: 'CueMix — input and output trim',
    text: 'In CueMix Pro, every one of those sixteen inputs and sixteen outputs gets its own trim control, its own metering and its own routing assignment, laid out on a single page rather than buried in a menu tree.',
    start: 4677, end: 5140, assets: [52, 60, 50],
  },
  {
    id: 's11',
    label: 'CueMix — the patchbay page',
    text: 'The patchbay page is where the 16A earns its name. Any physical input, any optical channel, any network stream can be sent to any destination, point to point, in any combination. There is no fixed signal path to work around — you define it, and you change it without touching a cable.',
    start: 5140, end: 5773, assets: [62, 63],
  },
  {
    id: 's12',
    label: 'Per-channel processing',
    text: 'Each channel also carries its own processing: four-band double-precision parametric EQ, a compressor and a gate. Thirty-two-bit floating point, computed on the interface rather than on the host, so none of it costs you plug-in headroom in the session.',
    start: 5773, end: 6248, assets: [61, 47],
  },
  {
    id: 's13',
    label: 'Aux buses and mix sends',
    text: 'Twenty-six aux buses handle cue mixes and effect sends. A single input can appear in several different mixes simultaneously, at completely independent levels, which is what makes this practical as a hub for more than one listener.',
    start: 6248, end: 6699, assets: [54, 58],
  },
  {
    id: 's14',
    label: 'Effects and bundled software',
    text: 'Reverb runs on that same DSP, and the unit ships with a substantial bundle of production software alongside it — instruments, effects and content, rather than just a driver disc.',
    start: 6699, end: 7065, assets: [34, 65],
  },
  {
    id: 's15',
    label: 'In the session',
    text: 'To the computer, all of this simply appears as one large, stable interface. That is the least glamorous and most valuable part: three decades of driver engineering doing its job quietly, session after session.',
    start: 7065, end: 7479, assets: [40, 41],
  },
  {
    id: 's16',
    label: 'Control surfaces',
    text: 'Control it from the desktop application, or from an iPad on the same network — which in a machine room means you can be standing at the rack, with your hands on the gear, rather than walking back to the desk to change a routing.',
    start: 7479, end: 8027, assets: [48, 56],
  },
  {
    id: 's17',
    label: 'AVB daisy-chain',
    text: 'And when sixteen channels stops being enough, a single Cat-6 cable adds the next unit. Milan-certified AVB, a fixed two milliseconds of network latency, and up to eight devices sharing one network without an aggregate device or a second clock.',
    start: 8027, end: 8514, assets: [43, 67, 70],
  },
  {
    id: 's18',
    label: 'Continuation + branding',
    text: 'That is the patchbay: thirty-two analog connections, two displays, and no preamps you did not ask for. Routed — now, where it lands. From Shivansh Electronics, MOTU\'s Authorized Distributor for East and North East India.',
    start: 8514, end: 8940, assets: [38, 37],
  },
];

export const LONG2_ASSETS = SEGMENTS.flatMap((s) => s.assets);
