// β-hemoglobin against myoglobin as a diagram, against shuffles of β, with the
// diagonal totals raw or summed over five adjacent diagonals.
import { useMemo, useState } from "react";
import { cn } from "@lib/utils";
import { diagonals, dots, matchChance } from "../../core/diagram";
import { BETA, MYOGLOBIN } from "../../core/sequences";
import { shuffle } from "../../core/shuffle";
import Panel from "../Panel";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import DiagonalProfile from "./DiagonalProfile";
import DotDiagram from "./DotDiagram";

const SPAN = 5;

export default function GlobinDiagram() {
  const [seed, setSeed] = useState(0);
  const [smooth, setSmooth] = useState(true);
  const [focus, setFocus] = useState<number | null>(null);
  const [ref, avail] = useWidth<HTMLDivElement>();
  const down = useMemo(() => (seed ? shuffle(BETA.seq, seed) : BETA.seq), [seed]);
  const across = MYOGLOBIN.seq;
  const diags = useMemo(() => diagonals(down, across), [down, across]);
  const p = matchChance(down, across);
  const count = useMemo(() => dots(down, across).length, [down, across]);
  const real = seed === 0;
  const button = (on: boolean) =>
    cn("rounded-md px-2.5 py-1 transition-colors", on ? "bg-ink-100 text-ink-900" : "text-ink-500 hover:text-ink-900");
  const yMax = smooth ? 90 : 32;

  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-center gap-1 font-ui text-sm">
        <button type="button" onClick={() => setSeed(0)} className={button(real)}>
          Real β
        </button>
        <button type="button" onClick={() => setSeed((s) => s + 1)} className={button(!real)}>
          {real ? "Shuffle β" : `Shuffle again (${seed})`}
        </button>
        <span className="ml-auto tabular-nums text-ink-500">
          <span className="font-semibold" style={{ color: RW.matchInk }}>
            {count.toLocaleString("en-US")}
          </span>{" "}
          dots
        </span>
      </div>
      <div ref={ref} className="mx-auto" style={{ maxWidth: 420 }}>
        <div className="mb-1 font-ui text-xs text-ink-500">
          {real ? "β-hemoglobin" : "shuffled β-hemoglobin"} down the side, myoglobin along the top
        </div>
        <DotDiagram
          down={down}
          across={across}
          width={Math.min(420, avail || 420)}
          diagonal={focus}
          band={smooth ? Math.floor(SPAN / 2) : 0}
          label={`${real ? "β-hemoglobin" : "A shuffle of β-hemoglobin"} against sperm whale myoglobin`}
        />
      </div>

      <div className="mt-5 border-t border-ink-100 pt-5 font-ui text-sm">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-ink-900">
            {smooth ? `Running sums of ${SPAN} adjacent diagonals` : "Matches on each diagonal"}
          </span>
          <button
            type="button"
            onClick={() => setSmooth((s) => !s)}
            className="text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink-900"
          >
            {smooth ? "Show raw totals" : `Sum ${SPAN} adjacent diagonals`}
          </button>
        </div>
        <DiagonalProfile
          diagonals={diags}
          chance={p}
          width={smooth ? SPAN : 1}
          focus={focus}
          onFocus={setFocus}
          yMax={yMax}
        />
        <p className="mt-1 text-xs text-ink-500">
          The dashed line is chance. Point at the profile to find a diagonal in the diagram.
        </p>
      </div>
    </Panel>
  );
}
