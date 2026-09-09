import { staticFile } from "remotion";

// Self-hosted so the render is deterministic and needs no network.
// Bricolage Grotesque carries the 300/500/700/800 range the caption treatment
// needs: 300 for words that have not been spoken yet, 500 for settled words,
// 800 for the accent-coloured emphasis.
export const FONT_FACE_CSS = [300, 500, 700, 800]
  .map(
    (w) => `@font-face {
  font-family: 'Bricolage Grotesque';
  src: url('${staticFile(`fonts/bricolage-grotesque-normal-${w}.ttf`)}') format('truetype');
  font-weight: ${w};
  font-style: normal;
  font-display: block;
}`,
  )
  .join("\n");
