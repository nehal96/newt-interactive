import { HB, NEUTRAL } from "../palette";

// Shared chart primitives for the cooperativity saturation-curve figures, so the
// "filling up" population figure, the operating-points figure, and the shift /
// tuning figure all use one Hill model, one plot box, and one set of axes — and
// therefore look identical. Pure functions + an SSR-safe axes component.

// ---- model ------------------------------------------------------------------
// Hill equation, saturation as a fraction 0–1. P50 ≈ 26 mmHg (2,3-BPG sets it)
// and n ≈ 2.9 reproduce the essay's anchor numbers (20→32%, 40→~77%, 95→98%).
// p50/n are overridable so the shift figure can draw left/right-shifted curves.
export const P50 = 26;
export const N_HILL = 2.9;
export const saturation = (p: number, p50 = P50, n = N_HILL) =>
  p <= 0 ? 0 : p ** n / (p50 ** n + p ** n);

// ---- plot geometry (SVG user units; shared viewBox width is 440) ------------
// Each figure owns its own <svg> height (some have a population row below), but
// the plot box itself is identical across all of them.
export const PLOT = { X0: 42, X1: 424, YT: 28, YB: 168, PMAX: 100 };
export const px = (p: number) => PLOT.X0 + (p / PLOT.PMAX) * (PLOT.X1 - PLOT.X0);
export const py = (s: number) => PLOT.YB - s * (PLOT.YB - PLOT.YT); // s is a fraction 0–1

export const CHART = {
  curve: NEUTRAL.curve, // slate-700 — calm; orange is reserved for oxygen
  axis: NEUTRAL.axis, // slate-300
  grid: NEUTRAL.grid,
  tick: NEUTRAL.tick, // slate-400
  molBg: NEUTRAL.molBg,
  empty: NEUTRAL.empty, // empty seat ring
};
export const OXYGEN = HB.oxygen.fill; // #E2533C — the heme O₂ dot from the T↔R figure

// An SVG path for the saturation curve at a given p50/n.
export function curvePath(p50 = P50, n = N_HILL, step = 2) {
  let d = "";
  for (let p = 0; p <= PLOT.PMAX; p += step)
    d += `${p === 0 ? "M" : "L"}${px(p).toFixed(1)},${py(saturation(p, p50, n)).toFixed(1)}`;
  return d;
}

// ---- axes -------------------------------------------------------------------
// Renders gridlines, axes, ticks and labels as bare SVG elements, to be dropped
// into a figure's own <svg>. No gridline is drawn at 100% by default — it only
// adds noise at the top of the plot.
const DEFAULT_Y_LABELS: [number, string][] = [
  [0, "0"],
  [0.5, "50"],
  [1, "100"],
];

export function ChartFrame({
  yGrid = [0, 0.5],
  yLabels = DEFAULT_Y_LABELS,
  xTicks = [0, 20, 40, 60, 80, 100],
  xLabel = "oxygen pressure (mmHg) →",
  yLabel = "% sat",
}: {
  yGrid?: number[];
  yLabels?: [number, string][];
  xTicks?: number[];
  xLabel?: string;
  yLabel?: string;
}) {
  const { X0, X1, YT, YB } = PLOT;
  return (
    <>
      {yGrid.map((s) => (
        <line key={`grid-${s}`} x1={X0} y1={py(s)} x2={X1} y2={py(s)} stroke={CHART.grid} strokeWidth={1} strokeDasharray="3 4" />
      ))}
      <line x1={X0} y1={YB} x2={X1} y2={YB} stroke={CHART.axis} strokeWidth={1} />
      <line x1={X0} y1={YT} x2={X0} y2={YB} stroke={CHART.axis} strokeWidth={1} />
      {yLabels.map(([s, label]) => (
        <text key={`ylab-${label}`} x={X0 - 7} y={py(s)} fill={CHART.tick} fontSize={11} textAnchor="end" dominantBaseline="central">
          {label}
        </text>
      ))}
      <text x={X0 - 7} y={15} fill={CHART.tick} fontSize={11} textAnchor="end">
        {yLabel}
      </text>
      {xTicks.map((t) => (
        <text key={`xtick-${t}`} x={px(t)} y={YB + 16} fill={CHART.tick} fontSize={11} textAnchor="middle">
          {t}
        </text>
      ))}
      <text x={(X0 + X1) / 2} y={203} fill={CHART.tick} fontSize={11} textAnchor="middle">
        {xLabel}
      </text>
    </>
  );
}
