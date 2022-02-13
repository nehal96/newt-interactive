import dynamic from "next/dynamic";
import { useState } from "react";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  Slides,
} from "../../../../components";
import { getSlides } from "./slides";

const CameraCanvas = dynamic(() => import("./CameraCanvas"), {
  ssr: false,
});
const SLIDES = getSlides();

const CamerasSection = () => {
  const [slide, setSlide] = useState(1);
  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => setSlide(1);

  return (
    <InteractiveTutorialContainer>
      <Slides
        slides={SLIDES}
        currentSlideNumber={slide}
        onBack={goToPreviousSlide}
        onNext={goToNextSlide}
        onReset={onReset}
        className="lg:w-1/2"
      />
      <InteractiveContainer className="lg:w-1/2 self-center w-[400px] h-[400px]">
        <CameraCanvas />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default CamerasSection;
