import { useState } from "react";
import { cn } from "../../../../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components";
import { CHART, ChartFrame, curvePath, P50, PLOT, px, py } from "./chart";
import { HB } from "../palette";

// Figure 3 of the Cooperativity section: how the curve is tuned. The baseline
// normal-HbA curve is always shown; each control toggles a comparison curve on
// or off so the reader chooses what to hold against it. The effectors that the
// release section described — acid (Bohr), CO₂, 2,3-BPG — shift the curve right
// (higher P50, lower affinity, releases more); fetal hemoglobin shifts it left
// (lower P50, higher affinity, so it pulls O₂ across the placenta). P50 is the
// comparison metric, so the 50% line is drawn as the reference and each visible
// curve drops a colored dot where it crosses it. Pure SVG + a little state; the
// model, plot box and axes come from the shared ./chart module.

type ToggleKey = "acid" | "co2" | "bpg" | "hbf";

// Representative P50 values (mmHg): HbA ~26; the right-shifters spread modestly;
// HbF sits well left. Illustrative magnitudes, not a single measured condition.
// Colors come from the shared palette so each effector reads the same here as in
// its own figure: acid = Bohr purple, CO₂ = teal, 2,3-BPG = yellow (the
// doorstop), fetal Hb = rose.
const FACTORS: { key: ToggleKey; label: string; p50: number; color: string; tip: string }[] = [
  { key: "acid", label: "acid", p50: 38, color: HB.acid.fill, tip: "P₅₀ of 38 — releases more" },
  { key: "co2", label: "CO₂", p50: 34, color: HB.co2.fill, tip: "P₅₀ of 34 — releases more" },
  { key: "bpg", label: "2,3-BPG", p50: 31, color: HB.bpg.fill, tip: "P₅₀ of 31 — releases more" },
  { key: "hbf", label: "fetal Hb", p50: 19, color: HB.fetalHb.fill, tip: "P₅₀ of 19 — holds tighter" },
];

const BASELINE_D = curvePath(P50);

export default function AffinityShiftFigure({ className }: { className?: string }) {
  const [on, setOn] = useState<Record<ToggleKey, boolean>>({
    acid: false,
    co2: false,
    bpg: true,
    hbf: false,
  });
  const toggle = (k: ToggleKey) => setOn((s) => ({ ...s, [k]: !s[k] }));
  const active = FACTORS.filter((f) => on[f.key]);

  return (
    <figure className={cn("my-8 w-full scroll-mt-24 lg:my-12", className)}>
      <div className="mx-auto w-full max-w-xl">
        <div className="w-full rounded-lg bg-white px-0 py-3 sm:px-3">
          <svg
            viewBox="0 0 440 210"
            className="block h-auto w-full"
            role="img"
            aria-labelledby="shift-title shift-desc"
            fontFamily="inherit"
          >
            <title id="shift-title">Tuning hemoglobin's oxygen affinity</title>
            <desc id="shift-desc">
              The baseline normal-hemoglobin saturation curve with optional
              comparison curves for acid, carbon dioxide, 2,3-BPG and fetal
              hemoglobin. Each shifts the curve left or right; the pressure at
              which it crosses 50% saturation (P50) marks its affinity.
            </desc>

            <ChartFrame />

            {/* P50 reference: a marker on the 50% line for the baseline and each
                visible curve, so the reader can watch P50 slide left and right */}
            <text x={PLOT.X0 + 6} y={py(0.5) - 5} fill={CHART.tick} fontSize={10} textAnchor="start">
              P₅₀
            </text>

            {/* baseline curve (always shown) */}
            <path d={BASELINE_D} fill="none" stroke={CHART.curve} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

            {/* comparison curves */}
            {active.map((f) => (
              <path
                key={f.key}
                d={curvePath(f.p50)}
                fill="none"
                stroke={f.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* P50 dots on the 50% line */}
            <circle cx={px(P50)} cy={py(0.5)} r={3.5} fill={CHART.curve} stroke="#fff" strokeWidth={1.5} />
            {active.map((f) => (
              <circle key={f.key} cx={px(f.p50)} cy={py(0.5)} r={3.5} fill={f.color} stroke="#fff" strokeWidth={1.5} />
            ))}
          </svg>
        </div>

        {/* legend + controls: baseline is fixed, each factor toggles its curve;
            the P50 lives in a tooltip so the chips stay clean */}
        <TooltipProvider delayDuration={150}>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex cursor-default items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART.curve }} />
                  normal HbA
                </span>
              </TooltipTrigger>
              <TooltipContent>P₅₀ of {P50} — the resting set point</TooltipContent>
            </Tooltip>
            {FACTORS.map((f) => (
              <Tooltip key={f.key}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toggle(f.key)}
                    aria-pressed={on[f.key]}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors"
                    style={
                      on[f.key]
                        ? { borderColor: f.color, color: f.color, backgroundColor: `${f.color}14` }
                        : { borderColor: "#e2e8f0", color: "#64748b" }
                    }
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.color }} />
                    {f.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{f.tip}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </figure>
  );
}
