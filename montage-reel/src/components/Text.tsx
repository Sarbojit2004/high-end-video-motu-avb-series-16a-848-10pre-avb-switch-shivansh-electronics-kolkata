import React from "react";
import { useCurrentFrame } from "remotion";
import { FONT } from "../design/fonts.ts";
import { rgba, SCRIM_ALPHA } from "../design/palette.ts";
import { easeOut, ramp } from "./Picture.tsx";

/** Largest font size (≤ base) at which `text` fits `maxWidth`, given an average glyph width in em. */
export const fitSize = (text: string, maxWidth: number, base: number, em: number) => Math.min(base, Math.floor(maxWidth / (Math.max(1, text.length) * em)));

/**
 * Kinetic type (brief §5 "text never simply appears"). Each card builds in with
 * a purposeful move — a scale-punch, a wipe, a letter stagger — sized to the
 * energy of the transition that preceded it, then holds still and legible.
 */

/** Per-letter stagger: each glyph rises + unblurs, `stagger` frames apart. */
export const Stagger: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  rise?: number;
  perLetter?: number;
  style?: React.CSSProperties;
}> = ({ text, start, stagger = 2, rise = 0.35, perLetter = 10, style }) => {
  const frame = useCurrentFrame();
  return (
    <span style={{ display: "inline-block", whiteSpace: "pre", ...style }}>
      {[...text].map((ch, i) => {
        const t = easeOut((frame - start - i * stagger) / perLetter);
        return (
          <span key={i} style={{ display: "inline-block", opacity: t, transform: `translateY(${(1 - t) * rise}em) scale(${0.85 + 0.15 * t})`, filter: t < 1 ? `blur(${(1 - t) * 10}px)` : "none" }}>
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </span>
  );
};

/** Scale-punch in: 1.25 → 1.0 with a 3-frame overshoot, opacity 0 → 1. */
export const Punch: React.FC<{ start: number; frames?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ start, frames = 9, children, style }) => {
  const frame = useCurrentFrame();
  const t = easeOut((frame - start) / frames);
  const over = frame - start > frames && frame - start < frames + 4 ? 1 - (frame - start - frames) / 4 : 0;
  return <div style={{ opacity: t, transform: `scale(${1.28 - 0.28 * t + over * 0.03})`, transformOrigin: "50% 50%", ...style }}>{children}</div>;
};

/** Wipe reveal: clip-path sweeps in the given direction over `frames`. */
export const Wipe: React.FC<{ start: number; frames?: number; dir?: "l" | "r" | "u" | "d"; children: React.ReactNode; style?: React.CSSProperties }> = ({ start, frames = 12, dir = "r", children, style }) => {
  const frame = useCurrentFrame();
  const t = easeOut((frame - start) / frames);
  const p = (1 - t) * 100;
  const clip = dir === "r" ? `inset(0 ${p}% 0 0)` : dir === "l" ? `inset(0 0 0 ${p}%)` : dir === "d" ? `inset(0 0 ${p}% 0)` : `inset(${p}% 0 0 0)`;
  return <div style={{ clipPath: clip, WebkitClipPath: clip, ...style }}>{children}</div>;
};

/** Scrim behind type that sits over a photograph (brief §4): tight to the text block, never full-frame. */
export const Scrim: React.FC<{ color: string; children: React.ReactNode; pad?: number; radius?: number; style?: React.CSSProperties }> = ({ color, children, pad = 36, radius = 18, style }) => (
  <div style={{ display: "inline-block", background: rgba(color, SCRIM_ALPHA), padding: `${pad * 0.7}px ${pad}px`, borderRadius: radius, backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", boxShadow: `0 30px 80px ${rgba("#000", 0.35)}`, ...style }}>{children}</div>
);

/** Product-name card: grotesk (Telegraf/Bricolage) or Alfa Slab headline + Tinos subtitle at a fraction of the scale. */
export const TitleCard: React.FC<{
  value: string;
  sub?: string;
  face?: "display" | "grotesk";
  ink: string;
  ink2: string;
  accent: string;
  start: number;
  size?: number;
  align?: "left" | "center";
  scrim?: string;
  maxWidth?: number;
}> = ({ value, sub, face = "grotesk", ink, ink2, accent, start, size: base = 300, align = "left", scrim, maxWidth = 1800 }) => {
  const frame = useCurrentFrame();
  const size = fitSize(value, maxWidth, base, face === "display" ? 0.72 : 0.64);
  const bar = easeOut((frame - start - 4) / 12);
  const subT = easeOut((frame - start - 10) / 12);
  const family = face === "display" ? FONT.display : FONT.grotesk;
  const inner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", textAlign: align }}>
      <div style={{ fontFamily: family, fontWeight: 800, fontSize: size, lineHeight: 0.92, letterSpacing: face === "display" ? "0.005em" : "-0.03em", color: ink, textTransform: "uppercase" }}>
        <Stagger text={value} start={start} stagger={1.5} perLetter={7} />
      </div>
      <div style={{ height: 10, width: `${bar * 100}%`, maxWidth: size * 1.6, background: accent, marginTop: size * 0.12, transformOrigin: "left", alignSelf: align === "center" ? "center" : "flex-start" }} />
      {sub ? (
        <div style={{ fontFamily: FONT.classic, fontSize: size * 0.2, letterSpacing: "0.18em", textTransform: "uppercase", color: ink2, marginTop: size * 0.1, opacity: subT, transform: `translateY(${(1 - subT) * 20}px)` }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
  return scrim ? <Scrim color={scrim} pad={size * 0.2}>{inner}</Scrim> : inner;
};

/** Alfa Slab One hero word — the "IMPACT" scale treatment. */
export const HeroWord: React.FC<{ value: string; ink: string; start: number; size?: number; sub?: string; ink2?: string; outline?: boolean; maxWidth?: number }> = ({ value, ink, start, size: base = 620, sub, ink2, outline, maxWidth = 1900 }) => {
  const frame = useCurrentFrame();
  const longest = value.split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), "");
  const size = fitSize(longest, maxWidth, base, 0.72);
  const subT = easeOut((frame - start - 14) / 12);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
      <Punch start={start} frames={8}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: size,
            lineHeight: 0.9,
            color: outline ? "transparent" : ink,
            WebkitTextStroke: outline ? `6px ${ink}` : undefined,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            whiteSpace: "pre-wrap",
          }}
        >
          {value.split(/\s+/).map((w, i) => <div key={i}>{w}</div>)}
        </div>
      </Punch>
      {sub ? (
        <div style={{ fontFamily: FONT.classic, fontSize: size * 0.11, letterSpacing: "0.3em", textTransform: "uppercase", color: ink2 ?? ink, marginTop: size * 0.14, opacity: subT, transform: `translateY(${(1 - subT) * 24}px)` }}>{sub}</div>
      ) : null}
    </div>
  );
};

/** Serif contrast voice (Bodoni Moda): one word, full-bleed, breathing room. */
export const MoodWord: React.FC<{ value: string; ink: string; start: number; size?: number; italic?: boolean; maxWidth?: number }> = ({ value, ink, start, size: base = 520, italic = true, maxWidth = 1900 }) => {
  const frame = useCurrentFrame();
  const size = fitSize(value, maxWidth, base, 0.56);
  const t = easeOut((frame - start) / 26);
  const track = 0.16 - 0.1 * t;
  return (
    <div style={{ fontFamily: FONT.serif, fontStyle: italic ? "italic" : "normal", fontWeight: 500, fontSize: size, lineHeight: 1, color: ink, letterSpacing: `${track}em`, opacity: t, transform: `scale(${0.94 + 0.06 * t})`, textAlign: "center", whiteSpace: "nowrap" }}>
      {value}
    </div>
  );
};

/** Caveat script tagline — used once, Act V. */
export const ScriptLine: React.FC<{ value: string; ink: string; start: number; size?: number; maxWidth?: number }> = ({ value, ink, start, size: base = 300, maxWidth = 1800 }) => {
  const size = fitSize(value, maxWidth, base, 0.42);
  return (
    <div style={{ fontFamily: FONT.script, fontWeight: 600, fontSize: size, lineHeight: 1, color: ink, transform: "rotate(-3deg)", whiteSpace: "nowrap" }}>
      <Stagger text={value} start={start} stagger={3} perLetter={12} rise={0.2} />
    </div>
  );
};

/** Small grotesk reference line (category label / product name in a rapid-fire run). */
export const Label: React.FC<{ value: string; ink: string; accent: string; start: number; size?: number; scrim?: string; style?: React.CSSProperties }> = ({ value, ink, accent, start, size = 92, scrim, style }) => {
  const frame = useCurrentFrame();
  const t = easeOut((frame - start) / 8);
  const inner = (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.4, fontFamily: FONT.grotesk, fontWeight: 700, fontSize: size, letterSpacing: "0.12em", textTransform: "uppercase", color: ink, opacity: t, transform: `translateX(${(1 - t) * -40}px)` }}>
      <span style={{ display: "inline-block", width: size * 0.9, height: 8, background: accent, transform: `scaleX(${t})`, transformOrigin: "left" }} />
      <span>{value}</span>
    </div>
  );
  return <div style={style}>{scrim ? <Scrim color={scrim} pad={size * 0.5} radius={12}>{inner}</Scrim> : inner}</div>;
};

/** UI/label microtype — contacts and small persistent branding only. */
export const Micro: React.FC<{ children: React.ReactNode; ink: string; size?: number; weight?: number; style?: React.CSSProperties }> = ({ children, ink, size = 64, weight = 500, style }) => (
  <div style={{ fontFamily: FONT.micro, fontWeight: weight, fontSize: size, letterSpacing: "0.06em", color: ink, ...style }}>{children}</div>
);

export const fade = (frame: number, start: number, frames = 10) => ramp(frame, start, start + frames);
