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
import styles from "./LocalizationSimulation.module.css";

const LocalizationSimulation2DTutorial = () => {
  const [slide, setSlide] = useState(1);
  const { grid, beliefs, currentPosition, sense, move, reset } =
    useLocalizationSimulation();

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => {
    reset();
    setSlide(1);
  };

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
        return (
          <button
            className="py-1 px-2 border border-slate-500 rounded-md mr-4"
            onClick={onSense}
          >
            Sense
          </button>
        );
      case "move":
        return (
          <button
            className="py-1 px-2 border border-slate-500 rounded-md mr-4"
            onClick={onMove}
          >
            Move
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <InteractiveTutorialContainer>
      <TextContainer>
        <div className="flex items-center justify-end text-slate-400 mb-6">
          <button
            className="py-1 px-2 border border-slate-400 rounded-md mr-4"
            onClick={onReset}
          >
            Reset
          </button>
          {`${slide} / ${totalSlides}`}
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col">
            {/* Slide text */}
            <div className={styles["slide-text"]}>
              {SLIDES[slide]?.text ? SLIDES[slide].text : null}
            </div>
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
          <div className="flex justify-center">
            {slide > 1 ? (
              <button
                className="py-1 px-2 border border-slate-500 rounded-md mr-4"
                onClick={goToPreviousSlide}
              >
                Back
              </button>
            ) : null}
            {slide < totalSlides ? (
              <button
                className="py-1 px-2 border border-slate-500 rounded-md mr-4"
                onClick={goToNextSlide}
              >
                Next
              </button>
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
