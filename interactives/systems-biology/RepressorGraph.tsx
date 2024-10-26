import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
  VictoryLabel,
  VictoryContainer,
} from "victory";
import {
  axisStyle,
  getDottedLineStyle,
  getGridLineStyle,
} from "../../components";

interface RepressorGraphProps {
  repressorBeta: number;
  repressorK: number;
  repressorHillFunctionData: { x: number; y: number }[];
  children?: React.ReactNode;
  mainLineColor?: string;
  chartOptions?: {
    showKIndicator?: boolean;
  };
}

const RepressorGraph: React.FC<RepressorGraphProps> = ({
  repressorBeta,
  repressorK,
  repressorHillFunctionData,
  children,
  mainLineColor = "#3b82f6",
  chartOptions = {
    showKIndicator: false,
  },
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const gridLineStyle = getGridLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  const { showKIndicator } = chartOptions;

  const XAxisStyle = showKIndicator ? axisStyle : noTicksStyle;
  const XAxisTickValues = showKIndicator ? [repressorK] : [];
  const XAxisTickFormat = showKIndicator ? () => "K" : () => "";
  const YAxisTickValues = showKIndicator
    ? [repressorBeta / 2, repressorBeta]
    : [repressorBeta];

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 22] }}
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
          t == repressorBeta ? "β" : repressorBeta > 3.5 ? "β/2" : ""
        }
      />
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0.05, y: repressorBeta },
          { x: 20, y: repressorBeta },
        ]}
      />
      <VictoryLine
        style={{
          data: { stroke: mainLineColor },
          parent: { border: "1px solid #ccc" },
        }}
        data={repressorHillFunctionData}
        interpolation="basis"
      />
      {children}
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: repressorK, y: 0 },
            { x: repressorK, y: repressorBeta / 2 },
          ]}
        />
      )}
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: 0, y: repressorBeta / 2 },
            { x: repressorK, y: repressorBeta / 2 },
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
              x: repressorK,
              y: repressorBeta / 2,
            },
          ]}
        />
      )}
    </VictoryChart>
  );
};

export default RepressorGraph;
