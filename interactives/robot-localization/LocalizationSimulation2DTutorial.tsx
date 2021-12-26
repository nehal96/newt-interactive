import { useState } from "react";
import { LocalizationSimulation2D } from ".";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../../components";
import useLocalizationSimulation from "./hooks";
import { SLIDES, totalSlides } from "./slides";
import { ActionButton } from "./types";

const LocalizationSimulation2DTutorial = () => {
  const [slide, setSlide] = useState(1);
  const { grid, beliefs, currentPosition, sense, move } =
    useLocalizationSimulation();

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const renderActionButton = (
    type: ActionButton["type"],
    args: ActionButton["args"],
    goToNextSlide: ActionButton["goToNextSlide"]
  ) => {
    const onSense = () => {
      sense();
      if (goToNextSlide) {
        setSlide(slide + 1);
      }
    };
    const onMove = () => {
      args ? move(args) : move();
      if (goToNextSlide) {
        setSlide(slide + 1);
      }
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
      <TextContainer style={{ justifyContent: "flex-start" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            color: "#a0aec0",
          }}
        >
          {slide} / {totalSlides}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Slide text */}
            {SLIDES[slide]?.text ? SLIDES[slide].text : null}
            {/* Action button */}
            {SLIDES[slide]?.actionButton
              ? renderActionButton(
                  SLIDES[slide].actionButton.type,
                  SLIDES[slide].actionButton.args,
                  SLIDES[slide].actionButton.goToNextSlide
                )
              : null}
          </div>
          {/* Back + Next buttons */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            {slide > 1 ? (
              <button onClick={goToPreviousSlide}>Back</button>
            ) : null}
            {slide < totalSlides ? (
              <button onClick={goToNextSlide}>Next</button>
            ) : null}
          </div>
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
