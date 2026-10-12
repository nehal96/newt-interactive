// The series' figure colors. Green marks a match, amber a gap, gray chance,
// indigo the structure drawn over them, and red the one thing a figure is about.

export const RW = {
  // Must equal Tailwind's `paper`, or the lightest figure fills read as patches.
  paper: "#FBFAF7",
  residue: "#1A1825",
  label: "#6A687D",
  faint: "#B1AFC0",
  rule: "#DDDCE5",
  wash: "#EEEDF2",
  match: "#15803D",
  matchInk: "#14532D",
  matchSoft: "#BBF7D0",
  matchEdge: "#4ADE80",
  structure: "#4F46E5",
  gap: "#B57E1F",
  gapSoft: "#F3E3C3",
  chance: "#B1AFC0",
  focus: "#E11D48",
} as const;
