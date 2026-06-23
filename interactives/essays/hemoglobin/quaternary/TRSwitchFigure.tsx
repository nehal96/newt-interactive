import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "../../../../lib/utils";
import { HB, NEUTRAL, SWITCH_CHAINS } from "../palette";

// The T <-> R quaternary switch as a flat 2D schematic, the diagram counterpart
// to the 3D morphs in the catching section. Hemoglobin is drawn as four subunit
// "blobs" in two αβ dimers (the surface-render look of the reference figures).
// Subunits are colored by chain type — α blue, β magenta — with the two copies
// separated by lightness: the α₁β₁ half (lighter) is the fixed reference, the
// α₂β₂ half (deep) rotates 15° about the molecular 2-fold axis between the tense
// (deoxy) and relaxed (oxy) states. The hole left between the four subunits IS
// the central cavity (the 2,3-BPG site); as the α₂β₂ half swings in, the four
// hemes load with O₂ and the cavity pinches shut.
//
// Everything is parametric so the look is easy to tweak: see the config block
// below. Pure SVG + a little state — no WebGL, SSR-safe, renders in the T state
// on the server and animates only once the reader toggles.

// ---- tunable config ---------------------------------------------------------
// The geometry + palette are exported so the release-section BpgDoorstopFigure
// can reuse this exact 2D visual language (same blobs, same cavity, same rotor)
// and just layer the 2,3-BPG doorstop into the central cavity.
export const ANGLE = 15; // degrees the α₂β₂ half rotates between T and R
const BLOB_R = 78; // subunit blob radius
const TWEEN_MS = 700; // T <-> R transition duration
export const PIVOT = { x: 340, y: 220 }; // molecular 2-fold axis (rotation center)
export const VIEWBOX = "80 70 520 332";

// The chain palette lives in ../palette. Here in the switch, chains keep their
// type hue (α blue, β magenta) and the two αβ copies are separated by lightness
// (reference half deep, mobile half lighter) — so all four subunits are
// distinct, while the 3D ribbons / manifest / prose use the two flat type hues.
export const COLORS = {
  alpha1: SWITCH_CHAINS.alpha1, // α₁ — light blue (fixed reference)
  alpha2: SWITCH_CHAINS.alpha2, // α₂ — deep blue (mobile, rotates)
  alphaRim: SWITCH_CHAINS.alphaRim,
  beta1: SWITCH_CHAINS.beta1, // β₁ — light magenta (fixed reference)
  beta2: SWITCH_CHAINS.beta2, // β₂ — deep magenta (mobile, rotates)
  betaRim: SWITCH_CHAINS.betaRim,
  hemeRing: NEUTRAL.hemeRing,
  oxygen: HB.oxygen.fill, // matches the O atom in the anatomy palette
  angleArm: NEUTRAL.angleArm, // the 15° rotation arm (amber)
  angleLabel: NEUTRAL.angleLabel,
  axis: NEUTRAL.tick, // slate-400 — the dashed molecular 2-fold axis
};

type Group = "fixed" | "mobile";
type Subunit = {
  key: string;
  group: Group;
  cx: number;
  cy: number;
  fill: string;
  rim: string;
  perturbs: number[]; // per-vertex radial wobble → the organic surface look
  heme: { x: number; y: number };
  label: { x: number; y: number; text: string };
};

// The four subunits sit in a 2×2 cloverleaf spread far enough from the pivot
// that their inner edges don't meet — the small hole left in the middle IS the
// central cavity (real negative space, not a drawn shape). The α₂β₂ half then
// rotates 15° and slides toward the pivot (CLOSE_TX) on relaxing, pinching that
// hole nearly shut.
export const SUBUNITS: Subunit[] = [
  { key: "b1", group: "fixed", cx: 276, cy: 160, fill: COLORS.beta1, rim: COLORS.betaRim, perturbs: [1.04, 0.96, 1.1, 0.92, 1.0, 1.07, 0.9, 1.05], heme: { x: 298, y: 180 }, label: { x: 240, y: 140, text: "β₁" } },
  { key: "a1", group: "fixed", cx: 276, cy: 280, fill: COLORS.alpha1, rim: COLORS.alphaRim, perturbs: [0.96, 1.08, 0.9, 1.05, 1.0, 0.93, 1.1, 0.97], heme: { x: 298, y: 260 }, label: { x: 240, y: 308, text: "α₁" } },
  { key: "b2", group: "mobile", cx: 404, cy: 160, fill: COLORS.beta2, rim: COLORS.betaRim, perturbs: [0.96, 1.05, 0.9, 1.07, 1.0, 0.92, 1.1, 0.96], heme: { x: 382, y: 180 }, label: { x: 440, y: 140, text: "β₂" } },
  { key: "a2", group: "mobile", cx: 404, cy: 280, fill: COLORS.alpha2, rim: COLORS.alphaRim, perturbs: [1.05, 0.9, 1.07, 0.93, 1.0, 1.08, 0.92, 1.04], heme: { x: 382, y: 260 }, label: { x: 440, y: 308, text: "α₂" } },
];

export const CLOSE_TX = 22; // how far the α₂β₂ half slides toward the pivot when relaxing

// A closed, smooth blob path through `perturbs.length` points around (cx, cy),
// each pushed out by its radial multiplier. Catmull-Rom → cubic Bézier so the
// outline stays organic but tweakable (edit the perturbs to reshape a subunit).
function blobPath(cx: number, cy: number, r: number, perturbs: number[]): string {
  const n = perturbs.length;
  const pts = perturbs.map((m, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    return [cx + r * m * Math.cos(a), cy + r * m * Math.sin(a)] as const;
  });
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

export const PATHS: Record<string, string> = Object.fromEntries(
  SUBUNITS.map((s) => [s.key, blobPath(s.cx, s.cy, BLOB_R, s.perturbs)])
);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
// easeInOutQuad
export const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

// Animate a 0↔1 value whenever `open` flips, easing from the live value so an
// interrupted toggle resumes rather than snapping. Returns the current value
// (1 = open/T, 0 = closed/R). Shared by TRSwitchFigure and BpgDoorstopFigure.
export function useSwitchTween(open: boolean, ms = TWEEN_MS) {
  const [s, setS] = useState(open ? 1 : 0);
  const sRef = useRef(s);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    const to = open ? 1 : 0;
    const from = sRef.current;
    if (from === to) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const v = lerp(from, to, ease(p));
      sRef.current = v;
      setS(v);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [open, ms]);
  return s;
}

const CAPTION: Record<"T" | "R", string> = {
  T: "Tense (T) — the four subunits sit apart, leaving the central cavity open; hemes empty, low O₂ affinity.",
  R: "Relaxed (R) — the α₂β₂ half has rotated 15° and slid inward, pinching the cavity shut; hemes loaded, high O₂ affinity.",
};

// One subunit: its blob, the heme ring, an O₂ dot that fades in with binding,
// and the subunit label. `o2` is the current oxygen-bound opacity (0 in T → 1 in R).
export function SubunitShape({ s, o2 }: { s: Subunit; o2: number }) {
  return (
    <g>
      <path d={PATHS[s.key]} fill={s.fill} stroke={s.rim} strokeWidth={2} strokeOpacity={0.55} />
      <circle cx={s.heme.x} cy={s.heme.y} r={13} fill="none" stroke={COLORS.hemeRing} strokeOpacity={0.9} strokeWidth={2} />
      <circle cx={s.heme.x} cy={s.heme.y} r={6} fill={COLORS.oxygen} opacity={o2} />
      <text x={s.label.x} y={s.label.y} fill={COLORS.hemeRing} fillOpacity={0.92} fontSize={15}>
        {s.label.text}
      </text>
    </g>
  );
}

// ---- shared scene pieces (reused by BpgDoorstopFigure) ----------------------
// The α₂β₂ rotor transform: as the molecule relaxes (s → 0) the mobile half
// slides toward the pivot (CLOSE_TX) and rotates back to aligned. `s` is the
// tween value (1 = T, 0 = R).
export function rotorTransform(s: number): string {
  const tx = -(1 - s) * CLOSE_TX;
  return `translate(${tx.toFixed(2)} 0) rotate(${(s * ANGLE).toFixed(3)} ${PIVOT.x} ${PIVOT.y})`;
}

// The dashed molecular 2-fold axis, behind everything.
export function TwoFoldAxis() {
  return (
    <line x1={PIVOT.x} y1={86} x2={PIVOT.x} y2={392} stroke={COLORS.axis} strokeWidth={1} strokeDasharray="5 5" />
  );
}

// The two halves of the molecule. The fixed α₁β₁ reference half, and the mobile
// α₂β₂ half that takes the rotor `transform`. `o2` is the oxygen-bound opacity.
// Both figures draw the fixed half, then their own cavity overlay, then the
// mobile half over it.
export function FixedHalf({ o2 }: { o2: number }) {
  return (
    <g>
      {SUBUNITS.filter((u) => u.group === "fixed").map((u) => (
        <SubunitShape key={u.key} s={u} o2={o2} />
      ))}
    </g>
  );
}

export function MobileHalf({ o2, transform }: { o2: number; transform: string }) {
  return (
    <g transform={transform}>
      {SUBUNITS.filter((u) => u.group === "mobile").map((u) => (
        <SubunitShape key={u.key} s={u} o2={o2} />
      ))}
    </g>
  );
}

// The two-state pill toggle under both switch figures. Left is always the tense
// (T) option, right the relaxed (R); `isLeft` drives which reads active.
export function StateToggle({
  leftLabel,
  rightLabel,
  isLeft,
  onLeft,
  onRight,
}: {
  leftLabel: ReactNode;
  rightLabel: ReactNode;
  isLeft: boolean;
  onLeft: () => void;
  onRight: () => void;
}) {
  const tab = (active: boolean) =>
    cn(
      "rounded-full px-4 py-1.5 transition-colors",
      active
        ? "bg-white font-medium text-slate-800 shadow-sm"
        : "text-slate-500 hover:text-slate-700"
    );
  return (
    <div className="mt-4 flex justify-center">
      <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
        <button type="button" onClick={onLeft} aria-pressed={isLeft} className={tab(isLeft)}>
          {leftLabel}
        </button>
        <button type="button" onClick={onRight} aria-pressed={!isLeft} className={tab(!isLeft)}>
          {rightLabel}
        </button>
      </div>
    </div>
  );
}

export default function TRSwitchFigure({ className }: { className?: string }) {
  const [state, setState] = useState<"T" | "R">("T");
  // 1 (T) → 0 (R); the shared tween eases between the two on each toggle.
  const s = useSwitchTween(state === "T");
  const o2 = 1 - s; // oxygen-bound opacity, 0 in T → 1 in R

  return (
    <figure className={cn("my-8 w-full scroll-mt-24 lg:my-12", className)}>
      <div className="mx-auto w-full max-w-xl">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-2">
          <svg
            viewBox={VIEWBOX}
            className="block h-auto w-full"
            role="img"
            aria-labelledby="tr-switch-title tr-switch-desc"
            fontFamily="inherit"
          >
            <title id="tr-switch-title">The tense-to-relaxed switch</title>
            <desc id="tr-switch-desc">
              Hemoglobin drawn as four subunits in two dimers around a central
              cavity. The blue α₁β₁ half holds fixed while the magenta α₂β₂ half
              rotates 15° and slides inward between the tense (deoxygenated) and
              relaxed (oxygenated) states, closing the cavity as the hemes bind
              oxygen.
            </desc>

            <TwoFoldAxis />
            <FixedHalf o2={o2} />
            {/* Rotating half (α₂β₂) — swings about the pivot and slides inward.
                The hole left between it and the fixed half IS the central cavity
                (the 2,3-BPG site): open in T, pinched nearly shut in R. */}
            <MobileHalf o2={o2} transform={rotorTransform(s)} />

            {/* 15° annotation — the straight arm of the rotation off the (dashed)
                molecular axis; fades out as the molecule relaxes into the aligned
                R state. */}
            <g opacity={s}>
              <line x1={PIVOT.x} y1={PIVOT.y} x2={307} y2={96} stroke={COLORS.angleArm} strokeWidth={1.5} />
              <text x={300} y={84} fill={COLORS.angleLabel} fontSize={13}>
                15°
              </text>
            </g>
          </svg>
        </div>

        <StateToggle
          leftLabel="Deoxygenated · tense (T)"
          rightLabel="Oxygenated · relaxed (R)"
          isLeft={state === "T"}
          onLeft={() => setState("T")}
          onRight={() => setState("R")}
        />

        <figcaption className="mt-3 text-center text-sm text-slate-500">
          {CAPTION[state]}
        </figcaption>
      </div>
    </figure>
  );
}
