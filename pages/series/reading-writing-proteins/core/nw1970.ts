// Needleman and Wunsch's 1970 array, filled the way their paper does it: from
// the last row and column back toward the first, each cell adding the largest
// value it can reach in the row and column beyond it.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

export type Pos = [number, number];

// The paper's array has protein A across the columns and protein B down the
// rows (p. 444); `across` and `down` keep that order.
export type NWArray = {
  across: string;
  down: string;
  penalty: number;
  /** The cell's own value: 1 for the same amino acid, 0 otherwise. */
  own: number[][];
  /** The value after the summation. */
  mat: number[][];
  /** Every cell in the subrow and subcolumn that gave the cell its value. */
  from: Pos[][][];
};

// Bottom row first, each row right to left, as in Fig. 1.
export function fillOrder(rows: number, cols: number): Pos[] {
  const out: Pos[] = [];
  for (let i = rows - 1; i >= 0; i--) for (let j = cols - 1; j >= 0; j--) out.push([i, j]);
  return out;
}

// The cells a pathway through (i, j) may step to next: the rest of row i + 1
// and the rest of column j + 1 (Fig. 1's bordered subrow and subcolumn).
export function reach(i: number, j: number, rows: number, cols: number): Pos[] {
  if (i + 1 >= rows || j + 1 >= cols) return [];
  const out: Pos[] = [];
  for (let k = j + 1; k < cols; k++) out.push([i + 1, k]);
  for (let k = i + 2; k < rows; k++) out.push([k, j + 1]);
  return out;
}

// What a step from (i, j) to `to` is worth: its value, less the penalty when the
// step leaves the diagonal.
export const stepValue = (mat: number[][], [i, j]: Pos, [k, l]: Pos, penalty: number) =>
  mat[k][l] - (k - i === 1 && l - j === 1 ? 0 : penalty);

export function nwArray(across: string, down: string, penalty = 0): NWArray {
  const rows = down.length;
  const cols = across.length;
  const own: number[][] = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (down[i] === across[j] ? 1 : 0))
  );
  const mat: number[][] = own.map((row) => [...row]);
  const from: Pos[][][] = own.map((row) => row.map(() => []));
  for (const [i, j] of fillOrder(rows, cols)) {
    const cells = reach(i, j, rows, cols);
    if (!cells.length) continue;
    const best = Math.max(...cells.map((c) => stepValue(mat, [i, j], c, penalty)));
    mat[i][j] = own[i][j] + best;
    from[i][j] = cells.filter((c) => stepValue(mat, [i, j], c, penalty) === best);
  }
  return { across, down, penalty, own, mat, from };
}

// The maximum match: the largest value in the first row or first column, and
// the cells that hold it.
export function maximumMatch({ mat }: NWArray): { value: number; starts: Pos[] } {
  const edge: Pos[] = [...mat[0].map((_, j): Pos => [0, j]), ...mat.slice(1).map((_, k): Pos => [k + 1, 0])];
  const value = Math.max(...edge.map(([i, j]) => mat[i][j]));
  return { value, starts: edge.filter(([i, j]) => mat[i][j] === value) };
}

// Every tied maximum-match pathway, up to `limit` of them.
export function pathways(nw: NWArray, limit = 64): Pos[][] {
  const out: Pos[][] = [];
  const walk = (path: Pos[]) => {
    if (out.length >= limit) return;
    const [i, j] = path[path.length - 1];
    const next = nw.from[i][j];
    if (!next.length) out.push(path);
    else for (const c of next) walk([...path, c]);
  };
  for (const s of maximumMatch(nw).starts) walk([s]);
  return out;
}

const isGapStep = ([i, j]: Pos, [k, l]: Pos) => !(k - i === 1 && l - j === 1);

// The tied pathway with the fewest gaps, which is what Table 1 reports under
// "Minimum deletions".
export function fewestGaps(nw: NWArray): Pos[] {
  const memo = new Map<string, number>();
  const gaps = (p: Pos): number => {
    const key = p.join();
    if (!memo.has(key)) {
      const next = nw.from[p[0]][p[1]];
      memo.set(key, next.length ? Math.min(...next.map((c) => gaps(c) + (isGapStep(p, c) ? 1 : 0))) : 0);
    }
    return memo.get(key)!;
  };
  const cost = (p: Pos, c: Pos) => gaps(c) + (isGapStep(p, c) ? 1 : 0);
  const { starts } = maximumMatch(nw);
  const path = [starts.reduce((best, s) => (gaps(s) < gaps(best) ? s : best))];
  for (;;) {
    const cur = path[path.length - 1];
    const next = nw.from[cur[0]][cur[1]];
    if (!next.length) return path;
    path.push(next.reduce((best, c) => (cost(cur, c) < cost(cur, best) ? c : best)));
  }
}

export type Tied = { paths: bigint; gaps: [number, number]; matches: [number, number] };

// How many pathways tie and what they span, counted without walking them.
export function tied(nw: NWArray): Tied {
  const memo = new Map<string, Tied>();
  const at = (p: Pos): Tied => {
    const key = p.join();
    if (memo.has(key)) return memo.get(key)!;
    const own = nw.own[p[0]][p[1]];
    const next = nw.from[p[0]][p[1]];
    const out: Tied = next.length
      ? merge(next.map((c) => shift(at(c), isGapStep(p, c) ? 1 : 0, own)))
      : { paths: BigInt(1), gaps: [0, 0], matches: [own, own] };
    memo.set(key, out);
    return out;
  };
  return merge(maximumMatch(nw).starts.map(at));
}

const shift = (t: Tied, gap: number, own: number): Tied => ({
  paths: t.paths,
  gaps: [t.gaps[0] + gap, t.gaps[1] + gap],
  matches: [t.matches[0] + own, t.matches[1] + own],
});

const merge = (all: Tied[]): Tied => ({
  paths: all.reduce((n, t) => n + t.paths, BigInt(0)),
  gaps: [Math.min(...all.map((t) => t.gaps[0])), Math.max(...all.map((t) => t.gaps[1]))],
  matches: [Math.min(...all.map((t) => t.matches[0])), Math.max(...all.map((t) => t.matches[1]))],
});

// A pathway written as two gapped rows, `across` on top. Residues before the
// pathway starts and after it ends hang off the ends as end gaps.
export function pathToRows(nw: NWArray, path: Pos[]): { top: string[]; bottom: string[] } {
  const top: string[] = [];
  const bottom: string[] = [];
  let i = 0;
  let j = 0;
  const flush = (toI: number, toJ: number) => {
    while (j < toJ) (top.push(nw.across[j++]), bottom.push("-"));
    while (i < toI) (top.push("-"), bottom.push(nw.down[i++]));
  };
  for (const [pi, pj] of path) {
    flush(pi, pj);
    top.push(nw.across[j++]);
    bottom.push(nw.down[i++]);
  }
  flush(nw.down.length, nw.across.length);
  return { top, bottom };
}

// How many cells the fill reads: each cell scans its subrow and subcolumn.
export function readsToFill(rows: number, cols: number): number {
  let n = 0;
  for (let i = 0; i < rows - 1; i++) for (let j = 0; j < cols - 1; j++) n += cols - j - 1 + (rows - i - 2);
  return n;
}

// The example in their Figs. 1 and 2 (p. 445). The letters stand for amino
// acids in general, not the one-letter code.
export const FIG_1 = { across: "ABCNJRQCLCRPM", down: "AJCJNRCKCRBP" };
