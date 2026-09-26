import { useState } from "react";
import { XR } from "./palette";
import Molecule from "./Molecule";
import { CheckRow, Caption, Readouts, SliderRow } from "./controls";

type Pt = [number, number];

const W = 500;
const H = 340;
const O: Pt = [185, 245];
const PX_PER_A = 3;
const REACH = 12;
const HALF_CELL: Pt[] = [
  [0, 0],
  [0.5, 0],
  [0, 0.5],
  [0.5, 0.5],
];

function clip(a: Pt, b: Pt): [Pt, Pt] | null {
  let t0 = 0;
  let t1 = 1;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const edge = (p: number, q: number) => {
    if (p === 0) return q >= 0;
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
    return true;
  };
  if (!(
    edge(-dx, a[0]) &&
    edge(dx, W - a[0]) &&
    edge(-dy, a[1]) &&
    edge(dy, H - a[1])
  ))
    return null;
  return [
    [a[0] + t0 * dx, a[1] + t0 * dy],
    [a[0] + t1 * dx, a[1] + t1 * dy],
  ];
}

const inside = (q: Pt, margin: number) =>
  q[0] > margin && q[0] < W - margin && q[1] > margin && q[1] < H - margin;

export default function CrystalLattice({
  twofold = false,
}: {
  twofold?: boolean;
}) {
  const [a, setA] = useState(46);
  const [b, setB] = useState(38);
  const [gamma, setGamma] = useState(105);
  const [showPoints, setShowPoints] = useState(true);
  const [showMolecules, setShowMolecules] = useState(true);
  const [showAxes, setShowAxes] = useState(twofold);

  const g = (gamma * Math.PI) / 180;
  const av: Pt = [a * PX_PER_A, 0];
  const bv: Pt = [b * PX_PER_A * Math.cos(g), -b * PX_PER_A * Math.sin(g)];
  const P = (f1: number, f2: number): Pt => [
    O[0] + f1 * av[0] + f2 * bv[0],
    O[1] + f1 * av[1] + f2 * bv[1],
  ];

  const lines: [Pt, Pt][] = [];
  for (let n = -REACH; n <= REACH; n++)
    for (const s of [clip(P(-20, n), P(20, n)), clip(P(n, -20), P(n, 20))])
      if (s) lines.push(s);

  const points: Pt[] = [];
  const molecules: { at: Pt; rotate: number }[] = [];
  const axes: Pt[] = [];
  for (let i = -REACH; i <= REACH; i++)
    for (let j = -REACH; j <= REACH; j++) {
      const q = P(i, j);
      if (showPoints && inside(q, 6)) points.push(q);
      if (showMolecules) {
        const m1 = showAxes ? P(i + 0.72, j + 0.68) : P(i + 0.5, j + 0.5);
        if (inside(m1, 22)) molecules.push({ at: m1, rotate: 25 });
        if (showAxes) {
          const m2 = P(i + 0.28, j + 0.32);
          if (inside(m2, 22)) molecules.push({ at: m2, rotate: 205 });
        }
      }
      if (showAxes)
        for (const f of HALF_CELL) {
          const r = P(i + f[0], j + f[1]);
          if (inside(r, 9)) axes.push(r);
        }
    }

  const c = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)];
  const labelA: Pt = [(c[0][0] + c[1][0]) / 2, (c[0][1] + c[1][1]) / 2 + 22];
  const labelB: Pt = [(c[0][0] + c[3][0]) / 2 - 16, (c[0][1] + c[3][1]) / 2];
  const area = Math.round(a * b * Math.sin(g));
  const cellColor = showAxes ? XR.sum : XR.accent;

  return (
    <figure className="mx-auto my-8 w-full max-w-[32rem] lg:my-12">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="A two-dimensional crystal lattice with one unit cell outlined"
      >
        {lines.map(([p, q], i) => (
          <line
            key={i}
            x1={p[0]}
            y1={p[1]}
            x2={q[0]}
            y2={q[1]}
            stroke={XR.rule}
          />
        ))}
        <path
          d={`M${c.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join("L")}Z`}
          fill={cellColor}
          fillOpacity={0.08}
          stroke={cellColor}
          strokeWidth={2.5}
        />
        {molecules.map((m, i) => (
          <Molecule
            key={i}
            x={m.at[0]}
            y={m.at[1]}
            rotate={m.rotate}
            scale={0.75}
          />
        ))}
        {axes.map((r, i) => (
          <ellipse key={i} cx={r[0]} cy={r[1]} rx={8} ry={5} fill={XR.accent} />
        ))}
        {points.map((q, i) => (
          <circle key={i} cx={q[0]} cy={q[1]} r={4} fill={XR.sum} />
        ))}
        <g className="font-mono" fontSize={14} fill={XR.sum}>
          <text x={labelA[0]} y={labelA[1]} textAnchor="middle">
            a
          </text>
          <text x={labelB[0]} y={labelB[1]} textAnchor="end">
            b
          </text>
        </g>
      </svg>

      <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-3">
        <SliderRow
          label="Edge a"
          value={a}
          display={`${a} Å`}
          min={30}
          max={60}
          step={1}
          onChange={setA}
        />
        <SliderRow
          label="Edge b"
          value={b}
          display={`${b} Å`}
          min={30}
          max={60}
          step={1}
          onChange={setB}
        />
        <SliderRow
          label="Angle"
          value={gamma}
          display={`${gamma}°`}
          min={60}
          max={120}
          step={1}
          onChange={setGamma}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
        {twofold ? (
          <CheckRow
            label="Twofold axes"
            checked={showAxes}
            onChange={setShowAxes}
          />
        ) : (
          <>
            <CheckRow
              label="Lattice points"
              checked={showPoints}
              onChange={setShowPoints}
            />
            <CheckRow
              label="Molecules"
              checked={showMolecules}
              onChange={setShowMolecules}
            />
          </>
        )}
      </div>

      <Readouts
        items={[
          ["Cell area", `${area.toLocaleString("en-US")} Å²`],
          ["Molecules per cell", showAxes ? "2" : "1"],
        ]}
      />

      {twofold && (
        <Caption>
          Switch the twofold axes off and on. The cell goes from one molecule to
          two.
        </Caption>
      )}
    </figure>
  );
}
