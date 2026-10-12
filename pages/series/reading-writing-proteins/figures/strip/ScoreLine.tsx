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
    <p className="flex flex-wrap items-baseline gap-x-3 font-ui tabular-nums text-ink-600" aria-live="polite">
      <span>
        <span className="font-semibold" style={{ color: matches > 0 ? RW.matchInk : undefined }}>
          {plural(matches, "match", "matches")}
        </span>
        {!slideOnly && (
          <>
            {penalty > 0 ? " − " : ", "}
            <span style={{ color: gaps > 0 ? RW.gap : undefined }}>{plural(gaps, "gap", "gaps")}</span>
            {penalty > 0 ? ` × ${penalty} = ` : " free = "}
            <span className="text-lg font-semibold text-ink-900">{score.score}</span>
          </>
        )}
      </span>
      {target !== undefined && <span className="text-sm text-ink-400">best possible {target}</span>}
    </p>
  );
}
