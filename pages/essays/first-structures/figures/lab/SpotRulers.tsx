// Each spot marks the cell off in a different number of wavelengths, so the same atoms arrive with different shifts.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { Labels } from "../scene";
import { ATOMS, cellHeight, lag } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const frac = (v: number) => v - Math.floor(v);
const colour = (i: number) => (i === 1 ? XR.second : XR.first);

export function SpotRulers() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const gap = narrow ? 10 : 16;
  const labelW = narrow ? 50 : 76;
  const numsW = narrow ? 96 : 138;
  const darkW = narrow ? 42 : 64;
  const rw = W - labelW - numsW - darkW - 3 * gap;
  const x1 = labelW + gap;
  const x2 = x1 + rw + gap;
  const x3 = x2 + numsW + gap;
  const top = 26;
  const rowH = 40;
  const H = top + SPOTS.length * rowH + 4;
  const numX = (i: number) => x2 + (i + 0.5) * (numsW / 3);

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>At spot n the cell is n wavelengths wide, so each atom's shift is n times its place across the cell</title>
        <desc id={`${ids}d`}>
          {SPOTS.map(
            (n) =>
              `Spot ${n}: shifts ${ATOMS.map((x) => frac(lag(n, x)).toFixed(2)).join(", ")}, darkness ${(cellHeight(n, ATOMS) ** 2).toFixed(1)} of 9.`,
          ).join(" ")}
        </desc>

        {SPOTS.map((n, r) => {
          const yc = top + r * rowH + rowH / 2;
          const b = cellHeight(n, ATOMS) ** 2;
          return (
            <g key={n}>
              <rect x={x1} y={yc - 10} width={rw} height={20} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
              <g stroke={XR.label} strokeWidth={0.75} strokeDasharray="2 2">
                {Array.from({ length: n - 1 }, (_, k) => (
                  <line key={k} x1={x1 + ((k + 1) / n) * rw} x2={x1 + ((k + 1) / n) * rw} y1={yc - 10} y2={yc + 10} />
                ))}
              </g>
              {ATOMS.map((x, i) => (
                <circle key={i} cx={x1 + x * rw} cy={yc} r={4} fill={i === 1 ? XR.second : XR.sum} />
              ))}
              <circle cx={x3 + 8} cy={yc} r={7} fill={XR.sum} fillOpacity={0.04 + (0.92 * b) / 9} stroke={XR.atom} strokeWidth={0.5} />
            </g>
          );
        })}

        <Labels size={text}>
          <text x={x1} y={12}>{narrow ? "the cell" : "the cell, marked off in wavelengths"}</text>
          <text x={x2 + numsW / 2} y={12} textAnchor="middle">shifts</text>
          <text x={x3} y={12}>dark</text>
          {SPOTS.map((n, r) => {
            const yc = top + r * rowH + rowH / 2;
            return (
              <g key={n}>
                <text x={0} y={yc - 2} fill={XR.sum}>spot {n}</text>
                <text x={0} y={yc + 11} fontSize={text - 1}>
                  {narrow ? `${n} wide` : `${n} wave${n > 1 ? "s" : ""} wide`}
                </text>
                {ATOMS.map((x, i) => (
                  <text key={i} x={numX(i)} y={yc + 4} textAnchor="middle" fill={colour(i)}>
                    {frac(lag(n, x)).toFixed(2)}
                  </text>
                ))}
                <text x={x3 + 19} y={yc + 4}>{(cellHeight(n, ATOMS) ** 2).toFixed(1)}</text>
              </g>
            );
          })}
        </Labels>
      </svg>
    </div>
  );
}
