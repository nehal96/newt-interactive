import { axisStyle } from "../../components";

export const CIRCUIT_CONFIG = {
  MAX_GENERATIONS: 100,
  VARIATIONS_PER_GENERATION: {
    INITIAL: 10,
    MIN: 1,
    MAX: 20,
    STEP: 1,
  },
  NUM_INPUTS: 4,
};

// Chart Styling
export const fitnessChartAxisStyle = {
  ...axisStyle,
  axisLabel: {
    ...axisStyle.axisLabel,
    fontSize: 11,
    fontFamily: "monospace",
    padding: 25,
  },
  tickLabels: {
    ...axisStyle.tickLabels,
    fontSize: 11,
    fontFamily: "monospace",
  },
  ticks: { ...axisStyle.ticks, size: 0 },
};
