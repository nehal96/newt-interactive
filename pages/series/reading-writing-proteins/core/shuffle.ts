// Seeded shuffles, so a figure shows the same "random" sequences on every load.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(s: string, seed: number): string {
  const next = rng(seed);
  const out = s.split("");
  for (let k = out.length - 1; k > 0; k--) {
    const r = Math.floor(next() * (k + 1));
    [out[k], out[r]] = [out[r], out[k]];
  }
  return out.join("");
}
