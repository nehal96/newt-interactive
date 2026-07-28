import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
} from "victory";
import { axisStyle, getGridLineStyle } from "../../components";
import { crosshairAt, noTicksAxisStyle, SECONDARY_CURVE_COLOR } from "./chart";
import { getActivatorHillFunctionData, Point } from "./helpers";

interface ActivatorGraphProps {
  activatorBeta: number;
  activatorK: number;
  activatorHillFunctionData: Point[];
  children?: React.ReactNode;
  xAxisTickValues?: (number | string)[];
  xAxisTickFormat?: (t: number | string) => string;
  showKIndicator?: boolean;
  showNComparisonCurves?: boolean;
  hideMainCurve?: boolean;
}

export const SecondaryLine = ({
  data,
  showLabel = true,
  label,
  domainMax = 20,
  ...props
}) => (
  <VictoryLine
    {...props}
    style={{
      data: { stroke: SECONDARY_CURVE_COLOR },
      parent: { border: "1px solid #ccc" },
    }}
    data={data}
    interpolation="basis"
    labels={({ datum }) => (showLabel && datum.x === domainMax ? label : "")}
    labelComponent={<VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />}
  />
);

export const ActivatorGraph = ({
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
  children,
  xAxisTickValues,
  xAxisTickFormat,
  showKIndicator = false,
  showNComparisonCurves = false,
  hideMainCurve = false,
}: ActivatorGraphProps) => {
  const gridLineStyle = getGridLineStyle();

  const XAxisStyle = showKIndicator ? axisStyle : noTicksAxisStyle;
  const XAxisTickValues =
    xAxisTickValues ?? (showKIndicator ? [activatorK] : []);
  const XAxisTickFormat =
    xAxisTickFormat ?? (showKIndicator ? () => "K" : () => "");
  const YAxisTickValues = showKIndicator
    ? [activatorBeta / 2, activatorBeta]
    : [activatorBeta];

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 22] }}
      domainPadding={{ x: showNComparisonCurves ? 40 : 0 }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="X*"
        style={XAxisStyle}
        tickValues={XAxisTickValues}
        tickFormat={XAxisTickFormat}
        axisLabelComponent={<VictoryLabel dy={-37} dx={190} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={YAxisTickValues}
        tickFormat={(t) =>
          t == activatorBeta ? "β" : activatorBeta > 3.5 ? "β/2" : ""
        }
      />
      {showNComparisonCurves && (
        <SecondaryLine
          data={getActivatorHillFunctionData(20, activatorK, 2)}
          label="n = 2"
          animate={{
            onLoad: { duration: 500 },
          }}
        />
      )}
      {showNComparisonCurves && (
        <SecondaryLine
          data={getActivatorHillFunctionData(20, activatorK, 4)}
          label="n = 4"
          animate={{
            onLoad: { duration: 500 },
          }}
        />
      )}
      {!hideMainCurve && (
        <VictoryLine
          style={{
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={activatorHillFunctionData}
          interpolation="basis"
        />
      )}
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0.05, y: activatorBeta },
          { x: 20, y: activatorBeta },
        ]}
      />
      {children}
      {showKIndicator && crosshairAt(activatorK, activatorBeta / 2)}
    </VictoryChart>
  );
};
