import { useState } from "react";
import { Button } from "@ui/controls";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { Readouts, SliderRow } from "./controls";

const X0 = 84;
const LEN = 592;
const PX_PER_A = 130;
const AMP = 28;

const ROWS = { first: 44, second: 118, sum: 218 };

export default function WavesAddUp() {
  const [h1, setH1] = useState(1);
  const [h2, setH2] = useState(0.6);
  const [offset, setOffset] = useState(1 / 6);
  const [lambda, setLambda] = useState(1.54);

  const d = TAU * offset;
  const height = Math.sqrt(Math.max(h1 * h1 + h2 * h2 + 2 * h1 * h2 * Math.cos(d), 0));
  const wave = (h: number, p: number) => (x: number) =>
    AMP * h * Math.cos((TAU * x) / (lambda * PX_PER_A) - p);

  const rows = [
    { y: ROWS.first, label: "wave 1", color: XR.first, f: wave(h1, 0) },
    { y: ROWS.second, label: "wave 2", color: XR.second, f: wave(h2, d) },
    {
      y: ROWS.sum,
      label: "sum",
      color: XR.sum,
      f: (x: number) => wave(h1, 0)(x) + wave(h2, d)(x),
    },
  ];

  return (
    <figure className="mx-auto my-8 w-full max-w-[40rem] lg:my-12 lg:max-w-[48rem]">
      <svg
        viewBox="0 0 700 280"
        className="h-auto w-full"
        role="img"
        aria-label={`Two waves ${offset.toFixed(2)} of a wave apart, and the wave they make when added`}
      >
        {rows.map((row) => (
          <g key={row.label}>
            <line x1={X0} y1={row.y} x2={X0 + LEN} y2={row.y} stroke={XR.rule} />
            <path
              d={curvePath(X0, row.y, LEN, row.f)}
              fill="none"
              stroke={row.color}
              strokeWidth={row.label === "sum" ? 2.6 : 2.2}
            />
            <text
              x={X0 - 14}
              y={row.y + 4}
              textAnchor="end"
              className="font-mono"
              fontSize={12}
              fill={XR.label}
            >
              {row.label}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        <SliderRow
          label="Amplitude of wave 1"
          value={h1}
          display={h1.toFixed(2)}
          min={0.2}
          max={1}
          step={0.05}
          onChange={setH1}
        />
        <SliderRow
          label="Amplitude of wave 2"
          value={h2}
          display={h2.toFixed(2)}
          min={0.2}
          max={1}
          step={0.05}
          onChange={setH2}
        />
        <SliderRow
          label="Wavelength (both waves)"
          value={lambda}
          display={`${lambda.toFixed(2)} Å`}
          min={0.8}
          max={2.5}
          step={0.01}
          onChange={setLambda}
        />
        <SliderRow
          label="Phase (offset)"
          value={offset}
          display={`${offset.toFixed(2)} of a wave`}
          min={0}
          max={1}
          step={0.01}
          onChange={setOffset}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant={offset === 0 ? "secondary" : "outline"}
          onClick={() => setOffset(0)}
          aria-pressed={offset === 0}
          className="text-sm"
        >
          In step
        </Button>
        <Button
          variant={offset === 0.5 ? "secondary" : "outline"}
          onClick={() => setOffset(0.5)}
          aria-pressed={offset === 0.5}
          className="text-sm"
        >
          Half a wave apart
        </Button>
      </div>

      <Readouts
        items={[
          ["Amplitude of the sum", height.toFixed(2)],
          ["Brightness (amplitude squared)", (height * height).toFixed(2)],
        ]}
      />

    </figure>
  );
}
