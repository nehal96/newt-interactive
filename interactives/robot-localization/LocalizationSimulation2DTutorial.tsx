import { useState } from "react";
import { LocalizationSimulation2D } from ".";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../../components";
import { SLIDES, totalSlides } from "./slides";

const LocalizationSimulation2DTutorial = () => {
  const [slide, setSlide] = useState(1);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);

  return (
    <InteractiveTutorialContainer>
      <TextContainer>
        {SLIDES[slide]?.text ? SLIDES[slide].text : null}
        <div style={{ display: "flex" }}>
          {slide > 1 ? <button onClick={goToPreviousSlide}>Back</button> : null}
          {slide < totalSlides ? (
            <button onClick={goToNextSlide}>Next</button>
          ) : null}
        </div>
      </TextContainer>
      <InteractiveContainer>
        <LocalizationSimulation2D />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default LocalizationSimulation2DTutorial;
