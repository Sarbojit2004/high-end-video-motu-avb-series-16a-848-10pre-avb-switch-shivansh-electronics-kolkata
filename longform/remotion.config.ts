import { Config } from "@remotion/cli/config";
import { existsSync } from "node:fs";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(3);

// Encode: CRF 18 (visually lossless for this material) rather than a forced
// target bitrate. This content — flat light grounds, vector motion graphics and
// slow moves over stills — is genuinely low-complexity, so CRF lands around
// 2 Mbps with crisp type, where a forced 9 Mbps would spend ~1 GB encoding the
// same picture. Quality-per-byte is strictly better here, and it keeps each
// chapter chunk under GitHub's 100 MB per-file limit (git-lfs is unavailable in
// this environment), so the master can actually be delivered through the repo.
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
Config.setChromiumDisableWebSecurity(false);

// This container ships Chromium and blocks Remotion's browser-download host.
const LOCAL_CHROME =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(LOCAL_CHROME)) Config.setBrowserExecutable(LOCAL_CHROME);
