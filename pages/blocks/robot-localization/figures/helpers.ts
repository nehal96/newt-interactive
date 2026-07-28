import { BeliefsGrid, SimulationGrid } from "./types";

export const initialize2DArray = (height: number, width: number) => {
  const arr = [];
  for (let i = 0; i < height; i++) {
    const row = [];
    for (let j = 0; j < width; j++) {
      row.push(0);
    }
    arr.push(row);
  }

  return arr;
};

export const initializeBeliefs = (grid: SimulationGrid): BeliefsGrid => {
  const height = grid.length;
  const width = grid[0].length;
  const area = height * width;
  const beliefPerCell = 1 / area;
  const beliefs = new Array(height).fill(new Array(width).fill(beliefPerCell));

  return beliefs;
};

export const randomChoice = (arr: any[]) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

export const randomMove = () => {
  const dx = randomChoice([1, 0, -1]);
  const dy = randomChoice([1, 0, -1]);
  return { dx, dy };
};

export const mod = (a: number, b: number) => {
  return ((a % b) + b) % b;
};

export const normalize = (grid: BeliefsGrid) => {
  let total = 0;
  // using new Array constructor has weird behavior with assigning values in 2d
  const normalizedGrid = [];

  grid.forEach((row) => {
    row.forEach((cell) => {
      total += cell;
    });
  });

  for (let i = 0; i < grid.length; i++) {
    const normalizedRow = [];
    for (let j = 0; j < grid[0].length; j++) {
      const normalizedVal = grid[i][j] / total;
      normalizedRow.push(normalizedVal);
    }
    normalizedGrid.push(normalizedRow);
  }

  return normalizedGrid;
};

export function blur(beliefsGrid: BeliefsGrid, blurring: number) {
  const height = beliefsGrid.length;
  const width = beliefsGrid[0].length;

  const centerProb = 1 - blurring;
  const cornerProb = blurring / 12;
  const adjacentProb = blurring / 6;

  const window = [
    [cornerProb, adjacentProb, cornerProb],
    [adjacentProb, centerProb, adjacentProb],
    [cornerProb, adjacentProb, cornerProb],
  ];
  const newBeliefs: BeliefsGrid = initialize2DArray(height, width);

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const gridVal = beliefsGrid[i][j];
      for (let dx = -1; dx < 2; dx++) {
        for (let dy = -1; dy < 2; dy++) {
          const mult = window[dx + 1][dy + 1];
          const newI = mod(i + dy, height);
          const newJ = mod(j + dx, width);
          newBeliefs[newI][newJ] += mult * gridVal;
        }
      }
    }
  }

  return normalize(newBeliefs);
}