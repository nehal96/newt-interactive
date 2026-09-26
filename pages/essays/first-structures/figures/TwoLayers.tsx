import { useId, useState } from "react";
import { Button } from "@ui/controls";
import { XR } from "./palette";
import Molecule from "./Molecule";
import { TAU, curvePath } from "./wave";
import { CheckRow, Note, Readouts, SliderRow } from "./controls";

type Pt = [number, number];

const D = 60;
const LAM = 40;
const RAY = 150;
const H1: Pt = [190, 130];
const H2: Pt = [190, 190];
const LAYERS = [130, 190];
const MOLECULES: Pt[] = LAYERS.flatMap((y) =>
  [120, 190, 260].map((x): Pt => [x, y]),
);

const W_X0 = 420;
const W_LEN = 240;
const W_AMP = 16;
const W_ROWS = { first: 60, second: 115, sum: 190 };

const REINFORCE = +((Math.asin(LAM / (2 * D)) * 180) / Math.PI).toFixed(1);
const CANCEL = +((Math.asin(LAM / (4 * D)) * 180) / Math.PI).toFixed(1);

const mod = (x: number, m: number) => ((x % m) + m) % m;
const at = (p: Pt, dir: Pt, k: number): Pt => [
  p[0] + k * dir[0],
  p[1] + k * dir[1],
];
const f1 = (v: number) => v.toFixed(1);

export default function TwoLayers() {
  const clipId = `layers${useId().replace(/[^\w-]/g, "")}`;
  const [deg, setDeg] = useState(15);
  const [showCircles, setShowCircles] = useState(true);

  const t = (deg * Math.PI) / 180;
  const u: Pt = [Math.cos(t), Math.sin(t)];
  const v: Pt = [Math.cos(t), -Math.sin(t)];
  const n: Pt = [-v[1], v[0]];
  const frac = (2 * D * Math.sin(t)) / LAM;
  const brightness = Math.cos(Math.PI * frac) ** 2;
  const firstCrest = (m: Pt) => mod(-(u[0] * m[0] + u[1] * m[1]), LAM);
  const outOpacity = 0.2 + 0.8 * brightness;
  const inStep = brightness > 0.9;

  const circles: { m: Pt; r: number }[] = [];
  if (showCircles)
    for (const m of MOLECULES)
      for (let r = firstCrest(m); r <= 175; r += LAM)
        if (r > 4) circles.push({ m, r });

  const beams = [
    { h: H1, color: XR.first },
    { h: H2, color: XR.second },
  ].map(({ h, color }) => {
    const start = at(h, u, -RAY);
    const end = at(h, v, RAY);
    const back = at(end, v, -12);
    const crests: [Pt, Pt][] = [];
    for (let q = firstCrest(h); q <= RAY - 16; q += LAM) {
      if (q < 16) continue;
      const c = at(h, v, q);
      crests.push([at(c, n, -8), at(c, n, 8)]);
    }
    return {
      h,
      color,
      start,
      end,
      head: [at(end, v, 2), at(back, n, 5), at(back, n, -5)],
      crests,
    };
  });

  const ds = D * Math.sin(t);
  const fronts: [Pt, Pt][] = [];
  for (let q = firstCrest(H1); q + ds <= RAY - 16; q += LAM)
    if (q >= 16) fronts.push([at(H1, v, q), at(H2, v, q + ds)]);
  const extraIn = at(H2, u, -ds);
  const extraOut = at(H2, v, ds);

  const layerWave = (off: number) => (x: number) =>
    W_AMP * Math.cos((TAU * (x - off)) / LAM);
  const sumColor = inStep ? XR.accent : XR.sum;

  return (
    <figure className="mx-auto my-8 w-full max-w-[40rem] lg:my-12 lg:max-w-[48rem]">
      <svg
        viewBox="0 0 680 250"
        className="h-auto w-full"
        role="img"
        aria-label="Two layers of molecules, each sending out circular waves; the outgoing rays mark where the circles from both layers line up"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={360} height={250} />
          </clipPath>
        </defs>

        {LAYERS.map((y) => (
          <line
            key={y}
            x1={80}
            y1={y}
            x2={330}
            y2={y}
            stroke={XR.rule}
            strokeDasharray="4 4"
          />
        ))}
        <g
          clipPath={`url(#${clipId})`}
          fill="none"
          stroke={XR.label}
          strokeWidth={0.75}
          strokeOpacity={0.2}
        >
          {circles.map(({ m, r }, i) => (
            <circle key={i} cx={m[0]} cy={m[1]} r={f1(r)} />
          ))}
        </g>

        {beams.map((b) => (
          <g key={b.color}>
            <line
              x1={f1(b.start[0])}
              y1={f1(b.start[1])}
              x2={b.h[0]}
              y2={b.h[1]}
              stroke={b.color}
              strokeWidth={2}
            />
            <g opacity={outOpacity}>
              <line
                x1={b.h[0]}
                y1={b.h[1]}
                x2={f1(b.end[0])}
                y2={f1(b.end[1])}
                stroke={b.color}
                strokeWidth={1.5}
              />
              <polygon
                points={b.head.map((p) => p.map(f1).join(",")).join(" ")}
                fill={b.color}
              />
            </g>
          </g>
        ))}
        <path
          d={`M${f1(extraIn[0])} ${f1(extraIn[1])}L${H2[0]} ${H2[1]}L${f1(extraOut[0])} ${f1(extraOut[1])}`}
          fill="none"
          stroke={XR.second}
          strokeWidth={7}
          strokeOpacity={0.32}
          strokeLinecap="round"
        />
        <g stroke={XR.label} strokeDasharray="3 3">
          {fronts.map(([p, q], i) => (
            <line
              key={i}
              x1={f1(p[0])}
              y1={f1(p[1])}
              x2={f1(q[0])}
              y2={f1(q[1])}
            />
          ))}
        </g>
        {beams.map((b) => (
          <g
            key={b.color}
            stroke={b.color}
            strokeWidth={3}
            strokeLinecap="round"
          >
            {b.crests.map(([p, q], i) => (
              <line
                key={i}
                x1={f1(p[0])}
                y1={f1(p[1])}
                x2={f1(q[0])}
                y2={f1(q[1])}
              />
            ))}
          </g>
        ))}
        {MOLECULES.map(([x, y]) => (
          <Molecule key={`${x}-${y}`} x={x} y={y} scale={0.45} />
        ))}

        {Object.values(W_ROWS).map((y) => (
          <line
            key={y}
            x1={W_X0}
            y1={y}
            x2={W_X0 + W_LEN}
            y2={y}
            stroke={XR.rule}
          />
        ))}
        <path
          d={curvePath(W_X0, W_ROWS.first, W_LEN, layerWave(0))}
          fill="none"
          stroke={XR.first}
          strokeWidth={2}
        />
        <path
          d={curvePath(W_X0, W_ROWS.second, W_LEN, layerWave(frac * LAM))}
          fill="none"
          stroke={XR.second}
          strokeWidth={2}
        />
        <path
          d={curvePath(
            W_X0,
            W_ROWS.sum,
            W_LEN,
            (x) => layerWave(0)(x) + layerWave(frac * LAM)(x),
          )}
          fill="none"
          stroke={sumColor}
          strokeWidth={2.4}
        />

        <g className="font-mono" fontSize={12} fill={XR.label}>
          <text x={8} y={134}>
            layer 1
          </text>
          <text x={8} y={194}>
            layer 2
          </text>
          <text x={372} y={64}>
            layer 1
          </text>
          <text x={372} y={119}>
            layer 2
          </text>
          <text x={372} y={194} fill={sumColor}>
            sum
          </text>
        </g>
      </svg>

      <div className="mt-6">
        <SliderRow
          label="Angle of the beam"
          value={deg}
          display={`${deg.toFixed(1)}°`}
          min={5}
          max={34}
          step={0.1}
          onChange={setDeg}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant={deg === REINFORCE ? "secondary" : "outline"}
          onClick={() => setDeg(REINFORCE)}
          aria-pressed={deg === REINFORCE}
          className="text-sm"
        >
          Reinforce
        </Button>
        <Button
          variant={deg === CANCEL ? "secondary" : "outline"}
          onClick={() => setDeg(CANCEL)}
          aria-pressed={deg === CANCEL}
          className="text-sm"
        >
          Cancel
        </Button>
        <span className="ml-3">
          <CheckRow
            label="Show the circles"
            checked={showCircles}
            onChange={setShowCircles}
          />
        </span>
      </div>

      <Readouts
        items={[
          ["Extra path for layer 2", `${frac.toFixed(2)} wavelengths`],
          [
            "Brightness of the outgoing ray",
            `${Math.round(brightness * 100)}%`,
          ],
        ]}
      />

      <Note>
        {inStep
          ? "In step: a bright ray, a spot."
          : brightness < 0.1
            ? "Out of step: they cancel, no spot."
            : "Partly in step: a weak ray."}
      </Note>

    </figure>
  );
}
