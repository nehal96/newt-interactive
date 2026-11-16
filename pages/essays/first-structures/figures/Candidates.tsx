// One heavy atom leaves two candidate phases for the protein's wave; a second heavy atom keeps one.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const frac = (v: number) => v - Math.floor(v);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

const PLAIN = 0.42;
const LO = 0.04;
const HI = 0.46;
const START = 0.17;

// Each heavy atom's wave: its height beside the protein's, and where it sits in turns from mercury's.
const HEAVY = [
  { name: "mercury", title: "With mercury", height: 0.35, at: 0, color: XR.second },
  { name: "2nd atom", title: "With a second heavy atom", height: 0.5, at: 0.36, color: XR.success },
];

/** Darkness of the spot with a heavy atom in, as a multiple of the protein's alone, for a protein wave `a` turns from mercury's. */
const ratio = (n: number, a: number) =>
  1 + HEAVY[n].height ** 2 + 2 * HEAVY[n].height * Math.cos(TAU * (a - HEAVY[n].at));

export function Candidates() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  // The protein's true phase, in turns from mercury's wave; the other candidate is the same amount the other way.
  const [a, setA] = useState(START);
  const [dragging, setDragging] = useState(false);
  // Whether the second heavy atom's verdict has been drawn in: the failing candidate fades.
  const [resolved, setResolved] = useState(false);
  const drag = useRef<{ x0: number; a0: number; lambda: number } | null>(null);
  const touched = useRef(false);
  const raf = useRef(0);

  // Sweeps the angle once, so the two candidates are seen to mirror each other.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setResolved(true);
      return;
    }
    let timer = 0;
    const out = 1000;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        timer = window.setTimeout(() => setResolved(true), 3400);
        const t0 = performance.now() + 500;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = now - t0;
          if (t >= 2 * out + 400) {
            setA(START);
            return;
          }
          const k =
            t < 0 ? 0 : t < out ? ease(t / out) : t < out + 400 ? 1 : 1 - ease((t - out - 400) / out);
          setA(START + 0.14 * k);
          raf.current = requestAnimationFrame(tick);
        };
        raf.current = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(raf.current);
    };
  }, [ref]);

  const stacked = W < 600;
  const text = stacked ? 10 : 11;
  const labelW = stacked ? 52 : 58;
  const dialCol = stacked ? 74 : 112;
  const r = stacked ? 22 : 30;
  const waveW = stacked ? W - labelW - dialCol : (W - labelW - dialCol) / 2;
  const lambda = waveW / 1.7;
  const c0 = lambda * 0.5;
  const amp = 14;

  const top = 22;
  const yH = top + 12;
  const yP = yH + 0.5 * amp + 12 + amp;
  const yS = yP + amp + 18 + 1.5 * amp;
  const ySpot = yS + 1.5 * amp + 22;
  const panelH = ySpot + 38;
  const H = stacked ? 2 * panelH + 8 : panelH;

  const origin = (n: number): [number, number] =>
    stacked ? [labelW, n * (panelH + 8)] : [labelW + n * (waveW + dialCol), 0];

  const cx = labelW + waveW + dialCol / 2;
  const cy = (yH + yS) / 2 + 4;
  const tip = (turns: number): [number, number] => [
    cx + r * Math.sin(turns * TAU),
    cy - r * Math.cos(turns * TAU),
  ];

  const take = () => {
    touched.current = true;
    cancelAnimationFrame(raf.current);
    setResolved(true);
  };
  const onWaveDown = (e: PointerEvent<SVGRectElement>) => {
    take();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x0: e.clientX, a0: a, lambda };
    setDragging(true);
  };
  const onWaveMove = (e: PointerEvent<SVGRectElement>) => {
    if (!drag.current) return;
    setA(clamp(drag.current.a0 + (e.clientX - drag.current.x0) / drag.current.lambda, LO, HI));
  };
  const dialAt = (e: PointerEvent<SVGCircleElement>) => {
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const t = frac(Math.atan2(e.clientX - box.left - cx, -(e.clientY - box.top - cy)) / TAU);
    setA(clamp(t <= 0.5 ? t : 1 - t, LO, HI));
  };
  const onDialDown = (e: PointerEvent<SVGCircleElement>) => {
    take();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dialAt(e);
  };
  const onDialMove = (e: PointerEvent<SVGCircleElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) dialAt(e);
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const cursor = dragging ? "grabbing" : "grab";
  const shade = (v: number) => clamp(PLAIN * v, 0.04, 1);

  const panel = (n: number) => {
    const [px, py] = origin(n);
    const heavy = HEAVY[n];
    const hv = (t: number) =>
      heavy.height * amp * Math.cos((TAU * (t - c0 - heavy.at * lambda)) / lambda);
    const protein = (shift: number) => (t: number) =>
      amp * Math.cos((TAU * (t - c0 - shift * lambda)) / lambda);
    const ahead = protein(a);
    const behind = protein(-a);
    const same = Math.abs(ratio(n, a) - ratio(n, -a)) < 0.02;
    const spots = [ratio(n, a), ratio(n, -a), ratio(n, a)];
    const spotX = (i: number) => px + waveW / 2 + (i - 1) * (stacked ? 68 : 78);
    const labelled = stacked || n === 0;
    const out = n === 1 && resolved;
    const fade = { opacity: out ? 0.2 : 1, transition: "opacity 700ms" };
    return (
      <g key={n} transform={`translate(0 ${py})`}>
        <g stroke={XR.rule}>
          {[yH, yP, yS].map((y) => (
            <line key={y} x1={px} x2={px + waveW} y1={y} y2={y} />
          ))}
        </g>
        <text
          x={px}
          y={top - 8}
          className="font-ui"
          fontSize={text + 1}
          fontWeight={600}
          fill={XR.ink}
        >
          {heavy.title}
        </text>
        {labelled ? (
          <g className="font-mono" fontSize={text}>
            <text x={px - labelW} y={yH + 4} fill={heavy.color}>{heavy.name}</text>
            <text x={px - labelW} y={yP + 4} fill={XR.first}>protein</text>
            <text x={px - labelW} y={yS + 4} fill={XR.ink}>sum</text>
          </g>
        ) : (
          <text
            x={px + waveW}
            y={top - 8}
            textAnchor="end"
            className="font-mono"
            fontSize={text}
            fill={heavy.color}
          >
            {heavy.name}
          </text>
        )}
        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={curvePath(px, yH, waveW, hv, 1)} stroke={heavy.color} strokeWidth={2} />
          <path
            d={curvePath(px, yP, waveW, behind, 1)}
            stroke={XR.first}
            strokeWidth={1.75}
            strokeDasharray="5 4"
            style={fade}
          />
          <path d={curvePath(px, yP, waveW, ahead, 1)} stroke={XR.first} strokeWidth={2} />
          <path
            d={curvePath(px, yS, waveW, (t) => hv(t) + behind(t), 1)}
            stroke={XR.ink}
            strokeWidth={2}
            strokeDasharray="5 4"
            style={fade}
          />
          <path
            d={curvePath(px, yS, waveW, (t) => hv(t) + ahead(t), 1)}
            stroke={XR.ink}
            strokeWidth={2.5}
          />
        </g>
        <rect
          x={px}
          y={yP - amp - 8}
          width={waveW}
          height={2 * amp + 16}
          fill="transparent"
          style={{ cursor, touchAction: "pan-y" }}
          onPointerDown={onWaveDown}
          onPointerMove={onWaveMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />

        {spots.map((v, i) => (
          <circle
            key={i}
            cx={spotX(i)}
            cy={ySpot}
            r={10}
            fill={XR.ink}
            fillOpacity={shade(v)}
            style={i === 1 ? fade : undefined}
          />
        ))}
        {!same && (
          <g
            stroke={XR.accent}
            strokeWidth={2}
            strokeLinecap="round"
            style={{ opacity: out ? 1 : 0, transition: "opacity 700ms" }}
          >
            <line x1={spotX(1) - 13} y1={ySpot - 13} x2={spotX(1) + 13} y2={ySpot + 13} />
            <line x1={spotX(1) - 13} y1={ySpot + 13} x2={spotX(1) + 13} y2={ySpot - 13} />
          </g>
        )}
        <g stroke={XR.ink} strokeWidth={2}>
          <line x1={spotX(0) - 12} x2={spotX(0) + 12} y1={ySpot + 19} y2={ySpot + 19} />
          <line
            x1={spotX(1) - 12}
            x2={spotX(1) + 12}
            y1={ySpot + 19}
            y2={ySpot + 19}
            strokeDasharray="5 4"
          />
        </g>
        <g className="font-mono" fontSize={text - 1} fill={XR.label} textAnchor="middle">
          <text x={spotX(0)} y={ySpot + 32}>solid sum</text>
          <text x={spotX(1)} y={ySpot + 32}>dashed sum</text>
          <text x={spotX(2)} y={ySpot + 26} fill={XR.ink}>the film</text>
        </g>
      </g>
    );
  };

  const hand = (turns: number, dashed: boolean) => {
    const [hx, hy] = tip(turns);
    return (
      <g style={{ opacity: dashed && resolved ? 0.2 : 1, transition: "opacity 700ms" }}>
        <line
          x1={cx}
          y1={cy}
          x2={hx}
          y2={hy}
          stroke={XR.first}
          strokeWidth={1.75}
          strokeDasharray={dashed ? "4 3" : undefined}
        />
        <circle cx={hx} cy={hy} r={3.5} fill={XR.first} />
      </g>
    );
  };

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H + 6}
        viewBox={`0 0 ${W} ${H + 6}`}
        className="block select-none"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>One heavy atom leaves two candidates; a second keeps one</title>
        <desc id={`${ids}d`}>
          Two panels with the same two candidate waves for the protein, one{" "}
          {a.toFixed(2)} of a wavelength ahead of mercury’s wave and one the
          same amount behind. Added to mercury’s wave, both give sums of the
          same height, so both match the spot on the film. Added to a second
          heavy atom’s wave, they give sums of different heights, and only one
          matches the film.
        </desc>

        {panel(0)}
        {panel(1)}

        <g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={XR.guide} />
          {hand(-a, true)}
          {hand(a, false)}
          <circle cx={tip(0)[0]} cy={tip(0)[1]} r={4} fill={XR.second} />
          <circle cx={cx} cy={cy} r={1.75} fill={XR.first} />
          <g className="font-mono" textAnchor="middle" fontSize={text - 1} fill={XR.label}>
            <text x={cx} y={cy - r - 10}>phase</text>
            <text x={cx} y={cy + r + 16}>{resolved ? "one" : "two"}</text>
            <text x={cx} y={cy + r + 28}>{resolved ? "left" : "candidates"}</text>
          </g>
          <circle
            cx={cx}
            cy={cy}
            r={r + 8}
            fill="transparent"
            style={{ cursor, touchAction: "none" }}
            onPointerDown={onDialDown}
            onPointerMove={onDialMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          />
        </g>
      </svg>
    </div>
  );
}
