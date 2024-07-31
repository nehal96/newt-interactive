import dynamic from "next/dynamic";
import { useState } from "react";
import _ from "lodash";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  Slides,
} from "../../../../components";
import { getSlides } from "./slides";
import { Slide } from "./types";
import { BoxGeometryProps } from "@react-three/fiber";

const AnimationsCanvas = dynamic(() => import("./AnimationsCanvas"), {
  ssr: false,
});

const Animations = () => {
  const [slide, setSlide] = useState(1);
  const [boxArgs, setBoxArgs] = useState<BoxGeometryProps["args"]>([
    1.5, 1.5, 1.5,
  ]);
  const [rps, setRps] = useState(1);
  const [enableOrbitControls, setEnableOrbitControls] = useState(false);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => setSlide(1);

  const SLIDES = getSlides({
    boxArgs,
    setBoxArgs,
    rps,
    setRps,
    enableOrbitControls,
    setEnableOrbitControls,
  });
  const sections = _.chain(SLIDES)
    .map((slide: Slide, key: string) => ({
      name: slide.section,
      onSelect: () => setSlide(Number(key)),
    }))
    .value();

  const onJumpToSection = (section) => {
    const slide = _.find(SLIDES, (slide) => {
      return slide.section === section;
    });
    const number = slide?.number || 1;

    setSlide(number);
  };

  return (
    <>
      <InteractiveTutorialContainer>
        <Slides
          slides={SLIDES}
          currentSlideNumber={slide}
          onBack={goToPreviousSlide}
          onNext={goToNextSlide}
          onReset={onReset}
          onJumpToSection={onJumpToSection}
          jumpToSectionMenu={sections}
          currentSection={SLIDES[slide].section}
          className="lg:w-1/2"
        />
        <InteractiveContainer className="lg:w-1/2 self-center w-[400px] h-[400px]">
          <AnimationsCanvas
            boxArgs={boxArgs}
            enableOrbitControls={enableOrbitControls}
            animationCode={SLIDES[slide].code ?? null}
          />
        </InteractiveContainer>
      </InteractiveTutorialContainer>
    </>
  );
};

export default Animations;
