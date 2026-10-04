// Where spots land on a flat film when a crystal is rocked about one axis in a monochromatic beam.

export type Cell = { a: number; b: number; c: number; beta: number };

export type OscillationSpot = { h: number; k: number; l: number; y: number; z: number };

type V3 = [number, number, number];
const cross = (u: V3, v: V3): V3 => [
  u[1] * v[2] - u[2] * v[1],
  u[2] * v[0] - u[0] * v[2],
  u[0] * v[1] - u[1] * v[0],
];
const dot = (u: V3, v: V3) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];

/**
 * Monoclinic cell with b along the rotation axis (z) and the beam along +x.
 * A reflection records when its reciprocal-lattice point crosses the sphere of
 * reflection during the rock from `from` to `to` degrees. Film coordinates are
 * in the units of `distance`, measured from where the straight-through beam lands.
 */
export function oscillationSpots({
  cell,
  lambda,
  distance,
  dMin,
  from,
  to,
  absent = () => false,
}: {
  cell: Cell;
  lambda: number;
  distance: number;
  dMin: number;
  from: number;
  to: number;
  absent?: (h: number, k: number, l: number) => boolean;
}): OscillationSpot[] {
  const beta = (cell.beta * Math.PI) / 180;
  const A: V3 = [cell.a, 0, 0];
  const B: V3 = [0, 0, cell.b];
  const C: V3 = [cell.c * Math.cos(beta), cell.c * Math.sin(beta), 0];
  const V = dot(A, cross(B, C));
  const As = cross(B, C).map((x) => x / V) as V3;
  const Bs = cross(C, A).map((x) => x / V) as V3;
  const Cs = cross(A, B).map((x) => x / V) as V3;

  const sMax = 1 / dMin;
  const k0 = 1 / lambda;
  const lo = (from * Math.PI) / 180;
  const hi = (to * Math.PI) / 180;
  const H = Math.ceil(cell.a * sMax);
  const K = Math.ceil(cell.b * sMax);
  const L = Math.ceil(cell.c * sMax);
  const spots: OscillationSpot[] = [];

  for (let h = -H; h <= H; h++)
    for (let k = -K; k <= K; k++)
      for (let l = -L; l <= L; l++) {
        if ((!h && !k && !l) || absent(h, k, l)) continue;
        const g: V3 = [0, 1, 2].map((i) => h * As[i] + k * Bs[i] + l * Cs[i]) as V3;
        const g2 = dot(g, g);
        if (g2 > sMax * sMax) continue;
        const rho = Math.hypot(g[0], g[1]);
        const rhs = (-lambda * g2) / 2;
        if (rho < Math.abs(rhs)) continue;
        // Rotated by φ about z, the point's x-component is ρ cos(φ + α); it lies on the sphere when that equals −λ|g|²/2.
        const alpha = Math.atan2(g[1], g[0]);
        const base = Math.acos(rhs / rho);
        for (const raw of [base - alpha, -base - alpha]) {
          const phi = ((((raw + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) - Math.PI;
          if (phi < lo || phi > hi) continue;
          const kx = k0 + g[0] * Math.cos(phi) - g[1] * Math.sin(phi);
          const ky = g[0] * Math.sin(phi) + g[1] * Math.cos(phi);
          const kz = g[2];
          if (kx <= 0) continue;
          spots.push({ h, k, l, y: (distance * ky) / kx, z: (distance * kz) / kx });
        }
      }
  return spots;
}
