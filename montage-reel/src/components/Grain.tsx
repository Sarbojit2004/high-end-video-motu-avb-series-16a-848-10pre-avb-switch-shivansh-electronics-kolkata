import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";

/**
 * Film grain over every frame (brief §5). A 1024² noise tile, tiled across the
 * canvas and re-offset each frame by a deterministic hash so the grain "boils"
 * like real stock. Blend: overlay at low opacity — invisible as texture,
 * felt as depth.
 */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const frame = useCurrentFrame();
  const h = (frame * 2654435761) >>> 0;
  const ox = h % 1024;
  const oy = ((h >>> 10) * 7) % 1024;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: -1024 + ox,
          top: -1024 + oy,
          width: 2160 + 2048,
          height: 3840 + 2048,
          backgroundImage: `url(${staticFile("branding/grain.png")})`,
          backgroundRepeat: "repeat",
          backgroundSize: "1024px 1024px",
          transform: frame % 2 ? "scaleX(-1)" : "none",
        }}
      />
    </AbsoluteFill>
  );
};

/** Preload the tile so the first frame does not pop. */
export const GrainPreload: React.FC = () => (
  <Img src={staticFile("branding/grain.png")} style={{ position: "absolute", width: 1, height: 1, opacity: 0 }} />
);
