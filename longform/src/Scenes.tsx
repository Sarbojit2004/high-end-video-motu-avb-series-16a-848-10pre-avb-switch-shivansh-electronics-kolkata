import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SPACE, BRAND, PRICE, hexA } from "./theme";
import { Ground, Frame, Scene, Motes } from "./components/Shell";
import {
  Eyebrow, Headline, Subhead, Editorial, SpecChip, PointRow, Rise,
} from "./components/Type";
import { Plate, MacroReveal, PortSweep, Montage, Gimbal, Drift } from "./components/Media";
import {
  ShivanshCorner, MotuCorner, ShivanshLowerThird, BrandBeat, PriceLockup,
  DistributorLine, WebsiteCall, ChapterOpener, Logo,
} from "./components/Brand";
import { IdenticalEngine, TopologyMap, DataFlow, FrontEndBadge } from "./components/Graphics";
import { micro, spec, subhead as subheadStyle } from "./fonts";
import { EASE, ramp } from "./lib/anim";
import type { Beat } from "./schedule";
import { frames } from "./schedule";

/**
 * Layout budget. Canvas is 1920x1080 with a 56px inboard safe margin, so the
 * usable content box is 1808 x 976. Where a corner brand mark or a lower-third
 * is present, the layouts below shrink to clear it — nothing is ever allowed to
 * overlap, which Checkpoint 3 verifies on rendered stills.
 */
const CORNER_CLEAR = 1380; // heading max width when a top-right corner mark is up
const LOWER_CLEAR = 118; // extra bottom padding when a lower-third is up

const headingWidth = (b: Beat) =>
  b.brand === "corner" || b.motu ? CORNER_CLEAR : 1660;
const bottomClear = (b: Beat) => (b.brand === "lower" ? LOWER_CLEAR : 0);

/**
 * Pins media into a flex slot. A bare `height: 100%` inside a flex item
 * resolves against the flex CONTAINER, not the item, so media overflowed the
 * safe padding by exactly the heading's height and ran under the lower-third.
 * Absolute positioning inside a relative slot is exact.
 */
const Fill: React.FC<{ children: React.ReactNode; grow?: number }> = ({ children, grow = 1 }) => (
  <div style={{ flex: grow, minHeight: 0, minWidth: 0, position: "relative" }}>
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);

/** Shared text stack used by most layouts. */
const TextBlock: React.FC<{ b: Beat; headingSize?: number; delay?: number }> = ({
  b, headingSize = 82, delay = 0,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
    {b.eyebrow ? <Eyebrow delay={delay}>{b.eyebrow}</Eyebrow> : null}
    {b.heading ? (
      <Headline size={headingSize} delay={delay + 6} style={{ maxWidth: headingWidth(b), whiteSpace: "pre-line" }}>
        {b.heading}
      </Headline>
    ) : null}
    {b.sub ? (
      <Subhead delay={delay + 14} size={32} maxWidth={headingWidth(b) - 40}>
        {b.sub}
      </Subhead>
    ) : null}
  </div>
);

/**
 * Brand furniture for a beat — corner marks, lower-thirds.
 *
 * The MOTU mark sits top-left, which is only free on vertically-centred
 * layouts (cold open, chapter openers, branding beats, outro). Beats that
 * anchor a heading to the top of the frame therefore do not carry it — see the
 * schedule, where c7-recap deliberately leaves motu off for that reason.
 */
const BrandLayer: React.FC<{ b: Beat }> = ({ b }) => (
  <>
    {b.motu ? <MotuCorner position="tl" width={172} /> : null}
    {b.brand === "corner" ? <ShivanshCorner position="tr" /> : null}
    {b.brand === "cornerLeft" ? <ShivanshCorner position="tl" /> : null}
    {b.brand === "lower" ? <ShivanshLowerThird detail={BRAND.region} /> : null}
  </>
);

// ══════════════════════════════════════════════════════════════════ layouts

const ColdOpen: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const frame = useCurrentFrame();
  const textIn = ramp(frame, Math.round(d * 0.36), 26, EASE.out);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ padding: 0 }}>
        <MacroReveal
          idx={b.idx!}
          duration={d}
          fx={b.focal?.[0] ?? 0.5}
          fy={b.focal?.[1] ?? 0.5}
          macroScale={b.macroScale ?? 3.2}
        />
      </AbsoluteFill>
      {/* legibility lift over the image, on the light side — never a dark scrim */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${hexA(COLORS.paper, 0.97)} 0%, ${hexA(COLORS.paper, 0.9)} 38%, ${hexA(COLORS.paper, 0)} 72%)`,
          opacity: textIn,
        }}
      />
      <Frame style={{ justifyContent: "center" }}>
        <div style={{ opacity: textIn, maxWidth: 1200 }}>
          {b.eyebrow ? <Eyebrow delay={Math.round(d * 0.36)}>{b.eyebrow}</Eyebrow> : null}
          <div style={{ height: 22 }} />
          <Headline size={90} delay={Math.round(d * 0.36) + 8} style={{ whiteSpace: "pre-line", maxWidth: 1150 }}>
            {b.heading}
          </Headline>
          <div style={{ height: 20 }} />
          <Subhead delay={Math.round(d * 0.36) + 20} size={34} maxWidth={880}>
            {b.sub}
          </Subhead>
          <div style={{ height: 26 }} />
          <DistributorLine delay={Math.round(d * 0.36) + 30} size={20} />
        </div>
      </Frame>
    </AbsoluteFill>
  );
};

const EditorialBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    {b.idx !== undefined ? (
      <>
        <AbsoluteFill style={{ padding: 0 }}>
          <Drift idx={b.idx} duration={d} scaleFrom={1.0} scaleTo={1.045} />
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${hexA(COLORS.paper, 0.95)} 0%, ${hexA(COLORS.paper, 0.86)} 46%, ${hexA(COLORS.paper, 0.66)} 100%)`,
          }}
        />
      </>
    ) : null}
    <Frame style={{ justifyContent: "center", alignItems: "center", paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26, alignItems: "center", textAlign: "center", maxWidth: 1520 }}>
        {b.eyebrow ? <Eyebrow delay={4}>{b.eyebrow}</Eyebrow> : null}
        <Editorial size={b.heading && b.heading.length > 60 ? 74 : 88} delay={10} maxWidth={1480}>
          {b.heading}
        </Editorial>
        {b.body ? (
          <Rise delay={26} y={16}>
            <div style={{ ...subheadStyle(35), color: COLORS.slate, maxWidth: 1240 }}>{b.body}</div>
          </Rise>
        ) : null}
      </div>
    </Frame>
  </AbsoluteFill>
);

const Points: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", gap: 56, flex: 1, minHeight: 0 }}>
        <div style={{ flex: "0 0 940px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 34 }}>
          {b.eyebrow ? <Eyebrow delay={2} accent={COLORS.alert}>{b.eyebrow}</Eyebrow> : null}
          <Headline size={78} delay={8} color={COLORS.ink} style={{ maxWidth: 900 }}>
            {b.heading}
          </Headline>
          <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
            {b.points?.map((p, i) => (
              <PointRow key={p.title} n={i + 1} title={p.title} body={p.body} delay={22 + i * 10} />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center" }}>
          {b.idx !== undefined ? (
            <Gimbal seed={b.idx} amount={0.7}>
              <Plate idx={b.idx} style={{ width: "100%", height: "84%" }} />
            </Gimbal>
          ) : null}
        </div>
      </div>
    </Frame>
  </AbsoluteFill>
);

const MontageBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const hasText = Boolean(b.heading || b.eyebrow);
  const items = b.images.map((idx, i) => ({ idx, label: b.labels?.[i] }));
  return (
    <AbsoluteFill>
      <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 26 }}>
          {hasText ? <TextBlock b={b} headingSize={b.sub ? 62 : 70} /> : null}
          <Fill>
            <Montage items={items} duration={d} cols={b.cols} />
          </Fill>
        </div>
      </Frame>
    </AbsoluteFill>
  );
};

const MacroRevealBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const extra = b.images.filter((i) => i !== b.idx);
  return (
    <AbsoluteFill>
      <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 22 }}>
          <TextBlock b={b} headingSize={72} />
          <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 24 }}>
            <Fill grow={extra.length ? 2.1 : 1}>
              <MacroReveal
                idx={b.idx!}
                duration={d}
                fx={b.focal?.[0] ?? 0.5}
                fy={b.focal?.[1] ?? 0.5}
                macroScale={b.macroScale ?? 2.9}
              />
            </Fill>
            {extra.length ? (
              <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
                {extra.map((i, k) => (
                  <div key={i} style={{ flex: 1, minHeight: 0 }}>
                    <Rise delay={30 + k * 10} y={20} style={{ height: "100%" }}>
                      <Gimbal seed={i} amount={0.5}>
                        <Plate idx={i} style={{ width: "100%", height: "100%" }} />
                      </Gimbal>
                    </Rise>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Frame>
    </AbsoluteFill>
  );
};

const PortSweepBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 24 }}>
        <TextBlock b={b} headingSize={72} />
        <Fill>
          <PortSweep idx={b.idx!} duration={d} zoom={2.4} />
        </Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const HeroBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", gap: 52, flex: 1, minHeight: 0, alignItems: "center" }}>
        <div style={{ flex: "0 0 700px", display: "flex", flexDirection: "column", gap: 20 }}>
          <TextBlock b={b} headingSize={64} />
        </div>
        <div style={{ flex: 1, minWidth: 0, height: "86%" }}>
          <Gimbal seed={b.idx ?? 0} amount={0.8}>
            <Plate idx={b.idx!} style={{ width: "100%", height: "100%" }} />
          </Gimbal>
        </div>
      </div>
    </Frame>
  </AbsoluteFill>
);

/**
 * ECOSYSTEM SPLIT (Section 3) — the three interfaces revealed as peers by a
 * single synchronised light sweep crossing all three at once. The synchrony is
 * the argument: never a value ladder, never an upgrade path.
 */
const Triptych: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const frame = useCurrentFrame();
  const sweep = ramp(frame, 18, 46, EASE.inOut);
  return (
    <AbsoluteFill>
      <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 26 }}>
          <TextBlock b={b} headingSize={70} />
          {/*
            A VERTICALLY aligned stack, not three columns. The supplied
            elevations are ultra-wide (3000x466 and similar); in three side-by-
            side slots `contain` letterboxed them down to ~88px of hardware in a
            600px well. Stacked full-width they read at real scale — and this is
            also literally what Brief Stage 6 asks for: "a clean, vertically
            aligned stack of silhouettes with a sweeping synchronized light
            reveal across all three".
          */}
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 16 }}>
            {b.images.map((idx, i) => (
              <div key={idx} style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", gap: 28 }}>
                <div style={{ flex: 1, minWidth: 0, height: "100%", position: "relative", overflow: "hidden", borderRadius: 16 }}>
                  <Rise delay={10} y={18} style={{ height: "100%" }}>
                    <Gimbal seed={i * 5} amount={0.45}>
                      <Plate idx={idx} style={{ width: "100%", height: "100%" }} />
                    </Gimbal>
                  </Rise>
                  {/* one light sweep — identical timing on all three, which is the argument */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(105deg, ${hexA(COLORS.paperLift, 0)} ${sweep * 150 - 45}%, ${hexA(COLORS.signalBright, 0.26)} ${sweep * 150 - 20}%, ${hexA(COLORS.paperLift, 0)} ${sweep * 150 + 5}%)`,
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <div style={{ flex: "0 0 320px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <Rise delay={40 + i * 4} y={10}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <FrontEndBadge
                        kind={i === 0 ? "matrix" : i === 1 ? "monitor" : "capsule"}
                        size={28}
                        color={COLORS.motuBlue}
                      />
                      <span style={{ ...micro(24, 800, "0.12em"), color: COLORS.ink }}>{b.labels?.[i]}</span>
                    </div>
                  </Rise>
                  <Rise delay={48 + i * 4} y={8}>
                    <div style={{ ...spec(30, 800, "0.01em"), color: COLORS.motuBlue }}>{PRICE.interface}</div>
                  </Rise>
                  <Rise delay={54 + i * 4} y={6}>
                    <div style={{ ...micro(15, 600, "0.08em"), color: COLORS.slateDim }}>{PRICE.note}</div>
                  </Rise>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Frame>
    </AbsoluteFill>
  );
};

const SpecGrid: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", gap: 52, flex: 1, minHeight: 0, alignItems: "center" }}>
        <div style={{ flex: "0 0 820px", display: "flex", flexDirection: "column", gap: 26 }}>
          <TextBlock b={b} headingSize={62} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {b.specs?.map((s, i) => (
              <SpecChip key={s.label} label={s.label} value={s.value} delay={24 + i * 8} size={35} />
            ))}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, height: "82%" }}>
          {b.idx !== undefined ? (
            <Gimbal seed={b.idx} amount={0.7}>
              <Plate idx={b.idx} style={{ width: "100%", height: "100%" }} />
            </Gimbal>
          ) : null}
        </div>
      </div>
    </Frame>
  </AbsoluteFill>
);

const Badges: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b), justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 44, alignItems: "center" }}>
        <Headline size={68} delay={4} style={{ textAlign: "center" }}>{b.heading}</Headline>
        <div style={{ display: "flex", gap: 40, width: "100%", height: 420 }}>
          {b.images.map((idx, i) => (
            <div key={idx} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 18 }}>
              <Rise delay={14 + i * 9} y={22} style={{ flex: 1, minHeight: 0 }}>
                <Gimbal seed={i * 4} amount={0.45}>
                  <Plate idx={idx} style={{ width: "100%", height: "100%" }} />
                </Gimbal>
              </Rise>
              <Rise delay={24 + i * 9} y={10}>
                <div style={{ ...micro(24, 800, "0.12em"), color: COLORS.ink, textAlign: "center" }}>
                  {b.labels?.[i]}
                </div>
              </Rise>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  </AbsoluteFill>
);

const SoftwareBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 24 }}>
        <TextBlock b={b} headingSize={64} />
        <Fill>
          <Gimbal seed={7} amount={0.4}>
            <Plate idx={b.idx!} style={{ width: "100%", height: "100%" }} />
          </Gimbal>
        </Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const EngineBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 18 }}>
        <TextBlock b={b} headingSize={66} />
        <Fill>
          <IdenticalEngine duration={d} value="ESS Sabre32 Ultra" caption="32-bit floating-point DSP · 64-channel CueMix Pro · Thunderbolt 4 / USB4" />
        </Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const TopologyBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 16 }}>
        <TextBlock b={b} headingSize={64} />
        <Fill>
          <TopologyMap duration={d} />
        </Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const DataFlowBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingBottom: SPACE.marginY + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 22 }}>
        <TextBlock b={b} headingSize={70} />
        <Fill>
          <MacroReveal
            idx={b.idx!}
            duration={d}
            fx={b.focal?.[0] ?? 0.6}
            fy={b.focal?.[1] ?? 0.6}
            macroScale={b.macroScale ?? 2.8}
          />
        </Fill>
      </div>
    </Frame>
    <DataFlow
      duration={d}
      delay={Math.round(d * 0.5)}
      label="gPTP · nanosecond-accurate network clock"
      path="M 300 880 C 620 880, 700 560, 1010 560 S 1420 470, 1660 470"
    />
  </AbsoluteFill>
);

const CountersBeat: React.FC<{ b: Beat; d: number }> = ({ b }) => (
  <AbsoluteFill>
    <Frame style={{ justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 44, alignItems: "center" }}>
        <Headline size={76} delay={2}>{b.heading}</Headline>
        <div style={{ display: "flex", gap: 30 }}>
          {b.specs?.map((s, i) => (
            <SpecChip key={s.label} label={s.label} value={s.value} delay={12 + i * 9} size={58}
              accent={i === 3 ? COLORS.motuBlue : COLORS.signal} />
          ))}
        </div>
        <Rise delay={52} y={12}>
          <div style={{ ...subheadStyle(29), color: COLORS.slate, textAlign: "center", maxWidth: 1240 }}>
            Theoretical network scale over standard CAT-5e or CAT-6, in 8-channel stream blocks.
          </div>
        </Rise>
      </div>
    </Frame>
  </AbsoluteFill>
);

const PriceBeat: React.FC<{ b: Beat; d: number }> = ({ b }) => (
  <AbsoluteFill>
    <Frame style={{ justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
        {b.eyebrow ? <Eyebrow delay={2}>{b.eyebrow}</Eyebrow> : null}
        <Headline size={78} delay={8} style={{ maxWidth: 1500 }}>{b.heading}</Headline>
        {b.sub ? <Subhead delay={16} size={31} maxWidth={1420}>{b.sub}</Subhead> : null}
        <div style={{ height: 6 }} />
        <PriceLockup delay={26} />
        <div style={{ height: 4 }} />
        <DistributorLine delay={48} size={24} />
      </div>
    </Frame>
  </AbsoluteFill>
);

const ContactBeat: React.FC<{ b: Beat }> = ({ b }) => (
  <AbsoluteFill>
    <Frame style={{ justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 70, alignItems: "center", flex: 1, minHeight: 0 }}>
        <div style={{ flex: "0 0 760px", display: "flex", flexDirection: "column", gap: 26 }}>
          <Rise delay={2} y={16}>
            <Logo which="shivansh" width={560} />
          </Rise>
          <WebsiteCall delay={16} size={56} />
          <Rise delay={26} y={12}>
            <div style={{ ...micro(21, 600, "0.1em"), color: COLORS.slate, lineHeight: 1.7, maxWidth: 660 }}>
              {BRAND.address}
            </div>
          </Rise>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          <Headline size={62} delay={6}>{b.heading}</Headline>
          {[
            ["WhatsApp", BRAND.whatsapp.join("  ·  ")],
            ["Instagram", BRAND.instagram],
            ["Facebook", BRAND.facebook],
            ["LinkedIn", BRAND.linkedin],
            ["YouTube", BRAND.youtube],
          ].map(([k, v], i) => (
            <Rise key={k} delay={18 + i * 7} y={12}>
              <div style={{ display: "flex", gap: 20, alignItems: "baseline" }}>
                <span style={{ ...micro(19, 700, "0.16em"), color: COLORS.slateDim, width: 148, flexShrink: 0 }}>{k}</span>
                <span style={{ ...spec(27, 600, "0.01em"), color: COLORS.ink }}>{v}</span>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </Frame>
  </AbsoluteFill>
);

const OutroBeat: React.FC<{ b: Beat }> = () => (
  <AbsoluteFill>
    <Frame style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, textAlign: "center" }}>
        <Rise delay={2} y={18}>
          <Logo which="shivansh" width={660} />
        </Rise>
        <Rise delay={14} y={14}>
          <div style={{ ...micro(25, 700, "0.18em"), color: COLORS.motuBlue }}>
            {BRAND.role}
          </div>
        </Rise>
        <Rise delay={20} y={12}>
          <div style={{ ...micro(25, 700, "0.18em"), color: COLORS.slate }}>for {BRAND.region}</div>
        </Rise>
        <div style={{ height: 8 }} />
        <PriceLockup delay={28} compact />
        <div style={{ height: 10 }} />
        <WebsiteCall delay={52} size={80} />
        <Rise delay={64} y={12}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 10 }}>
            <div style={{ width: 150, height: 1, background: COLORS.lineStrong }} />
            <Logo which="motu" width={214} />
          </div>
        </Rise>
      </div>
    </Frame>
  </AbsoluteFill>
);

// ═══════════════════════════════════════════════════════════════ dispatcher

export const BeatScene: React.FC<{ b: Beat }> = ({ b }) => {
  const d = frames(b.sec);

  const bloom =
    b.ch === 1 ? COLORS.alert : b.ch === 6 ? COLORS.signal : COLORS.motuBlue;
  const bg = (
    <AbsoluteFill>
      <Ground bloom={bloom} bloomStrength={b.ch === 1 ? 0.05 : 0.07} grid={
        b.kind === "topology" || b.kind === "engineDiagram" || b.kind === "counters"
      } />
      {b.kind === "topology" || b.kind === "engineDiagram" ? <Motes seed={b.ch} count={20} opacity={0.35} /> : null}
    </AbsoluteFill>
  );

  let body: React.ReactNode = null;
  switch (b.kind) {
    case "coldOpen": body = <ColdOpen b={b} d={d} />; break;
    case "chapterOpen":
      body = <ChapterOpener n={b.eyebrow?.split(" · ")[0] ?? ""} kicker={b.eyebrow?.split(" · ")[1] ?? "MOTU AVB Series"} title={b.heading ?? ""} sub={b.sub} />;
      break;
    case "editorial": body = <EditorialBeat b={b} d={d} />; break;
    case "points": body = <Points b={b} d={d} />; break;
    case "montage": body = <MontageBeat b={b} d={d} />; break;
    case "macroReveal": body = <MacroRevealBeat b={b} d={d} />; break;
    case "portSweep": body = <PortSweepBeat b={b} d={d} />; break;
    case "hero": body = <HeroBeat b={b} d={d} />; break;
    case "triptych": body = <Triptych b={b} d={d} />; break;
    case "specGrid": body = <SpecGrid b={b} d={d} />; break;
    case "engineDiagram": body = <EngineBeat b={b} d={d} />; break;
    case "topology": body = <TopologyBeat b={b} d={d} />; break;
    case "dataFlow": body = <DataFlowBeat b={b} d={d} />; break;
    case "badges": body = <Badges b={b} d={d} />; break;
    case "software": body = <SoftwareBeat b={b} d={d} />; break;
    case "counters": body = <CountersBeat b={b} d={d} />; break;
    case "price": body = <PriceBeat b={b} d={d} />; break;
    case "contact": body = <ContactBeat b={b} />; break;
    case "outro": body = <OutroBeat b={b} />; break;
    case "brandBeat":
      body = (
        <BrandBeat
          withMotu={b.motu}
          contact={[BRAND.whatsapp[0], BRAND.instagram, BRAND.youtube]}
        />
      );
      break;
  }

  return (
    <Scene duration={d} enter={b.kind === "coldOpen" ? "fade" : "riseUp"} bg={bg}>
      {body}
      {b.kind !== "brandBeat" && b.kind !== "outro" && b.kind !== "contact" ? <BrandLayer b={b} /> : null}
    </Scene>
  );
};
