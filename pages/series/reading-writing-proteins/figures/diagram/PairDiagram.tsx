// A short pair drawn as a diagram, with the reader filling in the dots or
// laying station 1's best alignment over them as a path.
import { useMemo, useState } from "react";
import { cn } from "@lib/utils";
import { pairsOf } from "../../core/alignment";
import { bestAlignment } from "../../core/best";
import { dots } from "../../core/diagram";
import Panel from "../Panel";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import DotDiagram from "./DotDiagram";

export default function PairDiagram({
  top,
  bottom,
  topLabel,
  bottomLabel,
  penalty,
  byHand = false,
}: {
  top: string;
  bottom: string;
  topLabel: string;
  bottomLabel: string;
  penalty: number;
  byHand?: boolean;
}) {
  const [ref, avail] = useWidth<HTMLDivElement>();
  const all = useMemo(() => dots(top, bottom), [top, bottom]);
  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [miss, setMiss] = useState<[number, number] | null>(null);
  const [hover, setHover] = useState<[number, number] | null>(null);
  const [path, setPath] = useState(false);
  const width = Math.min(avail || 400, 18 + bottom.length * 36);

  const shown = byHand ? all.filter(([i, j]) => found.has(`${i},${j}`)) : all;
  const done = shown.length === all.length;

  const pick = ([i, j]: [number, number]) => {
    if (!byHand) return;
    if (top[i] === bottom[j]) {
      setFound((f) => new Set(f).add(`${i},${j}`));
      setMiss(null);
    } else setMiss([i, j]);
  };

  const steps = useMemo(() => {
    const pairs = pairsOf(bestAlignment(top, bottom, penalty).alignment);
    const jumps = pairs.filter(([i, j], k) => k > 0 && (i - pairs[k - 1][0] !== 1 || j - pairs[k - 1][1] !== 1)).length;
    return { pairs, jumps };
  }, [top, bottom, penalty]);

  const button = "rounded-md px-2 py-1 text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900";

  return (
    <Panel>
      <div className="mb-1 font-ui text-xs text-ink-500">
        {topLabel} down the side, {bottomLabel} along the top
      </div>
      <div ref={ref} className={cn(byHand && !done && "cursor-pointer")}>
        <DotDiagram
          down={top}
          across={bottom}
          width={width}
          letters
          shown={shown}
          hover={hover ?? miss}
          onCell={(c) => setHover(c)}
          onPick={pick}
          label={`${topLabel} against ${bottomLabel}`}
        >
          {(cell, m) => (
            <>
              {miss && (
                <text
                  x={m + cell * (miss[1] + 0.5)}
                  y={m + cell * (miss[0] + 0.5) + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fill={RW.faint}
                  className="font-ui"
                >
                  ×
                </text>
              )}
              {path &&
                steps.pairs.map(([i, j], k) => {
                  const next = steps.pairs[k + 1];
                  const c = (v: number) => m + cell * (v + 0.5);
                  return (
                    <g key={k}>
                      <circle cx={c(j)} cy={c(i)} r={cell * 0.42} fill="none" stroke={RW.structure} strokeWidth={1.5} />
                      {next && (
                        <line
                          x1={c(j)}
                          y1={c(i)}
                          x2={c(next[1])}
                          y2={c(next[0])}
                          stroke={next[0] - i === 1 && next[1] - j === 1 ? RW.structure : RW.gap}
                          strokeWidth={2}
                          strokeDasharray={next[0] - i === 1 && next[1] - j === 1 ? undefined : "4 3"}
                          strokeLinecap="round"
                        />
                      )}
                    </g>
                  );
                })}
            </>
          )}
        </DotDiagram>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-ui">
        <p className="tabular-nums text-ink-600" aria-live="polite">
          {byHand ? (
            <>
              <span className="font-semibold" style={{ color: shown.length ? RW.matchInk : undefined }}>
                {shown.length}
              </span>{" "}
              of {all.length} matches found
            </>
          ) : (
            <>
              <span className="font-semibold" style={{ color: RW.matchInk }}>
                {all.length}
              </span>{" "}
              dots
            </>
          )}
        </p>
        <div className="-mr-2 flex gap-1 text-sm">
          {byHand && (
            <>
              <button
                type="button"
                onClick={() => setFound(new Set(all.map(([i, j]) => `${i},${j}`)))}
                className={button}
              >
                Fill in the rest
              </button>
              <button type="button" onClick={() => (setFound(new Set()), setMiss(null))} className={button}>
                Clear
              </button>
            </>
          )}
          <button type="button" onClick={() => setPath((p) => !p)} className={button}>
            {path ? "Hide the alignment" : "Show station 1's best alignment"}
          </button>
        </div>
      </div>
      <p className="mt-2 min-h-[1.5rem] font-ui text-sm text-ink-500">
        {path
          ? `Paired residues are circled. Solid steps run down a diagonal; ${
              steps.jumps
                ? "a dashed step is a gap, where the path jumps to another diagonal."
                : "this alignment has no gap."
            }`
          : byHand && !done
            ? "Click every square where the letter on the left matches the letter on top."
            : null}
      </p>
    </Panel>
  );
}
