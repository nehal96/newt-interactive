// The six spots' waves added back together into a picture of the cell: right only if each wave's crests go where they were.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Button, Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { TAU } from "../wave";
import { Labels } from "../scene";
import { ATOMS, cellHeight, cellPhase } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const HEIGHTS = SPOTS.map((n) => cellHeight(n, ATOMS));
const PHASES = SPOTS.map((n) => cellPhase(n, ATOMS));
const LARGEST = HEIGHTS.reduce((a, h) => a + h, 0);

type Crests = "real" | "lined" | "shuffled";

function shuffled(seed: number) {
  let s = seed * 9301 + 49297;
  return SPOTS.map(() => {
    s = (s * 233280 + 12345) % 2147483647;
    return (s % 1000) / 1000;
  });
}

export function Recombine() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [choice, setChoice] = useState<Crests>("real");
  const [seed, setSeed] = useState(1);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 54 : 74;
  const cw = W - labelW - 4;
  const X = (x: number) => labelW + x * cw;
  const phases = choice === "real" ? PHASES : choice === "lined" ? SPOTS.map(() => 0) : shuffled(seed);

  const filmY = 6;
  const filmW = Math.min(cw, 320);
  const fx = labelW;
  const curveTop = filmY + 60;
  const curveH = narrow ? 140 : 170;
  const base = curveTop + curveH / 2;
  const H = curveTop + curveH + 26;

  const picture = (x: number) => SPOTS.reduce((acc, n, i) => acc + HEIGHTS[i] * Math.cos(TAU * (n * x - phases[i])), 0);
  const scale = curveH / 2 / LARGEST;
  let d = "";
  for (let k = 0; k <= 240; k++) {
    const x = k / 240;
    d += `${k ? "L" : "M"}${X(x).toFixed(1)} ${(base - picture(x) * scale).toFixed(1)}`;
  }

  const options: [Crests, string][] = [
    ["real", narrow ? "As they were" : "Where they really were"],
    ["lined", narrow ? "Lined up" : "All lined up"],
    ["shuffled", "Shuffled"],
  ];

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>Each wave’s crests</span>
        <Tabs value={choice} onValueChange={(v) => setChoice(v as Crests)}>
          <TabsList className="h-8 bg-ink-200/60 p-0.5">
            {options.map(([v, label]) => (
              <TabsTrigger
                key={v}
                value={v}
                className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {choice === "shuffled" && (
          <Button variant="outline" className="h-8 px-3 text-xs" onClick={() => setSeed((s) => s + 1)}>
            Shuffle again
          </Button>
        )}
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>The same spots, added back together with their crests in different places, give different pictures</title>
        <desc id={`${ids}d`}>
          The six spots' waves, with their measured heights, added back together across the cell with their crests{" "}
          {choice === "real" ? "where they really were: three peaks, one on each atom" : choice === "lined" ? "all lined up: peaks in the wrong places" : "shuffled: peaks in the wrong places"}.
          The film is the same in every case.
        </desc>

        <rect x={fx} y={filmY} width={filmW} height={22} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        <rect x={fx + 4} y={filmY + 6} width={8} height={10} rx={1} fill={XR.label} />
        {SPOTS.map((n, i) => (
          <circle
            key={n}
            cx={fx + (n / (SPOTS.length + 0.5)) * filmW}
            cy={filmY + 11}
            r={6}
            fill={XR.sum}
            fillOpacity={0.04 + (0.92 * HEIGHTS[i] ** 2) / 9}
          />
        ))}

        <rect x={labelW} y={curveTop} width={cw} height={curveH} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
        <line x1={labelW} x2={labelW + cw} y1={base} y2={base} stroke={XR.rule} />
        <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="2 3">
          {ATOMS.map((x) => (
            <line key={x} x1={X(x)} x2={X(x)} y1={curveTop} y2={curveTop + curveH} />
          ))}
        </g>
        {ATOMS.map((x, i) => (
          <circle key={x} cx={X(x)} cy={curveTop + curveH + 10} r={4} fill={i === 1 ? XR.second : XR.sum} />
        ))}
        <path d={d} fill="none" stroke={XR.accent} strokeWidth={2.5} strokeLinejoin="round" />

        <Labels size={text}>
          <text x={0} y={filmY + 15}>film</text>
          <text x={fx + filmW + 10} y={filmY + 15}>{narrow ? "never changes" : "the same every time"}</text>
          <text x={0} y={base + 4} fill={XR.accent}>picture</text>
          <text x={0} y={curveTop + curveH + 14}>atoms</text>
        </Labels>
      </svg>
    </div>
  );
}
