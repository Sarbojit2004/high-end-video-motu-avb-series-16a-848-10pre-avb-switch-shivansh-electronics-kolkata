import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SAFE, BRAND, PRICE, hexA } from "../theme";
import { Ground, TechGrid } from "../components/Shell";
import { Plate } from "../components/Media";
import { Logo } from "../components/Brand";
import { S848, AVBSW } from "../assets";
import { headline, micro, spec, subhead, FONT_FACE_CSS } from "../fonts";

/**
 * REEL 3 THUMBNAIL — 1080x1920 portrait.
 *
 * The only thumbnail in the set showing TWO products, because this is the only
 * reel carrying two — and because the AVB Switch is the reason the price block
 * has two figures. Both are shown complete and uncropped (`Plate` is
 * object-fit: contain), each sitting above the price card it belongs to, so the
 * two categories are visually paired rather than merely listed. Both logos sit
 * directly on the light page, unboxed, exactly as supplied. Everything sits
 * inside the caption-safe zone.
 */
export const Thumb3: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.paper }}>
    <style>{"*,*::before,*::after{box-sizing:border-box;}" + FONT_FACE_CSS}</style>
    <Ground bloom={COLORS.motuBlue} bloomStrength={0.09} bloomY={34} />
    <TechGrid opacity={0.5} size={64} />

    <AbsoluteFill style={{
      paddingTop: SAFE.top, paddingBottom: SAFE.bottom,
      paddingLeft: SAFE.marginX, paddingRight: SAFE.marginX,
      display: "flex", flexDirection: "column",
    }}>
      {/* header — both logos, direct on the page */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Logo which="motu" width={230} />
        <Logo which="shivansh" width={330} />
      </div>

      {/* the claim */}
      <div style={{ marginTop: 34, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 6, background: COLORS.motuBlue, borderRadius: 3 }} />
          <span style={{ ...micro(25, 700, "0.16em"), color: COLORS.slate }}>MOTU AVB SERIES</span>
        </div>
        <div style={{ ...headline(122, 800), color: COLORS.ink, lineHeight: 0.96 }}>
          ONE ROOM.<br />THEN THE<br />BUILDING.
        </div>
        <div style={{ ...subhead(31, 500), color: COLORS.slate, maxWidth: 900 }}>
          MOTU 848 — talkback, A/B/C monitoring and 60 channels. Plus the MOTU
          AVB Switch, for everything past the second room.
        </div>
      </div>

      {/* both heroes, complete and uncropped, each above its own price */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 24, marginBottom: 18, display: "flex", gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Plate idx={S848.qFront} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Plate idx={AVBSW.qPorts} style={{ width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* dual MOP — segregated, never one blended figure */}
      <div style={{ display: "flex", gap: 16 }}>
        {[
          { l: PRICE.interfaceLabel, v: PRICE.interface, a: COLORS.motuBlue },
          { l: PRICE.switchLabel, v: PRICE.switch, a: COLORS.signal },
        ].map((p) => (
          <div key={p.l} style={{
            flex: 1, display: "flex", flexDirection: "column", gap: 4,
            padding: "16px 20px", background: COLORS.paperLift,
            border: `1px solid ${COLORS.line}`, borderTop: `6px solid ${p.a}`,
            borderRadius: 14, boxShadow: `0 8px 22px ${COLORS.shadow}`,
          }}>
            <span style={{ ...micro(16, 700, "0.1em"), color: COLORS.slate }}>{p.l}</span>
            <span style={{ ...spec(40, 800, "-0.01em"), color: COLORS.ink }}>{p.v}</span>
            <span style={{ ...micro(14, 600, "0.05em"), color: COLORS.slateDim }}>{PRICE.note}</span>
          </div>
        ))}
      </div>

      {/* the lead destination */}
      <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{
            width: 14, height: 14, borderRadius: "50%", background: COLORS.signal,
            boxShadow: `0 0 0 7px ${hexA(COLORS.signal, 0.16)}`, flexShrink: 0,
          }} />
          <span style={{ ...spec(44, 800, "0.01em"), color: COLORS.ink }}>{BRAND.website}</span>
        </div>
        <span style={{ ...micro(18, 600, "0.06em"), color: COLORS.slate, lineHeight: 1.5 }}>
          {BRAND.name} — {BRAND.role} for {BRAND.region}
        </span>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
