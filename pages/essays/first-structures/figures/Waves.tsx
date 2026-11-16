// Two waves, their sum, and the phase circle.
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const frac = (v: number) => v - Math.floor(v);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t));

const SNAP = 0.04;

function readout(f: number) {
  if (f <= SNAP || f >= 1 - SNAP) return "in step";
  if (Math.abs(f - 0.5) <= SNAP) return "opposed";
  return "in between";
}

export function Waves() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [d, setD] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x0: number; d0: number } | null>(null);
  const touched = useRef(false);
  const raf = useRef(0);

  // Slides to opposed and back once, so the cancelling shows without a touch.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const out = 900;
    const hold = 800;
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
  const labelW = narrow ? 46 : 60;
  const dialCol = narrow ? 76 : 112;
  const r = narrow ? 22 : 28;
  const text = narrow ? 10 : 11;

  const x0 = labelW;
  const waveW = W - labelW - dialCol;
  const lambda = waveW / 3.1;
  const c0 = lambda * 0.3;
  const amp = clamp(lambda * 0.11, 8, 14);

  const y1 = 34 + amp;
  const y2 = y1 + 2 * amp + 24;
  const ys = y2 + 3 * amp + 22;
  const H = ys + 2 * amp + 6;

  const f = frac(d);
  const wave = (shift: number) => (t: number) =>
    amp * Math.cos((TAU * (t - c0 - shift)) / lambda);
  const w1 = wave(0);
  const w2 = wave(d * lambda);

  const crests = [0, 1, 2].map((i) => x0 + c0 + i * lambda);
  const markY = y2 - amp - 8;
  const markX = crests[0] + f * lambda;
  const labelY = y1 - amp - 16;

  const cx = W - dialCol / 2 + (narrow ? 4 : 8);
  const cy = (y1 + ys + amp) / 2;
  const theta = f * TAU;
  const hx = cx + r * Math.sin(theta);
  const hy = cy - r * Math.cos(theta);

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
        <title id={`${ids}t`}>
          Waves in step add up. Waves opposed cancel out.
        </title>
        <desc id={`${ids}d`}>
          Wave 1 and wave 2 have the same wavelength and amplitude. Wave 2 is{" "}
          {f.toFixed(2)} of a wavelength behind wave 1, which is {readout(f)}.
          Their sum is {Math.abs(2 * Math.cos(Math.PI * f)).toFixed(1)} times as
          tall as either wave.
        </desc>

        <g stroke={XR.guide} strokeWidth={0.75} strokeDasharray="3 3">
          {crests.map((x) => (
            <line key={x} x1={x} x2={x} y1={y1 - amp - 6} y2={ys + 2 * amp + 4} />
          ))}
        </g>
        <g stroke={XR.rule}>
          {[y1, y2, ys].map((y) => (
            <line key={y} x1={x0} x2={x0 + waveW} y1={y} y2={y} />
          ))}
        </g>

        <g className="font-mono" fontSize={text}>
          <text x={0} y={y1 + 4} fill={XR.first}>wave 1</text>
          <text x={0} y={y2 + 4} fill={XR.second}>wave 2</text>
          <text x={0} y={ys + 4} fill={XR.ink}>sum</text>
        </g>

        <g stroke={XR.label} strokeWidth={1}>
          <line x1={crests[0]} x2={crests[1]} y1={labelY + 6} y2={labelY + 6} />
          <line x1={crests[0]} x2={crests[0]} y1={labelY + 3} y2={labelY + 9} />
          <line x1={crests[1]} x2={crests[1]} y1={labelY + 3} y2={labelY + 9} />
          <line x1={crests[2]} x2={crests[2]} y1={y1} y2={y1 - amp} strokeWidth={1.25} />
          <line x1={crests[2] - 3} x2={crests[2] + 3} y1={y1} y2={y1} />
          <line x1={crests[2] - 3} x2={crests[2] + 3} y1={y1 - amp} y2={y1 - amp} />
        </g>
        <g className="font-mono" fontSize={text - 1} fill={XR.label} textAnchor="middle">
          <text x={(crests[0] + crests[1]) / 2} y={labelY}>wavelength</text>
          <text x={crests[2]} y={labelY}>amplitude</text>
        </g>

        <g fill="none" strokeLinejoin="round" strokeLinecap="round">
          <path d={curvePath(x0, y1, waveW, w1, 1)} stroke={XR.first} strokeWidth={2} />
          <path
            d={curvePath(x0, y2, waveW, w2, 1)}
            stroke={XR.second}
            strokeWidth={dragging ? 2.75 : 2}
          />
          <path
            d={curvePath(x0, ys, waveW, (t) => w1(t) + w2(t), 1)}
            stroke={XR.ink}
            strokeWidth={2.5}
          />
        </g>

        <g stroke={XR.accent} strokeWidth={1.25}>
          <line x1={crests[0]} x2={markX} y1={markY} y2={markY} />
          <line x1={crests[0]} x2={crests[0]} y1={markY - 3} y2={markY + 3} />
        </g>
        <circle cx={markX} cy={y2 - amp} r={3.5} fill={XR.accent} />

        <rect
          x={x0}
          y={y2 - amp - 14}
          width={waveW}
          height={2 * amp + 26}
          fill="transparent"
          style={{ cursor, touchAction: "pan-y" }}
          onPointerDown={onWaveDown}
          onPointerMove={onWaveMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />

        <g>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={XR.guide} strokeWidth={1} />
          <g stroke={XR.label} strokeWidth={1}>
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
          <line x1={cx} y1={cy} x2={cx} y2={cy - r} stroke={XR.guide} strokeWidth={1} />
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
      </svg>

      <input
        type="range"
        className="sr-only"
        aria-label="Slide wave 2, in wavelengths"
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
