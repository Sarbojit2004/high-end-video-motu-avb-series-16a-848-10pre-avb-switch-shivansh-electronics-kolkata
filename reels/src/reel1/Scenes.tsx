import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS, SAFE, BRAND, hexA } from "../theme";
import { Ground, Frame, Scene, Fill, Motes } from "../components/Shell";
import { Eyebrow, Headline, Subhead, SpecChip, Rise } from "../components/Type";
import { Plate, MacroReveal, PortSweep, Montage, Gimbal } from "../components/Media";
import {
  ShivanshCorner, MotuCorner, ShivanshLowerThird, BrandBeat,
  PriceLockup, DistributorLine, WebsiteCall, Logo,
} from "../components/Brand";
import { EcosystemSplit, DataFlow } from "../components/Graphics";
import { micro, spec } from "../fonts";
import { EASE, ramp } from "../lib/anim";
import type { Beat } from "./schedule";
import { frames } from "./schedule";

/**
 * Portrait layouts. The usable box is 952 x 1520 starting at y=180 — the
 * caption-safe zone (Section 2) is enforced by <Frame>, so nothing here can
 * land under platform UI. Text stacks above media rather than sitting beside
 * it: portrait gives height, not width.
 *
 * A corner mark shortens the heading's usable width; a lower-third eats into
 * the media slot. Both are accounted for per layout so nothing overlaps —
 * Checkpoint 3 verifies it on rendered stills.
 */
const LOWER_CLEAR = 132;

/**
 * Corner-mark clearances, measured from the rendered stills rather than
 * guessed. The MOTU mark sits top-LEFT, exactly where a heading starts, so
 * content drops below it. The Shivansh mark sits top-RIGHT and is 300px wide
 * plus its URL, so a heading beside it gets 600px, not the 660 first tried —
 * at 660 "ONE IDENTICAL ENGINE" and "THE NETWORK STARTS HERE" both ran under
 * the logo.
 */
const LOWER_CLEAR_PX = LOWER_CLEAR;
const MOTU_CLEAR = 124;   // logo height + gap
const CORNER_HEAD_W = 600;

const headWidth = (b: Beat) => (b.brand === "cornerLogo" ? CORNER_HEAD_W : 952);
const bottomClear = (b: Beat) => (b.brand === "lowerThird" ? LOWER_CLEAR_PX : 0);
const topClear = (b: Beat) => (b.motu ? MOTU_CLEAR : 0);

const TextBlock: React.FC<{ b: Beat; size?: number; delay?: number }> = ({
  b, size = 84, delay = 0,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    {/* The eyebrow needs the same corner clearance as the heading — at full
        width it ran under the top-right mark ("PEERS — NOT A VALUE LADDER"). */}
    {b.eyebrow ? (
      <div style={{ maxWidth: headWidth(b) }}>
        <Eyebrow delay={delay}>{b.eyebrow}</Eyebrow>
      </div>
    ) : null}
    {b.heading ? (
      <Headline size={size} delay={delay + 4}
                style={{ maxWidth: headWidth(b), whiteSpace: "pre-line" }}>
        {b.heading}
      </Headline>
    ) : null}
    {b.sub ? (
      <Subhead delay={delay + 10} size={34} maxWidth={headWidth(b)}>{b.sub}</Subhead>
    ) : null}
  </div>
);

const BrandLayer: React.FC<{ b: Beat }> = ({ b }) => (
  <>
    {b.motu ? <MotuCorner /> : null}
    {b.brand === "cornerLogo" ? <ShivanshCorner /> : null}
    {b.brand === "lowerThird" ? <ShivanshLowerThird mode="website" /> : null}
  </>
);

// ═══════════════════════════════════════════════════════════════ layouts

/** Opening hook — biggest type in the reel, first cut at 5 s. */
const Hook: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, 6, 18, EASE.out);
  return (
    <AbsoluteFill>
      <AbsoluteFill>
        <MacroReveal idx={b.idx!} duration={d} fx={b.focal![0]} fy={b.focal![1]}
                     macroScale={b.macroScale ?? 3.4} />
      </AbsoluteFill>
      <AbsoluteFill style={{
        background: `linear-gradient(180deg, ${hexA(COLORS.paper, 0.96)} 0%, ${hexA(COLORS.paper, 0.82)} 34%, ${hexA(COLORS.paper, 0)} 62%)`,
        opacity: t,
      }} />
      <Frame>
        <div style={{ opacity: t }}>
          <Eyebrow delay={8}>{b.eyebrow}</Eyebrow>
          <div style={{ height: 20 }} />
          <Headline size={104} delay={12} style={{ whiteSpace: "pre-line", maxWidth: 700 }}>
            {b.heading}
          </Headline>
        </div>
      </Frame>
    </AbsoluteFill>
  );
};

const MacroRevealBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const extra = b.images.filter((i) => i !== b.idx);
  return (
    <AbsoluteFill>
      <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b) }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 22 }}>
          <TextBlock b={b} size={78} />
          <Fill>
            <MacroReveal idx={b.idx!} duration={d} fx={b.focal?.[0] ?? 0.5}
                         fy={b.focal?.[1] ?? 0.5} macroScale={b.macroScale ?? 2.9} />
          </Fill>
          {extra.length ? (
            <div style={{ height: 300, display: "flex", gap: 16 }}>
              {extra.map((i, k) => (
                <div key={i} style={{ flex: 1, minWidth: 0 }}>
                  <Rise delay={26 + k * 6} y={16} style={{ height: "100%" }}>
                    <Gimbal seed={i} amount={0.5}>
                      <Plate idx={i} style={{ width: "100%", height: "100%" }} />
                    </Gimbal>
                  </Rise>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Frame>
    </AbsoluteFill>
  );
};

const PortSweepBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 24 }}>
        <TextBlock b={b} size={76} />
        <Fill><PortSweep idx={b.idx!} duration={d} zoom={2.6} /></Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const EcosystemBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 20 }}>
        <TextBlock b={b} size={82} />
        <Fill><EcosystemSplit duration={d} labels={b.labels ?? []} /></Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const BadgesBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => (
  <AbsoluteFill>
    <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b), justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
        <Headline size={80} delay={2} style={{ textAlign: "center", maxWidth: 900 }}>{b.heading}</Headline>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, width: "100%" }}>
          {b.images.map((idx, i) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <Rise delay={10 + i * 8} y={18}>
                <div style={{ width: 860, height: 300 }}>
                  <Gimbal seed={i * 4} amount={0.45}>
                    <Plate idx={idx} style={{ width: "100%", height: "100%" }} />
                  </Gimbal>
                </div>
              </Rise>
              <Rise delay={16 + i * 8} y={8}>
                <div style={{ ...micro(28, 800, "0.1em"), color: COLORS.ink, textAlign: "center" }}>
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

const SpecGridBeat: React.FC<{ b: Beat; d: number }> = ({ b }) => (
  <AbsoluteFill>
    <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 22 }}>
        <TextBlock b={b} size={80} />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {b.specs?.map((s, i) => (
            <SpecChip key={s.label} label={s.label} value={s.value} delay={14 + i * 7} size={58} />
          ))}
        </div>
        <Fill>
          {b.idx !== undefined ? (
            <Gimbal seed={b.idx} amount={0.7}>
              <Plate idx={b.idx} style={{ width: "100%", height: "100%" }} />
            </Gimbal>
          ) : null}
        </Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const SoftwareBeat: React.FC<{ b: Beat }> = ({ b }) => (
  <AbsoluteFill>
    <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b) }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 24 }}>
        <TextBlock b={b} size={74} />
        <Fill>
          <Gimbal seed={7} amount={0.4}>
            <Plate idx={b.idx!} style={{ width: "100%", height: "100%" }} />
          </Gimbal>
        </Fill>
      </div>
    </Frame>
  </AbsoluteFill>
);

const MontageBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const items = b.images.map((idx, i) => ({ idx, label: b.labels?.[i] }));
  const hasText = Boolean(b.heading || b.eyebrow);
  return (
    <AbsoluteFill>
      <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b) }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 22 }}>
          {hasText ? <TextBlock b={b} size={b.sub ? 66 : 76} /> : null}
          <Fill><Montage items={items} duration={d} cols={b.cols} gap={16} /></Fill>
        </div>
      </Frame>
    </AbsoluteFill>
  );
};

const DataFlowBeat: React.FC<{ b: Beat; d: number }> = ({ b, d }) => {
  const extra = b.images.filter((i) => i !== b.idx);
  return (
    <AbsoluteFill>
      <Frame style={{ paddingTop: SAFE.top + topClear(b), paddingBottom: SAFE.bottom + bottomClear(b) }}>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, gap: 22 }}>
          <TextBlock b={b} size={76} />
          <Fill>
            <MacroReveal idx={b.idx!} duration={d} fx={b.focal?.[0] ?? 0.5}
                         fy={b.focal?.[1] ?? 0.5} macroScale={b.macroScale ?? 2.8} />
          </Fill>
          {extra.length ? (
            <div style={{ height: 320 }}>
              <Rise delay={30} y={16} style={{ height: "100%" }}>
                <Plate idx={extra[0]} style={{ width: "100%", height: "100%" }} />
              </Rise>
            </div>
          ) : null}
        </div>
      </Frame>
      <DataFlow duration={d} delay={Math.round(d * 0.42)}
                label="Milan-certified IEEE 802.1 AVB" />
    </AbsoluteFill>
  );
};

const PriceBeat: React.FC<{ b: Beat }> = ({ b }) => (
  <AbsoluteFill>
    <Frame style={{ justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <Eyebrow delay={2}>{b.eyebrow}</Eyebrow>
        <Headline size={88} delay={6} style={{ whiteSpace: "pre-line" }}>{b.heading}</Headline>
        <div style={{ height: 4 }} />
        <PriceLockup delay={16} />
        <div style={{ height: 4 }} />
        <DistributorLine delay={40} size={23} />
      </div>
    </Frame>
  </AbsoluteFill>
);

const CtaBeat: React.FC<{ b: Beat }> = ({ b }) => (
  <AbsoluteFill>
    <Frame style={{ justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <Rise delay={2} y={14}><Logo which="shivansh" width={640} /></Rise>
        <Headline size={78} delay={8}>{b.heading}</Headline>
        <WebsiteCall delay={14} size={52} />
        {[
          ["WhatsApp", BRAND.whatsapp[0]],
          ["Instagram", BRAND.instagram],
          ["YouTube", BRAND.youtube],
        ].map(([k, v], i) => (
          <Rise key={k} delay={22 + i * 6} y={10}>
            <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
              <span style={{ ...micro(20, 700, "0.14em"), color: COLORS.slateDim, width: 150, flexShrink: 0 }}>{k}</span>
              <span style={{ ...spec(27, 600, "0.01em"), color: COLORS.ink }}>{v}</span>
            </div>
          </Rise>
        ))}
      </div>
    </Frame>
  </AbsoluteFill>
);

const OutroBeat: React.FC = () => (
  <AbsoluteFill>
    <Frame style={{ justifyContent: "center", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center" }}>
        <Rise delay={2} y={16}><Logo which="shivansh" width={760} /></Rise>
        <Rise delay={10} y={10}>
          <div style={{ ...micro(24, 700, "0.14em"), color: COLORS.motuBlue, maxWidth: 900, lineHeight: 1.5 }}>
            {BRAND.role}
          </div>
        </Rise>
        <Rise delay={14} y={10}>
          <div style={{ ...micro(24, 700, "0.14em"), color: COLORS.slate }}>for {BRAND.region}</div>
        </Rise>
        <div style={{ height: 6 }} />
        <WebsiteCall delay={22} size={62} />
        <Rise delay={32} y={10}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, marginTop: 8 }}>
            <div style={{ width: 140, height: 1, background: COLORS.lineStrong }} />
            <Logo which="motu" width={240} />
          </div>
        </Rise>
      </div>
    </Frame>
  </AbsoluteFill>
);

// ═════════════════════════════════════════════════════════════ dispatcher

export const BeatScene: React.FC<{ b: Beat }> = ({ b }) => {
  const d = frames(b.sec);
  const bigLogo = b.kind === "brandBeat" || b.kind === "outro" || b.kind === "cta" || b.kind === "price";
  const bg = (
    <AbsoluteFill>
      <Ground bloom={COLORS.motuBlue} bloomStrength={bigLogo ? 0.03 : 0.07}
              flat={bigLogo} grid={b.kind === "ecosystemSplit"} />
      {b.kind === "ecosystemSplit" || b.kind === "dataFlow" ? <Motes seed={4} count={16} opacity={0.3} /> : null}
    </AbsoluteFill>
  );

  let body: React.ReactNode = null;
  switch (b.kind) {
    case "hook": body = <Hook b={b} d={d} />; break;
    case "macroReveal": body = <MacroRevealBeat b={b} d={d} />; break;
    case "portSweep": body = <PortSweepBeat b={b} d={d} />; break;
    case "ecosystemSplit": body = <EcosystemBeat b={b} d={d} />; break;
    case "badges": body = <BadgesBeat b={b} d={d} />; break;
    case "specGrid": body = <SpecGridBeat b={b} d={d} />; break;
    case "software": body = <SoftwareBeat b={b} />; break;
    case "hero":
    case "montage": body = <MontageBeat b={b} d={d} />; break;
    case "dataFlow": body = <DataFlowBeat b={b} d={d} />; break;
    case "price": body = <PriceBeat b={b} />; break;
    case "cta": body = <CtaBeat b={b} />; break;
    case "outro": body = <OutroBeat />; break;
    case "brandBeat":
      body = <BrandBeat contact={[BRAND.whatsapp[0], BRAND.instagram]} />;
      break;
  }

  const enter = b.kind === "hook" ? "scaleIn"
    : b.kind === "montage" ? "pushLeft"
    : b.kind === "specGrid" ? "pushUp" : "rise";

  return (
    <Scene duration={d} enter={enter} bg={bg}>
      {body}
      {bigLogo ? null : <BrandLayer b={b} />}
    </Scene>
  );
};
