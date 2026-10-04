// Figure 3: two atoms in an X-ray beam, and the bands their ripples leave on film.
import { useId, useRef, useState, type PointerEvent } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { filmGradient, type BeamStop, type Pt } from "./scatter";
import { Atom, BeamArrow, Film, Labels, Ripples, StopBlock } from "./scene";
import { SliderRow } from "./controls";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const MAX_SPACING = 5;

/**
 * Where a circle of radius r1 about the upper atom meets one of radius r2 about
 * the lower atom, `d` below it, on the film side. Offsets from the upper atom.
 */
function crossing(d: number, r1: number, r2: number): Pt | null {
  const v = (d * d + r1 * r1 - r2 * r2) / (2 * d);
  const u2 = r1 * r1 - v * v;
  return u2 < 0 ? null : [Math.sqrt(u2), v];
}

function TwoAtomPanel({
  W,
  spacing,
  header,
  onSpacing,
}: {
  W: number;
  spacing: number;
  header: string;
  onSpacing?: (s: number) => void;
}) {
  const ids = useId();
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ top: number } | null>(null);

  const narrow = W < 520;
  const text = narrow ? 11 : 12;
  const lambda = clamp((W - 20) / 15.5, 14, 24);
  const D = 12 * lambda;
  const filmW = 14;
  const sceneW = Math.min(W, 15.5 * lambda + 20);
  const filmX = (W + sceneW) / 2 - filmW - 2;
  const filmTop = 26;
  const filmBottom = filmTop + 18 * lambda;
  const cy = (filmTop + filmBottom) / 2;
  const H = filmBottom + 6;
  const ax = filmX - D;
  const arrowX = Math.max(4, ax - 1.4 * lambda - 64);
  const d = spacing * lambda;
  const upper: Pt = [ax, cy - d / 2];
  const lower: Pt = [ax, cy + d / 2];
  const atoms = [upper, lower];
  const stop: BeamStop = { x: filmX - 1.5 * lambda, y: cy, half: (MAX_SPACING * lambda) / 2 + 4 };
  const stops = filmGradient(atoms, lambda, filmX, filmTop, filmBottom, stop, 1);
  const shadowHalf = (stop.half * (filmX - ax)) / (stop.x - ax);
  const onFilm = (y: number) => y > filmTop && y < filmBottom && Math.abs(y - cy) > shadowHalf + 2;

  const reach = Math.hypot(D, filmBottom - filmTop);
  const rippleReach = 7.5 * lambda;
  const crestRadii: number[] = [];
  for (let n = 1; (n - 0.5) * lambda < rippleReach; n++) crestRadii.push((n - 0.5) * lambda);

  /** The curve of points whose path to the lower atom is `diff` longer, out to the film. */
  const guide = (diff: number) => {
    const pts: Pt[] = [];
    const start = Math.max(0, (d - diff) / 2);
    for (let r1 = start; r1 < reach * 1.5; r1 += lambda / 6) {
      const p = crossing(d, r1, r1 + diff);
      if (!p) continue;
      const x = ax + p[0];
      const y = upper[1] + p[1];
      if (x >= filmX) {
        const [px, py] = pts[pts.length - 1] ?? [ax, y];
        const t = (filmX - px) / (x - px);
        pts.push([filmX, py + t * (y - py)]);
        break;
      }
      pts.push([x, y]);
    }
    const end = pts[pts.length - 1];
    return end && end[0] === filmX && onFilm(end[1]) ? pts : null;
  };
  const toPath = (pts: Pt[]) =>
    pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

  const guides: { diff: number; pts: Pt[] }[] = [];
  for (let k = -Math.floor(2 * spacing); k <= Math.floor(2 * spacing); k++) {
    const diff = (k / 2) * lambda;
    if (Math.abs(diff) >= d) continue;
    const pts = guide(diff);
    if (pts) guides.push({ diff: k / 2, pts });
  }
  const inStep = guides.filter((g) => Number.isInteger(g.diff));
  const rows = new Set(inStep.map((g) => g.diff));
  const dots: Pt[] = [];
  for (const r1 of crestRadii)
    for (const r2 of crestRadii) {
      if (!rows.has(Math.round((r2 - r1) / lambda))) continue;
      const p = crossing(d, r1, r2);
      if (!p || p[0] < lambda * 0.3) continue;
      const x = ax + p[0];
      const y = upper[1] + p[1];
      if (x < filmX - 4 && y > filmTop - 4 && y < filmBottom + 4) dots.push([x, y]);
    }
  const cancel = guides.filter((g) => !Number.isInteger(g.diff));
  const labelInStep = inStep.filter((g) => g.diff > 0).sort((a, b) => a.diff - b.diff)[0];
  const labelCancel = labelInStep
    ? cancel.find((g) => g.diff === labelInStep.diff + 0.5)
    : cancel.filter((g) => g.diff > 0).sort((a, b) => a.diff - b.diff)[0];
  const end = (g: { pts: Pt[] }) => g.pts[g.pts.length - 1][1];

  const callout = labelInStep
    ? labelInStep.pts.find(([x]) => x > ax + 5 * lambda)
    : undefined;

  const onDown = (e: PointerEvent<SVGCircleElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { top: e.currentTarget.ownerSVGElement!.getBoundingClientRect().top };
    setDragging(true);
  };
  const onMove = (e: PointerEvent<SVGCircleElement>) => {
    if (!drag.current || !onSpacing) return;
    const y = e.clientY - drag.current.top;
    onSpacing(Math.round(clamp((2 * (y - cy)) / lambda, 1, MAX_SPACING) * 10) / 10);
  };
  const onUp = () => {
    drag.current = null;
    setDragging(false);
  };

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="block"
      role="img"
      aria-labelledby={`${ids}t ${ids}d`}
    >
      <title id={`${ids}t`}>{header}</title>
      <desc id={`${ids}d`}>
        Two atoms {spacing.toFixed(1)} wavelengths apart, one above the other,
        each sending out circular ripples. Red dots mark where a crest from one
        atom crosses a crest from the other. The dots fall in lines that fan
        out toward the film, and thin red lines carry each row on to a dark band.
        Between the rows, crests meet troughs and cancel, and the film stays
        clear.
      </desc>
      <defs>
        <clipPath id={`${ids}c`}>
          <rect x={ax} y={filmTop - 8} width={filmX - ax} height={H - filmTop + 8} />
        </clipPath>
      </defs>

      {atoms.map(([x, y]) => (
        <Ripples
          key={y}
          cx={x}
          cy={y}
          lambda={lambda}
          reach={rippleReach}
          clipId={`${ids}c`}
          strength={1.6}
          floor={0.3}
          fadeOut
        />
      ))}
      <BeamArrow x0={arrowX} x1={ax - 1.4 * lambda} y={cy} />

      <g fill="none" strokeWidth={1.25}>
        {inStep.map((g) => (
          <path key={g.diff} d={toPath(g.pts)} stroke={XR.accent} strokeOpacity={0.45} />
        ))}
      </g>
      <g fill={XR.accent}>
        {dots.map(([x, y]) => (
          <circle key={`${x.toFixed(1)}-${y.toFixed(1)}`} cx={x} cy={y} r={2.6} />
        ))}
      </g>

      <StopBlock stop={stop} />
      <Film
        x={filmX}
        top={filmTop}
        bottom={filmBottom}
        width={filmW}
        gradientId={`${ids}g`}
        stops={stops}
      />
      {atoms.map(([x, y]) => (
        <Atom key={y} x={x} y={y} />
      ))}

      <text x={0} y={14} className="font-ui" fontSize={narrow ? 12 : 13} fontWeight={600} fill={XR.sum}>
        {header}
      </text>
      <Labels size={text}>
        <text x={arrowX} y={cy - 10}>X-rays</text>
        <text x={stop.x + 6} y={cy + stop.half + 16} textAnchor="end">
          beam stop
        </text>
        <text x={filmX + filmW} y={14} textAnchor="end">
          film
        </text>
        {callout && (
          <text x={callout[0] - 6} y={callout[1] - 10} textAnchor="end" fill={XR.accent}>
            crests cross
          </text>
        )}
        {labelInStep && (
          <text x={filmX - 6} y={end(labelInStep) + 16} textAnchor="end" fill={XR.accent}>
            in step: film darkens
          </text>
        )}
        {labelCancel && (
          <text x={filmX - 6} y={end(labelCancel) - 8} textAnchor="end">
            crests meet troughs: clear
          </text>
        )}
      </Labels>

      {onSpacing && (
        <circle
          cx={lower[0]}
          cy={lower[1]}
          r={22}
          fill="transparent"
          stroke={dragging ? XR.atom : "none"}
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
      )}
    </svg>
  );
}

export function TwoAtoms() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const sideBySide = W >= 640;
  const panelW = sideBySide ? (W - 24) / 2 : W;
  return (
    <div ref={ref} className={sideBySide ? "flex w-full gap-6" : "flex w-full flex-col gap-8"}>
      <TwoAtomPanel W={panelW} spacing={2} header="2 wavelengths apart: wide bands" />
      <TwoAtomPanel W={panelW} spacing={4} header="4 wavelengths apart: narrow bands" />
    </div>
  );
}

export function TwoAtomsInteractive() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [spacing, setSpacing] = useState(3);
  return (
    <div ref={ref} className="w-full">
      <TwoAtomPanel
        W={W}
        spacing={spacing}
        header={`Atoms ${spacing.toFixed(1)} wavelengths apart`}
        onSpacing={setSpacing}
      />
      <div className="mt-5">
        <SliderRow
          label="Atom spacing"
          value={spacing}
          display={`${spacing.toFixed(1)} wavelengths`}
          min={1}
          max={MAX_SPACING}
          step={0.1}
          onChange={setSpacing}
        />
      </div>
    </div>
  );
}
