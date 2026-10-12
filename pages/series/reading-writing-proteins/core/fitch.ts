// Fitch's 1966 window test: no gaps, every window of one chain against every
// window of the other, scored by the fewest base changes that turn one amino
// acid into the other.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

const BASES = "TCAG";
// The standard code in TCAG order; "*" is a stop.
const CODE = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";

export const AMINO_ACIDS = "ACDEFGHIKLMNPQRSTVWY";

export const codonsOf = (aa: string): string[] => {
  const out: string[] = [];
  for (let k = 0; k < 64; k++) {
    if (CODE[k] === aa) out.push(BASES[k >> 4] + BASES[(k >> 2) & 3] + BASES[k & 3]);
  }
  return out;
};

const differences = (x: string, y: string) =>
  (x[0] !== y[0] ? 1 : 0) + (x[1] !== y[1] ? 1 : 0) + (x[2] !== y[2] ? 1 : 0);

// The closest codon pair for two amino acids, and how many bases differ.
export function closestCodons(a: string, b: string): { mr: number; from: string; to: string } {
  let best = { mr: 4, from: "", to: "" };
  for (const x of codonsOf(a)) {
    for (const y of codonsOf(b)) {
      const d = differences(x, y);
      if (d < best.mr) best = { mr: d, from: x, to: y };
    }
  }
  return best;
}

const TODAY: Record<string, number> = {};
for (const a of AMINO_ACIDS) for (const b of AMINO_ACIDS) TODAY[a + b] = closestCodons(a, b).mr;

export const mrToday = (a: string, b: string): number => TODAY[a + b];

// Fitch's Table 1 (p. 10), from the 1965 code of Trupin et al. as he modified
// it. Rows and columns in his order, which is Asp, Cys, Thr, … Gly.
const TABLE_1_ORDER = "DCTFEHKAMNYPQRSWLVIG";
// prettier-ignore
const TABLE_1 = [
  "02221121311222232121",
  "20213232321221112121",
  "22022211112121122212",
  "21203232221222121112",
  "13230211222212222131",
  "12222022311111231222",
  "23131202112211222222",
  "12121220222122122121",
  "33122312023221221112",
  "12122112201222132212",
  "11212122310212122222",
  "22122121222011121222",
  "22221112221101111232",
  "21122112122110111221",
  "21112221211111011211",
  "31222322232211101231",
  "22212122122111110111",
  "11211221122222221011",
  "22113222112232131102",
  "11221221222221111120",
];

const FITCH: Record<string, number> = {};
TABLE_1.forEach((row, r) => row.split("").forEach((v, c) => (FITCH[TABLE_1_ORDER[r] + TABLE_1_ORDER[c]] = Number(v))));

// Minimum mutations as Fitch scored them.
export const mr = (a: string, b: string): number => FITCH[a + b];

// Sum of minimum mutations over a window of `length` pairs, the first chain
// starting at i and the second at j (0-based).
export function windowMR(a: string, b: string, i: number, j: number, length: number): number {
  let sum = 0;
  for (let k = 0; k < length; k++) sum += mr(a[i + k], b[j + k]);
  return sum;
}

// Every window of a against every window of b: mrs[i][j].
export function allWindows(a: string, b: string, length: number): number[][] {
  const out: number[][] = [];
  for (let i = 0; i + length <= a.length; i++) {
    const row: number[] = [];
    for (let j = 0; j + length <= b.length; j++) row.push(windowMR(a, b, i, j, length));
    out.push(row);
  }
  return out;
}

const composition = (s: string) => {
  const f: Record<string, number> = {};
  for (const x of s) f[x] = (f[x] ?? 0) + 1 / s.length;
  return f;
};

// Chance of each MR value (0–3) for one pair drawn from the two compositions.
export function pairDistribution(a: string, b: string): number[] {
  const fa = composition(a);
  const fb = composition(b);
  const p = [0, 0, 0, 0];
  for (const x in fa) for (const y in fb) p[mr(x, y)] += fa[x] * fb[y];
  return p;
}

// Chance of each window total, 0 to 3 × length, for unrelated windows of the
// same compositions: the pair distribution convolved `length` times.
export function chanceDistribution(a: string, b: string, length: number): number[] {
  const p = pairDistribution(a, b);
  let dist = [1];
  for (let k = 0; k < length; k++) {
    const next = Array<number>(dist.length + 3).fill(0);
    dist.forEach((q, s) => p.forEach((r, d) => (next[s + d] += q * r)));
    dist = next;
  }
  return dist;
}

// The largest total whose chance of turning up at or below it is at most `alpha`.
export function cutoff(dist: number[], alpha: number): number {
  let cum = 0;
  for (let s = 0; s < dist.length; s++) {
    cum += dist[s];
    if (cum > alpha) return s - 1;
  }
  return dist.length - 1;
}

export const meanOf = (dist: number[]) => dist.reduce((acc, q, s) => acc + q * s, 0);

// Windows at or under the cutoff, counted by register shift (first chain's
// start minus the second's), with the second chain's first and last start.
export function hitsByShift(mrs: number[][], cut: number) {
  const by = new Map<number, { shift: number; count: number; from: number; to: number }>();
  mrs.forEach((row, i) =>
    row.forEach((v, j) => {
      if (v > cut) return;
      const s = i - j;
      const h = by.get(s) ?? { shift: s, count: 0, from: j + 1, to: j + 1 };
      h.count++;
      h.from = Math.min(h.from, j + 1);
      h.to = Math.max(h.to, j + 1);
      by.set(s, h);
    })
  );
  return Array.from(by.values()).sort((x, y) => x.shift - y.shift);
}

// What Fitch reported for α against β (pp. 10, 14). `beta` is the range of
// β window starts.
export const FITCH_1966 = {
  window: 30,
  cutoff: 34,
  windows: 13104,
  perPair: 1.45,
  // Table 2 (p. 14), every register shift with MR ≤ 34.
  shifts: [
    { shift: -71, count: 6, beta: [112, 117] },
    { shift: -13, count: 1, beta: [105, 105] },
    { shift: -8, count: 2, beta: [12, 13] },
    { shift: -5, count: 81, beta: [37, 117] },
    { shift: -1, count: 10, beta: [2, 11] },
    { shift: 1, count: 38, beta: [1, 38] },
    { shift: 9, count: 3, beta: [62, 70] },
    { shift: 12, count: 9, beta: [47, 63] },
    { shift: 24, count: 3, beta: [61, 63] },
    { shift: 52, count: 1, beta: [7, 7] },
    { shift: 59, count: 2, beta: [7, 8] },
    { shift: 61, count: 9, beta: [43, 51] },
    { shift: 73, count: 7, beta: [14, 20] },
    { shift: 75, count: 5, beta: [2, 7] },
    { shift: 110, count: 2, beta: [1, 2] },
  ],
  homologous: [-5, -1, 1],
} as const;
