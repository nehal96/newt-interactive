import { useState } from "react";
import { cn } from "../../../../lib/utils";
import { CHART, ChartFrame, curvePath, OXYGEN, PLOT, px, py, saturation } from "./chart";

// The saturation curve drawn as a population average: the S-curve up top, and a
// single row of hemoglobin molecules beneath it. Drag the oxygen pressure and
// the crowd fills — each molecule is a 2×2 of four O₂ seats (the four hemes from
// the T↔R figure). Because binding is cooperative, molecules tip nearly all-or-
// nothing between empty (T) and full (R); the smooth curve is just the average
// fraction of filled seats over the whole crowd. Pure SVG + a little state, so it
// renders the resting state on the server and updates only on the reader's input.
// Model, plot geometry and axes come from the shared ./chart primitives.

// ---- population row ----------------------------------------------------------
const N = 12; // molecules in the crowd
const SEATS = 4; // O₂ seats per molecule (the four hemes)
const WIDTH = 0.12; // how sharply a molecule tips empty→full (a couple caught mid-flip)
// A fixed scattered tip-order (a permutation of 0…N-1) so the crowd fills like a
// real sample rather than a left-to-right sweep — identical on server and client.
const ORDER = [5, 0, 8, 3, 11, 6, 1, 9, 4, 10, 2, 7];
const MOL_W = 30; // per-molecule horizontal cell
const POP_Y = 222; // top of the population row
const POP_START = PLOT.X0 + ((PLOT.X1 - PLOT.X0) - N * MOL_W) / 2;
const SEAT_XY = [
  [6, 6],
  [18, 6],
  [6, 18],
  [18, 18],
] as const;

const CURVE_D = curvePath();

const PRESETS = [
  { p: 20, label: "working muscle" },
  { p: 40, label: "resting tissue" },
  { p: 95, label: "lungs" },
];
const THUMB = 16; // approx native range-thumb width, to align each preset tick under its value

const filledSeatsAt = (f: number) =>
  ORDER.map((rank) => {
    const threshold = (rank + 0.5) / N;
    const frac = Math.max(0, Math.min(1, (f - threshold) / WIDTH + 0.5));
    return Math.round(frac * SEATS);
  });

export default function SaturationPopulationFigure({ className }: { className?: string }) {
  const [po2, setPo2] = useState(40);
  const f = saturation(po2);
  const pct = Math.round(f * 100);
  const regime =
    f < 0.25 ? "mostly empty, tense (T)" : f > 0.75 ? "mostly full, relaxed (R)" : "tipping, T → R";
  const mx = px(po2);
  const my = py(f);
  const seats = filledSeatsAt(f);

  return (
    <figure className={cn("my-8 w-full scroll-mt-24 lg:my-12", className)}>
      <div className="mx-auto w-full max-w-xl">
        <div className="w-full rounded-lg bg-white px-0 py-3 sm:px-3">
          <svg
            viewBox="0 0 440 256"
            className="block h-auto w-full"
            role="img"
            aria-labelledby="satpop-title satpop-desc"
            fontFamily="inherit"
          >
            <title id="satpop-title">Oxygen saturation as a population average</title>
            <desc id="satpop-desc">
              An S-shaped curve of oxygen saturation versus oxygen pressure, with a
              movable marker, above a row of hemoglobin molecules whose four oxygen
              seats fill as pressure rises. The curve height equals the fraction of
              filled seats across the crowd.
            </desc>

            <ChartFrame />

            {/* the curve */}
            <path d={CURVE_D} fill="none" stroke={CHART.curve} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* current-pressure marker */}
            <line x1={mx} y1={PLOT.YB} x2={mx} y2={my} stroke={CHART.axis} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={PLOT.X0} y1={my} x2={mx} y2={my} stroke={CHART.axis} strokeWidth={1} strokeDasharray="3 3" />
            <circle cx={mx} cy={my} r={5} fill={OXYGEN} stroke="#fff" strokeWidth={1.5} />

            {/* the crowd: one molecule per cell, four seats each */}
            {seats.map((filled, i) => (
              <g key={`mol-${i}`} transform={`translate(${POP_START + i * MOL_W} ${POP_Y})`}>
                <rect x={0} y={0} width={24} height={24} rx={5} fill={CHART.molBg} />
                {SEAT_XY.map(([cx, cy], s) => (
                  <circle
                    key={s}
                    cx={cx}
                    cy={cy}
                    r={4.4}
                    fill={s < filled ? OXYGEN : "#fff"}
                    stroke={s < filled ? OXYGEN : CHART.empty}
                    strokeWidth={1.5}
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>

        {/* current pressure — left-aligned with a fixed-width number so the readout
            never reflows the slider (the old right-aligned value did) */}
        <div className="mt-4 text-sm text-slate-600">
          <span className="text-slate-400">pO₂</span>{" "}
          <span className="inline-block min-w-[3ch] font-medium tabular-nums text-slate-800">{po2}</span>{" "}
          <span className="text-slate-400">mmHg</span>
        </div>

        {/* pressure slider — full width, so its right end is always 100 mmHg */}
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={po2}
          onChange={(e) => setPo2(e.target.valueAsNumber)}
          aria-label="Oxygen partial pressure in mmHg"
          className="mt-2 w-full cursor-pointer accent-[#E2533C]"
        />

        {/* tissue presets, pointed under their pressure on the track; clicking moves the slider.
            The 20/40 mmHg labels sit close together, so they wrap to two lines on narrow
            screens (taller row) and relax to a single line from sm: up where there's room. */}
        <div className="relative mt-1 h-12 sm:h-9">
          {PRESETS.map((preset) => (
            <button
              key={preset.p}
              type="button"
              onClick={() => setPo2(preset.p)}
              aria-pressed={po2 === preset.p}
              style={{ left: `calc(${preset.p}% + ${((0.5 - preset.p / 100) * THUMB).toFixed(1)}px)` }}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
            >
              <span className="h-1.5 w-px bg-slate-300" />
              <span
                className={cn(
                  "mt-1 block max-w-[3.5rem] text-center text-xs leading-tight transition-colors sm:max-w-none sm:whitespace-nowrap",
                  po2 === preset.p ? "font-medium text-slate-800" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {preset.label}
              </span>
            </button>
          ))}
        </div>

        <figcaption className="mt-3 text-center text-sm text-slate-500">
          {pct}% of the seats are filled — {regime}.
        </figcaption>
      </div>
    </figure>
  );
}
