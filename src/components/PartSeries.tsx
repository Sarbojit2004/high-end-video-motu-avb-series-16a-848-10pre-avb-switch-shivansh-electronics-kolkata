import React from "react";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { flip } from "@remotion/transitions/flip";
import type { TransitionPresentation } from "@remotion/transitions";

export type TransitionSpec = { dur: number; make: (w: number, h: number) => { presentation: TransitionPresentation<any>; timing: any } };

/**
 * TransitionSeries overlaps adjacent sequences, so a naive series whose
 * durations sum to N renders N − Σtransitions frames. Each sequence therefore
 * gets half of each adjacent transition added back:
 *
 *   render_i = scheduled_i + t_before/2 + t_after/2
 *
 * which makes Σrender − Σt === Σscheduled exactly, and puts the midpoint of
 * every transition on its scheduled scene boundary — so the SFX timeline,
 * which is authored against the scheduled boundaries, stays in sync.
 */
export const buildDurations = (scheduled: number[], transitions: TransitionSpec[]): number[] =>
  scheduled.map((dur, i) => {
    const before = i > 0 ? transitions[i - 1].dur : 0;
    const after = i < transitions.length ? transitions[i].dur : 0;
    return dur + before / 2 + after / 2;
  });

export const totalOf = (scheduled: number[], transitions: TransitionSpec[]) => {
  const rendered = buildDurations(scheduled, transitions);
  return rendered.reduce((a, b) => a + b, 0) - transitions.reduce((a, t) => a + t.dur, 0);
};

export const PartSeries: React.FC<{
  scenes: React.ReactNode[];
  scheduled: number[];
  transitions: TransitionSpec[];
  width: number;
  height: number;
}> = ({ scenes, scheduled, transitions, width, height }) => {
  const dur = buildDurations(scheduled, transitions);
  return (
    <TransitionSeries>
      {scenes.flatMap((node, i) => {
        const items: React.ReactNode[] = [
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={Math.round(dur[i])}>
            {node}
          </TransitionSeries.Sequence>,
        ];
        if (i < transitions.length) {
          const t = transitions[i].make(width, height);
          items.push(
            <TransitionSeries.Transition key={`t${i}`} presentation={t.presentation} timing={t.timing} />
          );
        }
        return items;
      })}
    </TransitionSeries>
  );
};

// ── Transition vocabulary — varied across the ~534s series ───────────────────
const lin = (d: number) => linearTiming({ durationInFrames: d });
const spr = (d: number) => springTiming({ config: { damping: 200 }, durationInFrames: d });

export const TX = {
  fadeQuick: { dur: 14, make: () => ({ presentation: fade(), timing: lin(14) }) },
  fadeSoft: { dur: 22, make: () => ({ presentation: fade(), timing: lin(22) }) },
  slideUp: { dur: 26, make: () => ({ presentation: slide({ direction: "from-bottom" }), timing: spr(26) }) },
  slideDown: { dur: 26, make: () => ({ presentation: slide({ direction: "from-top" }), timing: spr(26) }) },
  slideLeft: { dur: 24, make: () => ({ presentation: slide({ direction: "from-right" }), timing: spr(24) }) },
  slideRight: { dur: 24, make: () => ({ presentation: slide({ direction: "from-left" }), timing: spr(24) }) },
  wipeUp: { dur: 20, make: () => ({ presentation: wipe({ direction: "from-bottom" }), timing: lin(20) }) },
  wipeLeft: { dur: 20, make: () => ({ presentation: wipe({ direction: "from-left" }), timing: lin(20) }) },
  wipeRight: { dur: 20, make: () => ({ presentation: wipe({ direction: "from-right" }), timing: lin(20) }) },
  wipeDiag: { dur: 24, make: () => ({ presentation: wipe({ direction: "from-top-left" }), timing: lin(24) }) },
  clock: { dur: 26, make: (w: number, h: number) => ({ presentation: clockWipe({ width: w, height: h }), timing: lin(26) }) },
  flipLeft: { dur: 24, make: () => ({ presentation: flip({ direction: "from-left" }), timing: spr(24) }) },
  flipTop: { dur: 24, make: () => ({ presentation: flip({ direction: "from-top" }), timing: spr(24) }) },
} satisfies Record<string, TransitionSpec>;
