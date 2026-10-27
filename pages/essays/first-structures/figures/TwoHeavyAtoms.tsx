// With one heavy atom, a wave ahead of it and one behind change the spot alike; a second heavy atom elsewhere tells them apart.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";

/** Each heavy atom's wave as a share of the spot's own. */
const HEAVY = 0.5;
/** Where the second heavy atom's crests fall, in waves, relative to the mercury's. */
const SECOND = -1 / 6;
const COLUMNS = [
  { title: "If ahead", shift: -1 / 6 },
  { title: "If behind", shift: 1 / 6 },
];

const height = (shift: number, heavy: number) =>
  Math.hypot(1 + HEAVY * Math.cos(TAU * (heavy - shift)), HEAVY * Math.sin(TAU * (heavy - shift)));
const shade = (h: number) => 0.1 + (0.9 * h ** 2) / (1 + HEAVY) ** 2;
const MEASURED = height(COLUMNS[0].shift, SECOND);
const darkerOrFainter = (h: number) => (h > 1 ? "darker" : "fainter");

export function TwoHeavyAtoms() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(300);
  const text = 10;
  const labelW = 66;
  const gap = 12;
  const colW = (W - labelW - gap) / 2;
  const lam = colW / 2;
  const amp = 9;
  const rows = { head: 12, spot: 40, mercury: 72, sum1: 108, film1: 146, rule: 178, second: 206, sum2: 242, film2: 280 };
  const H = rows.film2 + 28;
  const wave = (shift: number, a = amp) => (t: number) => a * Math.cos((TAU * t) / lam - TAU / 4 - TAU * shift);

  const labels: [number, string[], string][] = [
    [rows.spot, ["spot’s", "wave"], XR.label],
    [rows.mercury, ["mercury’s", "wave"], XR.second],
    [rows.sum1, ["sum"], XR.accent],
    [rows.film1, ["the spot"], XR.label],
    [rows.second, ["2nd atom’s", "wave"], XR.second],
    [rows.sum2, ["sum"], XR.accent],
    [rows.film2, ["2nd film:", darkerOrFainter(MEASURED)], XR.label],
  ];

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t`}>
        <title id={`${ids}t`}>
          A spot&rsquo;s wave a sixth of a wave ahead of the mercury&rsquo;s, or a sixth behind, adds to the same
          height, so the spot darkens the same either way. A second heavy atom&rsquo;s wave, crests in another
          place, makes the spot darker in one case and fainter in the other; the second film shows which.
        </title>
        <g className="font-mono" fontSize={text}>
          {labels.map(([y, lines, fill]) => (
            <text key={y} x={0} y={lines.length > 1 ? y - 2 : y + 4} fill={fill}>
              {lines.map((line, i) => (
                <tspan key={line} x={0} dy={i ? 12 : 0}>
                  {line}
                </tspan>
              ))}
            </text>
          ))}
        </g>
        <line x1={0} x2={W} y1={rows.rule} y2={rows.rule} stroke={XR.rule} />

        {COLUMNS.map(({ title, shift }, c) => {
          const x = labelW + c * (colW + gap);
          const spot = wave(shift);
          const mercury = wave(0, HEAVY * amp);
          const second = wave(SECOND, HEAVY * amp);
          const after1 = height(shift, 0);
          const after2 = height(shift, SECOND);
          const fits = Math.abs(after2 - MEASURED) < 1e-9;
          const crests = [lam / 4, (5 * lam) / 4];
          const mid = x + colW / 2;
          const film = (y: number, after: number, ring: boolean) => (
            <g>
              <circle cx={mid - 18} cy={y} r={6} fill={XR.sum} fillOpacity={shade(1)} />
              <path d={`M${mid - 7} ${y} h12 m-4 -3.5 l4 3.5 l-4 3.5`} fill="none" stroke={XR.label} strokeWidth={1} />
              <circle cx={mid + 18} cy={y} r={6} fill={XR.sum} fillOpacity={shade(after)} />
              {ring && <circle cx={mid + 18} cy={y} r={9.5} fill="none" stroke={XR.success} strokeWidth={1.5} />}
              <text
                x={mid}
                y={y + 22}
                textAnchor="middle"
                className="font-mono"
                fontSize={text}
                fill={ring ? XR.success : XR.label}
              >
                {darkerOrFainter(after)}
              </text>
            </g>
          );
          return (
            <g key={title}>
              <text x={x} y={rows.head} className="font-ui" fontSize={text + 1} fontWeight={600} fill={XR.sum}>
                {title}
              </text>
              <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3">
                {crests.map((cx) => (
                  <line key={cx} x1={x + cx} x2={x + cx} y1={rows.spot - amp - 4} y2={rows.mercury + amp} />
                ))}
              </g>
              <g stroke={XR.rule}>
                {[rows.spot, rows.mercury, rows.sum1, rows.second, rows.sum2].map((y) => (
                  <line key={y} x1={x} x2={x + colW} y1={y} y2={y} />
                ))}
              </g>
              <g fill="none" strokeLinejoin="round">
                <path d={curvePath(x, rows.spot, colW, spot, 1)} stroke={XR.first} strokeWidth={1.75} />
                <path d={curvePath(x, rows.mercury, colW, mercury, 1)} stroke={XR.second} strokeWidth={1.5} strokeDasharray="4 3" />
                <path d={curvePath(x, rows.sum1, colW, (t) => spot(t) + mercury(t), 1)} stroke={XR.accent} strokeWidth={2.25} />
              </g>
              {film(rows.film1, after1, false)}
              <g opacity={fits ? 1 : 0.4}>
                <g fill="none" strokeLinejoin="round">
                  <path d={curvePath(x, rows.second, colW, second, 1)} stroke={XR.second} strokeWidth={1.5} strokeDasharray="4 3" />
                  <path d={curvePath(x, rows.sum2, colW, (t) => spot(t) + second(t), 1)} stroke={XR.accent} strokeWidth={2.25} />
                </g>
                {film(rows.film2, after2, fits)}
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
