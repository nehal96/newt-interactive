// A film with a circle marking the spots used, and the map those spots give: wider circle, finer detail.
import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU } from "./wave";
import { contourPath } from "./contour";
import { ATOMS } from "./Molecule";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

// The cell's edge in the molecule's drawing units, and in ångströms: neighbouring atoms sit 1.5 Å apart.
const CELL = 80;
const CELL_ANGSTROM = 8.3;
const MID = [4.1, 1.8];
const SITES = ATOMS.map(([x, y]) => [0.5 + (x - MID[0]) / CELL, 0.5 + (y - MID[1]) / CELL]);
const REACH = 7;
const MIN = 1.2;
const REST = CELL_ANGSTROM / 6;
const WIDE = CELL_ANGSTROM / 2;

type Spot = { h: number; k: number; amp: number; phase: number; far: number };

const SPOTS: Spot[] = (() => {
  const out: Spot[] = [];
  for (let h = -REACH; h <= REACH; h++)
    for (let k = -REACH; k <= REACH; k++) {
      const far = Math.hypot(h, k);
      if (far === 0 || far > REACH + 0.01) continue;
      let re = 0;
      let im = 0;
      for (const [x, y] of SITES) {
        re += Math.cos(TAU * (h * x + k * y));
        im += Math.sin(TAU * (h * x + k * y));
      }
      // Real atoms are not points, so their waves weaken toward the edge of the film.
      const soft = Math.exp(-(far * far) / 70);
      out.push({ h, k, amp: soft * Math.hypot(re, im), phase: Math.atan2(im, re), far });
    }
  return out.sort((a, b) => a.far - b.far);
})();
const TOP = Math.max(...SPOTS.map((s) => s.amp));

const GRID = 57;
const LEVELS = [0.3, 0.5, 0.7, 0.9];

/** Contours of the map made from the `count` spots nearest the centre. */
function contours(count: number) {
  const map = new Float32Array(GRID * GRID);
  for (const s of SPOTS.slice(0, count))
    for (let j = 0; j < GRID; j++)
      for (let i = 0; i < GRID; i++)
        map[j * GRID + i] +=
          s.amp * Math.cos(TAU * ((s.h * i) / (GRID - 1) + (s.k * j) / (GRID - 1)) - s.phase);
  const peak = map.reduce((a, b) => Math.max(a, b), 0);
  return contourPath(map, GRID, LEVELS.map((l) => l * peak));
}

export function Resolution() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  // Radius of the circle of spots used, in spot spacings from the centre.
  const [reach, setReach] = useState(REST);
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const raf = useRef(0);

  // Widens to the two-ångström circle and back once, so the sharpening shows without a touch.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const out = 1400;
    const hold = 1100;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now() + 600;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = now - t0;
          if (t >= 2 * out + hold) {
            setReach(REST);
            return;
          }
          const k =
            t < 0 ? 0 : t < out ? ease(t / out) : t < out + hold ? 1 : 1 - ease((t - out - hold) / out);
          setReach(REST + (WIDE - REST) * k);
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

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const mid = narrow ? 30 : 110;
  const S = Math.min(156, (W - mid) / 2);
  const top = 8;
  const x0 = (W - 2 * S - mid) / 2;
  const mapX = x0 + S + mid;
  const H = top + S + 24;
  const fx = x0 + S / 2;
  const cy = top + S / 2;
  const step = S / (2 * REACH + 2);
  const g = S / (GRID - 1);

  const count = SPOTS.filter((s) => s.far <= reach + 1e-6).length;
  const path = useMemo(() => contours(count), [count]);
  const angstrom = CELL_ANGSTROM / reach;

  const moveTo = (ev: PointerEvent<SVGRectElement>) => {
    const box = ev.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const far = Math.hypot(ev.clientX - box.left - fx, ev.clientY - box.top - cy) / step;
    setReach(clamp(far, MIN, REACH));
  };
  const onDown = (ev: PointerEvent<SVGRectElement>) => {
    touched.current = true;
    cancelAnimationFrame(raf.current);
    ev.currentTarget.setPointerCapture(ev.pointerId);
    setDragging(true);
    moveTo(ev);
  };
  const onMove = (ev: PointerEvent<SVGRectElement>) => {
    if (ev.currentTarget.hasPointerCapture(ev.pointerId)) moveTo(ev);
  };
  const onUp = () => setDragging(false);

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
        <title id={`${ids}t`}>More spots, finer detail</title>
        <desc id={`${ids}d`}>
          On the left, a film with a circle around the {count} spots nearest
          its centre. On the right, the map made from only those spots, at a
          resolution of {angstrom.toFixed(1)} ångströms.{" "}
          {angstrom > 3.5
            ? "The seven atoms merge into one shape."
            : angstrom > 1.7
              ? "The shape has lobes, but the atoms are not yet separate."
              : "Each of the seven atoms stands apart."}
        </desc>

        <rect x={x0} y={top} width={S} height={S} rx={3} fill={XR.film} stroke={XR.guide} />
        {SPOTS.map((s) => (
          <circle
            key={`${s.h} ${s.k}`}
            cx={fx + s.h * step}
            cy={cy + s.k * step}
            r={narrow ? 2.4 : 3}
            fill={XR.ink}
            fillOpacity={(s.far <= reach + 1e-6 ? 1 : 0.4) * (0.16 + 0.8 * (s.amp / TOP) ** 0.9)}
          />
        ))}
        <circle
          cx={fx}
          cy={cy}
          r={(reach + 0.5) * step}
          fill={XR.accent}
          fillOpacity={0.06}
          stroke={XR.accent}
          strokeWidth={dragging ? 2.25 : 1.75}
        />
        <rect
          x={x0}
          y={top}
          width={S}
          height={S}
          fill="transparent"
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />

        <g stroke={XR.label} fill={XR.label}>
          <line x1={x0 + S + 8} x2={mapX - 14} y1={cy} y2={cy} />
          <path d={`M${mapX - 8} ${cy}l-8 -4v8z`} strokeLinejoin="round" />
        </g>

        <rect x={mapX} y={top} width={S} height={S} fill="none" stroke={XR.guide} />
        {SITES.map(([ax, ay], j) => (
          <circle
            key={j}
            cx={mapX + ax * S}
            cy={top + ay * S}
            r={(7 / CELL) * S}
            fill={XR.molecule}
            fillOpacity={0.4}
            stroke={XR.moleculeEdge}
            strokeDasharray="2 2"
          />
        ))}
        <g transform={`translate(${mapX} ${top}) scale(${g})`}>
          <path
            d={path}
            fill="none"
            stroke={XR.ink}
            strokeWidth={1.1}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g className="font-mono" fontSize={text} fill={XR.label} textAnchor="middle">
          <text x={fx} y={H - 6}>
            {count} spots used
          </text>
          <text x={mapX + S / 2} y={H - 6} fill={XR.ink}>
            map at {angstrom.toFixed(1)} Å
          </text>
        </g>
      </svg>

      <input
        type="range"
        className="sr-only"
        aria-label="Radius of the circle of spots used"
        min={MIN}
        max={REACH}
        step={0.2}
        value={reach}
        onChange={(ev) => {
          touched.current = true;
          cancelAnimationFrame(raf.current);
          setReach(Number(ev.target.value));
        }}
      />
    </div>
  );
}
