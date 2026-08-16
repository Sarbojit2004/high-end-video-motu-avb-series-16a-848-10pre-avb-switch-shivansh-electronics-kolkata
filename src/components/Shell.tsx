import React from "react";
import { Audio, staticFile, continueRender, delayRender } from "remotion";
import { FONT_FACE_CSS, loadFonts } from "../fonts";

/** Injects @font-face once and blocks the render until the glyphs are ready. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = React.useState(() => delayRender("fonts"));
  React.useEffect(() => {
    loadFonts()
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FONT_FACE_CSS }} />
      {children}
    </>
  );
};

/**
 * Two-layer audio, both embedded in the rendered reel:
 *   • the selected music bed (Mindscape, per-chapter stem automation)
 *   • the transition-SFX timeline (same file delivered separately)
 * plus the silent VO slot the recorded narration drops into.
 */
export const AudioLayer: React.FC<{ part: string }> = ({ part }) => (
  <>
    <Audio src={staticFile(`audio/music-bed-${part}.mp3`)} volume={1} />
    <Audio src={staticFile(`audio/sfx-timeline-${part}.mp3`)} volume={1} />
    <Audio src={staticFile(`vo/voiceover-reel-${part}.mp3`)} volume={1} />
  </>
);
