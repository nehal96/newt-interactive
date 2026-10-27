// Flip each spot's wave to find the hidden molecule. Alone, the film never helps; with salt added, each spot's change gives its flip away.
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

/** The liquid between molecules: a thin band at both edges of the box, so its wave too is crest or trough at the middle. */
const LIQUID = 0.05;
const LIQUID_RAW = SPOTS.map((n) => {
  let sum = 0;
  for (let i = 0; i < 2000; i++) {
    const x = (i + 0.5) / 2000;
    if (x < LIQUID || x > 1 - LIQUID) sum += Math.cos(TAU * n * (x - 0.5)) / 2000;
  }
  return Math.exp(-BLUR * n * n) * sum;
});
/** Salt's extra wave, kept under the protein's own at every spot so that darker always means in step. */
const SALT_SCALE = 0.8 / Math.max(...LIQUID_RAW.map((l, i) => Math.abs(l / RAW[i])));
const SALT = LIQUID_RAW.map((l) => SALT_SCALE * l);
const WITH_SALT = RAW.map((f, i) => (f + SALT[i]) ** 2);
const DARKEST = Math.max(...WITH_SALT, TALLEST ** 2);
const darker = (i: number) => WITH_SALT[i] > HEIGHT[i] ** 2;
const saltWave = (i: number) => (x: number) => SALT[i] * Math.cos(TAU * SPOTS[i] * (x - 0.5));

const shadeOf = (d: number) => 0.12 + (0.88 * d) / DARKEST;
const spotShade = (i: number) => shadeOf(HEIGHT[i] ** 2);

function FilmStrip({ W, darkness, marks, label }: { W: number; darkness: number[]; marks?: string[]; label: string }) {
  const h = marks ? 42 : 30;
  return (
    <div>
      <svg width={W} height={h} viewBox={`0 0 ${W} ${h}`} className="block" aria-label={label}>
        <rect x={0} y={4} width={W} height={22} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        {SPOTS.map((n, i) => (
          <g key={n}>
            <circle cx={((i + 1) / (SPOTS.length + 1)) * W} cy={15} r={6} fill={XR.sum} fillOpacity={shadeOf(darkness[i])} />
            {marks && (
              <text x={((i + 1) / (SPOTS.length + 1)) * W} y={40} textAnchor="middle" className="font-mono" fontSize={10} fill={XR.label}>
                {marks[i]}
              </text>
            )}
          </g>
        ))}
      </svg>
      <p className="mt-0.5 font-mono text-[10px] text-ink-500">{label}</p>
    </div>
  );
}

export function LineUpGame({ salt = false }: { salt?: boolean }) {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [signs, setSigns] = useState(START);
  const [seen, setSeen] = useState(() => new Set([key(START)]));
  const [shown, setShown] = useState(false);
  const [added, setAdded] = useState(false);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const left = narrow ? 84 : 112;
  const bw = Math.max(80, W - left);
  const close = closeness(signs);
  const solved = close > 0.999;
  const reveal = shown || solved;
  const clued = salt && added;
  const matches = signs.filter((s, i) => s === RIGHT[i]).length;
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

  const message = salt
    ? solved
      ? "✓ Every wave matches its clue, and the sum is the molecule. No guessing needed."
      : clued
        ? `${matches} of ${SPOTS.length} waves match their clue. A spot that darkened has its wave in step with the liquid’s (dashed); one that faded, opposed to it.`
        : "The same four waves and the same film: nothing to choose by. Add salt to the liquid between the molecules."
    : solved
      ? "✓ That’s the molecule: a peak on every atom. Perutz had no meter. Only the film, which looks the same for every one of these line-ups."
      : shown
        ? "Not this one: the peaks miss the atoms. Yet the film fits it just as well as the right one."
        : `Line-ups tried: ${seen.size} of ${ALL}. The film is the same for all of them.`;

  return (
    <div ref={ref} className="w-full">
      <div style={{ paddingLeft: left }}>
        <FilmStrip
          W={bw}
          darkness={HEIGHT.map((h) => h * h)}
          label={salt ? "the film" : "the film: four spots, the same whatever you choose"}
        />
        {salt && (
          <div className="mt-2 min-h-[56px]">
            {added ? (
              <FilmStrip
                W={bw}
                darkness={WITH_SALT}
                marks={SPOTS.map((_, i) => (darker(i) ? (narrow ? "▲" : "▲ darker") : narrow ? "▼" : "▼ fainter"))}
                label={narrow ? "with salt added: ▲ darker, ▼ fainter" : "the film with salt added"}
              />
            ) : (
              <button
                type="button"
                onClick={() => setAdded(true)}
                className="flex items-center gap-2 rounded-md border border-ink-300 bg-paper px-3 py-1.5 font-ui text-xs text-ink-800 hover:border-ink-500"
              >
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: XR.second }} />
                Add salt
              </button>
            )}
          </div>
        )}
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
                  <circle cx={5} cy={5} r={4.5} fill={XR.sum} fillOpacity={spotShade(i)} />
                </svg>
                flip {n}
                {clued && signs[i] === RIGHT[i] && <span style={{ color: XR.success }}>✓</span>}
              </button>
            </div>
            <svg width={bw} height={rowH} viewBox={`0 0 ${bw} ${rowH}`} className="block" aria-hidden>
              <line x1={0} x2={bw} y1={rowH / 2} y2={rowH / 2} stroke={XR.rule} />
              {clued && (
                <path
                  d={curvePath(0, rowH / 2, bw, (t) => (amp * saltWave(i)(t / bw)) / TALLEST, 1)}
                  fill="none"
                  stroke={XR.second}
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                />
              )}
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
          {clued && (
            <g fill={XR.second} fillOpacity={0.35}>
              <rect x={0} y={atomsY} width={LIQUID * bw} height={20} />
              <rect x={(1 - LIQUID) * bw} y={atomsY} width={LIQUID * bw} height={20} />
            </g>
          )}
          <rect x={0} y={atomsY} width={bw} height={20} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
          {reveal ? (
            ATOMS.map((x) => <circle key={x} cx={x * bw} cy={atomsY + 10} r={4.5} fill={XR.sum} />)
          ) : (
            <Labels size={text}>
              <text x={bw / 2} y={atomsY + 14} textAnchor="middle">
                three hidden atoms
              </text>
            </Labels>
          )}
        </svg>
      </div>

      {!salt && <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2" style={{ paddingLeft: left }}>
        <div className="flex items-center gap-2 font-mono text-[11px] text-ink-700">
          <span>how close</span>
          <span className="relative block h-2 w-28 overflow-hidden rounded-full bg-ink-200/70">
            <span
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-300"
              style={{ width: `${Math.round(close * 100)}%`, background: solved ? XR.success : XR.label }}
            />
          </span>
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
      </div>}

      <p className="mt-3 font-ui text-sm text-ink-700" aria-live="polite" style={{ paddingLeft: left }}>
        {message}
      </p>
    </div>
  );
}
