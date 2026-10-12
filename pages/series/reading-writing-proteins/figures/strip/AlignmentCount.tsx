// How many alignments two sequences have, under both ways of counting.
import { useState } from "react";
import { cn } from "@lib/utils";
import { Slider } from "@ui/controls";
import Panel from "../Panel";
import { alignmentsBinomial, alignmentsDelannoy, formatBig } from "../../core/count";

const PRESETS = [
  { label: "6 × 6", n: 6, m: 6 },
  { label: "20 × 22, the globin fragment", n: 20, m: 22 },
  { label: "146 × 153, β against myoglobin", n: 146, m: 153 },
];

function Big({ value }: { value: bigint }) {
  const { mantissa, exponent } = formatBig(value);
  return (
    <span className="font-ui tabular-nums text-ink-900">
      {exponent === null ? (
        mantissa
      ) : (
        <>
          {mantissa} × 10<sup>{exponent}</sup>
        </>
      )}
    </span>
  );
}

function LengthSlider({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="flex justify-between font-ui text-sm text-ink-600">
        <span>{label}</span>
        <span className="tabular-nums text-ink-900">{value}</span>
      </span>
      <Slider value={[value]} min={1} max={160} step={1} onValueChange={([v]) => onChange(v)} />
    </label>
  );
}

export default function AlignmentCount() {
  const [n, setN] = useState(6);
  const [m, setM] = useState(6);

  return (
    <Panel>
      <div className="grid gap-5 sm:grid-cols-2">
        <LengthSlider label="Length of the first sequence" value={n} onChange={setN} />
        <LengthSlider label="Length of the second sequence" value={m} onChange={setM} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 font-ui text-sm">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setN(p.n);
              setM(p.m);
            }}
            className={cn(
              "rounded-md border px-2.5 py-1 transition-colors",
              n === p.n && m === p.m
                ? "border-ink-400 text-ink-900"
                : "border-ink-200 text-ink-600 hover:border-ink-400"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <dl className="mt-5 grid gap-4 border-t border-ink-100 pt-5 font-ui text-sm text-ink-600 sm:grid-cols-2">
        <div>
          <dt>Counting only which residues pair</dt>
          <dd className="mt-1 text-2xl">
            <Big value={alignmentsBinomial(n, m)} />
          </dd>
        </div>
        <div>
          <dt>Also counting the order of gaps</dt>
          <dd className="mt-1 text-2xl">
            <Big value={alignmentsDelannoy(n, m)} />
          </dd>
        </div>
      </dl>
    </Panel>
  );
}
