// Exposure of a flat film by X-rays scattered from point atoms, beam along +x.

export type Pt = [number, number];

/** A block in front of the film; it stops any ray that crosses it. */
export type BeamStop = { x: number; y: number; half: number };

const blockedBy = (stop: BeamStop | undefined, [ax, ay]: Pt, filmX: number, y: number) =>
  !!stop && Math.abs(ay + ((y - ay) * (stop.x - ax)) / (filmX - ax) - stop.y) <= stop.half;

/**
 * Exposure at film point (filmX, y), in units where one atom gives 1 at the
 * centre of the film: each atom's wave has height `ref / r` at distance r, and
 * waves add by their total path (to the atom along the beam, then to the film).
 * The final factor is the obliquity of a flat film, cos θ.
 */
export function filmExposure(
  atoms: Pt[],
  lambda: number,
  filmX: number,
  y: number,
  stop?: BeamStop,
) {
  const k = (2 * Math.PI) / lambda;
  const cx = atoms.reduce((s, a) => s + a[0], 0) / atoms.length;
  const cy = atoms.reduce((s, a) => s + a[1], 0) / atoms.length;
  const ref = filmX - cx;
  let re = 0;
  let im = 0;
  for (const atom of atoms) {
    if (blockedBy(stop, atom, filmX, y)) continue;
    const [ax, ay] = atom;
    const r = Math.hypot(filmX - ax, y - ay);
    const phase = k * (ax + r);
    re += (ref / r) * Math.cos(phase);
    im += (ref / r) * Math.sin(phase);
  }
  const cosTheta = ref / Math.hypot(ref, y - cy);
  return (re * re + im * im) * cosTheta;
}

/** Film darkness for an exposure, on a scale where 4 (two atoms in step) is near black. */
export const filmOpacity = (exposure: number) =>
  Math.min(0.92, (0.88 * exposure) / 4);

/** Gradient stops down a film from `top` to `bottom`, sampled every `step`. */
export function filmGradient(
  atoms: Pt[],
  lambda: number,
  filmX: number,
  top: number,
  bottom: number,
  stop?: BeamStop,
  step = 1.5,
) {
  const stops: { offset: number; o: number }[] = [];
  for (let y = top; y <= bottom; y += step) {
    stops.push({
      offset: (y - top) / (bottom - top),
      o: filmOpacity(filmExposure(atoms, lambda, filmX, y, stop)),
    });
  }
  return stops;
}

/**
 * Where a circle of radius r1 about the upper atom meets one of radius r2 about
 * the lower atom, `d` below it, on the film side. Offsets from the upper atom.
 */
export function crossing(d: number, r1: number, r2: number): Pt | null {
  const v = (d * d + r1 * r1 - r2 * r2) / (2 * d);
  const u2 = r1 * r1 - v * v;
  return u2 < 0 ? null : [Math.sqrt(u2), v];
}
