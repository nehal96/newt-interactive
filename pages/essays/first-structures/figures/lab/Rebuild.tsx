// Each spot laid back across the cell as stripes, and the stripes added up: with the right phases, peaks on the atoms.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Button, Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { TAU } from "../wave";
import { Labels } from "../scene";
import { SliderRow } from "../controls";
import { ATOMS, cellHeight, cellPhase } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const HEIGHTS = SPOTS.map((n) => cellHeight(n, ATOMS));
const PHASES = SPOTS.map((n) => cellPhase(n, ATOMS));
const TALLEST = Math.max(...HEIGHTS);
/** The highest the sum can reach, with every stripe's crest in one place. */
const LARGEST = HEIGHTS.reduce((a, h) => a + h, 0);
const SAMPLES = 160;

type Phases = "right" | "flat" | "shuffled";

/** A repeatable scatter of phases, one per spot, different for each `seed`. */
function shuffled(seed: number) {
  let s = seed * 9301 + 49297;
  return SPOTS.map(() => {
    s = (s * 233280 + 12345) % 2147483647;
    return (s % 1000) / 1000;
  });
}

/** Height of spot n's stripes at position x across the cell, crests where its phase puts them. */
const stripe = (n: number, h: number, p: number, x: number) => h * Math.cos(TAU * (n * x - p));

export function Rebuild({ mode }: { mode: "build" | "phases" }) {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [count, setCount] = useState(mode === "build" ? 1 : 6);
  const [choice, setChoice] = useState<Phases>("right");
  const [seed, setSeed] = useState(1);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 64 : 84;
  const bw = W - labelW - 4;
  const X = (x: number) => labelW + x * bw;

  const phases = choice === "right" ? PHASES : choice === "flat" ? SPOTS.map(() => 0) : shuffled(seed);
  const used = mode === "build" ? count : 6;

  const cellY = 14;
  const bandH = narrow ? 14 : 16;
  const bandGap = 8;
  const bandsY = cellY + 34;
  const bandY = (i: number) => bandsY + i * (bandH + bandGap);
  const curveTop = bandY(SPOTS.length) + 18;
  const curveH = narrow ? 130 : 160;
  const base = curveTop + curveH / 2;
  const filmY = base + curveH / 2 + 30;
  const H = mode === "phases" ? filmY + 40 : base + curveH / 2 + 22;

  const sum = (x: number) =>
    SPOTS.slice(0, used).reduce((acc, n, i) => acc + stripe(n, HEIGHTS[i], phases[i], x), 0);
  const scale = curveH / 2 / LARGEST;
  let d = "";
  for (let k = 0; k <= SAMPLES; k++) {
    const x = k / SAMPLES;
    d += `${k ? "L" : "M"}${X(x).toFixed(1)} ${(base - sum(x) * scale).toFixed(1)}`;
  }

  const filmW = Math.min(bw, 300);
  const fx = labelW + (bw - filmW) / 2;

  return (
    <div ref={ref} className="w-full">
      {mode === "phases" && (
        <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
          <span>Phases</span>
          <Tabs value={choice} onValueChange={(v) => setChoice(v as Phases)}>
            <TabsList className="h-8 bg-ink-200/60 p-0.5">
              {(
                [
                  ["right", narrow ? "Right" : "From the molecule"],
                  ["flat", narrow ? "At the edge" : "All crests at the edge"],
                  ["shuffled", "Shuffled"],
                ] as [Phases, string][]
              ).map(([v, label]) => (
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
      )}

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>
          {mode === "build"
            ? "Each spot's stripes added across the cell rebuild the atoms"
            : "The same spots with different phases add up to different pictures"}
        </title>
        <desc id={`${ids}d`}>
          {mode === "build"
            ? `The stripes of the first ${used} spots, each as strong as its spot and with its crests where the molecule puts them, added across the cell.`
            : `The six spots' stripes with ${choice === "right" ? "the molecule's own phases, which put the peaks on the atoms" : choice === "flat" ? "every crest moved to the cell's edge, which puts the peaks in the wrong places" : "shuffled phases, which put the peaks in the wrong places"}. The film is the same in every case.`}
        </desc>
        <defs>
          {SPOTS.map((n, i) => (
            <linearGradient key={n} id={`${ids}g${n}`} x1={0} x2={1} y1={0} y2={0}>
              {Array.from({ length: 49 }, (_, k) => {
                const x = k / 48;
                const o = 0.9 * (HEIGHTS[i] / TALLEST) * (0.5 + 0.5 * Math.cos(TAU * (n * x - phases[i])));
                return <stop key={k} offset={x} stopColor={XR.sum} stopOpacity={o} />;
              })}
            </linearGradient>
          ))}
        </defs>

        <rect x={labelW} y={cellY} width={bw} height={20} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
        {ATOMS.map((x, i) => (
          <circle key={i} cx={X(x)} cy={cellY + 10} r={4.5} fill={i === 1 ? XR.second : XR.sum} />
        ))}

        {SPOTS.map((n, i) => {
          const on = i < used;
          return (
            <g key={n} opacity={on ? 1 : 0.18}>
              <rect x={labelW} y={bandY(i)} width={bw} height={bandH} fill={XR.film} />
              <rect x={labelW} y={bandY(i)} width={bw} height={bandH} fill={`url(#${ids}g${n})`} />
              <rect x={labelW} y={bandY(i)} width={bw} height={bandH} fill="none" stroke={XR.atom} strokeWidth={0.5} />
            </g>
          );
        })}

        <line x1={labelW} x2={labelW + bw} y1={base} y2={base} stroke={XR.rule} />
        <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="2 3">
          {ATOMS.map((x) => (
            <line key={x} x1={X(x)} x2={X(x)} y1={cellY + 20} y2={base + curveH / 2} />
          ))}
        </g>
        <path d={d} fill="none" stroke={XR.accent} strokeWidth={2.25} strokeLinejoin="round" />

        {mode === "phases" && (
          <g>
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
          </g>
        )}

        <Labels size={text}>
          <text x={0} y={cellY + 14}>the cell</text>
          {SPOTS.map((n, i) => (
            <text key={n} x={0} y={bandY(i) + bandH / 2 + 4} opacity={i < used ? 1 : 0.4}>
              spot {n}
            </text>
          ))}
          <text x={0} y={base + 4} fill={XR.accent}>sum</text>
          {mode === "phases" && (
            <>
              <text x={0} y={filmY + 15}>film</text>
              <text x={fx + filmW / 2} y={filmY + 38} textAnchor="middle">
                the same in every case
              </text>
            </>
          )}
        </Labels>
      </svg>

      {mode === "build" && (
        <div className="mt-4">
          <SliderRow
            label="Spots added"
            value={count}
            display={count === 1 ? "spot 1 only" : `spots 1 to ${count}`}
            min={1}
            max={6}
            step={1}
            onChange={setCount}
          />
        </div>
      )}
    </div>
  );
}
