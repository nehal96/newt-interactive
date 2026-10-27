// At spot n the cell acts as n equal pieces: stack them, and the spot is dark when the atoms line up in a column.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { Labels } from "../scene";
import { ATOMS, cellHeight } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const dot = (i: number) => (i === 1 ? XR.second : XR.sum);
const shade = (k: number) => (k % 2 ? XR.filmGrey : XR.film);

export function Stretches() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [n, setN] = useState(3);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 72 : 104;
  const cw = W - labelW - 4;
  const pw = cw / n;
  const X = (x: number) => labelW + x * cw;

  const cellY = 22;
  const barH = 22;
  const rowH = 14;
  const gap = 6;
  const stackY = cellY + barH + 34;
  const rowY = (k: number) => stackY + k * (rowH + gap);
  const filmY = rowY(n) + 24;
  const H = filmY + 40;
  const spotX = (k: number) => labelW + (k / (SPOTS.length + 0.5)) * cw;

  const placed = ATOMS.map((x, i) => {
    const k = Math.min(Math.floor(x * n), n - 1);
    return { i, k, into: x * n - k };
  });
  const height = cellHeight(n, ATOMS);

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>Look at spot</span>
        <Tabs value={String(n)} onValueChange={(v) => setN(Number(v))}>
          <TabsList className="h-8 bg-ink-200/60 p-0.5">
            {SPOTS.map((k) => (
              <TabsTrigger
                key={k}
                value={String(k)}
                className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
              >
                {k}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>At spot {n}, the cell acts as {n} equal pieces; stacked, they show whether the atoms line up</title>
        <desc id={`${ids}d`}>
          The cell is cut into {n} equal {n === 1 ? "piece" : "pieces"} and the pieces are stacked. The three atoms sit{" "}
          {placed.map((p) => `${Math.round(p.into * 100)}%`).join(", ")} of the way into their pieces. Spot {n}
          {height > 1.8 ? " is dark." : height > 1.1 ? " is middling." : " is faint."}
        </desc>

        {Array.from({ length: n }, (_, k) => (
          <rect key={k} x={labelW + k * pw} y={cellY} width={pw} height={barH} fill={shade(k)} />
        ))}
        <rect x={labelW} y={cellY} width={cw} height={barH} fill="none" stroke={XR.atom} strokeWidth={0.75} />
        {Array.from({ length: n - 1 }, (_, k) => (
          <line key={k} x1={labelW + (k + 1) * pw} x2={labelW + (k + 1) * pw} y1={cellY - 4} y2={cellY + barH + 4} stroke={XR.label} strokeWidth={1} strokeDasharray="3 2" />
        ))}
        {ATOMS.map((x, i) => (
          <circle key={i} cx={X(x)} cy={cellY + barH / 2} r={4.5} fill={dot(i)} />
        ))}

        {Array.from({ length: n }, (_, k) => (
          <rect key={k} x={labelW} y={rowY(k)} width={pw} height={rowH} fill={shade(k)} stroke={XR.atom} strokeWidth={0.75} />
        ))}
        {placed.map(({ i, k, into }) => (
          <circle key={i} cx={labelW + into * pw} cy={rowY(k) + rowH / 2} r={4.5} fill={dot(i)} />
        ))}

        <rect x={labelW} y={filmY} width={cw} height={22} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        {SPOTS.map((k) => (
          <circle key={k} cx={spotX(k)} cy={filmY + 11} r={6} fill={XR.sum} fillOpacity={0.04 + (0.92 * cellHeight(k, ATOMS) ** 2) / 9} />
        ))}
        <circle cx={spotX(n)} cy={filmY + 11} r={10} fill="none" stroke={XR.accent} strokeWidth={1.5} />

        <Labels size={text}>
          {ATOMS.map((x, i) => (
            <text key={i} x={X(x)} y={cellY - 7} textAnchor="middle" fill={dot(i)}>
              {i + 1}
            </text>
          ))}
          <text x={0} y={cellY + 15}>the cell</text>
          <text x={0} y={stackY + 10}>{narrow ? "pieces," : "its pieces,"}</text>
          <text x={0} y={stackY + 23}>stacked</text>
          <text x={0} y={filmY + 15}>the film</text>
          <text x={spotX(n)} y={filmY + 38} textAnchor="middle" fill={XR.accent}>
            spot {n}, {height > 1.8 ? "dark" : height > 1.1 ? "fairly dark" : "faint"}
          </text>
        </Labels>
      </svg>
    </div>
  );
}
