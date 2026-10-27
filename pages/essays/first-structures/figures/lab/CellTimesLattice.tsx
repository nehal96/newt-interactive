// What one cell sends to each point of the film, times how well the cells line up there, is what the film records.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { Labels } from "../scene";
import { ATOMS, cellHeight, lineUp } from "./cell";

const COUNTS = [1, 2, 5, 20, 200];
const S0 = 0.2;
const S1 = 6.4;
const SAMPLES = 1600;

export function CellTimesLattice() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [n, setN] = useState(20);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const chartH = narrow ? 56 : 70;
  const gap = 34;
  const x0 = 4;
  const w = W - 8;
  const X = (s: number) => x0 + ((s - S0) / (S1 - S0)) * w;
  const base = (k: number) => 22 + k * (chartH + gap) + chartH;
  const filmY = base(2) + gap - 6;
  const H = filmY + 46;

  const cell = (s: number) => cellHeight(s, ATOMS) ** 2 / 9;
  const charts = [cell, (s: number) => lineUp(s, n), (s: number) => cell(s) * lineUp(s, n)];
  const fills = [XR.label, XR.first, XR.sum];
  const titles = [
    "1. what one cell sends to each point",
    "2. how well the cells line up there",
    "3. 1 × 2: what the film records",
  ];

  const area = (f: (s: number) => number, b: number) => {
    let d = `M${X(S0).toFixed(1)} ${b}`;
    for (let i = 0; i <= SAMPLES; i++) {
      const s = S0 + ((S1 - S0) * i) / SAMPLES;
      d += `L${X(s).toFixed(1)} ${(b - f(s) * chartH).toFixed(1)}`;
    }
    return `${d}L${X(S1).toFixed(1)} ${b}Z`;
  };

  const stops = [];
  for (let i = 0; i <= 400; i++) {
    const s = S0 + ((S1 - S0) * i) / 400;
    stops.push({ offset: i / 400, o: Math.min(0.92, 0.95 * charts[2](s)) });
  }

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>Cells in a row</span>
        <Tabs value={String(n)} onValueChange={(v) => setN(Number(v))}>
          <TabsList className="h-8 bg-ink-200/60 p-0.5">
            {COUNTS.map((c) => (
              <TabsTrigger
                key={c}
                value={String(c)}
                className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
              >
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>The film shows the molecule's own pattern, seen only where the cells line up</title>
        <desc id={`${ids}d`}>
          Three charts across the film. The first, what one cell sends to each point, rises and falls smoothly. The
          second, how well {n} cells line up, {n === 1 ? "is flat" : "peaks at the spot positions"}. Their product, the
          film, {n === 1 ? "is the smooth pattern itself" : "is a row of spots whose darknesses follow the first chart"}.
        </desc>
        <defs>
          <linearGradient id={`${ids}g`} x1={0} x2={1} y1={0} y2={0}>
            {stops.map(({ offset, o }) => (
              <stop key={offset} offset={offset} stopColor={XR.sum} stopOpacity={o} />
            ))}
          </linearGradient>
        </defs>

        <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="2 4">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <line key={k} x1={X(k)} x2={X(k)} y1={base(0) - chartH} y2={filmY + 22} />
          ))}
        </g>

        {charts.map((f, k) => (
          <g key={k}>
            <line x1={x0} x2={x0 + w} y1={base(k)} y2={base(k)} stroke={XR.rule} />
            <path d={area(f, base(k))} fill={fills[k]} fillOpacity={0.22} stroke={fills[k]} strokeWidth={1.25} strokeLinejoin="round" />
          </g>
        ))}
        <g fill={XR.accent}>
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <circle key={k} cx={X(k)} cy={base(0) - cell(k) * chartH} r={3} />
          ))}
        </g>

        <rect x={x0} y={filmY} width={w} height={22} fill={XR.film} />
        <rect x={x0} y={filmY} width={w} height={22} fill={`url(#${ids}g)`} />
        <rect x={x0} y={filmY} width={w} height={22} fill="none" stroke={XR.atom} strokeWidth={0.75} />

        <Labels size={text}>
          {titles.map((t, k) => (
            <text key={t} x={x0} y={base(k) - chartH - 8} fill={k === 2 ? XR.sum : XR.label}>
              {t}
            </text>
          ))}
          <text x={x0} y={filmY + 38}>the film, from near the centre</text>
          <text x={x0 + w} y={filmY + 38} textAnchor="end">to the edge</text>
        </Labels>
      </svg>
    </div>
  );
}
