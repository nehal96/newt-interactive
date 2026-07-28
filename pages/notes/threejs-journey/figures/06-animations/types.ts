import React, { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { BoxGeometryProps, Camera, MeshProps } from "@react-three/fiber";
import type { Clock } from "three";

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
export type Slides = Slide[];
export type GetSlidesParams = {
  boxArgs: BoxGeometryProps["args"];
  setBoxArgs: Dispatch<SetStateAction<BoxGeometryProps["args"]>>;
  rps: number;
  setRps: Dispatch<SetStateAction<number>>;
  enableOrbitControls: boolean;
  setEnableOrbitControls: Dispatch<SetStateAction<boolean>>;
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
  enableOrbitControls: boolean;
  setEnableOrbitControls: Dispatch<SetStateAction<boolean>>;
};
