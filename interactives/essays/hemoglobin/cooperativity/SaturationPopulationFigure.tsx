import { useState } from "react";
import { cn } from "../../../../lib/utils";
import { COLORS } from "../quaternary/TRSwitchFigure";

// The saturation curve drawn as a population average: the S-curve up top, and a
// single row of hemoglobin molecules beneath it. Drag the oxygen pressure and
// the crowd fills — each molecule is a 2×2 of four O₂ seats (the four hemes from
// the T↔R figure). Because binding is cooperative, molecules tip nearly all-or-
// nothing between empty (T) and full (R); the smooth curve is just the average
// fraction of filled seats over the whole crowd. Pure SVG + a little state, so it
// renders the resting state on the server and updates only on the reader's input.

// ---- model ------------------------------------------------------------------
// Hill equation, saturation as a fraction 0–1. P50 ≈ 26 mmHg (2,3-BPG sets it)
// and n ≈ 2.9 reproduce the essay's anchor numbers (20→32%, 40→76%, 95→98%).
const P50 = 26;
const N_HILL = 2.9;
const sat = (p: number) => (p <= 0 ? 0 : p ** N_HILL / (P50 ** N_HILL + p ** N_HILL));

// ---- plot geometry (SVG user units) ----------------------------------------
const X0 = 42;
const X1 = 424;
const YT = 28; // y of 100% saturation
const YB = 168; // y of 0% saturation
const px = (p: number) => X0 + (p / 100) * (X1 - X0);
const py = (s: number) => YB - s * (YB - YT); // s is a fraction 0–1

// ---- population row ----------------------------------------------------------
const N = 12; // molecules in the crowd
const SEATS = 4; // O₂ seats per molecule (the four hemes)
const WIDTH = 0.12; // how sharply a molecule tips empty→full (a couple caught mid-flip)
// A fixed scattered tip-order (a permutation of 0…N-1) so the crowd fills like a
// real sample rather than a left-to-right sweep — and is identical on server and
// client, avoiding any hydration mismatch.
const ORDER = [5, 0, 8, 3, 11, 6, 1, 9, 4, 10, 2, 7];
const MOL_W = 30; // per-molecule horizontal cell
const POP_Y = 222; // top of the population row
const POP_START = X0 + ((X1 - X0) - N * MOL_W) / 2;
const SEAT_XY = [
  [6, 6],
  [18, 6],
  [6, 18],
  [18, 18],
] as const;

const CHART = {
  curve: "#334155", // slate-700 — calm; orange is reserved for oxygen
  axis: "#cbd5e1", // slate-300
  grid: "#eef2f6",
  tick: "#94a3b8", // slate-400
  molBg: "#f8fafc",
  empty: "#cbd5e1", // empty seat ring
};
const OXYGEN = COLORS.oxygen; // #E2533C — the same dot as the heme O₂ in the T↔R figure

// Static curve path (the model doesn't change, only the marker does).
const CURVE_D = (() => {
  let d = "";
  for (let p = 0; p <= 100; p += 2) d += `${p === 0 ? "M" : "L"}${px(p).toFixed(1)},${py(sat(p)).toFixed(1)}`;
  return d;
})();

const Y_TICKS: [number, string][] = [
  [0, "0"],
  [0.5, "50"],
  [1, "100"],
];
const X_TICKS = [0, 20, 40, 60, 80, 100];

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
  const f = sat(po2);
  const pct = Math.round(f * 100);
  const regime =
    f < 0.25 ? "mostly empty, tense (T)" : f > 0.75 ? "mostly full, relaxed (R)" : "tipping, T → R";
  const mx = px(po2);
  const my = py(f);
  const seats = filledSeatsAt(f);

  return (
    <figure className={cn("my-8 w-full scroll-mt-24 lg:my-12", className)}>
      <div className="mx-auto w-full max-w-xl">
        <div className="w-full rounded-lg bg-white p-3">
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

            {/* gridlines + y ticks (no gridline at the 100% top — it just adds noise) */}
            {Y_TICKS.map(([s, label]) => (
              <g key={`y-${label}`}>
                {s < 1 && (
                  <line x1={X0} y1={py(s)} x2={X1} y2={py(s)} stroke={CHART.grid} strokeWidth={1} strokeDasharray="3 4" />
                )}
                <text x={X0 - 7} y={py(s)} fill={CHART.tick} fontSize={11} textAnchor="end" dominantBaseline="central">
                  {label}
                </text>
              </g>
            ))}

            {/* axes */}
            <line x1={X0} y1={YB} x2={X1} y2={YB} stroke={CHART.axis} strokeWidth={1} />
            <line x1={X0} y1={YT} x2={X0} y2={YB} stroke={CHART.axis} strokeWidth={1} />

            {/* axis labels */}
            <text x={X0 - 7} y={15} fill={CHART.tick} fontSize={11} textAnchor="end">
              % sat
            </text>
            {X_TICKS.map((t) => (
              <text key={`x-${t}`} x={px(t)} y={YB + 16} fill={CHART.tick} fontSize={11} textAnchor="middle">
                {t}
              </text>
            ))}
            <text x={(X0 + X1) / 2} y={203} fill={CHART.tick} fontSize={11} textAnchor="middle">
              oxygen pressure (mmHg) →
            </text>

            {/* the curve */}
            <path d={CURVE_D} fill="none" stroke={CHART.curve} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* current-pressure marker */}
            <line x1={mx} y1={YB} x2={mx} y2={my} stroke={CHART.axis} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={X0} y1={my} x2={mx} y2={my} stroke={CHART.axis} strokeWidth={1} strokeDasharray="3 3" />
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

        {/* tissue presets, pointed under their pressure on the track; clicking moves the slider */}
        <div className="relative mt-1 h-9">
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
                  "mt-1 whitespace-nowrap text-xs transition-colors",
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
