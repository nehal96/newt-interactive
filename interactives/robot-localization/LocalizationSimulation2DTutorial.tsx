import { useState } from "react";
import { LocalizationSimulation2D } from ".";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../../components";
import useLocalizationSimulation from "./hooks";
import { SLIDES, totalSlides } from "./slides";
import { SlideAction } from "./types";

const LocalizationSimulation2DTutorial = () => {
  const [slide, setSlide] = useState(1);
  const { grid, beliefs, currentPosition, sense, move } =
    useLocalizationSimulation();

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const renderActionButton = (type: SlideAction) => {
    const onSense = () => {
      sense();
      setSlide(slide + 1);
    };
    const onMove = () => {
      move({ dx: 0, dy: -1 });
      setSlide(slide + 1);
    };

    switch (type) {
      case "sense":
        return <button onClick={onSense}>Sense</button>;
      case "move":
        return <button onClick={onMove}>Move</button>;
      default:
        return null;
    }
  };

  return (
    <InteractiveTutorialContainer>
      <TextContainer>
        {/* Slide text */}
        {SLIDES[slide]?.text ? SLIDES[slide].text : null}
        {/* Action button */}
        {SLIDES[slide]?.actionButton
          ? renderActionButton(SLIDES[slide].actionButton)
          : null}
        {/* Back + Next buttons */}
        <div style={{ display: "flex" }}>
          {slide > 1 ? <button onClick={goToPreviousSlide}>Back</button> : null}
          {slide < totalSlides ? (
            <button onClick={goToNextSlide}>Next</button>
          ) : null}
        </div>
      </TextContainer>
      <InteractiveContainer>
        <LocalizationSimulation2D
          grid={grid}
          beliefs={beliefs}
          currentPosition={currentPosition}
        />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default LocalizationSimulation2DTutorial;
