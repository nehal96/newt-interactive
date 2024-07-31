import dynamic from "next/dynamic";
import _ from "lodash";
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

const CamerasSection = () => {
  const [slide, setSlide] = useState(1);
  const [fov, setFov] = useState(75);
  const [near, setNear] = useState(0.1);
  const [far, setFar] = useState(100);
  const [showHelper, setShowHelper] = useState(false);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => setSlide(1);

  const SLIDES = getSlides({
    fov,
    setFov,
    near,
    setNear,
    far,
    setFar,
    showHelper,
    setShowHelper,
  });
  const sections = _.chain(SLIDES)
    .map((slide, key: string) => ({
      name: slide.section,
      onSelect: () => setSlide(Number(key)),
    }))
    .value();
  const currentSection = SLIDES[slide].section;
  const useOrthographic = currentSection.split(" ")[0] === "Orthographic";

  const onJumpToSection = (section) => {
    const slide = _.find(SLIDES, (slide) => {
      return slide.section === section;
    });
    const number = slide?.number || 1;

    setSlide(number);
  };

  return (
    <InteractiveTutorialContainer>
      <Slides
        slides={SLIDES}
        currentSlideNumber={slide}
        onBack={goToPreviousSlide}
        onNext={goToNextSlide}
        onReset={onReset}
        onJumpToSection={onJumpToSection}
        jumpToSectionMenu={sections}
        currentSection={currentSection}
        className="lg:w-1/2"
      />
      <InteractiveContainer className="lg:w-1/2 self-center w-[400px] h-[400px]">
        <CameraCanvas
          fov={fov}
          near={near}
          far={far}
          showHelper={showHelper}
          useOrthographic={useOrthographic}
        />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default CamerasSection;
