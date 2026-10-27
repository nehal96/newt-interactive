// The two-atom rule taken to a flat layer and to a whole crystal, each drawn beside the film it makes.
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { latticeSpots } from "./spots";
import { oscillationSpots } from "./oscillation";
import { Note } from "./TwoAtoms";

/** Repeat spacing in wavelengths; the film reaches 45° from the beam either way. */
const SPACING = 6;
const EDGE_TAN = 1;
const ON_FILM = 0.97;

type FilmSpot = { u: number; v: number };

const LAYER: FilmSpot[] = latticeSpots(SPACING, 1, EDGE_TAN, () => 1).map(({ X, Y }) => ({ u: X, v: Y }));

/** A cubic crystal turned 19° about the upright axis, held within the half degree a real crystal's slight disorder spans. */
const BLOCK: FilmSpot[] = oscillationSpots({
  cell: { a: SPACING, b: SPACING, c: SPACING, beta: 90 },
  lambda: 1,
  distance: 1,
  dMin: 1 / (2 * Math.sin(Math.atan(EDGE_TAN * Math.SQRT2) / 2)),
  from: 19,
  to: 19.5,
})
  .map(({ y, z }) => ({ u: y / EDGE_TAN, v: -z / EDGE_TAN }))
  .filter(({ u, v }) => Math.abs(u) < ON_FILM && Math.abs(v) < ON_FILM);

/** An upright square facing the beam, seen from the side and a little in front: width `w` across, `h` tall. */
function plane(x: number, y: number, w: number, h: number) {
  const skew = 0.35 * w;
  const at = (u: number, v: number): [number, number] => [x + ((u + 1) / 2) * w, y + skew * (1 - (u + 1) / 2) + ((v + 1) / 2) * h];
  return { at, outline: `M${x} ${y + skew} L${x + w} ${y} L${x + w} ${y + h} L${x} ${y + h + skew} Z`, skew };
}

const GRID = [-1, -0.5, 0, 0.5, 1].map((t) => t * 0.75);

function Scene({ W, spots, layers, rays }: { W: number; spots: FilmSpot[]; layers: number; rays: FilmSpot[] }) {
  const text = W < 360 ? 10 : 11;
  const filmH = Math.min(150, W * 0.46);
  const filmW = filmH * 0.62;
  const filmX = W - filmW - 4;
  const top = 22;
  const film = plane(filmX, top, filmW, filmH);
  const cH = filmH * 0.42;
  const cW = cH * 0.62;
  const depth = cW * 0.45;
  const cX = Math.max(70, filmX * 0.42);
  const mid = top + film.skew / 2 + filmH / 2;
  const cTop = mid - cH / 2 - (0.35 * cW) / 2;
  const slabs = Array.from({ length: layers }, (_, i) => plane(cX + (i - (layers - 1) / 2) * depth, cTop, cW, cH)).reverse();
  const front = plane(cX, cTop, cW, cH);
  const [ox, oy] = front.at(0, 0);
  const H = top + filmH + film.skew + 22;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" aria-hidden>
      <g stroke={XR.first} strokeWidth={2} fill={XR.first}>
        <line x1={4} x2={slabs[slabs.length - 1].at(-1, 0)[0] - 10} y1={oy} y2={oy} />
        <path d={`M${slabs[slabs.length - 1].at(-1, 0)[0] - 4} ${oy} l-10 -5 v10 z`} strokeLinejoin="round" />
      </g>

      {slabs.map((s, i) => (
        <g key={i}>
          <path d={s.outline} fill={XR.card} fillOpacity={0.85} stroke={XR.atom} strokeWidth={0.75} strokeDasharray={layers > 1 ? undefined : "3 3"} />
          <g fill={XR.sum}>
            {GRID.flatMap((u) =>
              GRID.map((v) => {
                const [px, py] = s.at(u, v);
                return <circle key={`${u}-${v}`} cx={px} cy={py} r={1.6} />;
              }),
            )}
          </g>
        </g>
      ))}

      <path d={film.outline} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
      <g stroke={XR.accent} strokeWidth={0.75} strokeOpacity={0.7}>
        {rays.map(({ u, v }) => {
          const [px, py] = film.at(u, v);
          return <line key={`${u}-${v}`} x1={ox} y1={oy} x2={px} y2={py} />;
        })}
      </g>
      <g fill={XR.sum}>
        {spots.map(({ u, v }) => {
          const [px, py] = film.at(u, v);
          return <circle key={`${u}-${v}`} cx={px} cy={py} r={layers > 1 ? 2.6 : 1.9} />;
        })}
      </g>
      <circle cx={film.at(0, 0)[0]} cy={film.at(0, 0)[1]} r={4} fill={XR.label} />

      <Labels size={text}>
        <text x={4} y={oy - 9}>x-rays</text>
        <text x={cX + cW / 2} y={H - 4} textAnchor="middle">
          {layers > 1 ? "crystal" : "flat layer"}
        </text>
        <text x={filmX + filmW / 2} y={H - 4} textAnchor="middle">
          film
        </text>
      </Labels>
    </svg>
  );
}

const nearest = (spots: FilmSpot[], targets: FilmSpot[]) =>
  targets.map((t) => spots.reduce((a, b) => (Math.hypot(b.u - t.u, b.v - t.v) < Math.hypot(a.u - t.u, a.v - t.v) ? b : a)));
const LAYER_RAYS = nearest(LAYER, [
  { u: 0.5, v: -0.6 },
  { u: -0.6, v: 0.1 },
  { u: 0.3, v: 0.6 },
]);

export function CrystalFilms() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const wide = W >= 560;
  const colW = wide ? (W - 28) / 2 : W;
  return (
    <div ref={ref} className={wide ? "grid grid-cols-2 gap-7" : "flex flex-col gap-8"}>
      <div>
        <Note title="2. A flat layer of atoms">
          The waves from every atom arrive in step at only a few points, so the film darkens there and nowhere else.
        </Note>
        <div className="mt-3">
          <Scene W={colW} spots={LAYER} layers={1} rays={LAYER_RAYS} />
        </div>
      </div>
      <div>
        <Note title="3. A real crystal">
          Stacked layers must agree with each other too, so a still crystal lights only a few spots; rocking it brings
          the others through in turn.
        </Note>
        <div className="mt-3">
          <Scene W={colW} spots={BLOCK} layers={4} rays={BLOCK} />
        </div>
      </div>
    </div>
  );
}
