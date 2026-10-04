// Spots from one flat layer of a square lattice, beam perpendicular to it, on a flat film seen face-on.
import { useId } from "react";
import { XR } from "./palette";

/** A spot's place on the film, in units of the film's half-width, and its raw strength. */
export type Spot = { X: number; Y: number; s: number };

/** Film position for a direction with in-plane components (kx, ky), or null if it misses. */
export function onFilm(kx: number, ky: number, edgeTan: number): [number, number] | null {
  const kz2 = 1 - kx * kx - ky * ky;
  if (kz2 <= 0) return null;
  const kz = Math.sqrt(kz2);
  const X = kx / kz / edgeTan;
  const Y = ky / kz / edgeTan;
  return Math.abs(X) <= 0.97 && Math.abs(Y) <= 0.97 ? [X, Y] : null;
}

/**
 * Every in-step direction (h, k) of a square lattice of spacing `cell` that lands
 * on the film, except straight ahead, which the beam stop hides.
 */
export function latticeSpots(
  cell: number,
  lambda: number,
  edgeTan: number,
  strength: (h: number, k: number) => number,
): Spot[] {
  const spots: Spot[] = [];
  const reach = Math.ceil(cell / lambda);
  for (let h = -reach; h <= reach; h++)
    for (let k = -reach; k <= reach; k++) {
      if (!h && !k) continue;
      const p = onFilm((lambda * h) / cell, (lambda * k) / cell, edgeTan);
      if (p) spots.push({ X: p[0], Y: p[1], s: strength(h, k) });
    }
  return spots;
}

/**
 * A film seen face-on. Spot darkness follows strength / max, compressed by a
 * square root unless `linear`, so that faint spots stay visible.
 */
export function SpotFilm({
  x,
  y,
  size,
  spots = [],
  max = 1,
  haze,
  linear = false,
}: {
  x: number;
  y: number;
  size: number;
  spots?: Spot[];
  max?: number;
  haze?: { offset: number; o: number }[];
  linear?: boolean;
}) {
  const id = useId();
  const c = size / 2;
  const r = Math.max(1.6, Math.min(2.6, size / 110));
  return (
    <g>
      {haze && (
        <defs>
          <radialGradient id={id} gradientUnits="userSpaceOnUse" cx={x + c} cy={y + c} r={c * Math.SQRT2}>
            {haze.map(({ offset, o }) => (
              <stop key={offset} offset={offset} stopColor={XR.sum} stopOpacity={o} />
            ))}
          </radialGradient>
        </defs>
      )}
      <rect x={x} y={y} width={size} height={size} fill={XR.film} />
      {haze && <rect x={x} y={y} width={size} height={size} fill={`url(#${id})`} />}
      <g fill={XR.sum}>
        {spots.map(({ X, Y, s }) => (
          <circle
            key={`${X}-${Y}`}
            cx={x + c + X * c}
            cy={y + c + Y * c}
            r={r}
            fillOpacity={linear ? 0.06 + 0.94 * (s / max) : 0.12 + 0.88 * Math.sqrt(s / max)}
          />
        ))}
      </g>
      <circle cx={x + c} cy={y + c} r={Math.max(5, size / 30)} fill={XR.label} />
      <rect x={x} y={y} width={size} height={size} fill="none" stroke={XR.atom} strokeWidth={0.75} />
    </g>
  );
}
