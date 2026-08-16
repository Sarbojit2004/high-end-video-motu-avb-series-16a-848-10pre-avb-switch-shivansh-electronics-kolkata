import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { BRAND, COLORS, PRICE, SPACE, hexA } from "../theme";
import { img, LOGO } from "../assets";
import { micro, spec, subhead, headline } from "../fonts";
import { EASE, ramp } from "../lib/anim";
import { Rise } from "./Type";

/**
 * SECTION 7 LOGO RULE — and the client's explicit direction on these two files.
 *
 * Both logos are used EXACTLY as supplied: opaque, with their own white
 * background intact. They are deliberately NOT made transparent, and they are
 * NOT placed inside a box, card, plate or rounded backing of any kind — each
 * one sits directly on the video, resized to suit the space it occupies.
 *
 * What makes that work is the palette rather than any compositing trick: the
 * page is held in a near-white range (see COLORS.paper), so the logo's own
 * white ground is within ~4% of the page behind it and reads as continuous.
 * Nothing is keyed, alpha-masked or blended — the file on disk is drawn as-is.
 *
 * (An earlier pass used `mix-blend-mode: multiply` here. It cannot work in this
 * tree: Scene applies a transform for its entrance, which creates a stacking
 * context and isolates the blend from the page behind it — the logo rendered
 * with a visible white rectangle over dark content. Layout discipline plus a
 * near-white page is the reliable fix.)
 */
export const Logo: React.FC<{
  which: "motu" | "shivansh";
  width: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ which, width, opacity = 1, style }) => (
  <Img
    src={img(which === "motu" ? LOGO.motu : LOGO.shivansh)}
    style={{
      width,
      height: "auto",
      display: "block",
      opacity,
      ...style,
    }}
  />
);

/** Persistent corner mark — used during hero shots and technical beats. */
export const ShivanshCorner: React.FC<{
  delay?: number;
  position?: "tl" | "tr" | "bl" | "br";
  width?: number;
  withUrl?: boolean;
}> = ({ delay = 12, position = "tr", width = 268, withUrl = true }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 20, EASE.out);
  const vert = position.startsWith("t") ? { top: SPACE.marginY } : { bottom: SPACE.marginY };
  const horz = position.endsWith("l") ? { left: SPACE.marginX } : { right: SPACE.marginX };
  const align = position.endsWith("l") ? "flex-start" : "flex-end";
  return (
    <div
      style={{
        position: "absolute",
        ...vert,
        ...horz,
        display: "flex",
        flexDirection: "column",
        alignItems: align,
        gap: 7,
        opacity: t,
        transform: `translateY(${(1 - t) * -8}px)`,
      }}
    >
      <Logo which="shivansh" width={width} />
      {withUrl ? (
        <span style={{ ...micro(19, 700, "0.1em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
      ) : null}
    </div>
  );
};

/** MOTU corner mark — used sparingly (8 placements across the runtime). */
export const MotuCorner: React.FC<{
  delay?: number;
  position?: "tl" | "tr" | "bl" | "br";
  width?: number;
}> = ({ delay = 12, position = "tl", width = 178 }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 20, EASE.out);
  const vert = position.startsWith("t") ? { top: SPACE.marginY } : { bottom: SPACE.marginY };
  const horz = position.endsWith("l") ? { left: SPACE.marginX } : { right: SPACE.marginX };
  return (
    <div style={{ position: "absolute", ...vert, ...horz, opacity: t * 0.95 }}>
      <Logo which="motu" width={width} />
    </div>
  );
};

/** Lower-third contact strip shown during technical explanation beats. */
export const ShivanshLowerThird: React.FC<{
  detail?: string;
  delay?: number;
}> = ({ detail, delay = 14 }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, delay, 22, EASE.out);
  return (
    <div
      style={{
        position: "absolute",
        left: SPACE.marginX,
        bottom: SPACE.marginY,
        display: "flex",
        alignItems: "center",
        gap: 22,
        opacity: t,
        transform: `translateX(${(1 - t) * -22}px)`,
      }}
    >
      <Logo which="shivansh" width={244} />
      <div style={{ width: 1, height: 44, background: COLORS.lineStrong }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ ...micro(21, 800, "0.1em"), color: COLORS.motuBlue }}>{BRAND.website}</span>
        {detail ? (
          <span style={{ ...micro(16, 600, "0.12em"), color: COLORS.slate }}>{detail}</span>
        ) : null}
      </div>
    </div>
  );
};

/**
 * Full branding beat between segments. Every one of the seven chapters gets at
 * least one, and no gap between any two Shivansh appearances exceeds ~34 s.
 */
export const BrandBeat: React.FC<{
  headlineText?: string;
  contact?: string[];
  withMotu?: boolean;
}> = ({ headlineText = "Authorized Distributor", contact, withMotu = false }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 4, 24, EASE.out);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ opacity: t, transform: `translateY(${(1 - t) * 20}px)` }}>
          <Logo which="shivansh" width={620} />
        </div>
        <Rise delay={16} y={16}>
          <div style={{ ...micro(27, 700, "0.2em"), color: COLORS.motuBlue, textAlign: "center" }}>
            {headlineText}
          </div>
        </Rise>
        <Rise delay={24} y={16}>
          <div
            style={{
              ...subhead(31, 500),
              color: COLORS.slate,
              textAlign: "center",
              maxWidth: 1320,
              lineHeight: 1.4,
            }}
          >
            {BRAND.role} for {BRAND.region}
          </div>
        </Rise>
        <Rise delay={34} y={14}>
          <div style={{ ...spec(46, 800, "0.02em"), color: COLORS.ink }}>{BRAND.website}</div>
        </Rise>
        {contact?.length ? (
          <Rise delay={44} y={12}>
            <div style={{ display: "flex", gap: 30, flexWrap: "wrap", justifyContent: "center", maxWidth: 1500 }}>
              {contact.map((c) => (
                <span key={c} style={{ ...micro(20, 600, "0.1em"), color: COLORS.slate }}>
                  {c}
                </span>
              ))}
            </div>
          </Rise>
        ) : null}
        {withMotu ? (
          <Rise delay={52} y={12}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 8 }}>
              <div style={{ width: 120, height: 1, background: COLORS.lineStrong }} />
              <Logo which="motu" width={196} />
            </div>
          </Rise>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Dual price lockup. Section 11 / Stage 10: the interface price and the switch
 * price are visually segregated so they can never be read as one blended range.
 */
export const PriceLockup: React.FC<{ delay?: number; compact?: boolean }> = ({
  delay = 0,
  compact = false,
}) => {
  const size = compact ? 1 : 1.18;
  return (
    <div style={{ display: "flex", gap: compact ? 26 : 40, alignItems: "stretch" }}>
      {[
        { label: PRICE.interfaceLabel, value: PRICE.interface, accent: COLORS.motuBlue, d: delay },
        { label: PRICE.switchLabel, value: PRICE.switch, accent: COLORS.signal, d: delay + 12 },
      ].map((p) => (
        <Rise key={p.label} delay={p.d} y={20}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: `${26 * size}px ${38 * size}px`,
              background: COLORS.paperLift,
              border: `1px solid ${COLORS.line}`,
              borderTop: `6px solid ${p.accent}`,
              borderRadius: 18,
              boxShadow: `0 10px 30px ${COLORS.shadow}`,
              minWidth: compact ? 430 : 520,
            }}
          >
            <span style={{ ...micro(21 * size, 700, "0.14em"), color: COLORS.slate }}>{p.label}</span>
            <span style={{ ...spec(64 * size, 800, "-0.01em"), color: COLORS.ink, lineHeight: 1 }}>
              {p.value}
            </span>
            <span style={{ ...micro(18 * size, 600, "0.08em"), color: COLORS.slateDim }}>{PRICE.note}</span>
          </div>
        </Rise>
      ))}
    </div>
  );
};

/** Distributor status line, used in chapter openers and the outro. */
export const DistributorLine: React.FC<{ delay?: number; size?: number; align?: "left" | "center" }> = ({
  delay = 0,
  size = 26,
  align = "left",
}) => (
  <Rise delay={delay} y={12}>
    <div
      style={{
        ...micro(size, 600, "0.1em"),
        color: COLORS.slate,
        textAlign: align,
        maxWidth: 1180,
        lineHeight: 1.6,
      }}
    >
      <span style={{ color: COLORS.ink, fontWeight: 800 }}>{BRAND.name}</span>
      {" — "}
      {BRAND.role} for {BRAND.region}
    </div>
  </Rise>
);

/** Big website call — the single most-repeated destination in the video. */
export const WebsiteCall: React.FC<{ delay?: number; size?: number }> = ({ delay = 0, size = 72 }) => (
  <Rise delay={delay} y={18}>
    <div
      style={{
        ...spec(size, 800, "0.01em"),
        color: COLORS.ink,
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: COLORS.signal,
          boxShadow: `0 0 0 7px ${hexA(COLORS.signal, 0.16)}`,
        }}
      />
      {BRAND.website}
    </div>
  </Rise>
);

/** Chapter title card used at the head of each of the seven segments. */
export const ChapterOpener: React.FC<{
  n: string;
  kicker: string;
  title: string;
  sub?: string;
}> = ({ n, kicker, title, sub }) => (
  <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "center", paddingLeft: SPACE.marginX + 40 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Rise delay={2} y={14}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <span style={{ ...spec(30, 800, "0.24em"), color: COLORS.motuBlue }}>{n}</span>
          <span style={{ ...micro(25, 700, "0.24em"), color: COLORS.slate }}>{kicker}</span>
        </div>
      </Rise>
      <Rise delay={12} y={30}>
        <div style={{ ...headline(124, 800), color: COLORS.ink, maxWidth: 1560 }}>{title}</div>
      </Rise>
      {sub ? (
        <Rise delay={24} y={18}>
          <div style={{ ...subhead(38), color: COLORS.slate, maxWidth: 1280 }}>{sub}</div>
        </Rise>
      ) : null}
    </div>
  </AbsoluteFill>
);
