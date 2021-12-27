export type SimulationGrid = string[][];
export type BeliefsGrid = number[][];
export type GridPosition = {
  row: number;
  col: number;
};
export type GridPositionChange = {
  dx: number;
  dy: number;
};

export type SenseButton = {
  type: "sense";
  args: null;
  goToNextSlide: boolean;
};
export type MoveButton = {
  type: "move";
  args: GridPositionChange | null;
  goToNextSlide: boolean;
};
export type ActionButtons = Array<SenseButton | MoveButton>;
type Slide = {
  text: JSX.IntrinsicElements["p"];
  actionButtons?: ActionButtons;
};
export type Slides = {
  [index: number]: Slide;
};

export interface LocalizationSimulaton2D {
  grid: SimulationGrid;
  beliefs: BeliefsGrid;
  currentPosition: GridPosition;
}
