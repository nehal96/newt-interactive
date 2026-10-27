// Each spot is a set of ripples across the box; added up, each slid into place, they draw the molecule.
import { useEffect, useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";
import { SpotFilm, onFilm } from "./spots";
import { EDGE_TAN, LAMBDA, MOLECULE_PAIR } from "./ReadingTheFilm";
import { Note } from "./TwoAtoms";

export const PANEL = MOLECULE_PAIR.panels[0];
const RES = 96;

type Wave = { h: number; k: number; amp: number; phase: number; X: number; Y: number };

/** Every spot on the film, one of each pair across the centre (the pair gives the same ripples), strongest first. */
export const WAVES: Wave[] = (() => {
  const out: Wave[] = [];
  const reach = Math.ceil(PANEL.box / LAMBDA);
  for (let h = 0; h <= reach; h++)
    for (let k = -reach; k <= reach; k++) {
      if (h === 0 && k <= 0) continue;
      const at = onFilm((LAMBDA * h) / PANEL.box, (LAMBDA * k) / PANEL.box, EDGE_TAN);
      if (!at) continue;
      let re = 0;
      let im = 0;
      for (const { x, y, f } of PANEL.atoms) {
        re += f * Math.cos(2 * Math.PI * (h * x + k * y));
        im += f * Math.sin(2 * Math.PI * (h * x + k * y));
      }
      out.push({ h, k, amp: Math.hypot(re, im), phase: Math.atan2(im, re), X: at[0], Y: at[1] });
    }
  return out.sort((a, b) => b.amp - a.amp);
})();
const MAX_AMP = WAVES[0].amp;

const find = (h: number, k: number) => WAVES.find((w) => w.h === h && w.k === k)!;
/** One spot to the right, one straight below, one far out, so their ripples differ in direction and fineness. */
const EXAMPLES: Wave[] = [
  find(2, 0),
  find(0, 2),
  WAVES.filter((w) => w.h >= 3 && w.k > 0).reduce((a, b) => (b.amp > a.amp ? b : a)),
];

/** The same strengths, slid to a fixed but arbitrary set of wrong places. */
export const WRONG: Wave[] = (() => {
  let seed = 5;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  return WAVES.map((w) => ({ ...w, phase: 2 * Math.PI * rand() }));
})();

const SUMS = [1, 3, 10, WAVES.length];

/** Density at fractional (x, y) in the box: each spot's ripples, at its strength, slid by its phase. */
export const density = (waves: Wave[], x: number, y: number) =>
  waves.reduce((sum, w) => sum + w.amp * Math.cos(2 * Math.PI * (w.h * x + w.k * y) - w.phase), 0);

export function image(value: (x: number, y: number) => number, color: [number, number, number], signed: boolean) {
  const vals = new Float32Array(RES * RES);
  let max = 0;
  for (let j = 0; j < RES; j++)
    for (let i = 0; i < RES; i++) {
      const v = value((i + 0.5) / RES, (j + 0.5) / RES);
      vals[j * RES + i] = v;
      max = Math.max(max, Math.abs(v));
    }
  const canvas = document.createElement("canvas");
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(RES, RES);
  const paper = [0xfb, 0xfa, 0xf7];
  for (let p = 0; p < vals.length; p++) {
    const o = signed ? (vals[p] / max + 1) / 2 : Math.max(0, vals[p] / max);
    for (let c = 0; c < 3; c++) img.data[4 * p + c] = Math.round(paper[c] + (color[c] - paper[c]) * o);
    img.data[4 * p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL();
}

const BLUE: [number, number, number] = [0x3f, 0x71, 0xd8];
export const INK: [number, number, number] = [0x1a, 0x18, 0x25];

function Square({
  x,
  y,
  size,
  href,
  label,
  atoms,
  text,
  opacity = 1,
}: {
  x: number;
  y: number;
  size: number;
  href?: string;
  label: string;
  atoms?: boolean;
  text: number;
  opacity?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={XR.film} />
      {href && <image href={href} x={x} y={y} width={size} height={size} opacity={opacity} preserveAspectRatio="none" />}
      {atoms && (
        <g fill="none" stroke={XR.accent} strokeWidth={1.25}>
          {PANEL.atoms.map((a, i) => (
            <circle key={i} cx={x + a.x * size} cy={y + a.y * size} r={Math.max(3, size / 26)} />
          ))}
        </g>
      )}
      <rect x={x} y={y} width={size} height={size} fill="none" stroke={XR.atom} strokeWidth={0.75} />
      <Labels size={text}>
        <text x={x + size / 2} y={y + size + 15} textAnchor="middle">
          {label}
        </text>
      </Labels>
    </g>
  );
}

function grid(W: number, n: number, perRow: number, gap: number) {
  const size = (W - (perRow - 1) * gap) / perRow;
  const rows = Math.ceil(n / perRow);
  const rowH = size + 26;
  return {
    size,
    H: rows * rowH,
    at: (i: number) => ({ x: (i % perRow) * (size + gap), y: Math.floor(i / perRow) * rowH }),
  };
}

export function SpotsToPicture() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const text = W < 520 ? 10 : 11;
  const [pics, setPics] = useState<{ ripples: string[]; sums: string[]; wrong: string } | null>(null);
  useEffect(() => {
    setPics({
      ripples: EXAMPLES.map((w) => image((x, y) => density([w], x, y), BLUE, true)),
      sums: SUMS.map((n) => image((x, y) => density(WAVES.slice(0, n), x, y), INK, false)),
      wrong: image((x, y) => density(WRONG, x, y), INK, false),
    });
  }, []);

  const wide = W >= 520;
  const top = grid(W, 4, wide ? 4 : 2, 14);
  const bottom = grid(W, 5, wide ? 5 : 3, 12);

  return (
    <div ref={ref} className="flex flex-col gap-8">
      <div>
        <Note title="1. Each spot is a set of ripples">
          Where a spot sits on the film sets which way its ripples run across the box and how close together they are;
          how dark it is sets how strong they are. Every spot’s ripples cross the whole molecule.
        </Note>
        <svg width={W} height={top.H} viewBox={`0 0 ${W} ${top.H}`} className="mt-3 block" role="img" aria-labelledby={`${ids}a`}>
          <title id={`${ids}a`}>A film with three spots ringed, and each spot&rsquo;s ripples across one box</title>
          <SpotFilm
            x={top.at(0).x}
            y={top.at(0).y}
            size={top.size}
            spots={PANEL.spots}
            max={PANEL.max}
            linear
            marks={EXAMPLES.map((w, i) => ({ X: w.X, Y: w.Y, color: XR.sum, label: String(i + 1) }))}
          />
          <Labels size={text}>
            <text x={top.at(0).x + top.size / 2} y={top.at(0).y + top.size + 15} textAnchor="middle">
              the film
            </text>
          </Labels>
          {EXAMPLES.map((w, i) => (
            <Square
              key={i}
              {...top.at(i + 1)}
              size={top.size}
              href={pics?.ripples[i]}
              opacity={0.25 + 0.75 * (w.amp / MAX_AMP)}
              label={`spot ${i + 1}’s ripples`}
              text={text}
            />
          ))}
        </svg>
      </div>

      <div>
        <Note title="2. Add them, each slid into place">
          Where the ripples pile up, there are atoms. The film records how strong each set is, but not where to slide it,
          and slid to the wrong places the same ripples draw no molecule at all.
        </Note>
        <svg width={W} height={bottom.H} viewBox={`0 0 ${W} ${bottom.H}`} className="mt-3 block" role="img" aria-labelledby={`${ids}b`}>
          <title id={`${ids}b`}>Ripples added up: one, three, ten, then all; the atoms appear. The same ripples slid wrong show none.</title>
          {SUMS.map((n, i) => (
            <Square
              key={n}
              {...bottom.at(i)}
              size={bottom.size}
              href={pics?.sums[i]}
              label={i === SUMS.length - 1 ? `all ${n}, in place` : n === 1 ? "1 spot" : `${n} spots`}
              atoms={i === SUMS.length - 1}
              text={text}
            />
          ))}
          <Square {...bottom.at(4)} size={bottom.size} href={pics?.wrong} label="all, slid wrong" atoms text={text} />
        </svg>
      </div>
    </div>
  );
}
