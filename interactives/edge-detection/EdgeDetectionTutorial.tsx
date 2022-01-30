import { useState } from "react";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  Slides,
} from "../../components";
import { getSlides } from "./slides";

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
      />
      <InteractiveContainer className="lg:w-3/5">
        <div>stuff</div>
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default EdgeDetectionTutorial;
