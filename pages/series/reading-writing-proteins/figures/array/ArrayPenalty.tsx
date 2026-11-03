// Their Fig. 1 example refilled under a chosen penalty, with the pathway it picks.
import { useMemo, useState } from "react";
import { cn } from "@lib/utils";
import { scoreOf } from "../../core/alignment";
import { FIG_1, fewestGaps, maximumMatch, nwArray, pathToRows, pathways, tied, type Pos } from "../../core/nw1970";
import Panel from "../Panel";
import { RW } from "../palette";
import ScoreLine from "../strip/ScoreLine";
import StaticStrip from "../strip/StaticStrip";
import { useWidth } from "../useWidth";
import ArrayGrid, { type CellLook } from "./ArrayGrid";

const { across, down } = FIG_1;
const PENALTIES = [0, 1, 2, 3];
const has = (cells: Pos[], [i, j]: Pos) => cells.some(([a, b]) => a === i && b === j);

export default function ArrayPenalty() {
  const [penalty, setPenalty] = useState(0);
  const [ref, avail] = useWidth<HTMLDivElement>();
  const { nw, all, path, rows, ties, starts } = useMemo(() => {
    const nw = nwArray(across, down, penalty);
    const path = fewestGaps(nw);
    return {
      nw,
      path,
      all: pathways(nw),
      rows: pathToRows(nw, path),
      ties: tied(nw),
      starts: maximumMatch(nw).starts,
    };
  }, [penalty]);

  const look = (i: number, j: number): CellLook => {
    const match = nw.own[i][j] === 1;
    const onPath = has(path, [i, j]);
    return {
      fill: match ? RW.matchSoft : undefined,
      ink: onPath ? RW.residue : match ? RW.matchInk : RW.label,
      weight: onPath ? 600 : 400,
      ring: has(starts, [i, j]) ? RW.match : undefined,
    };
  };

  const spread = ties.matches[0] !== ties.matches[1];

  return (
    <Panel>
      <div className="mb-4 flex items-center gap-1 font-ui text-sm">
        <span className="mr-2 text-ink-500">Penalty</span>
        {PENALTIES.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={p === penalty}
            onClick={() => setPenalty(p)}
            className={cn(
              "min-w-8 rounded-md px-2 py-1 tabular-nums transition-colors",
              p === penalty ? "bg-ink-100 text-ink-900" : "text-ink-500 hover:bg-ink-100/60"
            )}
          >
            {p}
          </button>
        ))}
      </div>
      <div ref={ref}>
        <ArrayGrid
          across={across}
          down={down}
          width={Math.min(avail || 480, 18 + across.length * 36)}
          value={(i, j) => nw.mat[i][j]}
          look={look}
          path={path}
          paths={all}
          label={`The Fig. 1 array filled with a penalty of ${penalty}`}
        />
      </div>
      <div className="mt-4">
        <ScoreLine score={scoreOf(rows, penalty)} />
      </div>
      <p className="mt-1 min-h-[3rem] font-ui text-sm leading-6 text-ink-600">
        {ties.paths.toString()} pathways tie, the others drawn faintly.
        {spread &&
          ` They run from ${ties.matches[0]} matches and ${ties.gaps[0]} ${ties.gaps[0] === 1 ? "gap" : "gaps"} to ${ties.matches[1]} matches and ${ties.gaps[1]} gaps. This is the one with the fewest gaps.`}
      </p>
      <div className="mt-2">
        <StaticStrip top={rows.top} bottom={rows.bottom} topLabel="A, across the top" bottomLabel="B, down the side" />
      </div>
    </Panel>
  );
}
