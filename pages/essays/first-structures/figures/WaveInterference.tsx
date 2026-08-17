import { useState } from "react";
import { XR } from "./palette";
import { TAU, combined, wavePath } from "./wave";
import { Caption, Note, SliderRow } from "./controls";

const X0 = 84;
const LEN = 592;
const LAM = 66;
const AMP = 15;
const SUM_AMP = 13;

const A_Y = 44;
const B_Y = 110;
const SUM_Y = 190;

export default function WaveInterference() {
  const [shift, setShift] = useState(0);
  const phase = TAU * shift;
  const amplitude = combined(shift);

  const rows = [
    { y: A_Y, label: "wave A", color: XR.first, phases: [0], amp: AMP, weight: 2.2 },
    { y: B_Y, label: "wave B", color: XR.second, phases: [phase], amp: AMP, weight: 2.2 },
    { y: SUM_Y, label: "A + B", color: XR.sum, phases: [0, phase], amp: SUM_AMP, weight: 2.6 },
  ];

  const note =
    amplitude > 0.96
      ? "crest on crest — the amplitudes add"
      : amplitude < 0.06
        ? "crest on trough — the waves cancel"
        : `partial cancellation — ${Math.round(amplitude * 100)}% of full amplitude`;

  return (
    <figure className="mx-auto my-8 w-full max-w-[40rem] lg:my-12 lg:max-w-[48rem]">
      <svg
        viewBox="0 0 700 232"
        className="h-auto w-full"
        role="img"
        aria-label={`Two waves ${shift.toFixed(2)} wavelengths apart, and their sum`}
      >
        {rows.map((row) => (
          <g key={row.label}>
            <line
              x1={X0}
              y1={row.y}
              x2={X0 + LEN}
              y2={row.y}
              stroke={XR.rule}
            />
            <path
              d={wavePath(X0, row.y, LEN, row.amp, LAM, row.phases)}
              fill="none"
              stroke={row.color}
              strokeWidth={row.weight}
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

      <div className="mt-6">
        <SliderRow
          label="extra distance travelled by wave B"
          value={shift}
          display={`${shift.toFixed(2)} λ`}
          min={0}
          max={2}
          step={0.01}
          onChange={setShift}
        />
      </div>

      <Note>{note}</Note>

      <Caption>
        Two waves of the same wavelength arriving along the same path. What sets
        the combined amplitude is the path difference — how far one has
        travelled beyond the other. A whole number of wavelengths reinforces, a
        half cancels, anything between falls between.
      </Caption>
    </figure>
  );
}
