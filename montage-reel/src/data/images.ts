// ─────────────────────────────────────────────────────────────────────────────
// IMAGE CATALOGUE — every unique product image in the repository, classified
// by eye from contact sheets so the shot lists can interleave angle types
// (brief §8). `slug` matches public/images/manifest.json (scripts/copy-assets).
// Pure TypeScript — no Remotion imports.
//
//  kind  hero    full product shot (front / rear / three-quarter)
//        detail  connector-panel / display / knob close-up
//        ui      CueMix Pro / DAW / plug-in screenshot
//        scene   lifestyle / in-context photograph (desk, studio, iPad, laptop)
//        graphic logo, badge, diagram, icon, artwork
//  fit   cover   photograph — fill the slot (with a focal point)
//        contain product on transparent/flat ground — sit on the act ground
//        panel   ultra-wide 1U panel strip — shown as a horizontal band
// ─────────────────────────────────────────────────────────────────────────────
export type Product = "16A" | "848" | "10pre" | "switch";
export type Kind = "hero" | "detail" | "ui" | "scene" | "graphic";
export type Fit = "cover" | "contain" | "panel";
export interface ImageInfo {
  slug: string;
  product: Product;
  kind: Kind;
  fit: Fit;
  /** short human description (for the coverage ledger) */
  desc: string;
  /** focal point (0..1, 0..1) for cover crops — defaults to centre */
  focal?: [number, number];
  /** true when the source has an alpha channel (contain on a coloured ground) */
  alpha?: boolean;
  /** source is light/white ground (needs a soft plate so it doesn't glare) */
  light?: boolean;
}

const I = (slug: string, product: Product, kind: Kind, fit: Fit, desc: string, extra: Partial<ImageInfo> = {}): ImageInfo => ({ slug, product, kind, fit, desc, ...extra });

export const IMAGES: ImageInfo[] = [
  // ── MOTU 16A (40) ──────────────────────────────────────────────────────────
  I("motu-16a-new.jpg", "16A", "hero", "cover", "16A front, straight-on, black ground", { focal: [0.5, 0.5] }),
  I("motu-16a-new-3.png", "16A", "hero", "contain", "16A front three-quarter (right)", { alpha: true }),
  I("motu-16a-new-4.png", "16A", "hero", "contain", "16A front three-quarter (left)", { alpha: true }),
  I("motu-16a-new-1.png", "16A", "hero", "contain", "16A rear three-quarter", { alpha: true }),
  I("motu-16a-new-2.png", "16A", "hero", "contain", "16A rear three-quarter, other side", { alpha: true }),
  I("motu-16a-9.png", "16A", "hero", "panel", "16A front panel, straight", { alpha: true }),
  I("motu-16a-13.png", "16A", "hero", "panel", "16A rear panel, angled", { alpha: true }),
  I("motu-16a-10.png", "16A", "hero", "panel", "16A front panel strip A", { alpha: true }),
  I("motu-16a-11.png", "16A", "hero", "panel", "16A front panel strip B", { alpha: true }),
  I("motu-16a-12.png", "16A", "hero", "panel", "16A front panel strip C", { alpha: true }),
  I("motu-16a-8.png", "16A", "detail", "contain", "rear: word clock / network / optical", { alpha: true }),
  I("motu-16a-24.jpg", "16A", "detail", "cover", "LINE OUT jacks close-up"),
  I("motu-16a-28.jpg", "16A", "detail", "cover", "NETWORK / OPTICAL close-up"),
  I("motu-16a-21.jpg", "16A", "detail", "cover", "rear line-out row"),
  I("motu-16a-2.jpg", "16A", "detail", "cover", "front meter display close-up"),
  I("motu-16a-23.jpg", "16A", "detail", "cover", "USB-C cable", { focal: [0.5, 0.4] }),
  I("motu-16a-1.jpg", "16A", "scene", "cover", "16A on desk with laptop and headphones", { focal: [0.4, 0.55] }),
  I("motu-16a-18.jpg", "16A", "scene", "cover", "laptop on 16A, dark", { focal: [0.5, 0.6] }),
  I("motu-16a-12.jpg", "16A", "scene", "cover", "display showing CueMix mixer", { focal: [0.5, 0.45] }),
  I("motu-16a-25.jpg", "16A", "scene", "cover", "16A rear with cable loom", { focal: [0.5, 0.5] }),
  I("motu-16a-7.png", "16A", "scene", "cover", "iPad wireless control over 16A", { focal: [0.45, 0.5] }),
  I("motu-16a-9.jpg", "16A", "ui", "cover", "CueMix Pro — Home"),
  I("motu-16a-6.jpg", "16A", "ui", "cover", "CueMix Pro — Device list"),
  I("motu-16a-10.jpg", "16A", "ui", "cover", "CueMix Pro — Inputs"),
  I("motu-16a-14.jpg", "16A", "ui", "cover", "CueMix Pro — Outputs"),
  I("motu-16a-11.jpg", "16A", "ui", "cover", "CueMix Pro — Mixing"),
  I("motu-16a-13.jpg", "16A", "ui", "cover", "CueMix Pro — Mix settings"),
  I("motu-16a-7.jpg", "16A", "ui", "cover", "CueMix Pro — channel strip dynamics"),
  I("motu-16a-15.jpg", "16A", "ui", "cover", "CueMix Pro — channel strip EQ"),
  I("motu-16a-16.jpg", "16A", "ui", "cover", "Patch bay — sources / destinations"),
  I("motu-16a-17.jpg", "16A", "ui", "cover", "CueMix Pro — Patchbay"),
  I("motu-16a-2.png", "16A", "ui", "contain", "CueMix Pro — Patchbay window", { alpha: true }),
  I("motu-16a-3.png", "16A", "ui", "contain", "DAW arrangement", { alpha: true }),
  I("motu-16a-26.jpg", "16A", "ui", "cover", "DAW piano roll"),
  I("motu-16a-19.jpg", "16A", "graphic", "cover", "DAW + plug-in collage"),
  I("motu-16a-1.png", "16A", "graphic", "contain", "CueMix Pro badge", { alpha: true }),
  I("motu-16a-6.png", "16A", "graphic", "contain", "round-trip latency diagram"),
  I("motu-16a-4.png", "16A", "graphic", "contain", "16A front-panel line drawing", { alpha: true }),
  I("motu-16a-5.png", "16A", "graphic", "contain", "16A system diagram", { alpha: true }),
  I("motu-16a-5.jpg", "16A", "graphic", "cover", "AVB daisy-chain network diagram", { focal: [0.5, 0.5] }),
  // ── MOTU 848 (31) ──────────────────────────────────────────────────────────
  I("motu-848-new-1.jpg", "848", "hero", "cover", "848 front, straight-on, black ground"),
  I("motu-848-new-3.png", "848", "hero", "contain", "848 front three-quarter (right)", { alpha: true }),
  I("motu-848-new-4.png", "848", "hero", "contain", "848 front three-quarter (left)", { alpha: true }),
  I("motu-848-new-1.png", "848", "hero", "contain", "848 rear three-quarter", { alpha: true }),
  I("motu-848-new-2.png", "848", "hero", "contain", "848 rear three-quarter, other side", { alpha: true }),
  I("motu-848-11.png", "848", "hero", "panel", "848 front panel, straight", { alpha: true }),
  I("motu-848-12.png", "848", "hero", "panel", "848 rear panel, angled", { alpha: true }),
  I("motu-848-4.jpg", "848", "detail", "cover", "front meter display"),
  I("motu-848-22.jpg", "848", "detail", "cover", "front display, tight"),
  I("motu-848-15.jpg", "848", "detail", "cover", "headphone outputs 1 / 2"),
  I("motu-848-16.jpg", "848", "detail", "cover", "LINE OUT jacks"),
  I("motu-848-18.jpg", "848", "detail", "cover", "rear: network / optical / line"),
  I("motu-848-20.jpg", "848", "detail", "cover", "inserts + combo inputs"),
  I("motu-848-23.jpg", "848", "detail", "cover", "mic / line / instrument inputs"),
  I("motu-848-25.jpg", "848", "detail", "cover", "monitor group buttons"),
  I("motu-10pre-20.jpg", "848", "detail", "cover", "A / B / C · mute / mono / talk (also filed under 10pre)"),
  I("motu-848-1.jpg", "848", "scene", "cover", "studio: console, monitors, display", { focal: [0.5, 0.55] }),
  I("motu-848-17.jpg", "848", "scene", "cover", "848 rear with cable loom", { focal: [0.55, 0.5] }),
  I("motu-848-24.jpg", "848", "scene", "cover", "display showing CueMix mixer", { focal: [0.5, 0.45] }),
  I("motu-848-9.png", "848", "scene", "cover", "iPad wireless control over 848", { focal: [0.45, 0.5] }),
  I("motu-848-3.jpg", "848", "ui", "cover", "DAW arrangement"),
  I("motu-848-26.jpg", "848", "ui", "cover", "Patchbay"),
  I("motu-848-1.png", "848", "graphic", "contain", "CueMix Pro badge (848 copy)", { alpha: true }),
  I("motu-848-2.png", "848", "graphic", "contain", "MOTU instrument soundbank collage", { alpha: true }),
  I("motu-848-3.png", "848", "graphic", "contain", "partner logo", { alpha: true }),
  I("motu-848-5.jpg", "848", "graphic", "cover", "Big Fish Audio artwork"),
  I("motu-848-10.jpg", "848", "graphic", "cover", "Loopmasters artwork"),
  I("motu-848-11.jpg", "848", "graphic", "cover", "Lucid Samples artwork"),
  I("motu-848-13.jpg", "848", "graphic", "cover", "Thunderbolt mark"),
  I("motu-848-6.png", "848", "graphic", "contain", "848 front-panel line drawing", { alpha: true }),
  I("motu-848-7.png", "848", "graphic", "contain", "848 system diagram", { alpha: true }),
  I("motu-848-8.png", "848", "graphic", "contain", "round-trip latency diagram (848)"),
  // ── MOTU 10pre (40) ────────────────────────────────────────────────────────
  I("motu-10pre-new.jpg", "10pre", "hero", "cover", "10pre front, straight-on, black ground"),
  I("motu-10pre-new-3.png", "10pre", "hero", "contain", "10pre front three-quarter (right)", { alpha: true }),
  I("motu-10pre-new.png", "10pre", "hero", "contain", "10pre front three-quarter (left)", { alpha: true }),
  I("motu-10pre-new-1.png", "10pre", "hero", "contain", "10pre rear three-quarter", { alpha: true }),
  I("motu-10pre-new-2.png", "10pre", "hero", "contain", "10pre rear three-quarter, other side", { alpha: true }),
  I("motu-10pre-4.png", "10pre", "hero", "panel", "10pre front panel, straight", { alpha: true }),
  I("motu-10pre-8.png", "10pre", "hero", "panel", "10pre rear panel, angled", { alpha: true }),
  I("motu-10pre-11.jpg", "10pre", "detail", "cover", "combo inputs + inserts"),
  I("motu-10pre-13.jpg", "10pre", "detail", "cover", "mic / line / instrument inputs"),
  I("motu-10pre-12.jpg", "10pre", "detail", "cover", "front display meters"),
  I("motu-10pre-17.jpg", "10pre", "detail", "cover", "front display, dark"),
  I("motu-10pre-18.jpg", "10pre", "detail", "cover", "LINE OUT L / R"),
  I("motu-10pre-2.jpg", "10pre", "detail", "cover", "rear: network / optical / line out"),
  I("motu-10pre-22.jpg", "10pre", "detail", "cover", "rear: network / optical"),
  I("motu-10pre-29.jpg", "10pre", "detail", "cover", "headphone outputs 1 / 2"),
  I("motu-10pre-15.jpg", "10pre", "detail", "cover", "monitor group buttons"),
  I("motu-10pre-13.png", "10pre", "detail", "cover", "USB-C cable", { focal: [0.5, 0.4] }),
  I("motu-10pre-1.jpg", "10pre", "scene", "cover", "10pre rear with cable loom", { focal: [0.55, 0.5] }),
  I("motu-10pre-14.jpg", "10pre", "scene", "cover", "display showing CueMix mixer", { focal: [0.5, 0.45] }),
  I("motu-10pre-14.png", "10pre", "scene", "cover", "iPad wireless control over 10pre", { focal: [0.45, 0.5] }),
  I("motu-10pre-16.jpg", "10pre", "scene", "cover", "studio: console and monitors", { focal: [0.5, 0.55] }),
  I("motu-10pre-24.jpg", "10pre", "scene", "cover", "iPad running CueMix, dark", { focal: [0.5, 0.5] }),
  I("motu-10pre-6.jpg", "10pre", "ui", "cover", "CueMix Pro — Home"),
  I("motu-10pre-5.jpg", "10pre", "ui", "cover", "CueMix Pro — Device list"),
  I("motu-10pre-7.jpg", "10pre", "ui", "cover", "CueMix Pro — Mic inputs"),
  I("motu-10pre-9.jpg", "10pre", "ui", "cover", "CueMix Pro — Outputs"),
  I("motu-10pre-8.jpg", "10pre", "ui", "cover", "CueMix Pro — Mixing"),
  I("motu-10pre-3.jpg", "10pre", "ui", "cover", "CueMix Pro — channel strip dynamics"),
  I("motu-10pre-4.jpg", "10pre", "ui", "cover", "CueMix Pro — channel strip EQ"),
  I("motu-10pre-10.jpg", "10pre", "ui", "cover", "CueMix Pro — Patchbay"),
  I("motu-10pre-21.jpg", "10pre", "ui", "cover", "Patchbay (compact)"),
  I("motu-10pre-27.jpg", "10pre", "ui", "cover", "reverb plug-in window"),
  I("motu-10pre-1.png", "10pre", "ui", "contain", "DAW arrangement", { alpha: true }),
  I("motu-10pre-10.png", "10pre", "graphic", "contain", "10pre front-panel line drawing", { alpha: true }),
  I("motu-10pre-11.png", "10pre", "graphic", "contain", "10pre system diagram", { alpha: true }),
  I("motu-10pre-12.png", "10pre", "graphic", "contain", "round-trip latency diagram (10pre)"),
  I("motu-10pre-26.jpg", "10pre", "graphic", "cover", "ESS Technology mark"),
  I("motu-10pre-28.jpg", "10pre", "graphic", "cover", "Thunderbolt mark (round)"),
  I("motu-10pre-25.jpg", "10pre", "graphic", "cover", "AVB daisy-chain network diagram (10pre / 848 / 16A)"),
  // ── MOTU AVB Switch (9) ────────────────────────────────────────────────────
  I("motu-avb-switch-1.jpg", "switch", "hero", "cover", "AVB Switch, front three-quarter, white ground", { light: true }),
  I("motu-avb-switch-2.jpg", "switch", "hero", "cover", "AVB Switch, angled, white ground", { light: true }),
  I("motu-avb-switch-3.jpg", "switch", "hero", "cover", "AVB Switch, top view, white ground", { light: true }),
  I("motu-avb-switch-1.png", "switch", "graphic", "contain", "AVB network illustration", { alpha: true }),
  I("motu-avb-switch-3.png", "switch", "graphic", "contain", "blue ethernet cable", { alpha: true }),
  I("motu-avb-switch-2.png", "switch", "graphic", "contain", "IEEE 802.1 AVB badge", { alpha: true }),
  I("motu-avb-switch-4.jpg", "switch", "graphic", "cover", "clock icon", { light: true }),
  I("motu-avb-switch-4.png", "switch", "graphic", "contain", "quality-guaranteed ribbon", { alpha: true }),
  I("motu-avb-switch-5.png", "switch", "graphic", "contain", "gauge icon", { alpha: true }),
];

export const IMAGE_BY_SLUG: Record<string, ImageInfo> = Object.fromEntries(IMAGES.map((i) => [i.slug, i]));
export const imagesOf = (p: Product) => IMAGES.filter((i) => i.product === p);
