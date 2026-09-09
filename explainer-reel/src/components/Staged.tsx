import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { ACCENT, GROUND, VIDEO, type ProductKey } from "../theme.ts";
import type { Asset } from "../assets.ts";

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO-REAL STAGING (Section 2, item 2)
//
// The reference's objects are fully-rendered 3D — a lightbulb, a briefcase —
// with real materials, real reflections, real depth of field, sitting in a
// considered environment rather than pasted onto a background. The brief's
// instruction is to give the actual MOTU photography the same treatment: stage
// and light it as though it were a render, rather than dropping it flat.
//
// Three ways of doing that, chosen by what the source image actually is:
//
//   StagedCutout   a transparent PNG. Floats free, with a real cast shadow on
//                  the ground below it and, in the void, a fading reflection.
//                  This is the closest match to the reference's treatment and
//                  gets used for every hero moment where a cutout exists.
//
//   StagedPlate    an opaque photograph. It cannot float — a rectangle hanging
//                  in space reads as a sticker, which is the exact failure the
//                  brief warns against. So it is staged as a physical object
//                  instead: a plate with thickness, an edge catching the key
//                  light, and its own contact shadow.
//
//   PanelRun       the wide front/rear panel strips (some are 7268x720). Shown
//                  at a size where the connectors are actually legible, which
//                  means letting them run past the frame edge rather than
//                  scaling a 10:1 image down to fit.
//
// All three drift slowly and arc rather than travelling straight, per Section 2
// item 4.
// ─────────────────────────────────────────────────────────────────────────────

type Common = {
  asset: Asset;
  env: "light" | "dark";
  product: ProductKey;
  /** 0..1 progress through this shot, drives the drift. */
  p: number;
  /** Frame within the shot, for continuous motion. */
  f: number;
  /** Fractional position of the object's centre in the frame. */
  cx?: number;
  cy?: number;
  /** Fraction of frame width the object occupies. */
  scale?: number;
  /** Degrees of arc travelled across the shot. */
  arc?: number;
  opacity?: number;
};

const src = (a: Asset) => staticFile(`images/${a.file}`);

export const StagedCutout: React.FC<Common> = ({
  asset, env, product, p, f, cx = 0.5, cy = 0.44, scale = 0.86, arc = 3.5, opacity = 1,
}) => {
  const accent = ACCENT[product];
  const w = VIDEO.width * scale;
  const h = w / asset.ar;

  // Arcing drift — the object swings through a shallow curve instead of
  // sliding, and breathes in scale slightly across the shot.
  const ang = interpolate(p, [0, 1], [-arc / 2, arc / 2]);
  const lift = Math.sin(f / 62) * (VIDEO.height * 0.008);
  const zoom = interpolate(p, [0, 1], [1.0, 1.055]);
  const swing = Math.sin(f / 88) * (VIDEO.width * 0.006);

  const left = VIDEO.width * cx - w / 2 + swing;
  const top = VIDEO.height * cy - h / 2 + lift;

  // Shadow geometry: the key light is above and slightly in front, so the
  // contact shadow sits just below the object and is wider than it is tall.
  const shW = w * 0.86;
  const shH = Math.max(30, h * 0.20);

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* key light — without this a dark chassis vanishes into the void */}
      {env === "dark" && (
        <div
          style={{
            position: "absolute",
            left: VIDEO.width * cx - w * 0.78,
            top: top - h * 0.55,
            width: w * 1.56,
            height: h * 2.1,
            background: `radial-gradient(ellipse at 50% 42%, rgba(255,252,246,0.18) 0%, ${accent.glow}14 30%, rgba(0,0,0,0) 68%)`,
          }}
        />
      )}

      {/* cast shadow on the ground */}
      <div
        style={{
          position: "absolute",
          left: VIDEO.width * cx - shW / 2 + swing * 1.35,
          top: top + h * 0.90,
          width: shW,
          height: shH,
          borderRadius: "50%",
          background:
            env === "light"
              ? "radial-gradient(ellipse at 50% 50%, rgba(20,18,14,0.34) 0%, rgba(20,18,14,0.13) 46%, rgba(20,18,14,0) 74%)"
              : `radial-gradient(ellipse at 50% 50%, ${accent.key}3A 0%, rgba(0,0,0,0.55) 44%, rgba(0,0,0,0) 76%)`,
          transform: `rotate(${ang * 0.4}deg)`,
        }}
      />

      {/* the object */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          transform: `rotate(${ang}deg) scale(${zoom})`,
          transformOrigin: "50% 62%",
          filter:
            env === "dark"
              ? `brightness(1.16) contrast(1.06) drop-shadow(0 ${h * 0.035}px ${h * 0.035}px rgba(0,0,0,0.8))`
              : `contrast(1.06) saturate(1.02) drop-shadow(0 ${h * 0.03}px ${h * 0.03}px rgba(20,18,14,0.32))`,
        }}
      >
        <Img src={src(asset)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>

      {/* reflection — only in the void, where a floor plane reads */}
      {env === "dark" && (
        <div
          style={{
            position: "absolute",
            left,
            top: top + h * 1.02,
            width: w,
            height: h * 0.5,
            transform: `rotate(${ang}deg) scaleY(-1)`,
            transformOrigin: "50% 0%",
            opacity: 0.16,
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 8%, rgba(0,0,0,1) 88%)",
            maskImage: "linear-gradient(to top, rgba(0,0,0,0) 8%, rgba(0,0,0,1) 88%)",
            opacity: 1,
          }}
        >
          <Img src={src(asset)} style={{ width: "100%", height: h, objectFit: "contain", objectPosition: "top" }} />
        </div>
      )}
    </div>
  );
};

export const StagedPlate: React.FC<Common & { radius?: number }> = ({
  asset, env, product, p, f, cx = 0.5, cy = 0.44, scale = 0.82, arc = 2.2, opacity = 1, radius = 34,
}) => {
  const accent = ACCENT[product];
  const w = VIDEO.width * scale;
  const h = w / asset.ar;

  const ang = interpolate(p, [0, 1], [-arc / 2, arc / 2]);
  const lift = Math.sin(f / 70) * (VIDEO.height * 0.006);
  // A slow push in, so a still photograph still has life on screen.
  const zoom = interpolate(p, [0, 1], [1.0, 1.06]);
  const left = VIDEO.width * cx - w / 2;
  const top = VIDEO.height * cy - h / 2 + lift;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: w,
          height: h,
          transform: `rotate(${ang}deg)`,
          transformOrigin: "50% 60%",
          borderRadius: radius,
          overflow: "hidden",
          // Thickness: a bright top edge catching the key light, a dark bottom
          // edge in its own shadow — this is what stops it reading as a sticker.
          boxShadow:
            env === "light"
              ? `0 ${h * 0.035}px ${h * 0.075}px rgba(20,18,14,0.26),
                 0 ${h * 0.008}px ${h * 0.012}px rgba(20,18,14,0.16),
                 inset 0 3px 0 rgba(255,255,255,0.55),
                 inset 0 -3px 0 rgba(20,18,14,0.22)`
              : `0 ${h * 0.045}px ${h * 0.09}px rgba(0,0,0,0.86),
                 0 0 ${w * 0.05}px ${accent.glow}22,
                 inset 0 3px 0 rgba(255,255,255,0.16),
                 inset 0 -3px 0 rgba(0,0,0,0.55)`,
          background: env === "light" ? GROUND.lightLift : GROUND.darkLift,
        }}
      >
        <Img
          src={src(asset)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${zoom})`,
            transformOrigin: "50% 50%",
          }}
        />
        {/* A raking sheen across the plate, as if the key light crosses it. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(${118 + ang * 2}deg, rgba(255,255,255,${env === "light" ? 0.16 : 0.09}) 0%, rgba(255,255,255,0) 38%, rgba(0,0,0,${env === "light" ? 0.07 : 0.24}) 100%)`,
          }}
        />
      </div>

      {/* contact shadow under the plate */}
      <div
        style={{
          position: "absolute",
          left: left + w * 0.06,
          top: top + h * 0.99,
          width: w * 0.88,
          height: Math.max(24, h * 0.10),
          borderRadius: "50%",
          background:
            env === "light"
              ? "radial-gradient(ellipse at 50% 50%, rgba(20,18,14,0.26) 0%, rgba(20,18,14,0) 72%)"
              : "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 72%)",
        }}
      />
    </div>
  );
};

export const PanelRun: React.FC<Common & { pan?: number }> = ({
  asset, env, product, p, f, cy = 0.46, scale = 1.34, opacity = 1, pan = 0.10,
}) => {
  const accent = ACCENT[product];
  const w = VIDEO.width * scale;
  const h = w / asset.ar;

  // A 10:1 panel strip scaled to fit the frame width would be 216px tall and
  // completely illegible. Instead it is shown oversized and slowly panned, so
  // the connectors read at their real density.
  const shift = interpolate(p, [0, 1], [pan, -pan]) * VIDEO.width;
  const tilt = Math.sin(f / 120) * 0.5;

  const stageH = h * 1.9;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* the stage the panel sits on */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: VIDEO.height * cy - stageH / 2,
          width: VIDEO.width,
          height: stageH,
          background:
            env === "light"
              ? "linear-gradient(180deg, rgba(24,22,20,0) 0%, rgba(24,22,20,0.10) 26%, rgba(24,22,20,0.13) 74%, rgba(24,22,20,0) 100%)"
              : `linear-gradient(180deg, rgba(255,255,255,0) 0%, ${accent.glow}14 30%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0) 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: VIDEO.width / 2 - w / 2 + shift,
          top: VIDEO.height * cy - h / 2,
          width: w,
          height: h,
          transform: `rotate(${tilt}deg)`,
          filter:
            env === "dark"
              ? `brightness(1.18) contrast(1.05) drop-shadow(0 ${h * 0.06}px ${h * 0.06}px rgba(0,0,0,0.85))`
              : `contrast(1.07) saturate(1.03) drop-shadow(0 ${h * 0.05}px ${h * 0.05}px rgba(20,18,14,0.38))`,
        }}
      >
        <Img src={src(asset)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
    </div>
  );
};

/** Picks the right staging for whatever the asset happens to be. */
export const Staged: React.FC<Common> = (props) => {
  const k = props.asset.kind;
  if (k === "cutout") return <StagedCutout {...props} />;
  if (k === "strip" || k === "panel") return <PanelRun {...props} />;
  return <StagedPlate {...props} />;
};
