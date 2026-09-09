import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ACCENT, CONTACT, FONT, GROUND, INK, SAFE, VIDEO } from "./theme.ts";
import { ASSETS } from "./assets.ts";
import { GridField, Particles } from "./components/Environment.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// THE THUMBNAIL (Section 9) — 2160 x 3840, the reel's own aspect.
//
// The brief is specific about what this has to do:
//   * represent the ECOSYSTEM, not one hero product, because the relationship
//     between the four is the film's actual subject
//   * use the reference video's visual language so it reads as belonging to
//     this reel and not to a generic product shot
//   * carry both logos at a small legible scale
//   * survive being shrunk to a phone's feed thumbnail
//
// The last one governs everything else. At feed size this image is roughly
// 200 px wide, which means: one very large number as the focal point, one
// short line of type, four silhouettes arranged so the count reads instantly,
// and maximum tonal contrast. The dark environment is chosen over the cream
// for exactly that reason — a black field with four lit chassis and one
// oversized figure holds together at 10% scale, where a cream field with fine
// grid texture would turn to mush.
// ─────────────────────────────────────────────────────────────────────────────

const heroFor = (product: string) => {
  const pool = ASSETS.filter((a) => a.product === product);
  return (
    pool.find((a) => a.kind === "strip") ??
    pool.find((a) => a.kind === "cutout") ??
    pool[0]
  );
};

const STACK = [
  { key: "p16a", label: "16A", spec: "0 PREAMPS" },
  { key: "p848", label: "848", spec: "4 PREAMPS" },
  { key: "p10pre", label: "10pre", spec: "10 PREAMPS" },
  { key: "pswitch", label: "AVB SWITCH", spec: "6 PORTS" },
] as const;

export const Thumbnail: React.FC = () => {
  const env = "dark" as const;

  return (
    <AbsoluteFill style={{ background: GROUND.dark, fontFamily: FONT.ui, overflow: "hidden" }}>
      {/* The void, lit from above — the reference's dark environment. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 44% at 50% 30%, rgba(90,155,255,0.20) 0%, rgba(31,95,208,0.08) 36%, #0A0A0C 74%)",
        }}
      />
      <GridField env={env} product="pswitch" extent={1.0} y={0.36} opacity={0.85} />
      <Particles env={env} product="pswitch" seed="thumb" count={34} cy={0.36} spread={0.46} />

      {/* ── the count, as the focal point ──────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          width: VIDEO.width,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 132,
            fontWeight: 800,
            letterSpacing: 14,
            color: ACCENT.pswitch.glow,
            textShadow: `0 0 70px ${ACCENT.pswitch.glow}88`,
          }}
        >
          FOUR PRODUCTS
        </div>
        <div
          style={{
            fontSize: 300,
            fontWeight: 800,
            letterSpacing: -12,
            lineHeight: 0.94,
            color: INK.onDark,
            textShadow: "0 0 90px rgba(255,255,255,0.30)",
            paddingTop: 14,
          }}
        >
          ONE
          <br />
          NETWORK
        </div>
      </div>

      {/* ── the four products, stacked so the count reads instantly ─────── */}
      <div
        style={{
          position: "absolute",
          top: 1310,
          left: SAFE.x,
          width: SAFE.w,
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        {STACK.map((p) => {
          const a = heroFor(p.key);
          const accent = ACCENT[p.key];
          return (
            <div
              key={p.key}
              style={{
                position: "relative",
                height: 372,
                borderRadius: 30,
                overflow: "hidden",
                background: GROUND.darkLift,
                border: `3px solid ${accent.glow}44`,
                boxShadow: `0 22px 54px rgba(0,0,0,0.85), 0 0 90px ${accent.glow}1E`,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Img
                src={staticFile(`images/${a.file}`)}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: a.ar > 3.4 ? "contain" : "cover",
                  padding: a.ar > 3.4 ? "0 26px" : 0,
                }}
              />
              {/* A left-hand scrim so the label always has contrast to sit on. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(90deg, rgba(6,6,8,0.94) 0%, rgba(6,6,8,0.72) 34%, rgba(6,6,8,0.08) 68%)`,
                }}
              />
              <div style={{ position: "relative", paddingLeft: 46 }}>
                <div
                  style={{
                    fontSize: 92,
                    fontWeight: 800,
                    letterSpacing: -2,
                    color: INK.onDark,
                    lineHeight: 1,
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    letterSpacing: 4,
                    color: accent.glow,
                    paddingTop: 12,
                    textShadow: `0 0 30px ${accent.glow}77`,
                  }}
                >
                  {p.spec}
                </div>
              </div>
              {/* the segment's accent tab, mirroring the reel's product rule */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 12,
                  background: accent.glow,
                  boxShadow: `0 0 30px ${accent.glow}`,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* ── branding, small and legible ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 250,
          left: 0,
          width: VIDEO.width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
        }}
      >
        <Img src={staticFile("logos/shivansh.png")} style={{ height: 104, width: "auto" }} />
        <div style={{ width: 3, height: 78, background: "rgba(255,255,255,0.24)" }} />
        <Img src={staticFile("logos/motu.png")} style={{ height: 86, width: "auto" }} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 168,
          left: 0,
          width: VIDEO.width,
          textAlign: "center",
          fontSize: 32,
          fontWeight: 600,
          letterSpacing: 5,
          color: INK.onDarkSoft,
          textTransform: "uppercase",
        }}
      >
        {CONTACT.site}
      </div>
    </AbsoluteFill>
  );
};
