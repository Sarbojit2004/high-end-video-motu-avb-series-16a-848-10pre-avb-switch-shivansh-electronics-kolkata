import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, FONT, INK, TYPE, type ProductKey } from "../theme.ts";
import type { TimedCaption } from "../script.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE CAPTION ENGINE — the single most important technique carried over from
// the reference video (Section 2, item 1).
//
// The reference does NOT set static headline cards. It sets styled subtitles:
// a short spoken phrase whose words arrive one at a time roughly in time with
// the voice, with selective per-WORD styling inside the line — one word pulled
// out in bold accent colour while its neighbours stay neutral, and words that
// have not been reached yet sitting dimmed until they land.
//
// That behaviour is what makes it read as speech rather than as graphic design,
// which is exactly why it suits a reel built to carry real narration.
//
// Reproduced here as four states per word:
//
//   pending   dimmed, slightly small, slightly low        (not yet spoken)
//   landing   springs up to full size and full weight     (being spoken)
//   settled   neutral ink, full weight                    (already spoken)
//   emphasis  accent colour + heaviest weight + a lift    (the marked word)
//
// Word timing is derived from the caption's own duration divided across its
// words, so a long word in a short caption does not get the same slot as a
// short one — weighting is by character count, which tracks speech better than
// a flat split.
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  caption: TimedCaption;
  /** Absolute frame at which this caption begins. */
  startFrame: number;
  product: ProductKey;
  env: "light" | "dark";
  /** Optional width override; defaults to the safe-zone width. */
  width?: number;
  align?: "left" | "center";
  size?: number;
};

export const Caption: React.FC<Props> = ({
  caption,
  startFrame,
  product,
  env,
  width,
  align = "left",
  size = TYPE.caption.size,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - startFrame;
  const durF = Math.max(1, Math.round((caption.end - caption.start) * fps));

  const accent = ACCENT[product];
  const dim = env === "light" ? INK.onLightDim : INK.onDarkDim;
  const settled = env === "light" ? INK.onLight : INK.onDark;
  const emph = env === "light" ? accent.key : accent.glow;

  const words = caption.t.split(/\s+/).filter(Boolean);

  // Which words carry the emphasis. `e` is a substring of the caption, so it
  // may span several words ("one cue mix", "A, B, C").
  const emphSet = React.useMemo(() => {
    const s = new Set<number>();
    if (!caption.e) return s;
    const target = caption.e.split(/\s+/).filter(Boolean);
    const norm = (x: string) => x.replace(/[^\w.,]/g, "").toLowerCase();
    for (let i = 0; i + target.length <= words.length; i++) {
      if (target.every((tw, k) => norm(words[i + k]) === norm(tw))) {
        for (let k = 0; k < target.length; k++) s.add(i + k);
        break;
      }
    }
    return s;
  }, [caption.e, caption.t]);

  // Character-weighted word slots — longer words take proportionally longer.
  const slots = React.useMemo(() => {
    const lens = words.map((w) => Math.max(2, w.length));
    const total = lens.reduce((a, b) => a + b, 0);
    // Words land across the first 78% of the caption; the tail is the hold,
    // so the finished line is legible before it leaves.
    const usable = durF * 0.78;
    let acc = 0;
    return lens.map((l) => {
      const at = (acc / total) * usable;
      acc += l;
      return at;
    });
  }, [caption.t, durF]);

  // Whole-line entrance and exit.
  const lineIn = spring({ frame: local, fps, config: { damping: 200, mass: 0.5 }, durationInFrames: 9 });
  const outAt = durF - 6;
  const lineOut = local > outAt ? interpolate(local, [outAt, durF], [1, 0], { extrapolateRight: "clamp" }) : 1;

  return (
    <div
      style={{
        width: width ?? "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: `${size * 0.09}px ${size * 0.24}px`,
        justifyContent: align === "center" ? "center" : "flex-start",
        opacity: lineOut,
        fontFamily: FONT.ui,
      }}
    >
      {words.map((w, i) => {
        const at = slots[i];
        const isEmph = emphSet.has(i);

        // The word's own arrival.
        const p = spring({
          frame: local - at,
          fps,
          config: { damping: 190, mass: 0.42, stiffness: 130 },
          durationInFrames: 12,
        });

        const landed = p > 0.02;
        const color = !landed ? dim : isEmph ? emph : settled;
        const weight = !landed
          ? 300
          : isEmph
            ? TYPE.captionEmph.weight
            : TYPE.caption.weight;

        // Emphasis words come in a touch larger and settle back — the accent
        // beat the reference gives its red word.
        const overshoot = isEmph ? interpolate(p, [0, 0.55, 1], [0.86, 1.06, 1]) : interpolate(p, [0, 1], [0.94, 1]);
        const rise = interpolate(p, [0, 1], [size * 0.16, 0]);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: size,
              lineHeight: TYPE.caption.line,
              letterSpacing: isEmph ? TYPE.captionEmph.track : TYPE.caption.track,
              fontWeight: weight,
              color,
              transform: `translateY(${rise}px) scale(${overshoot})`,
              transformOrigin: "50% 80%",
              opacity: lineIn,
              // The reference's accent words glow on the black ground and sit
              // flat on the cream one.
              textShadow:
                env === "dark"
                  ? isEmph
                    ? `0 0 ${size * 0.42}px ${accent.glow}88, 0 0 ${size * 0.13}px ${accent.glow}55`
                    : `0 0 ${size * 0.30}px rgba(255,255,255,0.20)`
                  : "none",
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
