// The film records a wave's height but not its offset: the phase problem.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";

const COLUMNS = [
  { header: "A wave", height: 1, shift: 0 },
  { header: "Crests shifted", height: 1, shift: 0.25 },
  { header: "Twice as tall", height: 2, shift: 0 },
];

const MAX_DARKNESS = Math.max(...COLUMNS.map((c) => c.height ** 2));

export function WhatTheFilmKeeps() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const gap = narrow ? 14 : 28;
  const colW = (W - 2 * gap) / 3;
  const lambda = colW / 2;
  const amp = narrow ? 8 : 11;
  const text = narrow ? 10 : 11;

  const top = 30;
  const base = top + 2 * amp + 2;
  const waveBottom = base + 2 * amp + 2;
  const film = Math.min(colW * 0.55, 64);
  const filmY = waveBottom + 18;
  const darknessY = filmY + film + 16;
  const H = darknessY + 4;

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>
          The film keeps how tall a wave is, but not where its crests fall.
        </title>
        <desc id={`${ids}d`}>
          Three waves and the spot each leaves on the film. A wave of height 1
          gives a spot of darkness 1. The same wave with its crests shifted a
          quarter of a wavelength gives the same spot. A wave of height 2 gives
          a spot of darkness 4.
        </desc>

        {COLUMNS.map(({ header, height, shift }, i) => {
          const x = i * (colW + gap);
          const c0 = lambda / 2;
          const f = (t: number) =>
            height * amp * Math.cos((TAU * (t - c0 - shift * lambda)) / lambda);
          const crests: number[] = [];
          for (let c = c0; c <= colW + 0.5; c += lambda) crests.push(c);
          const darkness = height ** 2;
          const bx0 = x + c0;
          const bx1 = bx0 + shift * lambda;
          const by = base - amp - 6;
          const cx = x + colW / 2;

          return (
            <g key={header}>
              <text
                x={x}
                y={14}
                className="font-ui"
                fontSize={narrow ? 11 : 12}
                fontWeight={600}
                fill={XR.sum}
              >
                {header}
              </text>

              <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3">
                {crests.map((c) => (
                  <line key={c} x1={x + c} x2={x + c} y1={top - 4} y2={waveBottom} />
                ))}
              </g>
              <line x1={x} x2={x + colW} y1={base} y2={base} stroke={XR.rule} />
              <path
                d={curvePath(x, base, colW, f, 1)}
                fill="none"
                stroke={XR.first}
                strokeWidth={2}
                strokeLinejoin="round"
              />

              {shift > 0 && (
                <g stroke={XR.accent} strokeWidth={1.25}>
                  <line x1={bx0} x2={bx1} y1={by} y2={by} />
                  <line x1={bx0} x2={bx0} y1={by - 3} y2={by + 3} />
                  <line x1={bx1} x2={bx1} y1={by - 3} y2={by + 3} />
                </g>
              )}

              <rect
                x={cx - film / 2}
                y={filmY}
                width={film}
                height={film}
                fill={XR.film}
                stroke={XR.atom}
                strokeWidth={0.75}
              />
              <circle
                cx={cx}
                cy={filmY + film / 2}
                r={Math.max(5, film / 9)}
                fill={XR.sum}
                fillOpacity={darkness / MAX_DARKNESS}
              />
              <text
                x={cx}
                y={darknessY}
                textAnchor="middle"
                className="font-mono"
                fontSize={text}
                fill={XR.label}
              >
                darkness {darkness}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
