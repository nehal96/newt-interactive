import { Dispatch, SetStateAction } from "react";

export type GetSlidesParams = {
  fov: number;
  setFov: Dispatch<SetStateAction<number>>;
  near: number;
  setNear: Dispatch<SetStateAction<number>>;
  far: number;
  setFar: Dispatch<SetStateAction<number>>;
  showHelper: boolean;
  setShowHelper: Dispatch<SetStateAction<boolean>>;
};
export type Slide = {
  section: string;
  text: React.ReactNode;
};
export type Slides = {
  [index: number]: Slide;
};

export type CameraCanvasProps = {
  fov: number;
  near: number;
  far: number;
  showHelper: boolean;
  useOrthographic: boolean;
};
