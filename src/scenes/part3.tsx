import React from "react";
import { COLORS, PRODUCTS, BRAND, PRICING, CHAPTER } from "../theme";
import { Scene } from "../components/Frame";
import { Headline, Sub, Micro, Body, Rule, Chip, Cta } from "../components/Type";
import { ProductPlate, Montage, ImageRun, TextPlate } from "../components/Media";
import {
  IdenticalEngine, NetworkTopology, CueMixOverlay, SpecReveal, GainArc, IdentityBadge,
} from "../components/Graphics";
import * as F from "../fonts";

const A = CHAPTER[3]; // signal blue — the network resolves the series
const P = PRODUCTS.eight48;
const SW = PRODUCTS.avbswitch;

// ── S01 · RECAP + HOOK ───────────────────────────────────────────────────────
export const S01_RecapHook: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-newly-added-4.png" accent={A.key} justify="center">
    <Micro delay={2}>PREVIOUSLY · THE SOURCE, THEN THE MATRIX</Micro>
    <div style={{ height: 20 }} />
    <Body delay={8} size={30} color={COLORS.graphite} maxWidth={840}>
      The 10pre captured it. The 16A routed it. One question is left — who is
      listening, and how do you scale the whole thing?
    </Body>
    <div style={{ height: 28 }} />
    <Headline lines={["The room", "that decides."]} size={94} delay={22} />
    <div style={{ height: 28 }} />
    <Rule delay={62} color={A.key} width={280} thickness={4} />
    <div style={{ height: 30 }} />
    <Sub delay={68} maxWidth={820}>
      The MOTU 848 — and the network that ties all of it together.
    </Sub>
    <div style={{ height: 36 }} />
    <ProductPlate src="motu-848-newly-added-4.png" total={total} delay={82} height={300} fit="contain" zoom={0.05} />
  </Scene>
);

// ── S02 · CHAPTER CARD ───────────────────────────────────────────────────────
export const S02_ChapterCard: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-newly-added-1.jpg" accent={A.key} streams={false} justify="center" align="center">
    <div style={{ width: "100%", textAlign: "center" }}>
      <Chip delay={2} fg={A.key} border={A.key}>PART 3 OF 3</Chip>
      <div style={{ height: 30 }} />
      <Headline lines={["THE COMMAND", "CENTER"]} size={92} delay={10} align="center" />
      <div style={{ height: 24 }} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Rule delay={34} color={A.key} width={320} thickness={5} />
      </div>
      <div style={{ height: 24 }} />
      <Sub delay={40} align="center" maxWidth="100%">MOTU 848 · and the AVB Switch</Sub>
    </div>
  </Scene>
);

// ── S03 · 848 REVEAL ─────────────────────────────────────────────────────────
export const S03_EightFortyEightReveal: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-newly-added-3.png" accent={A.key} justify="center">
    <Micro delay={2}>{P.full.toUpperCase()}</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Twenty-eight in.", "Thirty-two out."]} size={70} delay={6} />
    <div style={{ height: 28 }} />
    <ProductPlate src="motu-848-newly-added-1.jpg" total={total} delay={24} height={290} fit="contain" zoom={0.05} />
    <div style={{ height: 16 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-848-newly-added-3.png" total={total} delay={40} height={180} width="50%" fit="contain" zoom={0.04} />
      <ProductPlate src="motu-848-newly-added-2.png" total={total} delay={48} height={180} width="50%" fit="contain" zoom={0.04} />
    </div>
    <div style={{ height: 22 }} />
    <TextPlate delay={60}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}>
        {[
          ["I/O", P.io],
          ["CHANNELS", "60"],
          ["MIC INPUTS", "4"],
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

// ── S04 · FOUR PREAMPS ───────────────────────────────────────────────────────
export const S04_FourPreamps: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-23.jpg" accent={A.key} justify="center">
    <Micro delay={2}>4 × XLR/TRS COMBO MIC INPUTS</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Enough front end", "for a control room."]} size={62} delay={6} />
    <div style={{ height: 28 }} />
    <ProductPlate src="motu-848-23.jpg" total={total} delay={22} height={280} zoom={0.09} />
    <div style={{ height: 24 }} />
    <div style={{ display: "flex", alignItems: "center", gap: 36, width: "100%" }}>
      <GainArc delay={38} accent={A.key} size={230} to={74} label="PREAMP GAIN" />
      <div style={{ flex: 1 }}>
        <SpecReveal
          delay={52}
          accent={A.key}
          valueSize={36}
          labelSize={17}
          rows={[
            { label: "EIN", value: P.ein, bar: 1 },
            { label: "THD+N", value: P.thd, bar: 0.86 },
            { label: "LINE IN", value: "8 TRS + 2 insert", bar: 0.72 },
          ]}
        />
      </div>
    </div>
    <div style={{ height: 20 }} />
    <ProductPlate src="motu-848-20.jpg" total={total} delay={92} height={200} zoom={0.06} />
  </Scene>
);

// ── S05 · TALKBACK + A/B/C SPEAKER SELECT ────────────────────────────────────
export const S05_ControlRoom: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-19.jpg" accent={A.key} justify="center">
    <Micro delay={2}>TALKBACK · A/B/C SPEAKER SELECT</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Run the room", "from the front."]} size={70} delay={6} />
    <div style={{ height: 30 }} />
    <ProductPlate src="motu-848-19.jpg" total={total} delay={22} height={330} zoom={0.08} />
    <div style={{ height: 24 }} />
    <Body delay={44} size={28} maxWidth={860}>
      Talk to the live room, and switch between three sets of monitors, without
      reaching for a mouse or a separate controller.
    </Body>
    <div style={{ height: 20 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-848-25.jpg" total={total} delay={60} height={200} width="50%" zoom={0.06} />
      <ProductPlate src="motu-848-22.jpg" total={total} delay={68} height={200} width="50%" zoom={0.06} />
    </div>
  </Scene>
);

// ── S06 · ATMOS-CAPABLE MONITORING ───────────────────────────────────────────
export const S06_AtmosMonitoring: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-16.jpg" accent={A.key} justify="center">
    <Micro delay={2}>12 × DC-COUPLED TRS LINE OUT</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Up to 7.1.4,", "straight out."]} size={72} delay={6} />
    <div style={{ height: 28 }} />
    <ProductPlate src="motu-848-16.jpg" total={total} delay={22} height={300} zoom={0.08} />
    <div style={{ height: 24 }} />
    <TextPlate delay={44}>
      <div style={{ ...F.micro(18, COLORS.graphite, 700, "0.18em") }}>DOLBY ATMOS MONITORING</div>
      <div style={{ ...F.spec(56, COLORS.ink), marginTop: 10 }}>7.1.4</div>
      <div style={{ ...F.body(25, COLORS.inkSoft), marginTop: 8 }}>
        Twelve line outputs is exactly a 7.1.4 bed — so immersive monitoring comes
        out of the interface you already own.
      </div>
    </TextPlate>
    <div style={{ height: 20 }} />
    <ProductPlate src="motu-848-1.jpg" total={total} delay={62} height={210} zoom={0.07} />
  </Scene>
);

// ── S07 · HEADPHONES + INSERTS ───────────────────────────────────────────────
export const S07_HeadphonesInserts: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-15.jpg" accent={A.key} justify="center">
    <Micro delay={2}>2 INDEPENDENT HEADPHONE OUTS · 2 INSERT RETURNS</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Two cue mixes,", "two insert paths."]} size={62} delay={6} />
    <div style={{ height: 28 }} />
    <ProductPlate src="motu-848-15.jpg" total={total} delay={22} height={290} zoom={0.09} />
    <div style={{ height: 20 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-848-17.jpg" total={total} delay={40} height={200} width="50%" zoom={0.07} />
      <ProductPlate src="motu-848-12.png" total={total} delay={48} height={200} width="50%" fit="contain" zoom={0.04} />
    </div>
    <div style={{ height: 20 }} />
    <Body delay={62} size={27} maxWidth={860}>
      Patch outboard across the mix bus, keep two performers on separate cues, and
      never leave the rack.
    </Body>
    <div style={{ height: 16 }} />
    <Montage
      images={["motu-848-10.png", "motu-848-27.jpg"]}
      total={total}
      cols={2}
      height={150}
      delay={74}
      radius={14}
    />
  </Scene>
);

// ── S08 · MG-3 CUEMIX + BUNDLED PRODUCTION SUITE ─────────────────────────────
export const S08_PatchAndMix: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-21.jpg" accent={A.key} justify="center" ambientIntensity={0.8}>
    <Micro delay={2}>CUEMIX PRO · 64 IN / 32 BUSES</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["The whole room,", "one surface."]} size={66} delay={6} />
    <div style={{ height: 26 }} />
    <CueMixOverlay total={total} delay={18} accent={A.keyBright} channels={15} width={900} height={430} />
    <div style={{ height: 18 }} />
    <Montage
      images={["motu-848-21.jpg", "motu-848-26.jpg", "motu-848-24.jpg", "motu-848-4.jpg", "motu-848-4.png", "motu-848-3.jpg"]}
      total={total}
      cols={3}
      height={250}
      delay={54}
      stepIn={4}
    />
    <div style={{ height: 14 }} />
    <Micro delay={86} size={17}>INCLUDED PRODUCTION CONTENT</Micro>
    <div style={{ height: 10 }} />
    <Montage
      images={["motu-848-10.jpg", "motu-848-11.jpg", "motu-848-2.png", "motu-848-5.jpg", "motu-848-12.jpg", "motu-848-5.png", "motu-848-7.jpg", "motu-848-9.png", "motu-848-1.png"]}
      total={total}
      cols={5}
      height={130}
      delay={90}
      stepIn={3}
      radius={12}
    />
  </Scene>
);

// ── S09 · MG-1 SHARED-ENGINE CALLBACK ────────────────────────────────────────
export const S09_EngineCallback: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-8.png" accent={A.key} justify="center">
    <Micro delay={2}>ALL THREE · ONE ARCHITECTURE</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["The engine never", "changed."]} size={66} delay={6} />
    <div style={{ height: 32 }} />
    <IdenticalEngine total={total} delay={16} accent={A.keyBright} readout="~1.8 ms RTL" readoutSub="ESS SABRE32 ULTRA · 32-BIT FLOAT DSP" width={860} />
    <div style={{ height: 26 }} />
    <Montage
      images={["motu-848-9.jpg", "motu-848-13.jpg", "motu-848-14.jpg", "motu-848-8.png", "motu-848-7.png", "motu-848-6.png"]}
      total={total}
      cols={6}
      height={120}
      delay={100}
      stepIn={3}
      radius={12}
    />
  </Scene>
);

// ── S10 · AVB SWITCH REVEAL ──────────────────────────────────────────────────
export const S10_AvbSwitchReveal: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-avb-switch-1.jpg" accent={A.key} justify="center">
    <Micro delay={2}>{SW.full.toUpperCase()} · INFRASTRUCTURE</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Not a fourth", "interface."]} size={74} delay={6} />
    <div style={{ height: 26 }} />
    <Body delay={30} size={29} maxWidth={860}>
      The AVB Switch does not record or convert anything. It is the fabric the
      other three connect through when the network outgrows a daisy-chain.
    </Body>
    <div style={{ height: 28 }} />
    <ProductPlate src="motu-avb-switch-1.jpg" total={total} delay={44} height={320} fit="contain" zoom={0.06} wellColor={COLORS.paperLift} />
    <div style={{ height: 18 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-avb-switch-2.jpg" total={total} delay={60} height={200} width="50%" fit="contain" zoom={0.05} wellColor={COLORS.paperLift} />
      <ProductPlate src="motu-avb-switch-3.jpg" total={total} delay={68} height={200} width="50%" fit="contain" zoom={0.05} wellColor={COLORS.paperLift} />
    </div>
  </Scene>
);

// ── S11 · SWITCH SPECS ───────────────────────────────────────────────────────
export const S11_SwitchSpecs: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-avb-switch-3.png" accent={A.key} justify="center">
    <Micro delay={2}>WHAT THE STANDARD GUARANTEES</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Six ports.", "Nanosecond sync."]} size={66} delay={6} />
    <div style={{ height: 32 }} />
    <SpecReveal
      delay={22}
      accent={A.key}
      valueSize={38}
      rows={[
        { label: "AVB ETHERNET PORTS", value: "6 × 1-Gigabit", bar: 1 },
        { label: "CABLING", value: "CAT-5e / CAT-6", bar: 0.9 },
        { label: "CABLE RUN", value: "up to 100 m", bar: 0.8 },
        { label: "NETWORK SYNC", value: "IEEE 802.1AS (gPTP)", bar: 0.7 },
      ]}
    />
    <div style={{ height: 28 }} />
    <Montage
      images={["motu-avb-switch-3.png", "motu-avb-switch-4.jpg", "motu-avb-switch-4.png", "motu-avb-switch-5.png", "motu-avb-switch-2.png"]}
      total={total}
      cols={5}
      height={160}
      delay={78}
      stepIn={4}
      radius={14}
    />
    <div style={{ height: 16 }} />
    <Body delay={98} size={25} color={COLORS.graphite} maxWidth={860}>
      Standard Ethernet cable, deterministic timing, guaranteed bandwidth — the
      reason audio over AVB behaves like a wire and not like a network.
    </Body>
  </Scene>
);

// ── S12 · MG-2 THE FULL NETWORK (LEVEL 3) ────────────────────────────────────
export const S12_FullNetwork: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-8.jpg" accent={A.key} justify="center">
    <Micro delay={2} color={A.key}>THE COMPLETE ECOSYSTEM</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["One network.", "Every front-end."]} size={68} delay={6} />
    <div style={{ height: 24 }} />
    <NetworkTopology
      level={3}
      total={total}
      delay={16}
      accent={A.key}
      counterTo={512}
      counterLabel="SIMULTANEOUS STREAMS"
      width={900}
      height={520}
    />
    <div style={{ height: 16 }} />
    <Body delay={110} size={27} maxWidth={860}>
      10pre, 16A and 848 — connected through the Switch, sharing one clock and one
      routing grid across the whole facility.
    </Body>
    <div style={{ height: 14 }} />
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <ProductPlate src="motu-848-8.jpg" total={total} delay={124} height={210} width={430} fit="contain" zoom={0.04} />
      <div style={{ width: 14 }} />
      <ProductPlate src="motu-848-3.png" total={total} delay={132} height={210} width={300} fit="contain" zoom={0.03} wellColor={COLORS.paperLift} />
    </div>
  </Scene>
);

// ── S13 · SCALE NUMBERS ──────────────────────────────────────────────────────
export const S13_ScaleNumbers: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-avb-switch-1.png" accent={A.key} justify="center">
    <Micro delay={2}>HOW FAR IT GOES</Micro>
    <div style={{ height: 18 }} />
    <Headline lines={["Built to keep", "going."]} size={72} delay={6} />
    <div style={{ height: 30 }} />
    <SpecReveal
      delay={22}
      accent={A.key}
      valueSize={42}
      rows={[
        { label: "DEVICES", value: "up to 150", num: 150, bar: 1 },
        { label: "SWITCHES", value: "across 37", num: 37, bar: 0.72 },
        { label: "STREAMS", value: "512 simultaneous", num: 512, bar: 0.9 },
        { label: "CHANNELS", value: "4,096 in 8-ch blocks", bar: 1 },
      ]}
    />
    <div style={{ height: 26 }} />
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <ProductPlate src="motu-avb-switch-1.png" total={total} delay={78} height={230} width="50%" fit="contain" zoom={0.04} />
      <ProductPlate src="motu-848-18.jpg" total={total} delay={86} height={230} width="50%" zoom={0.06} />
    </div>
  </Scene>
);

// ── S14 · MG-5 IDENTITY BADGES — ALL FOUR ────────────────────────────────────
export const S14_IdentityBadges: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-11.png" accent={A.key} justify="center" align="center">
    <Micro delay={2}>ONE ENGINE · THREE FRONT-ENDS · ONE NETWORK</Micro>
    <div style={{ height: 26 }} />
    <div style={{ display: "flex", gap: 20, justifyContent: "center", width: "100%" }}>
      <IdentityBadge icon="mic" label="10pre" caption="SOURCE" delay={8} accent={COLORS.amber} size={70} />
      <IdentityBadge icon="matrix" label="16A" caption="MATRIX" delay={14} accent={A.key} size={70} />
      <IdentityBadge icon="monitor" label="848" caption="COMMAND" delay={20} accent={A.key} size={70} />
      <IdentityBadge icon="node" label="SWITCH" caption="NETWORK" delay={26} accent={A.keyBright} size={70} />
    </div>
    <div style={{ height: 30 }} />
    <Sub delay={44} align="center" size={38}>
      Four products. One system that behaves like one machine.
    </Sub>
    <div style={{ height: 24 }} />
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <ProductPlate src="motu-848-11.png" total={total} delay={58} height={190} width={520} fit="contain" zoom={0.04} />
    </div>
  </Scene>
);

// ── S15 · FULL SERIES OUTRO CTA (both MOPs, held apart) ──────────────────────
export const S15_SeriesOutro: React.FC<{ total: number }> = ({ total }) => (
  <Scene ambientImage="motu-848-newly-added-1.png" accent={A.key} streams justify="center">
    <Micro delay={2}>THE MOTU AVB SERIES · PARTS 1–3</Micro>
    <div style={{ height: 16 }} />
    <Headline lines={["Talk it through", "with us."]} size={70} delay={6} />
    <div style={{ height: 24 }} />

    {/* two distinct price points — never averaged, never laddered */}
    <div style={{ display: "flex", gap: 16, width: "100%" }}>
      <TextPlate delay={26} width="58%" pad="24px 26px">
        <div style={{ ...F.micro(15, COLORS.graphite, 700, "0.16em") }}>MOTU 16A · 848 · 10pre</div>
        <div style={{ ...F.spec(46, COLORS.ink), marginTop: 8 }}>{PRICING.interface.mop}</div>
        <div style={{ ...F.body(19, COLORS.graphite), marginTop: 4 }}>{PRICING.interface.note}</div>
      </TextPlate>
      <TextPlate delay={34} width="42%" pad="24px 26px">
        <div style={{ ...F.micro(15, COLORS.graphite, 700, "0.16em") }}>MOTU AVB SWITCH</div>
        <div style={{ ...F.spec(46, A.key), marginTop: 8 }}>{PRICING.switch.mop}</div>
        <div style={{ ...F.body(19, COLORS.graphite), marginTop: 4 }}>{PRICING.switch.note}</div>
      </TextPlate>
    </div>

    <div style={{ height: 20 }} />
    <Body delay={44} size={24} color={COLORS.inkSoft} maxWidth={880}>
      Every studio configures this differently — how many interfaces, which
      front-ends, and whether a Switch is needed yet. That is worth a conversation.
    </Body>

    <div style={{ height: 24 }} />
    <Cta delay={56} size={52} color={COLORS.ink}>{BRAND.website}</Cta>
    <div style={{ height: 12 }} />
    <Body delay={64} size={23} color={COLORS.graphite} maxWidth={880}>
      {BRAND.name} — {BRAND.designation}.
    </Body>

    <div style={{ height: 22 }} />
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {BRAND.whatsapp.map((w, i) => (
        <Chip key={w} delay={72 + i * 4}>{w}</Chip>
      ))}
    </div>
    <div style={{ height: 12 }} />
    <Body delay={88} size={21} color={COLORS.graphite} maxWidth={880}>
      {BRAND.linktree} · {BRAND.instagram} · {BRAND.youtube}
    </Body>
    <div style={{ height: 8 }} />
    <Body delay={94} size={19} color={COLORS.graphiteDim} maxWidth={880}>
      {BRAND.address}
    </Body>
  </Scene>
);
