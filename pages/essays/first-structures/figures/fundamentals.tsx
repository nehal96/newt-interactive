// The X-ray fundamentals in small panels, plus two ways of laying them out: a strip and a step-through.
import { useId, useState, type ReactNode } from "react";
import { useElementWidth } from "@hooks";
import { Button } from "@ui/controls";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { crossing, filmGradient, type Pt } from "./scatter";
import { Atom, BeamArrow, Film, Labels, Ripples } from "./scene";
import { SpotFilm, latticeSpots } from "./spots";
import { TwoWaves } from "./TwoWaves";
import OneAtom from "./OneAtom";
import { TwoAtoms } from "./TwoAtoms";
import { RowOfAtoms } from "./RowOfAtoms";
import { OrderMakesSpots } from "./OrderMakesSpots";

export type Box = { x: number; y: number; w: number; h: number };

export function MiniWaves({ x, y, w, h }: Box) {
  const x0 = x + 16;
  const len = w - 18;
  const lambda = len / 2.5;
  const amp = Math.min(7, h * 0.06);
  const rows = [y + h * 0.2, y + h * 0.44, y + h * 0.76];
  const wave = (a: number) => (t: number) => a * Math.cos((TAU * (t - lambda / 2)) / lambda);
  return (
    <g>
      <g stroke={XR.rule}>
        {rows.map((r) => (
          <line key={r} x1={x0} x2={x0 + len} y1={r} y2={r} />
        ))}
      </g>
      <path d={curvePath(x0, rows[0], len, wave(amp), 1)} fill="none" stroke={XR.first} strokeWidth={1.75} />
      <path d={curvePath(x0, rows[1], len, wave(amp), 1)} fill="none" stroke={XR.first} strokeWidth={1.75} />
      <path d={curvePath(x0, rows[2], len, wave(2 * amp), 1)} fill="none" stroke={XR.accent} strokeWidth={2} />
      <g className="font-mono" fontSize={13} fill={XR.label} textAnchor="middle">
        <text x={x + 6} y={(rows[0] + rows[1]) / 2 + 4}>+</text>
        <text x={x + 6} y={(rows[1] + rows[2]) / 2 + 4}>=</text>
      </g>
    </g>
  );
}

export function MiniAtom({ x, y, w, h }: Box) {
  const id = useId();
  const lambda = w / 8;
  const ax = x + w * 0.34;
  const cy = y + h / 2;
  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <Ripples cx={ax} cy={cy} lambda={lambda} reach={w} clipId={id} strength={0.7} floor={0.15} />
      <BeamArrow x0={x + 2} x1={ax - 9} y={cy} />
      <Atom x={ax} y={cy} />
    </g>
  );
}

export function MiniTwoAtoms({ x, y, w, h }: Box) {
  const id = useId();
  const lambda = w / 13;
  const d = 3 * lambda;
  const ax = x + w * 0.22;
  const cy = y + h / 2;
  const upper: Pt = [ax, cy - d / 2];
  const lower: Pt = [ax, cy + d / 2];
  const filmX = x + w - 6;
  const reach = 6.5 * lambda;
  const radii: number[] = [];
  for (let n = 1; (n - 0.5) * lambda < reach; n++) radii.push((n - 0.5) * lambda);

  const dots: Pt[] = [];
  for (const r1 of radii)
    for (const r2 of radii) {
      if (Math.abs(Math.round((r2 - r1) / lambda)) > 1) continue;
      const p = crossing(d, r1, r2);
      if (p && p[0] > lambda * 0.3) dots.push([ax + p[0], upper[1] + p[1]]);
    }

  const guides = [-1, 0, 1].map((k) => {
    const diff = k * lambda;
    const pts: Pt[] = [];
    for (let r1 = Math.max(0, (d - diff) / 2); r1 < 4 * w; r1 += lambda / 4) {
      const p = crossing(d, r1, r1 + diff);
      if (!p) continue;
      const px = ax + p[0];
      if (px >= filmX) break;
      pts.push([px, upper[1] + p[1]]);
    }
    return pts.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join("");
  });

  return (
    <g>
      <defs>
        <clipPath id={id}>
          <rect x={ax} y={y} width={filmX - ax} height={h} />
        </clipPath>
      </defs>
      {[upper, lower].map(([px, py]) => (
        <Ripples key={py} cx={px} cy={py} lambda={lambda} reach={reach} clipId={id} strength={1.4} floor={0.3} fadeOut />
      ))}
      <g fill="none" stroke={XR.accent} strokeWidth={1} strokeOpacity={0.45}>
        {guides.map((g, i) => (
          <path key={i} d={g} />
        ))}
      </g>
      <g fill={XR.accent}>
        {dots.map(([px, py]) => (
          <circle key={`${px.toFixed(1)}-${py.toFixed(1)}`} cx={px} cy={py} r={1.8} />
        ))}
      </g>
      <BeamArrow x0={x + 2} x1={ax - 8} y={cy} />
      <Film
        x={filmX}
        top={y + 2}
        bottom={y + h - 2}
        width={6}
        gradientId={`${id}g`}
        stops={filmGradient([upper, lower], lambda, filmX, y + 2, y + h - 2, undefined, 1)}
      />
      <Atom x={upper[0]} y={upper[1]} />
      <Atom x={lower[0]} y={lower[1]} />
    </g>
  );
}

const CRYSTAL_SPOTS = latticeSpots(40, 1.54, 0.2, () => 1);

export function MiniCrystal({ x, y, w, h }: Box) {
  const latticeH = h * 0.34;
  const cols = 6;
  const rows = 4;
  const gx = Math.min(w / cols, (latticeH / rows) * 1.2);
  const lx = x + (w - gx * (cols - 1)) / 2;
  const size = Math.min(w * 0.64, h * 0.52);
  const fy = y + h - size;
  return (
    <g>
      <g fill={XR.moleculeEdge}>
        {Array.from({ length: cols * rows }, (_, i) => (
          <circle key={i} cx={lx + (i % cols) * gx} cy={y + 6 + Math.floor(i / cols) * (latticeH / rows)} r={2.4} />
        ))}
      </g>
      <g stroke={XR.label} strokeWidth={1.25} fill={XR.label}>
        <line x1={x + w / 2} x2={x + w / 2} y1={y + latticeH + 4} y2={fy - 8} />
        <path d={`M${x + w / 2} ${fy - 3} l-4 -7 h8 z`} />
      </g>
      <SpotFilm x={x + (w - size) / 2} y={fy} size={size} spots={CRYSTAL_SPOTS} linear />
    </g>
  );
}

const PANELS = [
  { n: 1, title: "Waves in step add", Draw: MiniWaves },
  { n: 2, title: "An atom scatters", Draw: MiniAtom },
  { n: 3, title: "Crests cross", Draw: MiniTwoAtoms },
  { n: 4, title: "A crystal makes spots", Draw: MiniCrystal },
];

/** A numbered caption under a small panel. */
export function PanelLabel({ x, y, w, n, title, size }: { x: number; y: number; w: number; n: number; title: string; size: number }) {
  return (
    <g>
      <circle cx={x + 8} cy={y - 4} r={8} fill={XR.sum} />
      <text x={x + 8} y={y} textAnchor="middle" className="font-ui" fontSize={11} fontWeight={600} fill={XR.paper}>
        {n}
      </text>
      <text x={x + 22} y={y} className="font-ui" fontSize={size} fontWeight={600} fill={XR.sum}>
        {title}
      </text>
    </g>
  );
}

export function FundamentalsStrip() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const wide = W >= 600;
  const gap = 16;
  const perRow = wide ? 4 : 2;
  const w = (W - gap * (perRow - 1)) / perRow;
  const h = Math.min(160, w * 0.95);
  const rowH = h + 36;
  const H = rowH * Math.ceil(PANELS.length / perRow);
  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>Why a crystal turns X-rays into spots, in four panels.</title>
        <desc id={`${ids}d`}>
          One: two waves in step add into a taller wave. Two: an atom in an X-ray beam sends out
          circular ripples. Three: where crests from two atoms cross, red dots mark the waves
          adding, and the dots line up toward dark bands on a film. Four: a grid of atoms gives a
          regular grid of spots on a film.
        </desc>
        {PANELS.map(({ n, title, Draw }, i) => {
          const x = (i % perRow) * (w + gap);
          const y = Math.floor(i / perRow) * rowH;
          return (
            <g key={n}>
              <PanelLabel x={x} y={y + 14} w={w} n={n} title={title} size={wide ? 12 : 12} />
              <Draw x={x} y={y + 28} w={w} h={h} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const STEPS: { title: string; body: ReactNode }[] = [
  { title: "Two waves in step add up; half a wave apart, they cancel.", body: <TwoWaves /> },
  { title: "One atom sends a faint ripple in every direction.", body: <OneAtom /> },
  {
    title: "Where crests from two atoms cross, their waves add, and the crossings line up toward dark bands on the film.",
    body: <TwoAtoms />,
  },
  { title: "More atoms in a row keep the bands in place but make them sharper.", body: <RowOfAtoms /> },
  {
    title: "A crystal repeats in every direction, so its waves arrive in step in only a few directions, each leaving a spot.",
    body: <OrderMakesSpots />,
  },
];

export function FundamentalsSteps() {
  const [step, setStep] = useState(0);
  const last = STEPS.length - 1;
  return (
    <div className="w-full">
      <p className="mb-1 font-mono text-xs text-ink-500">
        Step {step + 1} of {STEPS.length}
      </p>
      <p className="mb-4 font-ui text-[0.9375rem] font-semibold leading-snug text-ink-800" aria-live="polite">
        {STEPS[step].title}
      </p>
      {STEPS[step].body}
      <div className="mt-5 flex items-center justify-between gap-4">
        <Button variant="outline" className="min-h-11 text-sm" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </Button>
        <div className="flex gap-2" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={i === step ? "h-2 w-2 rounded-full bg-ink-800" : "h-2 w-2 rounded-full bg-ink-200"} />
          ))}
        </div>
        <Button variant="outline" className="min-h-11 text-sm" onClick={() => setStep((s) => Math.min(last, s + 1))} disabled={step === last}>
          Next
        </Button>
      </div>
    </div>
  );
}
