// A whole crystal and the film it exposes: dark only at a few spots.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { Note } from "./Figure";
import SPOT_ROWS from "./crystal-spots.json";

type V3 = [number, number, number];

/**
 * Spots on a film half as wide as its distance from the crystal, as fractions of the film's half-width, with darkness
 * 0.15–1: the 1938 horse methaemoglobin cell (109 × 63.2 × 54.2 Å, β 112°, C2) rocked 5° in 1.54 Å x-rays, with a
 * made-up 40-atom molecule for the darkness.
 */
const SPOTS = (SPOT_ROWS as number[][]).map(([y, z, o]) => ({ y, z, o }));

/** Two of the darker spots, one toward the upper right of the film on screen and one toward the lower left. */
const MARKED = [
  SPOTS.filter((s) => s.o > 0.5 && Math.hypot(s.y, s.z) > 0.45).reduce((a, b) => (b.z - b.y > a.z - a.y ? b : a)),
  SPOTS.filter((s) => s.o >= 0.4 && s.y > 0.3 && s.z < -0.3).reduce((a, b) => (b.y - b.z > a.y - a.z ? b : a)),
];

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
const BEAM_FROM = -0.65;
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
  const pad = { t: 12, b: 26 };
  const k = Math.min((Math.min(W, 560) - 12) / (maxX - minX), 150 / (maxY - minY));
  const left = (W - k * (maxX - minX)) / 2;
  const H = Math.round(pad.t + k * (maxY - minY) + pad.b);
  const P = (p: V3): [number, number] => {
    const [x, y] = flat(p);
    return [left + (x - minX) * k, pad.t + (y - minY) * k];
  };
  const poly = (pts: V3[]) => pts.map((p) => P(p).map((v) => v.toFixed(1)).join(",")).join(" ");

  const [b0x, b0y] = P([BEAM_FROM, 0, 0]);
  const [b1x, b1y] = P([-BOX_HALF - 0.15, 0, 0]);
  const ang = Math.atan2(b1y - b0y, b1x - b0x);
  const head = `M${b1x} ${b1y} L${b1x - 10 * Math.cos(ang) + 5 * Math.sin(ang)} ${b1y - 10 * Math.sin(ang) - 5 * Math.cos(ang)} L${b1x - 10 * Math.cos(ang) - 5 * Math.sin(ang)} ${b1y - 10 * Math.sin(ang) + 5 * Math.cos(ang)} Z`;

  const rays = MARKED.map((m) => {
    const target = filmPoint(m.y, m.z);
    const exit: V3 = [BOX_HALF, (target[1] * BOX_HALF) / target[0], (target[2] * BOX_HALF) / target[0]];
    return { m, from: P(exit), to: P(target) };
  });
  const spotR = 0.0056;
  const [fx, fy] = P([FILM_X, -FILM_HALF, -FILM_HALF]);
  const [gx, gy] = P([FILM_X, FILM_HALF, -FILM_HALF]);

  return (
    <div ref={ref}>
      <Note title="2. A whole crystal makes spots">
        A crystal repeats the same atoms over and over. At most points on the film, their waves cancel. At a few, they
        all arrive in step, and those become spots.
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

        <g stroke={XR.guide} strokeWidth={0.75}>
          {BOX_EDGES.map(([i, j]) => {
            const [x1, y1] = P(BOX[i]);
            const [x2, y2] = P(BOX[j]);
            return <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </g>
        <g fill={XR.ink}>
          {ATOMS.map((a, i) => {
            const [x, y] = P(a);
            return <circle key={i} cx={x} cy={y} r={Math.min(2.4, Math.max(1.4, k * 0.012))} />;
          })}
        </g>

        <polygon points={poly(FILM)} fill={XR.film} stroke={XR.guide} strokeWidth={0.75} />
        <g fill={XR.ink}>
          {SPOTS.map((s, i) => (
            <polygon key={i} points={poly(ring(s.y, s.z, spotR))} fillOpacity={s.o} />
          ))}
        </g>
        <polygon points={poly(ring(0, 0, 0.013))} fill={XR.label} />
        {rays.map(({ m, from, to }) => (
          <g key={`${m.y},${m.z}`}>
            <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={XR.accent} strokeWidth={1.25} />
            <polygon points={poly(ring(m.y, m.z, 0.018))} fill="none" stroke={XR.accent} strokeWidth={1.5} />
          </g>
        ))}

        <Labels size={text}>
          <text x={b0x} y={b0y - 14}>x-rays</text>
          <text x={P([0, 0, 0])[0]} y={P([0, 0, -BOX_HALF])[1] + 18} textAnchor="middle">
            crystal
          </text>
          <text x={(fx + gx) / 2} y={Math.max(fy, gy) + 18} textAnchor="middle">
            film
          </text>
        </Labels>
      </svg>
    </div>
  );
}
