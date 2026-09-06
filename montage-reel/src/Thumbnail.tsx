import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { WIDTH, HEIGHT } from "./data/grid.ts";
import { ACT_PALETTES, rgba } from "./design/palette.ts";
import { FONT, useFonts } from "./design/fonts.ts";
import { Picture } from "./components/Picture.tsx";
import { LogoPair, BRAND } from "./components/Brand.tsx";
import { Grain } from "./components/Grain.tsx";

/**
 * ECOSYSTEM THUMBNAIL — 2160 × 3840, the reel's own cover frame.
 *
 * Same visual system as the reel, not a separate design: the Act 0 / Act V
 * bookend palette (Deep Navy ground, White + Cyan), the routing-line "signal"
 * motif, the grain pass, and the full typographic hierarchy of brief §2 —
 * Alfa Slab One hero, Tinos classical subtitle, grotesk product labels,
 * microtype for the URL.
 *
 * Content: all four products in one frame, arranged as the idea the reel is
 * about — three 1U interfaces stacked like a rack, their signal routed down
 * the gutters into the AVB Switch that ties them together.
 *
 * Everything here is static (no useCurrentFrame), so it renders identically as
 * a still at any frame.
 */

const P = ACT_PALETTES.act0;
const SAFE = 130;

// ── vertical layout (px on the 3840-tall canvas) ─────────────────────────────
const LOGO_TOP = 130;
const HERO_TOP = 430;
const HERO_SIZE = 520;
const SUB_SIZE = 190;
const TINOS_TOP = 1218;

const UNIT_W = 1620;
const UNIT_X = (WIDTH - UNIT_W) / 2;
const UNIT_H = Math.round(UNIT_W / 3.8911); // native aspect of the three hero cut-outs
const ROW_PITCH = 530;
const ROW0_LABEL = 1400;
const LABEL_TO_UNIT = 76;

const SWITCH_W = 900;
const SWITCH_H = 470;
const SWITCH_X = (WIDTH - SWITCH_W) / 2;
const SWITCH_Y = 3040;

const SWITCH_LABEL_Y = SWITCH_Y + SWITCH_H + 42;
const URL_Y = 3700;

const ROWS = [
  { slug: "motu-16a-new-3.png", label: "16A" },
  { slug: "motu-848-new-3.png", label: "848" },
  { slug: "motu-10pre-new-3.png", label: "10pre" },
] as const;

const rowLabelY = (i: number) => ROW0_LABEL + i * ROW_PITCH;
const rowUnitY = (i: number) => rowLabelY(i) + LABEL_TO_UNIT;
const rowCentreY = (i: number) => rowUnitY(i) + UNIT_H / 2;

/** Signal routed out of each unit, down a gutter, and into the switch. */
const Routing: React.FC = () => {
  const gutterL = 190;
  const gutterR = WIDTH - 190;
  const busY = SWITCH_Y + SWITCH_H / 2;
  const paths = [
    // 16A and 10pre leave to the left, 848 to the right — asymmetry keeps it
    // reading as routing rather than as a symmetrical diagram.
    { d: `M ${UNIT_X} ${rowCentreY(0)} H ${gutterL} V ${busY} H ${SWITCH_X}`, elbow: [gutterL, busY] },
    { d: `M ${UNIT_X + UNIT_W} ${rowCentreY(1)} H ${gutterR} V ${busY} H ${SWITCH_X + SWITCH_W}`, elbow: [gutterR, busY] },
    { d: `M ${UNIT_X} ${rowCentreY(2)} H ${gutterL + 70} V ${busY - 90} H ${SWITCH_X - 40}`, elbow: [gutterL + 70, busY - 90] },
  ];
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <filter id="thumb-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke={P.accent} strokeWidth={16} strokeLinejoin="round" strokeLinecap="round" opacity={0.35} filter="url(#thumb-glow)" />
          <path d={p.d} fill="none" stroke={P.accent} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
          <circle cx={p.elbow[0]} cy={p.elbow[1]} r={16} fill={P.ink} opacity={0.95} />
          <circle cx={p.elbow[0]} cy={p.elbow[1]} r={34} fill={P.accent} opacity={0.28} filter="url(#thumb-glow)" />
        </g>
      ))}
    </svg>
  );
};

export const Thumbnail: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{ background: P.bg[0], overflow: "hidden" }}>
      {/* the reel's breathing signal field, held at its brightest */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 85% 45% at 50% 30%, ${rgba(P.accent, 0.26)} 0%, ${rgba(P.accent, 0.07)} 40%, transparent 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 26% at 50% ${((SWITCH_Y + SWITCH_H / 2) / HEIGHT) * 100}%, ${rgba(P.accent, 0.3)} 0%, transparent 65%)`,
        }}
      />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, transparent 55%, ${rgba("#000000", 0.35)} 100%)` }} />

      <Routing />

      {/* both logos, as in Act 0 / Act V */}
      <div style={{ position: "absolute", top: LOGO_TOP, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <LogoPair start={-100} width={520} gap={44} />
      </div>

      {/* hero: Alfa Slab One, the reel's display voice */}
      <div style={{ position: "absolute", top: HERO_TOP, left: SAFE, right: SAFE, textAlign: "center" }}>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: HERO_SIZE,
            lineHeight: 0.88,
            color: P.ink,
            letterSpacing: "0.01em",
            textShadow: `0 0 120px ${rgba(P.accent, 0.55)}, 0 30px 80px ${rgba("#000", 0.6)}`,
          }}
        >
          AVB
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: SUB_SIZE,
            lineHeight: 1.05,
            color: P.accent,
            letterSpacing: "0.07em",
            marginTop: 24,
          }}
        >
          ECOSYSTEM
        </div>
      </div>

      {/* classical serif pairing line — names every product in text */}
      <div
        style={{
          position: "absolute",
          top: TINOS_TOP,
          left: SAFE,
          right: SAFE,
          textAlign: "center",
          fontFamily: FONT.classic,
          fontSize: 80,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: P.ink,
          opacity: 0.92,
        }}
      >
        16A · 848 · 10pre · AVB Switch
      </div>

      {/* three 1U interfaces, stacked like a rack */}
      {ROWS.map((row, i) => (
        <React.Fragment key={row.slug}>
          <div
            style={{
              position: "absolute",
              left: UNIT_X,
              top: rowLabelY(i),
              display: "flex",
              alignItems: "center",
              gap: 26,
              fontFamily: FONT.grotesk,
              fontWeight: 800,
              fontSize: 64,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: P.accent,
            }}
          >
            <span style={{ display: "inline-block", width: 56, height: 7, background: P.accent }} />
            <span>{row.label}</span>
          </div>
          <div
            style={{
              position: "absolute",
              left: UNIT_X,
              top: rowUnitY(i),
              width: UNIT_W,
              height: UNIT_H,
              filter: `drop-shadow(0 30px 60px ${rgba("#000", 0.65)})`,
            }}
          >
            <Img src={staticFile(`images/${row.slug}`)} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
          </div>
        </React.Fragment>
      ))}

      {/* the switch that ties them together — its own white ground, as a plate */}
      <div
        style={{
          position: "absolute",
          left: SWITCH_X,
          top: SWITCH_Y,
          width: SWITCH_W,
          height: SWITCH_H,
          borderRadius: 32,
          overflow: "hidden",
          boxShadow: `0 40px 110px ${rgba("#000", 0.6)}, 0 0 0 6px ${rgba(P.accent, 0.55)}, 0 0 90px ${rgba(P.accent, 0.45)}`,
        }}
      >
        <Picture slug="motu-avb-switch-2.jpg" width={SWITCH_W} height={SWITCH_H} ground="#ffffff" drift={0} localFrame={0} />
      </div>
      <div
        style={{
          position: "absolute",
          top: SWITCH_LABEL_Y,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT.grotesk,
          fontWeight: 800,
          fontSize: 64,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: P.ink,
        }}
      >
        AVB Switch
      </div>

      {/* microtype: the only small persistent branding line */}
      <div
        style={{
          position: "absolute",
          top: URL_Y,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT.micro,
          fontWeight: 500,
          fontSize: 62,
          letterSpacing: "0.08em",
          color: P.accent,
        }}
      >
        {BRAND.website}
      </div>

      <Grain opacity={0.07} />
      <Img src={staticFile("branding/grain.png")} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
    </AbsoluteFill>
  );
};
