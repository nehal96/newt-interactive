import { MouseEventHandler } from "react";

export type SimulationGrid = string[][];
export type BeliefsGrid = number[][];

type Slide = {
  text: JSX.IntrinsicElements["p"];
  actionButton?: (onClick: MouseEventHandler<HTMLButtonElement>) => JSX.Element;
};
export type Slides = {
  [index: number]: Slide;
};
