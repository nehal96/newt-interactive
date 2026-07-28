import dynamic from "next/dynamic";
import { useState } from "react";
import { SlideDeck } from "@viz/slides";
import { getSlides } from "./slides";

const CameraCanvas = dynamic(() => import("./CameraCanvas"), {
  ssr: false,
});

const CamerasSection = () => {
  const [fov, setFov] = useState(75);
  const [near, setNear] = useState(0.1);
  const [far, setFar] = useState(100);
  const [showHelper, setShowHelper] = useState(false);

  const slides = getSlides({
    fov,
    setFov,
    near,
    setNear,
    far,
    setFar,
    showHelper,
    setShowHelper,
  }).map((slide) => ({
    ...slide,
    interactive: (
      <CameraCanvas
        fov={fov}
        near={near}
        far={far}
        showHelper={showHelper}
        useOrthographic={slide.section.split(" ")[0] === "Orthographic"}
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

export default CamerasSection;
