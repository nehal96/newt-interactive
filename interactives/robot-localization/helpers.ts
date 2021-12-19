import { BeliefsGrid, SimulationGrid } from "./types";

export const initializeBeliefs = (grid: SimulationGrid): BeliefsGrid => {
  const height = grid.length;
  const width = grid[0].length;
  const area = height * width;
  const beliefPerCell = 1 / area;
  const beliefs = new Array(height).fill(new Array(width).fill(beliefPerCell));

  return beliefs;
};
