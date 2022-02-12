import React, { Dispatch, MutableRefObject, SetStateAction } from "react";
import { BoxGeometryProps, Camera, MeshProps } from "react-three-fiber";
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
export type GetSlidesParams = {
  boxArgs: BoxGeometryProps["args"];
  setBoxArgs: Dispatch<SetStateAction<BoxGeometryProps["args"]>>;
  rps: number;
  setRps: Dispatch<SetStateAction<number>>;
};

export type BoxParams = MeshProps & {
  boxArgs: BoxGeometryProps["args"];
  animationCode?: (params: CodeParams) => void;
};
export type BoxAnimationsPlaygroundProps = {
  boxArgs: BoxGeometryProps["args"];
  setBoxArgs: Dispatch<SetStateAction<BoxGeometryProps["args"]>>;
  rps: number;
  setRps: Dispatch<SetStateAction<number>>;
};
