// One molecule scattering, beside a crystal of the same molecule in unit cells.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import Molecule from "./Molecule";
import { WaveArrow } from "./scene";

// Offset of the molecule's bounding-box centre from its origin, in its own units.
const MID: [number, number] = [4.1, 1.8];

export function Mol({ cx, cy, scale }: { cx: number; cy: number; scale: number }) {
  return <Molecule x={cx - MID[0] * scale} y={cy - MID[1] * scale} scale={scale} />;
}

const ROWS = 3;
const DEPTH = 3;

export function UnitCell() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;

  const cw = narrow ? 40 : 50;
  const ch = narrow ? 30 : 37;
  // One cell's step into the page, as drawn.
  const dx = narrow ? 11 : 14;
  const dy = narrow ? 8 : 10;

  const top = 24 + DEPTH * dy;
  const gridH = ROWS * ch;
  const cy = top + gridH / 2;
  const H = top + gridH + 30;

  const mx = narrow ? 80 : 150;
  const ripples = narrow ? [20, 30, 40] : [24, 37, 50];
  const leftW = mx + ripples[2] + (narrow ? 8 : 40);
  const arrow = narrow ? 40 : 56;

  const gx = leftW + arrow + 6;
  const cols = Math.max(2, Math.min(5, Math.floor((W - gx - DEPTH * dx - 2) / cw)));
  const gw = cols * cw;
  const right = gx + gw;

  const lines: string[] = [];
  for (let c = 0; c <= cols; c++) {
    const x = gx + c * cw;
    lines.push(`M${x} ${top + gridH}V${top}l${DEPTH * dx} ${-DEPTH * dy}`);
  }
  for (let r = 0; r <= ROWS; r++) {
    const y = top + r * ch;
    lines.push(`M${gx} ${y}H${right}l${DEPTH * dx} ${-DEPTH * dy}`);
  }
  for (let k = 1; k <= DEPTH; k++) {
    lines.push(`M${gx + k * dx} ${top - k * dy}h${gw}v${gridH}`);
  }

  // The front, top, right corner cell.
  const px = right - cw;
  const cell =
    `M${px} ${top}h${cw}v${ch}h${-cw}z` +
    `M${px} ${top}l${dx} ${-dy}h${cw}l${-dx} ${dy}` +
    `M${px + cw + dx} ${top - dy}v${ch}l${-dx} ${dy}`;

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>One molecule, and a crystal of them</title>
        <desc id={`${ids}d`}>
          On the left, an x-ray wave strikes one molecule and faint waves spread
          from it in every direction. On the right, the same wave strikes a
          block of identical boxes stacked in three dimensions, each holding
          the same molecule. One box is outlined: the unit cell.
        </desc>

        <WaveArrow x0={0} x1={mx - ripples[2] - 6} y={cy} />
        <g fill="none" stroke={XR.first}>
          {ripples.map((r, i) => (
            <circle key={r} cx={mx} cy={cy} r={r} strokeOpacity={0.4 - i * 0.13} />
          ))}
        </g>
        <Mol cx={mx} cy={cy} scale={narrow ? 0.5 : 0.6} />

        <WaveArrow x0={leftW} x1={gx - 6} y={cy} />
        <path
          d={`M${gx} ${top}l${DEPTH * dx} ${-DEPTH * dy}h${gw}v${gridH}l${-DEPTH * dx} ${DEPTH * dy}V${top}z`}
          fill={XR.rule}
          fillOpacity={0.45}
        />
        <rect x={gx} y={top} width={gw} height={gridH} fill={XR.paper} />
        <path d={lines.join("")} fill="none" stroke={XR.guide} strokeLinejoin="round" />
        {Array.from({ length: cols * ROWS }, (_, i) => (
          <Mol
            key={i}
            cx={gx + (i % cols) * cw + cw / 2}
            cy={top + Math.floor(i / cols) * ch + ch / 2}
            scale={narrow ? 0.42 : 0.52}
          />
        ))}
        <path
          d={cell}
          fill="none"
          stroke={XR.accent}
          strokeWidth={1.75}
          strokeLinejoin="round"
        />

        <g className="font-mono" fontSize={text} fill={XR.label} textAnchor="middle">
          <text x={px + cw / 2 + dx} y={top - DEPTH * dy - 8} fill={XR.accent}>
            unit cell
          </text>
          <text x={mx} y={H - 6}>
            one molecule
          </text>
          <text x={gx + gw / 2} y={H - 6}>
            a crystal
          </text>
        </g>
      </svg>
    </div>
  );
}
