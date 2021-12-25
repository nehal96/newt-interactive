export type SimulationGrid = string[][];
export type BeliefsGrid = number[][];
export type GridPosition = {
  row: number;
  col: number;
};

export type SlideAction = "sense" | "move";
type Slide = {
  text: JSX.IntrinsicElements["p"];
  actionButton?: SlideAction;
};
export type Slides = {
  [index: number]: Slide;
};

export interface LocalizationSimulaton2D {
  grid: SimulationGrid;
  beliefs: BeliefsGrid;
  currentPosition: GridPosition;
}
