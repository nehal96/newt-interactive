export const chartStyles = {
  chart: {
    width: 200,
    height: 100,
    padding: { top: 5, bottom: 10, left: 25, right: 10 },
  },
  axis: {
    style: {
      axis: { stroke: "#64748b" },
      tickLabels: { fill: "#64748b", fontSize: 8, padding: 2 },
      grid: { stroke: "none" },
    },
    labelComponent: { dy: -5, dx: 190 },
  },
  line: {
    default: {
      data: { stroke: "#3f3f46" },
    },
    dashed: {
      data: {
        stroke: "#94a3b8",
        strokeDasharray: "4,4",
        strokeWidth: 1,
      },
    },
  },
  scatter: {
    data: { fill: "#ef4444" },
  },
};
