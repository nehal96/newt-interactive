// One copy of a molecule lights the whole film faintly; copies at random blur it; a crystal shows it only at the spots.
import { useEffect, useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { Tabs, TabsList, TabsTrigger } from "@ui/controls";
import { XR } from "./palette";
import { Labels } from "./scene";
import { EDGE_TAN, LAMBDA, MOLECULE_PAIR, type Atom } from "./ReadingTheFilm";

type Mode = "one" | "jumbled" | "crystal";
const MODES: { value: Mode; label: string }[] = [
  { value: "one", label: "one copy" },
  { value: "jumbled", label: "jumbled" },
  { value: "crystal", label: "in a crystal" },
];

const SIDE = 5;
const COPIES = SIDE * SIDE;
const RES = 160;
const CELL = MOLECULE_PAIR.panels[0].box;

function intensity(atoms: Atom[], h: number, k: number) {
  let re = 0;
  let im = 0;
  for (const { x, y, f } of atoms) {
    const p = 2 * Math.PI * (h * x + k * y);
    re += f * Math.cos(p);
    im += f * Math.sin(p);
  }
  return re * re + im * im;
}

/** Film point (X, Y), in units of the film's half-width, as a fractional spot index (h, k); the inverse of `onFilm`. */
function hkAt(X: number, Y: number): [number, number] {
  const tx = X * EDGE_TAN;
  const ty = Y * EDGE_TAN;
  const r = Math.hypot(tx, ty, 1);
  return [((tx / r) * CELL) / LAMBDA, ((ty / r) * CELL) / LAMBDA];
}

/** One copy's intensity averaged over every in-plane turn, as a function of distance from the centre in (h, k). */
function turnedAverage(atoms: Atom[]) {
  const reach = Math.hypot(...hkAt(1, 1));
  const steps = 300;
  const table = Array.from({ length: steps + 1 }, (_, i) => {
    const rho = (reach * i) / steps;
    let sum = 0;
    for (let a = 0; a < 180; a++) {
      const t = (Math.PI * a) / 180;
      sum += intensity(atoms, rho * Math.cos(t), rho * Math.sin(t));
    }
    return sum / 180;
  });
  return (h: number, k: number) => table[Math.min(steps, Math.round((Math.hypot(h, k) / reach) * steps))];
}

const ink = [0x1a, 0x18, 0x25];
const paper = [0xfb, 0xfa, 0xf7];

/** Film darkness for intensity `v`, on the scale where the darkest spot is black. */
const shade = (v: number, max: number) => Math.sqrt(Math.min(1, v / max));

/** A film image of `at` over the face-on film, darkened on the same scale as the spots. */
function filmImage(at: (h: number, k: number) => number, max: number) {
  const canvas = document.createElement("canvas");
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(RES, RES);
  for (let p = 0; p < RES * RES; p++) {
    const X = (((p % RES) + 0.5) / RES) * 2 - 1;
    const Y = ((Math.floor(p / RES) + 0.5) / RES) * 2 - 1;
    const o = shade(at(...hkAt(X, Y)), max);
    for (let c = 0; c < 3; c++) img.data[4 * p + c] = Math.round(paper[c] + (ink[c] - paper[c]) * o);
    img.data[4 * p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

/** A fixed scatter of positions (jittered grid, fractions of the panel) and turns, so server and client agree. */
const SCATTER = (() => {
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return Array.from({ length: COPIES }, (_, n) => ({
    x: ((n % SIDE) + 0.2 + 0.6 * rand()) / SIDE,
    y: (Math.floor(n / SIDE) + 0.2 + 0.6 * rand()) / SIDE,
    turn: 360 * rand(),
  }));
})();

function Copies({ x, y, size, atoms, mode }: { x: number; y: number; size: number; atoms: Atom[]; mode: Mode }) {
  const one = mode === "one";
  const cell = one ? size * 0.5 : size / SIDE;
  const r = one ? 3 : 1.3;
  const places =
    mode === "one"
      ? [{ x: 0.5, y: 0.5, turn: 0 }]
      : mode === "jumbled"
        ? SCATTER
        : Array.from({ length: COPIES }, (_, n) => ({ x: ((n % SIDE) + 0.5) / SIDE, y: (Math.floor(n / SIDE) + 0.5) / SIDE, turn: 0 }));
  return (
    <g>
      {mode === "crystal" && (
        <g stroke={XR.rule} strokeWidth={0.75}>
          {Array.from({ length: SIDE + 1 }, (_, i) => (
            <g key={i}>
              <line x1={x + i * cell} x2={x + i * cell} y1={y} y2={y + size} />
              <line x1={x} x2={x + size} y1={y + i * cell} y2={y + i * cell} />
            </g>
          ))}
        </g>
      )}
      {one && (
        <rect
          x={x + (size - cell) / 2}
          y={y + (size - cell) / 2}
          width={cell}
          height={cell}
          fill="none"
          stroke={XR.atom}
          strokeWidth={0.75}
          strokeDasharray="3 3"
        />
      )}
      <g fill={XR.moleculeEdge}>
        {places.map((p, n) => (
          <g key={n} transform={`translate(${x + p.x * size} ${y + p.y * size}) rotate(${p.turn})`}>
            {atoms.map((a, i) => (
              <circle key={i} cx={(a.x - 0.5) * cell} cy={(a.y - 0.5) * cell} r={r} />
            ))}
          </g>
        ))}
      </g>
    </g>
  );
}

const NOTE: Record<Mode, string> = {
  one: "in reality far too faint to record",
  jumbled: `${COPIES} copies: ${COPIES}× brighter, still a blur`,
  crystal: `${COPIES} copies in step: each spot ${COPIES * COPIES}× one copy`,
};

export function WhySpots() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [mode, setMode] = useState<Mode>("one");
  const [images, setImages] = useState<Record<"one" | "jumbled", string>[] | null>(null);
  useEffect(() => {
    setImages(
      MOLECULE_PAIR.panels.map((p) => ({
        one: filmImage((h, k) => intensity(p.atoms, h, k), p.max),
        jumbled: filmImage(turnedAverage(p.atoms), p.max),
      })),
    );
  }, []);

  const wide = W >= 600;
  const text = wide ? 11 : 10;
  const gap = 10;
  const pairGap = 28;
  const film = wide ? (W - 2 * gap - pairGap) / 2 / 1.75 : (W - gap) / 1.75;
  const arr = film * 0.75;
  const pairW = arr + gap + film;
  const head = 18;
  const rowH = head + film + 22;
  const H = (wide ? rowH : 2 * rowH + 12) + 18;
  const origin = (i: number) => (wide ? { x: i * (pairW + pairGap), y: 0 } : { x: 0, y: i * (rowH + 12) });

  return (
    <div ref={ref} className="w-full">
      <div className="mb-3 flex flex-wrap items-center gap-3 font-ui text-xs text-ink-500">
        <span>The copies</span>
        <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <TabsList className="h-8 bg-ink-200/60 p-0.5">
            {MODES.map((m) => (
              <TabsTrigger
                key={m.value}
                value={m.value}
                className="px-2.5 py-1 font-ui text-xs text-ink-500 hover:bg-transparent data-[state=active]:bg-paper data-[state=active]:text-ink-900"
              >
                {m.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>A crystal shows each molecule's own pattern, only at the spots</title>
        <desc id={`${ids}d`}>
          Two molecules, each beside the film it makes.{" "}
          {mode === "one"
            ? "One copy of each spreads its own smooth pattern of light and shade over the whole film."
            : mode === "jumbled"
              ? "Copies turned every which way smear each pattern into a blur."
              : "Copies lined up in a crystal leave spots in the same places for both molecules, each spot as dark as that molecule's own pattern at that point."}
        </desc>

        {MOLECULE_PAIR.panels.map((p, i) => {
          const o = origin(i);
          const fx = o.x + arr + gap;
          const fy = o.y + head;
          return (
            <g key={p.label}>
              <Labels size={text}>
                <text x={o.x} y={o.y + 11}>
                  {p.label}
                </text>
              </Labels>
              <Copies x={o.x} y={fy + (film - arr) / 2} size={arr} atoms={p.atoms} mode={mode} />
              <rect x={fx} y={fy} width={film} height={film} fill={XR.film} />
              {mode === "crystal" ? (
                <g fill={XR.sum}>
                  {p.spots.map(({ X, Y, s }) => (
                    <circle
                      key={`${X}-${Y}`}
                      cx={fx + ((1 + X) * film) / 2}
                      cy={fy + ((1 + Y) * film) / 2}
                      r={film / 40}
                      fillOpacity={shade(s, p.max)}
                    />
                  ))}
                </g>
              ) : (
                images && <image href={images[i][mode]} x={fx} y={fy} width={film} height={film} preserveAspectRatio="none" />
              )}
              <circle cx={fx + film / 2} cy={fy + film / 2} r={Math.max(5, film / 30)} fill={XR.label} />
              <rect x={fx} y={fy} width={film} height={film} fill="none" stroke={XR.atom} strokeWidth={0.75} />
            </g>
          );
        })}

        <Labels size={text}>
          <text x={W / 2} y={H - 4} textAnchor="middle" fill={mode === "crystal" ? XR.accent : XR.label}>
            {NOTE[mode]}
          </text>
        </Labels>
      </svg>
    </div>
  );
}
