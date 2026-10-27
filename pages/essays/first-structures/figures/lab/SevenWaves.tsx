// Perutz's seven 1943 waves, each the right way up, added into the line through one layer of the crystal.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { TAU, curvePath } from "../wave";
import { Labels } from "../scene";
import { F_PURE_WATER, PROTEIN, REPEAT } from "../FourBumps";

const SPOTS = F_PURE_WATER.map((_, i) => i + 1);
const TALLEST = Math.max(...F_PURE_WATER.map(Math.abs));
const density = (z: number) => F_PURE_WATER.reduce((acc, f, i) => acc + f * Math.cos((TAU * (i + 1) * z) / REPEAT), 0);
const SAMPLE = Array.from({ length: 801 }, (_, i) => -REPEAT / 2 + (i * REPEAT) / 800);
const LO = Math.min(...SAMPLE.map(density));
const HI = Math.max(...SAMPLE.map(density));
const BUMPS = SAMPLE.filter((z, i) => i > 0 && i < 800 && Math.abs(z) < PROTEIN / 2 && density(z) > density(SAMPLE[i - 1]) && density(z) > density(SAMPLE[i + 1]));

export function SevenWaves() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const left = narrow ? 104 : 140;
  const len = W - left - 4;
  const px = (z: number) => left + ((z + REPEAT / 2) / REPEAT) * len;
  const zAt = (t: number) => (t / len) * REPEAT - REPEAT / 2;

  const rowH = narrow ? 30 : 32;
  const amp = rowH / 2 - 3;
  const top = 22 + (narrow ? 30 : 32);
  const rowY = (i: number) => top + i * rowH + rowH / 2;
  const sumTop = rowY(SPOTS.length - 1) + rowH / 2 + 28;
  const sumH = 96;
  const sumBase = sumTop + sumH;
  const stripY = sumBase + 14;
  const stripH = 18;
  const H = stripY + stripH + 22;
  const shade = (f: number) => 0.06 + (0.9 * f * f) / (TALLEST * TALLEST);

  const filmX = narrow ? 22 : 34;
  const filmW = left - filmX - 22;
  const pitch = filmW / 3;
  const colX = filmX + filmW / 2;
  const filmTop = rowY(-1) - rowH / 2;
  const filmBottom = rowY(SPOTS.length - 1) + rowH / 2;
  /** Neighbouring spots are only there to show the column in its film; their darkness is made up. */
  const other = (i: number, j: number) => 0.08 + 0.5 * ((Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1 + 1) % 1;

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>Perutz’s seven waves, each the right way up, add into a line with four bumps</title>
        <desc id={`${ids}d`}>
          Seven spots from one column of the 1943 films, each turned into a wave across one {REPEAT} Å layer of the crystal, with
          the signs the salt and drying photographs gave. Added together, they give the density through the layer: four bumps in
          the protein, lower density in the liquid at the edges.
        </desc>

        <rect x={filmX} y={filmTop} width={filmW} height={filmBottom - filmTop} fill={XR.film} stroke={XR.guide} strokeWidth={0.75} />
        <rect x={colX - pitch / 2 + 3} y={rowY(0) - rowH / 2 + 2} width={pitch - 6} height={filmBottom - rowY(0) + rowH / 2 - 4} rx={4} fill={XR.molecule} fillOpacity={0.6} stroke={XR.first} strokeWidth={1} />
        <rect x={colX - 4} y={rowY(-1) - 4} width={8} height={8} rx={1} fill={XR.label} />
        {[-1, 0, 1].map((j) =>
          Array.from({ length: SPOTS.length + 1 }, (_, k) => k - 1).map((i) =>
            j === 0 && i < 0 ? null : (
              <circle
                key={`${j}${i}`}
                cx={colX + j * pitch}
                cy={rowY(i)}
                r={4.5}
                fill={XR.ink}
                fillOpacity={j === 0 ? shade(F_PURE_WATER[i]) : other(i, j)}
              />
            ),
          ),
        )}
        <line x1={px(0)} x2={px(0)} y1={rowY(0) - rowH / 2} y2={sumBase} stroke={XR.guide} strokeWidth={1} strokeDasharray="2 3" />
        {F_PURE_WATER.map((f, i) => (
          <g key={i}>
            <line x1={colX + 8} x2={left - 4} y1={rowY(i)} y2={rowY(i)} stroke={XR.guide} strokeWidth={0.75} strokeDasharray="1 3" />
            <line x1={left} x2={left + len} y1={rowY(i)} y2={rowY(i)} stroke={XR.rule} />
            <path
              d={curvePath(left, rowY(i), len, (t) => (amp * f * Math.cos((TAU * (i + 1) * zAt(t)) / REPEAT)) / TALLEST, 1)}
              fill="none"
              stroke={XR.first}
              strokeWidth={1.75}
            />
          </g>
        ))}

        <line x1={left} x2={left + len} y1={sumBase - ((0 - LO) / (HI - LO)) * sumH} y2={sumBase - ((0 - LO) / (HI - LO)) * sumH} stroke={XR.rule} />
        <path
          d={curvePath(left, sumBase, len, (t) => ((density(zAt(t)) - LO) / (HI - LO)) * sumH, 1)}
          fill="none"
          stroke={XR.accent}
          strokeWidth={2.25}
          strokeLinejoin="round"
        />

        <rect x={left} y={stripY} width={len} height={stripH} fill={XR.film} stroke={XR.guide} strokeWidth={0.75} />
        <rect x={px(-PROTEIN / 2)} y={stripY} width={px(PROTEIN / 2) - px(-PROTEIN / 2)} height={stripH} fill={XR.molecule} stroke={XR.moleculeEdge} strokeWidth={0.75} />
        <g stroke={XR.ink} strokeWidth={3} strokeLinecap="round">
          {BUMPS.map((z) => (
            <line key={z} x1={px(z)} x2={px(z)} y1={stripY + 3} y2={stripY + stripH - 3} />
          ))}
        </g>

        <Labels size={text}>
          {F_PURE_WATER.map((f, i) => (
            <g key={i}>
              <text x={filmX - 6} y={rowY(i) + 4} textAnchor="end" fill={XR.first}>
                {i + 1}
              </text>
              <text x={left - 8} y={rowY(i) + 4} textAnchor="end" fill={XR.ink}>
                {f === 0 ? "0" : f > 0 ? "+" : "−"}
              </text>
            </g>
          ))}
          <text x={0} y={12}>the film</text>
          <text x={filmX + filmW + 4} y={rowY(-1) + 4}>{narrow ? "" : "← centre"}</text>
          <text x={left} y={12}>
            {narrow ? "+ crest at the middle, − trough" : "+ crest at the middle, − trough at the middle, 0 too faint to use"}
          </text>
          <text x={0} y={sumTop + sumH / 2} fill={XR.accent}>
            added up
          </text>
          <text x={left + len - 2} y={sumTop - 6} textAnchor="end">
            {narrow ? "density through one layer" : "how much matter lies at each depth through one layer"}
          </text>
          <text x={left + 4} y={stripY + stripH / 2 + 4}>liquid</text>
          <text x={left + len - 4} y={stripY + stripH / 2 + 4} textAnchor="end">
            liquid
          </text>
          <text x={px(0)} y={stripY + stripH + 14} textAnchor="middle">
            {narrow ? "four bumps: four sheets?" : "the protein layer: four bumps, read as four sheets of chain"}
          </text>
        </Labels>
      </svg>
    </div>
  );
}
