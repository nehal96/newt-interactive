import { type Score } from "../../core/alignment";
import { RW } from "../palette";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default function ScoreLine({
  score,
  target,
  slideOnly = false,
}: {
  score: Score;
  target?: number;
  slideOnly?: boolean;
}) {
  const { matches, gaps, penalty } = score;
  return (
    <p className="font-mono text-sm tabular-nums text-ink-700" aria-live="polite">
      <span style={{ color: RW.pairInk }}>{plural(matches, "match", "matches")}</span>
      {slideOnly ? null : penalty > 0 ? (
        <>
          {" − "}
          <span style={{ color: RW.gap }}>{plural(gaps, "gap", "gaps")}</span>
          {` × ${penalty} = `}
        </>
      ) : (
        <>
          {", "}
          <span style={{ color: RW.gap }}>{plural(gaps, "gap", "gaps")}</span>
          {" free = "}
        </>
      )}
      {!slideOnly && <span className="text-base font-semibold text-ink-900">{score.score}</span>}
      {target !== undefined && <span className="ml-3 text-ink-400">best possible {target}</span>}
    </p>
  );
}
