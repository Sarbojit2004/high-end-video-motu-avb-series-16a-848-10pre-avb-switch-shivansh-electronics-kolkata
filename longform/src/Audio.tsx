import React from "react";
import { Audio, Sequence } from "remotion";
import { MUSIC, SFX, VO } from "./assets";
import { BEATS, BEAT_STARTS, CHAPTER_SPANS, MUSIC_PLAN, TOTAL_FRAMES, frames } from "./schedule";
import { VIDEO } from "./theme";

/**
 * TWO-LAYER AUDIO (Section 10a).
 *
 * Layer 1 — music bed, assembled from the supplied stems per MUSIC_PLAN.
 * Layer 2 — the synthesized transition/foley palette, one hit per beat plus
 *           mid-beat accents.
 *
 * Both layers are driven by the SAME schedule that drives the picture, and are
 * also exported as standalone compositions (MusicBedOnly / SfxTimelineOnly).
 * That is what guarantees the two deliverable WAVs drop straight onto the
 * timeline already in sync — they are not re-timed by hand, they are the same
 * arithmetic.
 */

const XFADE = 60; // 2 s crossfade at chapter seams

// Measured stem lengths (seconds) — see scripts/validate-audio.mjs output.
const STEM_SECONDS: Record<string, number> = {
  mindscape: 185.7,
  gifted: 128.4,
  diablo: 170.5,
  blackblue: 159.5,
  eternity: 142.7,
};

const trackOf = (slug: string) => slug.split("-")[0];

/**
 * Tiles one stem across `span` frames. Only GIFTED (128.4 s) is shorter than
 * the chapter that uses it (150 s), so in practice this produces a single
 * pass everywhere except Ch3, where it lays a second pass in from a musical
 * point 20 s into the stem and crossfades the seam.
 */
function tiles(slug: string, span: number, from: number) {
  const stemFrames = Math.floor(STEM_SECONDS[trackOf(slug)] * VIDEO.fps) - 2;
  const startOffset = Math.round(from * VIDEO.fps);
  const first = Math.min(span, stemFrames - startOffset);
  const out = [{ at: 0, len: first, trim: startOffset }];
  let filled = first;
  let guard = 0;
  while (filled < span && guard++ < 8) {
    const relayTrim = Math.round(20 * VIDEO.fps); // re-enter 20 s in, not at the top
    const len = Math.min(span - filled + XFADE, stemFrames - relayTrim);
    out.push({ at: filled - XFADE, len: len + XFADE, trim: relayTrim });
    filled += len;
  }
  return out;
}

/**
 * Bed level. The stems sum to a peak of about -0.2 dBFS at unity, which leaves
 * no room for the narration that gets recorded separately and laid on top. This
 * trim puts the bed near -22 dBFS RMS / -5 dBFS peak — a documentary bed level
 * that a voice at around -16 dBFS sits cleanly above.
 *
 * It is applied to the DEFAULT, so the standalone MusicBedOnly deliverable and
 * the bed embedded in the MP4 are the same mix at the same level — which is the
 * point of shipping the WAV at all.
 */
const BED_TRIM = 0.55;

export const MusicBed: React.FC<{ gain?: number }> = ({ gain = BED_TRIM }) => (
  <>
    {CHAPTER_SPANS.map((c) => {
      const plan = MUSIC_PLAN.find((p) => p.ch === c.ch);
      if (!plan) return null;
      const span = c.end - c.start;
      return (
        <Sequence key={c.ch} from={c.start} durationInFrames={span} name={`music-ch${c.ch}-${plan.track}`}>
          {plan.stems.map((s) =>
            tiles(s.slug, span, s.from ?? 0).map((t, i) => (
              <Sequence
                key={`${s.slug}-${i}`}
                from={t.at}
                durationInFrames={Math.min(t.len, span - t.at)}
                name={`${s.slug}${i ? `-relay${i}` : ""}`}
              >
                <Audio
                  src={MUSIC(s.slug)}
                  trimBefore={t.trim}
                  volume={(f) => {
                    const local = t.at + f;
                    // chapter-level fade in/out
                    const inC = Math.min(1, local / XFADE);
                    const outC = Math.min(1, (span - local) / XFADE);
                    // seam fade for relay tiles
                    const seam = i > 0 ? Math.min(1, f / XFADE) : 1;
                    const tail = i === 0 && t.len < span ? Math.min(1, (t.len - f) / XFADE) : 1;
                    return (
                      s.gain * gain *
                      Math.max(0, Math.min(inC, outC, seam, tail))
                    );
                  }}
                />
              </Sequence>
            ))
          )}
        </Sequence>
      );
    })}
  </>
);

/** Per-beat accent placement — keeps a 15-minute runtime from going flat. */
const ACCENTS: { at: number; sfx: string; gain: number }[] = (() => {
  const out: { at: number; sfx: string; gain: number }[] = [];
  BEATS.forEach((b, i) => {
    const start = BEAT_STARTS[i];
    const len = frames(b.sec);

    // transition hit, landing just before the cut
    out.push({ at: Math.max(0, start - 5), sfx: b.sfx, gain: 0.26 });

    // layout-specific accents
    if (b.kind === "specGrid" || b.kind === "counters") {
      (b.specs ?? []).forEach((_, k) =>
        out.push({ at: start + Math.round(len * 0.32) + k * 9, sfx: "counter-tick", gain: 0.15 })
      );
    }
    if (b.kind === "montage") {
      b.images.forEach((_, k) =>
        out.push({ at: start + 14 + k * 5, sfx: "relay-tick", gain: 0.1 })
      );
    }
    if (b.kind === "triptych") {
      [0, 1, 2].forEach((k) =>
        out.push({ at: start + 22 + k * 2, sfx: "avb-ping-hi", gain: 0.12 })
      );
    }
    if (b.kind === "portSweep") {
      for (let k = 0; k < 5; k++)
        out.push({ at: start + 18 + k * Math.round(len * 0.12), sfx: "encoder-detent", gain: 0.09 });
    }
    if (b.kind === "macroReveal" || b.kind === "coldOpen") {
      out.push({ at: start + Math.round(len * 0.35), sfx: "panel-air-soft", gain: 0.16 });
    }
    if (b.kind === "topology") {
      out.push({ at: start + 30, sfx: "data-stream", gain: 0.16 });
      out.push({ at: start + Math.round(len * 0.4), sfx: "rj45-snap", gain: 0.2 });
      out.push({ at: start + Math.round(len * 0.55), sfx: "link-establish", gain: 0.18 });
      out.push({ at: start + Math.round(len * 0.78), sfx: "gptp-sync", gain: 0.16 });
    }
    if (b.kind === "dataFlow") {
      out.push({ at: start + Math.round(len * 0.5), sfx: "data-stream", gain: 0.18 });
    }
    if (b.kind === "badges") {
      (b.labels ?? []).forEach((_, k) =>
        out.push({ at: start + 16 + k * 9, sfx: k === 0 ? "avb-ping-lo" : k === 1 ? "avb-ping-mid" : "avb-ping-hi", gain: 0.14 })
      );
    }
    if (b.kind === "price" || b.kind === "outro") {
      out.push({ at: start + 28, sfx: "avb-ping-mid", gain: 0.16 });
      out.push({ at: start + 44, sfx: "avb-ping-hi", gain: 0.14 });
    }
  });
  return out.filter((a) => a.at >= 0 && a.at < TOTAL_FRAMES);
})();

export const SfxTimeline: React.FC<{ gain?: number }> = ({ gain = 1 }) => (
  <>
    {ACCENTS.map((a, i) => (
      <Sequence key={i} from={a.at} durationInFrames={60} name={`sfx-${a.sfx}-${a.at}`}>
        <Audio src={SFX(a.sfx)} volume={a.gain * gain} />
      </Sequence>
    ))}
  </>
);

/**
 * PLACEHOLDER NARRATION SLOT (Section 10).
 *
 * Drop the recorded narration at `public/vo/voiceover-longform.mp3` and flip
 * this to `true`. It is a compile-time constant rather than a runtime existence
 * check on purpose: Remotion renders frames across parallel workers, so a
 * fetch-and-setState probe would decide differently in different workers and
 * produce a master with the narration on some frames and not others.
 *
 * Left `false`, this branch emits nothing and the render is byte-for-byte what
 * it would be without the slot at all.
 */
export const HAS_VOICEOVER = false;

/** Narration, once HAS_VOICEOVER is switched on. */
export const Voiceover: React.FC = () =>
  HAS_VOICEOVER ? <Audio src={VO()} volume={1} /> : null;

/** Everything, as embedded in the delivered MP4. */
export const FullAudio: React.FC = () => (
  <>
    <MusicBed />
    <SfxTimeline />
    <Voiceover />
  </>
);
