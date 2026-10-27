// A one-dimensional unit cell of three equal atoms, and what it and a row of its copies send to the film.

/** Atom positions across the cell, as fractions of its width. The middle one is the movable one. */
export const ATOMS = [0.12, 0.35, 0.7];

/** The same cell flipped end to end: the same gaps between atoms, in the other order, so the same film. */
export const FLIPPED = [0.12, 0.47, 0.7];

/**
 * At film position `s` (spot n sits at s = n), an atom at fraction x of the cell
 * arrives s·x of a wave behind one at the cell's edge.
 */
export const lag = (s: number, x: number) => s * x;

/** Height of the three atoms' summed wave at film position `s`. */
export function cellHeight(s: number, atoms: number[]) {
  let re = 0;
  let im = 0;
  for (const x of atoms) {
    re += Math.cos(2 * Math.PI * lag(s, x));
    im += Math.sin(2 * Math.PI * lag(s, x));
  }
  return Math.hypot(re, im);
}

/** Where the summed wave's crests sit at spot n, as a fraction of a cycle, measured from the cell's edge. */
export function cellPhase(n: number, atoms: number[]) {
  let re = 0;
  let im = 0;
  for (const x of atoms) {
    re += Math.cos(2 * Math.PI * lag(n, x));
    im += Math.sin(2 * Math.PI * lag(n, x));
  }
  const p = Math.atan2(im, re) / (2 * Math.PI);
  return p - Math.floor(p);
}

/** How well `n` cells in a row line up at film position `s`: 1 at a spot, falling to 0 between. */
export function lineUp(s: number, n: number) {
  const den = Math.sin(Math.PI * s);
  if (Math.abs(den) < 1e-9) return 1;
  const v = Math.sin(n * Math.PI * s) / (n * den);
  return v * v;
}
