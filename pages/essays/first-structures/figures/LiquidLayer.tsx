// Seen only from top to bottom, the liquid between the molecules is a flat layer, and one column of spots records that view.
import { useId, useState, type ReactNode } from "react";
import { cn } from "@lib/utils";
import { XR } from "./palette";
import { Note } from "./TwoAtoms";
import { SliderRow } from "./controls";
import { F_SALT, F_TAP_WATER } from "./FourBumps";

const W = 200;
const H = 220;
const PROTEIN = 50;
const LIQUID = 25;
const REPEAT = PROTEIN + LIQUID;
const PITCH = 66;
// Wide enough that a periodic row blurs to a flat band.
const MAX_BLUR = 70;
// The molecules run far past the panel so the blur never reaches an empty edge.
const SPAN = { x: -400, width: 1000 };

// Below 1 squares the outline off, so the averaged layers keep flat edges.
const SQUARE = 0.6;

function blob(cx: number, cy: number, seed: number) {
  const rx = 27 + 1.5 * Math.sin(seed * 1.7);
  const ry = 20 + 1.5 * Math.cos(seed * 2.3);
  const points = Array.from({ length: 48 }, (_, n) => {
    const t = (n / 48) * 2 * Math.PI;
    const r = 1 + 0.06 * Math.sin(3 * t + seed) + 0.04 * Math.sin(5 * t + 2 * seed);
    const c = Math.cos(t);
    const v = Math.sin(t);
    const x = rx * r * Math.sign(c) * Math.abs(c) ** SQUARE;
    const y = ry * r * Math.sign(v) * Math.abs(v) ** SQUARE;
    return `${(cx + x).toFixed(1)} ${(cy + y).toFixed(1)}`;
  });
  return `M${points.join("L")}Z`;
}

const MOLECULES = [0, 1, 2, 3].flatMap((k) =>
  Array.from({ length: 15 }, (_, i) =>
    blob(-300 + ((k * 23) % PITCH) + i * PITCH, -32 + k * REPEAT + PROTEIN / 2, i * 3.1 + k * 5.7),
  ),
);

const liquidOpacity = (salt: number) => 0.22 + 0.3 * salt;

function Crystal({
  average,
  salt,
  label,
}: {
  average: number;
  salt: number;
  label: string;
}) {
  const id = useId();
  const blur = average * MAX_BLUR;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={label}>
      <defs>
        <clipPath id={`${id}c`}>
          <rect width={W} height={H} rx={4} />
        </clipPath>
        <filter
          id={`${id}b`}
          filterUnits="userSpaceOnUse"
          x={SPAN.x}
          y={-60}
          width={SPAN.width}
          height={H + 120}
        >
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <g filter={blur > 0 ? `url(#${id}b)` : undefined}>
          <rect {...SPAN} y={-60} height={H + 120} fill={XR.paper} />
          <rect
            {...SPAN}
            y={-60}
            height={H + 120}
            fill={XR.second}
            fillOpacity={liquidOpacity(salt)}
          />
          <g fill={XR.molecule} stroke={XR.moleculeEdge}>
            {MOLECULES.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  );
}

const FILM = 184;
const FX = (W - FILM) / 2;
const FY = (H - FILM) / 2;
const STEP = FILM / 2 / 8;
const REACH = 7;
const SPOT_R = 2.4;

function hash(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const OTHERS = Array.from({ length: 2 * REACH + 1 }, (_, a) => a - REACH).flatMap((i) =>
  Array.from({ length: 2 * REACH + 1 }, (_, b) => b - REACH)
    .filter(() => i !== 0)
    .map((j) => ({
      i,
      j,
      base: hash(i, j) ** 2 * Math.exp(-(i * i + j * j) / 60),
      drift: hash(j, i) * 2 - 1,
    })),
);

const F_MAX = Math.max(...F_TAP_WATER.map(Math.abs), ...F_SALT.map(Math.abs));

function Film({ salt, label }: { salt: number; label: string }) {
  const f = F_TAP_WATER.map((w, k) => w + salt * (F_SALT[k] - w));
  const cx = FX + FILM / 2;
  const cy = FY + FILM / 2;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={label}>
      <rect x={FX} y={FY} width={FILM} height={FILM} fill={XR.film} />
      <g fill={XR.sum}>
        {OTHERS.map(({ i, j, base, drift }) => {
          const s = Math.min(1, base * (1 + 0.8 * drift * salt));
          return (
            <circle
              key={`${i}-${j}`}
              cx={cx + i * STEP}
              cy={cy + j * STEP}
              r={SPOT_R}
              fillOpacity={+(0.08 + 0.8 * Math.sqrt(s)).toFixed(3)}
            />
          );
        })}
        {f.flatMap((F, k) =>
          [-1, 1].map((side) => (
            <circle
              key={`${k}-${side}`}
              cx={cx}
              cy={cy + side * (k + 1) * STEP}
              r={SPOT_R}
              fillOpacity={+(0.06 + 0.94 * (Math.abs(F) / F_MAX)).toFixed(3)}
            />
          )),
        )}
      </g>
      <rect
        x={cx - STEP * 0.6}
        y={cy - (REACH + 0.6) * STEP}
        width={STEP * 1.2}
        height={(2 * REACH + 1.2) * STEP}
        rx={STEP * 0.6}
        fill="none"
        stroke={XR.accent}
        strokeWidth={1.5}
      />
      <circle cx={cx} cy={cy} r={5} fill={XR.label} />
      <rect
        x={FX}
        y={FY}
        width={FILM}
        height={FILM}
        fill="none"
        stroke={XR.atom}
        strokeWidth={0.75}
      />
    </svg>
  );
}

function Panel({
  title,
  children,
  image,
  className,
}: {
  title: string;
  children: ReactNode;
  image: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {image}
      <Note title={title}>{children}</Note>
    </div>
  );
}

export function LiquidLayer() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3">
      <Panel
        title="1. Side on"
        image={
          <Crystal
            average={0}
            salt={0}
            label="Layers of protein molecules with liquid filling the uneven gaps between them."
          />
        }
      >
        The liquid fills the gaps between the molecules, in shapes nobody
        knew.
      </Panel>
      <Panel
        title="2. Top to bottom"
        image={
          <Crystal
            average={1}
            salt={0}
            label="The same crystal averaged across each depth: flat bands of protein and of liquid."
          />
        }
      >
        Averaged across each depth, the gaps even out. The liquid is a flat
        layer of known thickness and saltiness.
      </Panel>
      <Panel
        title="3. On the film"
        className="col-span-2 sm:col-span-1"
        image={
          <div className="mx-auto w-2/3 sm:w-full">
            <Film
              salt={0}
              label="A film of spots with the column through its center ringed in red."
            />
          </div>
        }
      >
        The ringed column of spots sees only that top-to-bottom view, so only
        there could the liquid&rsquo;s wave be worked out.
      </Panel>
    </div>
  );
}

export function LiquidLayerInteractive() {
  const [average, setAverage] = useState(0);
  const [salt, setSalt] = useState(0);
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Crystal
          average={average}
          salt={salt}
          label="Layers of protein molecules with liquid between them, blurred side to side by the slider."
        />
        <Film
          salt={salt}
          label="A film of spots with the column through its center ringed in red."
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <SliderRow
          label="Average across each depth"
          value={average}
          display={`${Math.round(average * 100)}%`}
          min={0}
          max={1}
          step={0.01}
          onChange={setAverage}
        />
        <SliderRow
          label="Salt soaked in"
          value={salt}
          display={`${Math.round(salt * 100)}%`}
          min={0}
          max={1}
          step={0.01}
          onChange={setSalt}
        />
      </div>
      <Note title="What the ringed column sees">
        Averaged across each depth, the liquid is a flat layer, and that
        top-to-bottom view is all the ringed spots record. Add salt and some of
        them darken while others fade. The other spots change too, but there
        was no telling what the liquid had done to them.
      </Note>
    </div>
  );
}
