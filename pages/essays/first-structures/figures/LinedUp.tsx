// Line up the spots' waves: first a game along a line, then the whole film as a contour map, lined up right and wrong.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { SpotFilm, onFilm } from "./spots";
import { EDGE_TAN, LAMBDA, MOLECULE_PAIR } from "./ReadingTheFilm";
import { contourPath } from "./contour";
import { LineUpGame } from "./LineUpGame";
import { Note } from "./Figure";

const PANEL = MOLECULE_PAIR.panels[0];

type Wave = { h: number; k: number; amp: number; phase: number };

/** Every spot on the film, one of each pair across the centre (the pair gives the same wave). */
const WAVES: Wave[] = (() => {
  const out: Wave[] = [];
  const reach = Math.ceil(PANEL.box / LAMBDA);
  for (let h = 0; h <= reach; h++)
    for (let k = -reach; k <= reach; k++) {
      if (h === 0 && k <= 0) continue;
      if (!onFilm((LAMBDA * h) / PANEL.box, (LAMBDA * k) / PANEL.box, EDGE_TAN)) continue;
      let re = 0;
      let im = 0;
      for (const { x, y, f } of PANEL.atoms) {
        re += f * Math.cos(2 * Math.PI * (h * x + k * y));
        im += f * Math.sin(2 * Math.PI * (h * x + k * y));
      }
      out.push({ h, k, amp: Math.hypot(re, im), phase: Math.atan2(im, re) });
    }
  // Strongest first: the wrong line-up's random slides are dealt out in this order.
  return out.sort((a, b) => b.amp - a.amp);
})();

/** The same strengths, slid to a fixed but arbitrary set of wrong places. */
const WRONG: Wave[] = (() => {
  let seed = 5;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return WAVES.map((w) => ({ ...w, phase: 2 * Math.PI * rand() }));
})();

/** Density at fractional (x, y) in the unit cell: each spot's wave, at its strength, slid by its phase. */
const density = (waves: Wave[], x: number, y: number) =>
  waves.reduce((sum, w) => sum + w.amp * Math.cos(2 * Math.PI * (w.h * x + w.k * y) - w.phase), 0);

const GRID = 81;
const LEVELS = [0.2, 0.35, 0.5, 0.65, 0.8];

function grid(waves: typeof WAVES) {
  const map = new Float32Array(GRID * GRID);
  for (let j = 0; j < GRID; j++)
    for (let i = 0; i < GRID; i++) map[j * GRID + i] = density(waves, i / (GRID - 1), j / (GRID - 1));
  return map;
}
const RIGHT_MAP = grid(WAVES);
const WRONG_MAP = grid(WRONG);
const top = (map: Float32Array) => map.reduce((a, b) => Math.max(a, b), 0);

function FilmToMaps() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const text = W < 520 ? 10 : 11;

  const arrowW = W < 520 ? 22 : 40;
  const S = Math.min(120, (W - 2 * arrowW - 12) / 3);
  const total = 3 * S + 2 * arrowW + 12;
  const x0 = (W - total) / 2;
  const xs = [x0, x0 + S + arrowW, x0 + 2 * S + arrowW + 12];
  const top0 = 18;
  const H = top0 + S + 24;
  const mid = top0 + S / 2;
  const g = S / (GRID - 1);

  const map = (i: 0 | 1) => {
    const x = xs[i + 1];
    const m = i ? WRONG_MAP : RIGHT_MAP;
    return (
      <g key={i}>
        <rect x={x} y={top0} width={S} height={S} fill={XR.film} />
        <path
          d={contourPath(m, GRID, LEVELS.map((l) => l * top(m)))}
          transform={`translate(${x} ${top0}) scale(${g})`}
          fill="none"
          stroke={XR.ink}
          strokeWidth={0.9 / g}
        />
        <g fill="none" stroke={XR.accent} strokeWidth={1.25}>
          {PANEL.atoms.map((a, j) => (
            <circle key={j} cx={x + a.x * S} cy={top0 + a.y * S} r={Math.max(3, S / 26)} />
          ))}
        </g>
        <rect x={x} y={top0} width={S} height={S} fill="none" stroke={XR.guide} strokeWidth={0.75} />
      </g>
    );
  };


  return (
    <div ref={ref}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t`}>
        <title id={`${ids}t`}>
          One film, its spots added up two ways and drawn as contour maps: lined up right, the contours ring the
          molecule&rsquo;s atoms; lined up wrong, they ring places where there are none.
        </title>
        <SpotFilm x={xs[0]} y={top0} size={S} spots={PANEL.spots} max={PANEL.max} linear />
        <g stroke={XR.label} strokeWidth={1.25} fill={XR.label}>
          <line x1={xs[0] + S + 6} x2={xs[1] - 10} y1={mid} y2={mid} />
          <path d={`M${xs[1] - 4} ${mid} l-7 -4 v8 z`} />
        </g>

        {map(0)}
        {map(1)}
        <Labels size={text}>
          <text x={xs[0] + S / 2} y={top0 - 6} textAnchor="middle">the film</text>
          <text x={xs[1] + S / 2} y={top0 + S + 18} textAnchor="middle">lined up right</text>
          <text x={xs[2] + S / 2} y={top0 + S + 18} textAnchor="middle">lined up wrong</text>
        </Labels>
      </svg>
    </div>
  );
}

export function LinedUp() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <Note title="1. Try lining up the waves">
          Each spot gives one wave; the darker the spot, the taller its wave. Click a flip button to turn a wave upside
          down (change its phase), and find the line-up whose sum peaks on the three hidden atoms. Flipping a wave doesn’t
          change its spot, so the film can’t tell you which phase each wave has.
        </Note>
        <div className="mt-3">
          <LineUpGame />
        </div>
      </div>
      <div>
        <Note title="2. Line them up wrong, and the molecule disappears">
          A real film has spots in every direction. Add up their waves at every point in the unit cell, and you get a map
          of where the electrons are, drawn as contour lines. Lined up right, the map shows the atoms. Lined up wrong, it
          shows nothing.
        </Note>
        <div className="mt-3">
          <FilmToMaps />
        </div>
      </div>
    </div>
  );
}
