// Follow the maximum match back out of the filled Fig. 1 array: from each cell,
// step to the cell its value came from.
import { useMemo, useState } from "react";
import { FIG_1, maximumMatch, nwArray, pathToRows, pathways, reach, type Pos } from "../../core/nw1970";
import Panel from "../Panel";
import { RW } from "../palette";
import StaticStrip from "../strip/StaticStrip";
import { useWidth } from "../useWidth";
import ArrayGrid, { type CellLook } from "./ArrayGrid";

const { across, down } = FIG_1;
const has = (cells: Pos[], [i, j]: Pos) => cells.some(([a, b]) => a === i && b === j);

export default function ArrayTrace() {
  const nw = useMemo(() => nwArray(across, down), []);
  const all = useMemo(() => pathways(nw), [nw]);
  const start = maximumMatch(nw).starts[0];
  const [path, setPath] = useState<Pos[]>([start]);
  const [both, setBoth] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [ref, avail] = useWidth<HTMLDivElement>();

  const [ci, cj] = path[path.length - 1];
  const next = nw.from[ci][cj];
  const done = next.length === 0;
  const region = done ? [] : reach(ci, cj, down.length, across.length);
  const need = nw.mat[ci][cj] - nw.own[ci][cj];

  const pick = (p: Pos) => {
    if (done) return;
    if (has(next, p)) {
      setPath([...path, p]);
      setNote(next.length > 1 ? "Two cells tied here. Either one gives a maximum match." : null);
    } else if (has(region, p)) setNote(`That cell holds ${nw.mat[p[0]][p[1]]}. This one needs ${need}.`);
    else setNote("The next step has to be in the shaded row or column.");
  };

  const look = (i: number, j: number): CellLook => {
    const match = nw.own[i][j] === 1;
    const onPath = has(path, [i, j]);
    const isCur = i === ci && j === cj;
    const inRegion = has(region, [i, j]);
    return {
      fill: match ? RW.matchSoft : inRegion ? RW.wash : undefined,
      ink: onPath ? RW.residue : match ? RW.matchInk : RW.label,
      weight: onPath ? 600 : 400,
      ring: isCur && !done ? RW.focus : inRegion ? RW.rule : undefined,
    };
  };

  const rows = done ? pathToRows(nw, path) : null;
  const button = "rounded-md px-2 py-1 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900";

  return (
    <Panel>
      <div ref={ref}>
        <ArrayGrid
          across={across}
          down={down}
          width={Math.min(avail || 480, 18 + across.length * 36)}
          value={(i, j) => nw.mat[i][j]}
          look={look}
          onCell={pick}
          path={path}
          paths={both ? all : []}
          label="The completed Fig. 1 array with the pathway traced so far"
        />
      </div>
      <p className="mt-4 min-h-[3rem] font-ui text-sm leading-6 text-ink-600" aria-live="polite">
        {done ? (
          <>
            The pathway is complete. Its{" "}
            <span className="font-semibold" style={{ color: RW.matchInk }}>
              {nw.mat[start[0]][start[1]]}
            </span>{" "}
            identical pairs are the maximum match.
          </>
        ) : (
          <>
            {note && <span className="text-ink-900">{note} </span>}
            This cell holds {nw.mat[ci][cj]}
            {nw.own[ci][cj] ? ", 1 of it its own" : ""}, so the next cell holds {need}. Find it in the shaded row or
            column.
          </>
        )}
      </p>
      {rows && (
        <div className="mt-2">
          <StaticStrip
            top={rows.top}
            bottom={rows.bottom}
            topLabel="A, across the top"
            bottomLabel="B, down the side"
          />
        </div>
      )}
      <div className="-ml-2 mt-3 flex flex-wrap gap-1 font-ui text-sm">
        {!done && (
          <button type="button" onClick={() => setPath([...path, next[0]])} className={button}>
            Next step
          </button>
        )}
        <button
          type="button"
          onClick={() => (setPath(path.length > 1 ? path.slice(0, -1) : path), setNote(null))}
          className={button}
        >
          Back
        </button>
        <button type="button" onClick={() => (setPath([start]), setNote(null))} className={button}>
          Start over
        </button>
        <button type="button" onClick={() => setBoth((b) => !b)} className={button}>
          {both
            ? "Hide the tied pathways"
            : all.length === 2
              ? "Show both tied pathways"
              : `Show all ${all.length} tied pathways`}
        </button>
      </div>
    </Panel>
  );
}
