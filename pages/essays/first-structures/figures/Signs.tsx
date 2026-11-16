// The film taken down the molecule's twofold axis, without and with mercury, and the sign each spot's change gives.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, snap } from "./wave";
import { WaveArrow } from "./scene";

type Pt = [number, number];
type P3 = [number, number, number];

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

// One half of the molecule, as fractions of the cell from its centre. The twofold axis runs along z,
// so the other half is the same with x and y negated. The films depend on x and y only.
const HALF: P3[] = [
  [0.207, 0.247, 0.18],
  [0.159, 0.119, -0.12],
  [0.33, -0.081, 0.05],
  [0.078, 0.295, -0.26],
];
const HG: P3 = [0.339, 0.277, -0.02];
// Mercury's scattering beside one light atom's.
const HG_WEIGHT = 2.2;
const ORDERS = [-2, -1, 0, 1, 2];

/** A wave from a pair of points either side of the axis is a plain cosine: only its sign is open. */
const pairWave = ([x, y]: P3, h: number, k: number) => 2 * Math.cos(TAU * (h * x + k * y));

type Spot = { h: number; k: number; plain: number; withHg: number; plus: boolean };

const SPOTS: Spot[] = (() => {
  const raw = ORDERS.flatMap((h) =>
    ORDERS.filter((k) => h !== 0 || k !== 0).map((k) => {
      const protein = HALF.reduce((s, p) => s + pairWave(p, h, k), 0);
      const mercury = HG_WEIGHT * pairWave(HG, h, k);
      return { h, k, protein, mercury };
    }),
  );
  const top = Math.max(...raw.map((s) => Math.abs(s.protein)));
  return raw.map(({ h, k, protein, mercury }) => ({
    h,
    k,
    plain: (protein / top) ** 2,
    withHg: ((protein + mercury) / top) ** 2,
    plus: protein * mercury > 0,
  }));
})();

const shade = (v: number) => snap(0.05 + 0.9 * Math.min(1, v) ** 0.6, 3);

const BALLS: { p: P3; hg: boolean }[] = [1, -1].flatMap((t) => [
  ...HALF.map(([x, y, z]) => ({ p: [t * x, t * y, z] as P3, hg: false })),
  { p: [t * HG[0], t * HG[1], HG[2]] as P3, hg: true },
]);
const CORNERS: P3[] = [-0.5, 0.5].flatMap((x) =>
  [-0.5, 0.5].flatMap((y) => [-0.5, 0.5].map((z) => [x, y, z] as P3)),
);
const EDGES = CORNERS.flatMap((a, i) =>
  CORNERS.slice(i + 1)
    .filter((b) => a.filter((v, n) => v !== b[n]).length === 1)
    .map((b) => [a, b] as [P3, P3]),
);

// Turn about the upright screen axis, then tip toward the viewer. Both zero is looking down the axis.
const REST: Pt = [1.05, -0.3];
const NEAR = 0.3;

function turn([x, y, z]: P3, [yaw, pitch]: Pt): P3 {
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return [x1, y * Math.cos(pitch) - z1 * Math.sin(pitch), y * Math.sin(pitch) + z1 * Math.cos(pitch)];
}

export function Signs() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [view, setView] = useState<Pt>(REST);
  const [dragging, setDragging] = useState(false);
  const at = useRef<Pt>(REST);
  const drag = useRef<{ x: number; y: number; from: Pt } | null>(null);
  const touched = useRef(false);
  const raf = useRef(0);

  const glide = (to: Pt, then?: () => void) => {
    cancelAnimationFrame(raf.current);
    const from = at.current;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 900);
      const k = ease(t);
      at.current = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k];
      setView(at.current);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else then?.();
    };
    raf.current = requestAnimationFrame(tick);
  };

  // Turns to look down the axis and back once, so the end-on view shows without a touch.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => {
          if (touched.current) return;
          glide([0, 0], () => {
            timer = window.setTimeout(() => {
              if (!touched.current) glide(REST);
            }, 1400);
          });
        }, 500);
      },
      { threshold: 0.7 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const narrow = W < 620;
  const text = narrow ? 10 : 11;
  const gap = narrow ? 16 : 26;
  const cols = narrow ? 2 : 4;
  const S = narrow ? Math.min(150, (W - gap) / 2) : 124;
  const V = narrow ? S : 150;
  const widths = narrow ? [S, S, S, S] : [V, S, S, S];
  const total = narrow ? 2 * S + gap : V + 3 * S + 3 * gap;
  const x0 = (W - total) / 2;
  const rowH = V + 28;
  const H = 6 + (4 / cols) * rowH;
  const origin = (n: number): Pt => {
    const col = n % cols;
    const x = x0 + widths.slice(0, col).reduce((a, b) => a + b + gap, 0);
    const y = 6 + Math.floor(n / cols) * rowH + (V - widths[n]) / 2;
    return [x, y];
  };
  const step = S / 6;
  const names = ["unit cell", "plain crystal", "with mercury", "signs"];

  const film = (n: number, value: (s: Spot) => number) => {
    const [x, y] = origin(n);
    return (
      <g>
        <rect x={x} y={y} width={S} height={S} rx={3} fill={XR.film} stroke={XR.guide} />
        <circle cx={x + S / 2} cy={y + S / 2} r={5} fill="none" stroke={XR.guide} />
        {SPOTS.map((s) => (
          <circle
            key={`${s.h} ${s.k}`}
            cx={x + S / 2 + s.h * step}
            cy={y + S / 2 + s.k * step}
            r={5}
            fill={XR.ink}
            fillOpacity={shade(value(s))}
          />
        ))}
      </g>
    );
  };

  const [vx, vy] = origin(0);
  const [sx, sy] = origin(3);
  const cx = vx + V / 2;
  const cy = vy + V / 2;
  const side = V * 0.54;
  const flat = (p: P3): P3 => {
    const [x, y, z] = turn(p, view);
    return [snap(cx + x * side), snap(cy + y * side), snap(z, 4)];
  };
  const balls = BALLS.map((b) => ({ ...b, at: flat(b.p) })).sort((a, b) => a.at[2] - b.at[2]);
  const head = flat([0, 0, 0.78]);
  const tail = flat([0, 0, -0.78]);
  const seen = Math.hypot(head[0] - tail[0], head[1] - tail[1]) / (1.56 * side);
  const endOn = seen < 0.12;
  const angle = snap((Math.atan2(head[1] - tail[1], head[0] - tail[0]) * 180) / Math.PI);

  const onDown = (ev: PointerEvent<SVGRectElement>) => {
    touched.current = true;
    cancelAnimationFrame(raf.current);
    ev.currentTarget.setPointerCapture(ev.pointerId);
    drag.current = { x: ev.clientX, y: ev.clientY, from: at.current };
    setDragging(true);
  };
  const onMove = (ev: PointerEvent<SVGRectElement>) => {
    if (!drag.current) return;
    const { x, y, from } = drag.current;
    at.current = [
      from[0] + (ev.clientX - x) * 0.012,
      Math.max(-1.4, Math.min(1.4, from[1] - (ev.clientY - y) * 0.012)),
    ];
    setView(at.current);
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
    const yaw = Math.atan2(Math.sin(at.current[0]), Math.cos(at.current[0]));
    at.current = [yaw, at.current[1]];
    if (Math.abs(yaw) < NEAR && Math.abs(at.current[1]) < NEAR) glide([0, 0]);
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
        <title id={`${ids}t`}>Reading a sign from each spot</title>
        <desc id={`${ids}d`}>
          First, the molecule in its unit cell: two identical halves either
          side of a dashed symmetry axis, with a mercury atom on each, and the
          x-rays arriving along the axis. Then the film taken from that
          direction, from the plain crystal and from the mercury crystal: the
          spots are in the same places, each darker or fainter. Last, a plus
          where a spot got darker and a minus where it got fainter.
        </desc>

        <g stroke={XR.guide} strokeWidth={1}>
          {EDGES.map(([a, b], i) => {
            const p = flat(a);
            const q = flat(b);
            return <line key={i} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />;
          })}
        </g>
        {endOn ? (
          <ellipse cx={cx} cy={cy} rx={3} ry={5.5} fill={XR.ink} transform={`rotate(-40 ${cx} ${cy})`} />
        ) : (
          <line
            x1={tail[0]}
            y1={tail[1]}
            x2={head[0]}
            y2={head[1]}
            stroke={XR.ink}
            strokeWidth={1.25}
            strokeDasharray="4 3"
          />
        )}
        {balls.map((b, i) => (
          <circle
            key={i}
            cx={b.at[0]}
            cy={b.at[1]}
            r={snap((b.hg ? 5 : 5.5) * (1 + 0.18 * b.at[2]))}
            fill={b.hg ? XR.second : XR.molecule}
            stroke={b.hg ? XR.second : XR.moleculeEdge}
          />
        ))}
        {seen > 0.45 && (
          <g transform={`rotate(${angle} ${tail[0]} ${tail[1]})`} opacity={snap(Math.min(1, (seen - 0.45) * 4))}>
            <WaveArrow x0={tail[0] - 30} x1={tail[0] + 6} y={tail[1]} />
          </g>
        )}
        <rect
          x={vx}
          y={vy}
          width={V}
          height={V}
          fill="transparent"
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />

        {film(1, (s) => s.plain)}
        {film(2, (s) => s.withHg)}

        <rect x={sx} y={sy} width={S} height={S} rx={3} fill="none" stroke={XR.guide} />
        <circle cx={sx + S / 2} cy={sy + S / 2} r={5} fill="none" stroke={XR.guide} />
        <g stroke={XR.ink} strokeWidth={1.75} strokeLinecap="round">
          {SPOTS.map((s) => {
            const px = sx + S / 2 + s.h * step;
            const py = sy + S / 2 + s.k * step;
            return (
              <g key={`${s.h} ${s.k}`}>
                <line x1={px - 4.5} x2={px + 4.5} y1={py} y2={py} />
                {s.plus && <line x1={px} x2={px} y1={py - 4.5} y2={py + 4.5} />}
              </g>
            );
          })}
        </g>

        <g className="font-mono" fontSize={text} fill={XR.label} textAnchor="middle">
          {names.map((name, n) => {
            const [x] = origin(n);
            const y = 6 + Math.floor(n / cols) * rowH + V + 16;
            return (
              <text key={name} x={x + widths[n] / 2} y={y}>
                {n === 0 && endOn ? "looking down the axis" : name}
              </text>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
