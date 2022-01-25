import React, { Dispatch, SetStateAction } from "react";

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

export type Section = "overview" | "code" | "playground";
export type NextAction =
  | "reset"
  | "show under the hood"
  | "hide under the hood";
export type BackAction = "hide under the hood";
export type PlaygroundValues = {
  pHit: number;
  setPHit: Dispatch<SetStateAction<number>>;
  pMiss: number;
  setPMiss: Dispatch<SetStateAction<number>>;
};
export type GetSlideParams = {
  onSense: (goToNextSlide: boolean) => void;
  onMove: (args: GridPositionChange, goToNextSlide: boolean) => void;
  playgroundValues: PlaygroundValues;
};
type Slide = {
  section: Section;
  text: React.ReactNode;
  onNextActions?: NextAction[];
  onBackActions?: BackAction[];
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
export interface LocalizationSlidesProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  onBack: (actions?: BackAction[]) => void;
  onNext: (actions?: NextAction[]) => void;
  onJumpToSection: (section: Section) => void;
  onReset: () => void;
}
