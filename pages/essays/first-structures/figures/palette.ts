// The diffraction figures' colour language. Blue is the wave being tracked,
// amber the second one it has to agree with, and the single red marks whatever
// the figure is actually about.

export const XR = {
  first: "#3F71D8",
  second: "#B57E1F",
  accent: "#E11D48",
  success: "#059669",
  ink: "#1A1825",
  guide: "#B1AFC0",
  molecule: "#C7D2FE",
  moleculeEdge: "#818CF8",
  rule: "#DDDCE5",
  label: "#6A687D",
  film: "#FBFAF7",
  filmGrey: "#E6E5E0",
  paper: "#FBFAF7",
  // Must equal Tailwind's `card`, the figure background, or label halos show as patches.
  card: "#F2F1ED",
} as const;

/** Perutz's painted-wood model and its lighting. */
export const MODEL = {
  alpha: "#ECE8DF",
  beta: "#2A292D",
  heme: "#A92A22",
  skyLight: "#ffffff",
  groundLight: "#8a8798",
} as const;
