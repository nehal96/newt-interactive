import { useEffect, useRef, useState } from "react";
import { cn } from "../../../../lib/utils";

// The T <-> R quaternary switch as a flat 2D schematic, the diagram counterpart
// to the 3D morphs in the catching section. Hemoglobin is drawn as four subunit
// "blobs" in two αβ dimers (the surface-render look of the reference figures):
// the blue α₁β₁ half is the fixed reference, the magenta α₂β₂ half rotates 15°
// about the molecular 2-fold axis between the tense (deoxy) and relaxed (oxy)
// states. The hole left between the four subunits IS the central cavity (the
// 2,3-BPG site); as the α₂β₂ half swings in, the four hemes load with O₂ and
// the cavity pinches nearly shut.
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

export const COLORS = {
  fixedBeta: "#3F71D8", // α₁β₁ (fixed reference) — β₁ deep blue, α₁ lighter
  fixedAlpha: "#7099E8",
  fixedRim: "#28488F",
  mobileBeta: "#C04E92", // α₂β₂ (rotates) — β₂ deep magenta, α₂ lighter
  mobileAlpha: "#D279AE",
  mobileRim: "#8C2F6B",
  hemeRing: "#ffffff",
  oxygen: "#E2533C", // matches the O atom in the anatomy palette
  angleArm: "#E0A33A", // the 15° rotation arm (amber)
  angleLabel: "#B57E1F",
  axis: "#94A3B8", // slate-400 — the dashed molecular 2-fold axis
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
  { key: "b1", group: "fixed", cx: 276, cy: 160, fill: COLORS.fixedBeta, rim: COLORS.fixedRim, perturbs: [1.04, 0.96, 1.1, 0.92, 1.0, 1.07, 0.9, 1.05], heme: { x: 298, y: 180 }, label: { x: 240, y: 140, text: "β₁" } },
  { key: "a1", group: "fixed", cx: 276, cy: 280, fill: COLORS.fixedAlpha, rim: COLORS.fixedRim, perturbs: [0.96, 1.08, 0.9, 1.05, 1.0, 0.93, 1.1, 0.97], heme: { x: 298, y: 260 }, label: { x: 240, y: 308, text: "α₁" } },
  { key: "b2", group: "mobile", cx: 404, cy: 160, fill: COLORS.mobileBeta, rim: COLORS.mobileRim, perturbs: [0.96, 1.05, 0.9, 1.07, 1.0, 0.92, 1.1, 0.96], heme: { x: 382, y: 180 }, label: { x: 440, y: 140, text: "β₂" } },
  { key: "a2", group: "mobile", cx: 404, cy: 280, fill: COLORS.mobileAlpha, rim: COLORS.mobileRim, perturbs: [1.05, 0.9, 1.07, 0.93, 1.0, 1.08, 0.92, 1.04], heme: { x: 382, y: 260 }, label: { x: 440, y: 308, text: "α₂" } },
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

export default function TRSwitchFigure({ className }: { className?: string }) {
  const [state, setState] = useState<"T" | "R">("T");
  // `s` animates 1 (T) → 0 (R); a ref holds the live value so an interrupted
  // tween resumes from where it is rather than snapping.
  const [s, setS] = useState(1);
  const sRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const to = state === "T" ? 1 : 0;
    const from = sRef.current;
    if (from === to) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / TWEEN_MS);
      const v = lerp(from, to, ease(p));
      sRef.current = v;
      setS(v);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [state]);

  // Derived from the tween value. On relaxing (s → 0) the α₂β₂ half rotates back
  // to aligned and slides toward the pivot, closing the central cavity.
  const tx = -(1 - s) * CLOSE_TX;
  const rotorTransform = `translate(${tx.toFixed(2)} 0) rotate(${(s * ANGLE).toFixed(3)} ${PIVOT.x} ${PIVOT.y})`;
  const o2 = 1 - s;

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

            {/* Molecular 2-fold axis (behind everything). */}
            <line x1={PIVOT.x} y1={86} x2={PIVOT.x} y2={392} stroke={COLORS.axis} strokeWidth={1} strokeDasharray="5 5" />

            {/* Fixed half (α₁β₁). */}
            <g>
              {SUBUNITS.filter((u) => u.group === "fixed").map((u) => (
                <SubunitShape key={u.key} s={u} o2={o2} />
              ))}
            </g>

            {/* Rotating half (α₂β₂) — swings about the pivot and slides inward.
                The hole left between it and the fixed half IS the central cavity
                (the 2,3-BPG site): open in T, pinched nearly shut in R. */}
            <g transform={rotorTransform}>
              {SUBUNITS.filter((u) => u.group === "mobile").map((u) => (
                <SubunitShape key={u.key} s={u} o2={o2} />
              ))}
            </g>

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

        {/* T / R toggle. */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setState("T")}
              aria-pressed={state === "T"}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                state === "T"
                  ? "bg-white font-medium text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Deoxygenated · tense (T)
            </button>
            <button
              type="button"
              onClick={() => setState("R")}
              aria-pressed={state === "R"}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                state === "R"
                  ? "bg-white font-medium text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Oxygenated · relaxed (R)
            </button>
          </div>
        </div>

        <figcaption className="mt-3 text-center text-sm text-slate-500">
          {CAPTION[state]}
        </figcaption>
      </div>
    </figure>
  );
}
