// One sequence down the left, the other along the top, and a dot wherever the
// two residues are the same.
import { useMemo, type MouseEvent, type ReactNode } from "react";
import { dots } from "../../core/diagram";
import { RW } from "../palette";

export type DiagramProps = {
  down: string;
  across: string;
  /** Width the diagram fills, in px; cells are square. */
  width: number;
  letters?: boolean;
  /** Cells to draw as dots; defaults to every match. */
  shown?: [number, number][];
  /** A diagonal to bring forward, with `band` neighbors each side; the rest fade. */
  diagonal?: number | null;
  band?: number;
  onCell?: (cell: [number, number] | null) => void;
  onPick?: (cell: [number, number]) => void;
  hover?: [number, number] | null;
  children?: (cell: number, margin: number) => ReactNode;
  label?: string;
};

const MARGIN = 18;

export default function DotDiagram({
  down,
  across,
  width,
  letters = false,
  shown,
  diagonal = null,
  band = 0,
  onCell,
  onPick,
  hover = null,
  children,
  label,
}: DiagramProps) {
  const m = letters ? MARGIN : 0;
  const cell = (width - m) / across.length;
  const all = useMemo(() => dots(down, across), [down, across]);
  const drawn = shown ?? all;
  const height = m + cell * down.length;
  const r = Math.max(0.6, Math.min(cell * 0.32, 7));

  const at = (e: MouseEvent<SVGSVGElement>): [number, number] | null => {
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) / box.width) * width - m;
    const y = ((e.clientY - box.top) / box.height) * height - m;
    const i = Math.floor(y / cell);
    const j = Math.floor(x / cell);
    return i >= 0 && i < down.length && j >= 0 && j < across.length ? [i, j] : null;
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full touch-none select-none"
      style={{ maxWidth: width }}
      role="img"
      aria-label={label ?? `Diagram with ${drawn.length} dots`}
      onPointerMove={onCell ? (e) => onCell(at(e)) : undefined}
      onPointerLeave={onCell ? () => onCell(null) : undefined}
      onClick={
        onPick
          ? (e) => {
              const c = at(e);
              if (c) onPick(c);
            }
          : undefined
      }
    >
      {letters && (
        <g className="font-mono" fontSize={Math.min(13, cell * 0.5)}>
          {across.split("").map((x, j) => (
            <text
              key={`a${j}`}
              x={m + cell * (j + 0.5)}
              y={m - 5}
              textAnchor="middle"
              fill={hover && hover[1] === j ? RW.residue : RW.label}
              fontWeight={hover && hover[1] === j ? 600 : 400}
            >
              {x}
            </text>
          ))}
          {down.split("").map((x, i) => (
            <text
              key={`d${i}`}
              x={m - 5}
              y={m + cell * (i + 0.5) + 4}
              textAnchor="end"
              fill={hover && hover[0] === i ? RW.residue : RW.label}
              fontWeight={hover && hover[0] === i ? 600 : 400}
            >
              {x}
            </text>
          ))}
        </g>
      )}
      <rect x={m} y={m} width={cell * across.length} height={cell * down.length} fill="none" stroke={RW.rule} />
      {letters && (
        <g stroke={RW.wash}>
          {across
            .split("")
            .map((_, j) => (j ? <line key={`v${j}`} x1={m + cell * j} x2={m + cell * j} y1={m} y2={height} /> : null))}
          {down
            .split("")
            .map((_, i) => (i ? <line key={`h${i}`} x1={m} x2={width} y1={m + cell * i} y2={m + cell * i} /> : null))}
        </g>
      )}
      {hover && (
        <rect
          x={m + cell * hover[1]}
          y={m + cell * hover[0]}
          width={cell}
          height={cell}
          fill="none"
          stroke={RW.faint}
          strokeWidth={1.5}
        />
      )}
      {drawn.map(([i, j]) => {
        const faded = diagonal !== null && Math.abs(i - j - diagonal) > band;
        return cell >= 6 ? (
          <circle
            key={`${i}-${j}`}
            cx={m + cell * (j + 0.5)}
            cy={m + cell * (i + 0.5)}
            r={r}
            fill={faded ? RW.matchEdge : RW.match}
          />
        ) : (
          <rect
            key={`${i}-${j}`}
            x={m + cell * j}
            y={m + cell * i}
            width={cell}
            height={cell}
            fill={faded ? RW.rule : RW.matchInk}
          />
        );
      })}
      {children?.(cell, m)}
    </svg>
  );
}

export { MARGIN };
