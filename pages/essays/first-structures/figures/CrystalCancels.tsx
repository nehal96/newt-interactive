// A whole crystal and the film it exposes, in one consistent 3D view: dark only at a few spots.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { oscillationSpots } from "./oscillation";
import { Note } from "./TwoAtoms";

type V3 = [number, number, number];

/** Horse methaemoglobin's cell and wavelength (Bernal, Fankuchen and Perutz 1938), rocked 5° as in their photograph. */
const CELL = { a: 109, b: 63.2, c: 54.2, beta: 112 };
const LAMBDA = 1.54;
/** The film's half-width as a share of its distance from the crystal. */
const REACH = 0.3;

/** A made-up molecule: fractional positions in the cell, so the spots vary in darkness the way real ones do. */
const MOLECULE: V3[] = (() => {
  let seed = 11;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: 40 }, () => [0.2 + 0.6 * rand(), 0.2 + 0.6 * rand(), 0.2 + 0.6 * rand()] as V3);
})();
/** Temperature factor in Å², which fades the outer spots. */
const B = 40;

const SPOTS = (() => {
  const raw = oscillationSpots({
    cell: CELL,
    lambda: LAMBDA,
    distance: 1,
    dMin: LAMBDA / (2 * Math.sin(Math.atan(REACH * Math.SQRT2) / 2)),
    from: 0,
    to: 5,
    absent: (h, k) => (h + k) % 2 !== 0,
  }).filter(({ y, z }) => Math.abs(y) < 0.96 * REACH && Math.abs(z) < 0.96 * REACH);
  const strength = raw.map(({ h, k, l, y, z }) => {
    let re = 0;
    let im = 0;
    for (const [x, v, w] of MOLECULE) {
      const p = 2 * Math.PI * (h * x + k * v + l * w);
      re += Math.cos(p);
      im += Math.sin(p);
    }
    const sinTheta = Math.sin(Math.atan(Math.hypot(y, z)) / 2);
    return (re * re + im * im) * Math.exp((-2 * B * sinTheta ** 2) / LAMBDA ** 2);
  });
  const max = Math.max(...strength);
  return raw.map((s, i) => ({ y: s.y / REACH, z: s.z / REACH, o: 0.15 + 0.85 * Math.sqrt(strength[i] / max) }));
})();

/** The spot the red line picks out: a dark one well out from the centre, toward the upper right on screen. */
const MARKED = SPOTS.filter((s) => s.o > 0.5 && Math.hypot(s.y, s.z) > 0.45).reduce((a, b) => (b.z - b.y > a.z - a.y ? b : a));

/** Camera: in front, a little to the left and above, so the film's face toward the crystal shows. */
const AZ = (50 * Math.PI) / 180;
const EL = (10 * Math.PI) / 180;
const R: V3 = [Math.cos(AZ), -Math.sin(AZ), 0];
const U: V3 = [Math.sin(AZ) * Math.sin(EL), Math.cos(AZ) * Math.sin(EL), Math.cos(EL)];
const DIR: V3 = [Math.sin(AZ) * Math.cos(EL), Math.cos(AZ) * Math.cos(EL), -Math.sin(EL)];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const flat = (p: V3): [number, number] => [dot(p, R), -dot(p, U)];

/** Not to scale: the crystal is drawn far larger, and the film smaller, than the spot pattern assumes. */
const SIDE = 3;
const CRYSTAL = 0.09;
const BOX_HALF = CRYSTAL / 2 + 0.02;
const BEAM_FROM = -0.38;
const FILM_X = 1.25;
const FILM_HALF = 0.26;

const ATOMS: V3[] = Array.from({ length: SIDE ** 3 }, (_, n) => {
  const at = (i: number) => (i / (SIDE - 1) - 0.5) * CRYSTAL;
  return [at(n % SIDE), at(Math.floor(n / SIDE) % SIDE), at(Math.floor(n / SIDE ** 2))] as V3;
}).sort((a, b) => dot(b, DIR) - dot(a, DIR));
const BOX: V3[] = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x * BOX_HALF, y * BOX_HALF, z * BOX_HALF] as V3)));
const BOX_EDGES: [number, number][] = [
  [0, 1], [2, 3], [4, 5], [6, 7],
  [0, 2], [1, 3], [4, 6], [5, 7],
  [0, 4], [1, 5], [2, 6], [3, 7],
];
const FILM: V3[] = [
  [FILM_X, FILM_HALF, FILM_HALF],
  [FILM_X, -FILM_HALF, FILM_HALF],
  [FILM_X, -FILM_HALF, -FILM_HALF],
  [FILM_X, FILM_HALF, -FILM_HALF],
];
/** A film point from spot coordinates in units of the film's half-width. */
const filmPoint = (y: number, z: number): V3 => [FILM_X, y * FILM_HALF, z * FILM_HALF];
/** A circle of radius `r` on the film, centred on film point (y, z). */
const ring = (y: number, z: number, r: number): V3[] =>
  Array.from({ length: 16 }, (_, i) => [FILM_X, y * FILM_HALF + r * Math.cos((i * Math.PI) / 8), z * FILM_HALF + r * Math.sin((i * Math.PI) / 8)] as V3);

export function CrystalCancels() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const text = W < 520 ? 10 : 11;

  const key = [...FILM, ...BOX, [BEAM_FROM, 0, 0] as V3].map(flat);
  const minX = Math.min(...key.map((p) => p[0]));
  const maxX = Math.max(...key.map((p) => p[0]));
  const minY = Math.min(...key.map((p) => p[1]));
  const maxY = Math.max(...key.map((p) => p[1]));
  const pad = { t: 24, b: 26 };
  const k = Math.min((Math.min(W, 560) - 12) / (maxX - minX), 190 / (maxY - minY));
  const left = (W - k * (maxX - minX)) / 2;
  const H = Math.round(pad.t + k * (maxY - minY) + pad.b);
  const P = (p: V3): [number, number] => {
    const [x, y] = flat(p);
    return [left + (x - minX) * k, pad.t + (y - minY) * k];
  };
  const poly = (pts: V3[]) => pts.map((p) => P(p).map((v) => v.toFixed(1)).join(",")).join(" ");

  const [b0x, b0y] = P([BEAM_FROM, 0, 0]);
  const [b1x, b1y] = P([-BOX_HALF - 0.03, 0, 0]);
  const ang = Math.atan2(b1y - b0y, b1x - b0x);
  const head = `M${b1x} ${b1y} L${b1x - 10 * Math.cos(ang) + 5 * Math.sin(ang)} ${b1y - 10 * Math.sin(ang) - 5 * Math.cos(ang)} L${b1x - 10 * Math.cos(ang) - 5 * Math.sin(ang)} ${b1y - 10 * Math.sin(ang) + 5 * Math.cos(ang)} Z`;

  const target = filmPoint(MARKED.y, MARKED.z);
  const exit: V3 = [BOX_HALF, (target[1] * BOX_HALF) / target[0], (target[2] * BOX_HALF) / target[0]];
  const [sx, sy] = P(exit);
  const [mx, my] = P(target);
  const spotR = 0.0056;
  const [fx, fy] = P([FILM_X, -FILM_HALF, -FILM_HALF]);
  const [gx, gy] = P([FILM_X, FILM_HALF, -FILM_HALF]);
  const topY = Math.min(P([FILM_X, -FILM_HALF, FILM_HALF])[1], P([FILM_X, FILM_HALF, FILM_HALF])[1]);
  const edgeX = P([FILM_X, -FILM_HALF, MARKED.z * FILM_HALF])[0] + 8;
  const labelRight = edgeX + 0.62 * text * 19 < W;

  return (
    <div ref={ref}>
      <Note title="2. A whole crystal">
        Every atom in the crystal sends out its waves the same way. At almost every point on the film they arrive out of
        step and cancel; only at a few do they all arrive in step, and those points become spots.
      </Note>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="mt-3 block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>A whole crystal: the film stays clear except at its spots</title>
        <desc id={`${ids}d`}>
          X-rays pass through a crystal. The square film behind it stays clear everywhere except at {SPOTS.length} sharp
          spots of different darkness, where every atom&rsquo;s wave arrives in step.
        </desc>

        <g stroke={XR.first} strokeWidth={2} fill={XR.first}>
          <line x1={b0x} y1={b0y} x2={b1x - 6 * Math.cos(ang)} y2={b1y - 6 * Math.sin(ang)} />
          <path d={head} strokeLinejoin="round" />
        </g>

        <g stroke={XR.atom} strokeWidth={0.75}>
          {BOX_EDGES.map(([i, j]) => {
            const [x1, y1] = P(BOX[i]);
            const [x2, y2] = P(BOX[j]);
            return <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
        <g fill={XR.sum}>
          {ATOMS.map((a, i) => {
            const [x, y] = P(a);
            return <circle key={i} cx={x} cy={y} r={Math.min(2.4, Math.max(1.4, k * 0.012))} />;
          })}
        </g>

        <polygon points={poly(FILM)} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        <g fill={XR.sum}>
          {SPOTS.map((s, i) => (
            <polygon key={i} points={poly(ring(s.y, s.z, spotR))} fillOpacity={s.o} />
          ))}
        </g>
        <polygon points={poly(ring(0, 0, 0.013))} fill={XR.label} />
        <line x1={sx} y1={sy} x2={mx} y2={my} stroke={XR.accent} strokeWidth={1.25} />
        <polygon points={poly(ring(MARKED.y, MARKED.z, 0.018))} fill="none" stroke={XR.accent} strokeWidth={1.5} />

        <Labels size={text}>
          <text x={b0x} y={b0y - 14}>x-rays</text>
          <text x={P([0, 0, 0])[0]} y={P([0, 0, -BOX_HALF])[1] + 18} textAnchor="middle">
            crystal
          </text>
          <text x={(fx + gx) / 2} y={Math.max(fy, gy) + 18} textAnchor="middle">
            film
          </text>
          {labelRight ? (
            <text x={edgeX} y={my + 4} fill={XR.accent}>
              all in step: a spot
            </text>
          ) : (
            <text x={P([FILM_X, -FILM_HALF, FILM_HALF])[0]} y={topY - 8} textAnchor="end" fill={XR.accent}>
              all in step: a spot
            </text>
          )}
        </Labels>
      </svg>
    </div>
  );
}
