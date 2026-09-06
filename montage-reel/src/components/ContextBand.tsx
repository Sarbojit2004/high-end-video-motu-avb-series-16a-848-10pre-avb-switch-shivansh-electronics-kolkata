import React from "react";
import { WIDTH, HEIGHT } from "../data/grid.ts";
import { chainTiming, type BuiltCard } from "../data/text-track.ts";
import { FONT } from "../design/fonts.ts";
import { contrast, rgba, SCRIM_ALPHA, type ActPalette } from "../design/palette.ts";
import { clamp01, easeInOut, easeOut } from "./Picture.tsx";

/**
 * CONTEXT BAND — the heading / subheading pair that names whatever product is
 * on screen (text-layer rectification pass).
 *
 * Primary pairing, per the supplied reference: a high-contrast Didone serif
 * heading set ALL UPPERCASE and large enough to dominate the space it occupies,
 * with the script accent face as a companion line tucked up against the
 * heading's baseline at roughly 45 % of its scale — never equal weight, never
 * microtype.
 *
 * The pair is driven by the text track, not by the shot, so it is introduced
 * once on the cut that starts a run, holds through that run's rapid-fire cuts,
 * and exits with motion before the next pair. `globalFrame` is the frame on the
 * reel's own timeline, so mid-run shots render it already fully in.
 *
 * Contrast: the pair always sits on a tight scrim in the act's own scrim colour
 * at the verified 94 % opacity, so it reads over any photograph beneath it.
 */

const SAFE_X = 120;
/** Fixed lower-third zone — a consistent home for the pair across every shot kind. */
export const BAND_TOP = 3060;

const HEADING_MAX = 260;
const HEADING_MIN = 150;
/** Didone caps run ~0.62 em average advance; fit the heading to the safe width. */
const headingSize = (text: string, boxWidth: number) =>
  Math.max(HEADING_MIN, Math.min(HEADING_MAX, boxWidth / (0.62 * Math.max(1, text.length))));

export const ContextBand: React.FC<{
  card: BuiltCard;
  /** frame on the reel timeline, not the shot's sequence-local frame */
  globalFrame: number;
  palette: ActPalette;
}> = ({ card, globalFrame, palette }) => {
  // Each element runs on its own chain, so the scrim and the product name hold
  // dead still across a run while only the line that actually changed animates.
  const boxT = chainTiming(card.boxStart, card.boxEnd, 10, 8);
  const headT = chainTiming(card.headStart, card.headEnd, 12, 8);
  const subT = chainTiming(card.subStart, card.subEnd, 12, 6);
  const prog = (start: number, end: number, t: { enter: number; exit: number }) => ({
    in: clamp01((globalFrame - start) / t.enter),
    out: clamp01((globalFrame - (end - t.exit)) / t.exit),
  });
  const box = prog(card.boxStart, card.boxEnd, boxT);
  const head = prog(card.headStart, card.headEnd, headT);
  const sub = prog(card.subStart, card.subEnd, subT);
  const inT = head.in;
  const outT = box.out;

  const boxWidth = WIDTH - SAFE_X * 2 - 160; // minus the scrim's own padding
  const hSize = headingSize(card.heading, boxWidth);
  const sSize = hSize * 0.46;

  // The script sits in the act accent where that passes 4.5:1 on the scrim,
  // otherwise it takes the scrim's own verified ink.
  const subColor = contrast(palette.accent, palette.scrim) >= 4.5 ? palette.accent : palette.scrimInk;

  // ── build-in, riding the cut that brought this run on screen ───────────────
  const e = easeOut(inT);
  let headingStyle: React.CSSProperties = {};
  if (card.motion === "wipe") {
    const p = (1 - easeInOut(inT)) * 100;
    const horizontal = card.dir === "l" || card.dir === "r";
    const clip = horizontal
      ? card.dir === "r" ? `inset(0 ${p}% 0 0)` : `inset(0 0 0 ${p}%)`
      : card.dir === "d" ? `inset(0 0 ${p}% 0)` : `inset(${p}% 0 0 0)`;
    headingStyle = { clipPath: clip, WebkitClipPath: clip };
  } else if (card.motion === "scale") {
    headingStyle = { transform: `scale(${0.78 + 0.22 * e})`, opacity: Math.min(1, inT * 2.2) };
  } else {
    headingStyle = { opacity: Math.min(1, inT * 1.8), transform: `translateY(${(1 - e) * 34}px)`, filter: inT < 1 ? `blur(${(1 - e) * 14}px)` : "none" };
  }

  // the sub follows the heading by a beat of its own, and swaps with motion on
  // both sides when the phrase changes mid-run
  const subIn = clamp01((globalFrame - card.subStart - 4) / subT.enter);
  const se = easeOut(subIn) * (1 - easeInOut(sub.out));

  // ── build-out, matched to whatever transition takes the next shot ──────────
  const outE = easeInOut(outT);
  const headOut = easeInOut(head.out);
  const exit: React.CSSProperties = {
    opacity: 1 - outE,
    transform: `translateY(${outE * -26}px) scale(${1 - outE * 0.05})`,
  };

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE_X,
        right: SAFE_X,
        top: BAND_TOP,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        ...exit,
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: `${hSize * 0.16}px ${hSize * 0.3}px ${sSize * 0.9}px`,
          borderRadius: 26,
          background: rgba(palette.scrim, SCRIM_ALPHA * Math.min(1, box.in * 2.5) * (1 - outE)),
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: `0 30px 90px ${rgba("#000", 0.4 * (1 - outE))}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT.serif,
            fontWeight: 700,
            fontSize: hSize,
            lineHeight: 0.94,
            letterSpacing: "0.015em",
            color: palette.scrimInk,
            whiteSpace: "nowrap",
            ...headingStyle,
            // a heading that survives into the next card never blinks; one that
            // is about to change leaves with motion of its own
            ...(headOut > 0 && outE === 0 ? { opacity: 1 - headOut, transform: `translateY(${headOut * -18}px)` } : {}),
          }}
        >
          {card.heading}
        </div>
        <div
          style={{
            fontFamily: FONT.script,
            fontWeight: 700,
            fontSize: sSize,
            lineHeight: 0.9,
            color: subColor,
            whiteSpace: "nowrap",
            // tucked up against the heading's baseline, as in the reference
            marginTop: -sSize * 0.34,
            opacity: se,
            transform: `translateY(${(1 - se) * 20}px) rotate(${(1 - se) * -1.5}deg)`,
            textShadow: `0 0 ${sSize * 0.5}px ${rgba(subColor, 0.35)}`,
          }}
        >
          {card.sub}
        </div>
      </div>
    </div>
  );
};

export const BAND_ZONE = { top: BAND_TOP, bottom: HEIGHT - 180 };
