// A slide-only strip with a bar for every offset the reader has tried.
import { useCallback, useMemo, useState } from "react";
import { offsetOf, slideScores, type Alignment } from "../../core/alignment";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import StripPair, { type StripPairProps } from "./StripPair";

type SlideScore = ReturnType<typeof slideScores>[number];

function SlideChart({
  scores,
  visited,
  offset,
}: {
  scores: SlideScore[];
  visited: Set<number>;
  offset: number | null;
}) {
  const [all, setAll] = useState(false);
  const [wrapRef, avail] = useWidth<HTMLDivElement>();

  const max = Math.max(4, ...scores.map((s) => s.matches));
  const bw = Math.min(28, (avail || 600) / scores.length);
  const h = 72;
  const width = scores.length * bw;
  const zero = scores.findIndex((s) => s.offset === 0);

  return (
    <div ref={wrapRef}>
      <div className="mb-2 flex items-baseline justify-between font-ui text-sm">
        <span className="text-ink-600">Matches at each slide</span>
        <button
          type="button"
          onClick={() => setAll((a) => !a)}
          className="text-ink-500 underline decoration-ink-300 underline-offset-2 hover:text-ink-900"
        >
          {all ? "Show only the ones tried" : "Show every slide"}
        </button>
      </div>
      <svg
        width={width}
        height={h + 22}
        role="img"
        aria-label="Matches at each offset of the bottom row against the top row"
        className="mt-4 overflow-visible font-ui"
      >
        {scores.map((s, k) => {
          const shown = all || visited.has(s.offset);
          const bh = (s.matches / max) * h;
          const current = s.offset === offset;
          return (
            <g key={s.offset}>
              {shown ? (
                <rect
                  x={k * bw + 1.5}
                  y={h - Math.max(bh, 1.5)}
                  width={bw - 3}
                  height={Math.max(bh, 1.5)}
                  rx={2}
                  fill={current ? RW.match : RW.matchSoft}
                  stroke={current ? RW.match : RW.matchEdge}
                  strokeWidth={1}
                />
              ) : (
                <rect x={k * bw + 1.5} y={h - 1.5} width={bw - 3} height={1.5} fill={RW.rule} />
              )}
              {shown && s.matches > 0 && (
                <text
                  x={k * bw + bw / 2}
                  y={h - bh - 4}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={current ? 600 : 400}
                  fill={current ? RW.matchInk : RW.label}
                >
                  {s.matches}
                </text>
              )}
            </g>
          );
        })}
        <text x={zero * bw + bw / 2} y={h + 13} textAnchor="middle" fontSize={11} fill={RW.label}>
          0
        </text>
        <text x={0} y={h + 13} fontSize={11} fill={RW.faint}>
          ← left
        </text>
        <text x={width} y={h + 13} textAnchor="end" fontSize={11} fill={RW.faint}>
          right →
        </text>
      </svg>
    </div>
  );
}

export default function SlideStation(props: Omit<StripPairProps, "mode" | "penalty" | "extra">) {
  const { top, bottom } = props;
  const scores = useMemo(() => slideScores(top, bottom), [top, bottom]);
  const start = props.startOffset ?? 0;
  const [offset, setOffset] = useState<number | null>(start);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([start]));

  const onChange = useCallback((al: Alignment) => {
    const d = offsetOf(al);
    setOffset(d);
    if (d !== null) setVisited((v) => (v.has(d) ? v : new Set(v).add(d)));
  }, []);

  return (
    <StripPair
      {...props}
      mode="slide"
      penalty={0}
      onChange={onChange}
      showBest={false}
      extra={<SlideChart scores={scores} visited={visited} offset={offset} />}
    />
  );
}
