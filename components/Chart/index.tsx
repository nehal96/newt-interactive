import { VictoryAxis } from "victory";

export const ChartXAxis = ({ ...props }) => {
  return (
    <VictoryAxis
      crossAxis
      style={{
        axis: { stroke: "#090a0b" },
        axisLabel: { padding: 30 },
        tickLabels: { fontSize: 14, fill: "#334155" },
        ticks: { stroke: "#94a3b8", size: 4 },
      }}
      {...props}
    />
  );
};

export const ChartYAxis = ({ ...props }) => {
  return (
    <VictoryAxis
      dependentAxis
      style={{
        axis: { stroke: "#94a3b8" },
        axisLabel: { padding: 30 },
        tickLabels: { fontSize: 14, fill: "#334155" },
        ticks: { stroke: "#94a3b8", size: 4 },
      }}
      {...props}
    />
  );
};
