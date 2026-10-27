// One wave: its height sets how dark it makes the film, its phase only where its crests fall.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { Readouts, SliderRow } from "../controls";

export function OneWave() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [h, setH] = useState(1);
  const [d, setD] = useState(0.25);

  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const film = narrow ? 56 : 72;
  const x0 = 4;
  const waveW = W - film - (narrow ? 20 : 36) - x0;
  const lambda = waveW / 3;
  const unit = narrow ? 14 : 18;
  const top = 34;
  const axis = top + 2 * unit + 8;
  const H = axis + 2 * unit + 34;
  const wave = (t: number) => h * unit * Math.cos((TAU * (t - d * lambda)) / lambda);
  const crest = x0 + d * lambda;
  const nextCrest = crest + lambda;
  const tall = crest + 2 * lambda;
  const fx = W - film;
  const fy = axis - film / 2;
  const darkness = Math.min(0.92, (0.9 * h * h) / 4);

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>A wave's height sets how dark it makes the film; its phase only shifts its crests</title>
        <desc id={`${ids}d`}>
          A wave of height {h.toFixed(2)} whose first crest sits {d.toFixed(2)} of a wavelength past the starting line,
          beside a patch of film darkened by height squared, {(h * h).toFixed(2)}.
        </desc>

        <line x1={x0} x2={x0 + waveW} y1={axis} y2={axis} stroke={XR.rule} />
        <line x1={x0} x2={x0} y1={top - 6} y2={H - 22} stroke={XR.atom} strokeDasharray="3 3" />
        <path d={curvePath(x0, axis, waveW, wave, 1)} fill="none" stroke={XR.first} strokeWidth={2} />

        <g stroke={XR.label} strokeWidth={1}>
          <line x1={crest} x2={nextCrest} y1={top - 10} y2={top - 10} />
          <line x1={crest} x2={crest} y1={top - 13} y2={top - 7} />
          <line x1={nextCrest} x2={nextCrest} y1={top - 13} y2={top - 7} />
          <line x1={tall} x2={tall} y1={axis} y2={axis - h * unit} strokeDasharray="2 2" />
          {d > 0.02 && <line x1={x0} x2={crest} y1={axis + 2 * unit + 12} y2={axis + 2 * unit + 12} stroke={XR.accent} />}
        </g>

        <rect x={fx} y={fy} width={film} height={film} fill={XR.film} />
        <rect x={fx} y={fy} width={film} height={film} fill={XR.sum} fillOpacity={darkness} />
        <rect x={fx} y={fy} width={film} height={film} fill="none" stroke={XR.atom} strokeWidth={0.75} />

        <Labels size={text}>
          <text x={(crest + nextCrest) / 2} y={top - 16} textAnchor="middle">1 wavelength</text>
          <text x={tall} y={axis - h * unit - 7} textAnchor="middle">height</text>
          <text x={x0 + 4} y={H - 4}>starting line</text>
          {d > 0.02 && (
            <text x={Math.max(x0 + 100, crest + 6)} y={axis + 2 * unit + 16} fill={XR.accent}>
              phase: {narrow ? "crest" : "first crest"} {d.toFixed(2)} wave along
            </text>
          )}
          <text x={fx + film / 2} y={fy - 8} textAnchor="middle">film</text>
        </Labels>
      </svg>

      <div className="mt-4 flex flex-col gap-5">
        <SliderRow label="Height" value={h} display={h.toFixed(2)} min={0.25} max={2} step={0.05} onChange={setH} />
        <SliderRow
          label="Slide the wave"
          value={d}
          display={`${d.toFixed(2)} of a wavelength`}
          min={0}
          max={1}
          step={0.01}
          onChange={setD}
        />
      </div>
      <Readouts items={[["Darkness, height²", (h * h).toFixed(2)]]} />
    </div>
  );
}
