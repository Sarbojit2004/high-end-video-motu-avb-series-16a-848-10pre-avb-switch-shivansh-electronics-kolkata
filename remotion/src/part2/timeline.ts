// PART 2 - "The Patchbay" (MOTU 16A)
// 2640 frames @ 30fps = 88.000s exactly.
//
// Per the brief's Timing Allocation Logic, the 16A segment moves faster and
// punchier than Parts 1 and 3: its value proposition is sheer line-level
// density, which reads quickly and does not need slow unpacking. This part is
// deliberately paced at ~2.4 w/s against Part 1's 2.19.
//
// 16A also carries the largest asset pool of the three (37 unique after
// dedup). Grouped montage compositions are used more freely here than in the
// other two parts specifically so the larger pool does not drag the tempo -
// full coverage without diluting the hero beats.
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
    label: 'Hook — a different door',
    text: 'Same engine. Same price. A different door. The 16A trades preamps for what a mix room actually needs.',
    start: 0,
    end: 240,
    assets: [51],
  },
  {
    id: 's2',
    label: 'Sixteen in, sixteen out',
    text: 'Sixteen balanced TRS inputs. Sixteen balanced outputs. Thirty-two channels of outboard gear, converted by the identical ESS Sabre32 stage.',
    start: 240,
    end: 483,
    assets: [59, 66, 68],
  },
  {
    id: 's3',
    label: 'Dual RGB TFT displays',
    text: 'Two three-point-nine-inch RGB displays, not one. Sixty-six channels of metering, readable from across the room.',
    start: 483,
    end: 675,
    assets: [39, 53, 55],
  },
  {
    id: 's4',
    label: 'No preamps, by design',
    text: 'No built-in preamps, and that is the point. You already own the ones you like. Nothing is spent on hardware you would bypass.',
    start: 675,
    end: 963,
    assets: [64, 57, 42],
  },
  {
    id: 's5',
    label: 'DC-coupled outputs / CV',
    text: 'All sixteen outputs are DC-coupled. Send control voltage straight out of your session and sequence a modular rig from the timeline.',
    start: 963,
    end: 1227,
    assets: [30, 44, 69],
  },
  {
    id: 's6',
    label: 'ADAT expansion + word clock',
    text: 'Two banks of ADAT optical take it to sixty-six simultaneous channels, with word clock in, out and thru.',
    start: 1227,
    end: 1452,
    assets: [49, 71, 46],
  },
  {
    id: 's7',
    label: 'The patchbay in software',
    text: 'CueMix Pro turns the whole rig into a point-to-point patchbay. Any input, to any output, in any combination you need.',
    start: 1452,
    end: 1707,
    assets: [62, 63, 52, 60],
  },
  {
    id: 's8',
    label: 'DSP on every channel',
    text: 'Every channel carries four-band parametric EQ, a compressor and a gate. Thirty-two-bit floating point, running on the hardware.',
    start: 1707,
    end: 1935,
    assets: [61, 47, 54, 34],
  },
  {
    id: 's9',
    label: 'AVB daisy-chain',
    text: 'And when sixteen channels stops being enough, a single Cat-6 cable adds the next unit. Milan-certified AVB: two milliseconds, deterministic, up to eight devices.',
    start: 1935,
    end: 2241,
    assets: [43, 45, 48, 37, 67],
  },
  {
    id: 's10',
    label: 'Continuation + branding',
    text: 'One network, one mixer, one identical investment. The signal has somewhere to go. Routed — now, where it lands. From Shivansh Electronics, Authorized Distributor for East and North East India.',
    start: 2241,
    end: 2640,
    assets: [56, 58, 70, 65, 50, 40, 41, 38],
  },
];

export const PART2_ASSETS = SEGMENTS.flatMap((s) => s.assets);
