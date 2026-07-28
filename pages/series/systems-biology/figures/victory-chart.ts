import { axisStyle } from "@viz/chart";

// What the figures still on Victory need. Parts One to Three are on ./chart.

export const noTicksAxisStyle = {
  ...axisStyle,
  ticks: { ...axisStyle.ticks, size: 0 },
};

export const CURVE_COLOR = "#2dd4bf";
export const SECONDARY_CURVE_COLOR = "#cbd5e1";
