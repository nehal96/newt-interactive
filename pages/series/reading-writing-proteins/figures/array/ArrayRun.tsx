// The 1970 array run on a real pair: fill it, read the maximum match, and step
// through the tied pathways that reach it.
import { useEffect, useMemo, useRef, useState } from "react";
import { fillOrder, maximumMatch, nwArray, pathToRows, pathways, type Pos } from "../../core/nw1970";
import Panel from "../Panel";
import { RW } from "../palette";
import StaticStrip from "../strip/StaticStrip";
import { useWidth } from "../useWidth";
import ArrayGrid, { type CellLook } from "./ArrayGrid";

const FILL_MS = 1600;
const has = (cells: Pos[], [i, j]: Pos) => cells.some(([a, b]) => a === i && b === j);

export default function ArrayRun({
  across,
  down,
  acrossLabel,
  downLabel,
}: {
  across: string;
  down: string;
  acrossLabel: string;
  downLabel: string;
}) {
  const nw = useMemo(() => nwArray(across, down), [across, down]);
  const order = useMemo(() => fillOrder(down.length, across.length), [across, down]);
  const rank = useMemo(() => {
    const r = down.split("").map(() => Array<number>(across.length).fill(0));
    order.forEach(([i, j], k) => (r[i][j] = k));
    return r;
  }, [order, across, down]);
  const all = useMemo(() => pathways(nw, 500), [nw]);
  const { value: max } = maximumMatch(nw);
  const [shown, setShown] = useState(0);
  const [which, setWhich] = useState(0);
  const [ref, avail] = useWidth<HTMLDivElement>();
  const timer = useRef<number | null>(null);

  const done = shown >= order.length;
  const path = done ? all[which] : [];
  const rows = done ? pathToRows(nw, path) : null;

  useEffect(() => () => void (timer.current && cancelAnimationFrame(timer.current)), []);

  const fill = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(order.length);
      return;
    }
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(order.length, Math.ceil(((t - t0) / FILL_MS) * order.length));
      setShown(k);
      if (k < order.length) timer.current = requestAnimationFrame(tick);
    };
    timer.current = requestAnimationFrame(tick);
  };

  const look = (i: number, j: number): CellLook => {
    const match = nw.own[i][j] === 1;
    const onPath = has(path, [i, j]);
    return {
      fill: match ? RW.matchSoft : undefined,
      ink: onPath ? RW.residue : match ? RW.matchInk : RW.label,
      weight: onPath ? 600 : 400,
      ring: done && path.length && i === path[0][0] && j === path[0][1] ? RW.match : undefined,
    };
  };

  const button = "rounded-md px-2 py-1 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900";

  return (
    <Panel>
      <div ref={ref}>
        <ArrayGrid
          across={across}
          down={down}
          width={Math.min(avail || 600, 18 + across.length * 30)}
          value={(i, j) => (rank[i][j] < shown ? nw.mat[i][j] : nw.own[i][j] ? 1 : null)}
          look={look}
          path={path}
          label={`The 1970 array for ${downLabel} against ${acrossLabel}`}
        />
      </div>
      <p className="mt-4 font-ui text-sm leading-6 text-ink-600" aria-live="polite">
        {done ? (
          <>
            Maximum match{" "}
            <span className="font-semibold" style={{ color: RW.matchInk }}>
              {max}
            </span>
            , reached by {all.length >= 500 ? "at least 500" : all.length} tied pathways. This is pathway {which + 1}.
          </>
        ) : (
          <>
            {down.length} × {across.length} = {down.length * across.length} cells, filled from the bottom right.
          </>
        )}
      </p>
      {rows && (
        <div className="mt-3">
          <StaticStrip
            top={rows.top}
            bottom={rows.bottom}
            topLabel={acrossLabel}
            bottomLabel={downLabel}
            maxCell={24}
          />
        </div>
      )}
      <div className="-ml-2 mt-3 flex flex-wrap gap-1 font-ui text-sm">
        {!done && shown === 0 && (
          <button type="button" onClick={fill} className={button}>
            Fill the array
          </button>
        )}
        {done && all.length > 1 && (
          <button type="button" onClick={() => setWhich((w) => (w + 1) % all.length)} className={button}>
            Another tied pathway
          </button>
        )}
        {done && (
          <button type="button" onClick={() => (setShown(0), setWhich(0))} className={button}>
            Empty it
          </button>
        )}
      </div>
    </Panel>
  );
}
