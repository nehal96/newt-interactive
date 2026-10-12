// The numbers Reading and Writing Proteins quotes, recomputed from its core/.
// A change to an algorithm that moves a quoted number fails here.

import assert from "node:assert/strict";
import { fromStrings, scoreOf, slideScores, push, pull, slide, offsetOf, internalGaps } from "../pages/series/reading-writing-proteins/core/alignment.ts";
import { bestAlignment } from "../pages/series/reading-writing-proteins/core/best.ts";
import { alignmentsBinomial, alignmentsDelannoy } from "../pages/series/reading-writing-proteins/core/count.ts";
import * as seqs from "../pages/series/reading-writing-proteins/core/sequences.ts";
const { ALPHA, BETA, MYOGLOBIN, fragment } = seqs;
import * as fitch from "../pages/series/reading-writing-proteins/core/fitch.ts";
import * as diagram from "../pages/series/reading-writing-proteins/core/diagram.ts";
import { shuffle } from "../pages/series/reading-writing-proteins/core/shuffle.ts";
import { PUZZLES } from "../pages/series/reading-writing-proteins/core/puzzles.ts";

const checks = [];
const check = (name, fn) => checks.push([name, fn]);

check("sequence lengths", () => {
  assert.equal(BETA.seq.length, 146);
  assert.equal(MYOGLOBIN.seq.length, 153);
});

check("puzzle targets and best slides", () => {
  for (const p of Object.values(PUZZLES)) {
    const best = bestAlignment(p.top, p.bottom, p.penalty);
    assert.equal(best.score, p.target, `${p.id} target`);
    assert.equal(scoreOf(best.alignment, p.penalty).score, p.target, `${p.id} alignment scores its target`);
    const slideBest = Math.max(...slideScores(p.top, p.bottom).map((s) => s.matches));
    assert.equal(slideBest, p.bestSlide, `${p.id} best slide`);
  }
});

check("globin puzzle is β 11–30 against myoglobin 10–31", () => {
  assert.equal(PUZZLES.globinCost.top, fragment(BETA, 11, 30));
  assert.equal(PUZZLES.globinCost.bottom, fragment(MYOGLOBIN, 10, 31));
});

check("β against myoglobin under the 1970 rules", () => {
  assert.equal(Math.max(...slideScores(BETA.seq, MYOGLOBIN.seq).map((s) => s.matches)), 30);
  const free = bestAlignment(BETA.seq, MYOGLOBIN.seq, 0);
  assert.equal(free.score, 63);
  const one = bestAlignment(BETA.seq, MYOGLOBIN.seq, 1);
  assert.equal(one.score, 37);
  assert.equal(scoreOf(one.alignment, 1).score, 37);
});

check("strip moves", () => {
  let al = fromStrings("PLWKTEGH", "PLWEGH");
  al = push(al, "bottom", 3);
  al = push(al, "bottom", 3);
  assert.deepEqual(scoreOf(al, 1), { matches: 6, gaps: 1, penalty: 1, score: 5 });
  assert.equal(offsetOf(al), null);
  al = pull(al, "bottom", 5);
  al = pull(al, "bottom", 4);
  assert.equal(offsetOf(al), 0);
  assert.equal(pull(al, "bottom", 3), null);
  assert.equal(offsetOf(pull(al, "bottom", 0)), -1);
  assert.equal(offsetOf(slide(al, "bottom", 1)), 1);
});

check("a gap survives the other row ending opposite it", () => {
  let al = fromStrings("PLWKTEGH", "PLWEGH");
  for (let n = 0; n < 6; n++) al = push(al, "bottom", 5);
  for (let n = 0; n < 5; n++) al = push(al, "top", 1);
  for (let n = 5; n > 0; n--) al = pull(al, "top", 1 + n);
  assert.equal(internalGaps(al.bottom).filter(Boolean).length, 6);
  for (let n = 0; n < 5; n++) al = push(al, "top", 1);
  assert.equal(internalGaps(al.bottom).filter(Boolean).length, 6);
});

check("alignment counts", () => {
  assert.equal(alignmentsDelannoy(6, 6), 8989n);
  assert.equal(alignmentsBinomial(6, 6), 924n);
  assert.equal(alignmentsDelannoy(146, 153).toString().length - 1, 113);
  assert.equal(alignmentsBinomial(146, 153).toString().length - 1, 88);
});

check("station 2: Fitch's windows, α against β", () => {
  const { mr, mrToday, closestCodons, allWindows, windowMR, pairDistribution, chanceDistribution, meanOf, cutoff, hitsByShift, FITCH_1966: F } = fitch;
  const AA = "ACDEFGHIKLMNPQRSTVWY";
  assert.equal(ALPHA.seq.length, 141);
  assert.deepEqual(closestCodons("K", "E"), { mr: 1, from: "AAA", to: "GAA" });
  // Table 1 as transcribed: symmetric, and its own value frequencies (p. 12).
  const counts = [0, 0, 0, 0];
  for (const a of AA) for (const b of AA) {
    assert.equal(mr(a, b), mr(b, a), `Table 1 symmetric at ${a}${b}`);
    counts[mr(a, b)]++;
  }
  assert.deepEqual(counts.map((n) => n / 400), [0.05, 0.39, 0.49, 0.07]);
  let disagree = 0;
  for (const [r, a] of [...AA].entries()) for (const b of AA.slice(r + 1)) if (mr(a, b) !== mrToday(a, b)) disagree++;
  assert.equal(disagree, 11);
  assert.equal(F.shifts.reduce((n, h) => n + h.count, 0), 179);

  const p = pairDistribution(ALPHA.seq, BETA.seq).map((x) => x.toFixed(3));
  assert.deepEqual(p, ["0.075", "0.420", "0.485", "0.021"]);
  const chance = chanceDistribution(ALPHA.seq, BETA.seq, F.window);
  assert.equal(meanOf(chance).toFixed(1), "43.6");
  assert.equal(cutoff(chance, 0.01), F.cutoff);

  const mrs = allWindows(ALPHA.seq, BETA.seq, F.window);
  assert.equal(mrs.length * mrs[0].length, F.windows);
  const at = (i, j) => windowMR(ALPHA.seq, BETA.seq, i - 1, j - 1, F.window);
  assert.deepEqual([at(1, 1), at(2, 3), at(81, 86), at(60, 20)], [35, 26, 16, 42]);
  assert.equal(Math.min(...mrs.flat()), 16);

  const shifts = hitsByShift(mrs, F.cutoff);
  assert.equal(shifts.reduce((n, h) => n + h.count, 0), 172);
  const by = Object.fromEntries(shifts.map((h) => [h.shift, [h.count, h.from, h.to]]));
  assert.deepEqual([by[-5], by[1], by[-1], by[9], by[61]], [[81, 37, 117], [38, 1, 38], [11, 2, 12], [3, 62, 70], [9, 43, 51]]);

  const pUnder = chance.slice(0, F.cutoff + 1).reduce((a, b) => a + b, 0);
  assert.equal(Math.round(pUnder * F.windows), 93);
  const off = mrs.flatMap((row, i) => row.filter((_, j) => !F.homologous.includes(i - j)));
  assert.equal(off.filter((v) => v <= F.cutoff).length, 42);
  assert.equal(Math.round(pUnder * off.length), 91);
});

check("station 3: Gibbs and McIntyre's diagram", () => {
  const { dots, diagonals, runs, matchChance, expectedRuns, smoothed } = diagram;
  const H = seqs.CYT_C_HUMAN.seq;
  const d0 = (a, b) => diagonals(a, b).find((g) => g.d === 0).matches;
  // Table 1 (runs, by number of matches in a row) and Table 2 (principal diagonal).
  assert.deepEqual(runs(H, seqs.CYT_C_MONKEY.seq).slice(1, 5), [680, 36, 2, 2]);
  assert.deepEqual(runs(H, seqs.CYT_C_TUNA.seq).slice(1, 7), [636, 44, 4, 3, 3, 1]);
  assert.deepEqual(runs(H, seqs.CYT_C2_RRUBRUM.seq).slice(1), [725, 46, 6, 1, 1]);
  assert.deepEqual([d0(H, seqs.CYT_C_MONKEY.seq), d0(H, seqs.CYT_C_TUNA.seq), d0(H, seqs.CYT_C2_RRUBRUM.seq)], [103, 83, 21]);
  const p = matchChance(H, H);
  assert.deepEqual([1, 2, 3].map((s) => Math.round(expectedRuns(104, 104, p, s))), [738, 58, 5]);
  assert.equal(expectedRuns(104, 104, p, 4).toFixed(1), "0.4");
  assert.equal((p * 104).toFixed(1), "8.4");
  let tunaDiffs = 0;
  for (let k = 0; k < 103; k++) if (H[k] !== seqs.CYT_C_TUNA.seq[k]) tunaDiffs++;
  assert.equal(tunaDiffs, 20);
  // Longest R. rubrum run: human 95–99 on diagonal −10.
  for (let k = 94; k < 99; k++) assert.equal(H[k], seqs.CYT_C2_RRUBRUM.seq[k + 10]);

  const M = MYOGLOBIN.seq;
  const profile = (down) => {
    const g = diagonals(down, M);
    return { dots: dots(down, M).length, raw: Math.max(...g.map((x) => x.matches)), smooth: Math.max(...smoothed(g.map((x) => x.matches), 5).filter((v) => v !== null)) };
  };
  const real = profile(BETA.seq);
  assert.deepEqual(real, { dots: 1533, raw: 30, smooth: 81 });
  assert.equal(diagonals(BETA.seq, M).find((g) => g.matches === 30).d, -1);
  const shuffles = Array.from({ length: 10 }, (_, k) => profile(shuffle(BETA.seq, k + 1)));
  assert.ok(shuffles.every((s) => s.dots === 1533));
  assert.equal(Math.max(...shuffles.map((s) => s.raw)), 18);
  assert.equal(Math.max(...shuffles.map((s) => s.smooth)), 67);
});

let failed = 0;
for (const [name, fn] of checks) {
  try {
    fn();
  } catch (e) {
    failed++;
    console.error(`  FAIL   ${name}: ${e.message}`);
  }
}
if (failed) {
  console.error(`\n${failed} series check(s) failed.`);
  process.exit(1);
}
console.log(`series ok — ${checks.length} checks.`);
