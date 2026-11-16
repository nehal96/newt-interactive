// A column of unit cells, one point on the film, and the waves that arrive there.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { WaveArrow } from "./scene";
import { Mol } from "./UnitCell";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

const N = 6;
const CELL = 30;
const CELL_W = 36;
// Drawn wavelength, in the same pixels as CELL: spots fall where CELL·sinθ is a multiple of it.
const LAMBDA = 15;
const GAP = 130;
const REACH = 92;
const SNAP = 0.06;

/** Extra path between neighbouring cells, in wavelengths, for a film point `y` from the centre. */
const extraAt = (y: number) => (CELL * y) / Math.hypot(GAP, y) / LAMBDA;
const yAt = (e: number) => {
  const s = (e * LAMBDA) / CELL;
  return (GAP * s) / Math.sqrt(1 - s * s);
};

/** Brightness of N waves, each `e` wavelengths behind the last, on a 0–1 scale. */
function brightness(e: number) {
  const half = Math.PI * e;
  const den = Math.sin(half);
  if (Math.abs(den) < 1e-6) return 1;
  return (Math.sin(N * half) / den / N) ** 2;
}

function extraLabel(e: number) {
  const a = Math.abs(e);
  const m = Math.round(a);
  if (Math.abs(a - m) > SNAP) return `${a.toFixed(1)} wavelength`;
  if (m === 0) return "none";
  return m === 1 ? "1 wavelength" : `${m} wavelengths`;
}

export function Directions() {
  const ids = useId().replace(/:/g, "");
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [y, setY] = useState(() => -yAt(1));
  const [dragging, setDragging] = useState(false);
  const touched = useRef(false);
  const raf = useRef(0);

  // Drifts off the spot and back once, so the cancelling shows without a touch.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = -yAt(1);
    const to = -yAt(0.5);
    const out = 1000;
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
            setY(from);
            return;
          }
          if (t >= out + hold) k = 1 - ease((t - out - hold) / out);
          else if (t >= out) k = 1;
          else if (t > 0) k = ease(t / out);
          setY(from + (to - from) * k);
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

  const geoW = 62 + CELL_W + GAP + 12;
  const geoX = stacked ? Math.max(0, (W - geoW) / 2) : 0;
  const top = 28;
  const cy = top + REACH + 4;
  const geoH = cy + REACH + 26;

  const colX = geoX + 62;
  const rayX = colX + CELL_W;
  const filmX = rayX + GAP;
  const cellY = (k: number) => cy + (k - (N - 1) / 2) * CELL;

  const e = extraAt(y);
  const py = cy + y;
  const inStep = Math.abs(Math.abs(e) - Math.round(Math.abs(e))) <= SNAP;

  // The neighbour that travels farther is the one on the far side from the point.
  const far = y < 0 ? 3 : 2;
  const near = y < 0 ? 2 : 3;
  const dx = filmX - rayX;
  const dy = py - cellY(far);
  const len = Math.hypot(dx, dy);
  const seg = Math.abs(e) * LAMBDA;
  const sx = rayX + (dx / len) * seg;
  const sy = cellY(far) + (dy / len) * seg;

  const wx = stacked ? 0 : geoW + 40;
  const wW = W - wx;
  const wTop = stacked ? geoH + 22 : cy - 70;
  const lam = wW / 3;
  const amp = 13;
  const rowAll = wTop + 30;
  const rowSum = rowAll + 86;
  const H = stacked ? rowSum + 40 : geoH;

  const wave = (k: number) => (t: number) =>
    amp * Math.cos(TAU * (t / lam - 0.25 - (k - (N - 1) / 2) * e));
  const waves = Array.from({ length: N }, (_, k) => wave(k));
  const sum = (t: number) => (waves.reduce((s, f) => s + f(t), 0) / N) * 2.3;

  const stops = Array.from({ length: 61 }, (_, i) => {
    const fy = -REACH + (i / 60) * 2 * REACH;
    return { off: i / 60, o: 0.85 * brightness(extraAt(fy)) ** 0.8 };
  });

  const take = () => {
    touched.current = true;
    cancelAnimationFrame(raf.current);
  };
  const moveTo = (ev: PointerEvent<SVGRectElement>) => {
    const box = ev.currentTarget.ownerSVGElement!.getBoundingClientRect();
    setY(clamp(ev.clientY - box.top - cy, -REACH, REACH));
  };
  const onDown = (ev: PointerEvent<SVGRectElement>) => {
    take();
    ev.currentTarget.setPointerCapture(ev.pointerId);
    setDragging(true);
    moveTo(ev);
  };
  const onMove = (ev: PointerEvent<SVGRectElement>) => {
    if (ev.currentTarget.hasPointerCapture(ev.pointerId)) moveTo(ev);
  };
  const onUp = () => {
    setDragging(false);
    setY((v) => {
      const ex = extraAt(v);
      const m = Math.round(ex);
      return Math.abs(ex - m) <= SNAP ? yAt(m) : v;
    });
  };

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
        <title id={`${ids}t`}>Why a crystal only makes spots in some directions</title>
        <desc id={`${ids}d`}>
          X-rays strike a column of six unit cells. A line runs from each cell
          to one point on the film. Each cell’s wave travels{" "}
          {Math.abs(e).toFixed(1)} wavelengths farther than its neighbor’s, so
          the six waves arrive {inStep ? "in step and add up to a dark spot" : "out of step and mostly cancel"}.
        </desc>
        <defs>
          <linearGradient id={`${ids}film`} x1="0" x2="0" y1="0" y2="1">
            {stops.map((s) => (
              <stop key={s.off} offset={s.off} stopColor={XR.ink} stopOpacity={s.o} />
            ))}
          </linearGradient>
        </defs>

        <WaveArrow x0={geoX} x1={colX - 6} y={cy} />

        <g stroke={XR.first} strokeWidth={1} strokeOpacity={0.45}>
          {Array.from({ length: N }, (_, k) => (
            <line key={k} x1={rayX} y1={cellY(k)} x2={filmX} y2={py} />
          ))}
        </g>

        <g stroke={XR.guide} fill={XR.paper}>
          {Array.from({ length: N }, (_, k) => (
            <rect key={k} x={colX} y={cellY(k) - CELL / 2} width={CELL_W} height={CELL} />
          ))}
        </g>
        {Array.from({ length: N }, (_, k) => (
          <Mol key={k} cx={colX + CELL_W / 2} cy={cellY(k)} scale={0.4} />
        ))}

        {seg > 0.75 && (
          <g>
            <line
              x1={rayX}
              y1={cellY(near)}
              x2={sx}
              y2={sy}
              stroke={XR.label}
              strokeWidth={0.75}
              strokeDasharray="2 2"
            />
            <line
              x1={rayX}
              y1={cellY(far)}
              x2={sx}
              y2={sy}
              stroke={XR.accent}
              strokeWidth={3}
              strokeLinecap="round"
            />
          </g>
        )}

        <rect
          x={filmX}
          y={cy - REACH}
          width={12}
          height={2 * REACH}
          fill={XR.film}
          stroke={XR.guide}
        />
        <rect
          x={filmX}
          y={cy - REACH}
          width={12}
          height={2 * REACH}
          fill={`url(#${ids}film)`}
        />
        <path
          d={`M${filmX + 15} ${py}l${dragging ? 11 : 9} -6v12z`}
          fill={XR.accent}
          stroke={XR.accent}
          strokeLinejoin="round"
        />

        <g className="font-mono" fontSize={text} fill={XR.label}>
          <text x={geoX} y={12} fill={XR.accent}>
            extra distance: {extraLabel(e)}
          </text>
          <text x={colX + CELL_W / 2} y={geoH - 4} textAnchor="middle">
            crystal
          </text>
          <text x={filmX + 6} y={geoH - 4} textAnchor="middle">
            film
          </text>
          <text x={wx} y={rowAll - amp - 10}>
            six waves arriving: {inStep ? "in step" : "out of step"}
          </text>
          <text x={wx} y={rowSum - 30 - 14} fill={XR.ink}>
            sum
          </text>
        </g>

        <g stroke={XR.rule}>
          <line x1={wx} x2={wx + wW} y1={rowAll} y2={rowAll} />
          <line x1={wx} x2={wx + wW} y1={rowSum} y2={rowSum} />
        </g>
        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          {waves.map((f, k) => (
            <path
              key={k}
              d={curvePath(wx, rowAll, wW, f, 1.5)}
              stroke={XR.first}
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          ))}
          <path d={curvePath(wx, rowSum, wW, sum, 1.5)} stroke={XR.ink} strokeWidth={2.5} />
        </g>

        <rect
          x={filmX - 22}
          y={cy - REACH - 8}
          width={56}
          height={2 * REACH + 16}
          fill="transparent"
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      </svg>

      <input
        type="range"
        className="sr-only"
        aria-label="Move the point along the film"
        min={-REACH}
        max={REACH}
        step={2}
        value={Math.round(y)}
        onChange={(ev) => {
          take();
          setY(Number(ev.target.value));
        }}
      />
    </div>
  );
}
