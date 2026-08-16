import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS, SPACE, BRAND, PRICE, hexA } from "./theme";
import { Ground, TechGrid } from "./components/Shell";
import { Plate } from "./components/Media";
import { Logo } from "./components/Brand";
import { S16A, S848, TENPRE, AVBSW } from "./assets";
import { headline, micro, spec, subhead } from "./fonts";
import { FONT_FACE_CSS } from "./fonts";

/**
 * 1920x1080 landscape thumbnail.
 *
 * Composition reflects the ecosystem's real structure: the three peer
 * interfaces across the top register at equal weight, the AVB Switch below in
 * a genuinely supporting position — never presented as a fourth peer. Every
 * unit is shown complete and uncropped (`Plate` is `object-fit: contain`).
 * Both logos sit directly on the light ground, unboxed, exactly as supplied.
 */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: COLORS.paper }}>
    <style>{"*,*::before,*::after{box-sizing:border-box;}" + FONT_FACE_CSS}</style>
    <Ground bloom={COLORS.motuBlue} bloomStrength={0.09} bloomY={40} />
    <TechGrid opacity={0.5} size={72} />

    <AbsoluteFill style={{ padding: SPACE.marginX }}>
      {/* header — MOTU left, Shivansh right, both direct on the page */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Logo which="motu" width={230} />
        <Logo which="shivansh" width={360} />
      </div>

      <div style={{ display: "flex", gap: 48, marginTop: 16, flex: 1, minHeight: 0 }}>
        {/* left — the claim */}
        <div style={{ flex: "0 0 690px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 5, background: COLORS.motuBlue, borderRadius: 3 }} />
            <span style={{ ...micro(23, 700, "0.2em"), color: COLORS.slate }}>MOTU AVB SERIES ECOSYSTEM</span>
          </div>
          <div style={{ ...headline(96, 800), color: COLORS.ink, lineHeight: 0.98 }}>
            ONE ENGINE.
            <br />
            THREE
            <br />
            FRONT-ENDS.
          </div>
          <div style={{ ...subhead(29, 500), color: COLORS.slate, maxWidth: 620 }}>
            16A · 848 · 10pre — identical DSP, identical ESS Sabre32 conversion,
            identical price. Plus the AVB Switch that scales them across the building.
          </div>

          {/* dual price — visually segregated, never one blended range */}
          <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
            {[
              { l: PRICE.interfaceLabel, v: PRICE.interface, a: COLORS.motuBlue },
              { l: PRICE.switchLabel, v: PRICE.switch, a: COLORS.signal },
            ].map((p) => (
              <div
                key={p.l}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  padding: "16px 20px",
                  background: COLORS.paperLift,
                  border: `1px solid ${COLORS.line}`,
                  borderTop: `5px solid ${p.a}`,
                  borderRadius: 14,
                  boxShadow: `0 8px 22px ${COLORS.shadow}`,
                }}
              >
                <span style={{ ...micro(15, 700, "0.12em"), color: COLORS.slate }}>{p.l}</span>
                <span style={{ ...spec(37, 800, "-0.01em"), color: COLORS.ink }}>{p.v}</span>
                <span style={{ ...micro(13, 600, "0.06em"), color: COLORS.slateDim }}>{PRICE.note}</span>
              </div>
            ))}
          </div>
        </div>

        {/*
          Right — the ecosystem. A grid with minmax(0, …) tracks rather than
          flex: a bare 1fr row takes its intrinsic minimum from the image inside
          it and overflows, which pushed the Switch block down over the footer.
          The three interfaces share equal rows; the Switch sits in a shorter
          fourth row below a rule, supporting rather than peer.
        */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: "grid",
            gridTemplateRows: "repeat(3, minmax(0, 1fr)) minmax(0, 0.72fr)",
            rowGap: 8,
          }}
        >
          {[
            { idx: S16A.qFrontRight, name: "MOTU 16A", role: "Routing" },
            { idx: S848.qFront, name: "MOTU 848", role: "Command" },
            { idx: TENPRE.qFrontRight, name: "MOTU 10pre", role: "Capture" },
          ].map((p) => (
            <div key={p.name} style={{ minHeight: 0, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0, height: "100%" }}>
                <Plate idx={p.idx} style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={{ flex: "0 0 172px", display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ ...spec(24, 800, "0"), color: COLORS.ink }}>{p.name}</span>
                <span style={{ ...micro(15, 700, "0.14em"), color: COLORS.motuBlue }}>{p.role}</span>
              </div>
            </div>
          ))}
          <div
            style={{
              minHeight: 0,
              display: "flex",
              alignItems: "center",
              gap: 16,
              paddingTop: 10,
              borderTop: `1px solid ${COLORS.lineStrong}`,
            }}
          >
            <div style={{ flex: "0 0 210px", height: "100%", minHeight: 0 }}>
              <Plate idx={AVBSW.qPorts} style={{ width: "100%", height: "100%" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <span style={{ ...spec(22, 800, "0"), color: COLORS.ink }}>MOTU AVB Switch</span>
              <span style={{ ...micro(14, 700, "0.13em"), color: COLORS.signal }}>
                NETWORK INFRASTRUCTURE — 6 × 1-GIGABIT AVB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* footer — the lead URL, most-marketed destination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 40, marginTop: 14 }}>
        <span style={{ ...micro(18, 600, "0.08em"), color: COLORS.slate, maxWidth: 860, lineHeight: 1.5 }}>
          {BRAND.name} — {BRAND.role} for {BRAND.region}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: COLORS.signal,
              boxShadow: `0 0 0 6px ${hexA(COLORS.signal, 0.16)}`,
            }}
          />
          <span style={{ ...spec(40, 800, "0.01em"), color: COLORS.ink }}>{BRAND.website}</span>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
