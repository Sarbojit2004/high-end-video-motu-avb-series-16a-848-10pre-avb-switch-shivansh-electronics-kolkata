// Section 10a Layer 1 — stages the music stems this build actually deploys.
//
// The repository supplies FIVE full instrumental tracks (the brief says four)
// plus 17 isolated stems. This build never uses the full mixes: every chapter
// is assembled from that chapter's own stems, so the mix can be gated by
// narrative function rather than riding a finished master under narration.
//
// Deployment (a deliberate Path A / Path B blend — see README):
//   Mindscape  bookends the video (Ch1 hook, Ch2 thesis, Ch7 CTA) and is the
//              ecosystem's sonic signature. Lowest mean RMS of the five
//              (-16.2 dBFS) and the flattest envelope, so it is the only
//              supplied track with real headroom to sit under narration.
//   GIFTED     Ch3 - 10pre (highest dynamics of the five, 0.473 - tracking energy)
//   DIABLO     Ch4 - 16A   (dense, synth-forward - routing/patchbay)
//   BlackBlue  Ch5 - 848   (warmest, most spacious - control room)
//   ETERNITY   Ch6 - Network (loudest and most driving - the climax)
//
// Stems are never layered ACROSS tracks: unrelated tempi and keys would turn
// the bed to mush. Each chapter draws only from its own track; chapters
// crossfade at the seams.
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const FF = createRequire(import.meta.url)("ffmpeg-static");
const HERE = dirname(fileURLToPath(import.meta.url));
const PROJ = resolve(HERE, "..");
const SRC = resolve(PROJ, "..", "sound-effects");
const OUT = resolve(PROJ, "public/audio/music");
mkdirSync(OUT, { recursive: true });

/** [sourceFilename, destSlug] */
export const STEMS = [
  ["ES_Mindscape STEMS BASS - Lennon Hutton.mp3", "mindscape-bass"],
  ["ES_Mindscape STEMS INSTRUMENTS - Lennon Hutton.mp3", "mindscape-instruments"],
  ["ES_Mindscape STEMS MELODY - Lennon Hutton.mp3", "mindscape-melody"],

  ["ES_GIFTED (Instrumental Version) STEMS BASS - Bhris Drip.mp3", "gifted-bass"],
  ["ES_GIFTED (Instrumental Version) STEMS DRUMS - Bhris Drip.mp3", "gifted-drums"],
  ["ES_GIFTED (Instrumental Version) STEMS INSTRUMENTS - Bhris Drip.mp3", "gifted-instruments"],

  ["ES_DIABLO STEMS BASS - BLUE STEEL.mp3", "diablo-bass"],
  ["ES_DIABLO STEMS DRUMS - BLUE STEEL.mp3", "diablo-drums"],
  ["ES_DIABLO STEMS INSTRUMENTS - BLUE STEEL.mp3", "diablo-instruments"],
  ["ES_DIABLO STEMS MELODY - BLUE STEEL.mp3", "diablo-melody"],

  ["ES_Black & Blue (Instrumental Version) STEMS BASS - Torii Wolf.mp3", "blackblue-bass"],
  ["ES_Black & Blue (Instrumental Version) STEMS DRUMS - Torii Wolf.mp3", "blackblue-drums"],
  ["ES_Black & Blue (Instrumental Version) STEMS INSTRUMENTS - Torii Wolf.mp3", "blackblue-instruments"],

  ["ES_ETERNITY STEMS BASS - BLUE STEEL.mp3", "eternity-bass"],
  ["ES_ETERNITY STEMS DRUMS - BLUE STEEL.mp3", "eternity-drums"],
  ["ES_ETERNITY STEMS INSTRUMENTS - BLUE STEEL.mp3", "eternity-instruments"],
  ["ES_ETERNITY STEMS MELODY - BLUE STEEL.mp3", "eternity-melody"],
];

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let n = 0;
  for (const [src, slug] of STEMS) {
    const from = resolve(SRC, src);
    if (!existsSync(from)) throw new Error(`Missing supplied stem: ${src}`);
    const to = resolve(OUT, `${slug}.mp3`);
    // Re-encode to a consistent 192k CBR stereo 48 kHz so every stem decodes
    // identically and Remotion's timeline maths stay exact across the mix.
    execFileSync(FF, ["-v", "error", "-y", "-i", from, "-ac", "2", "-ar", "48000", "-b:a", "192k", to]);
    n++;
    console.log(`   ${slug.padEnd(24)} ${(statSync(to).size / 1024 / 1024).toFixed(1)} MB`);
  }
  console.log(`music: ${n} stems staged -> public/audio/music/`);
}
