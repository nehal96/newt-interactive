import { definePiece } from "@lib/piece";

export default definePiece({
  href: "/series/reading-writing-proteins",
  kind: "series",
  title: "Reading and Writing Proteins",
  subtitle:
    "The problems behind computational biology's tools, worked through on one protein family",
  description:
    "Work through the algorithms of computational biology on the globins, from comparing two proteins by hand in 1970 to the family alignments AlphaFold reads.",
  keywords:
    "computational biology, bioinformatics, sequence alignment, Needleman-Wunsch, dot plot, globins, protein evolution, interactive explainers",
  published: "2026-10-12",
  art: "pair-grid",
  ogType: "website",
  parts: [
    {
      href: "/series/reading-writing-proteins/related",
      title: "Are These Two Proteins Related?",
      published: "2026-10-12",
      section: "From Alignment to AlphaFold",
    },
  ],
});
