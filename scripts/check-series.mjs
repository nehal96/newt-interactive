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
import * as nw1970 from "../pages/series/reading-writing-proteins/core/nw1970.ts";
import * as alignment from "../pages/series/reading-writing-proteins/core/alignment.ts";
import { PUZZLES } from "../pages/series/reading-writing-proteins/core/puzzles.ts";
import { SWEEP } from "../pages/series/reading-writing-proteins/core/sweep.ts";
import { TABLE_1 } from "../pages/series/reading-writing-proteins/core/table1.ts";

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

check("station 4: Needleman and Wunsch's array", () => {
  const { nwArray, maximumMatch, pathways, pathToRows, readsToFill, FIG_1 } = nw1970;
  // Fig. 2 (p. 445), the completed array.
  const FIG_2 = [
    "8766544332100", "7766644332100", "6676544433100", "6665644332100",
    "5556544332100", "4444454332200", "3343333433100", "3333333332100",
    "2232222323100", "2111121111200", "1211111111100", "0000000000010",
  ];
  const nw = nwArray(FIG_1.across, FIG_1.down);
  assert.deepEqual(nw.mat.map((r) => r.join("")), FIG_2);
  assert.equal(maximumMatch(nw).value, 8);
  // Fig. 1's working cell, R against R: own 1 plus the 4 in subrow C.
  assert.equal(nw.mat[5][5], 5);
  assert.deepEqual(nw.from[5][5], [[6, 7]]);
  const two = pathways(nw).map((p) => pathToRows(nw, p)).map((r) => `${r.top.join("")}/${r.bottom.join("")}`);
  assert.deepEqual(two, ["ABCNJ-RQCLCR-PM/AJC-JNR-CKCRBP-", "ABC-NJRQCLCR-PM/AJCJN-R-CKCRBP-"]);
  assert.deepEqual(nw.from[2][2], [[3, 4], [4, 3]]);

  const frag = nwArray(PUZZLES.globinFree.bottom, PUZZLES.globinFree.top);
  assert.equal(maximumMatch(frag).value, PUZZLES.globinFree.target);
  assert.equal(pathways(frag, 500).length, 30);
  assert.equal(maximumMatch(nwArray(PUZZLES.globinCost.bottom, PUZZLES.globinCost.top, 1)).value, PUZZLES.globinCost.target);

  assert.equal(maximumMatch(nwArray(MYOGLOBIN.seq, BETA.seq)).value, 63);
  assert.equal(readsToFill(BETA.seq.length, MYOGLOBIN.seq.length), 3272940);
});

check("station 5: the penalty", () => {
  const { nwArray, maximumMatch, fewestGaps, tied, pathToRows, stepValue, FIG_1 } = nw1970;
  const { scoreOf } = alignment;

  // The worked cell, R against R: own 1, diagonal 1, best other step 3 less 1.
  const one = nwArray(FIG_1.across, FIG_1.down, 1);
  assert.equal(one.mat[5][5], 3);
  assert.equal(stepValue(one.mat, [5, 5], [6, 6], 1), 1);
  assert.equal(stepValue(one.mat, [5, 5], [6, 7], 1), 2);

  const example = [
    [0, 8, [8, 8], [4, 4]],
    [1, 5, [6, 7], [1, 2]],
    [2, 4, [4, 6], [0, 1]],
    [3, 4, [4, 4], [0, 0]],
  ];
  for (const [penalty, value, matches, gaps] of example) {
    const nw = nwArray(FIG_1.across, FIG_1.down, penalty);
    const t = tied(nw);
    assert.equal(maximumMatch(nw).value, value);
    assert.deepEqual(t.matches, matches);
    assert.deepEqual(t.gaps, gaps);
    assert.equal(scoreOf(pathToRows(nw, fewestGaps(nw)), penalty).score, value);
  }

  for (const row of SWEEP) {
    const nw = nwArray(MYOGLOBIN.seq, BETA.seq, row.penalty);
    const rows = pathToRows(nw, fewestGaps(nw));
    assert.equal(rows.top.join(""), row.top, `penalty ${row.penalty} top`);
    assert.equal(rows.bottom.join(""), row.bottom, `penalty ${row.penalty} bottom`);
    assert.equal(tied(nw).paths.toString(), row.paths, `penalty ${row.penalty} ties`);
    assert.equal(tied(nw).gaps[0], row.gaps, `penalty ${row.penalty} gaps`);
    assert.equal(maximumMatch(nw).value, row.score, `penalty ${row.penalty} score`);
    assert.deepEqual(scoreOf(rows, row.penalty), {
      matches: row.matches,
      gaps: row.gaps,
      penalty: row.penalty,
      score: row.score,
    });
  }

  const at = (p) => SWEEP.find((r) => r.penalty === p);
  assert.equal(at(1).score, 37);
  assert.equal(at(1).matches - at(3).matches, 4);
  assert.equal(at(1).gaps - at(3).gaps, 2);
  assert.equal(at(2).score, at(2).matches - 2);
  assert.equal(at(7).score, Math.max(...alignment.slideScores(BETA.seq, MYOGLOBIN.seq).map((s) => s.matches)));
  assert.equal(at(7).paths, "1");
  assert.equal(at(0).paths[0] + "." + at(0).paths[1], "4.4");
  assert.equal(at(0).paths.length - 1, 18);

  // The detour: one gap of seven in each protein, on top of the gap of two they share.
  const runs = (s) => (s.replace(/^-+|-+$/g, "").match(/-+/g) ?? []).map((g) => g.length);
  assert.deepEqual(runs(at(1).top), [7]);
  assert.deepEqual(runs(at(1).bottom), [2, 7]);

  // Table 1's arithmetic, as the prose quotes it.
  const [set1, set2] = TABLE_1;
  assert.equal(at(0).score, set1.real);
  assert.equal(at(0).gaps, set1.gaps);
  assert.equal(set1.real - set2.real, 25);
  assert.equal((set1.random - set2.random).toFixed(2), "27.80");
  assert.equal((set1.real - set1.random).toFixed(2), "7.40");
  assert.equal((set2.real - set2.random).toFixed(2), "10.20");
  assert.equal(((set1.real - set1.random) / set1.s).toFixed(2), set1.x.toFixed(2));
  assert.equal(((set2.real - set2.random) / set2.s).toFixed(2), set2.x.toFixed(2));
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
