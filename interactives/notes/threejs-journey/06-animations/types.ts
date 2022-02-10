import React, { MutableRefObject } from "react";
import { Camera } from "react-three-fiber";
import { Clock } from "three";

type CodeParams = {
  mesh?: MutableRefObject<any>;
  time?: number;
  setTime?: (time: number) => void;
  clock?: Clock;
  camera?: Camera;
};
export type Slide = {
  section: string;
  text: React.ReactNode;
  code?: (params: CodeParams) => void;
};
export type Slides = {
  [index: number]: Slide;
};
