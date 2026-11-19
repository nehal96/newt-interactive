// Why the film taken down the twofold axis holds only plus or minus waves, and how mercury tells which.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath, snap } from "./wave";
import { WaveArrow } from "./scene";

type Pt = [number, number];
type P3 = [number, number, number];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
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
// The ringed spot. Its waves run left to right, so the wave rows share the flat view's x axis.
const RING_H = 2;
// Inside this range the protein's wave at the ringed spot never comes within half of mercury's of
// zero, where a darker spot would stop meaning "same sign as mercury".
const LO = 0.1;
const HI = 0.4;
// Tallest wave a film shows as fully dark, in single-atom heights.
const TOP = 6;

/** A wave from a pair of points either side of the axis is a plain cosine: only its sign is open. */
const pairWave = ([x, y]: P3, h: number, k: number) => 2 * Math.cos(TAU * (h * x + k * y));

const shade = (wave: number) => snap(0.05 + 0.9 * Math.min(1, (wave / TOP) ** 2) ** 0.6, 3);

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

export function AxisSigns() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [ax, setAx] = useState(HALF[0][0]);
  const [view, setView] = useState<Pt>(REST);
  const [grab, setGrab] = useState<"model" | "atom" | null>(null);
  const [slid, setSlid] = useState(false);
  const at = useRef<Pt>(REST);
  const drag = useRef<{ x: number; y: number; from: Pt } | null>(null);
  const slide = useRef<{ x: number; from: number } | null>(null);
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
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const half: P3[] = [[ax, HALF[0][1], HALF[0][2]], ...HALF.slice(1)];
  const spots = ORDERS.flatMap((h) =>
    ORDERS.filter((k) => h !== 0 || k !== 0).map((k) => ({
      h,
      k,
      protein: half.reduce((s, p) => s + pairWave(p, h, k), 0),
      mercury: HG_WEIGHT * pairWave(HG, h, k),
    })),
  );
  const ring = spots.find((s) => s.h === RING_H && s.k === 0)!;
  const darker = Math.abs(ring.protein + ring.mercury) > Math.abs(ring.protein);
  const word = (v: number) => (v > 0 ? "plus" : "minus");

  const narrow = W < 620;
  const text = narrow ? 10 : 11;
  const head = 18;
  const V = 150;
  const labelW = narrow ? 58 : 66;
  const spotCol = narrow ? 92 : 104;
  const F = narrow ? Math.min(150, W - labelW - spotCol) : 150;
  const blockW = labelW + F + spotCol;
  const between = 36;
  const left = (W - (narrow ? blockW : V + between + blockW)) / 2;
  const mx = narrow ? (W - V) / 2 : left;
  const my = head;
  const bx = narrow ? left : left + V + between;
  const by = narrow ? my + V + 16 + head : head;
  const fx = bx + labelW;

  const u = 6;
  const y1 = by + F + 24;
  const y2 = y1 + 20;
  const y3 = y2 + 32;
  const y4 = y3 + 42;
  const rowEnd = y4 + 3 * u + 20;

  const gap = narrow ? 16 : 26;
  const cols = narrow ? 2 : 4;
  const S = narrow ? Math.min(150, (W - gap) / 2) : 124;
  const filmsX = (W - (cols * S + (cols - 1) * gap)) / 2;
  const filmsY = rowEnd + 14 + head;
  const origin = (n: number): Pt => [
    filmsX + (n % cols) * (S + gap),
    filmsY + Math.floor(n / cols) * (S + head + 12),
  ];
  const step = S / 6;
  const readY = origin(3)[1] + S + 22;
  const H = readY + 8;

  const cx = mx + V / 2;
  const cy = my + V / 2;
  const side = V * 0.54;
  const flat = (p: P3): P3 => {
    const [x, y, z] = turn(p, view);
    return [snap(cx + x * side), snap(cy + y * side), snap(z, 4)];
  };
  const balls = [1, -1]
    .flatMap((t) => [
      ...half.map(([x, y, z], i) => ({ p: [t * x, t * y, z] as P3, hg: false, ringed: i === 0 })),
      { p: [t * HG[0], t * HG[1], HG[2]] as P3, hg: true, ringed: false },
    ])
    .map((b) => ({ ...b, at: flat(b.p) }))
    .sort((a, b) => a.at[2] - b.at[2]);
  const tip = flat([0, 0, 0.78]);
  const tail = flat([0, 0, -0.78]);
  const seen = Math.hypot(tip[0] - tail[0], tip[1] - tail[1]) / (1.56 * side);
  const endOn = seen < 0.12;
  const angle = snap((Math.atan2(tip[1] - tail[1], tip[0] - tail[0]) * 180) / Math.PI);

  const fcx = fx + F / 2;
  const fcy = by + F / 2;
  const onFlat = ([x, y]: P3 | Pt, t = 1): Pt => [snap(fcx + t * x * F), snap(fcy + t * y * F)];
  const atomAt = onFlat(half[0]);
  const twinAt = onFlat(half[0], -1);
  const wave = (xs: number[]) => (t: number) =>
    u * xs.reduce((s, x) => s + Math.cos(TAU * RING_H * (t / F - 0.5 - x)), 0);
  const all = half.flatMap(([x]) => [x, -x]);
  const centre = (xs: number[]) => u * xs.reduce((s, x) => s + Math.cos(TAU * RING_H * x), 0);

  const onModelDown = (ev: PointerEvent<SVGRectElement>) => {
    touched.current = true;
    cancelAnimationFrame(raf.current);
    ev.currentTarget.setPointerCapture(ev.pointerId);
    drag.current = { x: ev.clientX, y: ev.clientY, from: at.current };
    setGrab("model");
  };
  const onModelMove = (ev: PointerEvent<SVGRectElement>) => {
    if (!drag.current) return;
    const { x, y, from } = drag.current;
    at.current = [
      from[0] + (ev.clientX - x) * 0.012,
      clamp(from[1] - (ev.clientY - y) * 0.012, -1.4, 1.4),
    ];
    setView(at.current);
  };
  const onModelUp = () => {
    drag.current = null;
    setGrab(null);
    const yaw = Math.atan2(Math.sin(at.current[0]), Math.cos(at.current[0]));
    at.current = [yaw, at.current[1]];
    if (Math.abs(yaw) < NEAR && Math.abs(at.current[1]) < NEAR) glide([0, 0]);
  };

  const onAtomDown = (ev: PointerEvent<SVGRectElement>) => {
    ev.currentTarget.setPointerCapture(ev.pointerId);
    slide.current = { x: ev.clientX, from: ax };
    setGrab("atom");
    setSlid(true);
  };
  const onAtomMove = (ev: PointerEvent<SVGRectElement>) => {
    if (!slide.current) return;
    setAx(clamp(slide.current.from + (ev.clientX - slide.current.x) / F, LO, HI));
  };
  const onAtomUp = () => {
    slide.current = null;
    setGrab(null);
  };

  const film = (n: number, value: (s: (typeof spots)[number]) => number) => {
    const [x, y] = origin(n);
    return (
      <g>
        <rect x={x} y={y} width={S} height={S} rx={3} fill={XR.film} stroke={XR.guide} />
        <circle cx={x + S / 2} cy={y + S / 2} r={5} fill="none" stroke={XR.guide} />
        {spots.map((s) => (
          <circle
            key={`${s.h} ${s.k}`}
            cx={snap(x + S / 2 + s.h * step)}
            cy={snap(y + S / 2 + s.k * step)}
            r={5}
            fill={XR.ink}
            fillOpacity={shade(value(s))}
          />
        ))}
      </g>
    );
  };
  const signs = (n: number, value: (s: (typeof spots)[number]) => number, color: string) => {
    const [x, y] = origin(n);
    return (
      <g>
        <rect x={x} y={y} width={S} height={S} rx={3} fill="none" stroke={XR.guide} />
        <circle cx={x + S / 2} cy={y + S / 2} r={5} fill="none" stroke={XR.guide} />
        <g stroke={color} strokeWidth={1.75} strokeLinecap="round">
          {spots.map((s) => {
            const px = snap(x + S / 2 + s.h * step);
            const py = snap(y + S / 2 + s.k * step);
            return (
              <g key={`${s.h} ${s.k}`}>
                <line x1={px - 4.5} x2={px + 4.5} y1={py} y2={py} />
                {value(s) > 0 && <line x1={px} x2={px} y1={py - 4.5} y2={py + 4.5} />}
              </g>
            );
          })}
        </g>
      </g>
    );
  };
  const names = ["plain crystal", "with mercury", "mercury’s sign", "protein’s sign"];

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
          The molecule in its unit cell: two identical halves either side of a
          symmetry axis, with a mercury atom on each. Seen down the axis, every
          atom has a twin on the opposite side of the centre. The waves of one
          atom and its twin are drawn below them; their sum has a{" "}
          {centre([ax, -ax]) > 0 ? "crest" : "trough"} on the axis, and so does
          the whole protein’s wave, which is {word(ring.protein)} at the ringed
          spot. Below are the films of the plain and mercury crystals, the sign
          of mercury’s wave at each spot, and the sign of the protein’s. The
          ringed spot is {darker ? "darker" : "fainter"} with mercury, so the
          protein’s sign there is{" "}
          {darker ? "the same as" : "the opposite of"} mercury’s.
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
            x2={tip[0]}
            y2={tip[1]}
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
            stroke={b.ringed ? XR.accent : b.hg ? XR.second : XR.moleculeEdge}
            strokeWidth={b.ringed ? 1.75 : 1}
          />
        ))}
        {seen > 0.45 && (
          <g transform={`rotate(${angle} ${tail[0]} ${tail[1]})`} opacity={snap(Math.min(1, (seen - 0.45) * 4))}>
            <WaveArrow x0={tail[0] - 30} x1={tail[0] + 6} y={tail[1]} />
          </g>
        )}
        <rect
          x={mx}
          y={my}
          width={V}
          height={V}
          fill="transparent"
          style={{ cursor: grab === "model" ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={onModelDown}
          onPointerMove={onModelMove}
          onPointerUp={onModelUp}
          onPointerCancel={onModelUp}
        />

        <rect x={fx} y={by} width={F} height={F} rx={3} fill="none" stroke={XR.guide} />
        <line
          x1={fcx}
          x2={fcx}
          y1={fcy}
          y2={y4 + 3 * u + 4}
          stroke={XR.label}
          strokeWidth={0.75}
          strokeDasharray="3 3"
        />
        <g stroke={XR.guide} strokeWidth={0.75}>
          {[...half, HG].map((p, i) => {
            const a = onFlat(p);
            const b = onFlat(p, -1);
            return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
          })}
        </g>
        <g stroke={XR.accent} strokeWidth={0.75} strokeDasharray="2 3">
          <line x1={atomAt[0]} x2={atomAt[0]} y1={atomAt[1] + 8} y2={y1 - u - 2} />
          <line x1={twinAt[0]} x2={twinAt[0]} y1={twinAt[1] + 8} y2={y2 - u - 2} />
        </g>
        {[1, -1].map((t) => (
          <g key={t}>
            {half.map((p, i) => {
              const [px, py] = onFlat(p, t);
              return (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r={5.5}
                  fill={XR.molecule}
                  stroke={i === 0 ? XR.accent : XR.moleculeEdge}
                  strokeWidth={i === 0 ? 1.75 : 1}
                />
              );
            })}
            <circle cx={onFlat(HG, t)[0]} cy={onFlat(HG, t)[1]} r={5} fill={XR.second} />
          </g>
        ))}
        <ellipse cx={fcx} cy={fcy} rx={3} ry={5.5} fill={XR.ink} transform={`rotate(-40 ${fcx} ${fcy})`} />
        {!slid && (
          <path
            d={`M${atomAt[0] - 11} ${atomAt[1] - 4}l-4 4l4 4M${atomAt[0] + 11} ${atomAt[1] - 4}l4 4l-4 4`}
            fill="none"
            stroke={XR.accent}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        <g stroke={XR.rule}>
          {[y1, y2, y3, y4].map((y) => (
            <line key={y} x1={fx} x2={fx + F} y1={y} y2={y} />
          ))}
        </g>
        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={curvePath(fx, y1, F, wave([ax]), 1)} stroke={XR.moleculeEdge} strokeWidth={1.75} />
          <path d={curvePath(fx, y2, F, wave([-ax]), 1)} stroke={XR.moleculeEdge} strokeWidth={1.75} />
          <path d={curvePath(fx, y3, F, wave([ax, -ax]), 1)} stroke={XR.ink} strokeWidth={2} />
          <path d={curvePath(fx, y4, F, wave(all), 1)} stroke={XR.first} strokeWidth={2.5} />
        </g>
        <circle cx={fcx} cy={snap(y3 - centre([ax, -ax]))} r={3.5} fill={XR.accent} />
        <circle cx={fcx} cy={snap(y4 - centre(all))} r={3.5} fill={XR.accent} />


        <rect
          x={fx}
          y={by}
          width={F}
          height={F}
          fill="transparent"
          style={{ cursor: "ew-resize", touchAction: "pan-y" }}
          onPointerDown={onAtomDown}
          onPointerMove={onAtomMove}
          onPointerUp={onAtomUp}
          onPointerCancel={onAtomUp}
        />

        {film(0, (s) => s.protein)}
        {film(1, (s) => s.protein + s.mercury)}
        {signs(2, (s) => s.mercury, XR.second)}
        {signs(3, (s) => s.protein, XR.first)}
        {[0, 1, 2, 3].map((n) => {
          const [x, y] = origin(n);
          return (
            <circle
              key={n}
              cx={snap(x + S / 2 + RING_H * step)}
              cy={y + S / 2}
              r={9}
              fill="none"
              stroke={XR.accent}
            />
          );
        })}

        <g className="font-mono" fontSize={text} fill={XR.label}>
          <text x={bx} y={y1 + 4}>atom</text>
          <text x={bx} y={y2 + 4}>its twin</text>
          <text x={bx} y={y3 + 4} fill={XR.ink}>the pair</text>
          {[
            { y: y3, v: centre([ax, -ax]), fill: XR.ink },
            { y: y4, v: centre(all), fill: XR.first },
          ].map(({ y, v, fill }) => (
            <g key={y}>
              <text x={fx + F + 10} y={y - 3}>{v > 0 ? "crest" : "trough"} on axis</text>
              <text x={fx + F + 10} y={y + 11} fill={fill}>= {word(v)}</text>
            </g>
          ))}
          <text x={bx} y={y4 + 4} fill={XR.first}>all pairs</text>
          <g textAnchor="middle">
            <text x={cx} y={my - 7}>{endOn ? "looking down the axis" : "the molecule"}</text>
            <text x={fcx} y={by - 7}>seen down the axis</text>
            <text x={fcx} y={y4 + 3 * u + 16}>axis</text>
            {names.map((name, n) => {
              const [x, y] = origin(n);
              return (
                <text key={name} x={x + S / 2} y={y - 7}>
                  {name}
                </text>
              );
            })}
            <text x={W / 2} y={readY} fill={XR.ink}>
              ringed spot: {darker ? "darker" : "fainter"}, so{" "}
              {darker ? "the same sign as" : "the opposite sign to"} mercury’s, {word(ring.protein)}
            </text>
          </g>
        </g>
      </svg>

      <input
        type="range"
        className="sr-only"
        aria-label="Slide the ringed atom across the unit cell"
        min={LO}
        max={HI}
        step={0.01}
        value={ax}
        onChange={(e) => {
          setSlid(true);
          setAx(Number(e.target.value));
        }}
      />
    </div>
  );
}
