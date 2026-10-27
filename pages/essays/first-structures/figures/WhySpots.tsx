// Two atoms make bands, a whole crystal makes spots, and the unit cell and the molecule set where they fall and how dark.
import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { filmGradient, type BeamStop, type Pt } from "./scatter";
import { Atom, BeamArrow, Film, Labels, Ripples, StopBlock } from "./scene";
import { SliderRow } from "./controls";
import { Note } from "./Figure";
import { CrystalCancels } from "./CrystalCancels";
import { CellAndMolecule } from "./CellAndMolecule";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Atoms to film, and the film's half-height, in wavelengths. */
const DIST = 9;
const HALF = 0.7 * DIST;
/** The beam stop's distance in front of the film and its half-height, in wavelengths. */
const STOP_GAP = 1.5;
const STOP_HALF = 1;
/** The arriving waves' largest height, in pixels; the inset's height is laid out from it. */
const AMP = 8;

/** Half-height of the film shaded from either atom, as a fraction of the film's half-height. */
function shadowEdge(s: number) {
  const k = DIST / (DIST - STOP_GAP);
  return (STOP_HALF * k + (s / 2) * (k - 1) + 0.15) / HALF;
}

/** Extra path to the lower atom, in wavelengths, for a film point `y` wavelengths from the centre. */
const extraAt = (s: number, y: number) => Math.hypot(DIST, y - s / 2) - Math.hypot(DIST, y + s / 2);

/** The film point above the centre where the lower atom's wave is exactly one wave behind. */
function firstBand(s: number) {
  let lo = -HALF;
  let hi = 0;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (extraAt(s, mid) > 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2 / HALF;
}

function verdict(extra: number) {
  const off = Math.abs(extra - Math.round(extra));
  if (off < 0.06)
    return Math.round(Math.abs(extra)) === 0 ? "In step: dark" : "A whole number of waves behind: in step, dark";
  if (Math.abs(off - 0.5) < 0.06) return "Half a wave behind: they cancel, clear";
  return "Partly in step: grey";
}

function ArrivingWaves({ x, y, w, extra, text }: { x: number; y: number; w: number; extra: number; text: number }) {
  const labelW = 72;
  const waveW = w - labelW;
  const lam = waveW / 3.4;
  const amp = clamp(lam * 0.12, 5, AMP);
  const c0 = extra >= 0 ? 0.3 * lam : waveW - 0.3 * lam;
  const top = (t: number) => amp * Math.cos((TAU * (t - c0)) / lam);
  const bottom = (t: number) => amp * Math.cos((TAU * (t - c0 - extra * lam)) / lam);
  const r1 = y + 30 + amp;
  const r2 = r1 + 2 * amp + 28;
  const rs = r2 + 3 * amp + 20;
  const bracketY = r2 - amp - 8;
  const b0 = x + labelW + c0;
  const b1 = b0 + extra * lam;
  const height = Math.abs(2 * Math.cos(Math.PI * extra));
  const x0 = x + labelW;

  return (
    <g>
      <text x={x} y={y + 13} className="font-ui" fontSize={text + 1} fontWeight={600} fill={XR.ink}>
        {verdict(extra)}
      </text>
      <g stroke={XR.rule}>
        {[r1, r2, rs].map((ry) => (
          <line key={ry} x1={x0} x2={x0 + waveW} y1={ry} y2={ry} />
        ))}
      </g>
      <line x1={b0} x2={b0} y1={r1 - amp - 6} y2={rs + 2 * amp + 4} stroke={XR.guide} strokeWidth={0.75} strokeDasharray="3 3" />
      <g fill="none" strokeLinejoin="round">
        <path d={curvePath(x0, r1, waveW, top, 1)} stroke={XR.first} strokeWidth={2} />
        <path d={curvePath(x0, r2, waveW, bottom, 1)} stroke={XR.first} strokeWidth={2} />
        <path d={curvePath(x0, rs, waveW, (t) => top(t) + bottom(t), 1)} stroke={XR.accent} strokeWidth={2.5} />
      </g>
      {Math.abs(extra) > 0.02 && (
        <g stroke={XR.accent} strokeWidth={1.5}>
          <line x1={b0} x2={b1} y1={bracketY} y2={bracketY} />
          <line x1={b1} x2={b1} y1={bracketY - 3} y2={bracketY + 3} />
        </g>
      )}
      <Labels size={text}>
        <text x={x} y={r1 + 4}>top atom</text>
        <text x={x} y={r2 + 4}>bottom atom</text>
        <text x={x} y={rs + 4} fill={XR.accent}>sum</text>
        <text x={x} y={rs + 18} fontSize={text - 1} fill={XR.accent}>
          height {height.toFixed(2)}
        </text>
        {Math.abs(extra) > 0.02 && (
          <text x={clamp((b0 + b1) / 2, x0 + 50, x0 + waveW - 50)} y={bracketY - 6} textAnchor="middle" fill={XR.accent}>
            {Math.abs(extra).toFixed(2)} wave behind
          </text>
        )}
      </Labels>
    </g>
  );
}

function PathPanel({
  W,
  spacing,
  probe,
  onProbe,
}: {
  W: number;
  spacing: number;
  probe: number;
  onProbe: (f: number) => void;
}) {
  const ids = useId();
  const drag = useRef<{ top: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const wide = W >= 560;
  const text = wide ? 11 : 10;
  const sceneW = wide ? Math.round(W * 0.52) : W;
  const insetW = Math.min(wide ? W - sceneW - 24 : W, 320);
  const lambda = clamp(sceneW / 13, 11, 20);
  const D = DIST * lambda;
  const filmW = 14;
  const filmX = sceneW - filmW - 30;
  const ax = filmX - D;
  const arrowX = Math.max(4, ax - 4 * lambda);
  const filmTop = 26;
  const filmHalf = HALF * lambda;
  const cy = filmTop + filmHalf;
  const filmBottom = cy + filmHalf;
  const sceneH = filmBottom + 10;
  const stop: BeamStop = { x: filmX - STOP_GAP * lambda, y: cy, half: STOP_HALF * lambda };
  const d = spacing * lambda;

  const upper: Pt = [ax, cy - d / 2];
  const lower: Pt = [ax, cy + d / 2];
  const py = cy + probe * filmHalf;
  const P: Pt = [filmX, py];
  const rU = Math.hypot(P[0] - upper[0], P[1] - upper[1]);
  const rL = Math.hypot(P[0] - lower[0], P[1] - lower[1]);
  const extra = (rL - rU) / lambda;

  const long = extra >= 0 ? lower : upper;
  const rLong = extra >= 0 ? rL : rU;
  const rShort = extra >= 0 ? rU : rL;
  const t = (Math.abs(extra) * lambda) / rLong;
  const E: Pt = [long[0] + (P[0] - long[0]) * t, long[1] + (P[1] - long[1]) * t];
  const ang = Math.atan2(E[1] - P[1], E[0] - P[0]);
  const sweep = (1.6 * lambda) / rShort;
  const arc = `M${P[0] + rShort * Math.cos(ang - sweep)} ${P[1] + rShort * Math.sin(ang - sweep)} A${rShort} ${rShort} 0 0 1 ${P[0] + rShort * Math.cos(ang + sweep)} ${P[1] + rShort * Math.sin(ang + sweep)}`;

  const stops = filmGradient([upper, lower], lambda, filmX, filmTop, filmBottom, stop, 1);

  const insetH = 30 + 2 * AMP + 28 + 2 * AMP + 20 + 3 * AMP + 30;
  const insetX = wide ? sceneW + 24 : 0;
  const insetY = wide ? Math.max(0, (sceneH - insetH) / 2) : sceneH + 18;
  const H = wide ? Math.max(sceneH, insetY + insetH) : insetY + insetH;

  const toProbe = (clientY: number) => {
    if (!drag.current) return;
    let f = clamp((clientY - drag.current.top - cy) / filmHalf, -1, 1);
    const edge = shadowEdge(spacing);
    if (Math.abs(f) < edge) f = f < 0 ? -edge : edge;
    onProbe(Math.round(f * 1000) / 1000);
  };
  const onDown = (e: PointerEvent<SVGRectElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { top: e.currentTarget.ownerSVGElement!.getBoundingClientRect().top };
    setDragging(true);
    toProbe(e.clientY);
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };
  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const step = e.key === "ArrowUp" ? -0.02 : e.key === "ArrowDown" ? 0.02 : 0;
    if (!step) return;
    e.preventDefault();
    onProbe(clamp(probe + step, -1, 1));
  };

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
      <title id={`${ids}t`}>Two atoms make bands on the film</title>
      <desc id={`${ids}d`}>
        Two atoms {spacing.toFixed(1)} wavelengths apart send waves to a marked point on the film. The bottom atom&rsquo;s
        path there is {extra.toFixed(2)} of a wavelength longer, so its wave arrives that far behind the top atom&rsquo;s;
        added together they make a wave of height {Math.abs(2 * Math.cos(Math.PI * extra)).toFixed(2)} out of 2.
      </desc>
      <defs>
        <clipPath id={`${ids}c`}>
          <rect x={ax} y={filmTop - 8} width={filmX - ax} height={sceneH - filmTop + 8} />
        </clipPath>
      </defs>

      {[upper, lower].map(([x, y]) => (
        <Ripples key={y} cx={x} cy={y} lambda={lambda} reach={D - 0.5 * lambda} clipId={`${ids}c`} strength={0.5} floor={0.07} fadeOut />
      ))}
      {[upper, lower].map(([, y]) => (
        <BeamArrow key={y} x0={arrowX} x1={ax - 1.2 * lambda} y={y} />
      ))}

      <g stroke={XR.first} strokeWidth={1.25}>
        <line x1={upper[0]} y1={upper[1]} x2={P[0]} y2={P[1]} />
        <line x1={lower[0]} y1={lower[1]} x2={P[0]} y2={P[1]} />
      </g>
      {Math.abs(extra) > 0.02 && (
        <g>
          <path d={arc} fill="none" stroke={XR.label} strokeWidth={0.75} strokeDasharray="2 3" />
          <line x1={long[0]} y1={long[1]} x2={E[0]} y2={E[1]} stroke={XR.accent} strokeWidth={3.5} strokeLinecap="round" />
        </g>
      )}

      <StopBlock stop={stop} />
      <Film x={filmX} top={filmTop} bottom={filmBottom} width={filmW} gradientId={`${ids}g`} stops={stops} />
      <Atom x={upper[0]} y={upper[1]} />
      <Atom x={lower[0]} y={lower[1]} />

      <g
        tabIndex={0}
        role="slider"
        aria-label="Point on the film"
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={probe}
        aria-valuetext={verdict(extra)}
        onKeyDown={onKey}
        className="outline-none"
      >
        <circle cx={filmX + filmW / 2} cy={py} r={dragging ? 7 : 6} fill="none" stroke={XR.ink} strokeWidth={1.5} />
        <path d={`M${filmX + filmW + 4} ${py} l9 -6 v12 z`} fill={XR.ink} />
      </g>
      <rect
        x={filmX - 6}
        y={filmTop - 6}
        width={filmW + 30}
        height={filmBottom - filmTop + 12}
        fill="transparent"
        style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
        onPointerDown={onDown}
        onPointerMove={(e) => toProbe(e.clientY)}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />

      <Labels size={text}>
        <text x={arrowX} y={upper[1] - 10}>x-rays</text>
        <text x={filmX + filmW} y={14} textAnchor="end">film</text>
        {Math.abs(extra) > 0.15 && (
          <text x={(long[0] + E[0]) / 2 + 4} y={(long[1] + E[1]) / 2 + (extra >= 0 ? 16 : -9)} fill={XR.accent}>
            extra path
          </text>
        )}
      </Labels>

      <ArrivingWaves x={insetX} y={insetY} w={insetW} extra={extra} text={text} />
    </svg>
  );
}

/** Two atoms, a marker on the film, and a slider for their spacing. */
export function TwoAtomBands() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [spacing, setSpacing] = useState(3);
  const [probe, setProbe] = useState(() => firstBand(3));
  const changeSpacing = (s: number) => {
    setSpacing(s);
    setProbe((f) => Math.sign(f || -1) * Math.max(Math.abs(f), shadowEdge(s)));
  };
  return (
    <div ref={ref}>
      <PathPanel W={W} spacing={spacing} probe={probe} onProbe={setProbe} />
      <div className="mt-4">
        <SliderRow
          label="Spacing between atoms"
          value={spacing}
          display={`${spacing.toFixed(1)} wavelengths`}
          min={1}
          max={5}
          step={0.1}
          onChange={changeSpacing}
        />
      </div>
    </div>
  );
}

export function WhySpots() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div>
        <Note title="1. Two atoms make bands">
          Drag the marker along the film. Where one wave has traveled a whole number of waves
          farther than the other, they arrive in step and the film is dark. Where it has traveled
          half a wave farther, they cancel and the film stays clear. Move the atoms apart, and the
          bands crowd together.
        </Note>
        <div className="mt-3">
          <TwoAtomBands />
        </div>
      </div>
      <CrystalCancels />
      <CellAndMolecule />
    </div>
  );
}
