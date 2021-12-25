import { useState } from "react";
import { LocalizationSimulation2D } from ".";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../../components";

const SLIDES = [
  {
    text: (
      <>
        <p>
          Here we have a 5x5 grid with our robot (Q) with tiles of two colours:
          orange and light blue.
        </p>
        <p>
          The dark blue circles indicate the robot's belief of where it
          currently is. Initially, it has no idea, so all positions are equally
          likely.
        </p>
        <p>Luckily, the robot's equipped with a sensor.</p>
      </>
    ),
  },
  {
    text: (
      <>
        <p>slide 2</p>
      </>
    ),
  },
  {
    text: (
      <>
        <p>slide 3</p>
      </>
    ),
  },
];

const LocalizationSimulation2DTutorial = () => {
  const [slide, setSlide] = useState(0);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);

  return (
    <InteractiveTutorialContainer>
      <TextContainer>
        {SLIDES[slide]?.text ? SLIDES[slide].text : null}
        <div style={{ display: "flex" }}>
          {slide > 0 ? <button onClick={goToPreviousSlide}>Back</button> : null}
          {slide < SLIDES.length - 1 ? (
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
