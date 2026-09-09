import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { ACCENT, GROUND, INK, FONT, TYPE, VIDEO, type ProductKey } from "../theme";

// ─────────────────────────────────────────────────────────────────────────────
// THE TWO ENVIRONMENTS (Section 2, item 3)
//
// The reference alternates between a warm cream minimal field and a near-black
// void. It is not decoration — it is how the piece paces itself over its
// runtime. This reel uses the same alternation on segment boundaries so the
// four-product structure gets a visual rhythm a viewer can feel:
//
//   cold open   dark     the thesis, stated in the void
//   16A         light    clean line-level product, clean field
//   848         dark     the control room
//   10pre       light    the live-input product, open and bright
//   AVB Switch  dark     the network — infrastructure belongs in the void
//   close       light    resolve, and the contact plate reads best on cream
// ─────────────────────────────────────────────────────────────────────────────

type Env = "light" | "dark";

/** The blueprint grid patch — Section 2, item 6. */
export const GridField: React.FC<{
  env: Env;
  product: ProductKey;
  /** 0..1 — how much of the frame the patch covers. */
  extent?: number;
  x?: number;
  y?: number;
  opacity?: number;
}> = ({ env, product, extent = 0.62, x = 0.5, y = 0.5, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const line = env === "light" ? GROUND.lightLine : GROUND.darkLine;
  const dot = env === "light" ? GROUND.lightDot : GROUND.darkDot;
  const cell = 96;

  // A slow drift keeps the texture alive without ever calling attention to it.
  const dx = Math.sin(frame / 190) * 12;
  const dy = Math.cos(frame / 240) * 9;

  const w = VIDEO.width * extent;
  const h = w * 1.28;

  return (
    <div
      style={{
        position: "absolute",
        left: VIDEO.width * x - w / 2,
        top: VIDEO.height * y - h / 2,
        width: w,
        height: h,
        opacity: opacity * 0.9,
        transform: `translate(${dx}px, ${dy}px)`,
        backgroundImage: `
          linear-gradient(to right, ${line} 2px, transparent 2px),
          linear-gradient(to bottom, ${line} 2px, transparent 2px),
          radial-gradient(circle at 0 0, ${dot} 5px, transparent 5.5px)`,
        backgroundSize: `${cell}px ${cell}px, ${cell}px ${cell}px, ${cell}px ${cell}px`,
        // Fade the patch out at its edges so it never reads as a hard rectangle.
        WebkitMaskImage:
          "radial-gradient(ellipse 52% 46% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 46%, rgba(0,0,0,0) 78%)",
        maskImage:
          "radial-gradient(ellipse 52% 46% at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 46%, rgba(0,0,0,0) 78%)",
      }}
    />
  );
};

/** Restrained particle drift — Section 2, item 5. */
export const Particles: React.FC<{
  env: Env;
  product: ProductKey;
  count?: number;
  seed?: string;
  cx?: number;
  cy?: number;
  spread?: number;
}> = ({ env, product, count = 26, seed = "p", cx = 0.5, cy = 0.46, spread = 0.42 }) => {
  const frame = useCurrentFrame();
  const accent = ACCENT[product];

  return (
    <>
      {new Array(count).fill(0).map((_, i) => {
        const r1 = random(`${seed}-${i}-a`);
        const r2 = random(`${seed}-${i}-b`);
        const r3 = random(`${seed}-${i}-c`);
        const r4 = random(`${seed}-${i}-d`);

        const speed = 0.24 + r3 * 0.5;
        const phase = r4 * Math.PI * 2;
        // Slow elliptical drift, never a straight line (Section 2, item 4).
        const px =
          VIDEO.width * (cx + (r1 - 0.5) * 2 * spread) +
          Math.sin(frame / (100 / speed) + phase) * (44 + r2 * 90);
        const py =
          VIDEO.height * (cy + (r2 - 0.5) * 2 * spread * 0.72) +
          Math.cos(frame / (128 / speed) + phase) * (34 + r1 * 74);

        const size = 4 + r3 * 12;
        const twinkle = 0.32 + 0.68 * (0.5 + 0.5 * Math.sin(frame / (22 + r1 * 30) + phase));
        // A few particles carry the accent; most stay neutral, as in the
        // reference where the blue sparks are sparse against the cream.
        const isAccent = r4 > 0.68;
        const col = isAccent
          ? env === "light"
            ? accent.key
            : accent.glow
          : env === "light"
            ? "rgba(24,22,20,0.34)"
            : "rgba(255,255,255,0.62)";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: size,
              height: size,
              borderRadius: "50%",
              background: col,
              opacity: (env === "light" ? 0.5 : 0.72) * twinkle,
              boxShadow: env === "dark" && isAccent ? `0 0 ${size * 3}px ${accent.glow}` : "none",
            }}
          />
        );
      })}
    </>
  );
};

/** The full ground for a segment, including the light that picks out the subject. */
export const Ground: React.FC<{
  env: Env;
  product: ProductKey;
  /** Where the key light falls, 0..1 of frame. */
  lightX?: number;
  lightY?: number;
  children?: React.ReactNode;
}> = ({ env, product, lightX = 0.5, lightY = 0.42, children }) => {
  const accent = ACCENT[product];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: env === "light" ? GROUND.light : GROUND.dark,
        overflow: "hidden",
      }}
    >
      {env === "light" ? (
        <>
          {/* A soft vignette so the cream field has a centre and does not read flat. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 78% 56% at ${lightX * 100}% ${lightY * 100}%, ${GROUND.lightLift} 0%, ${GROUND.light} 52%, ${GROUND.lightSink} 100%)`,
            }}
          />
          {/* The faintest accent wash, so even the light environment is tinted
              by whichever product owns the segment. */}
          <div style={{ position: "absolute", inset: 0, background: accent.wash }} />
        </>
      ) : (
        <>
          {/* The void's single light source, tinted by the product accent —
              the reference picks its subject out of black exactly this way. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 62% 42% at ${lightX * 100}% ${lightY * 100}%, ${accent.glow}26 0%, ${accent.key}10 34%, ${GROUND.dark} 72%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(ellipse 44% 30% at ${lightX * 100}% ${lightY * 100}%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 68%)`,
            }}
          />
        </>
      )}
      {children}
    </div>
  );
};

/**
 * The technical-graphic accent — Section 2, item 7.
 *
 * The reference uses a barcode as a small authenticity marker. A barcode means
 * nothing for a networked audio interface, so it is reinterpreted as the marks
 * this ecosystem actually carries: a signal-flow glyph, a port/link readout, a
 * clock-lock indicator. Same job — a small piece of engineering furniture that
 * says the thing on screen is a real instrument — in this product's own idiom.
 */
export const TechMark: React.FC<{
  env: Env;
  product: ProductKey;
  kind?: "ports" | "clock" | "flow" | "rate";
  x: number;
  y: number;
  opacity?: number;
}> = ({ env, product, kind = "ports", x, y, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const accent = ACCENT[product];
  const ink = env === "light" ? INK.onLightSoft : INK.onDarkSoft;
  const key = env === "light" ? accent.key : accent.glow;

  const body: React.ReactNode = (() => {
    if (kind === "ports") {
      // Six link LEDs — the AVB Switch's own front panel, abstracted.
      return (
        <div style={{ display: "flex", gap: 13, alignItems: "flex-end" }}>
          {new Array(6).fill(0).map((_, i) => {
            const lit = (Math.floor(frame / 9) + i) % 6 !== 0;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
                <div
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 3,
                    background: lit ? key : ink,
                    opacity: lit ? 1 : 0.3,
                    boxShadow: lit && env === "dark" ? `0 0 14px ${key}` : "none",
                  }}
                />
                <div style={{ width: 15, height: 32, borderRadius: 2, border: `2px solid ${ink}`, opacity: 0.55 }} />
              </div>
            );
          })}
        </div>
      );
    }
    if (kind === "clock") {
      // A sync bar settling — the visual of a clock locking.
      const lock = 0.5 + 0.5 * Math.sin(frame / 15);
      return (
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {new Array(18).fill(0).map((_, i) => {
            const h = 12 + Math.abs(Math.sin(i * 0.7 + frame / 11)) * 30 * (1 - lock * 0.7);
            return <div key={i} style={{ width: 5, height: h, background: i % 6 === 0 ? key : ink, opacity: 0.8, borderRadius: 2 }} />;
          })}
        </div>
      );
    }
    if (kind === "flow") {
      // A signal path with a travelling packet.
      const p = (frame % 70) / 70;
      return (
        <div style={{ position: "relative", width: 250, height: 30 }}>
          <div style={{ position: "absolute", top: 13, left: 0, width: 250, height: 3, background: ink, opacity: 0.5 }} />
          {[0, 0.5, 1].map((f, i) => (
            <div key={i} style={{ position: "absolute", top: 6, left: f * 236, width: 17, height: 17, borderRadius: 3, border: `3px solid ${ink}`, opacity: 0.7 }} />
          ))}
          <div style={{ position: "absolute", top: 9, left: p * 236, width: 12, height: 12, borderRadius: "50%", background: key, boxShadow: env === "dark" ? `0 0 16px ${key}` : "none" }} />
        </div>
      );
    }
    // rate — a sample-rate readout
    return (
      <div style={{ display: "flex", gap: 9, alignItems: "baseline", fontFamily: FONT.mono }}>
        <span style={{ fontSize: 30, fontWeight: 800, color: key, letterSpacing: 1 }}>192</span>
        <span style={{ fontSize: 21, fontWeight: 600, color: ink, letterSpacing: 3 }}>kHz</span>
        <span style={{ fontSize: 21, fontWeight: 600, color: ink, letterSpacing: 3, opacity: 0.7 }}>24-BIT</span>
      </div>
    );
  })();

  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: opacity * 0.85 }}>{body}</div>
  );
};
