// The spots' waves added back into a density map of the seven-atom molecule.
import { useId, useMemo, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU } from "./wave";
import { ATOMS } from "./Molecule";
import { SliderRow } from "./controls";
import { Note } from "./TwoAtoms";
import { contourPath } from "./contour";

/** Neighbouring atoms in `ATOMS` are 14.4 units apart; a carbon–carbon bond is about 1.5 Å. */
const ANGSTROM = 14.4 / 1.5;
const CELL = 87;
const CELL_A = CELL / ANGSTROM;
const SIGMA = 0.3 * ANGSTROM;
const MAX_ORDER = 12;
const GRID = 72;
const LEVELS = [0.15, 0.35, 0.55, 0.75];

type Term = { h: number; k: number; amp: number; phase: number; r: number };

const TERMS: Term[] = (() => {
  const terms: Term[] = [];
  for (let h = -MAX_ORDER; h <= MAX_ORDER; h++)
    for (let k = -MAX_ORDER; k <= MAX_ORDER; k++) {
      const r = Math.hypot(h, k);
      if (r > MAX_ORDER) continue;
      const blur = Math.exp(-2 * Math.PI ** 2 * SIGMA ** 2 * (r / CELL) ** 2);
      let re = 0;
      let im = 0;
      for (const [x, y] of ATOMS) {
        const a = TAU * ((h * x) / CELL + (k * y) / CELL);
        re += Math.cos(a);
        im += Math.sin(a);
      }
      terms.push({ h, k, amp: blur * Math.hypot(re, im), phase: Math.atan2(im, re), r });
    }
  return terms;
})();

const LOUDEST = Math.max(...TERMS.filter((t) => t.r > 0).map((t) => t.amp));

/** Fixed pseudo-random offsets, so the scrambled map is the same on every render. */
const SCRAMBLED = (() => {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const byIndex = new Map<string, number>();
  for (const t of TERMS) {
    if (t.r === 0 || byIndex.has(`${t.h},${t.k}`)) continue;
    const p = rand() * TAU;
    byIndex.set(`${t.h},${t.k}`, p);
    byIndex.set(`${-t.h},${-t.k}`, -p);
  }
  return TERMS.map((t) => (t.r === 0 ? 0 : byIndex.get(`${t.h},${t.k}`)!));
})();

/** Density on a GRID × GRID sampling of one cell, centred on the molecule. */
function densityMap(order: number, phases?: number[]) {
  const map = new Float64Array(GRID * GRID);
  TERMS.forEach((t, i) => {
    if (t.r > order) return;
    const phase = phases ? phases[i] : t.phase;
    for (let iy = 0; iy < GRID; iy++) {
      const y = (iy / GRID - 0.5) * CELL;
      for (let ix = 0; ix < GRID; ix++) {
        const x = (ix / GRID - 0.5) * CELL;
        map[iy * GRID + ix] += t.amp * Math.cos(TAU * ((t.h * x) / CELL + (t.k * y) / CELL) - phase);
      }
    }
  });
  return map;
}

const PEAK = densityMap(MAX_ORDER).reduce((m, v) => Math.max(m, v), -Infinity);

function MapSquare({ x, y, size, map, label }: { x: number; y: number; size: number; map: Float64Array; label?: string }) {
  const s = size / GRID;
  const c = size / 2;
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
      <g fill={XR.molecule} fillOpacity={0.5}>
        {ATOMS.map(([ax, ay]) => (
          <circle key={`${ax}-${ay}`} cx={x + c + (ax / CELL) * size} cy={y + c + (ay / CELL) * size} r={(7 / CELL) * size} />
        ))}
      </g>
      <path
        d={contourPath(map, GRID, LEVELS.map((l) => l * PEAK))}
        transform={`translate(${x} ${y}) scale(${s})`}
        fill="none"
        stroke={XR.sum}
        strokeWidth={1.1 / s}
        strokeLinecap="round"
      />
      {label && (
        <text x={x} y={y - 7} className="font-mono" fontSize={10} fill={XR.label}>
          {label}
        </text>
      )}
    </g>
  );
}

function SpotsSquare({ x, y, size, order }: { x: number; y: number; size: number; order: number }) {
  const c = size / 2;
  const step = size / (2 * MAX_ORDER + 2);
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
      {TERMS.filter((t) => t.r > 0).map((t) => {
        const used = t.r <= order;
        return (
          <circle
            key={`${t.h},${t.k}`}
            cx={x + c + t.h * step}
            cy={y + c + t.k * step}
            r={Math.max(1.2, step * 0.22)}
            fill={used ? XR.sum : XR.atom}
            fillOpacity={used ? 0.15 + 0.85 * (t.amp / LOUDEST) : 0.08 + 0.4 * (t.amp / LOUDEST)}
          />
        );
      })}
      <circle cx={x + c} cy={y + c} r={(order + 0.5) * step} fill="none" stroke={XR.accent} strokeWidth={1.25} />
      <circle cx={x + c} cy={y + c} r={Math.max(3, step * 0.45)} fill={XR.label} />
    </g>
  );
}

export function FourierMap() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [order, setOrder] = useState(3);
  const gap = W < 520 ? 16 : 32;
  const size = Math.min(180, (W - gap) / 2);
  const left = (W - 2 * size - gap) / 2;
  const top = 18;
  const H = top + size + 2;

  const built = useMemo(() => densityMap(order), [order]);
  const full = useMemo(() => densityMap(MAX_ORDER), []);
  const scrambled = useMemo(() => densityMap(MAX_ORDER, SCRAMBLED), []);
  const used = TERMS.filter((t) => t.r > 0 && t.r <= order).length;
  const finest = CELL_A / order;

  return (
    <div ref={ref} className="flex w-full flex-col gap-8">
      <div>
        <Note title="1. Adding the waves back">
          Every spot is a wave with a height and an offset. The spots near the center give the
          broad shape; the outer ones add finer detail, until the atoms separate.
        </Note>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="mt-3 block" role="img" aria-labelledby={`${ids}a`}>
          <title id={`${ids}a`}>
            {`The ${used} spots inside the circle, added back as waves, give a map with detail down to ${finest.toFixed(1)} Å.`}
          </title>
          <SpotsSquare x={left} y={top} size={size} order={order} />
          <text x={left} y={top - 7} className="font-mono" fontSize={10} fill={XR.label}>
            film
          </text>
          <MapSquare x={left + size + gap} y={top} size={size} map={built} label="waves added" />
        </svg>
        <div className="mt-4">
          <SliderRow
            label="Spots used"
            value={order}
            display={`${used} · detail to ${finest.toFixed(1)} Å`}
            min={1}
            max={MAX_ORDER}
            step={1}
            onChange={setOrder}
          />
        </div>
      </div>
      <div>
        <Note title="2. The offsets carry the shape">
          Keep every height but scramble the offsets, and the molecule is gone. The film records
          only the heights.
        </Note>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="mt-3 block" role="img" aria-labelledby={`${ids}b`}>
          <title id={`${ids}b`}>
            The same spot heights with the right offsets give the molecule; with scrambled offsets
            they give a meaningless map.
          </title>
          <MapSquare x={left} y={top} size={size} map={full} label="right offsets" />
          <MapSquare x={left + size + gap} y={top} size={size} map={scrambled} label="offsets scrambled" />
        </svg>
      </div>
    </div>
  );
}
