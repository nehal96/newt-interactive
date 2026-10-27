// A one-line Patterson: every wave crest-up at the middle, as tall as its spot is dark, adds into peaks at the gaps between atoms.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";

const ATOMS = [0.3, 0.45, 0.7];
const N = 12;
const BLUR = 0.006;
/** Each atom paired with itself adds a huge peak at zero distance; subtracting it leaves only the gaps between different atoms. */
const DARK = Array.from({ length: N }, (_, k) => {
  const n = k + 1;
  const f = Math.exp(-BLUR * n * n);
  const re = ATOMS.reduce((acc, x) => acc + Math.cos(TAU * n * x), 0) * f;
  const im = ATOMS.reduce((acc, x) => acc + Math.sin(TAU * n * x), 0) * f;
  return re * re + im * im - ATOMS.length * f * f;
});
const patterson = (u: number) => DARK.reduce((acc, d, k) => acc + d * Math.cos(TAU * (k + 1) * u), 0);
const SAMPLE = Array.from({ length: 501 }, (_, i) => (i / 500) * 0.5);
const HI = Math.max(...SAMPLE.map(patterson));
const LO = Math.min(...SAMPLE.map(patterson));
const GAPS = [
  { a: 0, b: 1, level: 0 },
  { a: 1, b: 2, level: 0 },
  { a: 0, b: 2, level: 1 },
].map((g) => ({ ...g, d: ATOMS[g.b] - ATOMS[g.a] }));
const pct = (v: number) => `${Math.round(v * 100)}%`;

export function PattersonLine() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const left = narrow ? 76 : 110;
  const len = W - left - 4;

  const boxY = 8;
  const X = (x: number) => left + x * len;
  const bracketY = (level: number) => boxY + 22 + 14 + level * 18;
  const lineTop = bracketY(1) + 60;
  const lineH = 90;
  const base = lineTop + lineH;
  const D = (u: number) => left + u * len;
  const yOf = (v: number) => base - ((v - LO) / (HI - LO)) * lineH;
  const axisY = base + 16;
  const H = axisY + 30;

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>Added without flips, the waves peak at the gaps between atoms, not at the atoms</title>
        <desc id={`${ids}d`}>
          A molecule of three atoms has gaps of {GAPS.map((g) => pct(g.d)).join(", ")} of the box. With every wave crest-up at
          the middle and as tall as its spot is dark, the sum has peaks at exactly those distances.
        </desc>

        <rect x={left} y={boxY} width={len} height={22} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
        {ATOMS.map((x) => (
          <circle key={x} cx={X(x)} cy={boxY + 11} r={4.5} fill={XR.sum} />
        ))}
        {GAPS.map((g) => (
          <g key={`${g.a}${g.b}`} stroke={XR.second} strokeWidth={1}>
            <line x1={X(ATOMS[g.a])} x2={X(ATOMS[g.b])} y1={bracketY(g.level)} y2={bracketY(g.level)} />
            <line x1={X(ATOMS[g.a])} x2={X(ATOMS[g.a])} y1={bracketY(g.level) - 4} y2={bracketY(g.level) + 4} />
            <line x1={X(ATOMS[g.b])} x2={X(ATOMS[g.b])} y1={bracketY(g.level) - 4} y2={bracketY(g.level) + 4} />
          </g>
        ))}

        <line x1={left} x2={left + len / 2} y1={yOf(0)} y2={yOf(0)} stroke={XR.rule} />
        <g stroke={XR.second} strokeWidth={0.75} strokeDasharray="2 3">
          {GAPS.map((g) => (
            <line key={`${g.a}${g.b}`} x1={D(g.d)} x2={D(g.d)} y1={lineTop - 4} y2={base} />
          ))}
        </g>
        <path d={curvePath(left, base, len / 2, (t) => ((patterson(t / len) - LO) / (HI - LO)) * lineH, 1)} fill="none" stroke={XR.accent} strokeWidth={2.25} />

        <line x1={left} x2={left + len / 2} y1={axisY - 6} y2={axisY - 6} stroke={XR.rule} />
        <g className="font-mono" fontSize={10} fill={XR.label} textAnchor="middle">
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((u) => (
            <g key={u}>
              <line x1={D(u)} x2={D(u)} y1={axisY - 9} y2={axisY - 3} stroke={XR.atom} />
              <text x={D(u)} y={axisY + 8}>
                {pct(u)}
              </text>
            </g>
          ))}
        </g>

        <Labels size={text}>
          <text x={0} y={boxY + 15}>the molecule</text>
          <text x={0} y={bracketY(0) + 4} fill={XR.second}>
            its gaps
          </text>
          {GAPS.map((g) => (
            <text key={`${g.a}${g.b}`} x={(X(ATOMS[g.a]) + X(ATOMS[g.b])) / 2} y={bracketY(g.level) - 4} textAnchor="middle" fill={XR.second}>
              {pct(g.d)}
            </text>
          ))}
          <text x={left} y={lineTop - 26}>
            {narrow ? "no flips: all crest-up, as tall as dark" : "no flips: every wave crest-up at the middle, as tall as its spot is dark"}
          </text>
          <text x={0} y={lineTop + lineH / 2} fill={XR.accent}>
            added up
          </text>
          {GAPS.map((g) => (
            <text key={`${g.a}${g.b}`} x={D(g.d)} y={yOf(patterson(g.d)) - 6} textAnchor="middle" fill={XR.second}>
              {pct(g.d)}
            </text>
          ))}
          <text x={left} y={axisY + 22}>
            distance apart, on the box’s scale
          </text>
          {!narrow && (
            <text x={left + len / 2 + 24} y={lineTop + lineH / 2}>
              each peak sits one gap from zero
            </text>
          )}
        </Labels>
      </svg>
    </div>
  );
}
