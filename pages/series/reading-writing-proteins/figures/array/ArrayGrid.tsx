// Needleman and Wunsch's array drawn as a lettered grid: protein A across the
// top, protein B down the side, a number in each cell.
import { type ReactNode } from "react";
import { type Pos } from "../../core/nw1970";
import { RW } from "../palette";

export type CellLook = { fill?: string; ink?: string; weight?: number; ring?: string };

const MARGIN = 18;

export default function ArrayGrid({
  across,
  down,
  width,
  value,
  look,
  onCell,
  onHover,
  path = [],
  paths = [],
  children,
  label,
}: {
  across: string;
  down: string;
  width: number;
  value: (i: number, j: number) => number | null;
  look?: (i: number, j: number) => CellLook;
  onCell?: (p: Pos) => void;
  onHover?: (p: Pos | null) => void;
  /** A pathway to draw over the cells. */
  path?: Pos[];
  /** Fainter pathways drawn underneath it. */
  paths?: Pos[][];
  children?: (cell: number, margin: number) => ReactNode;
  label: string;
}) {
  const cols = across.length;
  const rows = down.length;
  const cell = (width - MARGIN) / cols;
  const height = MARGIN + cell * rows;
  const x = (j: number) => MARGIN + cell * (j + 0.5);
  const y = (i: number) => MARGIN + cell * (i + 0.5);
  const fs = Math.max(8, Math.min(13, cell * 0.45));

  const drawPath = (p: Pos[], faint: boolean, key: string) =>
    p.slice(1).map(([i, j], k) => {
      const [pi, pj] = p[k];
      const diag = i - pi === 1 && j - pj === 1;
      return (
        <line
          key={`${key}-${k}`}
          x1={x(pj)}
          y1={y(pi)}
          x2={x(j)}
          y2={y(i)}
          stroke={diag ? RW.structure : RW.gap}
          strokeOpacity={faint ? 0.35 : 1}
          strokeWidth={faint ? 1.5 : 2}
          strokeDasharray={diag ? undefined : "4 3"}
          strokeLinecap="round"
        />
      );
    });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full select-none"
      style={{ maxWidth: width }}
      role="img"
      aria-label={label}
      onPointerLeave={onHover ? () => onHover(null) : undefined}
    >
      <g className="font-mono" fontSize={fs}>
        {across.split("").map((a, j) => (
          <text key={`a${j}`} x={x(j)} y={MARGIN - 5} textAnchor="middle" fill={RW.label}>
            {a}
          </text>
        ))}
        {down.split("").map((b, i) => (
          <text key={`d${i}`} x={MARGIN - 5} y={y(i) + fs * 0.35} textAnchor="end" fill={RW.label}>
            {b}
          </text>
        ))}
      </g>
      {down.split("").map((_, i) =>
        across.split("").map((_, j) => {
          const l = look?.(i, j) ?? {};
          return (
            <rect
              key={`c${i}-${j}`}
              x={MARGIN + cell * j + 0.5}
              y={MARGIN + cell * i + 0.5}
              width={cell - 1}
              height={cell - 1}
              rx={Math.min(4, cell * 0.15)}
              fill={l.fill ?? "transparent"}
              stroke={l.ring ?? "none"}
              strokeWidth={1.5}
              onClick={onCell ? () => onCell([i, j]) : undefined}
              onPointerEnter={onHover ? () => onHover([i, j]) : undefined}
              className={onCell ? "cursor-pointer" : undefined}
            />
          );
        })
      )}
      <rect x={MARGIN} y={MARGIN} width={cell * cols} height={cell * rows} fill="none" stroke={RW.rule} />
      <g className="pointer-events-none">
        {paths.map((p, k) => drawPath(p, true, `p${k}`))}
        {drawPath(path, false, "main")}
      </g>
      <g className="pointer-events-none font-ui tabular-nums" fontSize={fs}>
        {down.split("").map((_, i) =>
          across.split("").map((_, j) => {
            const v = value(i, j);
            if (v === null) return null;
            const l = look?.(i, j) ?? {};
            return (
              <text
                key={`v${i}-${j}`}
                x={x(j)}
                y={y(i) + fs * 0.35}
                textAnchor="middle"
                fontWeight={l.weight ?? 400}
                fill={l.ink ?? RW.residue}
                paintOrder="stroke"
                stroke={l.fill && l.fill !== "transparent" ? l.fill : RW.paper}
                strokeWidth={3}
              >
                {v}
              </text>
            );
          })
        )}
      </g>
      {children?.(cell, MARGIN)}
    </svg>
  );
}
