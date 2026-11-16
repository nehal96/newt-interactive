// The film's spots, each with its wave's phase, added back into a map of the unit cell.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU } from "./wave";
import { contourPath } from "./contour";
import { F, FIXED, HOME, ORDERS, RADII } from "./Darkness";

const ATOMS = [HOME, ...FIXED];
const TOTAL = F.reduce((a, b) => a + b, 0);
const GROUPS = 4;

type Spot = {
  h: number;
  k: number;
  amp: number;
  phase: number;
  /** Which of the game's waves this spot follows. */
  group: number;
  sign: 1 | -1;
};

/** Every spot but the blocked centre one. */
const SPOTS: Spot[] = (() => {
  const out: Spot[] = [];
  let pair = 0;
  for (const h of ORDERS)
    for (const k of ORDERS) {
      if (h === 0 && k === 0) continue;
      let re = 0;
      let im = 0;
      ATOMS.forEach(([x, y], j) => {
        re += F[j] * Math.cos(TAU * (h * x + k * y));
        im += F[j] * Math.sin(TAU * (h * x + k * y));
      });
      out.push({ h, k, amp: Math.hypot(re, im), phase: Math.atan2(im, re), group: 0, sign: 1 });
    }
  // Opposite spots are one wave seen from both sides, so they must turn opposite ways.
  for (const s of out) {
    if (s.h < 0 || (s.h === 0 && s.k < 0)) continue;
    const mate = out.find((m) => m.h === -s.h && m.k === -s.k)!;
    s.group = mate.group = pair++ % GROUPS;
    mate.sign = -1;
  }
  return out;
})();

const GRID = 49;
const LEVELS = [0.3, 0.5, 0.7, 0.9];

function mapOf(phases: number[]) {
  const map = new Float32Array(GRID * GRID);
  SPOTS.forEach((s, n) => {
    for (let j = 0; j < GRID; j++)
      for (let i = 0; i < GRID; i++)
        map[j * GRID + i] +=
          s.amp *
          Math.cos(TAU * ((s.h * i) / (GRID - 1) + (s.k * j) / (GRID - 1)) - phases[n]);
  });
  return map;
}
const PEAK = mapOf(SPOTS.map((s) => s.phase)).reduce((a, b) => Math.max(a, b), 0);

/** `errors[g]` is how many quarter turns the spots in group g are off by. */
export function Synthesis({ errors }: { errors: number[] }) {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const mid = narrow ? 44 : 150;
  const S = Math.min(124, (W - mid) / 2);
  const top = 8;
  const x0 = (W - 2 * S - mid) / 2;
  const mapX = x0 + S + mid;
  const H = top + S + 24;
  const cy = top + S / 2;
  const step = S / 6;
  const g = S / (GRID - 1);

  const right = errors.every((e) => e % 4 === 0);
  const phases = SPOTS.map((s) => s.phase + (s.sign * errors[s.group] * TAU) / 4);
  const map = mapOf(phases);
  const levels = LEVELS.map((l) => l * PEAK);

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>Adding a whole film’s waves into a picture</title>
        <desc id={`${ids}d`}>
          On the left, the film’s spots, each with a hand showing its wave’s
          phase. On the right, a contour map made by adding the waves together.{" "}
          {right
            ? "With the right phases, the contours close around the three atoms."
            : "With the wrong phases, the same spots give contours in the wrong places."}
        </desc>

        <rect x={x0} y={top} width={S} height={S} rx={3} fill={XR.film} stroke={XR.guide} />
        <circle cx={x0 + S / 2} cy={cy} r={5} fill="none" stroke={XR.guide} />
        {SPOTS.map((s, n) => {
          const sx = x0 + S / 2 + s.h * step;
          const sy = cy + s.k * step;
          return (
            <g key={`${s.h} ${s.k}`}>
              <circle
                cx={sx}
                cy={sy}
                r={5}
                fill={XR.ink}
                fillOpacity={0.04 + 0.9 * (s.amp / TOTAL) ** 1.5}
              />
              <line
                x1={sx}
                y1={sy}
                x2={sx + 9 * Math.sin(phases[n])}
                y2={sy - 9 * Math.cos(phases[n])}
                stroke={XR.accent}
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        <g stroke={XR.label} fill={XR.label}>
          <line x1={x0 + S + 10} x2={mapX - 14} y1={cy} y2={cy} />
          <path d={`M${mapX - 8} ${cy}l-8 -4v8z`} strokeLinejoin="round" />
        </g>

        <rect x={mapX} y={top} width={S} height={S} fill="none" stroke={XR.guide} />
        {ATOMS.map(([ax, ay], j) => (
          <circle
            key={j}
            cx={mapX + ax * S}
            cy={top + ay * S}
            r={RADII[j]}
            fill={XR.molecule}
            fillOpacity={0.45}
            stroke={XR.moleculeEdge}
            strokeDasharray="2 2"
          />
        ))}
        <g transform={`translate(${mapX} ${top}) scale(${g})`}>
          <path
            d={contourPath(map, GRID, levels)}
            fill="none"
            stroke={right ? XR.success : XR.ink}
            strokeWidth={1.1}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g className="font-mono" fontSize={text} fill={XR.label} textAnchor="middle">
          <text x={x0 + S / 2} y={H - 6}>
            film
          </text>
          {!narrow && (
            <text x={x0 + S + mid / 2} y={cy - 10}>
              add the waves
            </text>
          )}
          <text x={mapX + S / 2} y={H - 6}>
            map
          </text>
        </g>
      </svg>
    </div>
  );
}
