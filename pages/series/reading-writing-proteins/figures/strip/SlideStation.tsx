// A slide-only strip with a bar for every offset the reader has tried.
import { useCallback, useMemo, useState } from "react";
import { offsetOf, slideScores, type Alignment } from "../../core/alignment";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import StripPair, { type StripPairProps } from "./StripPair";

export default function SlideStation(props: Omit<StripPairProps, "mode" | "penalty">) {
  const { top, bottom } = props;
  const scores = useMemo(() => slideScores(top, bottom), [top, bottom]);
  const start = props.startOffset ?? 0;
  const [offset, setOffset] = useState<number | null>(start);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([start]));
  const [all, setAll] = useState(false);
  const [wrapRef, avail] = useWidth<HTMLDivElement>();

  const onChange = useCallback((al: Alignment) => {
    const d = offsetOf(al);
    setOffset(d);
    if (d !== null) setVisited((v) => (v.has(d) ? v : new Set(v).add(d)));
  }, []);

  const max = Math.max(4, ...scores.map((s) => s.matches));
  const bw = Math.min(28, (avail || 600) / scores.length);
  const h = 80;
  const width = scores.length * bw;
  const zero = scores.findIndex((s) => s.offset === 0);

  return (
    <div className="w-full max-w-prose self-center">
      <StripPair {...props} mode="slide" penalty={0} onChange={onChange} showBest={false} />
      <figure ref={wrapRef} className="-mt-2 mb-8">
        <div className="mb-2 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500">
          <span>Matches at each slide</span>
          <button
            type="button"
            onClick={() => setAll((a) => !a)}
            className="font-ui text-xs normal-case tracking-normal text-ink-600 underline underline-offset-2"
          >
            {all ? "Show only the ones tried" : "Show every slide"}
          </button>
        </div>
        <svg width={width} height={h + 24} role="img" aria-label="Matches at each offset of the bottom row against the top row">
          {scores.map((s, k) => {
            const shown = all || visited.has(s.offset);
            const bh = (s.matches / max) * h;
            const current = s.offset === offset;
            return (
              <g key={s.offset}>
                <rect
                  x={k * bw + 1.5}
                  y={h - (shown ? bh : 0)}
                  width={bw - 3}
                  height={shown ? Math.max(bh, 1.5) : 0}
                  rx={1.5}
                  fill={current ? RW.focus : RW.pairSoft}
                  stroke={current ? RW.focus : RW.pair}
                  strokeWidth={0.8}
                />
                {shown && s.matches > 0 && (
                  <text x={k * bw + bw / 2} y={h - bh - 3} textAnchor="middle" fontSize={10} fill={RW.label} className="font-mono">
                    {s.matches}
                  </text>
                )}
              </g>
            );
          })}
          <line x1={0} x2={width} y1={h + 0.5} y2={h + 0.5} stroke={RW.faint} strokeWidth={1} />
          <text x={zero * bw + bw / 2} y={h + 12} textAnchor="middle" fontSize={10} fill={RW.label} className="font-mono">
            0
          </text>
          <text x={0} y={h + 20} fontSize={10} fill={RW.label} className="font-mono">
            ← bottom row slid left
          </text>
          <text x={width} y={h + 20} textAnchor="end" fontSize={10} fill={RW.label} className="font-mono">
            slid right →
          </text>
        </svg>
      </figure>
    </div>
  );
}
