// Figure 4: the film from rows of more and more atoms at one spacing.
import { useId, useState } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Atom, Labels } from "./scene";
import { SliderRow } from "./controls";

const SPACING = 3;
/** tan θ at the film's edge; matches the angles the film covers in the two-atom figure. */
const EDGE_TAN = 0.75;

/** Far-field strength for n atoms, as a fraction of its peak: sin²(nπs·sinθ) / (n² sin²(πs·sinθ)). */
function rowStrength(n: number, sinTheta: number) {
  const a = Math.PI * SPACING * sinTheta;
  const den = Math.sin(a);
  if (Math.abs(den) < 1e-9) return 1;
  const num = Math.sin(n * a);
  return (num * num) / (n * n * den * den);
}

const sinAt = (t: number) => t / Math.hypot(1, t);

/** Film positions (as tan θ) of the in-step directions that land on it. */
const IN_STEP: number[] = [];
for (let m = -SPACING; m <= SPACING; m++) {
  const s = m / SPACING;
  if (Math.abs(s) >= 1) continue;
  const t = s / Math.sqrt(1 - s * s);
  if (Math.abs(t) <= EDGE_TAN) IN_STEP.push(t);
}

function Strip({
  n,
  x,
  top,
  height,
  width,
}: {
  n: number;
  x: number;
  top: number;
  height: number;
  width: number;
}) {
  const id = useId();
  const stops: { offset: number; o: number }[] = [];
  const steps = Math.ceil(height * 2);
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const t = (2 * f - 1) * EDGE_TAN;
    stops.push({ offset: f, o: 0.9 * rowStrength(n, sinAt(t)) });
  }
  return (
    <g>
      <defs>
        <linearGradient id={id} x1={0} x2={0} y1={0} y2={1}>
          {stops.map(({ offset, o }) => (
            <stop key={offset} offset={offset} stopColor={XR.sum} stopOpacity={o} />
          ))}
        </linearGradient>
      </defs>
      <rect x={x} y={top} width={width} height={height} fill={XR.film} />
      <rect x={x} y={top} width={width} height={height} fill={`url(#${id})`} />
      <rect
        x={x}
        y={top}
        width={width}
        height={height}
        fill="none"
        stroke={XR.atom}
        strokeWidth={0.75}
      />
    </g>
  );
}

/** A row of n atoms drawn as a short column, beside its film strip; not to scale. */
function RowIcon({ n, x, cy }: { n: number; x: number; cy: number }) {
  const gap = Math.min(14, 96 / n);
  const r = Math.min(4, gap * 0.38);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const y = cy + (i - (n - 1) / 2) * gap;
        return r >= 4 ? <Atom key={i} x={x} y={y} /> : <circle key={i} cx={x} cy={y} r={r} fill={XR.sum} />;
      })}
    </g>
  );
}

function Panel({ W, rows, header }: { W: number; rows: number[]; header?: (n: number) => string }) {
  const ids = useId();
  const narrow = W < 520;
  const text = narrow ? 11 : 12;
  const labelW = narrow ? 0 : 74;
  const top = 34;
  const height = Math.round(Math.min(340, Math.max(260, W * 0.5)));
  const bottom = top + height;
  const cy = top + height / 2;
  const H = bottom + 8;
  const colW = (W - labelW) / rows.length;
  const stripW = Math.min(44, colW * 0.34);
  const yAt = (t: number) => cy + (t / EDGE_TAN) * (height / 2);

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="block"
      role="img"
      aria-labelledby={`${ids}t ${ids}d`}
    >
      <title id={`${ids}t`}>The more atoms in a row, the sharper the dark bands on the film.</title>
      <desc id={`${ids}d`}>
        Film strips for rows of {rows.join(", ")} atoms, all {SPACING} wavelengths apart.
        Each strip has dark bands in the same three places, one straight ahead and one to
        each side, and the bands get narrower as the row gets longer.
      </desc>

      <g stroke={XR.accent} strokeWidth={0.75} strokeDasharray="3 4" strokeOpacity={0.7}>
        {IN_STEP.map((t) => (
          <line key={t} x1={labelW} x2={W} y1={yAt(t)} y2={yAt(t)} />
        ))}
      </g>

      {rows.map((n, i) => {
        const x0 = labelW + i * colW;
        const stripX = x0 + colW * 0.58 - stripW / 2;
        return (
          <g key={n}>
            <text
              x={stripX + stripW / 2}
              y={14}
              textAnchor="middle"
              className="font-ui"
              fontSize={narrow ? 12 : 13}
              fontWeight={600}
              fill={XR.sum}
            >
              {header ? header(n) : `${n} atoms`}
            </text>
            <RowIcon n={n} x={stripX - Math.min(34, colW * 0.24)} cy={cy} />
            <Strip n={n} x={stripX} top={top} height={height} width={stripW} />
          </g>
        );
      })}

      {!narrow && (
        <Labels size={text}>
          <text x={0} y={yAt(IN_STEP[IN_STEP.length - 1]) + 4} fill={XR.accent}>
            in step
          </text>
          <text x={0} y={yAt(0) + 4} fill={XR.accent}>
            in step
          </text>
          <text x={0} y={yAt(IN_STEP[0]) + 4} fill={XR.accent}>
            in step
          </text>
          <text x={0} y={(yAt(0) + yAt(IN_STEP[0])) / 2 + 4}>
            clear
          </text>
        </Labels>
      )}
    </svg>
  );
}

export function RowOfAtoms() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  return (
    <div ref={ref} className="w-full">
      <Panel W={W} rows={[2, 5, 20]} />
    </div>
  );
}

export function RowOfAtomsInteractive() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [n, setN] = useState(5);
  return (
    <div ref={ref} className="w-full">
      <Panel W={W} rows={[n]} header={(k) => `${k} atoms in a row`} />
      <div className="mt-5">
        <SliderRow
          label="Atoms in the row"
          value={n}
          display={`${n}`}
          valueText={`${n} atoms`}
          min={2}
          max={20}
          step={1}
          onChange={setN}
        />
      </div>
    </div>
  );
}
