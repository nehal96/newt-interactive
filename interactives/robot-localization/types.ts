import React from "react";

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

export type Section = "overview" | "code-explain" | "playground";
export type NextAction =
  | "reset"
  | "show under the hood"
  | "hide under the hood";
export type BackAction = "hide under the hood";
export type GetSlideParams = {
  onSense: (goToNextSlide: boolean) => void;
  onMove: (args: GridPositionChange, goToNextSlide: boolean) => void;
};
type Slide = {
  section: Section;
  text: React.ReactNode;
  onNext?: NextAction[];
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
export interface LocalizationSlidesProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  onBack: (actions?: BackAction[]) => void;
  onNext: (actions?: NextAction[]) => void;
  onJumpToSection: (section: Section) => void;
  onReset: () => void;
}
