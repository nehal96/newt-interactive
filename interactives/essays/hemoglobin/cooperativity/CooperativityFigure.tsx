import { useState } from "react";
import SaturationCurveChart from "./SaturationCurveChart";

/**
 * The one interactive for Section 4: a single saturation-curve chart with a row of
 * toggle buttons beneath it. Each button layers one idea onto the same chart —
 * the myoglobin comparison, the P50 marker, the tissue O₂ levels, and the
 * right-shift of an exercising muscle. A deliberately simple starting point; the
 * beats and prose can be rearranged around it later.
 */

type ToggleKey = "myoglobin" | "p50" | "tissues" | "exercising";

const TOGGLES: { key: ToggleKey; label: string; dot: string }[] = [
  { key: "myoglobin", label: "Myoglobin", dot: "#6366f1" },
  { key: "p50", label: "Half-saturation (P₅₀)", dot: "#1e293b" },
  { key: "tissues", label: "Tissue O₂ levels", dot: "#c43a31" },
  { key: "exercising", label: "Exercising muscle", dot: "#ea580c" },
];

export default function CooperativityFigure() {
  const [on, setOn] = useState<Record<ToggleKey, boolean>>({
    myoglobin: false,
    p50: false,
    tissues: false,
    exercising: false,
  });

  const toggle = (k: ToggleKey) => setOn((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div>
      <div className="rounded-lg bg-white">
        <SaturationCurveChart
          showMyoglobin={on.myoglobin}
          showP50={on.p50}
          showTissues={on.tissues}
          exercising={on.exercising}
        />
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {TOGGLES.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={on[t.key]}
            onClick={() => toggle(t.key)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
              on[t.key]
                ? "border-slate-800 bg-slate-800 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: t.dot }}
            />
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
