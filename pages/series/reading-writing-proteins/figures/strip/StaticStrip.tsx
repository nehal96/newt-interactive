// Two gapped rows drawn the way StripPair draws them, without the dragging.
import { GAP, internalGaps } from "../../core/alignment";
import { RW } from "../palette";
import { useWidth } from "../useWidth";

export default function StaticStrip({
  top,
  bottom,
  topLabel,
  bottomLabel,
  maxCell = 30,
}: {
  top: string[];
  bottom: string[];
  topLabel?: string;
  bottomLabel?: string;
  maxCell?: number;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const cols = top.length;
  const cw = Math.max(16, Math.min(maxCell, Math.floor((width || 640) / cols)));
  const matched = top.map((x, k) => x !== GAP && x === bottom[k]);

  const row = (r: string[]) => {
    const inside = internalGaps(r);
    return (
      <div className="flex">
        {r.map((x, k) =>
          x === GAP ? (
            <div key={k} aria-hidden className="flex items-center" style={{ width: cw, height: cw + 4 }}>
              <span
                className="block w-full"
                style={inside[k] ? { borderTop: `2px solid ${RW.gap}` } : { borderTop: `1px dotted ${RW.faint}` }}
              />
            </div>
          ) : (
            <div
              key={k}
              className="flex items-center justify-center rounded-[5px] border font-mono"
              style={{
                width: cw - 2,
                height: cw + 4,
                margin: "0 1px",
                fontSize: Math.min(15, cw * 0.55),
                ...(matched[k]
                  ? { color: RW.matchInk, background: RW.matchSoft, borderColor: RW.matchEdge, fontWeight: 600 }
                  : { color: RW.residue, background: RW.wash, borderColor: RW.rule }),
              }}
            >
              {x}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div ref={ref} className="overflow-x-auto pb-1">
      <div style={{ width: cols * cw }}>
        {topLabel && <div className="mb-1.5 font-ui text-xs text-ink-500">{topLabel}</div>}
        {row(top)}
        <svg width={cols * cw} height={10} aria-hidden className="block">
          {matched.map((on, k) =>
            on ? (
              <line
                key={k}
                x1={k * cw + cw / 2}
                x2={k * cw + cw / 2}
                y1={1}
                y2={9}
                stroke={RW.match}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ) : null
          )}
        </svg>
        {row(bottom)}
        {bottomLabel && <div className="mt-1.5 font-ui text-xs text-ink-500">{bottomLabel}</div>}
      </div>
    </div>
  );
}
