// Each spot's wave laid across the cell and added in, one spot at a time, until the atoms come into focus.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { ATOMS, cellHeight, cellPhase } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const HEIGHT = SPOTS.map((n) => cellHeight(n, ATOMS));
const PHASE = SPOTS.map((n) => cellPhase(n, ATOMS));
const TALLEST = Math.max(...HEIGHT);

const hint = (n: number) => (x: number) => HEIGHT[n - 1] * Math.cos(TAU * (n * x - PHASE[n - 1]));
const total = (k: number) => (x: number) => SPOTS.slice(0, k).reduce((acc, n) => acc + hint(n)(x), 0);

export function Focus() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [k, setK] = useState(1);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 76 : 110;
  const bw = W - labelW - 4;
  const X = (x: number) => labelW + x * bw;
  const spotX = (n: number) => labelW + (n / (SPOTS.length + 0.5)) * bw;

  const filmY = 4;
  const hintAmp = 16;
  const hintY = filmY + 22 + 30 + hintAmp;
  const sumAmp = 40;
  const sumY = hintY + hintAmp + 34 + sumAmp;
  const atomsY = sumY + sumAmp + 10;
  const H = atomsY + 26;

  const sum = total(k);
  let peak = 0;
  for (let i = 0; i <= 200; i++) peak = Math.max(peak, Math.abs(sum(i / 200)));
  const hintPx = (x: number) => (hintAmp * hint(k)(x)) / TALLEST;
  const sumPx = (x: number) => (sumAmp * sum(x)) / peak;

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>Spots added</span>
        <Tabs value={String(k)} onValueChange={(v) => setK(Number(v))}>
          <TabsList className="h-8 bg-ink-200/60 p-0.5">
            {SPOTS.map((n) => (
              <TabsTrigger
                key={n}
                value={String(n)}
                className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
              >
                {n}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>Adding the spots’ waves together, one spot at a time, brings the atoms into focus</title>
        <desc id={`${ids}d`}>
          With {k} {k === 1 ? "spot" : "spots"} added, the total {k === 1 ? "is one broad hump" : k < 5 ? "is still blurred" : "has three sharp peaks"}
          {k < 5 ? "." : ", one over each of the three atoms."}
        </desc>

        <rect x={labelW} y={filmY} width={bw} height={22} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        {SPOTS.map((n) => (
          <circle
            key={n}
            cx={spotX(n)}
            cy={filmY + 11}
            r={6}
            fill={XR.sum}
            fillOpacity={(n <= k ? 1 : 0.25) * (0.04 + (0.92 * HEIGHT[n - 1] ** 2) / 9)}
          />
        ))}
        <circle cx={spotX(k)} cy={filmY + 11} r={10} fill="none" stroke={XR.first} strokeWidth={1.5} />

        <line x1={labelW} x2={labelW + bw} y1={hintY} y2={hintY} stroke={XR.rule} />
        <path d={curvePath(labelW, hintY, bw, (t) => hintPx(t / bw), 1)} fill="none" stroke={XR.first} strokeWidth={1.75} />

        <g stroke={XR.atom} strokeWidth={1} strokeDasharray="2 3">
          {ATOMS.map((x) => (
            <line key={x} x1={X(x)} x2={X(x)} y1={sumY - sumAmp - 4} y2={atomsY} />
          ))}
        </g>
        <line x1={labelW} x2={labelW + bw} y1={sumY} y2={sumY} stroke={XR.rule} />
        <path d={curvePath(labelW, sumY, bw, (t) => sumPx(t / bw), 1)} fill="none" stroke={XR.accent} strokeWidth={2.25} />

        <rect x={labelW} y={atomsY} width={bw} height={22} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
        {ATOMS.map((x) => (
          <circle key={x} cx={X(x)} cy={atomsY + 11} r={4.5} fill={XR.sum} />
        ))}

        <Labels size={text}>
          <text x={0} y={filmY + 15}>the film</text>
          <text x={0} y={hintY - 2} fill={XR.first}>{`spot ${k}’s`}</text>
          <text x={0} y={hintY + 11} fill={XR.first}>wave</text>
          <text x={0} y={sumY - 2} fill={XR.accent}>sum so far</text>
          <text x={0} y={atomsY + 15}>{narrow ? "real atoms" : "the real atoms"}</text>
        </Labels>
      </svg>
    </div>
  );
}
