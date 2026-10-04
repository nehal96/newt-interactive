// The row of atoms seen along the beam, a row lying across, the two as a flat grid, and a grid of molecules, each over the film it makes.
import { useEffect, useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import Molecule, { ATOMS } from "./Molecule";
import { Labels } from "./scene";
import { SPACING as ROW_SPACING } from "./RowOfAtoms";

/** Atoms per side; positions are in units of the repeat spacing. */
const N = 5;
const LAMBDA = 1 / ROW_SPACING;
/** tan θ at the film's half-width. */
const EDGE_TAN = 1;
const RES = 140;
/** Pixels under the beam stop, left out when scaling darkness: the straight-through peak would wash out the rest. */
const STOP_PX = 7;
/** The molecule's drawing units per repeat spacing. */
const CELL = 87;

type Pt = [number, number];
type Kind = "across" | "down" | "grid" | "molecules";

const line = (i: number) => i - (N - 1) / 2;
const range = Array.from({ length: N }, (_, i) => line(i));

function atomsOf(kind: Kind): Pt[] {
  if (kind === "across") return range.map((x): Pt => [x, 0]);
  if (kind === "down") return range.map((y): Pt => [0, y]);
  const grid = range.flatMap((y) => range.map((x): Pt => [x, y]));
  if (kind === "grid") return grid;
  return grid.flatMap(([gx, gy]) => ATOMS.map(([ax, ay]): Pt => [gx + ax / CELL, gy + ay / CELL]));
}

/** |Σ e^{iq·r}|² over the film, for a flat film one unit behind the layer. */
function intensity(atoms: Pt[]) {
  const k = (2 * Math.PI) / LAMBDA;
  const out = new Float32Array(RES * RES);
  let max = 0;
  for (let j = 0; j < RES; j++)
    for (let i = 0; i < RES; i++) {
      const X = ((i + 0.5) / RES - 0.5) * 2 * EDGE_TAN;
      const Y = ((j + 0.5) / RES - 0.5) * 2 * EDGE_TAN;
      const r = Math.hypot(X, Y, 1);
      const qx = (k * X) / r;
      const qy = (k * Y) / r;
      let re = 0;
      let im = 0;
      for (const [x, y] of atoms) {
        const p = qx * x + qy * y;
        re += Math.cos(p);
        im += Math.sin(p);
      }
      const v = re * re + im * im;
      out[j * RES + i] = v;
      if (v > max && Math.hypot(i - RES / 2, j - RES / 2) > STOP_PX) max = v;
    }
  return { out, max };
}

const ink = [0x1a, 0x18, 0x25];
const paper = [0xfb, 0xfa, 0xf7];

function filmImage(atoms: Pt[]) {
  const { out, max } = intensity(atoms);
  const canvas = document.createElement("canvas");
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(RES, RES);
  for (let p = 0; p < out.length; p++) {
    const o = Math.min(1, out[p] / max);
    for (let c = 0; c < 3; c++) img.data[4 * p + c] = Math.round(paper[c] + (ink[c] - paper[c]) * o);
    img.data[4 * p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

const PANELS: { kind: Kind; header: string; label: string }[] = [
  { kind: "down", header: "1. The row of atoms", label: "horizontal bands" },
  { kind: "across", header: "2. A row lying across", label: "vertical bands" },
  { kind: "grid", header: "3. Both: a flat grid", label: "spots where bands cross" },
  { kind: "molecules", header: "4. A grid of molecules", label: "same spots, own darkness" },
];

/** Film x for the in-step curve of the row across, order m, at film height Y (both in units of D). */
function bandX(m: number, Y: number) {
  const s = m * LAMBDA;
  return s * Math.sqrt((Y * Y + 1) / (1 - s * s));
}

const SKETCH_W = 226;

/** The row from the ripples figure in perspective: beam, layer, film, with the film's level bands. */
function TurnSketch({ x, y, text }: { x: number; y: number; text: number }) {
  const w = 30;
  const h = 52;
  const skew = 9;
  const layerX = x + 92;
  const filmX = x + SKETCH_W - w;
  const mid = y + h / 2 + skew / 2;
  const at = (x0: number, u: number, v: number): [number, number] => [x0 + u * w, y + skew * (1 - u) + v * h];
  const quad = (x0: number) =>
    `M${x0} ${y + skew} L${x0 + w} ${y} L${x0 + w} ${y + h} L${x0} ${y + h + skew} Z`;
  return (
    <g>
      <g stroke={XR.first} strokeWidth={2} fill={XR.first}>
        <line x1={x} x2={layerX + w / 2} y1={mid} y2={mid} />
      </g>
      <path d={quad(layerX)} fill="none" stroke={XR.atom} strokeWidth={1} strokeDasharray="3 3" />
      <g fill={XR.sum}>
        {range.map((v) => {
          const [px, py] = at(layerX, 0.5, 0.5 + v * 0.17);
          return <circle key={v} cx={px} cy={py} r={2.4} />;
        })}
      </g>
      <g stroke={XR.first} strokeWidth={2} fill={XR.first}>
        <line x1={layerX + w / 2} x2={filmX + w / 2 - 12} y1={mid} y2={mid} />
        <path d={`M${filmX + w / 2 - 4} ${mid} l-9 -5 v10 z`} strokeLinejoin="round" />
      </g>
      <path d={quad(filmX)} fill={XR.film} stroke={XR.atom} strokeWidth={1} />
      <g stroke={XR.sum} strokeWidth={2.5}>
        {[0.2, 0.5, 0.8].map((v) => {
          const [x1, y1] = at(filmX, 0.06, v);
          const [x2, y2] = at(filmX, 0.94, v);
          return <line key={v} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
      <Labels size={text}>
        <text x={x} y={mid - 10}>x-rays</text>
        <text x={layerX + w / 2} y={y + h + skew + 16} textAnchor="middle">
          the row
        </text>
        <text x={filmX + w / 2} y={y + h + skew + 16} textAnchor="middle">
          film
        </text>
      </Labels>
    </g>
  );
}

export function CrystalSpots() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [images, setImages] = useState<Record<Kind, string> | null>(null);

  useEffect(() => {
    setImages(
      Object.fromEntries(PANELS.map(({ kind }) => [kind, filmImage(atomsOf(kind))])) as Record<Kind, string>,
    );
  }, []);

  const wide = W >= 600;
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const gap = wide ? 24 : 16;
  const cols = wide ? 4 : 2;
  const colW = (W - (cols - 1) * gap) / cols;
  const F = Math.round(wide ? colW : colW * 0.72);
  const A = Math.round(wide ? colW * 0.6 : colW * 0.55);
  const sketchH = 112;
  const headH = 22;
  const panelH = headH + A + 16 + F + 22;
  const H = sketchH + (wide ? 1 : 2) * panelH + (wide ? 0 : gap);

  const toFilm = (v: number) => (v / EDGE_TAN) * (F / 2);
  const orders = [-2, -1, 0, 1, 2].filter((m) => Math.abs(bandX(m, 0)) < EDGE_TAN);
  const curve = (m: number, swap: boolean, fx: number, fy: number) => {
    const pts: string[] = [];
    for (let t = -EDGE_TAN; t <= EDGE_TAN + 1e-9; t += EDGE_TAN / 30) {
      const u = bandX(m, t);
      const [x, y] = swap ? [t, u] : [u, t];
      pts.push(`${pts.length ? "L" : "M"}${(fx + F / 2 + toFilm(x)).toFixed(1)} ${(fy + F / 2 + toFilm(y)).toFixed(1)}`);
    }
    return pts.join("");
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
        <title id={`${ids}t`}>How a crystal makes spots</title>
        <desc id={`${ids}d`}>
          A sketch turns the row of atoms from the previous figure to face the reader: the beam
          passes through the upright row to a film with level bands. Below, four flat layers seen
          along the beam, each above the film it makes. The upright row gives level bands; a row
          across gives upright bands; a five-by-five flat grid gives spots only where the two sets
          of bands cross; the same grid with a molecule at each point gives spots in the same
          places, each with its own darkness.
        </desc>
        <clipPath id={`${ids}c`}>
          <rect width={F} height={F} />
        </clipPath>

        <TurnSketch x={(W - SKETCH_W) / 2} y={8} text={text} />

        {PANELS.map(({ kind, header, label }, p) => {
          const col = p % cols;
          const row = Math.floor(p / cols);
          const x0 = col * (colW + gap);
          const y0 = sketchH + row * (panelH + gap);
          const ay = y0 + headH;
          const ax = x0 + (colW - A) / 2;
          const fx = x0 + (colW - F) / 2;
          const pitch = A / N;
          const fy = ay + A + 16;
          const atoms = kind === "molecules" ? [] : atomsOf(kind);
          return (
            <g key={kind}>
              <text
                x={x0}
                y={y0 + 13}
                className="font-ui"
                fontSize={narrow ? 11 : 12}
                fontWeight={600}
                fill={XR.sum}
              >
                {header}
              </text>
              <rect x={ax} y={ay} width={A} height={A} fill="none" stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" />
              {atoms.map(([x, y]) => (
                <circle
                  key={`${x}-${y}`}
                  cx={ax + A / 2 + x * pitch}
                  cy={ay + A / 2 + y * pitch}
                  r={Math.min(4, pitch * 0.22)}
                  fill={XR.sum}
                />
              ))}
              {kind === "molecules" &&
                range.flatMap((gy) =>
                  range.map((gx) => (
                    <Molecule
                      key={`${gx}-${gy}`}
                      x={ax + A / 2 + gx * pitch}
                      y={ay + A / 2 + gy * pitch}
                      scale={pitch / CELL}
                      strokeWidth={0.75}
                    />
                  )),
                )}

              <rect x={fx} y={fy} width={F} height={F} fill={XR.film} />
              {images && (
                <image href={images[kind]} x={fx} y={fy} width={F} height={F} preserveAspectRatio="none" />
              )}
              {kind === "grid" && (
                <g
                  fill="none"
                  stroke={XR.accent}
                  strokeOpacity={0.5}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  clipPath={`url(#${ids}c)`}
                  transform={`translate(${fx} ${fy})`}
                >
                  {orders.map((m) => (
                    <path key={`x${m}`} d={curve(m, false, 0, 0)} />
                  ))}
                  {orders.map((m) => (
                    <path key={`y${m}`} d={curve(m, true, 0, 0)} />
                  ))}
                </g>
              )}
              <circle cx={fx + F / 2} cy={fy + F / 2} r={Math.max(4, F / 30)} fill={XR.label} />
              <rect x={fx} y={fy} width={F} height={F} fill="none" stroke={XR.atom} strokeWidth={0.75} />

              {(p === 1 || (wide && p === 2)) && (
                <text
                  x={x0 - gap / 2}
                  y={fy + F / 2 + 6}
                  textAnchor="middle"
                  className="font-ui"
                  fontSize={18}
                  fill={XR.label}
                >
                  {p === 1 ? "+" : "="}
                </text>
              )}
              <Labels size={text}>
                <text
                  x={wide && col === cols - 1 ? x0 + colW : x0 + colW / 2}
                  y={fy + F + 16}
                  textAnchor={wide && col === cols - 1 ? "end" : "middle"}
                  fill={kind === "grid" ? XR.accent : XR.label}
                >
                  {label}
                </text>
              </Labels>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
