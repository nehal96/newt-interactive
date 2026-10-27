// A lining-up game: flip each spot's wave crest-up or trough-up and see what molecule the sum draws; the real atoms stay hidden until asked for.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { Profile } from "./stripes";

/** Symmetric about the middle, so every spot's wave has its crest or its trough there. */
export const ATOMS = [0.24, 0.5, 0.76];
export const SPOTS = [1, 2, 3, 4];
const BLUR = 0.02;
const RAW = SPOTS.map((n) => Math.exp(-BLUR * n * n) * ATOMS.reduce((acc, x) => acc + Math.cos(TAU * n * (x - 0.5)), 0));
export const HEIGHT = RAW.map(Math.abs);
export const TALLEST = Math.max(...HEIGHT);
export const RIGHT = RAW.map((f) => (f > 0 ? 1 : -1));
/** Flipping every odd spot moves the whole picture half a box along: the same molecule, measured from another start. */
const SHIFTED = RIGHT.map((s, i) => (SPOTS[i] % 2 ? -s : s));
export const START = [1, 1, -1, -1];
/** A heavy atom at the box's edge: symmetric too, so its wave is also crest or trough at the middle. Kept below twice the smallest protein wave, so it can't hide a sign. */
const HEAVY = 0.6;
const KNOWN = SPOTS.map((n) => HEAVY * Math.exp(-BLUR * n * n) * Math.cos(TAU * n * -0.5));
const AFTER = RAW.map((f, i) => (f + KNOWN[i]) ** 2);
const known = (i: number) => (x: number) => KNOWN[i] * Math.cos(TAU * SPOTS[i] * (x - 0.5));
const DARKEST = Math.max(...AFTER, ...HEIGHT.map((h) => h * h));

export const wave = (i: number, sign: number) => (x: number) => sign * HEIGHT[i] * Math.cos(TAU * SPOTS[i] * (x - 0.5));
export const sumOf = (signs: number[]) => (x: number) => signs.reduce((acc, s, i) => acc + wave(i, s)(x), 0);
const ALL = Array.from({ length: 2 ** SPOTS.length }, (_, m) => SPOTS.map((_, i) => ((m >> i) & 1 ? -1 : 1)));
export const PEAK = Math.max(...ALL.flatMap((signs) => Array.from({ length: 201 }, (_, i) => Math.abs(sumOf(signs)(i / 200)))));
const key = (signs: number[]) => signs.join("");
const same = (a: number[], b: number[]) => key(a) === key(b);
const shade = (d: number) => 0.06 + (0.9 * d) / DARKEST;

function Film({ W, darkness, label, marks }: { W: number; darkness: number[]; label: string; marks?: string[] }) {
  return (
    <div className="mb-1">
      <svg width={W} height={marks ? 40 : 30} viewBox={`0 0 ${W} ${marks ? 40 : 30}`} className="block" aria-label={label}>
        <rect x={0} y={4} width={W} height={22} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        {SPOTS.map((n, i) => (
          <g key={n}>
            <circle cx={((i + 1) / (SPOTS.length + 1)) * W} cy={15} r={6} fill={XR.sum} fillOpacity={shade(darkness[i])} />
            {marks && (
              <text x={((i + 1) / (SPOTS.length + 1)) * W} y={38} textAnchor="middle" className="font-mono" fontSize={10} fill={XR.label}>
                {marks[i]}
              </text>
            )}
          </g>
        ))}
      </svg>
      <p className="font-mono text-[10px] text-ink-500">{label}</p>
    </div>
  );
}

export function LineUp({ hint = false }: { hint?: boolean }) {
  const ids = useId();
  const uid = ids.replace(/:/g, "");
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [signs, setSigns] = useState(START);
  const [seen, setSeen] = useState(() => new Set([key(START)]));
  const [shown, setShown] = useState(false);
  const [added, setAdded] = useState(false);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const left = narrow ? 92 : 120;
  const bw = Math.max(80, W - left - 4);
  const right = same(signs, RIGHT);
  const shifted = same(signs, SHIFTED);
  const clued = hint && added;
  const matches = signs.filter((s, i) => s === RIGHT[i]).length;

  const rowH = 44;
  const amp = 18;
  const sumAmp = 52;
  const mapY = 2 * sumAmp + 18;
  const atomsY = mapY + 24;
  const sumH = atomsY + 24;
  const sum = sumOf(signs);
  const flip = (i: number) => {
    const next = signs.map((s, j) => (j === i ? -s : s));
    setSigns(next);
    setSeen((cur) => new Set(cur).add(key(next)));
  };

  const middle = (h: number) => (
    <line x1={bw / 2} x2={bw / 2} y1={0} y2={h} stroke={XR.atom} strokeWidth={1} strokeDasharray="2 3" />
  );
  const judged = shown || (clued && right);
  const line = judged ? (right || shifted ? XR.sum : XR.accent) : XR.sum;

  let message: string;
  if (shown) {
    message = right
      ? "That’s the molecule: a peak on every atom."
      : shifted
        ? "That’s the molecule too, slid half a cell along. The cell has no fixed starting point, so this counts."
        : "Not this one. The film fits it just as well, but the peaks miss the atoms.";
  } else if (clued) {
    message = right
      ? "Every wave matches its clue, and the picture is the molecule. No guessing needed."
      : `${matches} of ${SPOTS.length} waves match their clue. A spot that darkened has its wave in step with the heavy atom’s (dashed); one that faded, opposed to it.`;
  } else if (hint) {
    message = "Add a heavy atom where you can see it, and watch what it does to each spot.";
  } else {
    message = `Pictures you’ve made: ${seen.size} of ${ALL.length}. The film fits every one of them. Which is the molecule?`;
  }

  return (
    <div ref={ref} className="w-full">
      <div style={{ paddingLeft: left }}>
        <Film W={bw} darkness={HEIGHT.map((h) => h * h)} label={hint ? "the film" : "the film: the same however you line the waves up"} />
        {hint && (
          <div className="mt-2 mb-1 min-h-[58px]">
            {added ? (
              <Film
                W={bw}
                darkness={AFTER}
                label={narrow ? "with the heavy atom added: ▲ darker, ▼ fainter" : "the film with the heavy atom added"}
                marks={AFTER.map((d, i) => (d > HEIGHT[i] ** 2 ? (narrow ? "▲" : "darker") : narrow ? "▼" : "fainter"))}
              />
            ) : (
              <button
                type="button"
                onClick={() => setAdded(true)}
                className="flex items-center gap-2 rounded-md border border-ink-300 bg-paper px-3 py-1.5 font-ui text-xs text-ink-800 hover:border-ink-500"
              >
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: XR.first }} />
                Add a heavy atom
              </button>
            )}
          </div>
        )}
      </div>
      <div className="mb-2" />

      {SPOTS.map((n, i) => {
        const ok = signs[i] === RIGHT[i];
        return (
          <div key={n} className="flex items-center" style={{ height: rowH }}>
            <div className="flex shrink-0 items-center gap-1.5" style={{ width: left }}>
              <button
                type="button"
                onClick={() => flip(i)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-ink-300 bg-paper px-2 py-1 font-mono text-[11px] text-ink-700 hover:border-ink-500 hover:text-ink-900"
                aria-label={`Flip spot ${n}’s wave`}
              >
                <svg width={10} height={10} viewBox="0 0 10 10" aria-hidden>
                  <circle cx={5} cy={5} r={4.5} fill={XR.sum} fillOpacity={shade(HEIGHT[i] ** 2)} />
                </svg>
                spot {n} {clued && ok ? "✓" : "⇅"}
              </button>
            </div>
            <svg width={bw} height={rowH} viewBox={`0 0 ${bw} ${rowH}`} className="block" aria-hidden>
              {middle(rowH)}
              <line x1={0} x2={bw} y1={rowH / 2} y2={rowH / 2} stroke={XR.rule} />
              {clued && (
                <path d={curvePath(0, rowH / 2, bw, (t) => (amp * known(i)(t / bw)) / TALLEST, 1)} fill="none" stroke={XR.second} strokeWidth={1.5} strokeDasharray="4 3" />
              )}
              <path d={curvePath(0, rowH / 2, bw, (t) => (amp * wave(i, signs[i])(t / bw)) / TALLEST, 1)} fill="none" stroke={XR.first} strokeWidth={1.75} />
              {clued && (
                <Labels size={text}>
                  <text x={bw - 2} y={10} textAnchor="end" fill={XR.sum}>
                    {AFTER[i] > HEIGHT[i] ** 2 ? "darker: in step with it" : "fainter: opposed to it"}
                  </text>
                </Labels>
              )}
            </svg>
          </div>
        );
      })}

      <div className="mt-2 flex items-start">
        <div className="shrink-0 pt-10 font-mono text-[11px] text-ink-700" style={{ width: left }}>
          the picture
        </div>
        <svg width={bw} height={sumH} viewBox={`0 0 ${bw} ${sumH}`} className="block" role="img" aria-labelledby={`${ids}t`}>
          <title id={`${ids}t`}>
            {judged
              ? right || shifted
                ? "The waves are lined up: the picture has a peak on each atom."
                : "The picture the waves make, with the real atoms shown; its peaks miss them."
              : "The picture the four waves add up to, and the same picture shaded as a map. The real atoms are hidden."}
          </title>
          <defs>
            <Profile id={`${uid}map`} x0={0} x1={bw} colour={XR.sum} alpha={(x) => (0.85 * Math.max(0, sum(x))) / PEAK} />
          </defs>
          {middle(atomsY - 4)}
          {shown && (
            <g stroke={XR.label} strokeWidth={0.75} strokeDasharray="2 3">
              {ATOMS.map((x) => (
                <line key={x} x1={x * bw} x2={x * bw} y1={6} y2={atomsY + 10} />
              ))}
            </g>
          )}
          <line x1={0} x2={bw} y1={sumAmp + 8} y2={sumAmp + 8} stroke={XR.rule} />
          <path d={curvePath(0, sumAmp + 8, bw, (t) => (sumAmp * sum(t / bw)) / PEAK, 1)} fill="none" stroke={line} strokeWidth={2.25} />
          <rect x={0} y={mapY} width={bw} height={16} fill={`url(#${uid}map)`} />
          <rect x={0} y={mapY} width={bw} height={16} fill="none" stroke={XR.atom} strokeWidth={0.75} />
          <rect x={0} y={atomsY} width={bw} height={20} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
          {clued && <circle cx={7} cy={atomsY + 10} r={6} fill={XR.second} />}
          {shown ? (
            ATOMS.map((x) => <circle key={x} cx={x * bw} cy={atomsY + 10} r={4.5} fill={XR.sum} />)
          ) : (
            <Labels size={text}>
              <text x={bw / 2} y={atomsY + 14} textAnchor="middle">
                ?
              </text>
            </Labels>
          )}
          <Labels size={text}>
            <text x={bw - 2} y={mapY - 4} textAnchor="end">
              {narrow ? "as a map" : "as a map: darker where the line is higher"}
            </text>
          </Labels>
        </svg>
      </div>
      <div className="flex items-center justify-between gap-3" style={{ paddingLeft: left }}>
        <span className="font-mono text-[10px] text-ink-500">
          the real atoms{clued && <span style={{ color: XR.second }}>, and the heavy atom at the edge</span>}
        </span>
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          className="rounded-md border border-ink-300 bg-paper px-2 py-1 font-ui text-xs text-ink-700 hover:border-ink-500 hover:text-ink-900"
        >
          {shown ? "Hide them" : "Show them"}
        </button>
      </div>

      <p className="mt-4 font-ui text-sm text-ink-700" aria-live="polite">
        {message}
      </p>
      {!hint && (
        <p className="mt-2 font-ui text-xs leading-5 text-ink-500">
          {SPOTS.length} spots: {ALL.length} ways to line them up. 10 spots: 1,024. 20 spots: over a million. A protein’s film
          has thousands of spots.
        </p>
      )}
    </div>
  );
}
