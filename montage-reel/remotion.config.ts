import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

// 2160×3840 @ 60 fps. JPEG frame capture keeps the 4K pipeline fast; the
// grain/gradient layers are dithered in-composition so 8-bit JPEG is fine.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(90);
Config.setOverwriteOutput(true);
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY ?? 2));

// Delivery gate (brief §9): three sequential parts, each < 100 MB.
// CRF is quality-targeted; the actual per-part size is checked by
// scripts/check-sizes.mjs after every render and the CRF is re-derived from a
// test render of the densest act (see README "Render + file size").
Config.setCodec("h264");
Config.setCrf(Number(process.env.REMOTION_CRF ?? 19));
Config.setPixelFormat("yuv420p");
Config.setAudioCodec("aac");
Config.setAudioBitrate("256k");
// Hard cap so the longest part (Part 2, 42.9 s) stays under 100 MB even at
// full grain density: 15 Mbps × 42.9 s ≈ 80 MB video + 1.4 MB audio.
Config.setEncodingMaxRate(process.env.REMOTION_MAXRATE ?? "15M");
Config.setEncodingBufferSize("30M");
Config.setChromiumDisableWebSecurity(false);

// This container ships Chromium and blocks Remotion's browser-download host, so
// point the renderer at the local binary. Override with REMOTION_BROWSER_EXECUTABLE.
const LOCAL_CHROME =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(LOCAL_CHROME)) Config.setBrowserExecutable(LOCAL_CHROME);
