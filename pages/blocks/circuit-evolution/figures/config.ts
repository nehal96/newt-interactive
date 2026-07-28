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

export const fitnessChartColors = (theme: string) =>
  theme === Theme.EVANGELION
    ? { frame: "#55eeaa", line: "#55eeaa", marker: "#E65B08" }
    : { frame: "#1e293b", line: "#3f3f46", marker: "#ef4444" };
