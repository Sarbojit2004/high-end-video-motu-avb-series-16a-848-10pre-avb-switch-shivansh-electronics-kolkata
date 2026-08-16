import React from "react";
import { Audio, Sequence } from "remotion";
import { MUSIC, SFX, VO } from "../assets";
import { VIDEO } from "../theme";
import { BEATS, BEAT_STARTS, MUSIC_PLAN, TOTAL_FRAMES, frames } from "./schedule";

/**
 * REEL 1 — two-layer audio, driven by the same schedule that drives the
 * picture, and also exported as two standalone compositions. That shared
 * arithmetic is what makes the delivered WAVs drop onto the timeline already in
 * sync — they are not hand-placed.
 */

const XFADE = 30; // 1 s at the seams — tighter than the long format's 2 s
const STEM_SECONDS: Record<string, number> = {
  mindscape: 185.7, gifted: 128.4, diablo: 170.5, blackblue: 159.5, eternity: 142.7,
};
const trackOf = (slug: string) => slug.split("-")[0];

/**
 * Tiles a stem across a span. GIFTED is 128.4 s and Reel 1's body window is
 * 145 s, so it lays one full pass and then re-enters 18 s in with a crossfade —
 * a musical point, not the top of the track.
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
const BED_TRIM = 0.55;

export const MusicBed: React.FC<{ gain?: number }> = ({ gain = BED_TRIM }) => (
  <>
    {MUSIC_PLAN.map((seg, si) => {
      const start = Math.round(seg.from * VIDEO.fps);
      const span = Math.round((seg.to - seg.from) * VIDEO.fps);
      return (
        <Sequence key={si} from={start} durationInFrames={span} name={`music-${si}-${seg.track}`}>
          {seg.stems.map((s) =>
            tiles(s.slug, span, (s as { from?: number }).from ?? 0).map((t, i) => (
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
 * a transition on every one of the 22 cuts plus accents inside each beat — so
 * the palette is rotated deliberately and no two adjacent beats reach for the
 * same file.
 */
const ACCENTS: { at: number; sfx: string; gain: number }[] = (() => {
  const out: { at: number; sfx: string; gain: number }[] = [];
  BEATS.forEach((b, i) => {
    const start = BEAT_STARTS[i];
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
  return out.filter((a) => a.at >= 0 && a.at < TOTAL_FRAMES);
})();

export const SfxTimeline: React.FC<{ gain?: number }> = ({ gain = 1 }) => (
  <>
    {ACCENTS.map((a, i) => (
      <Sequence key={i} from={a.at} durationInFrames={54} name={`sfx-${a.sfx}-${a.at}`}>
        <Audio src={SFX(a.sfx)} volume={a.gain * gain} />
      </Sequence>
    ))}
  </>
);

/**
 * Placeholder narration slot (Section 10). Flip to true once
 * public/vo/voiceover-reel1.mp3 is in place. A compile-time constant rather
 * than a runtime probe: Remotion renders frames across parallel workers, so a
 * fetch-and-setState check would resolve differently per worker and put
 * narration on some frames but not others.
 */
export const HAS_VOICEOVER = false;
export const Voiceover: React.FC = () =>
  HAS_VOICEOVER ? <Audio src={VO(1)} volume={1} /> : null;

export const FullAudio: React.FC = () => (
  <>
    <MusicBed />
    <SfxTimeline />
    <Voiceover />
  </>
);
