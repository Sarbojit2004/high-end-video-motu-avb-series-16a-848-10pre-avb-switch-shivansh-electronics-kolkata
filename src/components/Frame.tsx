import React from "react";
import { AbsoluteFill, useCurrentFrame, Img, staticFile } from "remotion";
import { COLORS, SAFE, VIDEO } from "../theme";
import { drift, hash01, progress } from "../lib/anim";

/**
 * Light ground for every scene. Never pure white — a warm neutral field with a
 * very soft vignette so the dark MOTU chassis separates hard from it.
 */
export const Ground: React.FC<{ tint?: string; children?: React.ReactNode }> = ({
  tint = COLORS.paper,
  children,
}) => (
  <AbsoluteFill style={{ backgroundColor: tint }}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 78% at 50% 34%, ${COLORS.paperLift} 0%, ${tint} 58%, ${COLORS.paperSink} 100%)`,
      }}
    />
    {children}
  </AbsoluteFill>
);

/**
 * Ambient fill for the 0–250px and 1580–1920px zones (Section 2b).
 * Non-critical only: a soft blurred extension of a hero image, plus the faint
 * high-frequency "data stream" texture that visually answers the SFX layer.
 * Never carries text, logos, or anything the viewer must parse.
 */
export const AmbientBands: React.FC<{
  image?: string;
  streams?: boolean;
  accent?: string;
  intensity?: number;
}> = ({ image, streams = true, accent = COLORS.signal, intensity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {image ? (
        <>
          <AbsoluteFill
            style={{
              height: SAFE.top,
              overflow: "hidden",
              opacity: 0.3 * intensity,
              filter: "blur(34px) saturate(0.7)",
            }}
          >
            <Img
              src={staticFile(`images/${image}`)}
              style={{
                width: "112%",
                height: "260%",
                objectFit: "cover",
                transform: `translate(-5%, -18%) scale(${1 + drift(frame, 400, 0.05)})`,
              }}
            />
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              top: SAFE.bottom,
              height: VIDEO.height - SAFE.bottom,
              overflow: "hidden",
              opacity: 0.26 * intensity,
              filter: "blur(38px) saturate(0.7)",
            }}
          >
            <Img
              src={staticFile(`images/${image}`)}
              style={{
                width: "112%",
                height: "300%",
                objectFit: "cover",
                transform: `translate(-6%, -46%) scale(${1 + drift(frame, 400, 0.06)})`,
              }}
            />
          </AbsoluteFill>
        </>
      ) : null}

      {streams ? <DataStreamTexture accent={accent} intensity={intensity} /> : null}

      {/* feather the bands into the safe area so the seam never reads as a line */}
      <AbsoluteFill
        style={{
          height: SAFE.top + 90,
          background: `linear-gradient(to bottom, transparent 0%, ${COLORS.paper}00 46%, ${COLORS.paper} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          top: SAFE.bottom - 90,
          height: VIDEO.height - SAFE.bottom + 90,
          background: `linear-gradient(to top, transparent 0%, ${COLORS.paper}00 46%, ${COLORS.paper} 100%)`,
        }}
      />
    </>
  );
};

/** Faint drifting "data stream" tick texture — the visual counterpart of the
 *  high-frequency SFX bed. Confined to the top/bottom non-critical zones. */
export const DataStreamTexture: React.FC<{ accent?: string; intensity?: number }> = ({
  accent = COLORS.signal,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const rows = 7;
  const band = (top: number, height: number, dir: number) => (
    <div style={{ position: "absolute", top, left: 0, width: "100%", height, overflow: "hidden" }}>
      {Array.from({ length: rows }).map((_, r) => {
        const y = (height / rows) * r + 6;
        const speed = 0.55 + hash01(r * 3.1) * 0.9;
        const shift = ((frame * speed * dir) % 260) - 130;
        return (
          <div
            key={r}
            style={{
              position: "absolute",
              top: y,
              left: 0,
              width: "100%",
              height: 2,
              transform: `translateX(${shift}px)`,
              opacity: (0.1 + hash01(r * 7.7) * 0.14) * intensity,
              background: `repeating-linear-gradient(90deg, ${accent} 0px, ${accent} ${
                6 + Math.floor(hash01(r) * 16)
              }px, transparent ${6 + Math.floor(hash01(r) * 16)}px, transparent ${
                26 + Math.floor(hash01(r * 2) * 40)
              }px)`,
            }}
          />
        );
      })}
    </div>
  );
  return (
    <>
      {band(28, SAFE.top - 40, 1)}
      {band(SAFE.bottom + 30, VIDEO.height - SAFE.bottom - 44, -1)}
    </>
  );
};

/**
 * The primary safe content area (250–1580px, 90px side margins).
 * Everything the viewer must read lives inside this box.
 */
export const SafeArea: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  style?: React.CSSProperties;
}> = ({ children, justify = "center", align = "flex-start", style }) => (
  <AbsoluteFill
    style={{
      top: SAFE.top,
      height: SAFE.height,
      left: SAFE.marginX,
      width: SAFE.width,
      display: "flex",
      flexDirection: "column",
      justifyContent: justify,
      alignItems: align,
      ...style,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Scene root: ground + ambient bands + safe area, in the right z-order. */
export const Scene: React.FC<{
  children: React.ReactNode;
  ambientImage?: string;
  accent?: string;
  tint?: string;
  streams?: boolean;
  ambientIntensity?: number;
  justify?: React.CSSProperties["justifyContent"];
  align?: React.CSSProperties["alignItems"];
  behind?: React.ReactNode;
}> = ({
  children,
  ambientImage,
  accent,
  tint,
  streams = true,
  ambientIntensity = 1,
  justify,
  align,
  behind,
}) => (
  <Ground tint={tint}>
    {behind}
    <AmbientBands image={ambientImage} accent={accent} streams={streams} intensity={ambientIntensity} />
    <SafeArea justify={justify} align={align}>
      {children}
    </SafeArea>
  </Ground>
);

/** Debug overlay for QA stills — never rendered in the final video. */
export const SafeZoneGuides: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: SAFE.top, background: "rgba(255,0,0,0.16)" }} />
    <div style={{ position: "absolute", top: SAFE.bottom, left: 0, width: "100%", height: VIDEO.height - SAFE.bottom, background: "rgba(255,0,0,0.16)" }} />
    <div style={{ position: "absolute", top: 0, left: 0, width: SAFE.marginX, height: "100%", background: "rgba(0,0,255,0.12)" }} />
    <div style={{ position: "absolute", top: 0, right: 0, width: SAFE.marginX, height: "100%", background: "rgba(0,0,255,0.12)" }} />
  </AbsoluteFill>
);

export const useBeat = (total: number) => {
  const frame = useCurrentFrame();
  return { frame, p: progress(frame, total) };
};
