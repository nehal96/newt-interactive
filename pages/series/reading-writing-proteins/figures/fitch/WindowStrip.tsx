// One window of each chain, paired column by column, with each column's
// minimum mutations underneath.
import { mr } from "../../core/fitch";
import { type Chain } from "../../core/sequences";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import { MR_FILL, MR_INK } from "./CodonDistance";

export default function WindowStrip({
  top,
  bottom,
  i,
  j,
  length,
}: {
  top: Chain;
  bottom: Chain;
  /** 0-based window starts. */
  i: number;
  j: number;
  length: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const cw = Math.max(16, Math.min(24, Math.floor((width || 640) / length)));
  const a = top.seq.slice(i, i + length).split("");
  const b = bottom.seq.slice(j, j + length).split("");
  const mrs = a.map((x, k) => mr(x, b[k]));

  const row = (letters: string[]) => (
    <div className="flex">
      {letters.map((x, k) => (
        <div
          key={k}
          className="flex items-center justify-center rounded-[5px] border font-mono text-[13px]"
          style={{
            width: cw - 2,
            height: cw + 4,
            margin: "0 1px",
            ...(mrs[k] === 0
              ? { color: RW.matchInk, background: RW.matchSoft, borderColor: RW.matchEdge, fontWeight: 600 }
              : { color: RW.residue, background: RW.wash, borderColor: RW.rule }),
          }}
        >
          {x}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} className="overflow-x-auto pb-1">
      <div style={{ width: length * cw }}>
        <div className="mb-1.5 font-ui text-xs text-ink-500">
          {top.name} {i + 1}–{i + length}
        </div>
        {row(a)}
        <svg width={length * cw} height={10} aria-hidden className="block">
          {mrs.map((v, k) =>
            v <= 1 ? (
              <line
                key={k}
                x1={k * cw + cw / 2}
                x2={k * cw + cw / 2}
                y1={1}
                y2={9}
                stroke={v === 0 ? RW.match : RW.matchEdge}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ) : null
          )}
        </svg>
        {row(b)}
        <div className="mt-1.5 font-ui text-xs text-ink-500">
          {bottom.name} {j + 1}–{j + length}
        </div>
        <div className="mt-2 flex" aria-label="Minimum mutations in each column">
          {mrs.map((v, k) => (
            <div
              key={k}
              className="flex items-center justify-center rounded-[4px] font-ui text-[11px] tabular-nums"
              style={{ width: cw - 2, height: 18, margin: "0 1px", background: MR_FILL[v], color: MR_INK[v] }}
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
