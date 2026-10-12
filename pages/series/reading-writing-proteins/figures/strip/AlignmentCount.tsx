// How many alignments two sequences have, under both ways of counting.
import { useState } from "react";
import { Slider } from "@ui/controls";
import { alignmentsBinomial, alignmentsDelannoy, formatBig } from "../../core/count";

const PRESETS = [
  { label: "6 × 6", n: 6, m: 6 },
  { label: "20 × 22, the globin fragment", n: 20, m: 22 },
  { label: "146 × 153, β against myoglobin", n: 146, m: 153 },
];

function Big({ value }: { value: bigint }) {
  const { mantissa, exponent } = formatBig(value);
  return (
    <span className="font-mono tabular-nums text-ink-900">
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
        <span className="font-mono tabular-nums text-ink-900">{value}</span>
      </span>
      <Slider value={[value]} min={1} max={160} step={1} onValueChange={([v]) => onChange(v)} />
    </label>
  );
}

export default function AlignmentCount() {
  const [n, setN] = useState(6);
  const [m, setM] = useState(6);

  return (
    <figure className="my-8 w-full max-w-prose self-center">
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
            className="rounded-md border border-ink-200 px-2.5 py-1 text-ink-700 hover:border-ink-400"
          >
            {p.label}
          </button>
        ))}
      </div>
      <dl className="mt-6 grid gap-4 font-ui text-sm text-ink-600 sm:grid-cols-2">
        <div>
          <dt>Alignments, ignoring the order of neighbouring gaps</dt>
          <dd className="mt-1 text-2xl">
            <Big value={alignmentsBinomial(n, m)} />
          </dd>
        </div>
        <div>
          <dt>Alignments, counting that order</dt>
          <dd className="mt-1 text-2xl">
            <Big value={alignmentsDelannoy(n, m)} />
          </dd>
        </div>
      </dl>
    </figure>
  );
}
