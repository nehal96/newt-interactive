// The film keeps a wave's height but not where its crests fall; adding a wave you know shows where they fall.
import { useState, type ReactNode } from "react";
import { useElementWidth } from "@hooks";
import { Button } from "@ui/controls";
import { cn } from "@lib/utils";
import { XR } from "./palette";
import { TAU, curvePath } from "./wave";
import { SliderRow } from "./controls";

const PROTEIN = 1;
const KNOWN_MAX = 0.6;
/** Darkness is height squared, scaled so the tallest wave any panel draws is black. */
const MAX_HEIGHT = PROTEIN + KNOWN_MAX;
const darkness = (h: number) => Math.min(1, (h / MAX_HEIGHT) ** 2);

export function Spot({ x, y, size, height }: { x: number; y: number; size: number; height: number }) {
  return (
    <g>
      <rect x={x} y={y} width={size} height={size} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
      <circle cx={x + size / 2} cy={y + size / 2} r={size * 0.2} fill={XR.sum} fillOpacity={darkness(height)} />
    </g>
  );
}

/**
 * Two wavelengths of a wave, its crests shifted `shift` of a wavelength from the dashed line.
 * A negative height draws the wave half a wave out.
 */
export function Wave({
  x,
  cy,
  w,
  amp,
  height,
  shift = 0,
  color = XR.first,
  dashed = false,
  guide = true,
  crest = false,
  width = 2,
}: {
  x: number;
  cy: number;
  w: number;
  amp: number;
  height: number;
  shift?: number;
  color?: string;
  dashed?: boolean;
  guide?: boolean;
  crest?: boolean;
  width?: number;
}) {
  const lambda = w / 2;
  const s = (((shift % 1) + 1) % 1);
  return (
    <g>
      <line x1={x} x2={x + w} y1={cy} y2={cy} stroke={XR.rule} />
      {guide && (
        <line x1={x} x2={x} y1={cy - amp * 1.15} y2={cy + amp * 1.15} stroke={XR.atom} strokeDasharray="3 3" />
      )}
      <path
        d={curvePath(x, cy, w, (t) => amp * height * Math.cos(TAU * (t / lambda - s)), 1)}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dashed ? "4 3" : undefined}
        opacity={dashed ? 0.55 : 1}
        strokeLinejoin="round"
      />
      {crest && <circle cx={x + s * lambda} cy={cy - amp * height} r={3} fill={XR.accent} />}
    </g>
  );
}

function Label({
  x,
  y,
  children,
  anchor = "start",
  color = XR.label,
  size = 10,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: "start" | "middle" | "end";
  color?: string;
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="font-mono" fontSize={size} fill={color}>
      {children}
    </text>
  );
}

function PanelHead({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      <p className="font-ui text-xs font-semibold text-ink-800">
        {n}. {title}
      </p>
      <p className="mt-0.5 font-ui text-xs leading-[1.125rem] text-ink-600">{children}</p>
    </div>
  );
}

const STEPS = [
  {
    title: "The film keeps only the height",
    text: "A spot is darker the taller its wave. Shift the wave’s crests, and the spot doesn’t change: the film has no record of where they fell.",
  },
  {
    title: "Add a wave you know",
    text: "For these spots, the protein’s wave can only be in step with a known wave or half a wave out, and both give the same spot. Add the known wave and watch the spot.",
  },
];

/* ---------- Static ---------- */

export function StaticHeight({ w }: { w: number }) {
  const rows = [
    { label: "a wave", height: 0.8, shift: 0 },
    { label: "crests shifted", height: 0.8, shift: 0.25 },
    { label: "twice as tall", height: 1.6, shift: 0 },
  ];
  const spot = 30;
  const amp = 9;
  const rowH = 56;
  const waveW = w - spot - 20;
  const H = rows.length * rowH;
  return (
    <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} className="block">
      {rows.map((r, i) => {
        const cy = i * rowH + rowH / 2 + 4;
        return (
          <g key={r.label}>
            <Label x={0} y={cy - amp * 1.6 - 5}>{r.label}</Label>
            <Wave x={0} cy={cy} w={waveW} amp={amp} height={r.height} shift={r.shift} crest />
            <Spot x={w - spot} y={cy - spot / 2} size={spot} height={r.height} />
          </g>
        );
      })}
    </svg>
  );
}

/** Protein wave, known wave, and their sum, stacked; the sum's height sets the spot. */
function SumStack({
  x,
  y,
  w,
  amp,
  sign,
  known,
  showProtein = true,
  labelX,
}: {
  x: number;
  y: number;
  w: number;
  amp: number;
  sign: 1 | -1;
  known: number;
  showProtein?: boolean;
  labelX?: number;
}) {
  const gap = amp * 2.6;
  const rows = [y, y + gap, y + 2 * gap];
  return (
    <g>
      {showProtein ? (
        <Wave x={x} cy={rows[0]} w={w} amp={amp} height={sign * PROTEIN} />
      ) : (
        <g>
          <Wave x={x} cy={rows[0]} w={w} amp={amp} height={PROTEIN} dashed />
          <Wave x={x} cy={rows[0]} w={w} amp={amp} height={-PROTEIN} dashed guide={false} />
        </g>
      )}
      <Wave x={x} cy={rows[1]} w={w} amp={amp} height={known} color={XR.second} />
      {showProtein && (
        <Wave x={x} cy={rows[2]} w={w} amp={amp} height={sign * PROTEIN + known} color={XR.accent} width={2.5} />
      )}
      {labelX !== undefined && (
        <g>
          <Label x={labelX} y={rows[0] + 4} color={XR.first}>
            protein
          </Label>
          {!showProtein && (
            <Label x={labelX} y={rows[0] + 16}>
              (one of two)
            </Label>
          )}
          <Label x={labelX} y={rows[1] + 4} color={XR.second}>
            known
          </Label>
          {showProtein && (
            <Label x={labelX} y={rows[2] + 4} color={XR.accent}>
              sum
            </Label>
          )}
        </g>
      )}
    </g>
  );
}

function StaticKnown({ w }: { w: number }) {
  const cases: { sign: 1 | -1; title: string }[] = [
    { sign: 1, title: "in step" },
    { sign: -1, title: "half a wave out" },
  ];
  const gutter = 56;
  const spot = 28;
  const amp = 8;
  const colGap = 16;
  const colW = (w - gutter - colGap) / 2;
  const stackTop = 32;
  const stackH = amp * 2.6 * 2 + amp * 1.3;
  const spotsY = stackTop + stackH + 12;
  const H = spotsY + spot + 18;
  const known = KNOWN_MAX * 0.8;
  return (
    <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} className="block">
      {cases.map((c, i) => {
        const x = gutter + i * (colW + colGap);
        return (
          <g key={c.title}>
            <text x={x} y={11} className="font-ui" fontSize={11} fontWeight={600} fill={XR.sum}>
              {c.title}
            </text>
            <SumStack x={x} y={stackTop} w={colW} amp={amp} sign={c.sign} known={known} labelX={i === 0 ? 0 : undefined} />
            <Spot x={x + colW / 2 - spot - 6} y={spotsY} size={spot} height={PROTEIN} />
            <Spot x={x + colW / 2 + 6} y={spotsY} size={spot} height={Math.abs(c.sign * PROTEIN + known)} />
            <Label x={x + colW / 2 - spot / 2 - 6} y={spotsY + spot + 12} anchor="middle">before</Label>
            <Label x={x + colW / 2 + spot / 2 + 6} y={spotsY + spot + 12} anchor="middle">after</Label>
          </g>
        );
      })}
    </svg>
  );
}

export function SpotRecords() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const wide = W >= 600;
  const gap = 32;
  const w = wide ? (W - gap) / 2 : W;
  const panels = [<StaticHeight key={1} w={w} />, <StaticKnown key={2} w={w} />];
  return (
    <div ref={ref} className={cn("w-full", wide ? "grid grid-cols-2 gap-8" : "flex flex-col gap-8")}>
      {STEPS.map((s, i) => (
        <div key={s.title} className="flex flex-col">
          <PanelHead n={i + 1} title={s.title}>
            {s.text}
          </PanelHead>
          <div className="mt-auto">{panels[i]}</div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Interactive ---------- */

function StepHeight({ W }: { W: number }) {
  const [shift, setShift] = useState(0.15);
  const [height, setHeight] = useState(0.8);
  const spot = 64;
  const amp = 30;
  const waveW = W - spot - 40;
  const H = amp * 2 * 1.6 + 16;
  const cy = H / 2;
  return (
    <>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
        <Wave x={0} cy={cy} w={waveW} amp={amp} height={height} shift={shift} crest />
        <Spot x={W - spot} y={cy - spot / 2} size={spot} height={height} />
      </svg>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SliderRow
          label="Shift the crests"
          value={shift}
          display={`${Math.round(shift * 100)}% of a wavelength`}
          min={0}
          max={1}
          step={0.01}
          onChange={setShift}
        />
        <SliderRow
          label="Height"
          value={height}
          display={height.toFixed(2)}
          min={0.3}
          max={1.6}
          step={0.01}
          onChange={setHeight}
        />
      </div>
    </>
  );
}

function StepKnown({ W }: { W: number }) {
  const [sign, setSign] = useState<1 | -1>(-1);
  const [known, setKnown] = useState(0);
  const [shown, setShown] = useState(false);
  const spot = 52;
  const amp = 16;
  const gutter = 84;
  const waveW = W - gutter - 2 * spot - 48;
  const stackTop = amp * 1.4;
  const H = stackTop + amp * 2.6 * 2 + amp * 1.4;
  const sx = W - 2 * spot - 12;
  const sy = H / 2 - spot / 2;
  const after = Math.abs(sign * PROTEIN + known);
  const verdict =
    known < 0.05
      ? "Slide in the known wave."
      : !shown
        ? after > PROTEIN
          ? "The spot got darker. Was the protein’s wave in step with the known wave, or half a wave out?"
          : "The spot got fainter. Was the protein’s wave in step with the known wave, or half a wave out?"
        : sign === 1
          ? "Darker: the protein’s wave was in step with the known wave, so their crests added up."
          : "Fainter: the protein’s wave was half a wave out, so the known wave partly cancelled it.";
  return (
    <>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block">
        <SumStack x={gutter} y={stackTop} w={waveW} amp={amp} sign={sign} known={known} showProtein={shown} labelX={0} />
        <Label x={sx + spot / 2} y={sy - 8} anchor="middle">before</Label>
        <Label x={sx + spot * 1.5 + 12} y={sy - 8} anchor="middle">now</Label>
        <Spot x={sx} y={sy} size={spot} height={PROTEIN} />
        <Spot x={sx + spot + 12} y={sy} size={spot} height={after} />
      </svg>
      <p className="mt-3 min-h-[2.5rem] font-ui text-sm text-ink-700">{verdict}</p>
      <div className="mt-2">
        <SliderRow
          label="Add the known wave"
          value={known}
          display={known ? `${Math.round((known / KNOWN_MAX) * 100)}%` : "none"}
          min={0}
          max={KNOWN_MAX}
          step={0.01}
          onChange={setKnown}
        />
      </div>
      <div className="mt-4 flex gap-2 font-ui text-sm">
        <Button variant="secondary" onClick={() => setShown(true)} disabled={shown || known < 0.05}>
          Reveal
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setSign(Math.random() < 0.5 ? 1 : -1);
            setKnown(0);
            setShown(false);
          }}
        >
          Try another spot
        </Button>
      </div>
    </>
  );
}

export function SpotRecordsInteractive() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  return (
    <div ref={ref} className="flex w-full flex-col gap-10">
      <div>
        <PanelHead n={1} title={STEPS[0].title}>
          {STEPS[0].text}
        </PanelHead>
        <StepHeight W={W} />
      </div>
      <div>
        <PanelHead n={2} title={STEPS[1].title}>
          {STEPS[1].text}
        </PanelHead>
        <StepKnown W={W} />
      </div>
    </div>
  );
}
