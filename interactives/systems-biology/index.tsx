import React from "react";
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

interface ActivatorGraphProps {
  activatorBeta: number;
  activatorK: number;
  activatorHillFunctionData: { x: number; y: number }[];
}

export const ActivatorGraph: React.FC<ActivatorGraphProps> = ({
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const gridLineStyle = getGridLineStyle();

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 22] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="X*"
        style={axisStyle}
        tickValues={[activatorK]}
        tickFormat={() => "K"}
        axisLabelComponent={<VictoryLabel dy={-37} dx={190} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={[activatorBeta / 2, activatorBeta]}
        tickFormat={(t) =>
          t == activatorBeta ? "β" : activatorBeta > 3.5 ? "β/2" : ""
        }
      />
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc" },
        }}
        data={activatorHillFunctionData}
        interpolation="basis"
      />

      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: activatorK, y: 0 },
          { x: activatorK, y: activatorBeta / 2 },
        ]}
      />
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: 0, y: activatorBeta / 2 },
          { x: activatorK, y: activatorBeta / 2 },
        ]}
      />
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0, y: activatorBeta },
          { x: 20, y: activatorBeta },
        ]}
      />
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
    </VictoryChart>
  );
};
