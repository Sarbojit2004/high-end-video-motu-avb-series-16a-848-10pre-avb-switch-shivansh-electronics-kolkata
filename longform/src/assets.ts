// Asset registry, generated from asset-manifest.json (written by
// scripts/copy-assets.mjs). Keyed by the stable index assigned during the
// mandatory visual inventory — NOT by filename, because the supplied filename
// product prefixes are demonstrably unreliable: "MOTU 10pre (23).jpg",
// "MOTU 16A (3).jpg" and "MOTU 848 (6).jpg" are byte-identical to one another.
// Classification came from inspecting every image, not from its name.
import { staticFile } from "remotion";
import manifest from "../asset-manifest.json";

export type Bucket = "10pre" | "16A" | "848" | "AVBSwitch" | "Network" | "Shared" | "Brand";

export type AssetEntry = {
  idx: number;
  file: string;
  aliases: string[];
  w: number;
  h: number;
  fmt: string;
  ar: number;
  product: Bucket;
  tier: "hero" | "support";
  slug: string;
  ext: string;
  /** Auto-detected at asset-copy time from the image's own four corners. */
  bg: "light" | "mixed" | "dark";
  border: number;
};

export const ASSETS = manifest as AssetEntry[];

const BY_IDX = new Map<number, AssetEntry>(ASSETS.map((a) => [a.idx, a]));

/** Resolve an inventory index to a staticFile URL. */
export function img(idx: number): string {
  const a = BY_IDX.get(idx);
  if (!a) throw new Error(`No asset with index ${idx}`);
  return staticFile(`images/${a.slug}.${a.ext}`);
}

export function meta(idx: number): AssetEntry {
  const a = BY_IDX.get(idx);
  if (!a) throw new Error(`No asset with index ${idx}`);
  return a;
}

/** Aspect ratio — used to pick contain-vs-fill layout per image. */
export const ar = (idx: number): number => meta(idx).ar;

export const allIndices = (): number[] => ASSETS.map((a) => a.idx);
export const indicesIn = (b: Bucket): number[] =>
  ASSETS.filter((a) => a.product === b).map((a) => a.idx);

// ---------------------------------------------------------------- semantic
// Named handles for the images scene code reaches for most often.

export const LOGO = { motu: 121, shivansh: 122 } as const;

export const TENPRE = {
  frontElevation: 30,
  rearElevation: 35,
  qRearLeft: 37,
  qFrontRight: 38,
  qFrontLeft: 39,
  qFrontDark: 40,
  qFrontLeftAlt: 41,
  inserts: 5,
  combos4: 9,
  meters: 7,
  metersWide: 15,
  lineOut: 16,
  rearIO: 17,
  headphones: 27,
  monitorGroup: 13,
  frontLineArt: 4,
  connectivity: 6,
  rtl: 8,
  rearCableFan: 1,
  ipad: 12,
} as const;

export const S16A = {
  wideFront: 45,
  wideFrontAlt: 47,
  wideFrontB: 49,
  rearElevation: 51,
  frontElevation: 76,
  qRear: 77,
  qRearRight: 78,
  qFront: 79,
  qFrontRight: 80,
  qFrontDark: 81,
  meters: 58,
  rearOptical: 60,
  lineOutJacks: 62,
  rearCableFan: 63,
  networkOptical: 65,
  rearFull: 74,
  frontLineArt: 67,
  connectivity: 69,
  rtl: 71,
  deskLifestyle: 42,
  laptopLifestyle: 56,
  ipad: 73,
} as const;

export const S848 = {
  frontElevation: 85,
  rearElevation: 86,
  qFrontDark: 107,
  qRear: 108,
  qRearRight: 109,
  qFront: 110,
  qFrontRight: 111,
  headphones: 88,
  lineOut: 89,
  rearCableFan: 90,
  rearIO: 91,
  insertsCombo: 93,
  meters: 94,
  metersAlt: 101,
  combos4: 95,
  monitorGroup: 97,
  speakerSelect: 18,
  frontLineArt: 103,
  connectivity: 104,
  rtl: 105,
  ipad: 106,
} as const;

export const AVBSW = {
  qWhite: 112,
  qPorts: 114,
  frontElevation: 116,
} as const;

export const NET = {
  topologyDaisy: 23,
  topology16A: 68,
  topologyRender: 113,
  milan: 100,
  ieeeAvb: 115,
  rj45Cable: 117,
  clock: 118,
  qos: 119,
  gauge: 120,
} as const;

export const BADGE = {
  ess: 24,
  thunderbolt: 26,
  thunderboltTall: 87,
  cuemix: 43,
} as const;

export const SHARED = {
  studioWide: 14,
  studioConsole: 82,
  modularSynth: 21,
  ipadCuemix: 22,
  usbC: 10,
  usbCAlt: 61,
  daw1: 2,
  daw2: 59,
  daw3: 64,
  daw4: 66,
  daw5: 99,
  cuemixMonitor1: 11,
  cuemixMonitor2: 48,
  cuemixMonitor3: 96,
  discovery: 31,
  reverb: 25,
  networkOpticalMacro: 20,
  bundleInstruments: 57,
  bundleLoopmasters: 83,
  bundleLucid: 84,
  bundleSoundbanks: 92,
  bundleBigFish: 102,
} as const;

// --------------------------------------------------------------------- audio
export const MUSIC = (slug: string): string => staticFile(`audio/music/${slug}.mp3`);
export const SFX = (name: string): string => staticFile(`audio/sfx/${name}.wav`);
export const VO = (): string => staticFile("vo/voiceover-longform.mp3");

export type SfxKey =
  | "encoder-detent" | "encoder-turn" | "rj45-snap" | "talkback-engage"
  | "relay-tick" | "counter-tick" | "rack-seat"
  | "avb-ping-hi" | "avb-ping-mid" | "avb-ping-lo"
  | "gptp-sync" | "data-stream" | "link-establish"
  | "panel-air" | "panel-air-soft";
