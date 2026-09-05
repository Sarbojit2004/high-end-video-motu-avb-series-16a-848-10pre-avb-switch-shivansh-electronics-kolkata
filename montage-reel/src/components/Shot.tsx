import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import type { BuiltShot } from "../data/timeline.ts";
import { WIDTH, HEIGHT, FRAMES_PER_BEAT } from "../data/grid.ts";
import { ACT_PALETTES, inkFor, rgba } from "../design/palette.ts";
import { IMAGE_BY_SLUG } from "../data/images.ts";
import DIMS from "../data/image-manifest.json";
import { Picture, easeOut } from "./Picture.tsx";
import { TitleCard, HeroWord, MoodWord, Label, Scrim } from "./Text.tsx";
import { Enter, Exit, HitPop } from "./Transitions.tsx";
import { SignalField } from "./SignalField.tsx";

/**
 * Renders one shot of the timeline inside its own <Sequence>. Layout by kind:
 *   hero    the image at its own aspect, full width, over a soft enlarged copy
 *           of itself (vertical-video treatment); title card in the lower third
 *   single  one image, framed band at its own aspect on the act ground
 *   stack   2–3 landscape images stacked at their own aspects, staggered entry
 *   strip   3–4 small graphics in a row on the act ground
 *   grid    2×2 callback grid
 *   close   flat ground, serif mood word, optional small inset
 * The act's SignalField runs beneath everything; text over photographs sits on
 * a tight scrim (brief §4).
 */
const SAFE_X = 120;
const seedOf = (s: string) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0);
const dimsOf = (slug: string): { w: number; h: number } => (DIMS as Record<string, { w: number; h: number }>)[slug] ?? { w: 16, h: 9 };
const arOf = (slug: string) => { const d = dimsOf(slug); return d.w / d.h; };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export const ShotView: React.FC<{ shot: BuiltShot }> = ({ shot }) => {
  const frame = useCurrentFrame(); // relative to the sequence start (= startFrame - lead)
  /** entry progress of the i-th element of a multi-image shot: staggered inside the transition
   *  lead so everything is fully on screen AT the landing beat; hard cuts pop in complete. */
  const entry = (i: number, stagger: number, n = shot.images.length) => {
    if (shot.lead <= 0) return frame >= shot.lead ? 1 : 0;
    const st = Math.min(stagger, Math.floor(shot.lead / Math.max(1, n))); // every element is fully in by the beat
    return easeOut((frame - i * st) / Math.max(3, shot.lead - i * st));
  };
  const land = shot.lead; // the beat lands here
  const nominalEnd = shot.endFrame - shot.startFrame + shot.lead; // where the next shot's beat lands
  const p = ACT_PALETTES[shot.act];
  const bg = p.bg[Math.min(shot.bg ?? 0, p.bg.length - 1)];
  const ink = inkFor(p, bg);
  const local = Math.max(0, frame - land);
  const holdFrames = shot.endFrame - shot.startFrame;
  const longHold = holdFrames > FRAMES_PER_BEAT * 1.2;
  const driftAmt = longHold ? 0.8 : 0.35;
  const textStart = land + (shot.kind === "hero" ? 4 : 1);
  const imgs = shot.images;

  let body: React.ReactNode = null;
  let overlay: React.ReactNode = null;

  if (shot.kind === "hero" || shot.kind === "single") {
    const slug = imgs[0];
    const info = IMAGE_BY_SLUG[slug];
    const ar = arOf(slug);
    const isCover = !info || info.fit === "cover";
    const hero = shot.kind === "hero";
    // cover photographs sit in a band at their own aspect (a card for singles,
    // edge-to-edge for heroes over a blurred copy of themselves); cut-outs and
    // panels are placed big and un-carded straight on the act ground
    const w = isCover ? (hero ? WIDTH : WIDTH - SAFE_X * 2) : WIDTH - (info?.fit === "panel" ? 40 : 100);
    const natural = w / ar;
    const h = isCover ? clamp(natural, hero ? HEIGHT * 0.28 : 620, HEIGHT * 0.62) : clamp(natural, info?.fit === "panel" ? 260 : 700, HEIGHT * 0.6);
    const textReserve = shot.text ? (shot.text.role === "title" ? 560 : shot.text.role === "word" ? 700 : 220) : 0;
    const top = (HEIGHT - h - textReserve) / 2;
    const punchIn = 1 + 0.05 * (1 - easeOut(local / 14));
    body = (
      <>
        {hero && isCover ? (
          // blurred, dimmed copy of the same photograph fills the frame behind the sharp band
          <AbsoluteFill style={{ opacity: 0.5, transform: "scale(1.35)", transformOrigin: "50% 50%", filter: "blur(38px) saturate(1.2)" }}>
            <Picture slug={slug} width={WIDTH} height={HEIGHT} ground={bg} drift={0.25} seed={seedOf(slug) + 7} localFrame={local} plate={false} />
          </AbsoluteFill>
        ) : null}
        {hero && isCover ? <AbsoluteFill style={{ background: `linear-gradient(180deg, ${rgba(bg, 0.6)} 0%, ${rgba(bg, 0.3)} 35%, ${rgba(bg, 0.3)} 65%, ${rgba(bg, 0.8)} 100%)` }} /> : null}
        {!isCover ? (
          <div style={{ position: "absolute", left: 0, top: top - h * 0.6, width: WIDTH, height: h * 2.2, background: `radial-gradient(ellipse 60% 45% at 50% 50%, ${rgba("#ffffff", 0.17)} 0%, ${rgba("#ffffff", 0.05)} 40%, transparent 70%)` }} />
        ) : null}
        <div style={{ position: "absolute", left: (WIDTH - w) / 2, top, width: w, height: h, transform: `scale(${punchIn})`, boxShadow: isCover && !hero ? `0 60px 140px ${rgba("#000", 0.55)}` : "none", borderRadius: isCover && !hero ? 28 : 0, overflow: "hidden",
          // edge-to-edge hero photographs dissolve into their blurred backdrop instead of ending on a hard band edge
          ...(hero && isCover ? { maskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 14%, #000 86%, transparent 100%)" } : {}) }}>
          <Picture slug={slug} width={w} height={h} ground={isCover ? bg : "transparent"} drift={driftAmt} seed={seedOf(slug)} localFrame={local} zoom={hero && isCover ? 1.03 : 1} plate={false} />
        </div>
      </>
    );
    if (shot.text?.role === "title") {
      overlay = (
        <div style={{ position: "absolute", left: SAFE_X, right: SAFE_X, top: top + h + 90 }}>
          <TitleCard value={shot.text.value} sub={shot.text.sub} face={shot.text.face} ink={hero && isCover ? p.scrimInk : ink} ink2={hero && isCover ? p.scrimInk : ink} accent={p.accent} start={textStart} size={shot.text.face === "display" ? 300 : 340} scrim={hero && isCover ? p.scrim : undefined} maxWidth={WIDTH - SAFE_X * 2 - (hero && isCover ? 140 : 0)} />
        </div>
      );
    } else if (shot.text?.role === "word") {
      overlay = (
        <div style={{ position: "absolute", left: 0, right: 0, top: top + h + 100, display: "flex", justifyContent: "center" }}>
          <Scrim color={p.scrim} pad={70}><HeroWord value={shot.text.value} ink={p.scrimInk} start={textStart} size={shot.text.value.length > 6 ? 280 : 520} maxWidth={1700} /></Scrim>
        </div>
      );
    } else if (shot.text?.role === "label") {
      overlay = (
        <div style={{ position: "absolute", left: SAFE_X, top: top + h + 70 }}>
          <Label value={shot.text.value} ink={ink} accent={p.accent} start={textStart} />
        </div>
      );
    }
  } else if (shot.kind === "stack") {
    const n = imgs.length;
    const gap = 40;
    const w = WIDTH - SAFE_X * 2;
    const reserve = shot.text?.role === "word" ? 760 : shot.text ? 260 : 0;
    const maxTotal = HEIGHT - 560 - reserve;
    // natural row heights from each image's aspect, then scaled to fit
    let rows = imgs.map((s) => { const info = IMAGE_BY_SLUG[s]; return clamp(w / arOf(s), info?.fit === "panel" ? 300 : 520, 1300); });
    const sum = rows.reduce((a, b) => a + b, 0) + gap * (n - 1);
    if (sum > maxTotal) rows = rows.map((r) => (r * (maxTotal - gap * (n - 1))) / (sum - gap * (n - 1)));
    const totalH = rows.reduce((a, b) => a + b, 0) + gap * (n - 1);
    const top0 = (HEIGHT - totalH) / 2 + (shot.text?.role === "word" ? 300 : shot.text ? -100 : 0);
    let y = top0;
    body = imgs.map((slug, i) => {
      const t = entry(i, 3);
      const settle = easeOut((local - i * 2) / 9);
      const fromLeft = i % 2 === 0;
      const rowH = rows[i];
      const el = (
        <div key={slug} style={{ position: "absolute", left: SAFE_X, top: y, width: w, height: rowH, opacity: t, transform: `translateX(${(1 - t) * (fromLeft ? -1 : 1) * 260}px) scale(${0.965 + 0.035 * settle})`, borderRadius: 24, overflow: "hidden", boxShadow: `0 40px 100px ${rgba("#000", 0.5)}` }}>
          <Picture slug={slug} width={w} height={rowH} ground={bg} drift={0.4} seed={seedOf(slug) + i} localFrame={local} />
        </div>
      );
      y += rowH + gap;
      return el;
    });
    if (shot.text?.role === "word") {
      overlay = (
        <div style={{ position: "absolute", left: 0, right: 0, top: top0 - 700, height: 640, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <HeroWord value={shot.text.value} ink={ink} start={textStart} size={shot.text.value.length > 4 ? 520 : 640} />
        </div>
      );
    } else if (shot.text?.role === "label") {
      overlay = <div style={{ position: "absolute", left: SAFE_X, top: top0 + totalH + 70 }}><Label value={shot.text.value} ink={ink} accent={p.accent} start={textStart} /></div>;
    }
  } else if (shot.kind === "strip") {
    const n = imgs.length;
    const cols = n <= 3 ? n : 2;
    const rowsN = Math.ceil(n / cols);
    const gap = 40;
    const cellW = (WIDTH - SAFE_X * 2 - gap * (cols - 1)) / cols;
    const cellH = Math.min(cellW, 900);
    const totalH = rowsN * cellH + gap * (rowsN - 1);
    const top0 = (HEIGHT - totalH) / 2;
    body = imgs.map((slug, i) => {
      const t = entry(i, 2);
      const settle = easeOut((local - i * 2) / 8);
      const c = i % cols, r = Math.floor(i / cols);
      return (
        <div key={slug} style={{ position: "absolute", left: SAFE_X + c * (cellW + gap), top: top0 + r * (cellH + gap), width: cellW, height: cellH, opacity: t, transform: `scale(${(0.7 + 0.3 * t) * (0.94 + 0.06 * settle)}) rotate(${(1 - t) * (c % 2 ? 6 : -6)}deg)`, borderRadius: 30, overflow: "hidden", boxShadow: `0 30px 80px ${rgba("#000", 0.45)}` }}>
          <Picture slug={slug} width={cellW} height={cellH} ground={bg} drift={0.3} seed={seedOf(slug)} localFrame={local} plate />
        </div>
      );
    });
  } else if (shot.kind === "grid") {
    const gap = 40;
    const cellW = (WIDTH - SAFE_X * 2 - gap) / 2;
    const cellH = cellW * 0.78;
    const top0 = (HEIGHT - (cellH * 2 + gap)) / 2 + (shot.text?.role === "label" ? -90 : 0);
    body = imgs.map((slug, i) => {
      const t = entry(i, 2);
      const settle = easeOut((local - i * 2) / 8);
      const c = i % 2, r = Math.floor(i / 2);
      return (
        <div key={slug} style={{ position: "absolute", left: SAFE_X + c * (cellW + gap), top: top0 + r * (cellH + gap), width: cellW, height: cellH, opacity: t, transform: `scale(${(0.9 + 0.1 * t) * (0.96 + 0.04 * settle)})`, borderRadius: 26, overflow: "hidden", boxShadow: `0 30px 80px ${rgba("#000", 0.5)}` }}>
          <Picture slug={slug} width={cellW} height={cellH} ground={p.bg[(i + (shot.bg ?? 0)) % p.bg.length]} drift={0.3} seed={seedOf(slug)} localFrame={local} />
        </div>
      );
    });
    if (shot.text?.role === "word") {
      overlay = (
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Scrim color={p.scrim} pad={60}><HeroWord value={shot.text.value} ink={p.scrimInk} start={textStart} size={340} /></Scrim>
        </div>
      );
    } else if (shot.text?.role === "label") {
      overlay = <div style={{ position: "absolute", left: 0, right: 0, top: top0 + cellH * 2 + gap + 90, display: "flex", justifyContent: "center" }}><Label value={shot.text.value} ink={ink} accent={p.accent} start={textStart} /></div>;
    }
  } else if (shot.kind === "close") {
    const slug = imgs[0];
    const insetW = WIDTH - 2 * (SAFE_X + 200);
    const insetH = slug ? clamp(insetW / arOf(slug), 500, 820) : 0;
    body = (
      <>
        {slug ? (
          <div style={{ position: "absolute", left: SAFE_X + 200, width: insetW, bottom: 520, height: insetH, borderRadius: 24, overflow: "hidden", opacity: 0.8 * easeOut((local - 10) / 16), boxShadow: `0 40px 100px ${rgba("#000", 0.5)}` }}>
            <Picture slug={slug} width={insetW} height={insetH} ground={bg} drift={0.9} seed={seedOf(slug)} localFrame={local} />
          </div>
        ) : null}
        <div style={{ position: "absolute", left: 0, right: 0, top: slug ? HEIGHT * 0.36 : HEIGHT * 0.47, display: "flex", justifyContent: "center", transform: "translateY(-50%)" }}>
          {shot.text ? <MoodWord value={shot.text.value} ink={ink} start={land + 2} size={shot.text.value.length > 8 ? 400 : 520} /> : null}
        </div>
      </>
    );
  }

  const content = (
    <AbsoluteFill>
      <SignalField bg={bg} accent={p.accent} line={p.line} seed={seedOf(shot.act) + (shot.bg ?? 0)} density={shot.kind === "hero" ? 0.35 : 0.6} lineOpacity={shot.kind === "hero" ? 0.35 : 0.55} glow={shot.kind === "close" ? 0.2 : 0.35} />
      {body}
      {overlay}
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill>
      <Exit type={shot.exit} end={nominalEnd} lead={shot.exitLead} dir={shot.dir}>
        <Enter type={shot.enter} land={land} lead={shot.lead} dir={shot.dir} accent={p.accent}>
          {content}
        </Enter>
      </Exit>
      {shot.enter === "hard" || shot.enter === "punch" ? <HitPop at={land} /> : null}
    </AbsoluteFill>
  );
};
