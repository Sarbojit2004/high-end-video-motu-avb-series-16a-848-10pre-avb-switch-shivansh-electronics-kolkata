import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";
import { COLORS, RADII } from "../theme";
import { ramp, drift, hash01, CLAMP } from "../lib/anim";

/**
 * Product imagery well. Most source shots are dark chassis on dark or
 * transparent grounds; on a light page they need a contained dark "well" so the
 * chassis reads as an object sitting in the layout rather than a hole in it.
 */
export const ProductPlate: React.FC<{
  src: string;
  total: number;
  delay?: number;
  height?: number | string;
  width?: number | string;
  zoom?: number;
  panX?: number;
  panY?: number;
  fit?: "cover" | "contain";
  well?: boolean;
  radius?: number;
  pad?: number;
  wellColor?: string;
}> = ({
  src,
  total,
  delay = 0,
  height = 620,
  width = "100%",
  zoom = 0.07,
  panX = 0,
  panY = 0,
  fit = "cover",
  well = true,
  radius = RADII.card,
  pad = 0,
  wellColor = COLORS.chassis,
}) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 20);
  const k = drift(frame, total, 1);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: well ? wellColor : "transparent",
        boxShadow: well ? `0 26px 64px ${COLORS.shadow}` : "none",
        border: well ? `1px solid ${COLORS.paperEdge}` : "none",
        opacity: a,
        transform: `translateY(${(1 - a) * 26}px)`,
        padding: pad,
        boxSizing: "border-box",
      }}
    >
      <Img
        src={staticFile(`images/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          borderRadius: pad ? radius * 0.6 : 0,
          transform: `scale(${1 + zoom * k}) translate(${panX * k}%, ${panY * k}%)`,
        }}
      />
    </div>
  );
};

/**
 * Full-bleed contrast band — a dark chassis-toned strip that breaks the light
 * page. Used sparingly so the light ground stays dominant.
 */
export const ContrastBand: React.FC<{
  src: string;
  total: number;
  top: number;
  height: number;
  delay?: number;
  zoom?: number;
  opacity?: number;
}> = ({ src, total, top, height, delay = 0, zoom = 0.09, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 18);
  const k = drift(frame, total, 1);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 0,
        width: "100%",
        height,
        overflow: "hidden",
        background: COLORS.chassis,
        opacity: a * opacity,
      }}
    >
      <Img
        src={staticFile(`images/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${1 + zoom * k})`,
        }}
      />
    </div>
  );
};

/**
 * A legibility plate for text that must sit over imagery. On this light
 * background the plate is a light card with a soft edge, never a dark scrim.
 */
export const TextPlate: React.FC<{
  children: React.ReactNode;
  delay?: number;
  pad?: string;
  bg?: string;
  radius?: number;
  width?: number | string;
  border?: boolean;
}> = ({
  children,
  delay = 0,
  pad = "34px 38px",
  bg = "rgba(250,250,248,0.955)",
  radius = RADII.plate,
  width = "100%",
  border = true,
}) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 16);
  return (
    <div
      style={{
        width,
        padding: pad,
        borderRadius: radius,
        background: bg,
        border: border ? `1px solid ${COLORS.paperEdge}` : "none",
        boxShadow: `0 18px 48px ${COLORS.shadow}`,
        boxSizing: "border-box",
        opacity: a,
        transform: `translateY(${(1 - a) * 16}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Grid montage — efficient coverage tier for context/secondary imagery. */
export const Montage: React.FC<{
  images: readonly string[];
  total: number;
  cols?: number;
  gap?: number;
  height?: number;
  delay?: number;
  stepIn?: number;
  radius?: number;
}> = ({ images, total, cols = 3, gap = 14, height = 640, delay = 0, stepIn = 4, radius = 18 }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap,
        width: "100%",
        height,
      }}
    >
      {images.map((s, i) => {
        const d = delay + i * stepIn;
        const a = ramp(frame, d, 14);
        const k = drift(frame, total, 1);
        const dir = hash01(i) > 0.5 ? 1 : -1;
        return (
          <div
            key={s + i}
            style={{
              overflow: "hidden",
              borderRadius: radius,
              background: COLORS.chassis,
              border: `1px solid ${COLORS.paperEdge}`,
              boxShadow: `0 10px 26px ${COLORS.shadow}`,
              opacity: a,
              transform: `translateY(${(1 - a) * 22}px) scale(${interpolate(a, [0, 1], [0.94, 1])})`,
            }}
          >
            <Img
              src={staticFile(`images/${s}`)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${1 + 0.08 * k}) translateX(${dir * 1.6 * k}%)`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

/**
 * Cross-faded single-image stage — shows a run of images in one beat, each
 * getting a real moment rather than a grid cell.
 */
export const ImageRun: React.FC<{
  images: readonly string[];
  total: number;
  height?: number;
  radius?: number;
  hold?: number;
  fade?: number;
  fit?: "cover" | "contain";
  wellColor?: string;
}> = ({
  images,
  total,
  height = 660,
  radius = RADII.card,
  hold,
  fade = 12,
  fit = "cover",
  wellColor = COLORS.chassis,
}) => {
  const frame = useCurrentFrame();
  const n = images.length;
  const seg = hold ?? total / n;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,
        borderRadius: radius,
        overflow: "hidden",
        background: wellColor,
        border: `1px solid ${COLORS.paperEdge}`,
        boxShadow: `0 26px 64px ${COLORS.shadow}`,
      }}
    >
      {images.map((s, i) => {
        const start = i * seg;
        const o = interpolate(
          frame,
          [start - fade, start, start + seg - fade, start + seg],
          [0, 1, 1, 0],
          CLAMP
        );
        if (o <= 0.001) return null;
        const local = frame - start;
        const k = interpolate(local, [0, seg], [0, 1], CLAMP);
        return (
          <Img
            key={s + i}
            src={staticFile(`images/${s}`)}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: fit,
              opacity: o,
              transform: `scale(${1.02 + 0.07 * k})`,
            }}
          />
        );
      })}
    </div>
  );
};

/** Callout line + dot pointing at a physical feature on a product shot. */
export const LineCall: React.FC<{
  x: number;
  y: number;
  len?: number;
  dir?: "left" | "right";
  delay?: number;
  color?: string;
  label: string;
  value?: string;
}> = ({ x, y, len = 190, dir = "right", delay = 0, color = COLORS.signal, label, value }) => {
  const frame = useCurrentFrame();
  const a = ramp(frame, delay, 10);
  const l = ramp(frame, delay + 4, 16);
  const sign = dir === "right" ? 1 : -1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: a }}>
      <div
        style={{
          position: "absolute",
          width: 12,
          height: 12,
          borderRadius: 999,
          background: color,
          left: -6,
          top: -6,
          boxShadow: `0 0 0 5px ${color}22`,
        }}
      />
      <div
        style={{
          position: "absolute",
          height: 2,
          background: color,
          width: len * l,
          left: dir === "right" ? 0 : -len * l,
          top: -1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: sign > 0 ? len + 14 : -len - 14,
          top: -34,
          transform: dir === "right" ? "none" : "translateX(-100%)",
          textAlign: dir === "right" ? "left" : "right",
          whiteSpace: "nowrap",
          opacity: ramp(frame, delay + 12, 10),
        }}
      >
        <div
          style={{
            fontFamily: "Archivo",
            fontWeight: 700,
            fontSize: 20,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: COLORS.graphite,
          }}
        >
          {label}
        </div>
        {value ? (
          <div
            style={{
              fontFamily: "Archivo",
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: "-0.01em",
              color: COLORS.ink,
              marginTop: 2,
            }}
          >
            {value}
          </div>
        ) : null}
      </div>
    </div>
  );
};
