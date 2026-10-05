// The 1943 density profile through a layer of the crystal, computed from the seven signed 00l waves.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { Labels } from "./scene";

/** Boyes-Watson, Davidson & Perutz 1947, table 7 (unit cell 5), with the signs settled in their table 9 and p. 120. */
const F_TAP_WATER = [98, -58, 26, 0, -48, -68, -41];
const F_SALT = [32, -32, 14, 22, -46, -68, -33];
/** c sin β of the normal wet cell, table 1. */
const REPEAT = 50.7;
/** Thickness of the protein layer, p. 113. */
const PROTEIN = 34;

const density = (F: number[]) => (z: number) =>
  F.reduce((sum, f, i) => sum + f * Math.cos((TAU * (i + 1) * z) / REPEAT), 0);

function peaks(f: (z: number) => number) {
  const out: number[] = [];
  const step = 0.05;
  for (let z = -REPEAT / 2 + step; z < REPEAT / 2 - step; z += step)
    if (f(z) > f(z - step) && f(z) > f(z + step)) out.push(z);
  return out;
}

const tap = density(F_TAP_WATER);
const salt = density(F_SALT);
const TAP_PEAKS = peaks(tap);
const SAMPLE = Array.from({ length: 1015 }, (_, i) => -REPEAT / 2 + (i * REPEAT) / 1014);
const LO = Math.min(...SAMPLE.map(tap), ...SAMPLE.map(salt));
const HI = Math.max(...SAMPLE.map(tap), ...SAMPLE.map(salt));

export function FourBumps() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const plotTop = narrow ? 66 : 38;
  const plotH = narrow ? 90 : 100;
  const x0 = 4;
  const len = W - 8;
  const px = (z: number) => x0 + ((z + REPEAT / 2) / REPEAT) * len;
  const scale = plotH / (HI - LO);
  const base = plotTop + plotH;
  const at = (f: (z: number) => number) => (t: number) =>
    (f((t / len) * REPEAT - REPEAT / 2) - LO) * scale;
  const py = (v: number) => base - (v - LO) * scale;

  const axisY = base + 22;
  const stripY = axisY + 20;
  const stripH = 18;
  const H = stripY + stripH + 22;

  const [p2, p3] = [TAP_PEAKS[0], TAP_PEAKS[1]];
  const spacing = p3 - p2;
  const bracketY = py(Math.max(tap(p2), tap(p3))) - 10;
  const legendX = x0 + len - (narrow ? 212 : 218);
  const legendY = narrow ? 28 : 12;

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
        <title id={`${ids}t`}>Seven waves added together gave four bumps.</title>
        <desc id={`${ids}d`}>
          Density through one {REPEAT} Å layer of the crystal, computed from seven
          spots. In tap water and in salt solution the protein shows the same four
          peaks, {spacing.toFixed(1)} Å apart; only the liquid at the two edges
          changes, lower in tap water.
        </desc>

        <path d={curvePath(x0, base, len, at(salt), 1)} fill="none" stroke={XR.label} strokeWidth={1.5} strokeDasharray="5 4" />
        <path d={curvePath(x0, base, len, at(tap), 1)} fill="none" stroke={XR.accent} strokeWidth={2.25} strokeLinejoin="round" />

        <g stroke={XR.label} strokeWidth={1}>
          <line x1={px(p2)} x2={px(p3)} y1={bracketY} y2={bracketY} />
          <line x1={px(p2)} x2={px(p2)} y1={bracketY - 3} y2={bracketY + 3} />
          <line x1={px(p3)} x2={px(p3)} y1={bracketY - 3} y2={bracketY + 3} />
        </g>

        <Labels size={text}>
          <text x={(px(p2) + px(p3)) / 2} y={bracketY - 6} textAnchor="middle">
            {spacing.toFixed(1)} Å
          </text>
          <text x={0} y={12}>electron density ↑</text>
          <text x={legendX + 22} y={legendY} fill={XR.accent}>
            tap water
          </text>
          <text x={legendX + 132} y={legendY}>salt solution</text>
        </Labels>
        <line x1={legendX} x2={legendX + 16} y1={legendY - 4} y2={legendY - 4} stroke={XR.accent} strokeWidth={2.25} />
        <line x1={legendX + 110} x2={legendX + 126} y1={legendY - 4} y2={legendY - 4} stroke={XR.label} strokeWidth={1.5} strokeDasharray="5 4" />

        <line x1={x0} x2={x0 + len} y1={axisY - 6} y2={axisY - 6} stroke={XR.rule} />
        <g className="font-mono" fontSize={10} fill={XR.label} textAnchor="middle">
          {[-20, -10, 0, 10, 20].map((z) => (
            <g key={z}>
              <line x1={px(z)} x2={px(z)} y1={axisY - 9} y2={axisY - 3} stroke={XR.atom} />
              <text x={px(z)} y={axisY + 8}>
                {z === 20 ? "20 Å" : z}
              </text>
            </g>
          ))}
        </g>

        <rect x={x0} y={stripY} width={len} height={stripH} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
        <rect
          x={px(-PROTEIN / 2)}
          y={stripY}
          width={px(PROTEIN / 2) - px(-PROTEIN / 2)}
          height={stripH}
          fill={XR.molecule}
          stroke={XR.moleculeEdge}
          strokeWidth={0.75}
        />
        <g stroke={XR.sum} strokeWidth={3} strokeLinecap="round">
          {TAP_PEAKS.map((z) => (
            <line key={z} x1={px(z)} x2={px(z)} y1={stripY + 3} y2={stripY + stripH - 3} />
          ))}
        </g>
        <g className="font-mono" fontSize={10} fill={XR.label}>
          <text x={x0 + 4} y={stripY + stripH / 2 + 3.5}>liquid</text>
          <text x={x0 + len - 4} y={stripY + stripH / 2 + 3.5} textAnchor="end">liquid</text>
          <text x={px(0)} y={stripY + stripH + 14} textAnchor="middle">
            {narrow ? "protein: four sheets?" : "the protein layer, read as four sheets of chain"}
          </text>
        </g>

      </svg>
    </div>
  );
}
