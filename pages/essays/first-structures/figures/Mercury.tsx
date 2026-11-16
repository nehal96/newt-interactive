// Mercury's small known wave added to the protein's, and what that does to one spot.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath, snap } from "./wave";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const frac = (v: number) => v - Math.floor(v);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

const SNAP = 0.04;
// Height of mercury's wave beside the protein's.
const HG = 0.35;
// Opacity of the spot from the protein alone; the mercury spot scales from it.
const PLAIN = 0.42;

function readout(f: number) {
  if (f <= SNAP || f >= 1 - SNAP) return "in step";
  if (Math.abs(f - 0.5) <= SNAP) return "opposed";
  return "in between";
}

/** Darkness of the spot with mercury, as a multiple of the spot without. */
const ratio = (f: number) => 1 + HG * HG + 2 * HG * Math.cos(TAU * f);

export function Mercury() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [d, setD] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x0: number; d0: number } | null>(null);
  const touched = useRef(false);
  const raf = useRef(0);

  // Slides to opposed and back once, so the fainter spot shows without a touch.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const out = 900;
    const hold = 900;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now() + 500;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = now - t0;
          if (t < 0) setD(0);
          else if (t < out) setD(0.5 * ease(t / out));
          else if (t < out + hold) setD(0.5);
          else if (t < 2 * out + hold)
            setD(0.5 * (1 - ease((t - out - hold) / out)));
          else {
            setD(0);
            return;
          }
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
  const labelW = narrow ? 52 : 64;
  const dialCol = narrow ? 66 : 96;
  const spotCol = narrow ? 30 : 128;
  const r = narrow ? 20 : 26;
  const spotR = narrow ? 9 : 11;

  const x0 = labelW;
  const waveW = W - labelW - dialCol - spotCol;
  const lambda = waveW / (narrow ? 2.1 : 3.1);
  const c0 = lambda * 0.3;
  const amp = 15;

  const yHg = 30;
  const yP = yHg + HG * amp + 14 + amp;
  const yS = yP + amp + 22 + (1 + HG) * amp;
  const H = yS + (1 + HG) * amp + 10;

  const f = frac(d);
  const hg = (t: number) => HG * amp * Math.cos((TAU * (t - c0)) / lambda);
  const protein = (t: number) => amp * Math.cos((TAU * (t - c0 - d * lambda)) / lambda);

  const crests = [0, 1, 2].map((i) => x0 + c0 + i * lambda).filter((x) => x < x0 + waveW);
  const markX = crests[0] + f * lambda;

  const cx = x0 + waveW + dialCol / 2 + 2;
  const cy = (yHg + yS) / 2 - 2;
  const theta = f * TAU;
  const hx = cx + r * Math.sin(theta);
  const hy = cy - r * Math.cos(theta);

  const spotX = W - spotCol + spotR + (narrow ? 6 : 10);
  const times = ratio(f);

  const settle = (v: number) => {
    const g = frac(v);
    if (g <= SNAP || g >= 1 - SNAP) return Math.round(v);
    if (Math.abs(g - 0.5) <= SNAP) return Math.floor(v) + 0.5;
    return v;
  };
  const take = () => {
    touched.current = true;
    cancelAnimationFrame(raf.current);
  };

  const onWaveDown = (e: PointerEvent<SVGRectElement>) => {
    take();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x0: e.clientX, d0: d };
    setDragging(true);
  };
  const onWaveMove = (e: PointerEvent<SVGRectElement>) => {
    if (!drag.current) return;
    setD(drag.current.d0 + (e.clientX - drag.current.x0) / lambda);
  };
  const dialAt = (e: PointerEvent<SVGCircleElement>) => {
    const box = e.currentTarget.ownerSVGElement!.getBoundingClientRect();
    const a = Math.atan2(e.clientX - box.left - cx, -(e.clientY - box.top - cy));
    setD(frac(a / TAU));
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
    setD(settle);
  };

  const cursor = dragging ? "grabbing" : "grab";

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
        <title id={`${ids}t`}>What mercury’s wave does to a spot</title>
        <desc id={`${ids}d`}>
          Mercury’s wave is about a third as tall as the protein’s. The
          protein’s wave is {readout(f)} with it, so their sum makes the spot{" "}
          {times.toFixed(1)} times as dark as the protein alone.
        </desc>

        <g stroke={XR.guide} strokeWidth={0.75} strokeDasharray="3 3">
          {crests.map((x) => (
            <line key={x} x1={x} x2={x} y1={yHg - 12} y2={yS + (1 + HG) * amp + 4} />
          ))}
        </g>
        <g stroke={XR.rule}>
          {[yHg, yP, yS].map((y) => (
            <line key={y} x1={x0} x2={x0 + waveW} y1={y} y2={y} />
          ))}
        </g>

        <g className="font-mono" fontSize={text}>
          <text x={0} y={yHg + 4} fill={XR.second}>mercury</text>
          <text x={0} y={yP + 4} fill={XR.first}>protein</text>
          <text x={0} y={yS + 4} fill={XR.ink}>sum</text>
        </g>

        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={curvePath(x0, yHg, waveW, hg, 1)} stroke={XR.second} strokeWidth={2} />
          <path
            d={curvePath(x0, yP, waveW, protein, 1)}
            stroke={XR.first}
            strokeWidth={dragging ? 2.75 : 2}
          />
          <path
            d={curvePath(x0, yS, waveW, (t) => hg(t) + protein(t), 1)}
            stroke={XR.ink}
            strokeWidth={2.5}
          />
        </g>
        {markX < x0 + waveW && (
          <circle cx={markX} cy={yP - amp} r={3.5} fill={XR.accent} />
        )}

        <rect
          x={x0}
          y={yP - amp - 10}
          width={waveW}
          height={2 * amp + 20}
          fill="transparent"
          style={{ cursor, touchAction: "pan-y" }}
          onPointerDown={onWaveDown}
          onPointerMove={onWaveMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />

        <g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={XR.guide} />
          <g stroke={XR.label}>
            <line x1={cx} x2={cx} y1={cy - r - 3} y2={cy - r + 3} />
            <line x1={cx} x2={cx} y1={cy + r - 3} y2={cy + r + 3} />
          </g>
          {f > 0.004 && (
            <path
              d={`M${cx} ${cy}L${cx} ${cy - r}A${r} ${r} 0 ${f > 0.5 ? 1 : 0} 1 ${hx} ${hy}Z`}
              fill={XR.accent}
              fillOpacity={0.16}
            />
          )}
          <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke={XR.guide} />
          <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={XR.accent} strokeWidth={1.5} />
          <circle cx={cx} cy={cy} r={1.75} fill={XR.accent} />
          <circle cx={hx} cy={hy} r={3.5} fill={XR.accent} />
          <g className="font-mono" textAnchor="middle" fontSize={text - 1}>
            <text x={cx} y={cy - r - 12} fill={XR.label}>phase</text>
            <text x={cx} y={cy + r + 22} fill={XR.ink} fontSize={text}>
              {readout(f)}
            </text>
          </g>
          <circle
            cx={cx}
            cy={cy}
            r={r + 10}
            fill="transparent"
            style={{ cursor, touchAction: "none" }}
            onPointerDown={onDialDown}
            onPointerMove={onDialMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          />
        </g>

        <circle cx={spotX} cy={yP} r={spotR} fill={XR.ink} fillOpacity={PLAIN} />
        <circle
          cx={spotX}
          cy={yS}
          r={spotR}
          fill={XR.ink}
          fillOpacity={snap(clamp(PLAIN * times, 0, 1), 3)}
        />
        {!narrow && (
          <g className="font-mono" fontSize={text - 1} fill={XR.label}>
            <text x={spotX + spotR + 8} y={yP + 4}>protein alone</text>
            <text x={spotX + spotR + 8} y={yS - 3}>with mercury</text>
            <text x={spotX + spotR + 8} y={yS + 11} fill={XR.ink}>
              {times.toFixed(1)}× as dark
            </text>
          </g>
        )}
      </svg>

      <input
        type="range"
        className="sr-only"
        aria-label="Slide the protein’s wave, in wavelengths"
        min={0}
        max={1}
        step={0.05}
        value={f}
        onChange={(e) => {
          take();
          setD(Number(e.target.value));
        }}
      />
    </div>
  );
}
