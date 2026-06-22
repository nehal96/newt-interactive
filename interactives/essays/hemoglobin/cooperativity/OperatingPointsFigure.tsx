import {
  CHART,
  ChartFigure,
  ChartFrame,
  Dot,
  N_HILL,
  OXYGEN,
  P50,
  PLOT,
  px,
  py,
  saturation,
  SaturationCurve,
} from "./chart";
import { ZONES } from "../palette";

// Figure 2 of the Cooperativity section: the same saturation curve, now read for
// what its shape buys you. The four physiological operating points sit on the
// curve; a "delivery cliff" band covers the steep middle and a "loading shelf"
// band covers the high plateau (the 90–100% region, its left edge meeting the
// curve where saturation crosses 90%). The two right-angle markers make the
// prose's point literal — the same 20 mmHg pressure drop is a long fall on the
// cliff (resting→working) but a flat hop on the shelf (lungs→mountain). Static,
// pure SVG; model, plot box and axes come from the shared ./chart module.

// The shelf is the high-saturation plateau: the band spans 90–100% saturation and
// its left edge meets the curve exactly where saturation crosses 90% (≈55 mmHg).
// Inverse Hill from the shared P50/n so it stays consistent with the curve.
const SHELF_SAT = 0.9;
const SHELF_FROM = P50 * (SHELF_SAT / (1 - SHELF_SAT)) ** (1 / N_HILL);

const POINTS = [
  { p: 20, name: "working muscle", dx: 9, dy: 6, anchor: "start" as const },
  { p: 40, name: "resting tissue", dx: 6, dy: 16, anchor: "start" as const },
  { p: 75, name: "small mountain", dx: -8, dy: 21, anchor: "middle" as const },
  { p: 95, name: "lungs", dx: 14, dy: 24, anchor: "end" as const },
];

// A matched-pressure-drop marker: a horizontal leg of fixed width (the 20 mmHg
// drop) from the higher-pressure point, then a vertical leg down to the lower
// one. The length of that vertical leg — long on the cliff, a stub on the shelf —
// is the whole point, so it carries no number of its own.
function DropPair({ pHi, pLo }: { pHi: number; pLo: number }) {
  const xHi = px(pHi);
  const yHi = py(saturation(pHi));
  const xLo = px(pLo);
  const yLo = py(saturation(pLo));
  return (
    <>
      <line x1={xHi} y1={yHi} x2={xLo} y2={yHi} stroke={CHART.axis} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={xLo} y1={yHi} x2={xLo} y2={yLo} stroke={CHART.axis} strokeWidth={1} strokeDasharray="3 3" />
    </>
  );
}

export default function OperatingPointsFigure({ className }: { className?: string }) {
  return (
    <ChartFigure
      id="ops"
      height={210}
      className={className}
      title="Hemoglobin's operating points"
      desc="The saturation curve with the lungs, a small mountain, resting tissue and working muscle marked. A delivery-cliff band over the steep middle and a loading-shelf band over the plateau show that the same 20 mmHg pressure drop unloads far more oxygen on the cliff than on the shelf."
    >
      {/* zones (behind the frame and curve); the shelf's left edge meets the
          curve where saturation crosses 90% */}
      <rect x={px(12)} y={PLOT.YT} width={px(45) - px(12)} height={PLOT.YB - PLOT.YT} fill={ZONES.cliff} />
      <rect x={px(SHELF_FROM)} y={PLOT.YT} width={PLOT.X1 - px(SHELF_FROM)} height={py(SHELF_SAT) - PLOT.YT} fill={ZONES.shelf} />
      <text x={(px(12) + px(45)) / 2} y={20} fill={ZONES.cliffInk} fontSize={11} textAnchor="middle">
        delivery cliff
      </text>
      <text x={(px(SHELF_FROM) + PLOT.X1) / 2} y={20} fill={ZONES.shelfInk} fontSize={11} textAnchor="middle">
        loading shelf
      </text>

      <ChartFrame />
      <SaturationCurve />

      {/* the same 20 mmHg drop — a long fall on the cliff, a flat hop on the shelf */}
      <DropPair pHi={40} pLo={20} />
      <DropPair pHi={95} pLo={75} />

      {/* operating points */}
      {POINTS.map((pt) => {
        const X = px(pt.p);
        const Y = py(saturation(pt.p));
        return (
          <g key={pt.p}>
            <Dot x={X} y={Y} fill={OXYGEN} />
            <text x={X + pt.dx} y={Y + pt.dy} fill={ZONES.pointLabel} fontSize={10} textAnchor={pt.anchor} dominantBaseline="central">
              {pt.name}
            </text>
          </g>
        );
      })}
    </ChartFigure>
  );
}
