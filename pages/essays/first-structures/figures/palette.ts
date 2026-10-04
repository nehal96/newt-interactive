// The diffraction figures' colour language. Blue is the wave being tracked,
// amber the second one it has to agree with, and the single red marks whatever
// the figure is actually about.

export const XR = {
  first: "#3F71D8",
  second: "#B57E1F",
  accent: "#E11D48",
  sum: "#1A1825",
  atom: "#B1AFC0",
  molecule: "#C7D2FE",
  moleculeEdge: "#818CF8",
  rule: "#DDDCE5",
  label: "#6A687D",
  film: "#F1EFE8",
  // Must equal Tailwind's `paper`, or label halos show as patches.
  paper: "#FBFAF7",
} as const;
