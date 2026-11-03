// β-hemoglobin against myoglobin as the penalty rises: what each penalty keeps,
// what its gaps cost, and where the paper's own results sit.
import { useState } from "react";
import { cn } from "@lib/utils";
import { GAP, scoreOf } from "../../core/alignment";
import { formatBig } from "../../core/count";
import { SWEEP } from "../../core/sweep";
import { TABLE_1 } from "../../core/table1";
import Panel from "../Panel";
import { RW } from "../palette";
import ScoreLine from "../strip/ScoreLine";
import StaticStrip from "../strip/StaticStrip";

const WIDEST = Math.max(...SWEEP.map((r) => r.matches));
const pct = (v: number) => `${(v / WIDEST) * 100}%`;
const toRow = (s: string) => s.split("").map((x) => (x === "-" ? GAP : x));

export default function PenaltySweep() {
  const [sel, setSel] = useState(1);
  const row = SWEEP[sel];
  const top = toRow(row.top);
  const bottom = toRow(row.bottom);
  const { mantissa, exponent } = formatBig(BigInt(row.paths));

  return (
    <Panel>
      <div className="font-ui text-sm tabular-nums">
        <div className="mb-1 grid grid-cols-[3.25rem_1fr_6.5rem] gap-x-2 text-xs text-ink-500">
          <span>Penalty</span>
          <span>Matches kept, less what the gaps cost</span>
          <span className="text-right">Score, gaps</span>
        </div>
        {SWEEP.map((r, k) => {
          const paper = TABLE_1.find((t) => t.penalty === r.penalty);
          return (
            <button
              key={r.penalty}
              type="button"
              aria-pressed={k === sel}
              onClick={() => setSel(k)}
              className={cn(
                "grid w-full grid-cols-[3.25rem_1fr_6.5rem] items-center gap-x-2 rounded-md py-1 text-left transition-colors",
                k === sel ? "bg-ink-100" : "hover:bg-ink-100/60"
              )}
            >
              <span className={cn("pl-1", k === sel ? "text-ink-900" : "text-ink-500")}>{r.penalty}</span>
              <span className="relative block h-3.5">
                <span
                  className="absolute inset-y-0 left-0 rounded-l-sm"
                  style={{ width: pct(r.score), background: RW.match }}
                />
                <span
                  className="absolute inset-y-0"
                  style={{ left: pct(r.score), width: pct(r.matches - r.score), background: RW.gapSoft }}
                />
                {paper && (
                  <span
                    className="absolute -inset-y-0.5 w-0.5"
                    style={{ left: `calc(${pct(paper.real)} - 1px)`, background: RW.residue }}
                  />
                )}
              </span>
              <span className="pr-1 text-right text-ink-600">
                <span className="font-semibold text-ink-900">{r.score}</span>, {r.gaps} {r.gaps === 1 ? "gap" : "gaps"}
              </span>
            </button>
          );
        })}
        <p className="mt-2 text-xs leading-5 text-ink-500">
          Green is the score, pale amber what the gaps took off, and the black tick the paper&apos;s own score. Each row
          is the tied pathway with the fewest gaps, on today&apos;s sequences.
        </p>
      </div>

      <div className="mt-5 border-t border-ink-100 pt-5">
        <ScoreLine score={scoreOf({ top, bottom }, row.penalty)} />
        <p className="mb-3 mt-1 font-ui text-sm leading-6 text-ink-600">
          {exponent === null ? (
            mantissa
          ) : (
            <>
              {mantissa} × 10<sup>{exponent}</sup>
            </>
          )}{" "}
          {row.paths === "1" ? "pathway reaches" : "pathways tie for"} this score. Choose a row above to see its
          alignment.
        </p>
        <StaticStrip
          top={top}
          bottom={bottom}
          topLabel="myoglobin · sperm whale"
          bottomLabel="β-hemoglobin · human"
          maxCell={18}
        />
      </div>

      <div className="mt-5 overflow-x-auto border-t border-ink-100 pt-5 font-ui text-sm">
        <p className="mb-2 text-ink-900">Against their Table 1 (p. 449)</p>
        <table className="w-full tabular-nums">
          <thead className="text-xs text-ink-500">
            <tr>
              <th className="pb-1 text-left font-normal" />
              <th className="pb-1 pl-3 text-right font-normal">Penalty</th>
              <th className="pb-1 pl-3 text-right font-normal">Real</th>
              <th className="pb-1 pl-3 text-right font-normal">Fewest gaps</th>
              <th className="pb-1 pl-3 text-right font-normal">Shuffled</th>
              <th className="pb-1 pl-3 text-right font-normal">X</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_1.map((t) => {
              const today = SWEEP.find((r) => r.penalty === t.penalty)!;
              return [
                <tr key={`p${t.set}`} className="text-ink-900">
                  <td className="py-0.5">Paper, set {t.set}</td>
                  <td className="py-0.5 pl-3 text-right">{t.penalty}</td>
                  <td className="py-0.5 pl-3 text-right">{t.real}</td>
                  <td className="py-0.5 pl-3 text-right">{t.gaps}</td>
                  <td className="py-0.5 pl-3 text-right">{t.random.toFixed(2)}</td>
                  <td className="py-0.5 pl-3 text-right">{t.x.toFixed(2)}</td>
                </tr>,
                <tr key={`t${t.set}`} className="text-ink-500">
                  <td className="pb-2 pt-0.5">Today&apos;s sequences</td>
                  <td className="pb-2 pl-3 pt-0.5 text-right">{t.penalty}</td>
                  <td className="pb-2 pl-3 pt-0.5 text-right">{today.score}</td>
                  <td className="pb-2 pl-3 pt-0.5 text-right">{today.gaps}</td>
                  <td className="pb-2 pl-3 pt-0.5 text-right">station 7</td>
                  <td className="pb-2 pl-3 pt-0.5 text-right">station 7</td>
                </tr>,
              ];
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
