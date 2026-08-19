import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { BRAND, COLORS, PRICE, SAFE, hexA } from "../theme";
import { img, LOGO } from "../assets";
import { micro, spec, subhead } from "../fonts";
import { EASE, ramp } from "../lib/anim";
import { Rise } from "./Type";

/**
 * SECTION 7 LOGO RULE.
 *
 * Both logos are used EXACTLY as supplied: opaque, with their own white
 * background intact, never alpha-keyed, and never inside a box, card, plate or
 * rounded backing. Each sits directly on the video, resized per placement, and
 * always clear of the caption-safe zone.
 *
 * What makes that read correctly is the palette, not a compositing trick — the
 * page is held within ~1-4% of white (see COLORS.paper) so the logo's own
 * ground is continuous with it. A `mix-blend-mode` approach was tried and
 * rejected: Scene applies a transform for its entrance, which creates a
 * stacking context and isolates the blend, leaving a visible white rectangle
 * over dark content — precisely the boxed look this rule forbids.
 */
export const Logo: React.FC<{
  which: "motu" | "shivansh";
  width: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ which, width, opacity = 1, style }) => (
  <Img
    src={img(which === "motu" ? LOGO.motu : LOGO.shivansh)}
    style={{ width, height: "auto", display: "block", opacity, ...style }}
  />
);

/**
 * The rotating Shivansh presence, ported from the Neumann reel's BrandPlate
 * pattern: each scene mounts one with a `mode`, so brand awareness accumulates
 * continuously without the same element appearing back to back. At reel length
 * the guideline is tighter than the long format's — no gap beyond ~20-25 s.
 */
export type BrandMode =
  | "none" | "cornerLogo" | "lowerThird" | "website"
  | "whatsapp" | "instagram" | "youtube" | "beat";

const DETAIL: Record<string, { label: string; value: string }> = {
  website: { label: "Website", value: BRAND.website },
  whatsapp: { label: "WhatsApp", value: BRAND.whatsapp[0] },
  instagram: { label: "Instagram", value: BRAND.instagram },
  youtube: { label: "YouTube", value: BRAND.youtube },
};

/** Compact corner mark — top-right, clear of the safe zone. */
export const ShivanshCorner: React.FC<{ delay?: number; width?: number }> = ({
  delay = 8, width = 300,
}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 14, EASE.out);
  return (
    <div style={{
      position: "absolute", top: SAFE.top, right: SAFE.marginX,
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
      opacity: t,
    }}>
      <Logo which="shivansh" width={width} />
      <span style={{ ...micro(21, 800, "0.06em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
    </div>
  );
};

/** MOTU mark — top-left, used sparingly (3 placements per reel). */
export const MotuCorner: React.FC<{ delay?: number; width?: number }> = ({
  delay = 8, width = 200,
}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 14, EASE.out);
  return (
    <div style={{ position: "absolute", top: SAFE.top, left: SAFE.marginX, opacity: t * 0.95 }}>
      <Logo which="motu" width={width} />
    </div>
  );
};

/** Lower-third strip — sits at the bottom of the SAFE box, never below it. */
export const ShivanshLowerThird: React.FC<{
  mode?: keyof typeof DETAIL;
  delay?: number;
}> = ({ mode = "website", delay = 10 }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 16, EASE.out);
  const d = DETAIL[mode];
  return (
    <div style={{
      position: "absolute", left: SAFE.marginX, right: SAFE.marginX,
      bottom: SAFE.bottom, display: "flex", alignItems: "center", gap: 20,
      opacity: t,
    }}>
      <Logo which="shivansh" width={264} />
      <div style={{ width: 1, height: 52, background: COLORS.lineStrong }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ ...micro(18, 700, "0.14em"), color: COLORS.slateDim }}>{d.label}</span>
        <span style={{ ...spec(25, 700, "0.01em"), color: COLORS.ink }}>{d.value}</span>
      </div>
    </div>
  );
};

/** Full branding beat between sub-sections. */
export const BrandBeat: React.FC<{ withMotu?: boolean; contact?: string[] }> = ({
  withMotu = false, contact,
}) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 3, 16, EASE.out);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center",
      paddingTop: SAFE.top, paddingBottom: SAFE.bottom, paddingLeft: SAFE.marginX, paddingRight: SAFE.marginX }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ opacity: t, transform: `translateY(${(1 - t) * 16}px)` }}>
          <Logo which="shivansh" width={720} />
        </div>
        <Rise delay={12} y={12}>
          <div style={{ ...micro(28, 800, "0.16em"), color: COLORS.motuBlue, textAlign: "center" }}>
            Authorized Distributor
          </div>
        </Rise>
        <Rise delay={18} y={12}>
          <div style={{ ...subhead(30, 500), color: COLORS.slate, textAlign: "center", maxWidth: 900, lineHeight: 1.4 }}>
            {BRAND.role} for {BRAND.region}
          </div>
        </Rise>
        <Rise delay={26} y={10}>
          <div style={{ ...spec(44, 800, "0.01em"), color: COLORS.ink }}>{BRAND.website}</div>
        </Rise>
        {contact?.length ? (
          <Rise delay={34} y={8}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
              {contact.map((c) => (
                <span key={c} style={{ ...micro(22, 600, "0.08em"), color: COLORS.slate }}>{c}</span>
              ))}
            </div>
          </Rise>
        ) : null}
        {withMotu ? (
          <Rise delay={40} y={8}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 6 }}>
              <div style={{ width: 120, height: 1, background: COLORS.lineStrong }} />
              <Logo which="motu" width={220} />
            </div>
          </Rise>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Dual price lockup — stacked for portrait. Section 11: both MOPs appear in
 * EVERY reel, visually segregated so they can never read as one blended range.
 */
export const PriceLockup: React.FC<{ delay?: number }> = ({ delay = 0 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
    {[
      { label: PRICE.interfaceLabel, value: PRICE.interface, accent: COLORS.motuBlue, d: delay },
      { label: PRICE.switchLabel, value: PRICE.switch, accent: COLORS.signal, d: delay + 10 },
    ].map((p) => (
      <Rise key={p.label} delay={p.d} y={16}>
        <div style={{
          display: "flex", flexDirection: "column", gap: 6,
          padding: "22px 30px",
          background: COLORS.paperLift,
          border: `1px solid ${COLORS.line}`,
          borderLeft: `8px solid ${p.accent}`,
          borderRadius: 16,
          boxShadow: `0 8px 24px ${COLORS.shadow}`,
        }}>
          <span style={{ ...micro(23, 700, "0.12em"), color: COLORS.slate }}>{p.label}</span>
          <span style={{ ...spec(66, 800, "-0.01em"), color: COLORS.ink, lineHeight: 1 }}>{p.value}</span>
          <span style={{ ...micro(20, 600, "0.06em"), color: COLORS.slateDim }}>{PRICE.note}</span>
        </div>
      </Rise>
    ))}
  </div>
);

export const DistributorLine: React.FC<{ delay?: number; size?: number }> = ({
  delay = 0, size = 24,
}) => (
  <Rise delay={delay} y={10}>
    <div style={{ ...micro(size, 600, "0.06em"), color: COLORS.slate, lineHeight: 1.55, maxWidth: 900 }}>
      <span style={{ color: COLORS.ink, fontWeight: 800 }}>{BRAND.name}</span>
      {" — "}{BRAND.role} for {BRAND.region}
    </div>
  </Rise>
);

/** The lead destination — most-repeated single detail in every reel. */
export const WebsiteCall: React.FC<{ delay?: number; size?: number }> = ({
  delay = 0, size = 56,
}) => (
  <Rise delay={delay} y={14}>
    <div style={{ ...spec(size, 800, "0.01em"), color: COLORS.ink, display: "flex", alignItems: "center", gap: 16 }}>
      <span style={{
        width: 14, height: 14, borderRadius: "50%", background: COLORS.signal,
        boxShadow: `0 0 0 7px ${hexA(COLORS.signal, 0.16)}`, flexShrink: 0,
      }} />
      {BRAND.website}
    </div>
  </Rise>
);
