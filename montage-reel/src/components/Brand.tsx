import React, { useEffect, useState } from "react";
import { Img, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../design/fonts.ts";
import { POOL, rgba } from "../design/palette.ts";
import { easeOut } from "./Picture.tsx";
import { Micro } from "./Text.tsx";

/** The whole branding footprint of the reel (brief §6). */
export const BRAND = {
  website: "www.shivanshelectronics.in",
  whatsapp: "+91 98316 62458",
} as const;

/**
 * Both supplied logos are dark-on-white artwork. On the reel's dark grounds
 * they sit on a white lozenge (their own native ground) so the marks are never
 * recoloured or inverted.
 */
export const LogoPair: React.FC<{ start: number; width?: number; gap?: number }> = ({ start, width = 620, gap = 56 }) => {
  const frame = useCurrentFrame();
  const t1 = easeOut((frame - start) / 14);
  const t2 = easeOut((frame - start - 5) / 14);
  const plate: React.CSSProperties = { background: "#ffffff", borderRadius: 26, padding: "26px 40px", boxShadow: `0 24px 70px ${rgba("#000", 0.45)}`, display: "flex", alignItems: "center", justifyContent: "center" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <div style={{ ...plate, opacity: t1, transform: `translateY(${(1 - t1) * 30}px)` }}>
        <Img src={staticFile("branding/shivansh-logo.png")} style={{ width, height: "auto", display: "block" }} />
      </div>
      <div style={{ ...plate, opacity: t2, transform: `translateY(${(1 - t2) * 30}px)`, padding: "30px 40px" }}>
        <Img src={staticFile("branding/motu-logo.png")} style={{ width: width * 0.62, height: "auto", display: "block" }} />
      </div>
    </div>
  );
};

/**
 * WhatsApp / website icons. The brief's user-supplied icon files were not
 * attached to the build; if PNGs are dropped into public/branding/
 * (whatsapp-icon.png, website-icon.png) they are used, else these clean vector
 * glyphs (a phone-in-bubble and a globe, drawn here) stand in.
 */
const IconWhatsApp: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <path d="M32 6C17.6 6 6 17.4 6 31.4c0 4.9 1.4 9.6 4 13.6L6 58l13.5-3.7c3.9 2.1 8.2 3.2 12.5 3.2 14.4 0 26-11.4 26-25.4S46.4 6 32 6z" stroke={color} strokeWidth={4.5} strokeLinejoin="round" />
    <path d="M23.5 20.5c.6-.6 1.5-.6 2.1 0l3.2 4.2c.5.7.4 1.6-.2 2.2l-1.8 1.8c1.6 3.6 4.7 6.7 8.3 8.3l1.8-1.8c.6-.6 1.5-.7 2.2-.2l4.2 3.2c.6.5.7 1.5.1 2.1l-2.4 2.4c-1.2 1.2-3 1.6-4.6 1-8-3.1-14.3-9.4-17.4-17.4-.6-1.6-.2-3.4 1-4.6l3.5-1.2z" fill={color} />
  </svg>
);
const IconGlobe: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={4.5}>
    <circle cx={32} cy={32} r={25} />
    <ellipse cx={32} cy={32} rx={11} ry={25} />
    <path d="M7 32h50M11 20h42M11 44h42" />
  </svg>
);

/** True when an optional static file exists (checked once, render is held until known). */
const useOptionalStatic = (file: string): boolean => {
  const [exists, setExists] = useState(false);
  const [handle] = useState(() => delayRender(`probe ${file}`));
  useEffect(() => {
    fetch(staticFile(file), { method: "HEAD" })
      .then((r) => setExists(r.ok && !(r.headers.get("content-type") ?? "").includes("text/html")))
      .catch(() => setExists(false))
      .finally(() => continueRender(handle));
  }, [file, handle]);
  return exists;
};

export const ContactRow: React.FC<{ kind: "whatsapp" | "website"; ink: string; accent: string; start: number; size?: number }> = ({ kind, ink, accent, start, size = 84 }) => {
  const frame = useCurrentFrame();
  const t = easeOut((frame - start) / 14);
  const icon = kind === "whatsapp" ? <IconWhatsApp size={size * 1.35} color={accent} /> : <IconGlobe size={size * 1.35} color={accent} />;
  const custom = kind === "whatsapp" ? "branding/whatsapp-icon.png" : "branding/website-icon.png";
  const hasCustom = useOptionalStatic(custom);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.5, opacity: t, transform: `translateX(${(1 - t) * -40}px)` }}>
      <div style={{ width: size * 1.35, height: size * 1.35, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {hasCustom ? <Img src={staticFile(custom)} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : icon}
      </div>
      <Micro ink={ink} size={size} weight={500} style={{ fontFamily: FONT.micro, letterSpacing: kind === "whatsapp" ? "0.08em" : "0.04em" }}>
        {kind === "whatsapp" ? BRAND.whatsapp : BRAND.website}
      </Micro>
    </div>
  );
};

/** Small persistent corner mark — a single thin rule + "MOTU · SHIVANSH ELECTRONICS" microtype, dim. */
export const CornerMark: React.FC<{ ink: string; opacity?: number }> = ({ ink, opacity = 0.55 }) => (
  <div style={{ position: "absolute", left: 110, top: 118, display: "flex", alignItems: "center", gap: 28, opacity }}>
    <div style={{ width: 70, height: 4, background: ink }} />
    <Micro ink={ink} size={40} weight={600} style={{ letterSpacing: "0.22em", textTransform: "uppercase" }}>MOTU · Shivansh Electronics</Micro>
  </div>
);
export const POOL_WHITE = POOL.white;
