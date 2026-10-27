// Flip each spot's wave to find the hidden molecule; the film never changes, so it can't tell you which line-up is right.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { Labels } from "./scene";

/** Symmetric about the middle, so every spot's wave has its crest or its trough there. */
const ATOMS = [0.24, 0.5, 0.76];
const SPOTS = [1, 2, 3, 4];
const BLUR = 0.02;
const RAW = SPOTS.map((n) => Math.exp(-BLUR * n * n) * ATOMS.reduce((acc, x) => acc + Math.cos(TAU * n * (x - 0.5)), 0));
const HEIGHT = RAW.map(Math.abs);
const TALLEST = Math.max(...HEIGHT);
const RIGHT = RAW.map((f) => (f > 0 ? 1 : -1));
const START = RIGHT.map((s, i) => (i === 0 ? s : -s));
const ALL = 2 ** SPOTS.length;

const wave = (i: number, sign: number) => (x: number) => sign * HEIGHT[i] * Math.cos(TAU * SPOTS[i] * (x - 0.5));
const sumOf = (signs: number[]) => (x: number) => signs.reduce((acc, s, i) => acc + wave(i, s)(x), 0);
const PEAK = HEIGHT.reduce((a, b) => a + b, 0);
const key = (signs: number[]) => signs.join("");

/** How closely a line-up's picture matches the molecule's, from 0 (its opposite) to 1 (the same). */
const WEIGHT = HEIGHT.reduce((a, h) => a + h * h, 0);
const closeness = (signs: number[]) => (1 + signs.reduce((a, s, i) => a + s * RIGHT[i] * HEIGHT[i] ** 2, 0) / WEIGHT) / 2;

const shade = (i: number) => 0.12 + (0.88 * HEIGHT[i] ** 2) / TALLEST ** 2;

function FilmStrip({ W }: { W: number }) {
  return (
    <div>
      <svg width={W} height={30} viewBox={`0 0 ${W} 30`} className="block" aria-label="the film">
        <rect x={0} y={4} width={W} height={22} fill={XR.film} stroke={XR.guide} strokeWidth={0.75} />
        {SPOTS.map((n, i) => (
          <circle key={n} cx={((i + 1) / (SPOTS.length + 1)) * W} cy={15} r={6} fill={XR.ink} fillOpacity={shade(i)} />
        ))}
      </svg>
      <p className="mt-0.5 font-mono text-[10px] text-ink-500">the film</p>
    </div>
  );
}

export function LineUpGame() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [signs, setSigns] = useState(START);
  const [seen, setSeen] = useState(() => new Set([key(START)]));
  const [shown, setShown] = useState(false);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const left = narrow ? 84 : 112;
  const bw = Math.max(80, W - left);
  const close = closeness(signs);
  const solved = close > 0.999;
  const reveal = shown || solved;
  const flip = (i: number) => {
    const next = signs.map((s, j) => (j === i ? -s : s));
    setSigns(next);
    setSeen((cur) => new Set(cur).add(key(next)));
  };

  const rowH = narrow ? 38 : 42;
  const amp = narrow ? 13 : 15;
  const sumAmp = narrow ? 40 : 48;
  const atomsY = 2 * sumAmp + 20;
  const sumH = atomsY + 24;
  const sum = sumOf(signs);

  const message = solved
    ? "✓ A peak on every atom"
    : shown
      ? "The peaks miss the atoms"
      : `${seen.size} of ${ALL} line-ups tried`;

  return (
    <div ref={ref} className="w-full">
      <div style={{ paddingLeft: left }}>
        <FilmStrip W={bw} />
      </div>

      <div className="mt-3">
        {SPOTS.map((n, i) => (
          <div key={n} className="flex items-center" style={{ height: rowH }}>
            <div className="shrink-0" style={{ width: left }}>
              <button
                type="button"
                onClick={() => flip(i)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-ink-300 bg-paper px-2 py-1 font-mono text-[11px] text-ink-700 hover:border-ink-500 hover:text-ink-900"
                aria-label={`Flip spot ${n}’s wave`}
              >
                <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden>
                  <circle cx={5} cy={5} r={4.5} fill={XR.ink} fillOpacity={shade(i)} />
                </svg>
                flip {n}
              </button>
            </div>
            <svg width={bw} height={rowH} viewBox={`0 0 ${bw} ${rowH}`} className="block" aria-hidden>
              <line x1={0} x2={bw} y1={rowH / 2} y2={rowH / 2} stroke={XR.rule} />
              <path
                d={curvePath(0, rowH / 2, bw, (t) => (amp * wave(i, signs[i])(t / bw)) / TALLEST, 1)}
                fill="none"
                stroke={XR.first}
                strokeWidth={1.75}
              />
            </svg>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-start">
        <div className="shrink-0 pt-8 font-mono text-[11px] text-ink-700" style={{ width: left }}>
          their sum
        </div>
        <svg width={bw} height={sumH} viewBox={`0 0 ${bw} ${sumH}`} className="block" role="img" aria-labelledby={`${ids}t`}>
          <title id={`${ids}t`}>
            {reveal
              ? solved
                ? "The waves are lined up: the sum has a peak on each atom."
                : "The sum of the waves, with the real atoms shown; its peaks miss them."
              : "The sum of the four waves. The real atoms are hidden."}
          </title>
          {reveal && (
            <g stroke={XR.label} strokeWidth={0.75} strokeDasharray="2 3">
              {ATOMS.map((x) => (
                <line key={x} x1={x * bw} x2={x * bw} y1={4} y2={atomsY + 10} />
              ))}
            </g>
          )}
          <line x1={0} x2={bw} y1={sumAmp + 8} y2={sumAmp + 8} stroke={XR.rule} />
          <path d={curvePath(0, sumAmp + 8, bw, (t) => (sumAmp * sum(t / bw)) / PEAK, 1)} fill="none" stroke={XR.accent} strokeWidth={2.25} />
          <rect x={0} y={atomsY} width={bw} height={20} fill="none" stroke={XR.guide} strokeWidth={0.75} strokeDasharray="3 3" />
          {reveal ? (
            ATOMS.map((x) => <circle key={x} cx={x * bw} cy={atomsY + 10} r={4.5} fill={XR.ink} />)
          ) : (
            <Labels size={text}>
              <text x={bw / 2} y={atomsY + 14} textAnchor="middle">
                three hidden atoms
              </text>
            </Labels>
          )}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-start gap-x-4 gap-y-2" style={{ paddingLeft: left }}>
        <div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-ink-700">
            <span>how close</span>
            <span className="relative block h-2 w-28 overflow-hidden rounded-full bg-ink-200/70">
              <span
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
                style={{ width: `${Math.round(close * 100)}%`, background: solved ? XR.success : XR.label }}
              />
            </span>
          </div>
          <p
            className="mt-1 font-mono text-[10px]"
            style={{ color: solved ? XR.success : XR.label }}
            aria-live="polite"
          >
            {message}
          </p>
        </div>
        {!solved && (
          <button
            type="button"
            onClick={() => setShown((v) => !v)}
            className="rounded-md border border-ink-300 bg-paper px-2 py-1 font-ui text-xs text-ink-700 hover:border-ink-500 hover:text-ink-900"
          >
            {shown ? "Hide the atoms" : "Show the atoms"}
          </button>
        )}
      </div>
    </div>
  );
}
