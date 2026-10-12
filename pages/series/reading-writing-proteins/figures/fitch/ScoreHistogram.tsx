// How often each window score turns up for α against β, against what the two
// chains' compositions predict by chance.
import { useMemo, useState } from "react";
import { FITCH_1966 } from "../../core/fitch";
import Panel from "../Panel";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import { alphaBeta } from "./data";

const LO = 15;
const MAX = 70;
const TAIL_HI = 40;
const H = 160;
const PAD = { top: 12, bottom: 28, left: 36 };
const TAIL_MAX = 25;

export default function ScoreHistogram() {
  const { mrs, chance } = alphaBeta();
  const [tail, setTail] = useState(false);
  const [ref, avail] = useWidth<HTMLDivElement>();
  const cut = FITCH_1966.cutoff;

  const { observed, expected, total } = useMemo(() => {
    const observed = Array<number>(MAX + 1).fill(0);
    let total = 0;
    for (const row of mrs) for (const v of row) (observed[Math.min(v, MAX)]++, total++);
    return { observed, expected: chance.map((q) => q * total), total };
  }, [mrs, chance]);

  const width = Math.max(280, avail || 600);
  const HI = tail ? TAIL_HI : MAX;
  const bw = (width - PAD.left) / (HI - LO + 1);
  const yMax = tail ? TAIL_MAX : Math.max(...observed, ...expected.slice(LO, HI + 1)) * 1.05;
  const y = (n: number) => PAD.top + H - (Math.min(n, yMax) / yMax) * H;
  const x = (s: number) => PAD.left + (s - LO) * bw;
  const ticks = tail ? [0, 10, 20] : [0, 500, 1000, 1500].filter((t) => t <= yMax);

  const curve = expected
    .slice(LO, HI + 1)
    .map((n, k) => `${k ? "L" : "M"}${(x(LO + k) + bw / 2).toFixed(1)},${y(n).toFixed(1)}`)
    .join(" ");

  const under = observed.slice(0, cut + 1).reduce((a, b) => a + b, 0);
  const underChance = expected.slice(0, cut + 1).reduce((a, b) => a + b, 0);

  return (
    <Panel>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-ui text-sm">
        <span className="text-ink-600">
          {total.toLocaleString("en-US")} windows, by score. Bars are α against β; the line is chance.
        </span>
        <button
          type="button"
          onClick={() => setTail((t) => !t)}
          className="text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink-900"
        >
          {tail ? "Show the whole curve" : "Zoom in on the low scores"}
        </button>
      </div>
      <div ref={ref}>
        <svg
          width={width}
          height={H + PAD.top + PAD.bottom}
          className="block font-ui"
          role="img"
          aria-label="Histogram of window scores against the chance curve"
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width} y1={y(t)} y2={y(t)} stroke={RW.wash} />
              <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize={11} fill={RW.label}>
                {t.toLocaleString("en-US")}
              </text>
            </g>
          ))}
          {observed.slice(LO, HI + 1).map((n, k) => {
            const s = LO + k;
            const top = y(n);
            return (
              <rect
                key={s}
                x={x(s) + 0.5}
                y={top}
                width={Math.max(1, bw - 1)}
                height={PAD.top + H - top}
                fill={s <= cut ? RW.match : RW.rule}
              />
            );
          })}
          <path d={curve} fill="none" stroke={RW.label} strokeWidth={1.5} strokeDasharray="3 2" />
          <line
            x1={x(cut + 1)}
            x2={x(cut + 1)}
            y1={PAD.top - 4}
            y2={PAD.top + H}
            stroke={RW.matchInk}
            strokeWidth={1}
          />
          <text x={x(cut + 1) - 4} y={PAD.top + 6} textAnchor="end" fontSize={11} fill={RW.matchInk}>
            cutoff {cut}
          </text>
          {(tail ? [15, 20, 25, 30, 35, 40] : [20, 30, 40, 50, 60, 70]).map((s) => (
            <text key={s} x={x(s) + bw / 2} y={PAD.top + H + 16} textAnchor="middle" fontSize={11} fill={RW.label}>
              {s}
            </text>
          ))}
        </svg>
      </div>
      <p className="mt-3 font-ui text-sm tabular-nums text-ink-600">
        <span className="font-semibold" style={{ color: RW.matchInk }}>
          {under}
        </span>{" "}
        windows at or under {cut}, where chance predicts about {Math.round(underChance)}.
      </p>
    </Panel>
  );
}
