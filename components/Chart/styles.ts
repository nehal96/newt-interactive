export const axisStyle = {
  axis: { stroke: "#1e293b", strokeWidth: 2 },
  axisLabel: {
    fontFamily: "avenir",
    fontSize: 14,
    padding: 30,
    fill: "#1e293b",
  },
  tickLabels: {
    fontSize: 14,
    fill: "#1e293b",
    padding: 5,
  },
  ticks: { stroke: "#1e293b", size: 5 },
};

export const getDottedLineStyle = (color: string = "#1e293b") => ({
  data: {
    stroke: color,
    strokeWidth: 1,
    strokeDasharray: "4,4",
  },
});

export const getGridLineStyle = (color: string = "#e5e7eb") => ({
  data: {
    stroke: color,
    strokeWidth: 1,
  },
});

export const getCurveIntersectionPointStyle = (color: string = "#1e293b") => ({
  data: {
    stroke: color,
    strokeWidth: 1,
    fill: "white",
  },
});
