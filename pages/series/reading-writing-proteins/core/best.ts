// The best alignment under the 1970 rules: identical pairs score 1, every gap
// costs `penalty` whatever its length, and gaps at the ends are free.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

import type { Alignment } from "./alignment";

export type Best = {
  score: number;
  matches: number;
  gaps: number;
  alignment: Alignment;
};

// A path may jump between diagonals in one step only if one index moves by
// exactly one, so each cell looks back along a whole row and column. Searching
// forward gives the same maximum as N&W's backward fill.
export function bestAlignment(a: string, b: string, penalty: number): Best {
  const n = a.length;
  const m = b.length;
  const S = Array.from({ length: n }, () => new Float64Array(m));
  const from = Array.from({ length: n }, () => new Int32Array(m).fill(-1));
  const G = Array.from({ length: n }, () => new Int32Array(m));
  let best = -Infinity;
  let end = -1;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let v = 0;
      let src = -1;
      let gaps = 0;
      if (i > 0 && j > 0) {
        if (S[i - 1][j - 1] > v) {
          v = S[i - 1][j - 1];
          src = (i - 1) * m + (j - 1);
          gaps = G[i - 1][j - 1];
        }
        for (let k = 0; k < i - 1; k++) {
          if (S[k][j - 1] - penalty > v) {
            v = S[k][j - 1] - penalty;
            src = k * m + (j - 1);
            gaps = G[k][j - 1] + 1;
          }
        }
        for (let l = 0; l < j - 1; l++) {
          if (S[i - 1][l] - penalty > v) {
            v = S[i - 1][l] - penalty;
            src = (i - 1) * m + l;
            gaps = G[i - 1][l] + 1;
          }
        }
      }
      S[i][j] = v + (a[i] === b[j] ? 1 : 0);
      from[i][j] = src;
      G[i][j] = gaps;
      if (S[i][j] > best) {
        best = S[i][j];
        end = i * m + j;
      }
    }
  }

  const path: [number, number][] = [];
  for (let c = end; c >= 0; c = from[Math.floor(c / m)][c % m]) {
    path.unshift([Math.floor(c / m), c % m]);
  }

  const gaps = G[Math.floor(end / m)][end % m];
  return {
    score: best,
    matches: Math.round(best + penalty * gaps),
    gaps,
    alignment: fromPath(a, b, path),
  };
}

function fromPath(sa: string, sb: string, path: [number, number][]): Alignment {
  const a = sa.split("");
  const b = sb.split("");
  const top: string[] = [];
  const bottom: string[] = [];
  const gap = (n: number) => Array<string>(n).fill("-");
  const [i0, j0] = path[0];
  const lead = Math.max(i0, j0);
  top.push(...gap(lead - i0), ...a.slice(0, i0));
  bottom.push(...gap(lead - j0), ...b.slice(0, j0));
  path.forEach(([i, j], k) => {
    if (k > 0) {
      const [pi, pj] = path[k - 1];
      const da = i - pi - 1;
      const db = j - pj - 1;
      top.push(...a.slice(pi + 1, i), ...gap(db));
      bottom.push(...gap(da), ...b.slice(pj + 1, j));
    }
    top.push(a[i]);
    bottom.push(b[j]);
  });
  const [il, jl] = path[path.length - 1];
  top.push(...a.slice(il + 1));
  bottom.push(...b.slice(jl + 1));
  while (top.length < bottom.length) top.push("-");
  while (bottom.length < top.length) bottom.push("-");
  return { top, bottom };
}
