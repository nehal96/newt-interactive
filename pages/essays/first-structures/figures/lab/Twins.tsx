// Two different molecules with the same gaps between their atoms, and the identical films they make.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { Labels } from "../scene";
import { ATOMS, FLIPPED, cellHeight } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const pct = (v: number) => `${Math.round(v * 100)}%`;

export function Twins() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 70 : 100;
  const cw = W - labelW - 4;
  const X = (x: number) => labelW + x * cw;

  const rowH = 118;
  const H = 2 * rowH + 4;
  const rows = [
    { atoms: ATOMS, name: "molecule A", sub: "atom 2 at 35%" },
    { atoms: FLIPPED, name: "molecule B", sub: "atom 2 at 47%" },
  ];

  const bracket = (x0: number, x1: number, y: number, label: string, key: string) => (
    <g key={key}>
      <g stroke={XR.label} strokeWidth={1}>
        <line x1={X(x0)} x2={X(x1)} y1={y} y2={y} />
        <line x1={X(x0)} x2={X(x0)} y1={y - 4} y2={y + 4} />
        <line x1={X(x1)} x2={X(x1)} y1={y - 4} y2={y + 4} />
      </g>
      <Labels size={text}>
        <text x={(X(x0) + X(x1)) / 2} y={y - 5} textAnchor="middle" fill={XR.sum}>
          {label}
        </text>
      </Labels>
    </g>
  );

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>Two different molecules with the same gaps between their atoms make the same film</title>
        <desc id={`${ids}d`}>
          Molecule A has atoms at 12%, 35% and 70% across the cell; molecule B, at 12%, 47% and 70%. A's gaps are 23%,
          35% and 58%; B's are 35%, 23% and 58%, the same three in a different order. Their six spots are identical.
        </desc>

        {rows.map(({ atoms }, r) => {
          const top = r * rowH + 8;
          const cellY = top + 30;
          const filmY = cellY + 46;
          return (
            <g key={r}>
              {bracket(atoms[0], atoms[2], top + 14, `${pct(atoms[2] - atoms[0])}`, "long")}
              <rect x={labelW} y={cellY} width={cw} height={22} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
              {atoms.map((x, i) => (
                <circle key={i} cx={X(x)} cy={cellY + 11} r={4.5} fill={i === 1 ? XR.second : XR.sum} />
              ))}
              {bracket(atoms[0], atoms[1], cellY + 36, pct(atoms[1] - atoms[0]), "a")}
              {bracket(atoms[1], atoms[2], cellY + 36, pct(atoms[2] - atoms[1]), "b")}
              <rect x={labelW} y={filmY + 4} width={cw} height={22} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
              <rect x={labelW + 4} y={filmY + 10} width={8} height={10} rx={1} fill={XR.label} />
              {SPOTS.map((n) => (
                <circle
                  key={n}
                  cx={labelW + (n / (SPOTS.length + 0.5)) * cw}
                  cy={filmY + 15}
                  r={6}
                  fill={XR.sum}
                  fillOpacity={0.04 + (0.92 * cellHeight(n, atoms) ** 2) / 9}
                />
              ))}
            </g>
          );
        })}

        <Labels size={text}>
          {rows.map(({ name, sub }, r) => {
            const cellY = r * rowH + 38;
            return (
              <g key={name}>
                <text x={0} y={cellY + 9} fill={XR.sum}>{name}</text>
                <text x={0} y={cellY + 22} fontSize={text - 1}>{sub}</text>
                <text x={0} y={cellY + 65}>its film</text>
              </g>
            );
          })}
        </Labels>
      </svg>
    </div>
  );
}
