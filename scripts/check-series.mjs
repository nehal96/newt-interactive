// The numbers Reading and Writing Proteins quotes, recomputed from its core/.
// A change to an algorithm that moves a quoted number fails here.

import assert from "node:assert/strict";
import { fromStrings, scoreOf, slideScores, push, pull, slide, offsetOf } from "../pages/series/reading-writing-proteins/core/alignment.ts";
import { bestAlignment } from "../pages/series/reading-writing-proteins/core/best.ts";
import { alignmentsBinomial, alignmentsDelannoy } from "../pages/series/reading-writing-proteins/core/count.ts";
import { BETA, MYOGLOBIN, fragment } from "../pages/series/reading-writing-proteins/core/sequences.ts";
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

check("alignment counts", () => {
  assert.equal(alignmentsDelannoy(6, 6), 8989n);
  assert.equal(alignmentsBinomial(6, 6), 924n);
  assert.equal(alignmentsDelannoy(146, 153).toString().length - 1, 113);
  assert.equal(alignmentsBinomial(146, 153).toString().length - 1, 88);
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
