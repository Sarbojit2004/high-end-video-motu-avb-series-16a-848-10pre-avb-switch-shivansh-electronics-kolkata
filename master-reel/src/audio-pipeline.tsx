import React from "react";
import { Audio, Sequence } from "remotion";
import { MUSIC, SFX, VO } from "./assets";
import { VIDEO } from "./theme";
import type { Beat, MusicSeg } from "./beat";
import { frames } from "./beat";

/**
 * Two-layer audio, pulled unchanged from the approved three-part reel build
 * (Section 0/10) and driven by the same schedule
 * that drives the picture — which is what makes the delivered stem WAVs drop
 * onto an editor's timeline already in sync. They are not hand-placed.
 *
 * Layer 1 — licensed music bed, per-stem, per-segment.
 * Layer 2 — transition and accent SFX, every file of which is synthesized from
 *           raw PCM by scripts/make-sfx.mjs in this repository. No SFX in this
 *           project comes from ElevenLabs or any other external audio service.
 */

const XFADE = 30; // 1 s at the seams — tighter than the long format's 2 s
const STEM_SECONDS: Record<string, number> = {
  mindscape: 185.7, gifted: 128.4, diablo: 170.5, blackblue: 159.5, eternity: 142.7,
};
const trackOf = (slug: string) => slug.split("-")[0];

/**
 * Tiles a stem across a span, relaying with a crossfade if the span outruns the
 * stem. On this reel no segment does — the longest music window is 50 s and the
 * shortest track is 128 s — so every segment makes a single unlooped pass and
 * the relay branch never fires. It is kept because it is the proven code from
 * the reel build, and because it is what makes a longer window safe.
 */
function tiles(slug: string, span: number, from: number) {
  const stemFrames = Math.floor(STEM_SECONDS[trackOf(slug)] * VIDEO.fps) - 2;
  const start = Math.round(from * VIDEO.fps);
  const first = Math.min(span, stemFrames - start);
  const out = [{ at: 0, len: first, trim: start }];
  let filled = first, guard = 0;
  while (filled < span && guard++ < 6) {
    const relay = Math.round(18 * VIDEO.fps);
    const len = Math.min(span - filled + XFADE, stemFrames - relay);
    out.push({ at: filled - XFADE, len: len + XFADE, trim: relay });
    filled += len;
  }
  return out;
}

/** Bed level — leaves headroom for the separately recorded narration. */
export const BED_TRIM = 0.55;

export const makeMusicBed =
  (plan: readonly MusicSeg[]): React.FC<{ gain?: number }> =>
  ({ gain = BED_TRIM }) => (
    <>
      {plan.map((seg, si) => {
        const start = Math.round(seg.from * VIDEO.fps);
        const span = Math.round((seg.to - seg.from) * VIDEO.fps);
        return (
          <Sequence key={si} from={start} durationInFrames={span} name={`music-${si}-${seg.track}`}>
            {seg.stems.map((s) =>
              tiles(s.slug, span, s.from ?? 0).map((t, i) => (
                <Sequence key={`${s.slug}-${i}`} from={t.at}
                          durationInFrames={Math.min(t.len, span - t.at)}
                          name={`${s.slug}${i ? `-relay${i}` : ""}`}>
                  <Audio src={MUSIC(s.slug)} trimBefore={t.trim}
                         volume={(f) => {
                           const local = t.at + f;
                           const inC = Math.min(1, local / XFADE);
                           const outC = Math.min(1, (span - local) / XFADE);
                           const seam = i > 0 ? Math.min(1, f / XFADE) : 1;
                           const tail = i === 0 && t.len < span ? Math.min(1, (t.len - f) / XFADE) : 1;
                           return s.gain * gain * Math.max(0, Math.min(inC, outC, seam, tail));
                         }} />
                </Sequence>
              ))
            )}
          </Sequence>
        );
      })}
    </>
  );

/**
 * Layer 2 placement. Reel cadence fires far more often than the long format —
 * a transition on every cut plus accents inside each beat — so the palette is
 * rotated deliberately by beat kind and no two adjacent beats reach for the
 * same file. Nothing here is a large cinematic low-frequency whoosh: the whole
 * palette is hardware-derived (detents, relays, RJ45 latches, gPTP pings).
 */
export function accents(beats: Beat[], startsArr: number[], totalFrames: number) {
  const out: { at: number; sfx: string; gain: number }[] = [];
  beats.forEach((b, i) => {
    const start = startsArr[i];
    const len = frames(b.sec);
    out.push({ at: Math.max(0, start - 4), sfx: b.sfx, gain: 0.28 });

    if (b.kind === "specGrid") (b.specs ?? []).forEach((_, k) =>
      out.push({ at: start + 18 + k * 8, sfx: k % 2 ? "counter-tick" : "relay-tick-hi", gain: 0.16 }));
    if (b.kind === "montage") b.images.forEach((_, k) =>
      out.push({ at: start + 10 + k * 4, sfx: k % 2 ? "relay-tick" : "relay-tick-hi", gain: 0.11 }));
    if (b.kind === "ecosystemSplit") [0, 1, 2].forEach((k) =>
      out.push({ at: start + 14 + k * 2, sfx: "avb-ping-top", gain: 0.13 }));
    if (b.kind === "portSweep") for (let k = 0; k < 6; k++)
      out.push({ at: start + 14 + k * Math.round(len * 0.11),
                 sfx: k % 2 ? "encoder-detent-hi" : "encoder-detent-lo", gain: 0.1 });
    if (b.kind === "macroReveal" || b.kind === "hook")
      out.push({ at: start + Math.round(len * 0.35), sfx: "panel-air-soft", gain: 0.17 });
    if (b.kind === "dataFlow") {
      out.push({ at: start + 22, sfx: "data-stream-short", gain: 0.18 });
      out.push({ at: start + Math.round(len * 0.5), sfx: "rj45-snap-soft", gain: 0.2 });
      out.push({ at: start + Math.round(len * 0.72), sfx: "gptp-sync", gain: 0.15 });
    }
    if (b.kind === "badges") (b.labels ?? []).forEach((_, k) =>
      out.push({ at: start + 12 + k * 8, sfx: k ? "avb-ping-hi" : "avb-ping-mid", gain: 0.14 }));
    if (b.kind === "price" || b.kind === "outro") {
      out.push({ at: start + 20, sfx: "avb-ping-mid", gain: 0.16 });
      out.push({ at: start + 34, sfx: "avb-ping-top", gain: 0.14 });
    }
  });
  return out.filter((a) => a.at >= 0 && a.at < totalFrames);
}

export const makeSfxTimeline =
  (list: { at: number; sfx: string; gain: number }[]): React.FC<{ gain?: number }> =>
  ({ gain = 1 }) => (
    <>
      {list.map((a, i) => (
        <Sequence key={i} from={a.at} durationInFrames={54} name={`sfx-${a.sfx}-${a.at}`}>
          <Audio src={SFX(a.sfx)} volume={a.gain * gain} />
        </Sequence>
      ))}
    </>
  );

/**
 * Placeholder narration slot (Section 9). Flip HAS_VOICEOVER to true once
 * public/vo/voiceover-master-reel.mp3 is in place. A compile-time constant
 * rather than a runtime probe: Remotion renders frames across parallel workers,
 * so a fetch-and-setState check would resolve differently per worker and put
 * narration on some frames but not others.
 */
export const makeVoiceover =
  (_reel: number, has: boolean): React.FC =>
  () => (has ? <Audio src={VO()} volume={1} /> : null);
