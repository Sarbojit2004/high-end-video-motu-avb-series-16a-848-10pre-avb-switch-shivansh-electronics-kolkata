import { ASSETS, type Asset, type ProductKey } from "./assets.ts";
import { buildTimeline, type SegmentId, type TimedCaption, type TimedSegment } from "./script.ts";
import { VIDEO } from "./theme.ts";

// ─────────────────────────────────────────────────────────────────────────────
// THE SHOT PLAN — where every image lands, and for how long.
//
// TWO CONSTRAINTS PULL AGAINST EACH OTHER.
//
//   Coverage (Section 5): every one of the 120 distinct product images must be
//   used somewhere in the reel.
//   Pacing (Section 5 again): "this reel can afford meaningfully longer hold
//   times... lean into that, since this is a technical explainer meant to let a
//   viewer actually see and absorb what's being shown."
//
// 120 images across 180 s is 1.5 s each if they are simply queued, which is
// montage pace — precisely what this deliverable is not. The resolution is to
// stop treating "one image = one shot" as the only option and give the frame
// LAYERS, so a hero can hold for five seconds while supporting material is
// legibly present alongside it:
//
//   hero   one image, staged, 3–6 s. The image the narration is about.
//   pair   two images sharing the frame — typically front panel + rear panel.
//   strip  3–5 plates in a slow horizontal run, each large enough to read.
//   grid   4–8 plates revealing in sequence — the context/detail tier.
//
// Shots are cut to CAPTION GROUP boundaries, never to a beat grid, because the
// narration governs this reel's timing (Section 10). A shot changes when a
// thought changes.
// ─────────────────────────────────────────────────────────────────────────────

export type ShotKind = "hero" | "pair" | "strip" | "grid";

export type Shot = {
  segment: string;
  product: ProductKey;
  env: "light" | "dark";
  kind: ShotKind;
  start: number;
  end: number;
  assets: Asset[];
  /** Captions that play over this shot. */
  captions: TimedCaption[];
  /** Layout seed so repeated kinds do not land identically. */
  seed: number;
  /**
   * A reprise shot re-shows product heroes that are covered properly inside
   * their own segment. The cold open has to SHOW the four products it names,
   * and the close has to bring all four back for the synthesis — neither can
   * be done from the shared-platform pool alone. Marked so the coverage
   * ledger reports these as reprises rather than double-counting them.
   */
  reprise?: boolean;
};

/** How many captions a shot holds — larger for slow, systemic material. */
const GROUP: Record<string, number> = {
  open: 2,
  s16a: 2,
  s848: 2,
  s10pre: 2,
  sswitch: 2,
  close: 2,
};

/** Which pool each segment draws from. */
const POOL: Record<string, ProductKey> = {
  open: "shared",
  s16a: "p16a",
  s848: "p848",
  s10pre: "p10pre",
  sswitch: "pswitch",
  close: "shared",
};

/**
 * Orders a product's images so the strongest material lands on the hero shots.
 *
 * SUBJECT FIRST, staging second. An earlier version ranked purely on the alpha
 * channel, which put the CueMix Pro roundel — a transparent PNG — on the line
 * "Sixteen balanced line inputs". What an image shows has to outrank how it can
 * be staged.
 *
 *   0-2  hardware, best-staged first: a floated cutout, then a panel run whose
 *        connector rows are legible, then a photograph
 *   3    diagrams — the right hero for the AVB Switch, whose subject is a
 *        network rather than a box, and a fair hero nowhere else
 *   4    a room or rig the hardware sits in
 *   5+   software screens, logos and bundled-content artwork. All still used,
 *        all in the grid tier, never as the image a sentence rests on.
 */
const rank = (a: Asset): number => {
  if (a.subject === "hardware") {
    if (a.kind === "cutout") return 0;
    if (a.kind === "strip" || a.kind === "panel") return 1;
    return 2;
  }
  if (a.subject === "diagram") return 3;
  if (a.subject === "context") return 4;
  if (a.subject === "ui") return 5;
  return 6; // mark, bundle
};

/** Only these may take a hero slot. */
const HERO_RANK = 3;

const orderPool = (product: ProductKey): Asset[] =>
  ASSETS.filter((a) => a.product === product).slice().sort((x, y) => rank(x) - rank(y) || x.slug.localeCompare(y.slug));

/**
 * Splits `shared` between the cold open and the close.
 *
 * These 11 images are the platform assets — CueMix Pro, the DSP reverb window,
 * the ESS and Thunderbolt marks, the bundled cable, the DAW windows, the rear
 * panel network detail. They were saved under two or three product filenames
 * each precisely because they belong to all of them, which makes them the
 * literal evidence for the reel's "same platform underneath" thesis. So they
 * bookend the film: the claim in the cold open, the proof in the close.
 */
const splitShared = () => {
  const all = orderPool("shared");
  return { open: all.slice(0, 5), close: all.slice(5) };
};

/**
 * One hero cutout per product, for the ecosystem shots.
 *
 * The cold open names the 16A, the 848 and the 10pre in its first ten seconds
 * and claims they are one platform; the close brings all four back together.
 * Both moments need the actual products on screen. These are reprises — each
 * one is also covered inside its own segment — so they are flagged rather than
 * counted twice.
 */
/**
 * PINNED SHOTS — the edit decisions, made by hand.
 *
 * Everything else in this file distributes images by rule, which is right for
 * coverage and wrong for the dozen moments where a specific sentence has a
 * specific correct picture. "Four combo preamps on the front panel" has exactly
 * one right image in the whole library: the macro of the four XLR/TRS combo
 * jacks. No ranking heuristic will find that; it has to be stated.
 *
 * Each entry pins a caption (matched on a distinctive fragment) to the asset
 * that sentence is about. Pinned assets are pulled out of the pool first, so
 * they are never also spent somewhere generic, and the rule-based distribution
 * fills in around them.
 */
const PINS: { seg: SegmentId; find: string; slug: string; why: string }[] = [
  // ── 16A: the argument is line I/O and the absence of preamps ────────────
  { seg: "s16a", find: "Sixteen balanced line inputs", slug: "motu-16a-13-png",
    why: "rear panel — the full row of balanced TRS inputs being counted" },
  { seg: "s16a", find: "Sixteen DC-coupled outputs", slug: "motu-16a-24-jpg",
    why: "LINE OUT macro — the outputs the DC-coupling claim is about" },
  { seg: "s16a", find: "A console. A patchbay", slug: "motu-16a-25-jpg",
    why: "rear panel wired up — a facility that already owns its front end" },
  { seg: "s16a", find: "ESS Sabre32 conversion", slug: "motu-16a-newly-added-1-png",
    why: "clean product render to land the spec on" },

  // ── 848: preamps, inserts, monitoring, two cue mixes ────────────────────
  { seg: "s848", find: "Four combo preamps", slug: "motu-848-23-jpg",
    why: "the four MIC/LINE/INSTRUMENT combo jacks — literally the sentence" },
  { seg: "s848", find: "Inserts on channels three and four", slug: "motu-848-20-jpg",
    why: "the INSERTS send/return pair beside the combo inputs" },
  { seg: "s848", find: "A, B, C speaker switching", slug: "motu-10pre-20-jpg",
    why: "the A / B / C + MUTE / MONO / TALK monitor buttons" },
  { seg: "s848", find: "Two headphone outputs", slug: "motu-848-15-jpg",
    why: "the two headphone jacks with their independent volume encoders" },
  { seg: "s848", find: "and twelve outputs", slug: "motu-848-16-jpg",
    why: "the LINE OUT bank being counted" },

  // ── 10pre: the front/rear split IS the product ──────────────────────────
  { seg: "s10pre", find: "Ten combo preamps", slug: "motu-10pre-newly-added-2-png",
    why: "three-quarter render showing the whole preamp row at once" },
  { seg: "s10pre", find: "Six sit on the rear panel", slug: "motu-10pre-8-png",
    why: "the rear panel — the six that get wired in and left" },
  { seg: "s10pre", find: "Four are on the front", slug: "motu-10pre-13-jpg",
    why: "the four front-panel combo jacks — the quick-access half of the split" },
  { seg: "s10pre", find: "The split is the real design", slug: "motu-10pre-11-jpg",
    why: "front-panel inserts and combo inputs together" },

  // ── AVB Switch: a network, never a box with channels ────────────────────
  // Nine images across nine caption groups means every one lands somewhere
  // prominent, so every one is placed deliberately rather than distributed.
  { seg: "sswitch", find: "The AVB Switch has no preamps", slug: "motu-avb-switch-3-jpg",
    why: "top view — nothing on it but six RJ-45s, which is the claim" },
  { seg: "sswitch", find: "six Gigabit ports", slug: "motu-avb-switch-1-jpg",
    why: "the switch itself, ports facing the viewer" },
  { seg: "sswitch", find: "turn separate interfaces", slug: "motu-avb-switch-1-png",
    why: "the topology — separate devices resolved into one system" },
  { seg: "sswitch", find: "802.1AS locks every device", slug: "motu-avb-switch-2-jpg",
    why: "the switch doing the locking, rather than a stock badge" },
  { seg: "sswitch", find: "Up to 4,096 channels", slug: "motu-avb-switch-5-png",
    why: "a meter at full scale — the one place the gauge graphic earns its spot" },
  { seg: "sswitch", find: "accurate to the nanosecond", slug: "motu-avb-switch-4-jpg",
    why: "the clock mark — gPTP is the one idea this segment must land" },
  { seg: "sswitch", find: "512 streams", slug: "motu-16a-5-jpg",
    why: "the full AVB topology diagram — what 512 streams actually looks like" },
  { seg: "sswitch", find: "replaces the snake", slug: "motu-avb-switch-3-png",
    why: "a single Ethernet run — the cable that replaces the multicore" },

  // ── close ───────────────────────────────────────────────────────────────
  { seg: "close", find: "CueMix Pro across all three", slug: "motu-10pre-24-jpg",
    why: "CueMix Pro on iPad — the one control surface across the range" },
];

const ECOSYSTEM: ProductKey[] = ["p16a", "p848", "p10pre", "pswitch"];

const ecosystemHeroes = (): Asset[] =>
  ECOSYSTEM.map((k) => {
    const pool = orderPool(k);
    // Prefer the front-panel runs: they carry the lit TFT meters, which is the
    // only bright thing on an otherwise dark brushed-metal chassis and the
    // difference between four readable products and four black rectangles.
    return (
      pool.find((a) => a.subject === "hardware" && a.kind === "strip") ??
      pool.find((a) => a.subject === "hardware" && a.kind === "cutout") ??
      pool.find((a) => a.subject === "hardware") ??
      pool[0]
    );
  }).filter(Boolean);

export const buildShots = (): { shots: Shot[]; total: number } => {
  const { segments, total } = buildTimeline();
  const shared = splitShared();
  const shots: Shot[] = [];
  let seed = 1;

  for (const seg of segments as TimedSegment[]) {
    const pool =
      seg.id === "open" ? shared.open : seg.id === "close" ? shared.close : orderPool(POOL[seg.id]);

    // Group captions into shots.
    const groups: TimedCaption[][] = [];
    const per = GROUP[seg.id];
    for (let i = 0; i < seg.captions.length; i += per) {
      groups.push(seg.captions.slice(i, i + per));
    }

    // Resolve this segment's pins to the group each one lands in.
    const segPins = PINS.filter((x) => x.seg === seg.id);
    const pinnedAt = new Map<number, Asset>();
    const pinnedSlugs = new Set<string>();
    for (const pin of segPins) {
      const gi = groups.findIndex((g) => g.some((c) => c.t.includes(pin.find)));
      const asset = ASSETS.find((a) => a.slug === pin.slug);
      if (gi < 0 || !asset) {
        // A pin that no longer matches is a silent loss of an edit decision,
        // so it is surfaced rather than swallowed.
        console.warn(`[shots] unresolved pin: ${seg.id} "${pin.find}" -> ${pin.slug}`);
        continue;
      }
      if (!pinnedAt.has(gi)) {
        pinnedAt.set(gi, asset);
        pinnedSlugs.add(asset.slug);
      }
    }

    // Distribute the pool across the groups. Every image is used exactly once.
    // Heroes are handed out first so the best staging lands on real moments,
    // then whatever remains is spread across the other shots as grids/strips.
    const n = groups.length;
    const heroCount = Math.min(n, Math.max(2, Math.round(n * 0.45)));

    // Which group indices are heroes — spread evenly, never two in a row.
    const heroAt = new Set<number>();
    for (let i = 0; i < heroCount; i++) {
      const at = Math.min(n - 1, Math.round((i * n) / heroCount));
      if (!pinnedAt.has(at)) heroAt.add(at);
    }

    const avail = pool.filter((a) => !pinnedSlugs.has(a.slug));

    // Logos, service badges and bundled-content artwork have to be covered, but
    // they must never be the only thing in a frame. Given a small pool they
    // otherwise land as a solo or two-up — which is how a stock "Guaranteed
    // Service" rosette ended up filling the frame beside the line about the
    // mixer running in hardware. They are held back here and dropped into one
    // dense grid at the end of the segment, where a board of marks reads as a
    // deliberate contact sheet instead of an accident.
    const lowValue = avail.filter((a) => a.subject === "mark" || a.subject === "bundle");
    const lowSlugs = new Set(lowValue.map((a) => a.slug));
    const usable = avail.filter((a) => !lowSlugs.has(a.slug));

    const heroes = usable.filter((a) => rank(a) <= HERO_RANK);
    const rest = usable.filter((a) => rank(a) > HERO_RANK);
    const queueHero = heroes.slice();
    const queueRest = rest.slice();
    // Anything left over after heroes are placed rejoins the grid queue.
    const spare: Asset[] = [];

    // How many non-hero images each grid shot must carry, spread evenly.
    const gridShots = n - heroAt.size - pinnedAt.size;
    const perGrid = gridShots > 0 ? Math.ceil((queueRest.length + Math.max(0, queueHero.length - heroAt.size)) / gridShots) : 0;

    groups.forEach((caps, gi) => {
      const start = caps[0].start;
      const end = gi === n - 1 ? seg.end : groups[gi + 1][0].start;
      const isHero = heroAt.has(gi);

      let assets: Asset[] = [];
      let kind: ShotKind;

      // The ecosystem quad opens the film and closes it.
      const isEcoShot =
        (seg.id === "open" && gi === 0) || (seg.id === "close" && gi === groups.length - 1);
      if (isEcoShot) {
        shots.push({
          segment: seg.id, product: POOL[seg.id], env: seg.env, kind: "grid",
          start, end, assets: ecosystemHeroes(), captions: caps, seed: seed++, reprise: true,
        });
        return;
      }

      const pinned = pinnedAt.get(gi);
      if (pinned) {
        shots.push({
          segment: seg.id, product: POOL[seg.id], env: seg.env, kind: "hero",
          start, end, assets: [pinned], captions: caps, seed: seed++,
        });
        return;
      }

      if (isHero && queueHero.length) {
        const a = queueHero.shift()!;
        // A wide panel run pairs naturally with a second panel when one is free.
        if ((a.kind === "strip" || a.kind === "panel") && queueHero[0] && (queueHero[0].kind === "strip" || queueHero[0].kind === "panel")) {
          assets = [a, queueHero.shift()!];
          kind = "pair";
        } else {
          assets = [a];
          kind = "hero";
        }
      } else {
        const take: Asset[] = [];
        for (let k = 0; k < perGrid; k++) {
          const a = queueRest.shift() ?? queueHero.shift() ?? spare.shift();
          if (a) take.push(a);
        }
        assets = take;
        kind = take.length <= 3 ? "strip" : "grid";
        if (take.length === 0) {
          // Nothing left to show — fall back to re-staging the segment's first
          // hero rather than rendering an empty frame.
          assets = [pool[0]];
          kind = "hero";
        }
      }

      shots.push({
        segment: seg.id,
        product: POOL[seg.id],
        env: seg.env,
        kind,
        start,
        end,
        assets,
        captions: caps,
        seed: seed++,
      });
    });

    // Safety net: anything the distribution did not place — plus the marks and
    // bundle artwork held back above — goes onto the segment's last non-hero
    // shot rather than being silently dropped.
    const leftover = [...queueHero, ...queueRest, ...spare, ...lowValue];
    if (leftover.length) {
      // Never onto a reprise: the ecosystem shot is exactly the four products
      // and nothing else, in the open and in the close.
      const segShots = [...shots].reverse().filter((s) => s.segment === seg.id && !s.reprise);
      const last = segShots.find((s) => s.kind !== "hero") ?? segShots[0];
      if (last) {
        last.assets.push(...leftover);
        if (last.assets.length > 3) last.kind = "grid";
        else if (last.assets.length > 1) last.kind = "strip";
      }
    }

    // A "strip" holding a single image is just a hero with the wrong staging.
    for (const sh of shots) {
      if (sh.segment === seg.id && sh.kind === "strip" && sh.assets.length === 1) sh.kind = "hero";
    }
  }

  return { shots, total };
};

/** Frame helpers. */
export const F = (s: number) => Math.round(s * VIDEO.fps);
