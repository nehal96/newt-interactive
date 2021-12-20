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