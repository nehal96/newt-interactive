// A Patterson map: the molecule seen from each of its atoms in turn, stacked; computed from the atoms shown.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Note } from "./TwoAtoms";
import { contourPath } from "./contour";

type Atom = { x: number; y: number; f: number };

/** Map half-width and atom blur, in Å. */
const REACH = 26;
const GRID = 105;
const SIGMA = 1.1;

/** Every pair of atoms adds a blurred peak at the arrow between them, drawn from the centre. */
function patterson(atoms: Atom[]) {
  const map = new Float64Array(GRID * GRID);
  const perA = (GRID - 1) / (2 * REACH);
  const r = Math.ceil(3 * SIGMA * perA);
  for (const a of atoms)
    for (const b of atoms) {
      const gx = (b.x - a.x + REACH) * perA;
      const gy = (b.y - a.y + REACH) * perA;
      const ix0 = Math.round(gx);
      const iy0 = Math.round(gy);
      for (let iy = iy0 - r; iy <= iy0 + r; iy++) {
        if (iy < 0 || iy >= GRID) continue;
        for (let ix = ix0 - r; ix <= ix0 + r; ix++) {
          if (ix < 0 || ix >= GRID) continue;
          const d2 = ((ix - gx) ** 2 + (iy - gy) ** 2) / perA ** 2;
          map[iy * GRID + ix] += a.f * b.f * Math.exp(-d2 / (2 * SIGMA ** 2));
        }
      }
    }
  return map;
}

const TRIO: Atom[] = [
  { x: -6, y: 3, f: 1 },
  { x: 5, y: 5, f: 1 },
  { x: -1, y: -6, f: 1 },
];

/** The spacings of the rods in Perutz's 1949 map. */
const CHAIN_GAP = 10.5;
const STEP = 2.5;
const PER_CHAIN = 13;
const OFFSETS = [0.4, 3.1, 1.7, 4.2];

const PARALLEL: Atom[] = OFFSETS.flatMap((dx, c) =>
  Array.from({ length: PER_CHAIN }, (_, i) => ({
    x: (i - (PER_CHAIN - 1) / 2) * STEP + dx - 2.5,
    y: (c - 1.5) * CHAIN_GAP,
    f: i % 2 ? 0.6 : 1,
  })),
);

/** The same chains, each step turned at random, kept apart and inside the same box. */
const TANGLE: Atom[] = (() => {
  let seed = 11;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (;;) {
    const atoms: Atom[] = [];
    let ok = true;
    for (let c = 0; c < OFFSETS.length && ok; c++) {
      let x = (rand() - 0.5) * 18;
      let y = (c - 1.5) * CHAIN_GAP * 0.8;
      let heading = rand() * Math.PI * 2;
      for (let i = 0; i < PER_CHAIN && ok; i++) {
        let placed = false;
        for (let tries = 0; tries < 60 && !placed; tries++) {
          const turn = i === 0 ? 0 : (rand() - 0.5) * 2.4;
          const h = heading + turn;
          const nx = i === 0 ? x : x + STEP * Math.cos(h);
          const ny = i === 0 ? y : y + STEP * Math.sin(h);
          const clear = atoms.every(
            (a, k) =>
              (k === atoms.length - 1 && i > 0) ||
              Math.hypot(a.x - nx, a.y - ny) > 3.6,
          );
          if (Math.abs(nx) < 19 && Math.abs(ny) < 19 && clear) {
            atoms.push({ x: nx, y: ny, f: i % 2 ? 0.6 : 1 });
            x = nx;
            y = ny;
            heading = h;
            placed = true;
          }
        }
        if (!placed) ok = false;
      }
    }
    if (ok) return atoms;
  }
})();

const ORIGIN = (atoms: Atom[]) => atoms.reduce((s, a) => s + a.f * a.f, 0);
const MAPS = {
  trio: patterson(TRIO),
  parallel: patterson(PARALLEL),
  tangle: patterson(TANGLE),
};
const LEVELS = [0.2, 0.35, 0.55, 0.8];

function Frame({
  x,
  y,
  size,
  label,
}: {
  x: number;
  y: number;
  size: number;
  label?: string;
}) {
  return (
    <>
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill={XR.film}
        stroke={XR.atom}
        strokeWidth={0.75}
      />
      {label && (
        <text
          x={x}
          y={y - 7}
          className="font-mono"
          fontSize={10}
          fill={XR.label}
        >
          {label}
        </text>
      )}
    </>
  );
}

function AtomsSquare({
  x,
  y,
  size,
  atoms,
  span,
  centre = { x: 0, y: 0 },
  chain,
  joinAll = false,
  standing,
  numbered = false,
  label,
}: {
  x: number;
  y: number;
  size: number;
  atoms: Atom[];
  span: number;
  centre?: { x: number; y: number };
  chain?: number;
  joinAll?: boolean;
  standing?: number;
  numbered?: boolean;
  label?: string;
}) {
  const clip = useId();
  const s = size / (2 * span);
  const P = (a: Atom) =>
    [
      x + size / 2 + (a.x - centre.x) * s,
      y + size / 2 - (a.y - centre.y) * s,
    ] as const;
  const r = (a: Atom) =>
    Math.max(2, (chain ? 0.8 : 1.6) * s * (0.6 + 0.4 * a.f));
  const pairs: [number, number][] = joinAll
    ? atoms.flatMap((_, i) =>
        atoms.slice(i + 1).map((__, j) => [i, i + 1 + j] as [number, number]),
      )
    : chain
      ? atoms
          .map((_, i) => [i, i + 1] as [number, number])
          .filter(([i]) => i % chain !== chain - 1)
      : [];
  return (
    <g>
      <Frame x={x} y={y} size={size} label={label} />
      <defs>
        <clipPath id={clip}>
          <rect x={x} y={y} width={size} height={size} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <g stroke={XR.atom} strokeWidth={1}>
          {pairs.map(([i, j]) => {
            const [x0, y0] = P(atoms[i]);
            const [x1, y1] = P(atoms[j]);
            return <line key={`${i}-${j}`} x1={x0} y1={y0} x2={x1} y2={y1} />;
          })}
        </g>
        {standing !== undefined && (
          <g stroke={XR.label} strokeWidth={0.75} strokeDasharray="2 3">
            <line x1={x + size / 2} x2={x + size / 2} y1={y} y2={y + size} />
            <line x1={x} x2={x + size} y1={y + size / 2} y2={y + size / 2} />
          </g>
        )}
        {atoms.map((a, i) => {
          const [cx, cy] = P(a);
          const here = i === standing;
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r={r(a)}
                fill={here ? XR.first : XR.molecule}
                stroke={here ? XR.first : XR.moleculeEdge}
                strokeWidth={0.75}
              />
              {numbered && (
                <text
                  x={cx}
                  y={cy + 3.5}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={10}
                  fill={here ? XR.film : XR.sum}
                >
                  {i + 1}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </g>
  );
}

function MapSquare({
  x,
  y,
  size,
  map,
  origin,
  span = REACH,
  copies,
  label,
}: {
  x: number;
  y: number;
  size: number;
  map: Float64Array;
  origin: number;
  span?: number;
  copies?: Atom[];
  label?: string;
}) {
  const clip = useId();
  const zoom = REACH / span;
  const g = (size * zoom) / (GRID - 1);
  const off = (size - size * zoom) / 2;
  const s = size / (2 * span);
  const cx = x + size / 2;
  const cy = y + size / 2;
  return (
    <g>
      <Frame x={x} y={y} size={size} label={label} />
      <defs>
        <clipPath id={clip}>
          <rect x={x} y={y} width={size} height={size} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {copies && (
          <g stroke={XR.molecule} strokeWidth={1.25}>
            {copies.map((o, k) =>
              copies.flatMap((a, i) =>
                copies
                  .slice(i + 1)
                  .map((b, j) => (
                    <line
                      key={`${k}-${i}-${j}`}
                      x1={cx + (a.x - o.x) * s}
                      y1={cy - (a.y - o.y) * s}
                      x2={cx + (b.x - o.x) * s}
                      y2={cy - (b.y - o.y) * s}
                    />
                  )),
              ),
            )}
          </g>
        )}
        <path
          d={contourPath(
            map,
            GRID,
            LEVELS.map((l) => l * origin),
          )}
          transform={`translate(${x + off} ${y + off + size * zoom}) scale(${g} ${-g})`}
          fill="none"
          stroke={XR.sum}
          strokeWidth={1 / g}
          strokeLinecap="round"
        />
      </g>
      <line x1={cx} x2={cx} y1={y + size} y2={y + size + 4} stroke={XR.label} />
      <line x1={x - 4} x2={x} y1={cy} y2={cy} stroke={XR.label} />
    </g>
  );
}

function useGrid(W: number) {
  const inRow = W >= 600;
  const gap = inRow ? 20 : 16;
  const top = 18;
  const size = inRow ? (W - 3 * gap) / 4 : Math.min(170, (W - gap) / 2);
  const left = inRow ? 0 : (W - 2 * size - gap) / 2;
  const cells = [0, 1, 2, 3].map((i) =>
    inRow
      ? { x: i * (size + gap), y: top }
      : {
          x: left + (i % 2) * (size + gap),
          y: top + Math.floor(i / 2) * (top + size + 14),
        },
  );
  const H = inRow ? top + size + 8 : 2 * (top + size) + 20;
  return { size, cells, H };
}

const TRIO_SPAN = 14;

export function PattersonMap() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const { size, cells, H } = useGrid(W);

  return (
    <div ref={ref} className="flex w-full flex-col gap-8">
      <div>
        <Note title="1. Stand on each atom in turn">
          Put one atom at the centre and look at where the others are. Do the
          same from every atom, then stack the views. The stack is the Patterson
          map: its peaks mark how far each atom is from every other, and in
          which direction. The big peak in the middle is every atom on itself.
        </Note>
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="mt-3 block"
          role="img"
          aria-labelledby={`${ids}a`}
        >
          <title id={`${ids}a`}>
            A molecule of three atoms seen with atom 1, 2 and 3 in turn at the
            centre. Stacked, the three views give a Patterson map with a peak at
            the centre and six around it.
          </title>
          {TRIO.map((a, k) => (
            <AtomsSquare
              key={k}
              x={cells[k].x}
              y={cells[k].y}
              size={size}
              atoms={TRIO}
              span={TRIO_SPAN}
              centre={a}
              joinAll
              standing={k}
              numbered
              label={`from atom ${k + 1}`}
            />
          ))}
          <MapSquare
            x={cells[3].x}
            y={cells[3].y}
            size={size}
            map={MAPS.trio}
            origin={ORIGIN(TRIO)}
            span={TRIO_SPAN}
            copies={TRIO}
            label="all three, stacked"
          />
        </svg>
      </div>
      <div>
        <Note title="2. Parallel chains or a tangle?">
          Stand on any atom in a set of parallel chains and the view is much the
          same: chains running past at the same distances. So the peaks pile up
          into straight lines, which Perutz called rods. In a tangle every atom
          has a different view, and the peaks spread into a blur.
        </Note>
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="mt-3 block"
          role="img"
          aria-labelledby={`${ids}b`}
        >
          <title id={`${ids}b`}>
            Four straight parallel chains give a Patterson map of straight rods.
            The same chains, kinked at random, give a map with only the centre
            peak and a faint blur.
          </title>
          <AtomsSquare
            x={cells[0].x}
            y={cells[0].y}
            size={size}
            atoms={PARALLEL}
            span={REACH - 4}
            chain={PER_CHAIN}
            label="parallel chains"
          />
          <MapSquare
            x={cells[1].x}
            y={cells[1].y}
            size={size}
            map={MAPS.parallel}
            origin={ORIGIN(PARALLEL)}
            label="Patterson map"
          />
          <AtomsSquare
            x={cells[2].x}
            y={cells[2].y}
            size={size}
            atoms={TANGLE}
            span={REACH - 4}
            chain={PER_CHAIN}
            label="tangled"
          />
          <MapSquare
            x={cells[3].x}
            y={cells[3].y}
            size={size}
            map={MAPS.tangle}
            origin={ORIGIN(TANGLE)}
            label="Patterson map"
          />
        </svg>
      </div>
    </div>
  );
}
