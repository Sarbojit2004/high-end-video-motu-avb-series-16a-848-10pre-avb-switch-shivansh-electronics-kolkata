import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ACCENT, CONTACT, FONT, GROUND, INK, SAFE, TYPE, VIDEO, type ProductKey } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT IDENTIFICATION + BRANDING CHROME
//
// The brief's hardest constraint (Section 4, "mandatory"): three of the four
// products are the same 1U chassis, photographed from the same angles, running
// the same software. A viewer landing on a random frame must still be able to
// say which one they are looking at.
//
// Four things carry that, all present on every hardware frame:
//
//   1. ProductRule  — a persistent name plate, not a one-off title card. It is
//      on screen for the whole of that product's segment.
//   2. Accent colour — the segment's captions, rule, grid tint and particles
//      are all one hue, held for the segment (see theme.ts ACCENT).
//   3. A spec stripe under the name that says what makes THIS one different
//      ("NO PREAMPS · 16 LINE IN" vs "4 PREAMPS · A/B/C" vs "10 PREAMPS").
//      The name alone does not differentiate three near-identical boxes; the
//      differentiator does.
//   4. Segment progress — a hairline that fills across the segment, so the
//      viewer knows where they are in a three-minute piece.
//
// Plus the standing brand mark: at a 3-minute runtime a viewer who arrives
// halfway through should be able to identify the source without waiting for
// the close (Section 7).
// ─────────────────────────────────────────────────────────────────────────────

type Env = "light" | "dark";

export const ProductRule: React.FC<{
  product: ProductKey;
  env: Env;
  name: string;
  /** The one-line differentiator for this product. */
  spec?: string;
  /** 0..1 progress through the segment. */
  progress: number;
  /** Entrance progress 0..1. */
  intro: number;
}> = ({ product, env, name, spec, progress, intro }) => {
  const accent = ACCENT[product];
  const key = env === "light" ? accent.key : accent.glow;
  const ink = env === "light" ? INK.onLight : INK.onDark;
  const soft = env === "light" ? INK.onLightSoft : INK.onDarkSoft;
  const rail = env === "light" ? "rgba(24,22,20,0.16)" : "rgba(255,255,255,0.16)";

  const slide = interpolate(intro, [0, 1], [-70, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x,
        top: SAFE.top - 190,
        width: SAFE.w,
        opacity: intro,
        transform: `translateX(${slide}px)`,
        fontFamily: FONT.ui,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        {/* accent tab — the colour that owns this whole segment */}
        <div
          style={{
            width: 12,
            height: 62,
            borderRadius: 6,
            background: key,
            boxShadow: env === "dark" ? `0 0 26px ${key}` : "none",
          }}
        />
        <div>
          <div
            style={{
              fontSize: TYPE.chapter.size,
              fontWeight: TYPE.chapter.weight,
              letterSpacing: TYPE.chapter.track,
              color: ink,
              textTransform: "uppercase",
            }}
          >
            {name}
          </div>
          {spec ? (
            <div
              style={{
                marginTop: 8,
                fontSize: TYPE.micro.size,
                fontWeight: 700,
                letterSpacing: TYPE.micro.track,
                color: key,
                textTransform: "uppercase",
              }}
            >
              {spec}
            </div>
          ) : null}
        </div>
      </div>

      {/* segment progress hairline */}
      <div style={{ position: "relative", marginTop: 26, height: 4, background: rail, borderRadius: 2 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: 4,
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
            background: key,
            borderRadius: 2,
            boxShadow: env === "dark" ? `0 0 16px ${key}` : "none",
          }}
        />
      </div>
    </div>
  );
};

/**
 * The standing brand mark. Small, corner-set, present through the whole film
 * so a viewer arriving mid-scroll knows whose reel this is (Section 7).
 */
export const StandingMark: React.FC<{ env: Env; opacity?: number }> = ({ env, opacity = 1 }) => {
  const ink = env === "light" ? INK.onLightSoft : INK.onDarkSoft;
  const logo = "logos/shivansh.png";
  const motu = "logos/motu.png";
  // The marks are white-plate artwork; on cream they need a shadow to separate.
  const shadow =
    env === "light"
      ? "drop-shadow(0 3px 10px rgba(20,18,14,0.20))"
      : "drop-shadow(0 3px 14px rgba(0,0,0,0.6))";

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x,
        bottom: SAFE.bottom - 210,
        display: "flex",
        alignItems: "center",
        gap: 32,
        opacity: opacity * 0.82,
        fontFamily: FONT.ui,
      }}
    >
      <Img src={staticFile(logo)} style={{ height: 74, width: "auto", filter: shadow }} />
      <div style={{ width: 3, height: 54, background: ink, opacity: 0.4 }} />
      <Img src={staticFile(motu)} style={{ height: 62, width: "auto", filter: shadow }} />
      <div
        style={{
          fontSize: 31,
          fontWeight: 700,
          letterSpacing: 3.0,
          color: ink,
          textTransform: "uppercase",
        }}
      >
        {CONTACT.site}
      </div>
    </div>
  );
};

/** The WhatsApp glyph, drawn rather than imported so it stays crisp at 4K. */
export const WhatsAppIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16.02 3.2C8.96 3.2 3.23 8.93 3.23 15.99c0 2.26.59 4.46 1.72 6.4L3.14 28.8l6.57-1.72a12.74 12.74 0 0 0 6.31 1.66h.01c7.05 0 12.79-5.73 12.79-12.79 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.05-3.7Zm0 23.34h-.01c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.6 10.6 0 0 1-1.63-5.67c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.56 10.56 0 0 1 3.11 7.52c0 5.87-4.77 10.64-10.64 10.64Z"
      fill={color}
    />
    <path
      d="M21.85 18.66c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.71.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.89-1.78-2.21-.19-.32-.02-.5.14-.66.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.53-.71-.54l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.65 0 1.56 1.14 3.07 1.3 3.28.16.21 2.25 3.43 5.44 4.81.76.33 1.35.52 1.81.67.76.24 1.46.21 2.01.13.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z"
      fill={color}
    />
  </svg>
);

/** Globe/website glyph. */
export const SiteIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12.4" stroke={color} strokeWidth="2.1" />
    <ellipse cx="16" cy="16" rx="5.1" ry="12.4" stroke={color} strokeWidth="2.1" />
    <path d="M4.3 12.1h23.4M4.3 19.9h23.4" stroke={color} strokeWidth="2.1" strokeLinecap="round" />
  </svg>
);
