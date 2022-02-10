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

const AnimationsCanvas = dynamic(() => import("./AnimationsCanvas"), {
  ssr: false,
});

const SLIDES = getSlides();

const Animations = () => {
  const [slide, setSlide] = useState(1);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => setSlide(1);

  const sections = _.chain(SLIDES)
    .map((slide: Slide, key: string) => ({
      name: slide.section,
      onSelect: () => setSlide(Number(key)),
    }))
    .value();

  return (
    <>
      <InteractiveTutorialContainer>
        <Slides
          slides={SLIDES}
          currentSlideNumber={slide}
          onBack={goToPreviousSlide}
          onNext={goToNextSlide}
          onReset={onReset}
          jumpToSectionMenu={sections}
          currentSection={SLIDES[slide].section}
          className="lg:w-1/2"
        />
        <InteractiveContainer className="lg:w-1/2 self-center w-[400px] h-[400px]">
          <AnimationsCanvas animationCode={SLIDES[slide].code ?? null} />
        </InteractiveContainer>
      </InteractiveTutorialContainer>
    </>
  );
};

export default Animations;
