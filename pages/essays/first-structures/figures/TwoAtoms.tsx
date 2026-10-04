// Atoms in an X-ray beam — one, two, or a row — and the bands their ripples leave on film.
import { useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { crossing, filmGradient, type BeamStop, type Pt } from "./scatter";
import { Atom, BeamArrow, Film, Labels, Ripples, StopBlock } from "./scene";
import { SliderRow } from "./controls";
import { SPACING as ROW_SPACING, rowStrength } from "./RowOfAtoms";

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

const MAX_SPACING = 5;

type Stage = "one" | "two" | "row";

function ScatterPanel({
  W,
  stage,
  spacing,
  n,
  header,
  onSpacing,
  maxLambda = 24,
  span = 18,
  hideHeader = false,
}: {
  hideHeader?: boolean;
  W: number;
  maxLambda?: number;
  span?: number;
  stage: Stage;
  spacing: number;
  n: number;
  header: string;
  onSpacing?: (s: number) => void;
}) {
  const ids = useId();
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ top: number } | null>(null);

  const narrow = W < 520;
  const compact = W < 320;
  const text = narrow ? 10 : 11;
  const lambda = clamp((W - 20) / 15.5, 14, maxLambda);
  const D = 12 * lambda;
  const filmW = 14;
  const sceneW = Math.min(W, 15.5 * lambda + 20);
  const filmX = (W + sceneW) / 2 - filmW - 2;
  const filmTop = 26;
  const filmBottom = filmTop + span * lambda;
  const cy = (filmTop + filmBottom) / 2;
  const H = filmBottom + 6;
  const ax = filmX - D;
  const arrowX = Math.max(4, ax - 1.4 * lambda - 64);
  const stop: BeamStop = { x: filmX - 1.5 * lambda, y: cy, half: 1.2 * lambda };
  const shadowHalf = (stop.half * (filmX - ax)) / (stop.x - ax);
  const onFilm = (y: number) => y > filmTop && y < filmBottom && Math.abs(y - cy) > shadowHalf + 2;

  const d = spacing * lambda;
  const upper: Pt = [ax, cy - d / 2];
  const lower: Pt = [ax, cy + d / 2];
  const rowGap = Math.min(ROW_SPACING * lambda, (filmBottom - filmTop - 2 * lambda) / Math.max(1, n - 1));
  const atoms: Pt[] =
    stage === "one"
      ? [[ax, cy]]
      : stage === "two"
        ? [upper, lower]
        : Array.from({ length: n }, (_, i): Pt => [ax, cy + (i - (n - 1) / 2) * rowGap]);

  const stops =
    stage === "row"
      ? Array.from({ length: Math.ceil(filmBottom - filmTop) + 1 }, (_, i) => {
          const y = filmTop + i;
          const t = (y - cy) / D;
          const o = Math.abs(y - cy) <= shadowHalf ? 0 : 0.9 * rowStrength(n, t / Math.hypot(1, t));
          return { offset: i / (filmBottom - filmTop), o };
        })
      : filmGradient(atoms, lambda, filmX, filmTop, filmBottom, stop, 1);

  const reach = Math.hypot(D, filmBottom - filmTop);
  const rippleReach = 7.5 * lambda;
  const crestRadii: number[] = [];
  for (let k = 1; (k - 0.5) * lambda < rippleReach; k++) crestRadii.push((k - 0.5) * lambda);

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
  if (stage === "two")
    for (let k = -Math.floor(2 * spacing); k <= Math.floor(2 * spacing); k++) {
      const diff = (k / 2) * lambda;
      if (Math.abs(diff) >= d) continue;
      const pts = guide(diff);
      if (pts) guides.push({ diff: k / 2, pts });
    }
  if (stage === "row")
    for (let k = -ROW_SPACING + 1; k < ROW_SPACING; k++) {
      const s = k / ROW_SPACING;
      const y = cy + (D * s) / Math.sqrt(1 - s * s);
      if (onFilm(y)) guides.push({ diff: k, pts: [[ax, cy], [filmX, y]] });
    }
  const inStep = guides.filter((g) => Number.isInteger(g.diff));
  const rows = new Set(inStep.map((g) => g.diff));
  const dots: Pt[] = [];
  if (stage === "two")
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
  const end = (g: { pts: Pt[] }) => g.pts[g.pts.length - 1][1];
  const labelInStep = inStep
    .filter((g) => end(g) < cy)
    .sort((a, b) => end(b) - end(a))[0];
  const labelCancel = labelInStep
    ? cancel.find((g) => g.diff === labelInStep.diff + 0.5)
    : cancel.filter((g) => g.diff > 0).sort((a, b) => a.diff - b.diff)[0];
  const lowerInStep = inStep.filter((g) => end(g) > cy).sort((a, b) => end(a) - end(b))[0];
  const callout =
    stage === "two" && lowerInStep ? lowerInStep.pts.find(([x]) => x > ax + 1.2 * lambda) : undefined;

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

  const description =
    stage === "one"
      ? "One atom in an X-ray beam sends out circular ripples. The film to the right shows only a faint, smooth fog, clear where the beam stop shades it."
      : stage === "two"
        ? `Two atoms ${spacing.toFixed(1)} wavelengths apart, one above the other, each sending out circular ripples. Red dots mark where a crest from one atom crosses a crest from the other; the dots fall in lines that end on dark bands of the film. Between them, crests meet troughs and cancel, and the film stays clear.`
        : `A row of ${n} atoms, ${ROW_SPACING} wavelengths apart. Thin red lines mark the directions where every atom's wave arrives in step; the film is dark there, in bands that narrow as atoms are added, and clear in between.`;

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
      <desc id={`${ids}d`}>{description}</desc>
      <defs>
        <clipPath id={`${ids}c`}>
          <rect x={ax} y={filmTop - 8} width={filmX - ax} height={H - filmTop + 8} />
        </clipPath>
      </defs>

      {stage !== "row" &&
        atoms.map(([x, y]) => (
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
      {atoms.map(([x, y]) =>
        rowGap >= 13 || stage !== "row" ? (
          <Atom key={y} x={x} y={y} />
        ) : (
          <circle key={y} cx={x} cy={y} r={Math.max(2, rowGap * 0.36)} fill={XR.sum} />
        ),
      )}

      {!hideHeader && (
        <text x={0} y={14} className="font-ui" fontSize={narrow ? 11 : 12} fontWeight={600} fill={XR.sum}>
          {header}
        </text>
      )}
      <Labels size={text}>
        <text x={arrowX} y={cy - 10}>X-rays</text>
        {stage === "one" && (
          <text x={stop.x + 6} y={cy + stop.half + 16} textAnchor="end">
            beam stop
          </text>
        )}
        <text x={filmX + filmW} y={14} textAnchor="end">
          film
        </text>
        {stage === "one" && (
          <text x={filmX - 6} y={filmTop + 14} textAnchor="end">
            faint grey
          </text>
        )}
        {callout && (
          <g>
            <line
              x1={ax - 6}
              y1={lower[1] + 2.4 * lambda - 4}
              x2={callout[0] - 2}
              y2={callout[1] + 3}
              stroke={XR.accent}
              strokeWidth={0.75}
            />
            <text x={ax - 8} y={lower[1] + 2.4 * lambda + 8} textAnchor="end" fill={XR.accent}>
              crest meets crest
            </text>
          </g>
        )}
        {labelInStep && (
          <text x={filmX - 6} y={end(labelInStep) + 16} textAnchor="end" fill={XR.accent}>
            {compact ? "waves add" : "waves add: dark"}
          </text>
        )}
        {labelCancel && (
          <text x={filmX - 6} y={end(labelCancel) - 8} textAnchor="end">
            {compact ? "cancel" : "waves cancel: clear"}
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
      <ScatterPanel W={panelW} stage="two" spacing={2} n={2} header="2 wavelengths apart: wide bands" />
      <ScatterPanel W={panelW} stage="two" spacing={4} n={2} header="4 wavelengths apart: narrow bands" />
    </div>
  );
}

export function TwoAtomsInteractive() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [spacing, setSpacing] = useState(3);
  return (
    <div ref={ref} className="w-full">
      <ScatterPanel
        W={W}
        stage="two"
        spacing={spacing}
        n={2}
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

function Note({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-1">
      <p className="font-ui text-xs font-semibold text-ink-900">{title}</p>
      <p className="mt-1 font-ui text-[0.8125rem] leading-normal text-ink-700">{children}</p>
    </div>
  );
}

/** One atom, two atoms, a row, one under another, each introduced by what to notice. */
export function Scattering() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [spacing, setSpacing] = useState(3);
  const [n, setN] = useState(5);
  const panel = { W, maxLambda: 15, span: 16, spacing, n, hideHeader: true };
  return (
    <div ref={ref} className="flex w-full flex-col gap-10">
      <div>
        <Note title="1. One atom">
          One atom spreads its ripple evenly, so the film darkens a little everywhere, with no
          pattern. The small block stops the X-rays that pass straight through.
        </Note>
        <ScatterPanel {...panel} stage="one" header="1. One atom" />
      </div>
      <div>
        <Note title="2. Two atoms">
          With two atoms, crest meets crest in some directions and the waves add; in others crest
          meets trough and they cancel. The film darkens only where they add. Move the atoms
          closer and the dark bands spread apart.
        </Note>
        <ScatterPanel {...panel} stage="two" header="2. Two atoms" onSpacing={setSpacing} />
        <div className="mt-4">
          <SliderRow
            label="Spacing"
            value={spacing}
            display={`${spacing.toFixed(1)} wavelengths`}
            min={1}
            max={MAX_SPACING}
            step={0.1}
            onChange={setSpacing}
          />
        </div>
      </div>
      <div>
        <Note title="3. A row of atoms">
          With more atoms at the same spacing, the waves still add in those directions but cancel
          almost everywhere else, so the bands get thinner. A crystal has thousands of atoms in a
          row, so its bands are very thin.
        </Note>
        <ScatterPanel {...panel} stage="row" header={`3. A row of ${n} atoms`} />
        <div className="mt-4">
          <SliderRow
            label="Atoms"
            value={n}
            display={`${n}`}
            valueText={`${n} atoms`}
            min={2}
            max={20}
            step={1}
            onChange={setN}
          />
        </div>
      </div>
    </div>
  );
}
