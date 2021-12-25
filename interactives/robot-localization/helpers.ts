import { BeliefsGrid, SimulationGrid } from "./types";

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

export const normalize = (grid: BeliefsGrid, total: number = 0) => {
  const normalizedGrid = new Array(grid.length).fill(
    new Array(grid[0].length).fill(0)
  );

  if (!total) {
    grid.forEach((row) => {
      row.forEach((cell) => {
        total += cell;
      });
    });
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      normalizedGrid[i][j] = grid[i][j] / total;
    }
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
  const newBeliefs: BeliefsGrid = new Array(height).fill(
    new Array(width).fill(0)
  );

  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const gridVal = beliefsGrid[i][j];
      for (let dx = -1; dx < 2; dx++) {
        for (let dy = -1; dy < 2; dy++) {
          const mult = window[dx + 1][dy + 1];
          const newI = mod(i + dy, height);
          const newJ = mod(i + dx, width);
          newBeliefs[newI][newJ] += mult * gridVal;
          console.log({
            i,
            j,
            gridVal,
            multVal: gridVal * mult,
            newBeliefs,
          });
        }
      }
    }
  }

  console.log("new beliefs", newBeliefs);

  return normalize(newBeliefs);
}