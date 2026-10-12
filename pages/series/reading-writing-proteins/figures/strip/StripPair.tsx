// Two sequences the reader lines up by hand: drag a residue to open or close a
// gap before it, or in slide mode drag a whole row.
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@lib/utils";
import {
  GAP,
  atOffset,
  internalGaps,
  pull,
  push,
  scoreOf,
  slide,
  type Alignment,
  type Side,
} from "../../core/alignment";
import { bestAlignment } from "../../core/best";
import { RW } from "../palette";
import { useWidth } from "../useWidth";
import ScoreLine from "./ScoreLine";

export type StripMode = "slide" | "gap";

export type StripPairProps = {
  top: string;
  bottom: string;
  topLabel: string;
  bottomLabel: string;
  penalty: number;
  target?: number;
  mode?: StripMode;
  /** Where the bottom row starts, relative to the top. */
  startOffset?: number;
  /** Shown once the score reaches the target. */
  solved?: ReactNode;
  showBest?: boolean;
  onChange?: (al: Alignment) => void;
};

const SIDES: Side[] = ["top", "bottom"];

// Column of the residue that is the idx-th residue of its row.
const columnOf = (row: string[], idx: number) => {
  let seen = -1;
  for (let k = 0; k < row.length; k++) {
    if (row[k] !== GAP && ++seen === idx) return k;
  }
  return -1;
};

export default function StripPair({
  top,
  bottom,
  topLabel,
  bottomLabel,
  penalty,
  target,
  mode = "gap",
  startOffset = 0,
  solved,
  showBest = true,
  onChange,
}: StripPairProps) {
  const initial = () => atOffset(top, bottom, startOffset);
  const [al, setAl] = useState<Alignment>(initial);
  const [revealed, setRevealed] = useState(false);
  const [focus, setFocus] = useState<Record<Side, number>>({ top: 0, bottom: 0 });
  const [dragging, setDragging] = useState<{ side: Side; idx: number } | null>(null);
  const alRef = useRef(al);
  alRef.current = al;
  const drag = useRef<{ side: Side; idx: number; anchor: number } | null>(null);
  const cellRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [wrapRef, width] = useWidth<HTMLDivElement>();

  useEffect(() => {
    onChange?.(al);
  }, [al, onChange]);

  const cols = al.top.length;
  const cw = Math.max(22, Math.min(32, Math.floor((width || 640) / cols)));
  const score = scoreOf(al, penalty);

  // One step of the residue left or right. Returns the new alignment, or null
  // when the residue can't move that way.
  const step = (cur: Alignment, side: Side, idx: number, dir: 1 | -1) => {
    if (mode === "slide") return slide(cur, side, dir);
    const col = columnOf(cur[side], idx);
    return dir === 1 ? push(cur, side, col) : pull(cur, side, col);
  };

  const onPointerDown = (side: Side, idx: number) => (e: PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { side, idx, anchor: e.clientX };
    setDragging({ side, idx });
    setFocus((f) => ({ ...f, [side]: idx }));
  };

  const onPointerMove = (e: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    let steps = Math.round((e.clientX - d.anchor) / cw);
    let cur = alRef.current;
    while (steps !== 0) {
      const dir = steps > 0 ? 1 : -1;
      const next = step(cur, d.side, d.idx, dir);
      if (!next) {
        d.anchor = e.clientX;
        break;
      }
      cur = next;
      d.anchor += dir * cw;
      steps -= dir;
    }
    if (cur !== alRef.current) setAl(cur);
  };

  const endDrag = () => {
    drag.current = null;
    setDragging(null);
  };

  const onKeyDown = (side: Side, idx: number, length: number) => (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    if (e.shiftKey) {
      const next = step(al, side, idx, dir);
      if (next) setAl(next);
    } else {
      const to = Math.max(0, Math.min(length - 1, idx + dir));
      setFocus((f) => ({ ...f, [side]: to }));
      cellRefs.current[`${side}-${to}`]?.focus();
    }
  };

  const reset = () => {
    setAl(initial());
    setRevealed(false);
  };

  const showBestAlignment = () => {
    setAl(bestAlignment(top, bottom, penalty).alignment);
    setRevealed(true);
  };

  const matched = al.top.map((x, k) => x !== GAP && x === al.bottom[k]);

  const renderRow = (side: Side) => {
    const row = al[side];
    const inside = internalGaps(row);
    const length = row.filter((x) => x !== GAP).length;
    let idx = -1;
    return (
      <div className="flex" style={{ width: cols * cw }}>
        {row.map((x, k) => {
          if (x === GAP) {
            return (
              <div
                key={`g${k}`}
                aria-hidden
                className="flex items-center justify-center"
                style={{ width: cw, height: cw + 6 }}
              >
                <span
                  className="block w-full"
                  style={
                    inside[k]
                      ? { borderTop: `2px solid ${RW.gap}` }
                      : { borderTop: `1px dotted ${RW.faint}` }
                  }
                />
              </div>
            );
          }
          idx++;
          const i = idx;
          const isDragged = dragging?.side === side && (mode === "slide" || dragging.idx === i);
          return (
            <button
              key={`r${i}`}
              ref={(el) => {
                cellRefs.current[`${side}-${i}`] = el;
              }}
              type="button"
              tabIndex={focus[side] === i ? 0 : -1}
              aria-label={`${x}, residue ${i + 1} of ${side === "top" ? topLabel : bottomLabel}`}
              onPointerDown={onPointerDown(side, i)}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={onKeyDown(side, i, length)}
              onFocus={() => setFocus((f) => ({ ...f, [side]: i }))}
              className={cn(
                "flex select-none items-center justify-center rounded-md border font-mono text-[15px] outline-none",
                "cursor-grab touch-none focus-visible:ring-2 focus-visible:ring-ink-400",
                isDragged ? "cursor-grabbing border-ink-400 bg-ink-200" : "border-ink-200 bg-ink-100 hover:border-ink-300"
              )}
              style={{
                width: cw - 3,
                height: cw + 6,
                margin: "0 1.5px",
                color: matched[k] ? RW.pairInk : RW.residue,
                fontWeight: matched[k] ? 600 : 400,
              }}
            >
              {x}
            </button>
          );
        })}
      </div>
    );
  };

  const reached = target !== undefined && score.score >= target;

  return (
    <figure className="my-8 w-full max-w-prose self-center">
      <div ref={wrapRef} className="overflow-x-auto pb-1">
        <div style={{ width: cols * cw }}>
          <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500">
            {topLabel}
          </div>
          {renderRow(SIDES[0])}
          <svg width={cols * cw} height={14} aria-hidden className="block">
            {matched.map((on, k) =>
              on ? (
                <line
                  key={k}
                  x1={k * cw + cw / 2}
                  x2={k * cw + cw / 2}
                  y1={1}
                  y2={13}
                  stroke={RW.pair}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              ) : null
            )}
          </svg>
          {renderRow(SIDES[1])}
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-500">
            {bottomLabel}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <ScoreLine score={score} target={target} slideOnly={mode === "slide"} />
        <div className="flex gap-2 font-ui text-sm">
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-ink-200 px-2.5 py-1 text-ink-700 hover:border-ink-400"
          >
            Reset
          </button>
          {showBest && (
            <button
              type="button"
              onClick={showBestAlignment}
              className="rounded-md border border-ink-200 px-2.5 py-1 text-ink-700 hover:border-ink-400"
            >
              Show the best
            </button>
          )}
        </div>
      </div>

      <figcaption className="mt-3 min-h-[1.5rem] font-ui text-sm leading-6 text-ink-600" aria-live="polite">
        {reached && !revealed && solved}
        {revealed && "One of the best alignments under these rules. Others may tie."}
        {!reached && !revealed && (
          <span className="text-ink-500">
            {mode === "slide"
              ? "Drag either row left or right."
              : "Drag a letter right to open a gap before it, or left to close one. With the keyboard, arrows move between letters and Shift + arrow drags."}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
