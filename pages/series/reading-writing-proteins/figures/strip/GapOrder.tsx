// Two alignments that pair the same residues and differ only in the order of
// the gaps between them.
import { GAP } from "../../core/alignment";
import { RW } from "../palette";

const CELL = 34;

const PAIRS: [string, string][] = [
  ["LK-H", "L-TH"],
  ["L-KH", "LT-H"],
];

function Row({ row, other }: { row: string; other: string }) {
  return (
    <div className="flex">
      {row.split("").map((x, k) =>
        x === GAP ? (
          <div key={k} className="flex items-center" style={{ width: CELL, height: CELL + 6 }}>
            <span className="block w-full" style={{ borderTop: `2px solid ${RW.gap}` }} />
          </div>
        ) : (
          <div
            key={k}
            className="flex items-center justify-center rounded-md border font-mono text-[15px]"
            style={{
              width: CELL - 3,
              height: CELL + 6,
              margin: "0 1.5px",
              ...(x === other[k]
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
}

export default function GapOrder() {
  return (
    <figure className="my-8 w-full max-w-prose self-center">
      <div className="flex justify-center gap-16">
        {PAIRS.map(([top, bottom]) => (
          <div key={top} aria-label={`${top} over ${bottom}`} role="img">
            <Row row={top} other={bottom} />
            <svg width={top.length * CELL} height={14} aria-hidden className="block">
              {top
                .split("")
                .map((x, k) =>
                  x !== GAP && x === bottom[k] ? (
                    <line
                      key={k}
                      x1={k * CELL + CELL / 2}
                      x2={k * CELL + CELL / 2}
                      y1={1}
                      y2={13}
                      stroke={RW.match}
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                  ) : null
                )}
            </svg>
            <Row row={bottom} other={top} />
          </div>
        ))}
      </div>
      <figcaption className="mt-4 text-center font-ui text-sm text-ink-500">
        Both pair L with L and H with H, and leave K and T unpaired.
      </figcaption>
    </figure>
  );
}
