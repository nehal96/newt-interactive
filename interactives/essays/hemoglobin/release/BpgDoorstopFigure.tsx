import { useEffect, useRef, useState } from "react";
import { cn } from "../../../../lib/utils";
import {
  ANGLE,
  CLOSE_TX,
  COLORS,
  ease,
  lerp,
  PIVOT,
  SUBUNITS,
  SubunitShape,
  VIEWBOX,
} from "../quaternary/TRSwitchFigure";

// The 2,3-BPG "doorstop", drawn in the same flat 2D language as the T<->R
// switch (it reuses TRSwitchFigure's blobs, cavity and rotor wholesale). The
// teaching point is purely quaternary, so it belongs at this scale, not in 3D:
// BPG is a small, heavily negative molecule that slots into the central cavity —
// open in the tense (T) state — and props it open, blocking the relax to R. Toggle
// it out and the molecule is free to relax: the α₂β₂ half swings in, the cavity
// pinches shut, and affinity climbs. So BPG present = T (release); absent = R (hold).
//
// `s` runs 1 (T, BPG bound) -> 0 (R, BPG gone), exactly like TRSwitchFigure, so
// the rotor maths are identical; only the doorstop overlay is new.

const TWEEN_MS = 700;
const BPG = {
  fill: "#2E9E6F", // teal-green — distinct from the blue/magenta subunits & O₂
  rim: "#1C6B49",
  label: "#C6E8D8", // pale green — softer on the body than full white
};

const CAPTION: Record<"in" | "out", string> = {
  in: "2,3-BPG wedged in the central cavity props the tense (T) state open — low O₂ affinity, so oxygen is released to the tissue.",
  out: "With 2,3-BPG removed, hemoglobin is free to relax to R — the cavity pinches shut and affinity climbs, holding oxygen.",
};

export default function BpgDoorstopFigure({ className }: { className?: string }) {
  const [bound, setBound] = useState(true); // BPG starts wedged in (the T state)
  const [s, setS] = useState(1); // 1 = T (bound), 0 = R (free)
  const sRef = useRef(1);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const to = bound ? 1 : 0;
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
  }, [bound]);

  // Same rotor as the switch: the α₂β₂ half slides toward the pivot and rotates
  // back to aligned as the molecule relaxes (s -> 0), closing the cavity.
  const tx = -(1 - s) * CLOSE_TX;
  const rotorTransform = `translate(${tx.toFixed(2)} 0) rotate(${(s * ANGLE).toFixed(3)} ${PIVOT.x} ${PIVOT.y})`;
  const o2 = 1 - s;
  // The doorstop fades and lifts up out of the cavity as BPG leaves.
  const doorstopT = `translate(0 ${(-(1 - s) * 46).toFixed(1)})`;

  return (
    <figure className={cn("my-8 w-full scroll-mt-24 lg:my-12", className)}>
      <div className="mx-auto w-full max-w-xl">
        <div className="w-full rounded-lg border border-slate-200 bg-white p-2">
          <svg
            viewBox={VIEWBOX}
            className="block h-auto w-full"
            role="img"
            aria-labelledby="bpg-title bpg-desc"
            fontFamily="inherit"
          >
            <title id="bpg-title">The 2,3-BPG doorstop</title>
            <desc id="bpg-desc">
              Hemoglobin drawn as four subunits around a central cavity. A
              negatively charged 2,3-BPG molecule wedges into the cavity in the
              tense state and props it open; removing it lets the α₂β₂ half rotate
              inward to the relaxed state, pinching the cavity shut.
            </desc>

            {/* Molecular 2-fold axis (behind everything). */}
            <line x1={PIVOT.x} y1={86} x2={PIVOT.x} y2={392} stroke={COLORS.axis} strokeWidth={1} strokeDasharray="5 5" />

            {/* Fixed half (α₁β₁). */}
            <g>
              {SUBUNITS.filter((u) => u.group === "fixed").map((u) => (
                <SubunitShape key={u.key} s={u} o2={o2} />
              ))}
            </g>

            {/* The doorstop sits in the cavity between the halves — drawn before
                the rotating half so that half slides over it as the cavity shuts. */}
            <g opacity={s} transform={doorstopT}>
              {/* BPG body */}
              <rect x={316} y={205} width={48} height={28} rx={11} fill={BPG.fill} stroke={BPG.rim} strokeWidth={1.5} />
              <text x={340} y={222} fill={BPG.label} fontSize={9.5} textAnchor="middle" fontWeight={600}>2,3-BPG</text>
            </g>

            {/* Rotating half (α₂β₂) — swings about the pivot and slides inward. */}
            <g transform={rotorTransform}>
              {SUBUNITS.filter((u) => u.group === "mobile").map((u) => (
                <SubunitShape key={u.key} s={u} o2={o2} />
              ))}
            </g>
          </svg>
        </div>

        {/* BPG in / out toggle. */}
        <div className="mt-4 flex justify-center">
          <div className="inline-flex rounded-full bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setBound(true)}
              aria-pressed={bound}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                bound
                  ? "bg-white font-medium text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              2,3-BPG bound · tense (T)
            </button>
            <button
              type="button"
              onClick={() => setBound(false)}
              aria-pressed={!bound}
              className={cn(
                "rounded-full px-4 py-1.5 transition-colors",
                !bound
                  ? "bg-white font-medium text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Removed · relaxed (R)
            </button>
          </div>
        </div>

        <figcaption className="mt-3 text-center text-sm text-slate-500">
          {CAPTION[bound ? "in" : "out"]}
        </figcaption>
      </div>
    </figure>
  );
}
