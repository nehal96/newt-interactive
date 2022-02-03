import { useState } from "react";
import Image from "next/image";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  Slides,
} from "../../components";
import { getSlides } from "./slides";
import slsAmgPic from "../../public/images/sls-amg-black-series.jpeg";

const EdgeDetectionTutorial = () => {
  const [slide, setSlide] = useState(1);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => setSlide(1);

  const SLIDES = getSlides();

  return (
    <InteractiveTutorialContainer>
      <Slides
        slides={SLIDES}
        currentSlideNumber={slide}
        onBack={goToPreviousSlide}
        onNext={goToNextSlide}
        onReset={onReset}
        className="lg:w-2/5"
      />
      <InteractiveContainer className="lg:w-3/5">
        <Image
          src={SLIDES[slide].imgSrc ?? slsAmgPic}
          height={635}
          width={1128}
        />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default EdgeDetectionTutorial;
