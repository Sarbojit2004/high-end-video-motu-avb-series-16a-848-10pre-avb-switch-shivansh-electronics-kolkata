import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS, PRODUCTS, SHARED_ENGINE, BRAND, PRICING, CHAPTER } from "../theme";
import { Scene } from "../components/Frame";
import { Headline, Sub, Micro, Body, Rule, Chip, Cta, Spec } from "../components/Type";
import { ProductPlate, Montage, ImageRun, TextPlate, ContrastBand, LineCall } from "../components/Media";
import {
  IdenticalEngine, NetworkTopology, CueMixOverlay, SpecReveal, GainArc, IdentityBadge,
} from "../components/Graphics";
import { ramp, CLAMP } from "../lib/anim";
import * as F from "../fonts";

const A = CHAPTER[1]; // chapter accent: amber (tracking / preamp warmth)
const P = PRODUCTS.tenpre;

// ── S01 · HOOK ───────────────────────────────────────────────────────────────
export const S01_Hook: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <Scene ambientImage="motu-10pre-newly-added-3.png" accent={A.key} justify="center">
      <Micro delay={4}>MOTU AVB SERIES · PART 1 OF 3</Micro>
      <div style={{ height: 26 }} />
      <Headline lines={["ONE ENGINE.", "THREE", "FRONT-ENDS."]} size={112} delay={10} />
      <div style={{ height: 30 }} />
      <Rule delay={54} color={A.key} width={260} thickness={4} />
      <div style={{ height: 30 }} />
      <Sub delay={60} maxWidth={800}>
        The 16A, the 848 and the 10pre share one identical engine — and then
        specialise, completely.
      </Sub>
      <div style={{ height: 44 }} />
      <ProductPlate src="motu-10pre-newly-added-3.png" total={total} delay={72} height={340} fit="contain" zoom={0.05} />
    </Scene>
  );
};

// ── S02 · MG-1 THE IDENTICAL ENGINE ──────────────────────────────────────────
export const S02_IdenticalEngine: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-4.png" accent={A.key} justify="center">
    <Micro delay={2}>NOT A FAMILY RESEMBLANCE</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["The same engine,", "three times over."]} size={72} delay={6} />
    <div style={{ height: 46 }} />
    <IdenticalEngine total={total} delay={20} accent={A.keyBright} readout="~1.8 ms RTL" readoutSub="ESS SABRE32 ULTRA · 32-BIT FLOAT DSP" width={860} />
    <div style={{ height: 40 }} />
    <Body delay={112} size={28} maxWidth={840}>
      Identical converters. Identical DSP. Identical 64-channel mixer. Confirmed
      across all three interfaces' own specifications.
    </Body>
  </Scene>
);

// ── S03 · SHARED-ENGINE SPECS (MG-4) ─────────────────────────────────────────
export const S03_EngineSpecs: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-12.png" accent={A.key} justify="center">
    <Micro delay={2}>THE SHARED ARCHITECTURE</Micro>
    <div style={{ height: 22 }} />
    <Headline lines={["Everything that", "matters is common."]} size={68} delay={6} />
    <div style={{ height: 40 }} />
    <SpecReveal
      delay={26}
      accent={A.key}
      valueSize={40}
      rows={[
        { label: "CONVERTERS", value: SHARED_ENGINE.dac, bar: 1 },
        { label: "PROCESSING", value: SHARED_ENGINE.dsp, bar: 0.94 },
        { label: "MIXER", value: "64-ch CueMix Pro", bar: 0.88 },
        { label: "CONNECTIVITY", value: "Thunderbolt 4 / USB4", bar: 0.82 },
        { label: "ROUND-TRIP LATENCY", value: "~1.8 ms @ 96 kHz", bar: 0.76 },
        { label: "NETWORKING", value: "Milan-certified AVB", bar: 0.7 },
      ]}
    />
    <div style={{ height: 34 }} />
    <Montage
      images={["motu-10pre-26.jpg", "motu-10pre-28.jpg", "motu-10pre-13.png"]}
      total={total}
      cols={3}
      height={200}
      delay={112}
    />
  </Scene>
);

// ── S04 · CHAPTER CARD ───────────────────────────────────────────────────────
export const S04_ChapterCard: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <Scene ambientImage="motu-10pre-newly-added.png" accent={A.key} streams={false} justify="center" align="center">
      <div style={{ width: "100%", textAlign: "center" }}>
        <Chip delay={2} fg={A.key} border={A.key}>PART 1 OF 3</Chip>
        <div style={{ height: 34 }} />
        <Headline lines={["THE SOURCE"]} size={124} delay={10} align="center" />
        <div style={{ height: 26 }} />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Rule delay={34} color={A.key} width={320} thickness={5} />
        </div>
        <div style={{ height: 26 }} />
        <Sub delay={40} align="center" maxWidth="100%">MOTU 10pre · the tracking specialist</Sub>
      </div>
    </Scene>
  );
};

// ── S05 · 10PRE REVEAL ───────────────────────────────────────────────────────
export const S05_TenPreReveal: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-newly-added-1.png" accent={A.key} justify="center">
    <Micro delay={2}>{P.full.toUpperCase()}</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Ten preamps.", "One rack space."]} size={82} delay={8} />
    <div style={{ height: 34 }} />
    <ProductPlate src="motu-10pre-newly-added-3.png" total={total} delay={28} height={300} zoom={0.05} fit="contain" />
    <div style={{ height: 16 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-10pre-newly-added-1.png" total={total} delay={44} height={190} width="50%" zoom={0.04} fit="contain" />
      <ProductPlate src="motu-10pre-newly-added-2.png" total={total} delay={52} height={190} width="50%" zoom={0.04} fit="contain" />
    </div>
    <div style={{ height: 26 }} />
    <TextPlate delay={64}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
        {[
          ["I/O", P.io],
          ["CHANNELS", "54"],
          ["DISPLAY", '3.9" TFT'],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ ...F.micro(16, COLORS.graphite, 700, "0.18em") }}>{k}</div>
            <div style={{ ...F.spec(34, COLORS.ink), marginTop: 6 }}>{v}</div>
          </div>
        ))}
      </div>
    </TextPlate>
  </Scene>
);

// ── S06 · THE TEN PREAMPS (MG-4 + gain arc) ──────────────────────────────────
export const S06_Preamps: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-13.jpg" accent={A.key} justify="center">
    <Micro delay={2}>WHERE THE RECORD ACTUALLY STARTS</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Ten combo inputs.", "+74 dB of gain."]} size={70} delay={6} />
    <div style={{ height: 32 }} />
    <ProductPlate src="motu-10pre-13.jpg" total={total} delay={22} height={300} zoom={0.1} />
    <div style={{ height: 28 }} />
    <div style={{ display: "flex", alignItems: "center", gap: 40, width: "100%" }}>
      <GainArc delay={40} accent={A.key} size={250} to={74} label="PREAMP GAIN" />
      <div style={{ flex: 1 }}>
        <SpecReveal
          delay={54}
          accent={A.key}
          valueSize={38}
          labelSize={18}
          rows={[
            { label: "EIN", value: P.ein, bar: 1 },
            { label: "THD+N", value: P.thd, bar: 0.86 },
            { label: "INPUTS", value: "10 × XLR/TRS", bar: 0.72 },
          ]}
        />
      </div>
    </div>
    <div style={{ height: 24 }} />
    <Body delay={104} size={27} maxWidth={860}>
      Quiet enough for a ribbon on a distant room mic; loud enough that nothing
      needs a second stage.
    </Body>
  </Scene>
);

// ── S07 · 8 REAR + 2 FRONT ───────────────────────────────────────────────────
export const S07_EightTwoSplit: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <Scene ambientImage="motu-10pre-1.jpg" accent={A.key} justify="center">
      <Micro delay={2}>EIGHT REAR · TWO FRONT</Micro>
      <div style={{ height: 18 }} />
      <Headline lines={["Built for the", "way rooms work."]} size={72} delay={6} />
      <div style={{ height: 34 }} />
      <ProductPlate src="motu-10pre-8.png" total={total} delay={24} height={230} zoom={0.04} fit="contain" />
      <div style={{ height: 20 }} />
      <div style={{ display: "flex", gap: 18, width: "100%" }}>
        <TextPlate delay={44} width="50%" pad="26px 28px">
          <div style={{ ...F.spec(56, A.key) }}>8</div>
          <div style={{ ...F.micro(17, COLORS.graphite, 700, "0.16em"), marginTop: 8 }}>REAR PANEL</div>
          <div style={{ ...F.body(23, COLORS.inkSoft), marginTop: 10 }}>
            Permanent snake runs. Wired once, left alone.
          </div>
        </TextPlate>
        <TextPlate delay={54} width="50%" pad="26px 28px">
          <div style={{ ...F.spec(56, A.key) }}>2</div>
          <div style={{ ...F.micro(17, COLORS.graphite, 700, "0.16em"), marginTop: 8 }}>FRONT PANEL</div>
          <div style={{ ...F.body(23, COLORS.inkSoft), marginTop: 10 }}>
            Fast overdubs. Reach, plug, roll.
          </div>
        </TextPlate>
      </div>
      <div style={{ height: 20 }} />
      <div style={{ display: "flex", gap: 16, width: "100%" }}>
        <ProductPlate src="motu-10pre-1.jpg" total={total} delay={66} height={210} width="50%" zoom={0.08} />
        <ProductPlate src="motu-10pre-11.jpg" total={total} delay={74} height={210} width="50%" zoom={0.08} />
      </div>
    </Scene>
  );
};

// ── S08 · FRONT PANEL / TFT ──────────────────────────────────────────────────
export const S08_FrontPanel: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-10.png" accent={A.key} justify="center">
    <Micro delay={2}>3.9-INCH TFT · METERING AT A GLANCE</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["You can read the", "room from here."]} size={70} delay={6} />
    <div style={{ height: 34 }} />
    <ProductPlate src="motu-10pre-10.png" total={total} delay={24} height={250} zoom={0.05} fit="contain" />
    <div style={{ height: 18 }} />
    <ProductPlate src="motu-10pre-12.jpg" total={total} delay={42} height={215} zoom={0.05} fit="contain" />
    <div style={{ height: 18 }} />
    <ProductPlate src="motu-10pre-17.jpg" total={total} delay={56} height={215} zoom={0.05} fit="contain" />
    <div style={{ height: 24 }} />
    <Body delay={72} size={27} maxWidth={860}>
      Full input, output and monitor metering on the unit itself — no laptop
      required to see what is happening.
    </Body>
  </Scene>
);

// ── S09 · MG-3 CUEMIX PRO ────────────────────────────────────────────────────
export const S09_CueMix: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-8.jpg" accent={A.key} justify="center" ambientIntensity={0.8}>
    <Micro delay={2}>64-CHANNEL CUEMIX PRO · 64 IN / 32 BUSES</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["A console that", "lives in the box."]} size={68} delay={6} />
    <div style={{ height: 30 }} />
    <CueMixOverlay total={total} delay={20} accent={A.keyBright} channels={14} width={900} height={520} />
    <div style={{ height: 22 }} />
    <Montage
      images={["motu-10pre-6.jpg", "motu-10pre-7.jpg", "motu-10pre-9.jpg", "motu-10pre-3.jpg", "motu-10pre-4.jpg", "motu-10pre-27.jpg"]}
      total={total}
      cols={3}
      height={280}
      delay={70}
      stepIn={5}
    />
  </Scene>
);

// ── S10 · OPTICAL EXPANSION ──────────────────────────────────────────────────
export const S10_OpticalExpansion: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-22.jpg" accent={A.key} justify="center">
    <Micro delay={2}>OPTICAL EXPANSION</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["The tracking room", "scales too."]} size={70} delay={6} />
    <div style={{ height: 32 }} />
    <ProductPlate src="motu-10pre-22.jpg" total={total} delay={22} height={280} zoom={0.08} />
    <div style={{ height: 24 }} />
    <div style={{ display: "flex", gap: 18, width: "100%" }}>
      <TextPlate delay={44} width="50%" pad="28px 30px">
        <div style={{ ...F.spec(60, A.key) }}>+10</div>
        <div style={{ ...F.micro(17, COLORS.graphite, 700, "0.16em"), marginTop: 8 }}>MIC INPUTS</div>
      </TextPlate>
      <TextPlate delay={52} width="50%" pad="28px 30px">
        <div style={{ ...F.spec(60, A.key) }}>+8</div>
        <div style={{ ...F.micro(17, COLORS.graphite, 700, "0.16em"), marginTop: 8 }}>LINE OUTPUTS</div>
      </TextPlate>
    </div>
    <div style={{ height: 22 }} />
    <Body delay={64} size={27} maxWidth={860}>
      Connect to other 8-channel optical gear from a dedicated front-panel
      preset — the session grows without changing the desk.
    </Body>
    <div style={{ height: 20 }} />
    <ProductPlate src="motu-10pre-2.jpg" total={total} delay={78} height={190} zoom={0.04} fit="contain" />
  </Scene>
);

// ── S11 · MONITORING ─────────────────────────────────────────────────────────
export const S11_Monitoring: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-29.jpg" accent={A.key} justify="center">
    <Micro delay={2}>TWO INDEPENDENT HEADPHONE OUTS</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Two players.", "Two cue mixes."]} size={74} delay={6} />
    <div style={{ height: 32 }} />
    <ProductPlate src="motu-10pre-29.jpg" total={total} delay={22} height={300} zoom={0.09} />
    <div style={{ height: 20 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-10pre-18.jpg" total={total} delay={40} height={220} width="50%" zoom={0.07} />
      <ProductPlate src="motu-10pre-15.jpg" total={total} delay={48} height={220} width="50%" zoom={0.07} />
    </div>
    <div style={{ height: 22 }} />
    <Body delay={62} size={27} maxWidth={860}>
      Eight DC-coupled line outs and two genuinely independent headphone buses —
      the drummer and the singer never have to agree.
    </Body>
  </Scene>
);

// ── S12 · MG-2 AVB SEED (LEVEL 1) ────────────────────────────────────────────
export const S12_AvbSeed: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-25.jpg" accent={COLORS.signal} justify="center">
    <Micro delay={2} color={COLORS.signal}>DUAL-GIGABIT MILAN-CERTIFIED AVB · BUILT IN</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["The network is", "already inside."]} size={70} delay={6} />
    <div style={{ height: 26 }} />
    <NetworkTopology
      level={1}
      total={total}
      delay={20}
      accent={COLORS.signal}
      counterTo={54}
      counterLabel="CHANNELS ON THE NETWORK"
      width={900}
      height={430}
    />
    <div style={{ height: 20 }} />
    <Body delay={96} size={27} maxWidth={860}>
      Every interface in this series ships with AVB networking on board. One
      10pre is where the network starts — not an accessory you add later.
    </Body>
    <div style={{ height: 18 }} />
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <ProductPlate src="motu-10pre-25.jpg" total={total} delay={110} height={250} width={470} zoom={0.05} fit="contain" wellColor={COLORS.chassis} />
    </div>
  </Scene>
);

// ── S13 · STUDIO CONTEXT ─────────────────────────────────────────────────────
export const S13_StudioContext: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-16.jpg" accent={A.key} justify="center">
    <Micro delay={2}>IN THE ROOM</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Where it earns", "its rack space."]} size={70} delay={6} />
    <div style={{ height: 30 }} />
    <ImageRun
      images={["motu-10pre-16.jpg", "motu-10pre-14.png", "motu-10pre-1.png", "motu-10pre-14.jpg"]}
      total={total}
      height={430}
    />
    <div style={{ height: 20 }} />
    <Montage
      images={["motu-10pre-24.jpg", "motu-10pre-21.jpg", "motu-10pre-5.jpg", "motu-10pre-10.jpg", "motu-10pre-20.jpg", "motu-10pre-11.png"]}
      total={total}
      cols={3}
      height={260}
      delay={40}
      stepIn={4}
    />
  </Scene>
);

// ── S14 · MG-5 IDENTITY BADGES ───────────────────────────────────────────────
export const S14_IdentityBadges: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-10pre-4.png" accent={A.key} streams justify="center" align="center">
    <Micro delay={2}>THREE SPECIALISATIONS · ONE ENGINE</Micro>
    <div style={{ height: 26 }} />
    <div style={{ display: "flex", gap: 30, justifyContent: "center", width: "100%" }}>
      <IdentityBadge icon="mic" label="10pre" caption="THE SOURCE" delay={8} accent={A.key} size={86} />
      <IdentityBadge icon="matrix" label="16A" caption="THE MATRIX" delay={16} accent={COLORS.graphiteDim} size={86} />
      <IdentityBadge icon="monitor" label="848" caption="COMMAND" delay={24} accent={COLORS.graphiteDim} size={86} />
    </div>
    <div style={{ height: 34 }} />
    <Sub delay={40} align="center" size={40}>
      This chapter was the source. Two to go.
    </Sub>
  </Scene>
);

// ── S15 · LIGHT CTA + NEXT-CHAPTER TEASE ─────────────────────────────────────
export const S15_CtaTease: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <Scene ambientImage="motu-10pre-newly-added.jpg" accent={A.key} justify="center">
      <Micro delay={2}>{P.full.toUpperCase()}</Micro>
      <div style={{ height: 18 }} />
      <ProductPlate src="motu-10pre-newly-added.jpg" total={total} delay={8} height={290} zoom={0.04} fit="contain" />
      <div style={{ height: 30 }} />
      <TextPlate delay={26}>
        <div style={{ ...F.micro(18, COLORS.graphite, 700, "0.18em") }}>MARKET OPERATING PRICE</div>
        <div style={{ ...F.spec(64, COLORS.ink), marginTop: 10 }}>{PRICING.interface.mop}</div>
        <div style={{ ...F.body(24, COLORS.inkSoft), marginTop: 6 }}>{PRICING.interface.note}</div>
        <div style={{ ...F.micro(16, COLORS.graphite, 600, "0.14em"), marginTop: 10 }}>
          {PRICING.interface.applies}
        </div>
      </TextPlate>
      <div style={{ height: 26 }} />
      <Cta delay={44} size={46} color={COLORS.ink}>{BRAND.website}</Cta>
      <div style={{ height: 14 }} />
      <Body delay={56} size={24} color={COLORS.graphite} maxWidth={860}>
        {BRAND.name} — {BRAND.designation}.
      </Body>
      <div style={{ height: 26 }} />
      <Chip delay={68} fg={A.key} border={A.key}>NEXT · PART 2 — THE MATRIX</Chip>
    </Scene>
  );
};
