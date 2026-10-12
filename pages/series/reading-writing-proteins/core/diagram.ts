// Gibbs and McIntyre's 1970 diagram: a dot wherever two residues are the same,
// read along its diagonals.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

// Diagonal d holds the cells where the down sequence's index minus the across
// sequence's index is d, so the principal diagonal is 0 and d matches Fitch's
// register shift.
export type Diagonal = { d: number; cells: number; matches: number };

export function dots(down: string, across: string): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < down.length; i++) {
    for (let j = 0; j < across.length; j++) if (down[i] === across[j]) out.push([i, j]);
  }
  return out;
}

export function diagonals(down: string, across: string): Diagonal[] {
  const out: Diagonal[] = [];
  for (let d = -(across.length - 1); d <= down.length - 1; d++) {
    let cells = 0;
    let matches = 0;
    for (let i = Math.max(0, d); i < down.length && i - d < across.length; i++) {
      cells++;
      if (down[i] === across[i - d]) matches++;
    }
    out.push({ d, cells, matches });
  }
  return out;
}

// Unbroken runs along every diagonal, counted by length (runs[s] is the number
// of runs of s contiguous matches). Gibbs and McIntyre call s matches a run of
// s − 1 (p. 10).
export function runs(down: string, across: string): number[] {
  const count: number[] = [];
  const add = (run: number) => run > 0 && (count[run] = (count[run] ?? 0) + 1);
  for (let d = -(across.length - 1); d <= down.length - 1; d++) {
    let run = 0;
    for (let i = Math.max(0, d); i < down.length && i - d < across.length; i++) {
      if (down[i] === across[i - d]) run++;
      else {
        add(run);
        run = 0;
      }
    }
    add(run);
  }
  return Array.from({ length: count.length }, (_, s) => count[s] ?? 0);
}

// The chance that a cell holds a dot when neither sequence's order means
// anything: NMATCH / (N1 N2), from the two compositions (p. 10).
export function matchChance(down: string, across: string): number {
  const n: Record<string, number> = {};
  for (const x of across) n[x] = (n[x] ?? 0) + 1;
  let nmatch = 0;
  for (const x of down) nmatch += n[x] ?? 0;
  return nmatch / (down.length * across.length);
}

// Expected number of runs of s contiguous matches by chance (Appendix 1).
export function expectedRuns(n1: number, n2: number, p: number, s: number): number {
  const q = 1 - p;
  return p ** s * (q * q * (n1 - s - 1) * (n2 - s - 1) + 2 * q * (n1 + n2 - 2 * s - 1) + 2);
}

// Running sums of `width` adjacent diagonal totals, placed at the central one
// (Fig. 6B). Diagonals too near either end for a full window are left out.
export function smoothed(values: number[], width: number): (number | null)[] {
  const half = Math.floor(width / 2);
  return values.map((_, k) =>
    k < half || k + half >= values.length ? null : values.slice(k - half, k + half + 1).reduce((a, b) => a + b, 0)
  );
}
