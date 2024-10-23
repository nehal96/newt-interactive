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
  getDottedLineStyle,
  getGridLineStyle,
} from "../../components";
import { getActivatorHillFunctionData } from "./helpers";

interface ActivatorGraphProps {
  activatorBeta: number;
  activatorK: number;
  activatorHillFunctionData: { x: number; y: number }[];
  children?: React.ReactNode;
  chartOptions?: {
    xAxisTickValues?: (number | string)[];
    xAxisTickFormat?: (t: number | string) => string;
    showKIndicator?: boolean;
    showNComparisonCurves?: boolean;
  };
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
      data: { stroke: "#cbd5e1" },
      parent: { border: "1px solid #ccc" },
    }}
    data={data}
    interpolation="basis"
    labels={({ datum }) => (showLabel && datum.x === domainMax ? label : "")}
    labelComponent={<VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />}
  />
);

export const ActivatorGraph: React.FC<ActivatorGraphProps> = ({
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
  children,
  chartOptions = {
    xAxisTickValues: null,
    xAxisTickFormat: null,
    showKIndicator: false,
    showNComparisonCurves: false,
  },
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const gridLineStyle = getGridLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  const XAxisStyle = chartOptions?.showKIndicator ? axisStyle : noTicksStyle;
  const XAxisTickValues = chartOptions.xAxisTickValues
    ? chartOptions.xAxisTickValues
    : chartOptions?.showKIndicator
    ? [activatorK]
    : [];
  const XAxisTickFormat = chartOptions.xAxisTickFormat
    ? chartOptions.xAxisTickFormat
    : chartOptions?.showKIndicator
    ? () => "K"
    : () => "";
  const YAxisTickValues = chartOptions?.showKIndicator
    ? [activatorBeta / 2, activatorBeta]
    : [activatorBeta];

  const { showKIndicator, showNComparisonCurves } = chartOptions;

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
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc" },
        }}
        data={activatorHillFunctionData}
        interpolation="basis"
      />
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0.05, y: activatorBeta },
          { x: 20, y: activatorBeta },
        ]}
      />
      {children}
      {/* not grouped so the changes are smooth when values are changed (otherwise there's a small delay) */}
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: activatorK, y: 0 },
            { x: activatorK, y: activatorBeta / 2 },
          ]}
        />
      )}
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: 0, y: activatorBeta / 2 },
            { x: activatorK, y: activatorBeta / 2 },
          ]}
        />
      )}
      {showKIndicator && (
        <VictoryScatter
          style={{
            data: { stroke: "#1e293b", strokeWidth: 1, fill: "white" },
          }}
          size={4}
          data={[
            {
              x: activatorK,
              y: activatorBeta / 2,
            },
          ]}
        />
      )}
    </VictoryChart>
  );
};

export default ActivatorGraph;
