// The spots' waves added back into a density map of the seven-atom molecule, one ring of spots further each frame.
import { useId, useMemo, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU } from "./wave";
import { ATOMS } from "./Molecule";
import { contourPath } from "./contour";
import { SliderRow } from "./controls";

/** Neighbouring atoms in `ATOMS` are 14.4 units apart; a carbon–carbon bond is about 1.5 Å. */
const ANGSTROM = 14.4 / 1.5;
const CELL = 87;
const CELL_A = CELL / ANGSTROM;
const SIGMA = 0.3 * ANGSTROM;
const MAX_ORDER = 12;
/** How far out the spots reach in each frame, in rings: outline, shape, bumps, atoms. */
const STEPS = [1.5, 3, 6, MAX_ORDER];
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

/** Density on a GRID × GRID sampling of one cell, centred on the molecule. */
function densityMap(order: number) {
  const map = new Float64Array(GRID * GRID);
  TERMS.forEach((t) => {
    if (t.r > order) return;
    for (let iy = 0; iy < GRID; iy++) {
      const y = (iy / GRID - 0.5) * CELL;
      for (let ix = 0; ix < GRID; ix++) {
        const x = (ix / GRID - 0.5) * CELL;
        map[iy * GRID + ix] += t.amp * Math.cos(TAU * ((t.h * x) / CELL + (t.k * y) / CELL) - t.phase);
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

function SpotsSquare({ x, y, size, order, prev }: { x: number; y: number; size: number; order: number; prev: number }) {
  const c = size / 2;
  const step = size / (2 * MAX_ORDER + 2);
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={XR.filmGrey} stroke={XR.atom} strokeWidth={0.75} />
      {TERMS.filter((t) => t.r > 0).map((t) => {
        const used = t.r <= order;
        const added = used && t.r > prev;
        return (
          <circle
            key={`${t.h},${t.k}`}
            cx={x + c + t.h * step}
            cy={y + c + t.k * step}
            r={Math.max(1.4, step * 0.26)}
            fill={added ? XR.accent : used ? XR.sum : XR.atom}
            fillOpacity={used ? 0.45 + 0.55 * (t.amp / LOUDEST) : 0.25 + 0.35 * (t.amp / LOUDEST)}
          />
        );
      })}
      <circle cx={x + c} cy={y + c} r={(order + 0.5) * step} fill="none" stroke={XR.atom} strokeWidth={0.75} />
      <circle cx={x + c} cy={y + c} r={Math.max(3, step * 0.45)} fill={XR.label} />
    </g>
  );
}

export function FourierMap() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const maps = useMemo(() => STEPS.map((o) => densityMap(o)), []);
  const wide = W >= 600;
  const cols = wide ? 4 : 2;
  const gap = wide ? 16 : 20;
  const size = (W - (cols - 1) * gap) / cols;
  const film = Math.round(size * 0.62);
  const cellH = 18 + film + 10 + size + 22;
  const H = (wide ? 1 : 2) * cellH;

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t`}>
        <title id={`${ids}t`}>
          {`Four maps built from more and more spots: ${STEPS.map((o) => `${TERMS.filter((t) => t.r > 0 && t.r <= o).length} spots`).join(", ")}. The first shows only an outline; the last shows the seven atoms apart.`}
        </title>
        {STEPS.map((o, i) => {
          const x = (i % cols) * (size + gap);
          const y = Math.floor(i / cols) * cellH;
          const used = TERMS.filter((t) => t.r > 0 && t.r <= o).length;
          return (
            <g key={o}>
              <text x={x} y={y + 11} className="font-mono" fontSize={10} fill={XR.label}>
                {i === 0 ? "film: spots used" : ""}
              </text>
              <SpotsSquare x={x + (size - film) / 2} y={y + 18} size={film} order={o} prev={i ? STEPS[i - 1] : 0} />
              <MapSquare x={x} y={y + 18 + film + 10} size={size} map={maps[i]} />
              <text
                x={x + size / 2}
                y={y + 18 + film + 10 + size + 15}
                textAnchor="middle"
                className="font-mono"
                fontSize={10}
                fill={XR.sum}
              >
                {`${used} spots`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function FourierMapInteractive() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [order, setOrder] = useState(STEPS[0]);
  const gap = W < 520 ? 16 : 32;
  const size = Math.min(180, (W - gap) / 2);
  const left = (W - 2 * size - gap) / 2;
  const top = 18;
  const H = top + size + 2;
  const built = useMemo(() => densityMap(order), [order]);
  const used = TERMS.filter((t) => t.r > 0 && t.r <= order).length;

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t`}>
        <title id={`${ids}t`}>{`The ${used} spots inside the circle, added back as waves, give the map on the right.`}</title>
        <text x={left} y={top - 7} className="font-mono" fontSize={10} fill={XR.label}>
          film: spots used
        </text>
        <SpotsSquare x={left} y={top} size={size} order={order} prev={order - 1} />
        <MapSquare x={left + size + gap} y={top} size={size} map={built} label="waves added" />
      </svg>
      <div className="mt-4">
        <SliderRow
          label="Spots used"
          value={order}
          display={`${used} spots`}
          min={1}
          max={MAX_ORDER}
          step={0.5}
          onChange={setOrder}
        />
      </div>
    </div>
  );
}
