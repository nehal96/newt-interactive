// Where a crystal's spots fall, and how dark they come out for two different molecules in the same crystal.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { BeamArrow, Labels } from "./scene";
import { MOLECULE_PAIR, type Atom } from "./ReadingTheFilm";
import { Note } from "./TwoAtoms";

/** Film half-widths kept from the computed films, so the drawn film holds a 7 × 7 grid. */
const CROP = 0.66;

type Dot = { u: number; v: number; s: number };

const [PANEL_A, PANEL_B] = MOLECULE_PAIR.panels;
const crop = (spots: { X: number; Y: number; s: number }[]): Dot[] =>
  spots.filter(({ X, Y }) => Math.abs(X) < CROP && Math.abs(Y) < CROP).map(({ X, Y, s }) => ({ u: X / 0.7, v: Y / 0.7, s }));
const SPOTS_A = crop(PANEL_A.spots);
const SPOTS_B = crop(PANEL_B.spots);
const MAX = Math.max(...SPOTS_A.map((d) => d.s), ...SPOTS_B.map((d) => d.s));
const shade = (s: number) => 0.1 + 0.9 * Math.sqrt(s / MAX);

/** The spot that is darkest in the first film relative to the second. */
const RING = SPOTS_A.reduce((best, d, i) => (shade(d.s) - shade(SPOTS_B[i].s) > shade(best.a.s) - shade(SPOTS_B[best.i].s) ? { a: d, i } : best), {
  a: SPOTS_A[0],
  i: 0,
});

const RAY_TARGETS = [
  { u: -0.55, v: -0.55 },
  { u: 0.3, v: -0.85 },
  { u: 0.85, v: 0.0 },
  { u: 0.55, v: 0.55 },
  { u: -0.3, v: 0.85 },
];
const RAYS = RAY_TARGETS.map((t) =>
  SPOTS_A.reduce((a, b) => (Math.hypot(b.u - t.u, b.v - t.v) < Math.hypot(a.u - t.u, a.v - t.v) ? b : a)),
);

function FilmFace({ x, y, size, dots, dark, ring }: { x: number; y: number; size: number; dots: Dot[]; dark?: boolean; ring?: Dot }) {
  const at = (d: { u: number; v: number }) => [x + ((1 + d.u) * size) / 2, y + ((1 + d.v) * size) / 2];
  const r = size / 36;
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={XR.film} />
      <g fill={XR.sum}>
        {dots.map((d) => {
          const [cx, cy] = at(d);
          return <circle key={`${d.u}-${d.v}`} cx={cx} cy={cy} r={r} fillOpacity={dark ? 0.6 : shade(d.s)} />;
        })}
      </g>
      {ring && <circle cx={at(ring)[0]} cy={at(ring)[1]} r={r + 4} fill="none" stroke={XR.accent} strokeWidth={1.5} />}
      <circle cx={x + size / 2} cy={y + size / 2} r={Math.max(4, size / 28)} fill={XR.label} />
      <rect x={x} y={y} width={size} height={size} fill="none" stroke={XR.atom} strokeWidth={0.75} />
    </g>
  );
}

function MoleculeDots({ cx, cy, size, atoms, r }: { cx: number; cy: number; size: number; atoms: Atom[]; r: number }) {
  return (
    <g fill={XR.moleculeEdge}>
      {atoms.map((a, i) => (
        <circle key={i} cx={cx + (a.x - 0.5) * size} cy={cy + (a.y - 0.5) * size} r={r} />
      ))}
    </g>
  );
}

/** A 3 × 3 × 3 block of cells in oblique view: front face square, depth running up and to the right. */
function Block({ x, y, cell, atoms }: { x: number; y: number; cell: number; atoms: Atom[] }) {
  const n = 3;
  const side = n * cell;
  const dx = 0.42 * cell;
  const dy = -0.3 * cell;
  const P = (i: number, j: number, k: number) => `${x + i * cell + k * dx},${y + j * cell + k * dy}`;
  const lines: string[] = [];
  for (let t = 0; t <= n; t++) {
    lines.push(`M${P(t, 0, 0)} L${P(t, 0, n)}`, `M${P(0, 0, t)} L${P(n, 0, t)}`);
    lines.push(`M${P(n, t, 0)} L${P(n, t, n)}`, `M${P(n, 0, t)} L${P(n, n, t)}`);
    lines.push(`M${P(t, 0, 0)} L${P(t, n, 0)}`, `M${P(0, t, 0)} L${P(n, t, 0)}`);
  }
  return (
    <g>
      <polygon points={`${P(0, 0, 0)} ${P(n, 0, 0)} ${P(n, 0, n)} ${P(0, 0, n)}`} fill={XR.filmGrey} />
      <polygon points={`${P(n, 0, 0)} ${P(n, n, 0)} ${P(n, n, n)} ${P(n, 0, n)}`} fill={XR.rule} />
      <rect x={x} y={y} width={side} height={side} fill={XR.film} />
      {Array.from({ length: n * n }, (_, c) => (
        <MoleculeDots
          key={c}
          cx={x + ((c % n) + 0.5) * cell}
          cy={y + (Math.floor(c / n) + 0.5) * cell}
          size={cell}
          atoms={atoms}
          r={Math.max(0.9, cell / 22)}
        />
      ))}
      <path d={lines.join(" ")} fill="none" stroke={XR.atom} strokeWidth={0.75} />
    </g>
  );
}

function WherePanel({ W }: { W: number }) {
  const text = W < 360 ? 10 : 11;
  const film = Math.min(124, W * 0.38);
  const filmX = W - film - 2;
  const top = 6;
  const cell = Math.min(20, W / 16);
  const side = 3 * cell;
  const mid = top + film / 2;
  const bx = 52;
  const by = mid - side / 2 + 0.3 * cell;
  const ox = bx + side + 1.5 * 0.42 * cell;
  const oy = by + side / 2 - 1.5 * 0.3 * cell;
  const at = (d: Dot) => [filmX + ((1 + d.u) * film) / 2, top + ((1 + d.v) * film) / 2];
  const H = top + film + 22;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" aria-hidden>
      <BeamArrow x0={2} x1={bx - 3} y={by + side / 2} />
      <Block x={bx} y={by} cell={cell} atoms={PANEL_A.atoms} />
      <FilmFace x={filmX} y={top} size={film} dots={SPOTS_A} dark />
      <g stroke={XR.first} strokeWidth={1} strokeOpacity={0.75}>
        {RAYS.map((d) => {
          const [px, py] = at(d);
          return <line key={`${d.u}-${d.v}`} x1={ox} y1={oy} x2={px} y2={py} />;
        })}
      </g>
      <Labels size={text}>
        <text x={2} y={by + side / 2 - 10}>x-rays</text>
        <text x={bx + side / 2 + 0.2 * cell} y={H - 4} textAnchor="middle">
          crystal
        </text>
        <text x={filmX + film / 2} y={H - 4} textAnchor="middle">
          film
        </text>
      </Labels>
    </svg>
  );
}

function DarknessPanel({ W }: { W: number }) {
  const text = W < 360 ? 10 : 11;
  const gap = 14;
  const film = Math.min(150, (W - gap) / 2);
  const x0 = (W - (2 * film + gap)) / 2;
  const glyph = 46;
  const top = glyph + 8;
  const H = top + film + 22;
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" aria-hidden>
      {[PANEL_A, PANEL_B].map((p, i) => {
        const x = x0 + i * (film + gap);
        return (
          <g key={p.label}>
            <rect x={x + film / 2 - glyph / 2} y={2} width={glyph} height={glyph} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
            <MoleculeDots cx={x + film / 2} cy={2 + glyph / 2} size={glyph} atoms={p.atoms} r={2.2} />
            <FilmFace x={x} y={top} size={film} dots={i ? SPOTS_B : SPOTS_A} ring={RING.a} />
            <Labels size={text}>
              <text x={x + film / 2} y={H - 4} textAnchor="middle">
                {p.label}
              </text>
            </Labels>
          </g>
        );
      })}
    </svg>
  );
}

export function WhereAndHowDark() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const wide = W >= 560;
  const colW = wide ? (W - 32) / 2 : W;
  return (
    <div ref={ref} role="img" aria-labelledby={`${ids}d`} className={wide ? "grid grid-cols-2 gap-8" : "flex flex-col gap-8"}>
      <p id={`${ids}d`} className="sr-only">
        X-rays pass through a crystal of identical boxes and leave a grid of spots on the film. Two crystals of the
        same boxes holding different molecules leave spots in the same places, but each spot darker in one and fainter
        in the other.
      </p>
      <div>
        <Note title="Where the spots fall">
          The copies’ waves line up only in certain directions, and each of those directions makes a spot.
        </Note>
        <div className="mt-3">
          <WherePanel W={colW} />
        </div>
      </div>
      <div>
        <Note title="How dark they are">
          Fill the same crystal with a different molecule: the spots stay where they are, but each comes out darker or
          fainter.
        </Note>
        <div className="mt-3">
          <DarknessPanel W={colW} />
        </div>
      </div>
    </div>
  );
}
