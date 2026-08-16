import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { COLORS, SAFE, VIDEO, PRICING, BRAND, CHAPTER } from "./theme";
import { FontGate } from "./components/Shell";
import * as F from "./fonts";

/**
 * Portrait thumbnails, 1080×1920, one per part. Same locked type system, same
 * light palette, same safe-zone logic as the reels. No logo files anywhere.
 */
const ThumbShell: React.FC<{
  accent: string;
  part: string;
  chapter: string;
  productLine: string[];
  hero: string;
  heroSecondary?: string;
  claim: string;
  specChips: string[];
  pricing: { mop: string; note: string; applies: string }[];
  heroFit?: "cover" | "contain";
}> = ({ accent, part, chapter, productLine, hero, heroSecondary, claim, specChips, pricing, heroFit = "cover" }) => (
  <FontGate>
    <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
      {/* ground */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(118% 74% at 50% 30%, ${COLORS.paperLift} 0%, ${COLORS.paper} 56%, ${COLORS.paperSink} 100%)`,
        }}
      />
      {/* ambient top/bottom bands — non-critical only */}
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: SAFE.top, overflow: "hidden", opacity: 0.28, filter: "blur(30px) saturate(0.7)" }}>
        <Img src={staticFile(`images/${hero}`)} style={{ width: "116%", height: "250%", objectFit: "cover", transform: "translate(-8%,-16%)" }} />
      </div>
      <div style={{ position: "absolute", top: SAFE.bottom, left: 0, width: "100%", height: VIDEO.height - SAFE.bottom, overflow: "hidden", opacity: 0.24, filter: "blur(34px) saturate(0.7)" }}>
        <Img src={staticFile(`images/${hero}`)} style={{ width: "116%", height: "290%", objectFit: "cover", transform: "translate(-6%,-48%)" }} />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: SAFE.top + 80, background: `linear-gradient(to bottom, transparent, ${COLORS.paper})` }} />
      <div style={{ position: "absolute", top: SAFE.bottom - 80, left: 0, width: "100%", height: VIDEO.height - SAFE.bottom + 80, background: `linear-gradient(to top, transparent, ${COLORS.paper})` }} />

      {/* safe content area */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top,
          left: SAFE.marginX,
          width: SAFE.width,
          height: SAFE.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ ...F.micro(21, "#FFFFFF", 800, "0.2em"), background: accent, padding: "10px 18px", borderRadius: 999 }}>
              {part}
            </div>
            <div style={{ ...F.micro(21, COLORS.graphite, 700, "0.2em") }}>{chapter}</div>
          </div>

          <div style={{ height: 24 }} />
          {productLine.map((l, i) => (
            <div key={i} style={{ ...F.headline(i === 0 ? 92 : 116, COLORS.ink, i === 0 ? 600 : 700) }}>{l}</div>
          ))}

          <div style={{ height: 20 }} />
          <div style={{ width: 300, height: 6, background: accent, borderRadius: 999 }} />
          <div style={{ height: 22 }} />
          <div style={{ ...F.sub(42, COLORS.inkSoft, 500), maxWidth: 860 }}>{claim}</div>
        </div>

        {/* hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div
            style={{
              width: "100%",
              height: heroSecondary ? 300 : 380,
              borderRadius: 28,
              overflow: "hidden",
              background: COLORS.chassis,
              border: `1px solid ${COLORS.paperEdge}`,
              boxShadow: `0 26px 60px ${COLORS.shadow}`,
            }}
          >
            <Img src={staticFile(`images/${hero}`)} style={{ width: "100%", height: "100%", objectFit: heroFit }} />
          </div>
          {heroSecondary ? (
            <div
              style={{
                width: "100%",
                height: 150,
                borderRadius: 22,
                overflow: "hidden",
                background: COLORS.chassis,
                border: `1px solid ${COLORS.paperEdge}`,
                boxShadow: `0 18px 42px ${COLORS.shadow}`,
              }}
            >
              <Img src={staticFile(`images/${heroSecondary}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {specChips.map((c) => (
              <div
                key={c}
                style={{
                  ...F.micro(19, COLORS.inkSoft, 700, "0.14em"),
                  padding: "11px 18px",
                  borderRadius: 999,
                  background: COLORS.paperLift,
                  border: `2px solid ${COLORS.paperEdge}`,
                }}
              >
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* pricing + primary URL */}
        <div>
          <div style={{ display: "flex", gap: 14 }}>
            {pricing.map((p) => (
              <div
                key={p.mop}
                style={{
                  flex: 1,
                  padding: "22px 24px",
                  borderRadius: 22,
                  background: COLORS.paperLift,
                  border: `2px solid ${COLORS.paperEdge}`,
                  boxShadow: `0 14px 34px ${COLORS.shadow}`,
                }}
              >
                <div style={{ ...F.micro(15, COLORS.graphite, 700, "0.16em") }}>{p.applies}</div>
                <div style={{ ...F.spec(pricing.length > 1 ? 46 : 58, COLORS.ink), marginTop: 8 }}>{p.mop}</div>
                <div style={{ ...F.body(19, COLORS.graphite), marginTop: 4 }}>{p.note}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 18 }} />
          <div style={{ ...F.cta(46, COLORS.ink) }}>{BRAND.website}</div>
          <div style={{ ...F.body(20, COLORS.graphite, 600), marginTop: 8, maxWidth: 880 }}>
            {BRAND.name} — {BRAND.designationShort}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  </FontGate>
);

export const Thumbnail1: React.FC = () => (
  <ThumbShell
    accent={CHAPTER[1].key}
    part="PART 1 OF 3"
    chapter="THE SOURCE"
    productLine={["MOTU", "10pre"]}
    claim="Ten preamps, +74 dB of gain, and the same engine as every interface in the series."
    hero="motu-10pre-newly-added-3.png"
    heroSecondary="motu-10pre-newly-added-1.png"
    specChips={["26 IN / 28 OUT", "10 × XLR/TRS COMBO", "-129 dBu EIN", "~1.8 ms RTL", "MILAN AVB"]}
    pricing={[{ ...PRICING.interface, applies: "MOTU 16A · 848 · 10pre" }]}
  />
);

export const Thumbnail2: React.FC = () => (
  <ThumbShell
    accent={CHAPTER[2].key}
    part="PART 2 OF 3"
    chapter="THE MATRIX"
    productLine={["MOTU", "16A"]}
    claim="Thirty-two in, thirty-four out, zero microphone preamps — a box built purely to move signal."
    hero="motu-16a-newly-added-3.png"
    heroSecondary="motu-16a-newly-added-1.png"
    heroFit="contain"
    specChips={["32 IN / 34 OUT", "16 × BALANCED TRS", "DUAL 3.9\" TFT", "ADAT / S-MUX", "MILAN AVB"]}
    pricing={[{ ...PRICING.interface, applies: "MOTU 16A · 848 · 10pre" }]}
  />
);

export const Thumbnail3: React.FC = () => (
  <ThumbShell
    accent={CHAPTER[3].key}
    part="PART 3 OF 3"
    chapter="THE COMMAND CENTER"
    productLine={["MOTU", "848"]}
    claim="Talkback, A/B/C monitoring and 7.1.4 out — plus the AVB Switch that scales the whole network."
    hero="motu-848-newly-added-1.jpg"
    heroSecondary="motu-avb-switch-1.jpg"
    heroFit="contain"
    specChips={["28 IN / 32 OUT", "4 × MIC COMBO", "12 LINE OUT · 7.1.4", "6 AVB PORTS", "gPTP SYNC"]}
    pricing={[
      { ...PRICING.interface, applies: "MOTU 16A · 848 · 10pre" },
      { ...PRICING.switch, applies: "MOTU AVB SWITCH" },
    ]}
  />
);
