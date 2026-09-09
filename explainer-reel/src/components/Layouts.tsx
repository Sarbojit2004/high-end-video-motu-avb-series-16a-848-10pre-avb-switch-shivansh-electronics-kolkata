import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, FONT, GROUND, INK, SAFE, VIDEO, type ProductKey } from "../theme.ts";
import type { Asset } from "../assets.ts";
import { StagedCutout, StagedPlate, PanelRun } from "./Staged.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// MULTI-IMAGE LAYOUTS
//
// A grid shot is ONE COMPOSITION THAT ASSEMBLES, not a burst of cuts. That
// distinction is what lets this reel cover 120 images in 180 seconds without
// becoming the montage it is explicitly not supposed to be: the cells arrive in
// sequence over about a second, and then the whole board holds for the rest of
// the shot while the narration talks over it. The viewer reads a composed board
// of detail shots, not seven cuts.
//
// At 2160 px wide a three-column grid gives ~640 px cells and a two-column grid
// ~950 px, both of which are large enough to actually read a connector row —
// which is the whole point of the tier existing.
// ─────────────────────────────────────────────────────────────────────────────

/** The band of the frame that visual content lives in. */
export const BAND = { top: 540, bottom: 2330, get h() { return this.bottom - this.top; } };

type LayoutProps = {
  assets: Asset[];
  env: "light" | "dark";
  product: ProductKey;
  /** frames since the shot began */
  f: number;
  /** total frames of the shot */
  dur: number;
  seed: number;
};

const cell = (env: "light" | "dark", accent: ReturnType<typeof Object>) => ({});

/** A single framed plate inside a grid or strip. */
const Cell: React.FC<{
  asset: Asset;
  env: "light" | "dark";
  product: ProductKey;
  x: number; y: number; w: number; h: number;
  delay: number;
  f: number;
  fps: number;
}> = ({ asset, env, product, x, y, w, h, delay, f, fps }) => {
  const accent = ACCENT[product];
  const p = spring({ frame: f - delay, fps, config: { damping: 200, mass: 0.6, stiffness: 90 }, durationInFrames: 16 });
  const rise = interpolate(p, [0, 1], [56, 0]);
  const scale = interpolate(p, [0, 1], [0.90, 1]);
  // Each cell drifts a hair on its own phase so the board is never static.
  const drift = Math.sin((f + delay * 7) / 84) * 5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + rise + drift,
        width: w,
        height: h,
        opacity: p,
        transform: `scale(${scale})`,
        borderRadius: 22,
        overflow: "hidden",
        background: env === "light" ? GROUND.lightLift : GROUND.darkLift,
        boxShadow:
          env === "light"
            ? `0 ${h * 0.045}px ${h * 0.09}px rgba(20,18,14,0.22), inset 0 2px 0 rgba(255,255,255,0.5)`
            : `0 ${h * 0.05}px ${h * 0.1}px rgba(0,0,0,0.8), 0 0 ${w * 0.06}px ${accent.glow}1E, inset 0 2px 0 rgba(255,255,255,0.12)`,
      }}
    >
      <Img
        src={staticFile(`images/${asset.file}`)}
        style={{
          width: "100%",
          height: "100%",
          // Wide panel strips would be reduced to a sliver by `cover`, so they
          // are contained and given a little breathing room instead.
          objectFit: asset.ar > 3.4 ? "contain" : "cover",
          objectPosition: "center",
          padding: asset.ar > 3.4 ? "0 10px" : 0,
          background: asset.alpha
            ? env === "light"
              ? GROUND.lightSink
              : // a lit ground so a dark chassis separates from the cell
                "radial-gradient(ellipse at 50% 44%, #2A2A31 0%, #16161B 62%, #0E0E12 100%)"
            : "transparent",
          filter: asset.alpha && env === "dark" ? "brightness(1.14) contrast(1.04)" : "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(146deg, rgba(255,255,255,${env === "light" ? 0.13 : 0.07}) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,${env === "light" ? 0.06 : 0.22}) 100%)`,
        }}
      />
    </div>
  );
};

export const GridLayout: React.FC<LayoutProps> = ({ assets, env, product, f, dur, seed }) => {
  const { fps } = useVideoConfig();
  const n = assets.length;
  // Column count chosen so cells stay large enough to read.
  const cols = n <= 2 ? 1 : n <= 4 ? 2 : n <= 9 ? 3 : 4;
  const rows = Math.ceil(n / cols);

  const gap = 26;
  const padX = 150;
  const gw = (VIDEO.width - padX * 2 - gap * (cols - 1)) / cols;
  const gh = Math.min((BAND.h - gap * (rows - 1)) / rows, gw * 0.82);
  const totalH = gh * rows + gap * (rows - 1);
  const top = BAND.top + (BAND.h - totalH) / 2;

  // The board assembles over ~1 s, then holds.
  const stagger = Math.min(5, Math.max(2, Math.floor(30 / Math.max(1, n))));

  return (
    <>
      {assets.map((a, i) => (
        <Cell
          key={a.slug}
          asset={a}
          env={env}
          product={product}
          x={padX + (i % cols) * (gw + gap)}
          y={top + Math.floor(i / cols) * (gh + gap)}
          w={gw}
          h={gh}
          delay={i * stagger}
          f={f}
          fps={fps}
        />
      ))}
    </>
  );
};

export const StripLayout: React.FC<LayoutProps> = ({ assets, env, product, f, dur, seed }) => {
  const { fps } = useVideoConfig();
  const n = assets.length;
  const gap = 30;
  const padX = 150;
  const gw = (VIDEO.width - padX * 2 - gap * (n - 1)) / n;
  const gh = Math.min(BAND.h * 0.62, gw * 1.16);
  const top = BAND.top + (BAND.h - gh) / 2;

  return (
    <>
      {assets.map((a, i) => (
        <Cell
          key={a.slug}
          asset={a}
          env={env}
          product={product}
          x={padX + i * (gw + gap)}
          y={top}
          w={gw}
          h={gh}
          delay={i * 5}
          f={f}
          fps={fps}
        />
      ))}
    </>
  );
};

/**
 * Two images stacked — the front panel above, the rear panel below.
 *
 * This is the most informative shot type available for a 1U rack interface,
 * because "what is different about this one" is almost always answered by the
 * two panel runs read together.
 */
export const PairLayout: React.FC<LayoutProps> = ({ assets, env, product, f, dur, seed }) => {
  const p = dur > 0 ? f / dur : 0;
  const [a, b] = assets;
  return (
    <>
      <PanelRun asset={a} env={env} product={product} p={p} f={f} cy={0.34} scale={1.24} pan={0.07} />
      {b ? <PanelRun asset={b} env={env} product={product} p={1 - p} f={f + 40} cy={0.55} scale={1.24} pan={0.07} /> : null}
    </>
  );
};

export const HeroLayout: React.FC<LayoutProps> = ({ assets, env, product, f, dur }) => {
  const p = dur > 0 ? f / dur : 0;
  const a = assets[0];
  if (!a) return null;
  const cy = (BAND.top + BAND.h * 0.46) / VIDEO.height;

  if (a.kind === "cutout") {
    return <StagedCutout asset={a} env={env} product={product} p={p} f={f} cy={cy} scale={0.9} />;
  }
  if (a.kind === "strip" || a.kind === "panel") {
    return <PanelRun asset={a} env={env} product={product} p={p} f={f} cy={cy} scale={1.5} pan={0.1} />;
  }
  // A tall photograph needs a smaller share of the frame than a wide one.
  const scale = a.ar < 1 ? 0.62 : a.ar < 1.6 ? 0.78 : 0.88;
  return <StagedPlate asset={a} env={env} product={product} p={p} f={f} cy={cy} scale={scale} />;
};

/** The four products, named, for the cold open and the close. */
export const EcosystemLayout: React.FC<LayoutProps> = ({ assets, env, f }) => {
  const { fps } = useVideoConfig();
  const rowH = 372;
  const gap = 26;
  const total = assets.length * rowH + (assets.length - 1) * gap;
  const top = BAND.top + (BAND.h - total) / 2;

  return (
    <>
      {assets.map((a, i) => {
        const accent = ACCENT[a.product];
        const key = env === "light" ? accent.key : accent.glow;
        const p = spring({ frame: f - i * 6, fps, config: { damping: 200, mass: 0.6 }, durationInFrames: 18 });
        return (
          <div
            key={a.slug}
            style={{
              position: "absolute",
              left: SAFE.x,
              top: top + i * (rowH + gap),
              width: SAFE.w,
              height: rowH,
              opacity: p,
              transform: `translateX(${interpolate(p, [0, 1], [-40, 0])}px)`,
              borderRadius: 30,
              overflow: "hidden",
              background: env === "light" ? GROUND.lightLift : GROUND.darkLift,
              border: `3px solid ${key}44`,
              boxShadow:
                env === "light"
                  ? `0 22px 46px rgba(20,18,14,0.18)`
                  : `0 22px 54px rgba(0,0,0,0.85), 0 0 80px ${accent.glow}1A`,
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
                padding: a.ar > 3.4 ? "0 24px" : 0,
                filter: env === "dark" ? "brightness(1.5) contrast(1.1)" : "contrast(1.08)",
              }}
            />
            {/* left scrim so the product name always has contrast under it */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  env === "light"
                    ? "linear-gradient(90deg, rgba(250,248,244,0.96) 0%, rgba(250,248,244,0.74) 34%, rgba(250,248,244,0.04) 68%)"
                    : "linear-gradient(90deg, rgba(6,6,8,0.95) 0%, rgba(6,6,8,0.74) 34%, rgba(6,6,8,0.06) 68%)",
              }}
            />
            <div style={{ position: "relative", paddingLeft: 44, fontFamily: FONT.ui }}>
              <div
                style={{
                  fontSize: 84,
                  fontWeight: 800,
                  letterSpacing: -1.6,
                  lineHeight: 1,
                  color: env === "light" ? INK.onLight : INK.onDark,
                }}
              >
                {accent.short}
              </div>
            </div>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 12, background: key, boxShadow: env === "dark" ? `0 0 26px ${key}` : "none" }} />
          </div>
        );
      })}
    </>
  );
};

export const ShotVisual: React.FC<LayoutProps & { kind: string; reprise?: boolean }> = ({ kind, reprise, ...rest }) => {
  if (reprise) return <EcosystemLayout {...rest} />;
  if (kind === "hero") return <HeroLayout {...rest} />;
  if (kind === "pair") return <PairLayout {...rest} />;
  if (kind === "strip") return <StripLayout {...rest} />;
  return <GridLayout {...rest} />;
};
