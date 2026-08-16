import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
// Render-quality gate (Section 9): 8–12 Mbps H.264, ~150–230 MB per 178 s part.
//
// CRF alone will NOT meet that gate here. CRF is quality-targeted, and this
// content (flat light grounds, vector motion graphics, 1U hardware on plain
// wells) is genuinely low-complexity — a CRF-18 pass settles around 2.1 Mbps
// / 45 MB. That is not a soft encode, it is cheap content. An explicit target
// bitrate is therefore the correct control for the delivery spec.
// 9 Mbps × 178.05 s ≈ 200 MB video + ~7 MB audio ≈ 207 MB → mid-range.
Config.setCodec("h264");
Config.setVideoBitrate("9M");
Config.setPixelFormat("yuv420p");
Config.setChromiumDisableWebSecurity(false);

// This container ships Chromium and blocks Remotion's browser-download host, so
// point the renderer at the local binary. Override with REMOTION_BROWSER_EXECUTABLE.
const LOCAL_CHROME =
  process.env.REMOTION_BROWSER_EXECUTABLE ??
  "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (require("node:fs").existsSync(LOCAL_CHROME)) {
  Config.setBrowserExecutable(LOCAL_CHROME);
}
