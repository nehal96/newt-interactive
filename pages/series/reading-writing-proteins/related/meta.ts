import { definePiece } from "@lib/piece";

export default definePiece({
  href: "/series/reading-writing-proteins/related",
  kind: "series",
  title: "Are These Two Proteins Related?",
  subtitle:
    "Myoglobin and hemoglobin share a shape. In 1970, Needleman and Wunsch asked whether their sequences prove it.",
  description:
    "Line up two globin sequences by hand, find the limit, then follow the dot plot, Needleman and Wunsch's 1970 algorithm and their shuffle test on the same pair.",
  keywords:
    "sequence alignment, Needleman-Wunsch, dot plot, gap penalty, shuffle test, myoglobin, hemoglobin, homology",
  published: "2026-10-12",
  art: "pair-grid",
  series: {
    name: "Reading and Writing Proteins",
    href: "/series/reading-writing-proteins",
  },
});
