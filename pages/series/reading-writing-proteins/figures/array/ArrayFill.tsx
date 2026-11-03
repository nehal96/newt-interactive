// Fill Needleman and Wunsch's Fig. 1 array by hand: for the outlined cell, pick
// the largest value in the row and column beyond it, less any penalty.
import { useMemo, useState } from "react";
import { FIG_1, fillOrder, maximumMatch, nwArray, reach, stepValue, type Pos } from "../../core/nw1970";
import Panel from "../Panel";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import ArrayGrid, { type CellLook } from "./ArrayGrid";

const { across, down } = FIG_1;
const ROWS = down.length;
const COLS = across.length;
const ORDER = fillOrder(ROWS, COLS);
const has = (cells: Pos[], [i, j]: Pos) => cells.some(([a, b]) => a === i && b === j);

// Skips cells with nothing beyond them; they keep their own value.
const settle = (k: number) => {
  while (k < ORDER.length && !reach(ORDER[k][0], ORDER[k][1], ROWS, COLS).length) k++;
  return k;
};
const START = settle(0);
const FIG_1_AT = ORDER.findIndex(([i, j]) => i === 5 && j === 5);

const name = ([i, j]: Pos) => `row ${down[i]}, column ${across[j]}`;

export default function ArrayFill({ penalty = 0 }: { penalty?: number }) {
  const nw = useMemo(() => nwArray(across, down, penalty), [penalty]);
  const [done, setDone] = useState(START);
  const [note, setNote] = useState<string | null>(null);
  const [hover, setHover] = useState<Pos | null>(null);
  const [ref, avail] = useWidth<HTMLDivElement>();

  const finished = done >= ORDER.length;
  const cur = finished ? null : ORDER[done];
  const region = cur ? reach(cur[0], cur[1], ROWS, COLS) : [];
  const worth = (p: Pos) => stepValue(nw.mat, cur!, p, penalty);
  const best = cur ? Math.max(...region.map(worth)) : 0;
  const filled = (i: number, j: number) => ORDER.findIndex(([a, b]) => a === i && b === j) < done;
  const isDiagonal = (i: number, j: number) => !!cur && i === cur[0] + 1 && j === cur[1] + 1;
  const { value: max } = maximumMatch(nw);

  const step = (to: number, msg: string | null) => {
    setDone(settle(to));
    setNote(msg);
  };

  const pick = (p: Pos) => {
    if (!cur) return;
    if (!has(region, p)) {
      setNote("Pick from the shaded row and column.");
      return;
    }
    const v = worth(p);
    if (v < best) {
      setNote(`That's ${v}. There's a larger value in the shaded cells.`);
      return;
    }
    const own = nw.own[cur[0]][cur[1]];
    const sum = penalty && !isDiagonal(p[0], p[1]) ? `${own} + (${v + penalty} − ${penalty})` : `${own} + ${v}`;
    step(done + 1, `Row ${name(cur).slice(4)}: ${sum} = ${own + v}.`);
  };

  const rowEnd = () => {
    if (!cur) return done;
    let k = done;
    while (k < ORDER.length && ORDER[k][0] === cur[0]) k++;
    return k;
  };

  const look = (i: number, j: number): CellLook => {
    const match = nw.own[i][j] === 1;
    const isCur = cur && cur[0] === i && cur[1] === j;
    const inRegion = has(region, [i, j]);
    const charged = penalty > 0 && inRegion && !isDiagonal(i, j);
    const isHover = hover && hover[0] === i && hover[1] === j && inRegion;
    const isMax = finished && i === 0 && j === 0;
    return {
      fill: match ? RW.matchSoft : inRegion ? RW.wash : undefined,
      ink: charged ? RW.gap : match ? RW.matchInk : filled(i, j) ? RW.residue : RW.faint,
      weight: isCur || isMax ? 600 : 400,
      ring: isCur
        ? RW.focus
        : isMax
          ? RW.match
          : isHover
            ? RW.label
            : penalty > 0 && isDiagonal(i, j)
              ? RW.structure
              : inRegion
                ? RW.rule
                : undefined,
    };
  };

  const value = (i: number, j: number) => {
    if (has(region, [i, j])) return worth([i, j]);
    return filled(i, j) ? nw.mat[i][j] : nw.own[i][j] === 1 ? 1 : cur && cur[0] === i && cur[1] === j ? 0 : null;
  };

  const button = "rounded-md px-2 py-1 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900";

  return (
    <Panel>
      <div ref={ref}>
        <ArrayGrid
          across={across}
          down={down}
          width={Math.min(avail || 480, 18 + COLS * 36)}
          value={value}
          look={look}
          onCell={pick}
          onHover={setHover}
          label={`Needleman and Wunsch's Fig. 1 array, partly filled${penalty ? `, with a penalty of ${penalty}` : ""}`}
        />
      </div>
      <p className="mt-4 min-h-[3rem] font-ui text-sm leading-6 text-ink-600" aria-live="polite">
        {finished ? (
          <>
            <span className="font-semibold" style={{ color: RW.matchInk }}>
              {max}
            </span>{" "}
            in the corner: the largest number in the first row or column is the maximum match.
          </>
        ) : (
          <>
            {note && <span className="text-ink-900">{note} </span>}
            Now the cell at {name(cur!)}, outlined in red.{" "}
            {penalty > 0 && (
              <>
                The amber numbers already have the penalty taken off. The blue outline is the diagonal step, which
                costs nothing.{" "}
              </>
            )}
            Click the largest value in the shaded row and column.
          </>
        )}
      </p>
      <div className="-ml-2 mt-2 flex flex-wrap gap-1 font-ui text-sm">
        {!finished && (
          <>
            <button
              type="button"
              onClick={() => step(done + 1, `Row ${name(cur!).slice(4)}: done for you.`)}
              className={button}
            >
              Do this cell
            </button>
            <button type="button" onClick={() => step(rowEnd(), null)} className={button}>
              Finish the row
            </button>
            <button type="button" onClick={() => step(ORDER.length, null)} className={button}>
              Fill the rest
            </button>
          </>
        )}
        <button type="button" onClick={() => step(FIG_1_AT, null)} className={button}>
          {penalty ? "Jump to R against R" : "Jump to Fig. 1"}
        </button>
        <button type="button" onClick={() => step(START, null)} className={button}>
          Start over
        </button>
      </div>
    </Panel>
  );
}
