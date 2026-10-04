// What a film's spot spacing and spot darkness each say about the crystal.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { SpotFilm, latticeSpots, type Spot } from "./spots";

const LAMBDA = 1.54;
const EDGE_TAN = 0.2;

type Atom = { x: number; y: number; f: number; heavy?: boolean };

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
 * A real protein has thousands of atoms, too many to draw, so the heavy atom is
 * scaled to a quarter of the light atoms' combined scattering: about the share
 * two mercury atoms (80 electrons each) have against hemoglobin's ~5,000 atoms.
 */
const HEAVY_F = 0.25 * Math.sqrt(LIGHT.reduce((sum, a) => sum + a.f * a.f, 0));
const ARRANGEMENT_A: Atom[] = LIGHT;
const ARRANGEMENT_B: Atom[] = [{ x: 0.3, y: 0.62, f: HEAVY_F, heavy: true }, ...LIGHT];

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
const change = SPOTS_A.map((a, i) => SPOTS_B[i].s - a.s);
const DARKER = SPOTS_A[change.indexOf(Math.max(...change))];
const FAINTER = SPOTS_A[change.indexOf(Math.min(...change))];
const MARKS = (labelled: boolean) => [
  { X: DARKER.X, Y: DARKER.Y, color: XR.accent, label: labelled ? "darker" : undefined },
  { X: FAINTER.X, Y: FAINTER.Y, color: XR.label, label: labelled ? "fainter" : undefined },
];
const SHARED_MAX = Math.max(...SPOTS_A.map((s) => s.s), ...SPOTS_B.map((s) => s.s));

const GROUPS: { title: string; note: string; panels: Panel[] }[] = [
  {
    title: "Halve the unit cell",
    note: "spots twice as far apart",
    panels: [
      { label: "40 Å across", box: 40, atoms: [{ x: 0.5, y: 0.5, f: 1 }], spots: latticeSpots(40, LAMBDA, EDGE_TAN, ONE_ATOM), max: 1 },
      { label: "20 Å across", box: 20, atoms: [{ x: 0.5, y: 0.5, f: 1 }], spots: latticeSpots(20, LAMBDA, EDGE_TAN, ONE_ATOM), max: 1 },
    ],
  },
  {
    title: "Add a heavy atom",
    note: "same places, different darkness",
    panels: [
      { label: "light atoms", box: 40, atoms: ARRANGEMENT_A, spots: SPOTS_A, max: SHARED_MAX },
      { label: "plus a heavy atom", box: 40, atoms: ARRANGEMENT_B, spots: SPOTS_B, max: SHARED_MAX },
    ],
  },
];

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
  const radius = (a: Atom) => (a.heavy ? 5 : a.f === 1 ? 3 : 1.7);
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
          return panel.atoms.map((a, k) => (
            <circle
              key={`${n}-${k}`}
              cx={ox + (i + a.x) * cell}
              cy={oy + (j + a.y) * cell}
              r={radius(a)}
              fill={a.heavy || a.f === 1 ? XR.sum : XR.label}
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

export function ReadingTheFilm({ group }: { group: "box" | "atom" }) {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const shown = GROUPS.filter((_, i) => (group === "box" ? i === 0 : i === 1));

  const S = Math.min(170, (W - 12) / 2);
  const crystalH = Math.round(S * 0.5);
  const pxPerA = S / 3.4 / 40;
  const groupH = 22 + crystalH + 12 + S + 26;
  const H = groupH;

  const place = (_g: number, p: number) => {
    const x0 = (W - (2 * S + 12)) / 2;
    return { x: x0 + p * (S + 12), y: 0 };
  };

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
        <title id={`${ids}t`}>
          {group === "box"
            ? "The smaller the unit cell, the farther apart the spots."
            : "A heavy atom leaves the spots where they are but changes how dark they are."}
        </title>
        <desc id={`${ids}d`}>
          {group === "box"
            ? "Two crystal patches, each above its film. Halving the box from 40 to 20 ångströms spreads the spots twice as far apart."
            : "Two crystal patches with the same 40 ångström box of light atoms, each above its film; the second has one heavy atom added. The spots fall in the same places; some get darker and others fainter."}
        </desc>

        {shown.map((g) => {
          const gi = group === "box" ? 0 : 1;
          const a = place(gi, 0);
          const b = place(gi, 1);
          const mid = (a.x + b.x + S) / 2;
          const top = a.y;
          return (
            <g key={g.title}>
              {g.panels.map((p, pi) => {
                const { x } = place(gi, pi);
                const crystalTop = top + 22;
                const filmTop = crystalTop + crystalH + 12;
                return (
                  <g key={p.label}>
                    <Labels size={text}>
                      <text x={x + S / 2} y={top + 14} textAnchor="middle">
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
                      ring={gi === 1 && pi === 1}
                    />
                    <SpotFilm
                      x={x}
                      y={filmTop}
                      size={S}
                      spots={p.spots}
                      max={p.max}
                      linear
                      marks={gi === 1 ? MARKS(pi === 1) : []}
                    />
                  </g>
                );
              })}
              <Labels size={text}>
                <text
                  x={mid}
                  y={top + 22 + crystalH + 12 + S + 18}
                  textAnchor="middle"
                  fill={XR.accent}
                >
                  {g.note}
                </text>
              </Labels>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
