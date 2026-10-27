// Guess and check: place the one unknown atom, add up the three atoms' waves at each spot, and compare with the film.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { Readouts, SliderRow } from "../controls";
import { ATOMS, cellHeight, lag } from "./cell";

const SPOTS = [1, 2, 3, 4, 5, 6];
const MEASURED = SPOTS.map((n) => cellHeight(n, ATOMS));
const frac = (v: number) => v - Math.floor(v);
const colour = (i: number) => (i === 1 ? XR.second : XR.first);

export function GuessAtom() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [guess, setGuess] = useState(0.6);
  const [spot, setSpot] = useState(3);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const labelW = narrow ? 76 : 110;
  const bw = W - labelW - 4;
  const atoms = [ATOMS[0], guess, ATOMS[2]];
  const calc = SPOTS.map((n) => cellHeight(n, atoms));
  const off = calc.reduce((acc, c, i) => acc + Math.abs(c ** 2 - MEASURED[i] ** 2), 0);
  const match = off < 0.3;

  const cellY = 6;
  const filmRows = [cellY + 42, cellY + 76];
  const spotX = (n: number) => labelW + (n / (SPOTS.length + 0.5)) * bw;

  const unit = narrow ? 5 : 6;
  const wl = bw / 2;
  const waveTop = filmRows[1] + 58;
  const rows = [0, 1, 2].map((i) => waveTop + unit + i * (2 * unit + 16));
  const sumY = rows[2] + 2 * unit + 18 + 3 * unit;
  const H = sumY + 3 * unit + 14;
  const shifts = atoms.map((x) => frac(lag(spot, x)));
  const wave = (l: number, h = 1) => (t: number) => h * unit * Math.cos(TAU * (t / wl - l));
  const sum = (t: number) => shifts.reduce((acc, l) => acc + wave(l)(t), 0);
  const need = MEASURED[spot - 1] * unit;

  const film = (y: number, heights: number[]) => (
    <g>
      <rect x={labelW} y={y} width={bw} height={22} fill={XR.film} stroke={XR.guide} strokeWidth={0.75} />
      <rect x={labelW + 4} y={y + 6} width={8} height={10} rx={1} fill={XR.label} />
      {SPOTS.map((n, i) => (
        <circle key={n} cx={spotX(n)} cy={y + 11} r={6} fill={XR.ink} fillOpacity={0.04 + (0.92 * heights[i] ** 2) / 9} />
      ))}
    </g>
  );

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>Look at spot</span>
        <Tabs value={String(spot)} onValueChange={(v) => setSpot(Number(v))}>
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
        <title id={`${ids}t`}>Guess where the unknown atom sits, add up the waves, and compare with the film</title>
        <desc id={`${ids}d`}>
          With the middle atom guessed at {Math.round(guess * 100)}% across the cell, the three waves at spot {spot} add to
          a height of {calc[spot - 1].toFixed(2)}; the film needs {MEASURED[spot - 1].toFixed(2)}.
          {match ? " Every spot matches the film." : ` Over all six spots the darknesses differ by ${off.toFixed(1)}.`}
        </desc>

        <rect x={labelW} y={cellY} width={bw} height={22} fill="none" stroke={XR.guide} strokeWidth={0.75} strokeDasharray="3 3" />
        {[ATOMS[0], ATOMS[2]].map((x) => (
          <circle key={x} cx={labelW + x * bw} cy={cellY + 11} r={4.5} fill={XR.ink} />
        ))}
        <circle cx={labelW + guess * bw} cy={cellY + 11} r={5} fill="none" stroke={XR.second} strokeWidth={2} />

        {film(filmRows[0], MEASURED)}
        {film(filmRows[1], calc)}
        <rect
          x={spotX(spot) - 13}
          y={filmRows[0] - 4}
          width={26}
          height={filmRows[1] - filmRows[0] + 30}
          rx={5}
          fill="none"
          stroke={XR.label}
          strokeWidth={1}
          strokeDasharray="3 2"
        />
        {SPOTS.map((n, i) =>
          Math.abs(calc[i] ** 2 - MEASURED[i] ** 2) > 0.5 ? (
            <circle key={n} cx={spotX(n)} cy={filmRows[1] + 11} r={9.5} fill="none" stroke={XR.accent} strokeWidth={1.25} />
          ) : null,
        )}

        {shifts.map((l, i) => (
          <g key={i}>
            <line x1={labelW} x2={labelW + bw} y1={rows[i]} y2={rows[i]} stroke={XR.rule} />
            <path d={curvePath(labelW, rows[i], bw, wave(l), 1)} fill="none" stroke={colour(i)} strokeWidth={1.75} />
          </g>
        ))}
        <g stroke={XR.label} strokeWidth={1} strokeDasharray="4 3">
          <line x1={labelW} x2={labelW + bw} y1={sumY - need} y2={sumY - need} />
          <line x1={labelW} x2={labelW + bw} y1={sumY + need} y2={sumY + need} />
        </g>
        <path d={curvePath(labelW, sumY, bw, sum, 1)} fill="none" stroke={XR.accent} strokeWidth={2.25} />

        <Labels size={text}>
          <text x={0} y={cellY + 15}>your guess</text>
          <text x={0} y={filmRows[0] + 15}>the film</text>
          <text x={0} y={filmRows[1] + 15} fill={match ? XR.ink : XR.accent}>
            {narrow ? "calculated" : "from your guess"}
          </text>
          <text x={labelW} y={waveTop - 12}>at spot {spot}, the three atoms’ waves:</text>
          {[0, 1, 2].map((i) => (
            <text key={i} x={0} y={rows[i] + 4} fill={colour(i)}>
              {i === 1 ? (narrow ? "atom 2?" : "atom 2 (guess)") : `atom ${i + 1}`}
            </text>
          ))}
          <text x={0} y={sumY + 4} fill={XR.accent}>sum</text>
          <text x={0} y={sumY + 17} fontSize={text - 1} fill={XR.accent}>
            height {calc[spot - 1].toFixed(2)}
          </text>
          <text x={labelW + bw} y={sumY - need - 5} textAnchor="end">
            the film needs height {MEASURED[spot - 1].toFixed(2)}
          </text>
        </Labels>
      </svg>

      <div className="mt-4">
        <SliderRow
          label="Where is the middle atom?"
          value={guess}
          display={`${Math.round(guess * 100)}% across the cell`}
          min={0}
          max={1}
          step={0.01}
          onChange={setGuess}
        />
      </div>
      <Readouts items={[["Difference from the film, all six spots", match ? "none: it matches" : off.toFixed(1)]]} />
    </div>
  );
}
