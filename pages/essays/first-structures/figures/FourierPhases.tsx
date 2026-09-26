import { useState } from "react";
import { Button } from "@ui/controls";
import { XR } from "./palette";
import { TAU } from "./wave";
import { Caption, Note, SliderRow } from "./controls";

const SAMPLES = 512;
const N_TERMS = 14;
const SPREAD = 0.018;
const ATOMS = [
  { x: 0.15, f: 6 },
  { x: 0.32, f: 8 },
  { x: 0.55, f: 26 },
  { x: 0.8, f: 7 },
];

const density = new Float64Array(SAMPLES);
for (const atom of ATOMS) {
  for (let i = 0; i < SAMPLES; i++) {
    const raw = Math.abs(i / SAMPLES - atom.x);
    const dx = Math.min(raw, 1 - raw);
    density[i] += atom.f * Math.exp(-(dx * dx) / (2 * SPREAD * SPREAD));
  }
}

const MEAN = density.reduce((sum, v) => sum + v, 0) / SAMPLES;
const PEAK = Math.max(...Array.from(density));

const AMPLITUDE: number[] = [0];
const PHASE: number[] = [0];
for (let h = 1; h <= N_TERMS; h++) {
  let re = 0;
  let im = 0;
  for (let i = 0; i < SAMPLES; i++) {
    const angle = (TAU * h * i) / SAMPLES;
    re += density[i] * Math.cos(angle);
    im += density[i] * Math.sin(angle);
  }
  re *= 2 / SAMPLES;
  im *= 2 / SAMPLES;
  AMPLITUDE[h] = Math.hypot(re, im);
  PHASE[h] = Math.atan2(im, re);
}
const LOUDEST = Math.max(...AMPLITUDE.slice(1));

const X0 = 46;
const LEN = 620;
const TERM_BASE = 84;
const SUM_BASE = 296;
const TERM_SCALE = 36 / LOUDEST;
const SUM_SCALE = 96 / PEAK;
// Random phases send the sum well below zero; without a floor it leaves the box.
const FLOOR = -42 / SUM_SCALE;

const term = (h: number, x: number, phases: number[]) =>
  AMPLITUDE[h] * Math.cos(TAU * h * x - phases[h]);

function curve(
  base: number,
  scale: number,
  at: (x: number) => number,
  step = 2
) {
  let d = `M${X0} ${(base - at(0) * scale).toFixed(2)}`;
  for (let px = step; px <= LEN; px += step)
    d += `L${X0 + px} ${(base - at(px / LEN) * scale).toFixed(2)}`;
  return d;
}

export default function FourierPhases() {
  const [terms, setTerms] = useState(3);
  const [scrambled, setScrambled] = useState<number[] | null>(null);

  const phases = scrambled ?? PHASE;
  const wrong = scrambled !== null;

  const scramble = () =>
    setScrambled([0, ...Array.from({ length: N_TERMS }, () => Math.random() * TAU)]);

  const sum = (x: number) => {
    let v = MEAN;
    for (let h = 1; h <= terms; h++) v += term(h, x, phases);
    return Math.max(v, FLOOR);
  };

  const sumColor = wrong ? XR.accent : XR.first;

  const note = wrong
    ? `Same ${terms} amplitudes, phases thrown away. The sum is not a blurrier version of the structure — it is a different one.`
    : terms === 0
      ? "No terms: the average density, and nothing located."
      : terms <= 3
        ? "Coarse terms only — one broad hill over the heavy atom. A very low resolution map."
        : terms <= 8
          ? "The heavy atom is sharp; the light ones are coming out of the blur."
          : "All four atoms resolved. The fine terms carry the fine detail.";

  return (
    <figure className="mx-auto my-8 w-full max-w-[40rem] lg:my-12 lg:max-w-[52rem]">
      <svg
        viewBox="0 0 700 340"
        className="h-auto w-full"
        role="img"
        aria-label={`Electron density rebuilt from ${terms} Fourier terms with ${wrong ? "random" : "correct"} phases`}
      >
        <line
          x1={X0}
          y1={TERM_BASE}
          x2={X0 + LEN}
          y2={TERM_BASE}
          stroke={XR.rule}
        />
        {Array.from({ length: terms }, (_, i) => i + 1).map((h) => (
          <path
            key={h}
            d={curve(TERM_BASE, TERM_SCALE, (x) => term(h, x, phases), 3)}
            fill="none"
            stroke={XR.second}
            strokeWidth={1.4}
            strokeOpacity={0.55}
          />
        ))}

        <path
          d={`${curve(SUM_BASE, SUM_SCALE, (x) => density[Math.floor(x * SAMPLES) % SAMPLES])}L${X0 + LEN} ${SUM_BASE}L${X0} ${SUM_BASE}Z`}
          fill={XR.rule}
          stroke="none"
        />
        <path
          d={curve(SUM_BASE, SUM_SCALE, sum)}
          fill="none"
          stroke={sumColor}
          strokeWidth={2.6}
        />
        {ATOMS.map((atom) => (
          <line
            key={atom.x}
            x1={X0 + atom.x * LEN}
            y1={SUM_BASE + 4}
            x2={X0 + atom.x * LEN}
            y2={SUM_BASE + 11}
            stroke={XR.atom}
          />
        ))}

        <g className="font-mono" fontSize={12} fill={XR.label}>
          <text x={X0} y={24}>
            the individual waves — terms 1 to {terms}
          </text>
          <text x={X0} y={190}>
            their sum against the true density
          </text>
        </g>
      </svg>

      <div className="mt-6">
        <SliderRow
          label="Terms included"
          value={terms}
          display={`${terms} of ${N_TERMS}`}
          min={0}
          max={N_TERMS}
          step={1}
          onChange={setTerms}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          variant={wrong ? "outline" : "secondary"}
          onClick={() => setScrambled(null)}
          aria-pressed={!wrong}
          className="text-sm"
        >
          Correct phases
        </Button>
        <Button
          variant={wrong ? "secondary" : "outline"}
          onClick={scramble}
          aria-pressed={wrong}
          className="text-sm"
        >
          Random phases
        </Button>
      </div>

      <Note>{note}</Note>

      <Caption>
        A one-dimensional unit cell holding four atoms, one of them heavy. Grey
        is the true electron density; the curve is the Fourier sum of the terms
        included. Each term is one reflection: its position on the plate says
        which wave, its blackness gives the amplitude — and its phase, where the
        crests sit in the cell, is what the photograph destroys. Resolution is
        exactly the fineness of the terms you have. Phases are what you cannot
        measure, and, as the second button shows, they carry more of the
        structure than the amplitudes do.
      </Caption>
    </figure>
  );
}
