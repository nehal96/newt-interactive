// Figure 6: what a film's spot spacing and spot darkness each say about the crystal.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { SpotFilm, latticeSpots, type Spot } from "./spots";

const LAMBDA = 1.54;
const EDGE_TAN = 0.2;

type Atom = { x: number; y: number; f: number };

/** Fractional positions inside one box; only the heavy atom (f = 26) moves. */
const LIGHT: Atom[] = [
  { x: 0.6, y: 0.4, f: 8 },
  { x: 0.3, y: 0.7, f: 6 },
];
const ARRANGEMENT_A: Atom[] = [{ x: 0.2, y: 0.2, f: 26 }, ...LIGHT];
const ARRANGEMENT_B: Atom[] = [{ x: 0.7, y: 0.8, f: 26 }, ...LIGHT];

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
const SHARED_MAX = Math.max(...SPOTS_A.map((s) => s.s), ...SPOTS_B.map((s) => s.s));

const GROUPS: { title: string; note: string; panels: Panel[] }[] = [
  {
    title: "Halve the box",
    note: "spots twice as far apart",
    panels: [
      { label: "box 40 Å", box: 40, atoms: [{ x: 0.5, y: 0.5, f: 1 }], spots: latticeSpots(40, LAMBDA, EDGE_TAN, ONE_ATOM), max: 1 },
      { label: "box 20 Å", box: 20, atoms: [{ x: 0.5, y: 0.5, f: 1 }], spots: latticeSpots(20, LAMBDA, EDGE_TAN, ONE_ATOM), max: 1 },
    ],
  },
  {
    title: "Move one atom",
    note: "same places, new darkness",
    panels: [
      { label: "heavy atom here", box: 40, atoms: ARRANGEMENT_A, spots: SPOTS_A, max: SHARED_MAX },
      { label: "heavy atom moved", box: 40, atoms: ARRANGEMENT_B, spots: SPOTS_B, max: SHARED_MAX },
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
  const radius = (f: number) => (f >= 26 ? 5 : f >= 8 ? 3 : f >= 6 ? 2.6 : 3);
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
              r={radius(a.f)}
              fill={a.f >= 26 || a.f === 1 ? XR.sum : XR.label}
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

export function ReadingTheFilm() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 11 : 12;
  const wide = W >= 600;

  const S = wide ? Math.min(170, (W - 64) / 4) : (W - 16) / 2;
  const crystalH = Math.round(S * 0.62);
  const pxPerA = S / 3.4 / 40;
  const groupH = 22 + 20 + crystalH + 12 + S + 26;
  const H = wide ? groupH : 2 * groupH + 20;

  const place = (g: number, p: number) => {
    if (wide) {
      const x0 = (W - (4 * S + 64)) / 2;
      return { x: x0 + g * (2 * S + 48) + p * (S + 16), y: 0 };
    }
    return { x: p * (S + 16), y: g * (groupH + 20) };
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
          Spot spacing measures the box; spot darkness depends on what&apos;s inside it.
        </title>
        <desc id={`${ids}d`}>
          Four crystal patches, each above its film. Halving the box from 40 to 20
          ångströms spreads the spots twice as far apart. Keeping the 40 ångström
          box and moving its one heavy atom leaves the spots in the same places
          but changes which are dark and which are faint.
        </desc>

        {GROUPS.map((g, gi) => {
          const a = place(gi, 0);
          const b = place(gi, 1);
          const mid = (a.x + b.x + S) / 2;
          const top = a.y;
          return (
            <g key={g.title}>
              <text
                x={mid}
                y={top + 14}
                textAnchor="middle"
                className="font-ui"
                fontSize={narrow ? 12 : 13}
                fontWeight={600}
                fill={XR.sum}
              >
                {g.title}
              </text>
              {g.panels.map((p, pi) => {
                const { x } = place(gi, pi);
                const crystalTop = top + 42;
                const filmTop = crystalTop + crystalH + 12;
                return (
                  <g key={p.label}>
                    <Labels size={text}>
                      <text x={x + S / 2} y={top + 34} textAnchor="middle">
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
                    <SpotFilm x={x} y={filmTop} size={S} spots={p.spots} max={p.max} linear />
                  </g>
                );
              })}
              <Labels size={text}>
                <text
                  x={mid}
                  y={top + 42 + crystalH + 12 + S + 18}
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
