// How many ways two sequences can be aligned.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

// Order of neighbouring gaps ignored: choose which of the n + m columns hold
// the first sequence's residues. Eddy (2004) counts this way.
export function alignmentsBinomial(n: number, m: number): bigint {
  let r = BigInt(1);
  for (let k = 1; k <= m; k++) {
    r = (r * BigInt(n + k)) / BigInt(k);
  }
  return r;
}

// Order of neighbouring gaps counted: the Delannoy number D(n, m).
export function alignmentsDelannoy(n: number, m: number): bigint {
  let prev: bigint[] = Array(m + 1).fill(BigInt(1));
  for (let i = 1; i <= n; i++) {
    const row: bigint[] = [BigInt(1)];
    for (let j = 1; j <= m; j++) row.push(row[j - 1] + prev[j] + prev[j - 1]);
    prev = row;
  }
  return prev[m];
}

// "8,989" below a million, "2.6 × 10^14" above.
export function formatBig(x: bigint): { mantissa: string; exponent: number | null } {
  const s = x.toString();
  if (s.length <= 6) return { mantissa: Number(s).toLocaleString("en-US"), exponent: null };
  return { mantissa: `${s[0]}.${s[1]}`, exponent: s.length - 1 };
}
