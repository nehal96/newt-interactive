// A spot's wave plus the liquid's known wave: in step the spot darkens, opposed it fades.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";

/** The liquid's wave as a share of the spot's own. */
const LIQUID = 0.5;
const COLUMNS = [
  { title: "In step", shift: 0, verdict: "darker" },
  { title: "Opposed", shift: 0.5, verdict: "fainter" },
];

export function SaltPair() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(300);
  const text = 10;
  const labelW = 56;
  const gap = 12;
  const colW = (W - labelW - gap) / 2;
  const lam = colW / 2;
  const amp = 9;
  const rows = { head: 12, spot: 40, liquid: 72, sum: 110, film: 150 };
  const H = rows.film + 28;
  const shade = (d: number) => 0.1 + (0.9 * d) / (1 + LIQUID) ** 2;

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t`}>
        <title id={`${ids}t`}>
          A spot&rsquo;s wave plus the liquid&rsquo;s smaller wave. In step they add to a taller wave and the spot
          darkens; half a wave apart they add to a shorter one and the spot fades.
        </title>
        <g className="font-mono" fontSize={text} fill={XR.label}>
          <text x={0} y={rows.spot - 2}>spot’s</text>
          <text x={0} y={rows.spot + 10}>wave</text>
          <text x={0} y={rows.liquid - 2} fill={XR.second}>liquid’s</text>
          <text x={0} y={rows.liquid + 10} fill={XR.second}>wave</text>
          <text x={0} y={rows.sum + 4} fill={XR.accent}>sum</text>
          <text x={0} y={rows.film + 4}>the spot</text>
        </g>

        {COLUMNS.map(({ title, shift, verdict }, c) => {
          const x = labelW + c * (colW + gap);
          const spot = (t: number) => amp * Math.cos((TAU * t) / lam - TAU / 4);
          const liquid = (t: number) => LIQUID * amp * Math.cos((TAU * t) / lam - TAU / 4 - TAU * shift);
          const height = Math.abs(1 + (shift ? -LIQUID : LIQUID));
          const crests = [lam / 4, (5 * lam) / 4];
          return (
            <g key={title}>
              <text x={x} y={rows.head} className="font-ui" fontSize={text + 1} fontWeight={600} fill={XR.sum}>
                {title}
              </text>
              <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3">
                {crests.map((cx) => (
                  <line key={cx} x1={x + cx} x2={x + cx} y1={rows.spot - amp - 4} y2={rows.sum + amp * 1.5 + 4} />
                ))}
              </g>
              <g stroke={XR.rule}>
                {[rows.spot, rows.liquid, rows.sum].map((y) => (
                  <line key={y} x1={x} x2={x + colW} y1={y} y2={y} />
                ))}
              </g>
              <g fill="none" strokeLinejoin="round">
                <path d={curvePath(x, rows.spot, colW, spot, 1)} stroke={XR.first} strokeWidth={1.75} />
                <path d={curvePath(x, rows.liquid, colW, liquid, 1)} stroke={XR.second} strokeWidth={1.5} strokeDasharray="4 3" />
                <path d={curvePath(x, rows.sum, colW, (t) => spot(t) + liquid(t), 1)} stroke={XR.accent} strokeWidth={2.25} />
              </g>
              <circle cx={x + colW / 2 - 18} cy={rows.film} r={6} fill={XR.sum} fillOpacity={shade(1)} />
              <path d={`M${x + colW / 2 - 7} ${rows.film} h12 m-4 -3.5 l4 3.5 l-4 3.5`} fill="none" stroke={XR.label} strokeWidth={1} />
              <circle cx={x + colW / 2 + 18} cy={rows.film} r={6} fill={XR.sum} fillOpacity={shade(height ** 2)} />
              <text x={x + colW / 2} y={rows.film + 22} textAnchor="middle" className="font-mono" fontSize={text} fill={XR.label}>
                {verdict}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
