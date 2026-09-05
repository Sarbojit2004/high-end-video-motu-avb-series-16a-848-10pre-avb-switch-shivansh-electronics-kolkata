// Resolve the ffmpeg/ffprobe binaries that ship with Remotion's compositor
// package, so the audio + asset scripts need no separate install.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const dir = path.dirname(require.resolve("@remotion/compositor-linux-x64-gnu/package.json"));
export const ffmpeg = process.env.FFMPEG_BIN ?? path.join(dir, "ffmpeg");
export const ffprobe = process.env.FFPROBE_BIN ?? path.join(dir, "ffprobe");
if (!fs.existsSync(ffmpeg)) throw new Error(`ffmpeg not found at ${ffmpeg} — run npm install, or set FFMPEG_BIN`);
