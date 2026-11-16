// Three atoms and their Patterson map: one peak for each pair, at the arrow between them.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { F, FIXED, HOME, RADII } from "./Darkness";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

type Pt = [number, number];
type Pair = [number, number];

const PAIRS: Pair[] = [
  [0, 1],
  [0, 2],
  [1, 2],
  [1, 0],
  [2, 0],
  [2, 1],
];
// Atoms stay this far inside the cell, so every arrow fits on the map.
const INSET = 0.15;

function Arrow({ from, to, trim0, trim1 }: { from: Pt; to: Pt; trim0: number; trim1: number }) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  if (len < trim0 + trim1 + 8) return null;
  const ux = dx / len;
  const uy = dy / len;
  const x1 = from[0] + ux * trim0;
  const y1 = from[1] + uy * trim0;
  const x2 = to[0] - ux * trim1;
  const y2 = to[1] - uy * trim1;
  return (
    <g stroke={XR.accent} fill={XR.accent} strokeWidth={1.75} strokeLinejoin="round">
      <line x1={x1} y1={y1} x2={x2 - ux * 6} y2={y2 - uy * 6} />
      <path
        d={`M${x2} ${y2}L${x2 - ux * 8 - uy * 4} ${y2 - uy * 8 + ux * 4}L${x2 - ux * 8 + uy * 4} ${y2 - uy * 8 - ux * 4}z`}
      />
    </g>
  );
}

export function Patterson() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [atoms, setAtoms] = useState<Pt[]>([HOME, ...FIXED]);
  const [sel, setSel] = useState(0);
  const [held, setHeld] = useState<number | null>(null);
  const touched = useRef(false);

  // Steps through the three pairs once, so each peak gets its arrow.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        [1, 2, 0].forEach((p, n) =>
          timers.push(
            window.setTimeout(() => {
              if (!touched.current) setSel(p);
            }, 1200 * (n + 1)),
          ),
        );
      },
      { threshold: 0.7 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [ref]);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const C = 110;
  const M = Math.ceil(2 * (1 - 2 * INSET) * C) + 18;
  const gap = narrow ? Math.max(12, W - C - M) : 70;
  const top = 8;
  const x0 = Math.max(0, (W - C - gap - M) / 2);
  const cellY = top + (M - C) / 2;
  const mapX = x0 + C + gap;
  const mid: Pt = [mapX + M / 2, top + M / 2];
  const H = top + M + 24;

  const at = (i: number): Pt => [x0 + atoms[i][0] * C, cellY + atoms[i][1] * C];
  const peak = ([i, j]: Pair): Pt => [
    mid[0] + (atoms[j][0] - atoms[i][0]) * C,
    mid[1] + (atoms[j][1] - atoms[i][1]) * C,
  ];
  const [si, sj] = PAIRS[sel];

  const pick = (p: number) => {
    touched.current = true;
    setSel(p);
  };

  const onDown = (i: number) => (ev: PointerEvent<SVGCircleElement>) => {
    touched.current = true;
    ev.currentTarget.setPointerCapture(ev.pointerId);
    setHeld(i);
  };
  const onMove = (i: number) => (ev: PointerEvent<SVGCircleElement>) => {
    if (!ev.currentTarget.hasPointerCapture(ev.pointerId)) return;
    const box = ev.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const next: Pt = [
      clamp((ev.clientX - box.left - x0) / C, INSET, 1 - INSET),
      clamp((ev.clientY - box.top - cellY) / C, INSET, 1 - INSET),
    ];
    setAtoms((prev) => prev.map((p, j) => (j === i ? next : p)));
  };
  const onUp = () => setHeld(null);

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
        <title id={`${ids}t`}>A Patterson map shows pairs of atoms, not atoms</title>
        <desc id={`${ids}d`}>
          On the left, a unit cell with three atoms and an arrow from atom{" "}
          {si + 1} to atom {sj + 1}. On the right, the Patterson map: the same
          arrow drawn from the centre ends on a peak. Each of the six peaks
          marks one pair of atoms, and none sits where an atom is.
        </desc>

        <rect x={x0} y={cellY} width={C} height={C} fill="none" stroke={XR.guide} />
        <Arrow from={at(si)} to={at(sj)} trim0={RADII[si] + 2} trim1={RADII[sj] + 3} />
        {atoms.map((_, j) => {
          const [cx, cy] = at(j);
          return (
            <g key={j}>
              <circle cx={cx} cy={cy} r={RADII[j]} fill={XR.molecule} stroke={XR.moleculeEdge} />
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
              <circle
                cx={cx}
                cy={cy}
                r={16}
                fill="transparent"
                style={{ cursor: held === j ? "grabbing" : "grab", touchAction: "none" }}
                onPointerDown={onDown(j)}
                onPointerMove={onMove(j)}
                onPointerUp={onUp}
                onPointerCancel={onUp}
              />
            </g>
          );
        })}

        <rect x={mapX} y={top} width={M} height={M} fill="none" stroke={XR.guide} />
        <circle cx={mid[0]} cy={mid[1]} r={7} fill="none" stroke={XR.guide} />
        {PAIRS.map((pair, p) => {
          const [px, py] = peak(pair);
          return (
            <circle
              key={p}
              cx={px}
              cy={py}
              r={4 * Math.sqrt(F[pair[0]] * F[pair[1]])}
              fill={XR.ink}
              fillOpacity={p === sel ? 0.85 : 0.3}
            />
          );
        })}
        <Arrow from={mid} to={peak(PAIRS[sel])} trim0={0} trim1={0} />
        {PAIRS.map((pair, p) => {
          const [px, py] = peak(pair);
          return (
            <circle
              key={p}
              cx={px}
              cy={py}
              r={13}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onPointerEnter={() => pick(p)}
              onClick={() => pick(p)}
            />
          );
        })}

        <g className="font-mono" fontSize={text} fill={XR.label} textAnchor="middle">
          <text x={x0 + C / 2} y={cellY + C + 16}>
            unit cell
          </text>
          <text x={mapX + M / 2} y={H - 6}>
            Patterson map
          </text>
        </g>
      </svg>
    </div>
  );
}
