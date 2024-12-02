import { axisStyle } from "../../components";
import { Theme } from "./types";

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
export const fitnessChartAxisStyle = (theme: string) => ({
  ...axisStyle,
  axis: {
    stroke: theme === Theme.EVANGELION ? "#55eeaa" : "#1e293b",
  },
  axisLabel: {
    ...axisStyle.axisLabel,
    fontSize: 11,
    fontFamily: "monospace",
    padding: 25,
    fill: theme === Theme.EVANGELION ? "#55eeaa" : "#1e293b",
  },
  tickLabels: {
    ...axisStyle.tickLabels,
    fontSize: 11,
    fontFamily: "monospace",
    fill: theme === Theme.EVANGELION ? "#55eeaa" : "#1e293b",
  },
  ticks: { ...axisStyle.ticks, size: 0 },
});
