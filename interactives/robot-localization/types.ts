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

export type ActionButton =
  | {
      type: "sense";
      args: null;
      goToNextSlide: boolean;
    }
  | {
      type: "move";
      args: GridPositionChange | null;
      goToNextSlide: boolean;
    };
type Slide = {
  text: JSX.IntrinsicElements["p"];
  actionButton?: ActionButton;
};
export type Slides = {
  [index: number]: Slide;
};

export interface LocalizationSimulaton2D {
  grid: SimulationGrid;
  beliefs: BeliefsGrid;
  currentPosition: GridPosition;
}
