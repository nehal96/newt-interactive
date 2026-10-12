// Pick a window of α and a window of β and score them as Fitch did.
import { useState } from "react";
import { cn } from "@lib/utils";
import { Slider } from "@ui/controls";
import { FITCH_1966, windowMR } from "../../core/fitch";
import Panel from "../Panel";
import { RW } from "../palette";
import { ALPHA, BETA, WINDOW, alphaBeta } from "./data";
import WindowStrip from "./WindowStrip";

const PRESETS = [
  { label: "Both from the start", i: 0, j: 0 },
  { label: "α 2, β 3", i: 1, j: 2 },
  { label: "α 81, β 86", i: 80, j: 85 },
  { label: "α 60, β 20", i: 59, j: 19 },
];

export function WindowScore({ value }: { value: number }) {
  const { mean } = alphaBeta();
  const under = value <= FITCH_1966.cutoff;
  return (
    <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-ui tabular-nums text-ink-600" aria-live="polite">
      <span>
        <span className="text-lg font-semibold" style={{ color: under ? RW.matchInk : RW.residue }}>
          {value}
        </span>{" "}
        mutations at least
      </span>
      <span className="text-sm text-ink-400">chance averages {mean.toFixed(1)}</span>
      <span className="text-sm" style={{ color: under ? RW.matchInk : RW.label }}>
        {under ? `at or under Fitch's cutoff of ${FITCH_1966.cutoff}` : `Fitch's cutoff is ${FITCH_1966.cutoff}`}
      </span>
    </p>
  );
}

function StartSlider({
  label,
  max,
  value,
  onChange,
}: {
  label: string;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex justify-between font-ui text-sm text-ink-600">
        <span>{label}</span>
        <span className="tabular-nums text-ink-900">{value + 1}</span>
      </span>
      <Slider value={[value]} min={0} max={max} step={1} onValueChange={([v]) => onChange(v)} />
    </label>
  );
}

export default function WindowPair() {
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const value = windowMR(ALPHA.seq, BETA.seq, i, j, WINDOW);

  return (
    <Panel>
      <WindowStrip top={ALPHA} bottom={BETA} i={i} j={j} length={WINDOW} />
      <div className="mt-4">
        <WindowScore value={value} />
      </div>
      <div className="mt-5 grid gap-5 border-t border-ink-100 pt-5 sm:grid-cols-2">
        <StartSlider label="α window starts at" max={ALPHA.seq.length - WINDOW} value={i} onChange={setI} />
        <StartSlider label="β window starts at" max={BETA.seq.length - WINDOW} value={j} onChange={setJ} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 font-ui text-sm">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setI(p.i);
              setJ(p.j);
            }}
            className={cn(
              "rounded-md border px-2.5 py-1 transition-colors",
              i === p.i && j === p.j
                ? "border-ink-400 text-ink-900"
                : "border-ink-200 text-ink-600 hover:border-ink-400"
            )}
          >
            {p.label}
          </button>
        ))}
        <span className="ml-auto tabular-nums text-ink-500">register shift {i - j}</span>
      </div>
    </Panel>
  );
}
