import React from "react";
import { COLORS, PRODUCTS, BRAND, PRICING, CHAPTER } from "../theme";
import { Scene } from "../components/Frame";
import { Headline, Sub, Micro, Body, Rule, Chip, Cta } from "../components/Type";
import { ProductPlate, Montage, ImageRun, TextPlate } from "../components/Media";
import {
  IdenticalEngine, NetworkTopology, CueMixOverlay, SpecReveal, IdentityBadge,
} from "../components/Graphics";
import * as F from "../fonts";

const A = CHAPTER[2]; // chapter accent: signal blue (routing / data paths)
const P = PRODUCTS.sixteena;

// ── S01 · RECAP + HOOK ───────────────────────────────────────────────────────
export const S01_RecapHook: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-newly-added-3.png" accent={A.key} justify="center">
    <Micro delay={2}>PREVIOUSLY · PART 1 — THE SOURCE</Micro>
    <div style={{ height: 20 }} />
    <Body delay={8} size={30} color={COLORS.graphite} maxWidth={840}>
      Part one captured the performance — ten preamps, on the same engine every
      interface in this series runs.
    </Body>
    <div style={{ height: 28 }} />
    <Headline lines={["Now: where", "all of it goes."]} size={94} delay={22} />
    <div style={{ height: 28 }} />
    <Rule delay={62} color={A.key} width={280} thickness={4} />
    <div style={{ height: 30 }} />
    <Sub delay={68} maxWidth={820}>
      The MOTU 16A does not record a single microphone. That is exactly the point.
    </Sub>
    <div style={{ height: 40 }} />
    <ProductPlate src="motu-16a-newly-added-3.png" total={total} delay={82} height={310} fit="contain" zoom={0.05} />
  </Scene>
);

// ── S02 · CHAPTER CARD ───────────────────────────────────────────────────────
export const S02_ChapterCard: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-newly-added.jpg" accent={A.key} streams={false} justify="center" align="center">
    <div style={{ width: "100%", textAlign: "center" }}>
      <Chip delay={2} fg={A.key} border={A.key}>PART 2 OF 3</Chip>
      <div style={{ height: 34 }} />
      <Headline lines={["THE MATRIX"]} size={118} delay={10} align="center" />
      <div style={{ height: 26 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Rule delay={34} color={A.key} width={320} thickness={5} />
      </div>
      <div style={{ height: 26 }} />
      <Sub delay={40} align="center" maxWidth="100%">MOTU 16A · the routing specialist</Sub>
    </div>
  </Scene>
);

// ── S03 · 16A REVEAL ─────────────────────────────────────────────────────────
export const S03_SixteenAReveal: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-newly-added-1.png" accent={A.key} justify="center">
    <Micro delay={2}>{P.full.toUpperCase()}</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Thirty-two in.", "Thirty-four out."]} size={74} delay={6} />
    <div style={{ height: 30 }} />
    <ProductPlate src="motu-16a-newly-added.jpg" total={total} delay={24} height={300} fit="contain" zoom={0.05} />
    <div style={{ height: 16 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-16a-newly-added-4.png" total={total} delay={40} height={185} width="50%" fit="contain" zoom={0.04} />
      <ProductPlate src="motu-16a-newly-added-2.png" total={total} delay={48} height={185} width="50%" fit="contain" zoom={0.04} />
    </div>
    <div style={{ height: 24 }} />
    <TextPlate delay={60}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}>
        {[
          ["I/O", P.io],
          ["CHANNELS", "66"],
          ["DISPLAYS", "2 × 3.9\""],
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

// ── S04 · ZERO PREAMPS (the specialisation claim) ────────────────────────────
export const S04_ZeroPreamps: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-13.png" accent={A.key} justify="center">
    <Micro delay={2}>A DELIBERATE OMISSION</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Zero microphone", "preamps."]} size={78} delay={6} />
    <div style={{ height: 30 }} />
    <Body delay={34} size={29} maxWidth={860}>
      Not a compromise — a specialisation. Every one of those thirty-two inputs is
      line level, so the whole box is given over to moving signal cleanly.
    </Body>
    <div style={{ height: 30 }} />
    <ProductPlate src="motu-16a-13.png" total={total} delay={48} height={270} fit="contain" zoom={0.05} />
    <div style={{ height: 24 }} />
    <SpecReveal
      delay={64}
      accent={A.key}
      valueSize={40}
      rows={[
        { label: "MIC PREAMPS", value: "0", bar: 0.08 },
        { label: "BALANCED TRS INPUTS", value: "16", bar: 1 },
        { label: "BALANCED TRS OUTPUTS", value: "16", bar: 1 },
      ]}
    />
  </Scene>
);

// ── S05 · SIXTEEN IN ─────────────────────────────────────────────────────────
export const S05_SixteenIn: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-25.jpg" accent={A.key} justify="center">
    <Micro delay={2}>16 × BALANCED 1/4" TRS IN</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Everything you", "own, plugged in."]} size={70} delay={6} />
    <div style={{ height: 30 }} />
    <ProductPlate src="motu-16a-25.jpg" total={total} delay={24} height={340} zoom={0.09} />
    <div style={{ height: 22 }} />
    <Body delay={44} size={28} maxWidth={860}>
      Synths, outboard preamps, hardware compressors, summing — sixteen balanced
      line inputs, permanently wired, always available.
    </Body>
    <div style={{ height: 22 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-16a-newly-added-1.png" total={total} delay={60} height={210} width="50%" fit="contain" zoom={0.04} />
      <ProductPlate src="motu-16a-2.jpg" total={total} delay={68} height={210} width="50%" zoom={0.06} />
    </div>
  </Scene>
);

// ── S06 · SIXTEEN OUT ────────────────────────────────────────────────────────
export const S06_SixteenOut: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-24.jpg" accent={A.key} justify="center">
    <Micro delay={2}>16 × DC-COUPLED TRS OUT</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["And sixteen ways", "back out."]} size={70} delay={6} />
    <div style={{ height: 30 }} />
    <ProductPlate src="motu-16a-24.jpg" total={total} delay={24} height={300} zoom={0.08} />
    <div style={{ height: 24 }} />
    <TextPlate delay={44}>
      <div style={{ ...F.micro(18, COLORS.graphite, 700, "0.18em") }}>DC-COUPLED</div>
      <div style={{ ...F.body(27, COLORS.inkSoft), marginTop: 10 }}>
        Every output can carry control voltage as well as audio — so modular and
        analogue gear is driven directly from the session, not patched around it.
      </div>
    </TextPlate>
    <div style={{ height: 20 }} />
    <ProductPlate src="motu-16a-14.jpg" total={total} delay={60} height={215} zoom={0.06} />
  </Scene>
);

// ── S07 · DUAL DISPLAYS ──────────────────────────────────────────────────────
export const S07_DualDisplays: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-newly-added-3.png" accent={A.key} justify="center">
    <Micro delay={2}>DUAL 3.9-INCH TFT DISPLAYS</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Thirty-two meters.", "One glance."]} size={66} delay={6} />
    <div style={{ height: 28 }} />
    <ProductPlate src="motu-16a-newly-added-3.png" total={total} delay={22} height={280} fit="contain" zoom={0.05} />
    <div style={{ height: 18 }} />
    <ProductPlate src="motu-16a-10.png" total={total} delay={38} height={200} fit="contain" zoom={0.04} />
    <div style={{ height: 22 }} />
    <Body delay={52} size={28} maxWidth={860}>
      Two displays instead of one, because a routing box has twice as much to
      show you. Inputs on the left, outputs on the right, live.
    </Body>
    <div style={{ height: 18 }} />
    <Montage
      images={["motu-16a-2.png", "motu-16a-9.png", "motu-16a-12.png"]}
      total={total}
      cols={3}
      height={150}
      delay={66}
      radius={14}
    />
  </Scene>
);

// ── S08 · MG-3 THE PATCHBAY / MATRIX ─────────────────────────────────────────
export const S08_PatchMatrix: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-16.jpg" accent={A.key} justify="center" ambientIntensity={0.8}>
    <Micro delay={2}>CUEMIX PRO PATCHBAY · 64 IN / 32 BUSES</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Any source, to", "any destination."]} size={64} delay={6} />
    <div style={{ height: 28 }} />
    <CueMixOverlay total={total} delay={20} accent={A.keyBright} channels={16} width={900} height={500} mode="patch" />
    <div style={{ height: 20 }} />
    <Montage
      images={["motu-16a-16.jpg", "motu-16a-17.jpg", "motu-16a-11.jpg", "motu-16a-15.jpg", "motu-16a-7.jpg", "motu-16a-21.jpg", "motu-16a-10.jpg", "motu-16a-13.jpg", "motu-16a-1.png"]}
      total={total}
      cols={3}
      height={300}
      delay={66}
      stepIn={4}
    />
  </Scene>
);

// ── S09 · ADAT / OPTICAL ─────────────────────────────────────────────────────
export const S09_AdatOptical: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-28.jpg" accent={A.key} justify="center">
    <Micro delay={2}>2 BANKS ADAT / S-MUX OPTICAL I/O</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Sixteen more,", "over light."]} size={72} delay={6} />
    <div style={{ height: 30 }} />
    <ProductPlate src="motu-16a-28.jpg" total={total} delay={24} height={290} zoom={0.07} />
    <div style={{ height: 22 }} />
    <div style={{ display: "flex", gap: 18, width: "100%" }}>
      <TextPlate delay={44} width="50%" pad="26px 28px">
        <div style={{ ...F.spec(52, A.key) }}>2</div>
        <div style={{ ...F.micro(16, COLORS.graphite, 700, "0.16em"), marginTop: 8 }}>OPTICAL BANKS</div>
      </TextPlate>
      <TextPlate delay={52} width="50%" pad="26px 28px">
        <div style={{ ...F.spec(52, A.key) }}>S-MUX</div>
        <div style={{ ...F.micro(16, COLORS.graphite, 700, "0.16em"), marginTop: 8 }}>HIGH-RATE OPTICAL</div>
      </TextPlate>
    </div>
    <div style={{ height: 20 }} />
    <ProductPlate src="motu-16a-8.png" total={total} delay={64} height={215} fit="contain" zoom={0.04} />
  </Scene>
);

// ── S10 · MG-1 SHARED-ENGINE CALLBACK ────────────────────────────────────────
export const S10_EngineCallback: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-6.png" accent={A.key} justify="center">
    <Micro delay={2}>THE SAME ENGINE AS PART 1</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Different box.", "Same silicon."]} size={70} delay={6} />
    <div style={{ height: 36 }} />
    <IdenticalEngine total={total} delay={18} accent={A.keyBright} readout="~1.8 ms RTL" readoutSub="ESS SABRE32 ULTRA · 32-BIT FLOAT DSP" width={860} />
    <div style={{ height: 30 }} />
    <Montage
      images={["motu-16a-8.jpg", "motu-16a-22.jpg", "motu-16a-6.png"]}
      total={total}
      cols={3}
      height={190}
      delay={106}
    />
  </Scene>
);

// ── S11 · DAW INTEGRATION ────────────────────────────────────────────────────
export const S11_DawIntegration: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-18.jpg" accent={A.key} justify="center">
    <Micro delay={2}>THUNDERBOLT 4 / USB4 · 40 Gbps</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["One cable to", "the session."]} size={70} delay={6} />
    <div style={{ height: 28 }} />
    <ImageRun
      images={["motu-16a-18.jpg", "motu-16a-20.jpg", "motu-16a-3.png", "motu-16a-26.jpg"]}
      total={total}
      height={400}
    />
    <div style={{ height: 20 }} />
    <Montage
      images={["motu-16a-27.jpg", "motu-16a-19.jpg", "motu-16a-23.jpg", "motu-16a-12.jpg", "motu-16a-1.jpg", "motu-16a-9.jpg"]}
      total={total}
      cols={3}
      height={280}
      delay={44}
      stepIn={4}
    />
  </Scene>
);

// ── S12 · MG-2 AVB DAISY-CHAIN (LEVEL 2) ─────────────────────────────────────
export const S12_AvbChain: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-5.jpg" accent={A.key} justify="center">
    <Micro delay={2} color={A.key}>DUAL-GIGABIT MILAN-CERTIFIED AVB</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Two boxes.", "One system."]} size={72} delay={6} />
    <div style={{ height: 24 }} />
    <NetworkTopology
      level={2}
      total={total}
      delay={18}
      accent={A.key}
      counterTo={120}
      counterLabel="CHANNELS ON THE NETWORK"
      width={900}
      height={440}
    />
    <div style={{ height: 18 }} />
    <Body delay={94} size={27} maxWidth={860}>
      Daisy-chain a 10pre to a 16A and the two stop being separate interfaces.
      One network, one clock, one routing grid.
    </Body>
    <div style={{ height: 16 }} />
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <ProductPlate src="motu-16a-5.jpg" total={total} delay={108} height={230} width={440} fit="contain" zoom={0.04} />
      <div style={{ width: 14 }} />
      <ProductPlate src="motu-16a-5.png" total={total} delay={116} height={230} width={440} fit="contain" zoom={0.04} />
    </div>
  </Scene>
);

// ── S13 · MULTI-DEVICE DISCOVERY ─────────────────────────────────────────────
export const S13_MultiDevice: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-6.jpg" accent={A.key} justify="center">
    <Micro delay={2}>ONE CONTROL SURFACE, EVERY DEVICE</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["It scales past", "one interface."]} size={66} delay={6} />
    <div style={{ height: 28 }} />
    <ProductPlate src="motu-16a-6.jpg" total={total} delay={22} height={360} zoom={0.05} />
    <div style={{ height: 20 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-16a-4.jpg" total={total} delay={40} height={210} width="50%" zoom={0.06} />
      <ProductPlate src="motu-16a-7.png" total={total} delay={48} height={210} width="50%" zoom={0.06} />
    </div>
  </Scene>
);

// ── S14 · MG-5 IDENTITY BADGES ───────────────────────────────────────────────
export const S14_IdentityBadges: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-4.png" accent={A.key} justify="center" align="center">
    <Micro delay={2}>TWO DOWN · ONE TO GO</Micro>
    <div style={{ height: 26 }} />
    <div style={{ display: "flex", gap: 30, justifyContent: "center", width: "100%" }}>
      <IdentityBadge icon="mic" label="10pre" caption="THE SOURCE" delay={8} accent={COLORS.graphiteDim} size={86} />
      <IdentityBadge icon="matrix" label="16A" caption="THE MATRIX" delay={16} accent={A.key} size={86} />
      <IdentityBadge icon="monitor" label="848" caption="COMMAND" delay={24} accent={COLORS.graphiteDim} size={86} />
    </div>
    <div style={{ height: 34 }} />
    <Sub delay={40} align="center" size={40}>
      The source, then the matrix. One front-end left.
    </Sub>
  </Scene>
);

// ── S15 · LIGHT CTA + TEASE ──────────────────────────────────────────────────
export const S15_CtaTease: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-16a-11.png" accent={A.key} justify="center">
    <Micro delay={2}>{P.full.toUpperCase()}</Micro>
    <div style={{ height: 18 }} />
    <ProductPlate src="motu-16a-11.png" total={total} delay={8} height={280} fit="contain" zoom={0.04} />
    <div style={{ height: 28 }} />
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
    <div style={{ height: 24 }} />
    <Chip delay={68} fg={A.key} border={A.key}>NEXT · PART 3 — THE COMMAND CENTER</Chip>
  </Scene>
);
