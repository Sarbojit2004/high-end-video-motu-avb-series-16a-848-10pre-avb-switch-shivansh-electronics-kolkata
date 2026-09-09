// Shared loader: reads the TypeScript script source directly via node's
// native type stripping, so the markdown deliverable and the video render
// are guaranteed to come from the same data.
import { buildTimeline, WPM, SEGMENTS, spokenWords } from "../src/script.ts";
export { buildTimeline, WPM, SEGMENTS, spokenWords };
