import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from "victory";
import {
  axisStyle,
  getCurveIntersectionPointStyle,
  getDottedLineStyle,
  InlineCode,
  MathFormula,
  Slider,
  Switch,
} from "../../components";
import { sample } from "./helpers";

// Shared chart vocabulary for the systems-biology series.

export const noTicksAxisStyle = {
  ...axisStyle,
  ticks: { ...axisStyle.ticks, size: 0 },
};

export const CURVE_COLOR = "#2dd4bf";
export const SECONDARY_CURVE_COLOR = "#cbd5e1";

// Flat array, never a wrapper: VictoryChart reads `type.role` off each child, so
// a plain component gets no scale or domain, and a VictoryGroup re-animates the
// whole set on every value change.
export const crosshairAt = (x: number, y: number) => [
  <VictoryLine
    key="crosshair-v"
    style={getDottedLineStyle()}
    data={[
      { x, y: 0 },
      { x, y },
    ]}
  />,
  <VictoryLine
    key="crosshair-h"
    style={getDottedLineStyle()}
    data={[
      { x: 0, y },
      { x, y },
    ]}
  />,
  <VictoryScatter
    key="crosshair-point"
    style={getCurveIntersectionPointStyle()}
    size={4}
    data={[{ x, y }]}
  />,
];

export type ResponseCurve = (
  t: number,
  alpha: number,
  steadyState: number
) => number;

export const accumulationCurve: ResponseCurve = (t, alpha, steadyState) =>
  steadyState * (1 - Math.exp(-alpha * t));

export const decayCurve: ResponseCurve = (t, alpha, steadyState) =>
  steadyState * Math.exp(-alpha * t);

export const responseTime = (alpha: number) => Math.log(2) / alpha;

// Production at rate `beta` until it hits `steadyState`, flat thereafter.
export const rampToSteadyState = (steadyState: number, beta: number) =>
  sample((t) => Math.min(t * beta, steadyState), { max: 20, step: 0.1 });

type ResponseTimeChartProps = {
  curve: ResponseCurve;
  steadyState?: number;
  alpha?: number;
  showHalfLife?: boolean;
};

export const ResponseTimeChart = ({
  curve,
  steadyState = 100,
  alpha = 0.25,
  showHalfLife = false,
}: ResponseTimeChartProps) => {
  const tHalf = responseTime(alpha);

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 110] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="time"
        style={showHalfLife ? axisStyle : noTicksAxisStyle}
        tickValues={showHalfLife ? [tHalf] : []}
        tickFormat={showHalfLife ? () => "T 1/2" : () => ""}
        axisLabelComponent={<VictoryLabel dy={-39} dx={195} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={
          showHalfLife ? [steadyState / 2, steadyState] : [steadyState]
        }
        tickFormat={(t) =>
          t === steadyState ? "Y_st" : showHalfLife ? "Y_st/2" : ""
        }
      />
      <VictoryLine
        style={{
          data: { stroke: CURVE_COLOR },
          parent: { border: "1px solid #ccc" },
        }}
        data={sample((t) => curve(t, alpha, steadyState))}
        interpolation="basis"
      />
      {showHalfLife && crosshairAt(tHalf, steadyState / 2)}
    </VictoryChart>
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
