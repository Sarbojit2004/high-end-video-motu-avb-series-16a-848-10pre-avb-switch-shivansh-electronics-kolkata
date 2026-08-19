import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(3);

// CRF 18 — visually lossless for this material (flat light grounds, vector
// motion graphics, slow moves over stills). A forced target bitrate would spend
// several times the bytes on an identical picture.
// NB: CRF is NOT set globally. It is a video-only option and hard-errors when
// the wav codec is selected, which the two standalone audio deliverables use.
// The video render scripts pass --crf=18 explicitly instead; the result is
// identical to setting it here.
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setChromiumDisableWebSecurity(false);

const LOCAL_CHROME =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(LOCAL_CHROME)) Config.setBrowserExecutable(LOCAL_CHROME);
