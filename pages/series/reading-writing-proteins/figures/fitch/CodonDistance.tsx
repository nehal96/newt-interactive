// The fewest base changes between two amino acids, for every pair, as Fitch
// tabulated them or as today's code gives them, with today's closest codons.
import { useState } from "react";
import { cn } from "@lib/utils";
import { AMINO_ACIDS, closestCodons, codonsOf, mr, mrToday } from "../../core/fitch";
import Panel from "../Panel";
import { RW } from "../palette";

const CELL = 19;
const AA = AMINO_ACIDS.split("");
const DISAGREE = AA.flatMap((x, r) => AA.slice(r + 1).filter((y) => mr(x, y) !== mrToday(x, y))).length;

export const MR_FILL = [RW.matchSoft, RW.faint, RW.rule, RW.wash];
export const MR_INK = [RW.matchInk, RW.residue, RW.label, RW.faint];

function Codon({ codon, against, highlight }: { codon: string; against: string; highlight: boolean }) {
  return (
    <span className={cn("rounded px-1 font-mono", highlight ? "bg-ink-100 text-ink-900" : "text-ink-400")}>
      {codon.split("").map((base, k) => (
        <span key={k} style={highlight && base !== against[k] ? { color: RW.focus, fontWeight: 600 } : undefined}>
          {base}
        </span>
      ))}
    </span>
  );
}

export default function CodonDistance() {
  const [pair, setPair] = useState<[string, string]>(["K", "E"]);
  const [today, setToday] = useState(false);
  const [a, b] = pair;
  const close = closestCodons(a, b);
  const value = today ? close.mr : mr(a, b);
  const differs = mr(a, b) !== close.mr;
  const tab = (on: boolean) =>
    cn("rounded-md px-2.5 py-1 transition-colors", on ? "bg-ink-100 text-ink-900" : "text-ink-500 hover:text-ink-900");

  return (
    <Panel>
      <div className="mb-4 flex gap-1 font-ui text-sm">
        <button type="button" onClick={() => setToday(false)} className={tab(!today)}>
          Fitch's 1965 table
        </button>
        <button type="button" onClick={() => setToday(true)} className={tab(today)}>
          Today's code
        </button>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <svg
          viewBox={`0 0 ${CELL * 21} ${CELL * 21}`}
          className="w-full shrink-0 font-ui"
          style={{ maxWidth: CELL * 21 }}
          role="img"
          aria-label="Minimum base changes between every pair of amino acids"
        >
          {AA.map((x, r) => (
            <text
              key={`r${x}`}
              x={CELL / 2}
              y={CELL * (r + 1.5) + 4}
              textAnchor="middle"
              fontSize={11}
              fill={x === a ? RW.residue : RW.label}
              className="font-mono"
            >
              {x}
            </text>
          ))}
          {AA.map((y, c) => (
            <text
              key={`c${y}`}
              x={CELL * (c + 1.5)}
              y={CELL / 2 + 4}
              textAnchor="middle"
              fontSize={11}
              fill={y === b ? RW.residue : RW.label}
              className="font-mono"
            >
              {y}
            </text>
          ))}
          {AA.map((x, r) =>
            AA.map((y, c) => {
              const v = today ? mrToday(x, y) : mr(x, y);
              const on = x === a && y === b;
              const odd = mr(x, y) !== mrToday(x, y);
              return (
                <g
                  key={x + y}
                  onPointerEnter={() => setPair([x, y])}
                  onClick={() => setPair([x, y])}
                  className="cursor-pointer"
                >
                  <rect
                    x={CELL * (c + 1) + 0.5}
                    y={CELL * (r + 1) + 0.5}
                    width={CELL - 1}
                    height={CELL - 1}
                    rx={2}
                    fill={MR_FILL[v]}
                    stroke={on ? RW.focus : "none"}
                    strokeWidth={1.5}
                  />
                  <text
                    x={CELL * (c + 1.5)}
                    y={CELL * (r + 1.5) + 3.5}
                    textAnchor="middle"
                    fontSize={10}
                    fill={MR_INK[v]}
                  >
                    {v}
                  </text>
                  {odd && <circle cx={CELL * (c + 2) - 3.5} cy={CELL * (r + 1) + 3.5} r={1.6} fill={RW.residue} />}
                </g>
              );
            })
          )}
        </svg>

        <div className="min-w-0 flex-1 font-ui text-sm text-ink-600">
          <p className="text-ink-900">
            <span className="font-mono text-base">{a}</span> to <span className="font-mono text-base">{b}</span>:{" "}
            <span className="text-lg font-semibold" style={{ color: value === 0 ? RW.matchInk : RW.residue }}>
              {value}
            </span>{" "}
            {value === 1 ? "change" : "changes"}
          </p>
          <dl className="mt-3 space-y-2">
            {[
              [a, close.from, close.to],
              [b, close.to, close.from],
            ].map(([x, mine, theirs], k) => (
              <div key={k} className="flex gap-3">
                <dt className="w-4 shrink-0 font-mono text-ink-900">{x}</dt>
                <dd className="flex flex-wrap gap-x-1 gap-y-1 leading-6">
                  {codonsOf(x).map((c) => (
                    <Codon key={c} codon={c} against={theirs} highlight={c === mine} />
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-ink-500">Today's codons, closest pair marked.</p>
          {differs && (
            <p className="mt-3 text-ink-900">
              Fitch's table gives {mr(a, b)}, today's code {close.mr}.
            </p>
          )}
          <p className="mt-4 text-ink-500">
            Point at a square to pick a pair. Dots mark the {DISAGREE} pairs where the two disagree.
          </p>
        </div>
      </div>
    </Panel>
  );
}
