// Needleman and Wunsch's Table 1 (p. 449), the sets that score identical pairs only.

export type Table1Row = {
  set: number;
  penalty: number;
  real: number;
  random: number;
  s: number;
  x: number;
  gaps: number;
  randomGaps: number;
};

export const TABLE_1: Table1Row[] = [
  { set: 1, penalty: 0, real: 63, random: 55.6, s: 1.8, x: 4.11, gaps: 35, randomGaps: 36.2 },
  { set: 2, penalty: 1, real: 38, random: 27.8, s: 2.09, x: 4.88, gaps: 4, randomGaps: 5.5 },
];
