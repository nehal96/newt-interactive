// Figure 5: the same molecules at random and in a grid, and the films they give.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import Molecule, { ATOMS } from "./Molecule";
import { Labels } from "./scene";
import { SpotFilm, latticeSpots } from "./spots";

/** Grid spacing and X-ray wavelength, in the molecule's own drawing units. */
const CELL = 87;
const LAMBDA = 8.9;
/** tan θ at the film's edge. */
const EDGE_TAN = 0.6;
const N = 5;

function j0(x: number) {
  const ax = Math.abs(x);
  if (ax < 8) {
    const y = x * x;
    const a1 = 57568490574.0 + y * (-13362590354.0 + y * (651619640.7 + y * (-11214424.18 + y * (77392.33017 + y * -184.9052456))));
    const a2 = 57568490411.0 + y * (1029532985.0 + y * (9494680.718 + y * (59272.64853 + y * (267.8532712 + y))));
    return a1 / a2;
  }
  const z = 8 / ax;
  const y = z * z;
  const xx = ax - 0.785398164;
  const a1 = 1 + y * (-0.1098628627e-2 + y * (0.2734510407e-4 + y * (-0.2073370639e-5 + y * 0.2093887211e-6)));
  const a2 = -0.1562499995e-1 + y * (0.1430488765e-3 + y * (-0.6911147651e-5 + y * (0.7621095161e-6 - y * 0.934935152e-7)));
  return Math.sqrt(0.636619772 / ax) * (Math.cos(xx) * a1 - z * Math.sin(xx) * a2);
}

/** |F|² of one molecule for scattering vector (qx, qy), as a fraction of its value straight ahead. */
function moleculeStrength(qx: number, qy: number) {
  let re = 0;
  let im = 0;
  for (const [x, y] of ATOMS) {
    re += Math.cos(qx * x + qy * y);
    im += Math.sin(qx * x + qy * y);
  }
  return (re * re + im * im) / (ATOMS.length * ATOMS.length);
}

/** The same, averaged over every orientation in the layer's plane. */
function averagedStrength(q: number) {
  let sum = 0;
  for (const [x1, y1] of ATOMS)
    for (const [x2, y2] of ATOMS) sum += j0(q * Math.hypot(x1 - x2, y1 - y2));
  return sum / (ATOMS.length * ATOMS.length);
}

const SPOTS = latticeSpots(CELL, LAMBDA, EDGE_TAN, (h, k) => {
  const q = (2 * Math.PI) / CELL;
  return moleculeStrength(q * h, q * k);
});
const SPOT_MAX = Math.max(...SPOTS.map((s) => s.s));

const HAZE = (() => {
  const stops: { offset: number; o: number }[] = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const r = (i / steps) * Math.SQRT2 * EDGE_TAN;
    const sinTheta = r / Math.hypot(1, r);
    stops.push({ offset: i / steps, o: 0.8 * averagedStrength((2 * Math.PI * sinTheta) / LAMBDA) });
  }
  return stops;
})();

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Random positions (fractions of the panel) and angles, kept from overlapping. */
const SCATTERED = (() => {
  const rand = mulberry32(7);
  const placed: { x: number; y: number; a: number }[] = [];
  let tries = 0;
  while (placed.length < N * N && tries++ < 5000) {
    const x = 0.08 + 0.84 * rand();
    const y = 0.08 + 0.84 * rand();
    if (placed.every((p) => Math.hypot(p.x - x, p.y - y) > 0.15))
      placed.push({ x, y, a: 360 * rand() });
  }
  return placed;
})();

/** A layer of molecules and the film behind it, drawn in perspective with the beam passing through. */
function ViewSketch({ cx, y, text }: { cx: number; y: number; text: number }) {
  const w = 34;
  const h = 58;
  const skew = 12;
  const quad = (x: number) =>
    `M${x} ${y + skew} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h + skew} Z`;
  const layerX = cx - 70;
  const filmX = cx + 60;
  const mid = y + h / 2 + skew / 2;
  const inQuad = (x0: number, u: number, v: number): [number, number] => [
    x0 + u * w,
    y + skew * (1 - u) + v * h,
  ];
  const grid = [0.25, 0.5, 0.75];
  return (
    <g>
      <g stroke={XR.first} strokeWidth={2}>
        <line x1={cx - 150} x2={layerX + w / 2} y1={mid} y2={mid} />
      </g>
      <path d={quad(layerX)} fill={XR.molecule} fillOpacity={0.45} stroke={XR.moleculeEdge} strokeWidth={1} />
      <g fill={XR.moleculeEdge}>
        {grid.flatMap((u) => grid.map((v) => {
          const [px, py] = inQuad(layerX, u, v);
          return <circle key={`${u}${v}`} cx={px} cy={py} r={2.4} />;
        }))}
      </g>
      <g stroke={XR.first} strokeWidth={2} fill={XR.first}>
        <line x1={layerX + w / 2} x2={filmX + w / 2 - 12} y1={mid} y2={mid} />
        <path d={`M${filmX + w / 2 - 4} ${mid} l-9 -5 v10 z`} strokeLinejoin="round" />
      </g>
      <path d={quad(filmX)} fill={XR.film} stroke={XR.atom} strokeWidth={1} />
      <g fill={XR.sum}>
        {[0.2, 0.4, 0.6, 0.8].flatMap((u) => [0.2, 0.4, 0.6, 0.8].map((v) => {
          const [px, py] = inQuad(filmX, u, v);
          return <circle key={`${u}${v}`} cx={px} cy={py} r={1.4} />;
        }))}
      </g>
      <Labels size={text}>
        <text x={cx - 150} y={mid - 10}>X-rays</text>
        <text x={layerX + w / 2} y={y + h + skew + 18} textAnchor="middle">
          layer of molecules
        </text>
        <text x={filmX + w / 2} y={y + h + skew + 18} textAnchor="middle">
          film
        </text>
      </Labels>
    </g>
  );
}

export function OrderMakesSpots() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 11 : 12;
  const wide = W >= 600;

  const sketchTop = 8;
  let S: number, molX: number[], filmX: number[], molTop: number, filmTop: number, headY: number;
  if (wide) {
    S = Math.min(170, (W - 64) / 4);
    const x0 = (W - (4 * S + 64)) / 2;
    molX = [x0, x0 + 2 * S + 48];
    filmX = [molX[0] + S + 16, molX[1] + S + 16];
    headY = sketchTop + 120;
    molTop = headY + 26;
    filmTop = molTop;
  } else {
    S = (W - 16) / 2;
    molX = [0, S + 16];
    filmX = molX;
    headY = sketchTop + 152;
    molTop = headY + 26;
    filmTop = molTop + S + 16;
  }
  const H = filmTop + S + 26;
  const groupX = (i: number) => (wide ? molX[i] + S + 8 : molX[i] + S / 2);
  const cols = molX;

  const cellPx = S / N;
  const scale = cellPx / CELL;

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
        <title id={`${ids}t`}>Only an ordered arrangement concentrates the X-rays into spots.</title>
        <desc id={`${ids}d`}>
          A sketch shows an X-ray beam passing through a flat layer of molecules to
          a film behind it. Below, seen face-on along the beam: on the left,
          molecules at random positions and angles, whose film shows a smooth
          haze fading outward from the centre; on the right, the same molecules
          in a five-by-five grid with one unit cell outlined, whose film shows a
          regular grid of sharp spots of varying darkness.
        </desc>
        <defs>
          <clipPath id={`${ids}m`}>
            <rect x={cols[0]} y={molTop} width={S} height={S} />
          </clipPath>
        </defs>

        <ViewSketch cx={wide ? Math.max(154, W / 2 - 140) : W / 2} y={sketchTop} text={text} />
        {wide ? (
          <text className="font-ui" fontSize={13} fill={XR.label}>
            <tspan x={Math.max(154, W / 2 - 140) + 140} y={sketchTop + 36}>
              Below, the molecules and the film
            </tspan>
            <tspan x={Math.max(154, W / 2 - 140) + 140} y={sketchTop + 54}>
              are both seen face-on,
            </tspan>
            <tspan x={Math.max(154, W / 2 - 140) + 140} y={sketchTop + 72}>
              looking along the beam.
            </tspan>
          </text>
        ) : (
          <text x={W / 2} y={sketchTop + 126} textAnchor="middle" className="font-ui" fontSize={12} fill={XR.label}>
            Below, both are seen face-on, looking along the beam.
          </text>
        )}

        {["At random", "In a grid"].map((h, i) => (
          <text
            key={h}
            x={groupX(i)}
            y={headY}
            textAnchor="middle"
            className="font-ui"
            fontSize={narrow ? 12 : 13}
            fontWeight={600}
            fill={XR.sum}
          >
            {h}
          </text>
        ))}

        <g clipPath={`url(#${ids}m)`}>
          {SCATTERED.map(({ x, y, a }) => (
            <Molecule
              key={`${x}-${y}`}
              x={cols[0] + x * S}
              y={molTop + y * S}
              rotate={a}
              scale={scale}
              strokeWidth={0.75}
            />
          ))}
        </g>

        {Array.from({ length: N * N }, (_, i) => (
          <Molecule
            key={i}
            x={cols[1] + ((i % N) + 0.5) * cellPx}
            y={molTop + (Math.floor(i / N) + 0.5) * cellPx}
            scale={scale}
            strokeWidth={0.75}
          />
        ))}
        <rect
          x={cols[1] + cellPx}
          y={molTop}
          width={cellPx}
          height={cellPx}
          fill="none"
          stroke={XR.accent}
          strokeWidth={1.25}
          strokeDasharray="4 3"
        />

        <SpotFilm x={filmX[0]} y={filmTop} size={S} haze={HAZE} />
        <SpotFilm x={filmX[1]} y={filmTop} size={S} spots={SPOTS} max={SPOT_MAX} />

        <Labels size={text}>
          <text x={cols[1] + 1.5 * cellPx} y={molTop - 7} textAnchor="middle" fill={XR.accent}>
            unit cell
          </text>
          <text x={filmX[0] + S / 2} y={filmTop + S + 18} textAnchor="middle">
            film: smooth haze
          </text>
          <text x={filmX[1] + S / 2} y={filmTop + S + 18} textAnchor="middle">
            film: sharp spots
          </text>
        </Labels>
      </svg>
    </div>
  );
}
