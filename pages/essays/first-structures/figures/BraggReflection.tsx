import { useState } from "react";
import { XR } from "./palette";
import { TAU, combined, wavePath } from "./wave";
import { Caption, Note, SliderRow } from "./controls";

const TOP = 12;
const LEFT = 44;
const RIGHT = 716;
const BOTTOM = 228;
const ATOM_X0 = 64;
const ATOM_GAP = 32;
const ATOMS = 21;
// The rays turn on an atom, so this has to stay on the lattice: ATOM_X0 + k·ATOM_GAP.
const O = { x: ATOM_X0 + 10 * ATOM_GAP, y: 104 };
const PX_PER_A = 19;
const MAX_RAY = 180;
const ARC_R = 38;

const W_X0 = 128;
const W_LEN = 600;
const W_LAM = 54;

export default function BraggReflection() {
  const [theta, setTheta] = useState(22.5);
  const [d, setD] = useState(4);
  const [lambda, setLambda] = useState(1.54);

  const th = (theta * Math.PI) / 180;
  const sin = Math.sin(th);
  const cos = Math.cos(th);

  const extra = 2 * d * sin;
  const ratio = extra / lambda;
  const order = Math.round(ratio);
  const reinforced = order >= 1 && Math.abs(ratio - order) < 0.04;
  const amplitude = combined(ratio);
  const intensity = amplitude * amplitude;

  const gap = d * PX_PER_A;
  const sheets: number[] = [];
  for (let y = O.y; y <= BOTTOM; y += gap) sheets.push(y);

  const ray = Math.min(
    MAX_RAY,
    (O.y - TOP) / sin,
    (O.x - LEFT) / cos,
    (RIGHT - O.x) / cos
  );
  const second = { x: O.x, y: O.y + gap };
  const lead = gap * sin;

  const beam = (origin: { x: number; y: number }) => ({
    from: { x: origin.x - ray * cos, y: origin.y - ray * sin },
    to: { x: origin.x + ray * cos, y: origin.y - ray * sin },
  });
  const upper = beam(O);
  const lower = beam(second);
  const foot = {
    in: { x: second.x - lead * cos, y: second.y - lead * sin },
    out: { x: second.x + lead * cos, y: second.y - lead * sin },
  };

  const combinedColor = reinforced ? XR.accent : XR.sum;
  const labelY = Math.max(upper.from.y - 6, 13);

  return (
    <figure className="mx-auto my-8 w-full max-w-[40rem] lg:my-12 lg:max-w-[52rem]">
      <svg
        viewBox="0 0 760 250"
        className="h-auto w-full"
        role="img"
        aria-label={`X-rays at a glancing angle of ${theta} degrees reflecting from sheets ${d} ångströms apart`}
      >
        {sheets.map((y, i) => (
          <g key={y} opacity={i < 2 ? 1 : 0.45}>
            <line x1={56} y1={y} x2={704} y2={y} stroke={XR.rule} />
            {Array.from({ length: ATOMS }, (_, k) => (
              <circle
                key={k}
                cx={ATOM_X0 + k * ATOM_GAP}
                cy={y}
                r={3.2}
                fill={XR.atom}
              />
            ))}
          </g>
        ))}

        <g
          stroke={XR.second}
          strokeWidth={8}
          strokeOpacity={0.32}
          strokeLinecap="round"
        >
          <line x1={foot.in.x} y1={foot.in.y} x2={second.x} y2={second.y} />
          <line x1={second.x} y1={second.y} x2={foot.out.x} y2={foot.out.y} />
        </g>

        <g stroke={XR.first} strokeWidth={reinforced ? 3 : 2.2}>
          <line x1={upper.from.x} y1={upper.from.y} x2={O.x} y2={O.y} />
          <line x1={O.x} y1={O.y} x2={upper.to.x} y2={upper.to.y} />
        </g>
        <g stroke={XR.second} strokeWidth={reinforced ? 3 : 2.2}>
          <line
            x1={lower.from.x}
            y1={lower.from.y}
            x2={second.x}
            y2={second.y}
          />
          <line x1={second.x} y1={second.y} x2={lower.to.x} y2={lower.to.y} />
        </g>

        <g fill={XR.atom}>
          <circle cx={O.x} cy={O.y} r={4.4} />
          <circle cx={second.x} cy={second.y} r={4.4} />
        </g>

        <g stroke={XR.atom} strokeDasharray="4 4">
          <line x1={O.x} y1={O.y} x2={foot.in.x} y2={foot.in.y} />
          <line x1={O.x} y1={O.y} x2={foot.out.x} y2={foot.out.y} />
        </g>

        <path
          d={`M${O.x - ARC_R} ${O.y}A${ARC_R} ${ARC_R} 0 0 1 ${(O.x - ARC_R * cos).toFixed(1)} ${(O.y - ARC_R * sin).toFixed(1)}`}
          fill="none"
          stroke={XR.label}
        />
        <line x1={722} y1={O.y} x2={722} y2={second.y} stroke={XR.label} />

        <g className="font-mono" fontSize={12} fill={XR.label}>
          <text x={upper.from.x - 10} y={labelY} textAnchor="end">
            incoming X-rays
          </text>
          <text x={upper.to.x + 10} y={labelY}>
            reflected
          </text>
          <text x={64} y={O.y - 10}>
            sheet 1
          </text>
          <text x={64} y={second.y - 10}>
            sheet 2
          </text>
          <text x={O.x - ARC_R - 22} y={O.y - 8}>
            θ
          </text>
          <text x={728} y={(O.y + second.y) / 2 + 4}>
            d
          </text>
          <text x={second.x + 16} y={second.y + 20} fill={XR.second}>
            extra path = 2d·sin θ
          </text>
        </g>
      </svg>

      <svg
        viewBox="0 0 760 132"
        className="h-auto w-full"
        role="img"
        aria-label="The two reflected waves and their sum"
      >
        <path
          d={wavePath(W_X0, 26, W_LEN, 11, W_LAM, [0])}
          fill="none"
          stroke={XR.first}
          strokeWidth={2.2}
        />
        <path
          d={wavePath(W_X0, 66, W_LEN, 11, W_LAM, [TAU * ratio])}
          fill="none"
          stroke={XR.second}
          strokeWidth={2.2}
        />
        <path
          d={wavePath(W_X0, 112, W_LEN, 10, W_LAM, [0, TAU * ratio])}
          fill="none"
          stroke={combinedColor}
          strokeWidth={2.6}
        />
        <g
          className="font-mono"
          fontSize={12}
          fill={XR.label}
          textAnchor="end"
        >
          <text x={W_X0 - 14} y={30}>
            from sheet 1
          </text>
          <text x={W_X0 - 14} y={70}>
            from sheet 2
          </text>
          <text x={W_X0 - 14} y={116} fill={combinedColor}>
            combined
          </text>
        </g>
      </svg>

      <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
        <SliderRow
          label="glancing angle θ"
          value={theta}
          display={`${theta.toFixed(1)}°`}
          min={5}
          max={80}
          step={0.5}
          onChange={setTheta}
        />
        <SliderRow
          label="sheet spacing d"
          value={d}
          display={`${d.toFixed(2)} Å`}
          min={2}
          max={6}
          step={0.05}
          onChange={setD}
        />
        <SliderRow
          label="wavelength λ"
          value={lambda}
          display={`${lambda.toFixed(2)} Å`}
          min={0.6}
          max={3}
          step={0.02}
          onChange={setLambda}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-400">
        <span>2d·sin θ = {extra.toFixed(2)} Å</span>
        <span>λ = {lambda.toFixed(2)} Å</span>
        <span className="text-ink-700">
          extra path = {ratio.toFixed(2)} wavelengths
        </span>
        <span className="flex items-center gap-3">
          <span className="block h-1.5 w-28 overflow-hidden rounded-full bg-ink-100">
            <span
              className="block h-full transition-[width] duration-100"
              style={{
                width: `${(intensity * 100).toFixed(1)}%`,
                backgroundColor: combinedColor,
              }}
            />
          </span>
          {Math.round(intensity * 100)}% reflected
        </span>
      </div>

      <Note>
        {reinforced
          ? `Bragg condition met, n = ${order}. The two reflections are in phase and reinforce into a beam strong enough to mark the plate.`
          : intensity > 0.4
            ? `Just off the condition — ${ratio.toFixed(2)} wavelengths rather than a whole number, so the two reflections are slightly out of step.`
            : "The extra path is nowhere near a whole number of wavelengths. The two reflections are out of step and largely cancel."}
      </Note>

      <Caption>
        A beam meets a family of lattice sheets at a glancing angle θ, and the
        ray reflected from the sheet below travels an extra 2d·sin θ. The two
        reinforce only where that extra distance is a whole number of
        wavelengths — n·λ = 2d·sin θ — which is what turns a measured angle into
        a spacing.
      </Caption>
    </figure>
  );
}
