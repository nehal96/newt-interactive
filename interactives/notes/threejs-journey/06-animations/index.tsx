import dynamic from "next/dynamic";
import { useState } from "react";
import { SlideDeck } from "@viz/slides";
import { getSlides } from "./slides";
import { BoxGeometryProps } from "@react-three/fiber";

const AnimationsCanvas = dynamic(() => import("./AnimationsCanvas"), {
  ssr: false,
});

const Animations = () => {
  const [boxArgs, setBoxArgs] = useState<BoxGeometryProps["args"]>([
    1.5, 1.5, 1.5,
  ]);
  const [rps, setRps] = useState(1);
  const [enableOrbitControls, setEnableOrbitControls] = useState(false);

  const slides = getSlides({
    boxArgs,
    setBoxArgs,
    rps,
    setRps,
    enableOrbitControls,
    setEnableOrbitControls,
  }).map((slide) => ({
    ...slide,
    interactive: (
      <AnimationsCanvas
        boxArgs={boxArgs}
        enableOrbitControls={enableOrbitControls}
        animationCode={slide.code ?? null}
      />
    ),
  }));

  return (
    <SlideDeck
      slides={slides}
      textContainerClass="lg:w-1/2"
      interactiveContainerClass="lg:w-1/2 self-center w-[400px] h-[400px]"
    />
  );
};

export default Animations;
