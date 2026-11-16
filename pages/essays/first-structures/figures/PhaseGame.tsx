// Four spots' waves, each slid to one of four positions, summed against the molecule's profile; a whole film below follows the same phases.
import { useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { Synthesis } from "./Synthesis";

const mod4 = (v: number) => ((v % 4) + 4) % 4;

// Wave h repeats h times across the unit cell; RIGHT is its true position, in quarter turns.
const HEIGHTS = [1.17, 0.4, 1.17, 1.6];
const RIGHT = [2, 3, 0, 2];
const START = [3, 1, 1, 1];
const TALLEST = Math.max(...HEIGHTS);
const POWER = HEIGHTS.reduce((s, a) => s + a * a, 0);
// Pixels of wave height per unit of strength.
const UNIT = 7;

const profile = (steps: number[]) => (u: number) =>
  HEIGHTS.reduce(
    (s, a, i) => s + a * Math.cos(TAU * ((i + 1) * u - steps[i] / 4)),
    0,
  );

/** Where the true profile peaks: the atoms, as fractions of the cell. */
const PEAKS: { u: number; size: number }[] = (() => {
  const f = profile(RIGHT);
  const n = 400;
  const top = Math.max(...Array.from({ length: n }, (_, i) => f(i / n)));
  const out: { u: number; size: number }[] = [];
  for (let i = 0; i < n; i++) {
    const v = f(i / n);
    if (v > 0.45 * top && v >= f((i - 1) / n) && v > f((i + 1) / n))
      out.push({ u: i / n, size: v / top });
  }
  return out;
})();

const BUTTON =
  "rounded-md border border-ink-300 bg-paper px-2.5 py-1 font-ui text-xs text-ink-700 hover:border-ink-500 hover:text-ink-900";

export function PhaseGame() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [steps, setSteps] = useState(START);
  const [held, setHeld] = useState<number | null>(null);
  const [hints, setHints] = useState(false);
  const drag = useRef<{ x0: number; from: number } | null>(null);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 30 : 38;
  const dialCol = narrow ? 30 : 38;
  const x0 = labelW;
  const len = W - labelW - dialCol;
  const r = 9;

  const rows = [24, 54, 84, 114];
  const sumY = 170;
  const atomY = 216;
  const H = atomY + 14;

  const solved = steps.every((s, i) => s === RIGHT[i]);
  // Share of the waves' combined strength that is lined up: 100 only when the sum is the profile.
  const match = Math.round(
    (100 *
      HEIGHTS.reduce(
        (sum, a, i) =>
          sum + a * a * (1 + Math.cos(((steps[i] - RIGHT[i]) * TAU) / 4)),
        0,
      )) /
      (2 * POWER),
  );
  const set = (i: number, v: number) =>
    setSteps((prev) => prev.map((s, j) => (j === i ? mod4(v) : s)));

  const onDown = (i: number) => (ev: PointerEvent<SVGRectElement>) => {
    ev.currentTarget.setPointerCapture(ev.pointerId);
    drag.current = { x0: ev.clientX, from: steps[i] };
    setHeld(i);
  };
  const onMove = (i: number) => (ev: PointerEvent<SVGRectElement>) => {
    if (!drag.current || held !== i) return;
    const quarter = len / (i + 1) / 4;
    set(
      i,
      drag.current.from + Math.round((ev.clientX - drag.current.x0) / quarter),
    );
  };
  const onUp = () => {
    drag.current = null;
    setHeld(null);
  };

  const scramble = () => {
    let next = RIGHT;
    while (next.filter((s, i) => s === RIGHT[i]).length > 1)
      next = RIGHT.map(() => Math.floor(Math.random() * 4));
    setSteps(next);
  };

  const curve = (f: (u: number) => number) => (t: number) => UNIT * f(t / len);
  const sumColor = solved ? XR.success : XR.ink;

  return (
    <div className="w-full">
      <div ref={ref} className="w-full">
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          className="block select-none"
          role="img"
          aria-labelledby={`${ids}t ${ids}d`}
        >
          <title id={`${ids}t`}>
            Line up four waves to rebuild the molecule
          </title>
          <desc id={`${ids}d`}>
            Four waves, one from each spot, each with a fixed height and one of
            four positions. Their sum is drawn over the molecule’s true profile.{" "}
            {solved
              ? "All four are in the right position and the sum matches the profile."
              : `The sum is a ${match} percent match to the profile.`}
          </desc>

          {rows.map((y, i) => {
            const one = (u: number) =>
              HEIGHTS[i] * Math.cos(TAU * ((i + 1) * u - steps[i] / 4));
            const cx = W - dialCol / 2 + 4;
            const a = (steps[i] / 4) * TAU;
            const right = hints && steps[i] === RIGHT[i];
            return (
              <g key={i}>
                <circle
                  cx={narrow ? 8 : 10}
                  cy={y}
                  r={6}
                  fill={XR.ink}
                  fillOpacity={0.12 + 0.8 * (HEIGHTS[i] / TALLEST) ** 2}
                />
                <line x1={x0} x2={x0 + len} y1={y} y2={y} stroke={XR.rule} />
                <path
                  d={curvePath(x0, y, len, curve(one), 1.5)}
                  fill="none"
                  stroke={right ? XR.success : XR.first}
                  strokeWidth={held === i ? 2.5 : 1.75}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                <rect
                  x={x0}
                  y={y - 15}
                  width={len}
                  height={30}
                  fill="transparent"
                  style={{
                    cursor: held === i ? "grabbing" : "grab",
                    touchAction: "pan-y",
                  }}
                  onPointerDown={onDown(i)}
                  onPointerMove={onMove(i)}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                />
                <g
                  role="button"
                  tabIndex={0}
                  aria-label={`Step wave ${i + 1} to its next position`}
                  style={{ cursor: "pointer" }}
                  onClick={() => set(i, steps[i] + 1)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      set(i, steps[i] + 1);
                    }
                  }}
                >
                  <circle cx={cx} cy={y} r={r + 4} fill="transparent" />
                  <circle
                    cx={cx}
                    cy={y}
                    r={r}
                    fill="none"
                    stroke={right ? XR.success : XR.guide}
                    strokeWidth={right ? 2 : 1}
                  />
                  {[0, 1, 2, 3].map((q) => (
                    <circle
                      key={q}
                      cx={cx + r * Math.sin((q / 4) * TAU)}
                      cy={y - r * Math.cos((q / 4) * TAU)}
                      r={1.25}
                      fill={XR.label}
                    />
                  ))}
                  <line
                    x1={cx}
                    y1={y}
                    x2={cx + r * Math.sin(a)}
                    y2={y - r * Math.cos(a)}
                    stroke={right ? XR.success : XR.accent}
                    strokeWidth={1.75}
                    strokeLinecap="round"
                  />
                </g>
              </g>
            );
          })}

          <line x1={x0} x2={x0 + len} y1={sumY} y2={sumY} stroke={XR.rule} />
          <g fill="none" strokeLinejoin="round" strokeLinecap="round">
            <path
              d={curvePath(x0, sumY, len, curve(profile(RIGHT)), 1.5)}
              stroke={XR.guide}
              strokeWidth={3}
              strokeOpacity={0.55}
            />
            <path
              d={curvePath(x0, sumY, len, curve(profile(steps)), 1.5)}
              stroke={sumColor}
              strokeWidth={2.25}
            />
          </g>

          {PEAKS.map(({ u, size }) => (
            <circle
              key={u}
              cx={x0 + u * len}
              cy={atomY}
              r={9 * Math.sqrt(size)}
              fill={XR.molecule}
              fillOpacity={solved ? 1 : 0.35}
              stroke={XR.moleculeEdge}
              strokeDasharray={solved ? undefined : "2 2"}
            />
          ))}

          <g className="font-mono" fontSize={text} fill={XR.label}>
            <text x={0} y={sumY + 4} fill={sumColor}>
              sum
            </text>
            <text x={x0 + len} y={sumY - 34} textAnchor="end" fill={sumColor}>
              match {match}%
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <label className="flex cursor-pointer items-center gap-1.5 font-ui text-xs text-ink-700">
          <input
            type="checkbox"
            className="accent-ink-700"
            checked={hints}
            onChange={(ev) => setHints(ev.target.checked)}
          />
          Show which waves are right
        </label>
        <button
          type="button"
          className={BUTTON}
          onClick={() => setSteps(RIGHT)}
        >
          Show the answer
        </button>
        <button type="button" className={BUTTON} onClick={scramble}>
          Scramble
        </button>
      </div>
      <div className="mt-6">
        <Synthesis errors={steps.map((v, i) => v - RIGHT[i])} />
      </div>
    </div>
  );
}
