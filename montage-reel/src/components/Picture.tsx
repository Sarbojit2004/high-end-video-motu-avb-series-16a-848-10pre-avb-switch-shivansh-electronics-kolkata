import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { IMAGE_BY_SLUG, type ImageInfo } from "../data/images.ts";
import { rgba } from "../design/palette.ts";

export interface PictureProps {
  slug: string;
  /** box the picture fills, in canvas px */
  width: number;
  height: number;
  /** ground colour behind contain/panel fits */
  ground: string;
  /** parallax drift strength (0 = static; ~1 = slow imperceptible drift for holds) */
  drift?: number;
  /** drift direction seed */
  seed?: number;
  /** frames since this picture appeared (for drift) */
  localFrame?: number;
  /** extra zoom (cover) */
  zoom?: number;
  radius?: number;
  /** soft plate + shadow for cut-outs */
  plate?: boolean;
  style?: React.CSSProperties;
}

const drift = (frame: number, seed: number, amount: number) => {
  const a = (seed * 0.61803) % 1;
  const dx = Math.cos(a * 6.283) * amount * 34 * (frame / 60);
  const dy = Math.sin(a * 6.283) * amount * 22 * (frame / 60);
  const s = 1 + amount * 0.045 * (frame / 60);
  return { dx, dy, s };
};

/**
 * One product image with its treatment (brief §8): cover photographs crop to a
 * focal point; transparent cut-outs sit on a lit plate; ultra-wide 1U panels
 * become horizontal bands. Anything held for more than a beat drifts slowly so
 * nothing on screen is ever perfectly static (brief §5).
 */
export const Picture: React.FC<PictureProps> = ({ slug, width, height, ground, drift: driftAmt = 0.6, seed = 1, localFrame, zoom = 1, radius = 0, plate = true, style }) => {
  const frame = useCurrentFrame();
  const lf = localFrame ?? frame;
  const info: ImageInfo = IMAGE_BY_SLUG[slug] ?? { slug, product: "16A", kind: "scene", fit: "cover", desc: slug };
  const { dx, dy, s } = drift(lf, seed, driftAmt);
  const src = staticFile(`images/${slug}`);
  const focal = info.focal ?? [0.5, 0.5];

  if (info.fit === "cover") {
    return (
      <div style={{ width, height, overflow: "hidden", borderRadius: radius, position: "relative", background: info.light ? "#ffffff" : "#000", ...style }}>
        <Img
          src={src}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: `${focal[0] * 100}% ${focal[1] * 100}%`,
            transform: `translate(${dx}px, ${dy}px) scale(${s * zoom})`,
            transformOrigin: `${focal[0] * 100}% ${focal[1] * 100}%`,
          }}
        />
        {info.light ? <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 4px ${rgba("#000", 0.06)}` }} /> : null}
      </div>
    );
  }
  // contain / panel — cut-out or wide strip on the act ground with a lit plate
  const pad = info.fit === "panel" ? 0.04 : 0.08;
  return (
    <div style={{ width, height, overflow: "hidden", borderRadius: radius, position: "relative", background: ground === "transparent" ? undefined : ground, ...style }}>
      {plate ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 70% 55% at 50% 58%, ${rgba("#ffffff", 0.16)} 0%, ${rgba("#ffffff", 0.05)} 45%, transparent 75%)`,
          }}
        />
      ) : null}
      <Img
        src={src}
        style={{
          position: "absolute",
          left: `${pad * 100}%`,
          top: `${pad * 100}%`,
          width: `${(1 - pad * 2) * 100}%`,
          height: `${(1 - pad * 2) * 100}%`,
          objectFit: "contain",
          transform: `translate(${dx * 0.6}px, ${dy * 0.6}px) scale(${s * zoom})`,
          filter: info.alpha ? `drop-shadow(0 40px 60px ${rgba("#000", 0.55)})` : "none",
        }}
      />
    </div>
  );
};

/** Percentage-of-frame helper for layouts (2160 × 3840). */
export const px = (n: number) => `${n}px`;
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
export const easeInOut = (t: number) => { const x = clamp01(t); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ramp = (frame: number, from: number, to: number, a = 0, b = 1) => interpolate(frame, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
