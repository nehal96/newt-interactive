// Three atoms in one unit cell, their waves at one spot, and the film they darken.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

type Pt = [number, number];

// Strength of each atom's wave; the third has twice the electrons.
const F = [1, 1, 2];
const TOTAL = F.reduce((a, b) => a + b, 0);
const RADII = [7, 7, 10];
const FIXED: Pt[] = [
  [0.5, 0.18],
  [0.78, 0.84],
];
const HOME: Pt = [0.22, 0.43];
const AWAY: Pt = [0.46, 0.6];
const SPOT: [number, number] = [1, 1];
const ORDERS = [-2, -1, 0, 1, 2];
// Pixels of wave height per unit of strength.
const UNIT = 6;

const turns = (p: Pt, h: number, k: number) => h * p[0] + k * p[1];

function darkness(atoms: Pt[], h: number, k: number) {
  let re = 0;
  let im = 0;
  atoms.forEach((p, j) => {
    const a = TAU * turns(p, h, k);
    re += F[j] * Math.cos(a);
    im += F[j] * Math.sin(a);
  });
  return (re * re + im * im) / (TOTAL * TOTAL);
}

export function Darkness() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [atom, setAtom] = useState<Pt>(HOME);
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const raf = useRef(0);

  // Drifts the atom away and back once, so the spots change without a touch.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const out = 1100;
    const hold = 900;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now() + 500;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = now - t0;
          let k = 0;
          if (t >= 2 * out + hold) {
            setAtom(HOME);
            return;
          }
          if (t >= out + hold) k = 1 - ease((t - out - hold) / out);
          else if (t >= out) k = 1;
          else if (t > 0) k = ease(t / out);
          setAtom([
            HOME[0] + (AWAY[0] - HOME[0]) * k,
            HOME[1] + (AWAY[1] - HOME[1]) * k,
          ]);
          raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
      },
      { threshold: 0.7 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [ref]);

  const stacked = W < 560;
  const text = stacked ? 10 : 11;
  const S = stacked ? Math.min(124, (W - 24) / 2) : 124;
  const top = 8;
  const gap = 30;

  const cellX = stacked ? (W - 2 * S - 24) / 2 : 0;
  const filmX = stacked ? cellX + S + 24 : W - S;
  const squareH = top + S + 24;

  const wx = stacked ? 0 : S + gap;
  const wW = stacked ? W : W - 2 * S - 2 * gap;
  const wTop = stacked ? squareH + 14 : top;
  const labelW = 30;
  const x0 = wx + labelW;
  const len = wW - labelW;
  const lam = len / 2.5;
  const rows = [wTop + 12, wTop + 34, wTop + 62];
  const rowSum = wTop + 100;
  const H = stacked ? rowSum + TOTAL * UNIT + 26 : squareH;

  const atoms: Pt[] = [atom, ...FIXED];
  const [h, k] = SPOT;
  const wave = (j: number) => (t: number) =>
    F[j] * UNIT * Math.cos(TAU * (t / lam - 0.2 - turns(atoms[j], h, k)));
  const waves = atoms.map((_, j) => wave(j));
  const sum = (t: number) => waves.reduce((s, f) => s + f(t), 0);

  const step = S / 6;
  const spotAt = (i: number, j: number): Pt => [
    filmX + S / 2 + i * step,
    top + S / 2 + j * step,
  ];
  const [markX, markY] = spotAt(h, k);

  const take = () => {
    touched.current = true;
    cancelAnimationFrame(raf.current);
  };
  const moveTo = (ev: PointerEvent<SVGCircleElement>) => {
    const box = ev.currentTarget.ownerSVGElement!.getBoundingClientRect();
    setAtom([
      clamp((ev.clientX - box.left - cellX) / S, 0.1, 0.9),
      clamp((ev.clientY - box.top - top) / S, 0.1, 0.9),
    ]);
  };
  const onDown = (ev: PointerEvent<SVGCircleElement>) => {
    take();
    ev.currentTarget.setPointerCapture(ev.pointerId);
    setDragging(true);
  };
  const onMove = (ev: PointerEvent<SVGCircleElement>) => {
    if (ev.currentTarget.hasPointerCapture(ev.pointerId)) moveTo(ev);
  };
  const onUp = () => setDragging(false);

  const here = darkness(atoms, h, k);

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block select-none"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>What is inside the unit cell sets how dark each spot is</title>
        <desc id={`${ids}d`}>
          One unit cell holds three atoms, the third with twice the electrons.
          Each sends a wave toward one marked spot on the film, shifted by where
          the atom sits. Their sum sets that spot’s darkness, now{" "}
          {Math.round(here * 100)} percent of the darkest possible. Moving an
          atom changes the darkness of every spot but not where the spots are.
        </desc>

        <rect x={cellX} y={top} width={S} height={S} fill="none" stroke={XR.guide} />
        {atoms.map(([ax, ay], j) => {
          const cx = cellX + ax * S;
          const cy = top + ay * S;
          return (
            <g key={j}>
              {j === 0 && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={RADII[j] + (dragging ? 5 : 4)}
                  fill="none"
                  stroke={XR.accent}
                  strokeWidth={1.75}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={RADII[j]}
                fill={XR.molecule}
                stroke={XR.moleculeEdge}
              />
              <text
                x={cx}
                y={cy + 3.5}
                textAnchor="middle"
                className="font-mono"
                fontSize={10}
                fill={XR.ink}
              >
                {j + 1}
              </text>
            </g>
          );
        })}
        <circle
          cx={cellX + atom[0] * S}
          cy={top + atom[1] * S}
          r={20}
          fill="transparent"
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />

        <g stroke={XR.rule}>
          {[...rows, rowSum].map((y) => (
            <line key={y} x1={x0} x2={x0 + len} y1={y} y2={y} />
          ))}
        </g>
        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          {waves.map((f, j) => (
            <path
              key={j}
              d={curvePath(x0, rows[j], len, f, 1.5)}
              stroke={XR.first}
              strokeWidth={j === 0 && dragging ? 2.25 : 1.75}
            />
          ))}
          <path d={curvePath(x0, rowSum, len, sum, 1.5)} stroke={XR.ink} strokeWidth={2.5} />
        </g>
        <g className="font-mono" fontSize={text}>
          {rows.map((y, j) => (
            <text key={y} x={wx} y={y + 4} fill={j === 0 ? XR.accent : XR.label}>
              {j + 1}
            </text>
          ))}
          <text x={wx} y={rowSum + 4} fill={XR.ink}>
            sum
          </text>
        </g>

        <rect
          x={filmX}
          y={top}
          width={S}
          height={S}
          rx={3}
          fill={XR.film}
          stroke={XR.guide}
        />
        {ORDERS.flatMap((i) =>
          ORDERS.map((j) => {
            const [sx, sy] = spotAt(i, j);
            // The straight-through beam, which the beam stop blocks.
            if (i === 0 && j === 0)
              return (
                <circle key="0" cx={sx} cy={sy} r={5} fill="none" stroke={XR.guide} />
              );
            return (
              <circle
                key={`${i} ${j}`}
                cx={sx}
                cy={sy}
                r={5}
                fill={XR.ink}
                fillOpacity={0.04 + 0.9 * darkness(atoms, i, j) ** 0.75}
              />
            );
          }),
        )}
        <circle
          cx={markX}
          cy={markY}
          r={9.5}
          fill="none"
          stroke={XR.accent}
          strokeWidth={1.75}
        />

        <g className="font-mono" fontSize={text} fill={XR.label} textAnchor="middle">
          <text x={cellX + S / 2} y={squareH - 6}>
            one unit cell
          </text>
          <text x={filmX + S / 2} y={squareH - 6}>
            film
          </text>
        </g>
      </svg>

      <input
        type="range"
        className="sr-only"
        aria-label="Move atom 1 across the unit cell"
        min={0.1}
        max={0.9}
        step={0.05}
        value={atom[0]}
        onChange={(ev) => {
          take();
          setAtom([Number(ev.target.value), atom[1]]);
        }}
      />
    </div>
  );
}
