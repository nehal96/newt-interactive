// Two gapped rows and the operations a reader can perform on them.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

export const GAP = "-";

export type Row = string[];
export type Alignment = { top: Row; bottom: Row };
export type Side = "top" | "bottom";

export type Score = { matches: number; gaps: number; penalty: number; score: number };

export function fromStrings(a: string, b: string): Alignment {
  return normalize({ top: a.split(""), bottom: b.split("") });
}

// Equal lengths, and no column where both rows are gaps.
export function normalize({ top, bottom }: Alignment): Alignment {
  const t = [...top];
  const b = [...bottom];
  while (t.length < b.length) t.push(GAP);
  while (b.length < t.length) b.push(GAP);
  for (let k = t.length - 1; k >= 0; k--) {
    if (t[k] === GAP && b[k] === GAP) {
      t.splice(k, 1);
      b.splice(k, 1);
    }
  }
  return { top: t, bottom: b };
}

const other = (side: Side): Side => (side === "top" ? "bottom" : "top");

// Opens a gap before column k of one row: that residue and everything after it
// move one column right.
export function push(al: Alignment, side: Side, k: number): Alignment {
  const row = [...al[side]];
  row.splice(k, 0, GAP);
  return normalize({ ...al, [side]: row });
}

// Moves the residue at column k one column left. It closes a gap directly
// before it; at the start of a row it pushes the other row right instead, which
// is the same relative move. Returns null when the residue has a residue
// directly before it.
export function pull(al: Alignment, side: Side, k: number): Alignment | null {
  const row = al[side];
  if (k > 0 && row[k - 1] === GAP) {
    const next = [...row];
    next.splice(k - 1, 1);
    return normalize({ ...al, [side]: next });
  }
  if (row.slice(0, k).every((x) => x === GAP)) {
    return normalize({ ...al, [other(side)]: [GAP, ...al[other(side)]] });
  }
  return null;
}

// Shifts a whole row one column; dir 1 is right.
export function slide(al: Alignment, side: Side, dir: 1 | -1): Alignment {
  if (dir === 1) return normalize({ ...al, [side]: [GAP, ...al[side]] });
  if (al[side][0] === GAP) return normalize({ ...al, [side]: al[side].slice(1) });
  return normalize({ ...al, [other(side)]: [GAP, ...al[other(side)]] });
}

// Gaps with residues on both sides in the same row. End gaps cost nothing.
export function internalGaps(row: Row): boolean[] {
  const first = row.findIndex((x) => x !== GAP);
  let last = -1;
  for (let k = row.length - 1; k >= 0; k--) {
    if (row[k] !== GAP) {
      last = k;
      break;
    }
  }
  return row.map((x, k) => x === GAP && k > first && k < last);
}

// A run of internal gaps counts once, whatever its length.
export function gapRuns(row: Row): number {
  const inside = internalGaps(row);
  return inside.filter((on, k) => on && !inside[k - 1]).length;
}

export function scoreOf(al: Alignment, penalty: number): Score {
  let matches = 0;
  for (let k = 0; k < al.top.length; k++) {
    if (al.top[k] !== GAP && al.top[k] === al.bottom[k]) matches++;
  }
  const gaps = gapRuns(al.top) + gapRuns(al.bottom);
  return { matches, gaps, penalty, score: matches - penalty * gaps };
}

// [i, j, identical] for every column that pairs two residues, with i and j
// the residues' positions in the ungapped sequences.
export function pairsOf(al: Alignment): [number, number, boolean][] {
  const out: [number, number, boolean][] = [];
  let i = 0;
  let j = 0;
  for (let k = 0; k < al.top.length; k++) {
    const x = al.top[k];
    const y = al.bottom[k];
    if (x !== GAP && y !== GAP) out.push([i, j, x === y]);
    if (x !== GAP) i++;
    if (y !== GAP) j++;
  }
  return out;
}

// How far the bottom sequence sits right of the top one, when neither row has
// internal gaps. Null once a gap has been opened inside a row.
export function offsetOf(al: Alignment): number | null {
  if (gapRuns(al.top) + gapRuns(al.bottom) > 0) return null;
  return al.bottom.findIndex((x) => x !== GAP) - al.top.findIndex((x) => x !== GAP);
}

// Identical pairs at every offset of b against a, from -(b.length - 1) to
// a.length - 1. These are the totals along each diagonal of the grid.
export function slideScores(a: string, b: string): { offset: number; matches: number }[] {
  const out = [];
  for (let d = -(b.length - 1); d <= a.length - 1; d++) {
    let matches = 0;
    for (let j = 0; j < b.length; j++) {
      const i = j + d;
      if (i >= 0 && i < a.length && a[i] === b[j]) matches++;
    }
    out.push({ offset: d, matches });
  }
  return out;
}

export function atOffset(a: string, b: string, offset: number): Alignment {
  const pad = (n: number) => Array<string>(Math.max(0, n)).fill(GAP);
  return normalize({
    top: [...pad(-offset), ...a.split("")],
    bottom: [...pad(offset), ...b.split("")],
  });
}
