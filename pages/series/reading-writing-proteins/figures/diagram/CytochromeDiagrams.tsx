// Human cytochrome c against three others, as in Gibbs and McIntyre's Fig. 1,
// with the runs and diagonal totals of the one selected.
import { useMemo, useState } from "react";
import { cn } from "@lib/utils";
import { diagonals, expectedRuns, matchChance, runs } from "../../core/diagram";
import { CYT_C_HUMAN, CYT_C_MONKEY, CYT_C_TUNA, CYT_C2_RRUBRUM, type Chain } from "../../core/sequences";
import Panel from "../Panel";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import DiagonalProfile from "./DiagonalProfile";
import DotDiagram from "./DotDiagram";

const OTHERS: { key: string; title: string; chain: Chain }[] = [
  { key: "monkey", title: "Monkey", chain: CYT_C_MONKEY },
  { key: "tuna", title: "Tuna", chain: CYT_C_TUNA },
  { key: "rubrum", title: "R. rubrum", chain: CYT_C2_RRUBRUM },
];

const SHORT = 5;

export default function CytochromeDiagrams() {
  const [sel, setSel] = useState(0);
  const [focus, setFocus] = useState<number | null>(null);
  const [ref, avail] = useWidth<HTMLDivElement>();
  const human = CYT_C_HUMAN.seq;
  const other = OTHERS[sel].chain.seq;
  const each = Math.floor(((avail || 640) - 2 * 12) / 3);

  const stats = useMemo(() => {
    const p = matchChance(human, other);
    const r = runs(human, other);
    const long = r.flatMap((n, s) => (s > SHORT ? Array<number>(n).fill(s) : []));
    const chanceLong = Array.from({ length: 40 }, (_, k) =>
      expectedRuns(human.length, other.length, p, SHORT + 1 + k)
    ).reduce((a, b) => a + b, 0);
    return { p, r, long, chanceLong, diags: diagonals(human, other) };
  }, [human, other]);

  const fmt = (v: number) => (v >= 10 ? Math.round(v).toString() : v >= 0.05 ? v.toFixed(1) : "0");

  return (
    <Panel>
      <div ref={ref} className="grid grid-cols-3 gap-3">
        {OTHERS.map((o, k) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setSel(k)}
            className={cn(
              "self-start rounded-md p-1 text-left transition-colors",
              k === sel ? "bg-ink-100" : "hover:bg-ink-100/60"
            )}
          >
            <div className={cn("mb-1 font-ui text-sm", k === sel ? "text-ink-900" : "text-ink-500")}>
              {o.title === "R. rubrum" ? <i>R. rubrum</i> : o.title}
            </div>
            <DotDiagram
              down={human}
              across={o.chain.seq}
              width={Math.max(80, each - 8)}
              diagonal={k === sel ? focus : null}
              label={`Human cytochrome c down the side against ${o.title} along the top`}
            />
          </button>
        ))}
      </div>
      <p className="mt-2 font-ui text-xs text-ink-500">
        Human cytochrome c down the side of each, N-terminus at the top left.
      </p>

      <div className="mt-5 border-t border-ink-100 pt-5 font-ui text-sm text-ink-600">
        <p className="mb-2 text-ink-900">Unbroken runs of matches along the diagonals</p>
        <table className="w-full tabular-nums">
          <thead className="text-xs text-ink-500">
            <tr>
              <th className="pb-1 text-left font-normal">Matches in a row</th>
              {Array.from({ length: SHORT }, (_, k) => (
                <th key={k} className="pb-1 pl-3 text-right font-normal">
                  {k + 1}
                </th>
              ))}
              <th className="pb-1 pl-3 text-right font-normal">more</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-0.5 text-ink-900">
                Human against {OTHERS[sel].title === "R. rubrum" ? <i>R. rubrum</i> : OTHERS[sel].title.toLowerCase()}
              </td>
              {Array.from({ length: SHORT }, (_, k) => (
                <td key={k} className="py-0.5 pl-3 text-right text-ink-900">
                  {stats.r[k + 1] ?? 0}
                </td>
              ))}
              <td
                className="py-0.5 pl-3 text-right font-semibold"
                style={{ color: stats.long.length ? RW.matchInk : undefined }}
              >
                {stats.long.length ? stats.long.join(", ") : "0"}
              </td>
            </tr>
            <tr className="text-ink-500">
              <td className="py-0.5">Chance</td>
              {Array.from({ length: SHORT }, (_, k) => (
                <td key={k} className="py-0.5 pl-3 text-right">
                  {fmt(expectedRuns(human.length, other.length, stats.p, k + 1))}
                </td>
              ))}
              <td className="py-0.5 pl-3 text-right">{fmt(stats.chanceLong)}</td>
            </tr>
          </tbody>
        </table>

        <p className="mb-1 mt-6 text-ink-900">Matches on each diagonal</p>
        <DiagonalProfile diagonals={stats.diags} chance={stats.p} focus={focus ?? 0} onFocus={setFocus} />
        <p className="mt-1 text-xs text-ink-500">
          Bars are this pair; the dashed line is chance. Point at a diagonal to find it in the diagram.
        </p>
      </div>
    </Panel>
  );
}
