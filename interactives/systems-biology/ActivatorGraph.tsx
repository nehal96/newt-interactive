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
    showKIndicator?: boolean;
    showNComparisonCurves?: boolean;
  };
}

export const ActivatorGraph: React.FC<ActivatorGraphProps> = ({
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
  children,
  chartOptions = {
    xAxisTickValues: null,
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
  const XAxisTickValues = chartOptions?.showKIndicator ? [activatorK] : [];
  const XAxisTickFormat = chartOptions?.showKIndicator ? () => "K" : () => "";
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
        <VictoryLine
          style={{
            data: { stroke: "#cbd5e1" },
            parent: { border: "1px solid #ccc" },
          }}
          data={getActivatorHillFunctionData(20, activatorK, 2)}
          interpolation="basis"
          labels={({ datum }) => (datum.x === 20 ? "n = 2" : "")}
          labelComponent={
            <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
          }
          animate={{
            onLoad: { duration: 1500 },
          }}
        />
      )}
      {showNComparisonCurves && (
        <VictoryLine
          style={{
            data: { stroke: "#cbd5e1" },
            parent: { border: "1px solid #ccc" },
          }}
          data={getActivatorHillFunctionData(20, activatorK, 4)}
          interpolation="basis"
          labels={({ datum }) => (datum.x === 20 ? "n = 4" : "")}
          labelComponent={
            <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
          }
          animate={{
            onLoad: { duration: 1500 },
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
