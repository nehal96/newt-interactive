import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from "victory";
import { axisStyle, getDottedLineStyle, SlideDeck } from "../../components";

interface RateAnalysisChartProps {
  beta?: number;
  steadyState?: number;
}

export const RateAnalysisChart = ({
  beta = 10,
  steadyState = 20,
}: RateAnalysisChartProps) => {
  const dottedLineStyle = getDottedLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  // Production line (horizontal)
  const productionData = [
    { x: 0, y: beta },
    { x: steadyState * 1.5, y: beta },
  ];

  // Removal line (diagonal with 1:1 slope)
  const removalData = [];
  const maxX = steadyState * 1;
  for (let x = 0; x <= maxX; x += maxX / 100) {
    removalData.push({ x, y: x });
  }

  return (
    <VictoryChart
      domain={{ x: [0, steadyState], y: [0, beta * 1.75] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="X"
        style={noTicksStyle}
        tickValues={[beta]}
        tickFormat={() => "Xst"}
        axisLabelComponent={<VictoryLabel dy={-37} dx={195} />}
      />
      <VictoryAxis
        dependentAxis
        label="rates"
        style={noTicksStyle}
        tickValues={[beta]}
        tickFormat={() => "β"}
      />
      {/* Production line */}
      <VictoryLine
        style={{
          data: { stroke: "#1e293b", strokeWidth: 2 },
        }}
        data={productionData}
      />
      {/* Removal line */}
      <VictoryLine
        style={{
          data: { stroke: "#ef4444", strokeWidth: 2 },
        }}
        data={removalData}
      />
      {/* Intersection point */}
      <VictoryScatter
        style={{
          data: { stroke: "#1e293b", strokeWidth: 1, fill: "black" },
        }}
        size={4}
        data={[{ x: beta, y: beta }]}
      />
      {/* Dotted line to steady state */}
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: beta, y: 0 },
          { x: beta, y: beta },
        ]}
      />
    </VictoryChart>
  );
};

export const RateAnalysisTutorial = () => {
  const slides = [
    {
      text: <></>,
      interactive: <RateAnalysisChart />,
    },
  ];

  return <SlideDeck slides={slides} />;
};
