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

type Section = "overview" | "code-explain";
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
export type NextAction =
  | "reset"
  | "show under the hood"
  | "hide under the hood";
export type BackAction = "hide under the hood";
type Slide = {
  section: Section;
  text: JSX.IntrinsicElements["p"];
  actionButtons?: ActionButtons;
  onNext?: NextAction[];
  nextButtonTitle?: string;
  onBack?: BackAction[];
};
export type Slides = {
  [index: number]: Slide;
};

export interface LocalizationSimulaton2D {
  grid: SimulationGrid;
  beliefs: BeliefsGrid;
  currentPosition: GridPosition;
  showUnderTheHood: boolean;
}
