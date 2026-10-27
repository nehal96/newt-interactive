// What a film's spot spacing and spot darkness each say about the crystal.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { SpotFilm, latticeSpots, type Spot } from "./spots";
import { ATOMS as SMALL } from "./Molecule";

export const LAMBDA = 1.54;
export const EDGE_TAN = 0.2;

export type Atom = { x: number; y: number; f: number; heavy?: boolean };

/** Fractional positions inside one box; f is the number of electrons (carbon 6, nitrogen 7, oxygen 8). */
const LIGHT: Atom[] = [
  { x: 0.608, y: 0.713, f: 8 },
  { x: 0.086, y: 0.47, f: 6 },
  { x: 0.631, y: 0.853, f: 6 },
  { x: 0.387, y: 0.824, f: 7 },
  { x: 0.539, y: 0.565, f: 6 },
  { x: 0.703, y: 0.419, f: 6 },
  { x: 0.866, y: 0.734, f: 6 },
  { x: 0.73, y: 0.123, f: 8 },
  { x: 0.603, y: 0.171, f: 6 },
  { x: 0.916, y: 0.065, f: 6 },
  { x: 0.905, y: 0.206, f: 6 },
  { x: 0.315, y: 0.906, f: 8 },
  { x: 0.831, y: 0.611, f: 6 },
  { x: 0.911, y: 0.846, f: 6 },
  { x: 0.373, y: 0.329, f: 6 },
  { x: 0.223, y: 0.476, f: 6 },
  { x: 0.11, y: 0.918, f: 6 },
  { x: 0.895, y: 0.375, f: 7 },
  { x: 0.076, y: 0.753, f: 6 },
  { x: 0.458, y: 0.683, f: 8 },
  { x: 0.372, y: 0.522, f: 7 },
  { x: 0.762, y: 0.817, f: 6 },
  { x: 0.441, y: 0.921, f: 6 },
  { x: 0.216, y: 0.129, f: 6 },
  { x: 0.131, y: 0.589, f: 7 },
  { x: 0.09, y: 0.329, f: 8 },
  { x: 0.68, y: 0.307, f: 7 },
  { x: 0.359, y: 0.217, f: 6 },
  { x: 0.823, y: 0.456, f: 6 },
  { x: 0.211, y: 0.747, f: 8 },
];

/**
 * Two mercury atoms are about a quarter of hemoglobin's combined scattering;
 * the heavy atom here is 2.4 times that, so the changes show on a plain darkness scale.
 */
const HEAVY_F = 0.6 * Math.sqrt(LIGHT.reduce((sum, a) => sum + a.f * a.f, 0));
const ARRANGEMENT_A: Atom[] = LIGHT;
const ARRANGEMENT_B: Atom[] = [{ x: 0.3, y: 0.62, f: HEAVY_F, heavy: true }, ...LIGHT];

/** The small seven-carbon molecule of the earlier figures, and the same atoms bent into another shape, in drawing units. */
const BENT: [number, number][] = [
  [-17.2, -17.2],
  [-17.2, -2.8],
  [-17.2, 11.6],
  [-2.8, 11.6],
  [11.6, 11.6],
  [11.6, -2.8],
  [26, -2.8],
];
/** Drawing units across one box. */
const SMALL_BOX = 87;
const inBox = (pts: [number, number][]): Atom[] =>
  pts.map(([x, y]) => ({ x: 0.5 + x / SMALL_BOX, y: 0.5 + y / SMALL_BOX, f: 6 }));
const MOLECULE: Atom[] = inBox(SMALL);
const OTHER: Atom[] = inBox(BENT);

const strengthOf = (atoms: Atom[]) => (h: number, k: number) => {
  let re = 0;
  let im = 0;
  for (const { x, y, f } of atoms) {
    const phase = 2 * Math.PI * (h * x + k * y);
    re += f * Math.cos(phase);
    im += f * Math.sin(phase);
  }
  return re * re + im * im;
};

const ONE_ATOM = () => 1;

type Panel = {
  label: string;
  box: number;
  atoms: Atom[];
  spots: Spot[];
  max: number;
};

const SPOTS_A = latticeSpots(40, LAMBDA, EDGE_TAN, strengthOf(ARRANGEMENT_A));
const SPOTS_B = latticeSpots(40, LAMBDA, EDGE_TAN, strengthOf(ARRANGEMENT_B));
const SPOTS_MOLECULE = latticeSpots(40, LAMBDA, EDGE_TAN, strengthOf(MOLECULE));
const SPOTS_OTHER = latticeSpots(40, LAMBDA, EDGE_TAN, strengthOf(OTHER));

type Mark = { X: number; Y: number; color: string; label?: string };

/** Rings on the spot that darkens most and the one that fades most from `a` to `b`. */
function marksFor(a: Spot[], b: Spot[]) {
  const change = a.map((s, i) => b[i].s - s.s);
  const darker = a[change.indexOf(Math.max(...change))];
  const fainter = a[change.indexOf(Math.min(...change))];
  return (labelled: boolean): Mark[] => [
    { X: darker.X, Y: darker.Y, color: XR.accent, label: labelled ? "darker" : undefined },
    { X: fainter.X, Y: fainter.Y, color: XR.label, label: labelled ? "fainter" : undefined },
  ];
}
const maxOf = (...sets: Spot[][]) => Math.max(...sets.flat().map((s) => s.s));
const SHARED_MAX = maxOf(SPOTS_A, SPOTS_B);
const OTHER_MAX = maxOf(SPOTS_MOLECULE, SPOTS_OTHER);

type Group = "box" | "atom" | "molecule";

const GROUPS: Record<Group, { note?: string; panels: Panel[]; marks?: (labelled: boolean) => Mark[] }> = {
  box: {
    note: "spots twice as far apart",
    panels: [
      { label: "40 Å across", box: 40, atoms: [{ x: 0.5, y: 0.5, f: 1 }], spots: latticeSpots(40, LAMBDA, EDGE_TAN, ONE_ATOM), max: 1 },
      { label: "20 Å across", box: 20, atoms: [{ x: 0.5, y: 0.5, f: 1 }], spots: latticeSpots(20, LAMBDA, EDGE_TAN, ONE_ATOM), max: 1 },
    ],
  },
  atom: {
    panels: [
      { label: "protein alone", box: 40, atoms: ARRANGEMENT_A, spots: SPOTS_A, max: SHARED_MAX },
      { label: "plus mercury", box: 40, atoms: ARRANGEMENT_B, spots: SPOTS_B, max: SHARED_MAX },
    ],
    marks: marksFor(SPOTS_A, SPOTS_B),
  },
  molecule: {
    note: "same places, different darkness",
    panels: [
      { label: "one molecule", box: 40, atoms: MOLECULE, spots: SPOTS_MOLECULE, max: OTHER_MAX },
      { label: "another molecule", box: 40, atoms: OTHER, spots: SPOTS_OTHER, max: OTHER_MAX },
    ],
    marks: marksFor(SPOTS_MOLECULE, SPOTS_OTHER),
  },
};

/** A patch of the crystal, boxes outlined, drawn at a fixed number of pixels per ångström. */
function CrystalPatch({
  x,
  y,
  w,
  h,
  pxPerA,
  panel,
  ring,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  pxPerA: number;
  panel: Panel;
  ring: boolean;
}) {
  const id = useId();
  const cell = panel.box * pxPerA;
  const cols = Math.ceil(w / cell) + 1;
  const rows = Math.ceil(h / cell) + 1;
  const ox = x + (w - Math.floor(w / cell) * cell) / 2;
  const oy = y + (h - Math.floor(h / cell) * cell) / 2;
  const sparse = panel.atoms.length < 10;
  const radius = (a: Atom) => (a.heavy ? 5 : a.f === 1 ? 3 : sparse ? 2.4 : 1.7);
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3">
          {Array.from({ length: cols + 1 }, (_, i) => (
            <line key={`v${i}`} x1={ox + (i - 1) * cell} x2={ox + (i - 1) * cell} y1={y} y2={y + h} />
          ))}
          {Array.from({ length: rows + 1 }, (_, j) => (
            <line key={`h${j}`} x1={x} x2={x + w} y1={oy + (j - 1) * cell} y2={oy + (j - 1) * cell} />
          ))}
        </g>
        {Array.from({ length: (cols + 1) * (rows + 1) }, (_, n) => {
          const i = (n % (cols + 1)) - 1;
          const j = Math.floor(n / (cols + 1)) - 1;
          // A few big atoms per cell read as a molecule only if no cell is cut off at the edge.
          if (sparse && (i < 0 || j < 0 || i >= Math.floor(w / cell) || j >= Math.floor(h / cell))) return null;
          return panel.atoms.map((a, k) => (
            <circle
              key={`${n}-${k}`}
              cx={ox + (i + a.x) * cell}
              cy={oy + (j + a.y) * cell}
              r={radius(a)}
              fill={a.heavy || a.f === 1 ? XR.sum : sparse ? XR.moleculeEdge : XR.label}
            />
          ));
        })}
        {ring && (
          <circle
            cx={ox + panel.atoms[0].x * cell}
            cy={oy + panel.atoms[0].y * cell}
            r={9}
            fill="none"
            stroke={XR.accent}
            strokeWidth={1.5}
          />
        )}
      </g>
    </g>
  );
}

const TITLES: Record<Group, string> = {
  box: "The smaller the unit cell, the farther apart the spots.",
  atom: "A heavy atom leaves the spots where they are but changes how dark they are.",
  molecule: "A different molecule in the same unit cell leaves the spots where they are but changes how dark they are.",
};

const DESCRIPTIONS: Record<Group, string> = {
  box: "Two crystal patches, each above its film. Halving the box from 40 to 20 ångströms spreads the spots twice as far apart.",
  atom: "Two crystal patches with the same 40 ångström box of light atoms, each above its film; the second has one heavy atom added. The spots fall in the same places; some get darker and others fainter.",
  molecule: "Two crystal patches with the same 40 ångström box, filled with the same atoms in different places, each above its film. The spots fall in the same places; some get darker and others fainter.",
};

export function ReadingTheFilm({ group, size = 170 }: { group: Group; size?: number }) {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const g = GROUPS[group];

  const S = Math.min(size, (W - 12) / 2);
  const crystalH = Math.round(S * 0.5);
  const pxPerA = S / 3.4 / 40;
  const H = 22 + crystalH + 12 + S + (g.note ? 26 : 4);
  const x0 = (W - (2 * S + 12)) / 2;
  const mid = W / 2;

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>{TITLES[group]}</title>
        <desc id={`${ids}d`}>{DESCRIPTIONS[group]}</desc>

        {g.panels.map((p, pi) => {
          const x = x0 + pi * (S + 12);
          const crystalTop = 22;
          const filmTop = crystalTop + crystalH + 12;
          return (
            <g key={p.label}>
              <Labels size={text}>
                <text x={x + S / 2} y={14} textAnchor="middle">
                  {p.label}
                </text>
              </Labels>
              <CrystalPatch
                x={x}
                y={crystalTop}
                w={S}
                h={crystalH}
                pxPerA={pxPerA}
                panel={p}
                ring={group === "atom" && pi === 1}
              />
              <SpotFilm
                x={x}
                y={filmTop}
                size={S}
                spots={p.spots}
                max={p.max}
                linear
                marks={g.marks ? g.marks(pi === 1) : []}
              />
            </g>
          );
        })}
        {g.note && (
          <Labels size={text}>
            <text x={mid} y={22 + crystalH + 12 + S + 18} textAnchor="middle" fill={XR.accent}>
              {g.note}
            </text>
          </Labels>
        )}
      </svg>
    </div>
  );
}

/** The two-molecule comparison, for figures that lay out their own films. */
export const MOLECULE_PAIR = GROUPS.molecule;
