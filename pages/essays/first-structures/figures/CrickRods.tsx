// Crick's 1951 test: the rod height each chain model predicts against the height Perutz measured.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";

/** Crick, Acta Cryst. 5:381 (1952), table 1, peak height with no overlapping, in e²/Å³. */
const BARS = [
  { label: "straight chains through the molecule", value: 3000, measured: false },
  { label: "short rods, half the chain", value: 625, measured: false },
  { label: "measured by Perutz", value: 230, measured: true },
];
const MAX = Math.max(...BARS.map((b) => b.value));

export function CrickRods() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(288);
  const valueW = 40;
  const barH = 12;
  const rowH = 44;
  const top = 22;
  const H = top + BARS.length * rowH;
  const len = (v: number) => (v / MAX) * (W - valueW);
  /** Square at the baseline, 4px round at the data end. */
  const bar = (y: number, w: number) => {
    const r = Math.min(4, w / 2);
    return `M0 ${y} H${w - r} Q${w} ${y} ${w} ${y + r} V${y + barH - r} Q${w} ${y + barH} ${w - r} ${y + barH} H0 Z`;
  };

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t`}
      >
        <title id={`${ids}t`}>
          {`Rod height: ${BARS.map((b) => `${b.label} ${b.value}`).join("; ")}.`}
        </title>
        <text x={0} y={10} className="font-ui" fontSize={11} fontWeight={600} fill={XR.sum}>
          Rod height in the 1948 Patterson map
        </text>
        {BARS.map((b, i) => {
          const y = top + i * rowH + 20;
          const w = len(b.value);
          return (
            <g key={b.label}>
              <text x={0} y={y - 7} className="font-mono" fontSize={10} fill={XR.label}>
                {b.label}
              </text>
              <path d={bar(y, w)} fill={b.measured ? XR.accent : XR.atom}>
                <title>{`${b.label}: ${b.value} e²/Å³`}</title>
              </path>
              <text
                x={w + 6}
                y={y + barH - 2}
                className="font-mono"
                fontSize={10}
                fill={XR.sum}
              >
                {b.value.toLocaleString("en-US")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
