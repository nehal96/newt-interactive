import { createContext, type ReactNode, useContext, useId } from "react";
import { Slider, Switch } from "@ui/controls";
import { InlineCode } from "@ui/prose/Code";
import MathFormula from "@ui/prose/MathFormula";
import {
  getResponseCurveData,
  type Point,
  type ResponseCurve,
  responseTime,
} from "./helpers";

// The SVG chart vocabulary for the systems-biology series: one plot box, one
// set of axes, one curve style.

const VIEW = { W: 440, H: 252 };
const PLOT = { X0: 52, X1: 392, YT: 26, YB: 218 };

export const CURVE = {
  activator: "#c43a31",
  repressor: "#3b82f6",
  response: "#2dd4bf",
  unregulated: "#0d9488",
  comparison: "#cbd5e1",
};

const FRAME = {
  axis: "#cbd5e1",
  grid: "#dfe4ec",
  label: "#64748b",
  comparisonLabel: "#94a3b8",
  guide: "#94a3b8",
  marker: "#334155",
};

export type Scale = { x: (v: number) => number; y: (v: number) => number };

export const scaleFor = (xMax: number, yMax: number): Scale => ({
  x: (v) => PLOT.X0 + (v / xMax) * (PLOT.X1 - PLOT.X0),
  y: (v) => PLOT.YB - (v / yMax) * (PLOT.YB - PLOT.YT),
});

// β-space. A step function is drawn beside the Hill curve it approximates, so
// both must read off one scale to share a threshold and a plateau.
export const HILL = scaleFor(20, 22);
const RESPONSE = scaleFor(20, 110);

export type Tick = [value: number, label: ReactNode];

export const Sub = ({
  base,
  sub,
  after,
}: {
  base: string;
  sub: string;
  after?: string;
}) => (
  <>
    {base}
    <tspan dy="3.5" fontSize="0.75em">
      {sub}
    </tspan>
    {after && <tspan dy="-3.5">{after}</tspan>}
  </>
);

// Every plot publishes a clip of its own box under `${id}-clip`, which a curve
// running off the top of its domain — the unregulated-production line — asks
// for with `clip`. Snug at the top, where the cut must land exactly on the
// domain edge; slack elsewhere so round caps at the axes survive it.
const ClipContext = createContext("");

export function Plot({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: ReactNode;
}) {
  const id = useId();
  const { X0, X1, YT, YB } = PLOT;
  return (
    <svg
      viewBox={`0 0 ${VIEW.W} ${VIEW.H}`}
      className="block h-auto w-full font-ui"
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>{title}</title>
      <desc id={`${id}-desc`}>{desc}</desc>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect
            x={X0 - 3}
            y={YT}
            width={X1 - X0 + 6}
            height={YB - YT + 3}
          />
        </clipPath>
      </defs>
      <ClipContext.Provider value={`${id}-clip`}>
        {children}
      </ClipContext.Provider>
    </svg>
  );
}

export function Axes({
  scale,
  xLabel,
  yLabel,
  xTicks = [],
  yTicks = [],
}: {
  scale: Scale;
  xLabel: string;
  yLabel?: string;
  xTicks?: Tick[];
  yTicks?: Tick[];
}) {
  const { X0, X1, YT, YB } = PLOT;
  const yMid = (YT + YB) / 2;
  return (
    <>
      <line x1={X0} y1={YB} x2={X1 + 8} y2={YB} stroke={FRAME.axis} />
      <line x1={X0} y1={YT} x2={X0} y2={YB} stroke={FRAME.axis} />
      <text
        x={X1 + 16}
        y={YB}
        fill={FRAME.label}
        fontSize={11}
        dominantBaseline="central"
      >
        {xLabel}
      </text>
      {yLabel && (
        <text
          x={16}
          y={yMid}
          fill={FRAME.label}
          fontSize={11}
          textAnchor="middle"
          transform={`rotate(-90 16 ${yMid})`}
        >
          {yLabel}
        </text>
      )}
      {xTicks.map(([value, label], i) => (
        <g key={`x-${i}`}>
          <line
            x1={scale.x(value)}
            y1={YB}
            x2={scale.x(value)}
            y2={YB + 5}
            stroke={FRAME.axis}
          />
          <text
            x={scale.x(value)}
            y={YB + 14}
            fill={FRAME.label}
            fontSize={11}
            textAnchor="middle"
            dominantBaseline="hanging"
          >
            {label}
          </text>
        </g>
      ))}
      {yTicks.map(([value, label], i) => (
        <g key={`y-${i}`}>
          <line
            x1={X0 - 5}
            y1={scale.y(value)}
            x2={X0}
            y2={scale.y(value)}
            stroke={FRAME.axis}
          />
          <text
            x={X0 - 10}
            y={scale.y(value)}
            fill={FRAME.label}
            fontSize={11}
            textAnchor="end"
            dominantBaseline="central"
          >
            {label}
          </text>
        </g>
      ))}
    </>
  );
}

export function GuideLine({ y, scale }: { y: number; scale: Scale }) {
  return (
    <line
      x1={PLOT.X0}
      y1={scale.y(y)}
      x2={PLOT.X1}
      y2={scale.y(y)}
      stroke={FRAME.grid}
      strokeDasharray="3 4"
    />
  );
}

const pathFor = (points: Point[], scale: Scale) =>
  points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"}${scale.x(p.x).toFixed(2)},${scale.y(p.y).toFixed(2)}`
    )
    .join("");

export function Curve({
  points,
  scale,
  stroke,
  width = 2.25,
  opacity,
  dashed = false,
  clip = false,
  label,
  labelY,
  drawIn = false,
}: {
  points: Point[];
  scale: Scale;
  stroke: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
  /** Cut the curve at the top of the plot, for one that leaves its domain. */
  clip?: boolean;
  label?: string;
  /** Pixel y for the label, when the curve's own end point would collide. */
  labelY?: number;
  drawIn?: boolean;
}) {
  const end = points[points.length - 1];
  const clipId = useContext(ClipContext);
  return (
    <>
      <path
        d={pathFor(points, scale)}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
        clipPath={clip ? `url(#${clipId})` : undefined}
        {...(dashed ? { strokeDasharray: "5 5" } : {})}
        {...(drawIn
          ? { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 }
          : {})}
      >
        {drawIn && (
          <animate
            attributeName="stroke-dashoffset"
            from="1"
            to="0"
            dur="0.5s"
            fill="freeze"
          />
        )}
      </path>
      {label && end && (
        <text
          x={scale.x(end.x) + 7}
          y={labelY ?? scale.y(end.y)}
          fill={FRAME.comparisonLabel}
          fontSize={11}
          dominantBaseline="central"
        >
          {label}
        </text>
      )}
    </>
  );
}

export function ComparisonCurve({
  points,
  label,
  labelY,
  drawIn = false,
}: {
  points: Point[];
  label?: string;
  labelY?: number;
  drawIn?: boolean;
}) {
  return (
    <Curve
      points={points}
      scale={HILL}
      stroke={CURVE.comparison}
      width={1.75}
      label={label}
      labelY={labelY}
      drawIn={drawIn}
    />
  );
}

const LABEL_GAP = 13;

// Hill curves of rising n all flatten into β, so labelling each at its own
// right-hand end prints them on top of one another. Takes the curves lowest
// first and walks up, holding each label clear of the one below.
export function stackedLabelYs(points: Point[][]) {
  let previous = Infinity;
  return points.map((pts) => {
    const y = Math.min(HILL.y(pts[pts.length - 1].y), previous - LABEL_GAP);
    previous = y;
    return y;
  });
}

export function Guide({
  from,
  to,
  scale,
}: {
  from: [number, number];
  to: [number, number];
  scale: Scale;
}) {
  return (
    <line
      x1={scale.x(from[0])}
      y1={scale.y(from[1])}
      x2={scale.x(to[0])}
      y2={scale.y(to[1])}
      stroke={FRAME.guide}
      strokeDasharray="4 4"
    />
  );
}

export function Crosshair({
  x,
  y,
  scale,
}: {
  x: number;
  y: number;
  scale: Scale;
}) {
  const cx = scale.x(x);
  const cy = scale.y(y);
  return (
    <>
      <line
        x1={cx}
        y1={scale.y(0)}
        x2={cx}
        y2={cy}
        stroke={FRAME.guide}
        strokeDasharray="4 4"
      />
      <line
        x1={PLOT.X0}
        y1={cy}
        x2={cx}
        y2={cy}
        stroke={FRAME.guide}
        strokeDasharray="4 4"
      />
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#fff"
        stroke={FRAME.marker}
        strokeWidth={1.5}
      />
    </>
  );
}

const ZERO_LEG_LIFT = 1.5;

// The zero leg rides just clear of the x axis, which it would otherwise sit on
// top of and read as a thickened axis.
export function StepFunction({
  beta,
  K,
  variant,
  stroke,
}: {
  beta: number;
  K: number;
  variant: "activator" | "repressor";
  stroke: string;
}) {
  const xK = HILL.x(K);
  const yHigh = HILL.y(beta);
  const yLow = HILL.y(0) - ZERO_LEG_LIFT;
  const [yBefore, yAfter] =
    variant === "activator" ? [yLow, yHigh] : [yHigh, yLow];

  return (
    <path
      d={`M${PLOT.X0},${yBefore}L${xK},${yBefore}L${xK},${yAfter}L${PLOT.X1},${yAfter}`}
      fill="none"
      stroke={stroke}
      strokeWidth={2.25}
      strokeLinejoin="round"
    />
  );
}

type ResponseTimeChartProps = {
  curve: ResponseCurve;
  steadyState?: number;
  alpha?: number;
  showHalfLife?: boolean;
};

const Yst = <Sub base="Y" sub="st" />;
const YstHalf = <Sub base="Y" sub="st" after="/2" />;
const THalf = <Sub base="T" sub="1/2" />;

export const ResponseTimeChart = ({
  curve,
  steadyState = 100,
  alpha = 0.25,
  showHalfLife = false,
}: ResponseTimeChartProps) => {
  const tHalf = responseTime(alpha);

  return (
    <Plot
      title="Protein concentration over time"
      desc={`Concentration of Y against time, approaching a steady state of ${steadyState} at a removal rate of ${alpha}.${
        showHalfLife
          ? ` The response time, where the curve reaches half the steady state, is ${tHalf.toFixed(2)}.`
          : ""
      }`}
    >
      <Axes
        scale={RESPONSE}
        xLabel="time"
        xTicks={showHalfLife ? [[tHalf, THalf]] : []}
        yTicks={
          showHalfLife
            ? [
                [steadyState, Yst],
                [steadyState / 2, YstHalf],
              ]
            : [[steadyState, Yst]]
        }
      />
      <Curve
        points={getResponseCurveData(curve, alpha, steadyState)}
        scale={RESPONSE}
        stroke={CURVE.response}
        width={2.5}
      />
      {showHalfLife && (
        <Crosshair x={tHalf} y={steadyState / 2} scale={RESPONSE} />
      )}
    </Plot>
  );
};

type ResponseTimeControlsProps = {
  steadyState: number;
  onSteadyState: (value: number) => void;
  alpha: number;
  onAlpha: (value: number) => void;
  showHalfLife: boolean;
  onShowHalfLife: (value: boolean) => void;
};

export const ResponseTimeControls = ({
  steadyState,
  onSteadyState,
  alpha,
  onAlpha,
  showHalfLife,
  onShowHalfLife,
}: ResponseTimeControlsProps) => (
  <>
    <div className="flex justify-between mt-8 w-11/12">
      <label className="flex-start mr-8">Show half-life indicator:</label>
      <Switch checked={showHalfLife} onCheckedChange={onShowHalfLife} />
    </div>
    <div>
      <div className="mt-4">
        <label className="font-medium block mb-1.5">
          <MathFormula variant="small" tex="Y_{st}" />: {steadyState}
        </label>
        <Slider
          value={[steadyState]}
          onValueChange={(values) => onSteadyState(values[0])}
          min={20}
          max={100}
          step={1}
          className="w-11/12"
        />
      </div>
      <div className="mt-4">
        <label className="font-medium block mb-1.5">
          <MathFormula variant="small" tex="\alpha" />: {alpha.toFixed(2)}
        </label>
        <Slider
          value={[alpha]}
          onValueChange={(values) => onAlpha(values[0])}
          min={0.1}
          max={1}
          step={0.01}
          className="w-11/12"
        />
      </div>
    </div>
    <p className="mt-4">
      Response time <MathFormula variant="small" tex="T_{1/2}" />:{" "}
      <InlineCode className="ml-2" variant="medium">
        {responseTime(alpha).toFixed(2)}
      </InlineCode>
    </p>
  </>
);
