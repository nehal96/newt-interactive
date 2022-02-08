import { ImageProps } from "next/image";

export type Slide = {
  text: React.ReactNode;
  image?: {
    src: string;
    height: number;
    width: number;
    layout?: "fixed" | "intrinsic" | "responsive";
  };
};
export type Slides = {
  [index: number]: Slide;
};
