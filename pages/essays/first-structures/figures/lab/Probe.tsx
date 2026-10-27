// A test atom slid across the cell: at each spot, is its wave in step with the measured one? Where it agrees at every spot, there is an atom.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Button, Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { Readouts, SliderRow } from "../controls";
import { ATOMS, cellHeight, cellPhase } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const HEIGHTS = SPOTS.map((n) => cellHeight(n, ATOMS));
const PHASES = SPOTS.map((n) => cellPhase(n, ATOMS));
const TALLEST = Math.max(...HEIGHTS);
const LARGEST = HEIGHTS.reduce((a, h) => a + h, 0);
const frac = (v: number) => v - Math.floor(v);

type Shifts = "known" | "flat" | "shuffled";

function shuffled(seed: number) {
  let s = seed * 9301 + 49297;
  return SPOTS.map(() => {
    s = (s * 233280 + 12345) % 2147483647;
    return (s % 1000) / 1000;
  });
}

/** How well a test atom at x agrees with spot n's measured wave: its height when in step, minus its height when opposed. */
const agreement = (n: number, h: number, p: number, x: number) => h * Math.cos(TAU * (n * x - p));

export function Probe({ mode }: { mode: "find" | "shifts" }) {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [x, setX] = useState(0.6);
  const [choice, setChoice] = useState<Shifts>("known");
  const [seed, setSeed] = useState(1);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 50 : 70;
  const cw = W - labelW - 4;
  const barW = narrow ? 76 : 150;
  const waveW = narrow ? cw - barW - 14 : Math.min(300, cw - barW - 30);
  const wl = waveW / 1.5;
  const unit = narrow ? 5 : 6;
  const shifts = mode === "find" || choice === "known" ? PHASES : choice === "flat" ? SPOTS.map(() => 0) : shuffled(seed);

  const cellY = 18;
  const rowsTop = cellY + 66;
  const rowH = 2 * TALLEST * unit + 12;
  const rowY = (i: number) => rowsTop + i * rowH + rowH / 2;
  const curveTop = rowsTop + SPOTS.length * rowH + 36;
  const curveH = narrow ? 110 : 130;
  const base = curveTop + curveH / 2;
  const H = base + curveH / 2 + 10;

  const cellX = (v: number) => labelW + v * cw;
  const barMid = labelW + waveW + (narrow ? 14 : 30) + barW / 2;
  const scores = SPOTS.map((n, i) => agreement(n, HEIGHTS[i], shifts[i], x));
  const total = scores.reduce((a, s) => a + s, 0);
  const totalAt = (v: number) => SPOTS.reduce((a, n, i) => a + agreement(n, HEIGHTS[i], shifts[i], v), 0);
  const scale = curveH / 2 / LARGEST;
  let d = "";
  for (let k = 0; k <= 200; k++) {
    const v = k / 200;
    d += `${k ? "L" : "M"}${cellX(v).toFixed(1)} ${(base - totalAt(v) * scale).toFixed(1)}`;
  }

  return (
    <div ref={ref} className="w-full">
      {mode === "shifts" && (
        <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
          <span>Measured waves’ crests</span>
          <Tabs value={choice} onValueChange={(v) => setChoice(v as Shifts)}>
            <TabsList className="h-8 bg-ink-200/60 p-0.5">
              {(
                [
                  ["known", narrow ? "Known" : "Where they really are"],
                  ["flat", narrow ? "Lined up" : "All lined up"],
                  ["shuffled", "Shuffled"],
                ] as [Shifts, string][]
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
        <title id={`${ids}t`}>A test atom agrees with the measured waves at every spot only where a real atom sits</title>
        <desc id={`${ids}d`}>
          A test atom {Math.round(x * 100)}% across the cell. At each of six spots its wave is compared with the measured
          wave there; in step adds, opposed subtracts. Total agreement {total.toFixed(1)}, out of a possible{" "}
          {LARGEST.toFixed(1)}.
        </desc>

        <rect x={labelW} y={cellY} width={cw} height={22} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
        {ATOMS.map((v) => (
          <circle key={v} cx={cellX(v)} cy={cellY + 11} r={4} fill={XR.atom} />
        ))}
        <circle cx={cellX(x)} cy={cellY + 11} r={6} fill="none" stroke={XR.first} strokeWidth={2} />

        {SPOTS.map((n, i) => {
          const y = rowY(i);
          const s = scores[i];
          const half = barW / 2 - 4;
          const len = (s / TALLEST) * half;
          return (
            <g key={n}>
              <line x1={labelW} x2={labelW + waveW} y1={y} y2={y} stroke={XR.rule} />
              <path
                d={curvePath(labelW, y, waveW, (t) => HEIGHTS[i] * unit * Math.cos(TAU * (t / wl - shifts[i])), 1)}
                fill="none"
                stroke={XR.accent}
                strokeWidth={2}
              />
              <path
                d={curvePath(labelW, y, waveW, (t) => unit * Math.cos(TAU * (t / wl - frac(n * x))), 1)}
                fill="none"
                stroke={XR.first}
                strokeWidth={1.5}
                strokeDasharray="4 3"
              />
              <line x1={barMid} x2={barMid} y1={y - 9} y2={y + 9} stroke={XR.atom} />
              <rect
                x={Math.min(barMid, barMid + len)}
                y={y - 5}
                width={Math.abs(len)}
                height={10}
                fill={s >= 0 ? XR.sum : XR.atom}
              />
            </g>
          );
        })}

        <rect x={labelW} y={curveTop - 10} width={cw} height={curveH + 14} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
        <line x1={labelW} x2={labelW + cw} y1={base} y2={base} stroke={XR.rule} />
        <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="2 3">
          {ATOMS.map((v) => (
            <line key={v} x1={cellX(v)} x2={cellX(v)} y1={curveTop - 10} y2={base + curveH / 2 + 4} />
          ))}
        </g>
        <path d={d} fill="none" stroke={XR.sum} strokeWidth={2} strokeLinejoin="round" />
        <line x1={cellX(x)} x2={cellX(x)} y1={curveTop - 6} y2={base + curveH / 2} stroke={XR.first} strokeWidth={1} />
        <circle cx={cellX(x)} cy={base - total * scale} r={5} fill={XR.first} />

        <Labels size={text}>
          <text x={0} y={cellY + 15}>cell</text>
          <text x={labelW} y={cellY - 6}>
            {narrow ? "test atom (ring)" : "test atom (blue ring); grey dots mark the real atoms, to check against"}
          </text>
          <text x={barMid} y={rowsTop - 22} textAnchor="middle">
            {narrow ? "agree?" : "opposed ← agree? → in step"}
          </text>
          {SPOTS.map((n, i) => (
            <text key={n} x={0} y={rowY(i) + 4}>
              spot {n}
            </text>
          ))}
          <text x={0} y={base + 4}>total</text>
          <text x={labelW} y={curveTop - 16}>
            {narrow ? "total agreement across the cell" : "total agreement at every place in the cell (dotted: the real atoms)"}
          </text>
          <text x={labelW} y={rowsTop - 6}>
            {narrow ? "measured (red), test atom (dashed)" : "at each spot: the measured wave (red) and the test atom’s (dashed)"}
          </text>
        </Labels>
      </svg>

      <div className="mt-4">
        <SliderRow
          label="Slide the test atom"
          value={x}
          display={`${Math.round(x * 100)}% across the cell`}
          min={0}
          max={1}
          step={0.01}
          onChange={setX}
        />
      </div>
      <Readouts items={[["Total agreement", `${total.toFixed(1)} of ${LARGEST.toFixed(1)}`]]} />
    </div>
  );
}
