// Drawing pieces shared by the scattering figures: beam, ripples, beam stop, film.
import { type ReactNode } from "react";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { type BeamStop } from "./scatter";

/** The X-ray beam's direction, ending just short of `x1`. */
export function BeamArrow({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  return (
    <g stroke={XR.first} strokeWidth={2} fill={XR.first}>
      <line x1={x0} x2={x1 - 4} y1={y} y2={y} />
      <path d={`M${x1} ${y} l-10 -5 v10 z`} strokeLinejoin="round" />
    </g>
  );
}

/** Key: the arrow, the wave seen side-on, and its crests drawn as lines are one beam. */
export function BeamKey({ x, y, size }: { x: number; y: number; size: number }) {
  const lam = 12;
  const eq = (cx: number) => (
    <text x={cx} y={y + 4} textAnchor="middle" fontSize={size + 1} fill={XR.label}>
      =
    </text>
  );
  return (
    <g>
      <rect x={x - 4} y={y - 14} width={160} height={46} rx={3} fill={XR.paper} />
      <g stroke={XR.first} strokeWidth={1.75} fill={XR.first}>
        <line x1={x} x2={x + 22} y1={y} y2={y} />
        <path d={`M${x + 28} ${y} l-8 -4 v8 z`} strokeLinejoin="round" />
      </g>
      {eq(x + 40)}
      <path
        d={curvePath(x + 52, y, 3 * lam, (t) => 4 * Math.cos((TAU * t) / lam), 1)}
        fill="none"
        stroke={XR.first}
        strokeWidth={1.5}
      />
      {eq(x + 100)}
      <g stroke={XR.first} strokeWidth={1.5} strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <line key={i} x1={x + 112 + i * lam} x2={x + 112 + i * lam} y1={y - 7} y2={y + 7} />
        ))}
      </g>
      <g className="font-mono" fontSize={size - 1} fill={XR.label} textAnchor="middle">
        <text x={x + 14} y={y + 24}>beam</text>
        <text x={x + 70} y={y + 24}>wave</text>
        <text x={x + 124} y={y + 24}>crests</text>
      </g>
    </g>
  );
}

/** Circular crests from one atom, half a wave behind the crest that made them. */
export function Ripples({
  cx,
  cy,
  lambda,
  reach,
  clipId,
  strength = 0.6,
  floor = 0.12,
  fadeOut = false,
}: {
  cx: number;
  cy: number;
  lambda: number;
  reach: number;
  clipId: string;
  strength?: number;
  floor?: number;
  fadeOut?: boolean;
}) {
  const rings: { r: number; o: number }[] = [];
  for (let n = 1; (n - 0.5) * lambda < reach; n++) {
    const r = (n - 0.5) * lambda;
    const o = Math.min(0.85, Math.max(floor, (strength * lambda) / r));
    rings.push({ r, o: fadeOut ? o * Math.sqrt(1 - r / reach) : o });
  }
  return (
    <g clipPath={`url(#${clipId})`} fill="none" stroke={XR.first} strokeWidth={1}>
      {rings.map(({ r, o }) => (
        <circle key={r} cx={cx} cy={cy} r={r} strokeOpacity={o} />
      ))}
    </g>
  );
}

export function StopBlock({ stop }: { stop: BeamStop }) {
  return (
    <rect
      x={stop.x}
      y={stop.y - stop.half}
      width={6}
      height={2 * stop.half}
      rx={1}
      fill={XR.label}
    />
  );
}

export function Film({
  x,
  top,
  bottom,
  width,
  gradientId,
  stops,
}: {
  x: number;
  top: number;
  bottom: number;
  width: number;
  gradientId: string;
  stops: { offset: number; o: number }[];
}) {
  const h = bottom - top;
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1={0} x2={0} y1={0} y2={1}>
          {stops.map(({ offset, o }) => (
            <stop key={offset} offset={offset} stopColor={XR.sum} stopOpacity={o} />
          ))}
        </linearGradient>
      </defs>
      <rect x={x} y={top} width={width} height={h} fill={XR.film} />
      <rect x={x} y={top} width={width} height={h} fill={`url(#${gradientId})`} />
      <rect
        x={x}
        y={top}
        width={width}
        height={h}
        fill="none"
        stroke={XR.atom}
        strokeWidth={0.75}
      />
    </g>
  );
}

export function Atom({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={5} fill={XR.sum} />;
}

/** Mono labels with a paper halo, so they stay legible over ripples. */
export function Labels({ size, children }: { size: number; children: ReactNode }) {
  return (
    <g
      className="font-mono"
      fontSize={size}
      fill={XR.label}
      style={{
        paintOrder: "stroke",
        stroke: XR.paper,
        strokeWidth: 4,
        strokeLinejoin: "round",
      }}
    >
      {children}
    </g>
  );
}
