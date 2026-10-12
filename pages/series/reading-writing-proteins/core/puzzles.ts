// Station 1's pairs. `target` is the best score possible under the puzzle's
// penalty; scripts/check-series.mjs fails if it drifts from bestAlignment.
// No runtime imports: scripts/check-series.mjs loads this file directly in Node.

export type Puzzle = {
  id: string;
  top: string;
  bottom: string;
  topLabel: string;
  bottomLabel: string;
  penalty: number;
  target: number;
  /** The best score without opening any gap inside a row. */
  bestSlide: number;
};

export const PUZZLES = {
  slide: {
    id: "slide",
    top: "GKVHL",
    bottom: "KVHLT",
    topLabel: "toy A",
    bottomLabel: "toy B",
    penalty: 0,
    target: 4,
    bestSlide: 4,
  },
  twoSlides: {
    id: "twoSlides",
    top: "PLWKTEGH",
    bottom: "PLWEGH",
    topLabel: "toy A",
    bottomLabel: "toy B",
    penalty: 0,
    target: 6,
    bestSlide: 3,
  },
  freeCheat: {
    id: "freeCheat",
    top: "KDLLSLSAG",
    bottom: "LGLDKSLSG",
    topLabel: "random A",
    bottomLabel: "random B",
    penalty: 0,
    target: 6,
    bestSlide: 3,
  },
  costCheat: {
    id: "costCheat",
    top: "KDLLSLSAG",
    bottom: "LGLDKSLSG",
    topLabel: "random A",
    bottomLabel: "random B",
    penalty: 1,
    target: 3,
    bestSlide: 3,
  },
  costRelated: {
    id: "costRelated",
    top: "PLWKTEGH",
    bottom: "PLWEGH",
    topLabel: "toy A",
    bottomLabel: "toy B",
    penalty: 1,
    target: 5,
    bestSlide: 3,
  },
  globinCost: {
    id: "globinCost",
    top: "VTALWGKVNVDEVGGEALGR",
    bottom: "VLHVWAKVEADVAGHGQDILIR",
    topLabel: "β-hemoglobin 11–30",
    bottomLabel: "myoglobin 10–31",
    penalty: 1,
    target: 7,
    bestSlide: 6,
  },
  globinFree: {
    id: "globinFree",
    top: "VTALWGKVNVDEVGGEALGR",
    bottom: "VLHVWAKVEADVAGHGQDILIR",
    topLabel: "β-hemoglobin 11–30",
    bottomLabel: "myoglobin 10–31",
    penalty: 0,
    target: 11,
    bestSlide: 6,
  },
} satisfies Record<string, Puzzle>;
