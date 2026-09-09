import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, CONTACT, FONT, GROUND, INK, SAFE, VIDEO } from "../theme.ts";
import { SiteIcon, WhatsAppIcon } from "./Chrome.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// THE CLOSE (Section 7)
//
// Mandatory here: both logos together, all three mobile numbers each with the
// WhatsApp icon, and the website with its own icon. No pricing — the brief's
// default for a technical/educational piece, and nothing in the supplied
// documentation asks for it in the body of the film.
//
// The numbers are the reason this plate is laid out as a stack rather than a
// single line: three +91 numbers set side by side at a legible size do not fit
// across 2160 px inside the safe margins, and shrinking them to fit would
// defeat the point of putting them on screen at all. Stacked, each one is set
// at 62 px and is readable on a phone.
// ─────────────────────────────────────────────────────────────────────────────

export const ContactPlate: React.FC<{ startFrame: number; env: "light" | "dark" }> = ({
  startFrame,
  env,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;

  const accent = ACCENT.shared;
  const ink = env === "light" ? INK.onLight : INK.onDark;
  const soft = env === "light" ? INK.onLightSoft : INK.onDarkSoft;
  const key = env === "light" ? "#128C7E" : "#25D366"; // WhatsApp green, both grounds
  const site = env === "light" ? "#1F5FD0" : "#5A9BFF";
  const plate = env === "light" ? GROUND.lightLift : GROUND.darkLift;
  const line = env === "light" ? "rgba(24,22,20,0.14)" : "rgba(255,255,255,0.14)";

  const enter = spring({ frame: f, fps, config: { damping: 200, mass: 0.7 }, durationInFrames: 22 });

  const logo = "logos/shivansh.png";
  const motu = "logos/motu.png";

  return (
    <div
      style={{
        position: "absolute",
        left: SAFE.x,
        top: 1130,
        width: SAFE.w,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px)`,
        fontFamily: FONT.display,
      }}
    >
      {/* ── the two logos, together ─────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 74,
          paddingBottom: 58,
        }}
      >
        <Img src={staticFile(logo)} style={{ height: 214, width: "auto", filter: "drop-shadow(0 6px 18px rgba(20,18,14,0.22))" }} />
        <div style={{ width: 3, height: 164, background: line }} />
        <Img src={staticFile(motu)} style={{ height: 176, width: "auto", filter: "drop-shadow(0 6px 18px rgba(20,18,14,0.22))" }} />
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: 3.8,
          color: soft,
          textTransform: "uppercase",
          paddingBottom: 66,
        }}
      >
        {CONTACT.role}
      </div>

      {/* ── all three numbers, each with the WhatsApp mark ──────────────── */}
      <div
        style={{
          background: plate,
          border: `3px solid ${line}`,
          borderRadius: 46,
          padding: "56px 62px",
          boxShadow:
            env === "light"
              ? "0 26px 60px rgba(20,18,14,0.16)"
              : "0 26px 60px rgba(0,0,0,0.8)",
        }}
      >
        {CONTACT.whatsapp.map((num, i) => {
          const p = spring({
            frame: f - 14 - i * 6,
            fps,
            config: { damping: 200, mass: 0.5 },
            durationInFrames: 16,
          });
          return (
            <div
              key={num}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 38,
                padding: "28px 0",
                borderTop: i === 0 ? "none" : `2px solid ${line}`,
                opacity: p,
                transform: `translateX(${interpolate(p, [0, 1], [-26, 0])}px)`,
              }}
            >
              <WhatsAppIcon size={92} color={key} />
              <div
                style={{
                  fontSize: 78,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  color: ink,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {num}
              </div>
            </div>
          );
        })}

        {/* ── website ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 38,
            padding: "34px 0 8px",
            borderTop: `2px solid ${line}`,
            marginTop: 10,
            opacity: spring({ frame: f - 34, fps, config: { damping: 200 }, durationInFrames: 16 }),
          }}
        >
          <SiteIcon size={88} color={site} />
          <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: 0.6, color: ink }}>
            {CONTACT.site}
          </div>
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          paddingTop: 56,
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: 6,
          color: soft,
          textTransform: "uppercase",
          opacity: spring({ frame: f - 42, fps, config: { damping: 200 }, durationInFrames: 16 }),
        }}
      >
        {CONTACT.brand} · {CONTACT.city}
      </div>
    </div>
  );
};
