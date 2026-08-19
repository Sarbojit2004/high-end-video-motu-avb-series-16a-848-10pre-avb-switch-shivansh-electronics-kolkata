import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SAFE, BRAND, PRICE, hexA } from "./theme";
import { Ground, TechGrid } from "./components/Shell";
import { Plate } from "./components/Media";
import { Logo } from "./components/Brand";
import { CLIMAX } from "./assets";
import { headline, micro, spec, subhead, FONT_FACE_CSS } from "./fonts";

/**
 * COMPRESSED REEL THUMBNAIL — 1080x1920 portrait.
 *
 * Features the whole ecosystem, composed the way the ecosystem is actually
 * shaped rather than as a flat four-up grid: the three interfaces stack as
 * peers in one column, and the AVB Switch sits apart in its own, because it is
 * an infrastructure component with its own price and role — never a peer-tier
 * fourth interface (Fact 1). The connector rule between the two columns is the
 * "one network" claim made in layout.
 *
 * The four heroes are this reel's own curated CLIMAX set — the same four that
 * close the reel itself, so the thumbnail and the last thing a viewer sees are
 * the same image. The headline is this reel's own on-screen thesis rather than
 * the master reel's, because the compressed reel opens on the front panels
 * being visibly different, not on the rooms.
 *
 * Every unit is shown complete and uncropped: `Plate` is object-fit: contain,
 * and each slot is sized from that image's own aspect ratio so nothing is
 * squeezed. Both logos sit directly on the light page, unboxed, exactly as
 * supplied. Both MOPs appear, visually segregated, never blended. Everything
 * sits inside the caption-safe zone.
 */

const INTERFACES = [
  { idx: CLIMAX.tenpre, label: "MOTU 10pre" },
  { idx: CLIMAX.s16a, label: "MOTU 16A" },
  { idx: CLIMAX.s848, label: "MOTU 848" },
];

export const Thumb: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.paper }}>
    <style>{"*,*::before,*::after{box-sizing:border-box;}" + FONT_FACE_CSS}</style>
    <Ground bloom={COLORS.motuBlue} bloomStrength={0.09} bloomY={36} />
    <TechGrid opacity={0.5} size={64} />

    <AbsoluteFill style={{
      paddingTop: SAFE.top, paddingBottom: SAFE.bottom,
      paddingLeft: SAFE.marginX, paddingRight: SAFE.marginX,
      display: "flex", flexDirection: "column",
    }}>
      {/* header — both logos, direct on the page, never boxed */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Logo which="motu" width={230} />
        <Logo which="shivansh" width={330} />
      </div>

      {/* the claim */}
      <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 56, height: 6, background: COLORS.motuBlue, borderRadius: 3 }} />
          <span style={{ ...micro(25, 700, "0.16em"), color: COLORS.slate }}>MOTU AVB SERIES</span>
        </div>
        <div style={{ ...headline(118, 800), color: COLORS.ink, lineHeight: 0.95 }}>
          THREE FRONT<br />PANELS.<br />ONE ENGINE.
        </div>
        <div style={{ ...subhead(30, 500), color: COLORS.slate, maxWidth: 920 }}>
          The MOTU 16A, 848 and 10pre share one identical engine — and one
          identical price. The MOTU AVB Switch connects them.
        </div>
      </div>

      {/* the ecosystem, complete and uncropped, in its real shape */}
      <div style={{ flex: 1, minHeight: 0, marginTop: 24, marginBottom: 20,
                    display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", width: "100%", gap: 20, alignItems: "center" }}>
          {/* three peers */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
            {INTERFACES.map((it) => (
              <div key={it.idx} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <div style={{ width: "100%", height: 118 }}>
                  <Plate idx={it.idx} style={{ width: "100%", height: "100%" }} />
                </div>
                <span style={{ ...micro(17, 800, "0.1em"), color: COLORS.slate }}>{it.label}</span>
              </div>
            ))}
          </div>

          {/* the link — the "one network" claim, stated in layout */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 2, height: 54, background: COLORS.line }} />
            <span style={{
              width: 13, height: 13, borderRadius: "50%", background: COLORS.signal,
              boxShadow: `0 0 0 6px ${hexA(COLORS.signal, 0.16)}`,
            }} />
            <div style={{ width: 2, height: 54, background: COLORS.line }} />
          </div>

          {/* the infrastructure component — apart, not a fourth peer */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{ width: "100%", height: 262 }}>
              <Plate idx={CLIMAX.avbsw} style={{ width: "100%", height: "100%" }} />
            </div>
            <span style={{ ...micro(17, 800, "0.1em"), color: COLORS.slate }}>MOTU AVB Switch</span>
          </div>
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
