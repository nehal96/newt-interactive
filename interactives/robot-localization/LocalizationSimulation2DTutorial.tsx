import { useState } from "react";
import { LocalizationSimulation2D } from ".";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../../components";
import useLocalizationSimulation from "./hooks";
import { SLIDES, totalSlides } from "./slides";
import {
  ActionButtons,
  BackAction,
  MoveButton,
  NextAction,
  SenseButton,
  Section,
} from "./types";
import styles from "./LocalizationSimulation.module.css";

const LocalizationSimulation2DTutorial = () => {
  const [slide, setSlide] = useState(1);
  const { grid, beliefs, currentPosition, sense, move, reset } =
    useLocalizationSimulation();
  const [showUnderTheHood, setShowUnderTheHood] = useState(false);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);

  const onJumpToSection = (section: Section) => {
    switch (section) {
      case "overview": {
        setSlide(1);
        setShowUnderTheHood(false);
        break;
      }
      case "code-explain": {
        // TODO: might have to change slides data structure to array to find
        // slide programmatically
        setSlide(11);
        setShowUnderTheHood(true);
        break;
      }
      default:
        return;
    }
  };
  const onReset = () => {
    reset();
    setSlide(1);
    setShowUnderTheHood(false);
  };
  const onNext = (actions?: NextAction[]) => {
    goToNextSlide();
    actions?.map((action) => {
      switch (action) {
        case "reset":
          reset();
        case "show under the hood":
          setShowUnderTheHood(true);
          break;
        case "hide under the hood":
          setShowUnderTheHood(false);
          break;
        default:
          return;
      }
    });
  };
  const onBack = (actions?: BackAction[]) => {
    goToPreviousSlide();
    actions?.map((action) => {
      switch (action) {
        case "hide under the hood":
          setShowUnderTheHood(false);
          break;
        default:
          return;
      }
    });
  };

  const renderActionButtons = (actionButtons: ActionButtons) => {
    const onSense = (goNext: SenseButton["goToNextSlide"]) => {
      sense();
      if (goNext) {
        setSlide(slide + 1);
      }
    };
    const onMove = (
      args: MoveButton["args"],
      goNext: MoveButton["goToNextSlide"]
    ) => {
      args ? move(args) : move();
      if (goNext) {
        setSlide(slide + 1);
      }
    };

    return actionButtons.map((button, index) => {
      switch (button.type) {
        case "sense":
          return (
            <button
              key={index}
              className="py-1 px-2 border border-slate-500 rounded-md mb-4"
              onClick={() => onSense(button.goToNextSlide)}
            >
              Sense
            </button>
          );
        case "move":
          return (
            <button
              key={index}
              className="py-1 px-2 border border-slate-500 rounded-md mb-4"
              onClick={() => onMove(button.args, button.goToNextSlide)}
            >
              Move
            </button>
          );
        default:
          return null;
      }
    });
  };

  return (
    <InteractiveTutorialContainer>
      <TextContainer
        className={
          SLIDES[slide]?.section === "code-explain" ? "lg:w-1/2" : "lg:w-3/5"
        }
      >
        <div className="flex items-center justify-between text-slate-400 mb-6">
          <div>
            <button
              className={`text-sm mr-2  py-1 px-2 hover:border-b hover:border-b-slate-300 ${
                SLIDES[slide]?.section === "overview"
                  ? "border-b border-b-slate-400 text-slate-500 hover:border-b-slate-400"
                  : ""
              }`}
              onClick={() => onJumpToSection("overview")}
            >
              Overview
            </button>
            <button
              className={`text-sm mr-2  py-1 px-2 hover:border-b hover:border-b-slate-300 ${
                SLIDES[slide]?.section === "code-explain"
                  ? "border-b border-b-slate-400 text-slate-500 hover:border-b-slate-400"
                  : ""
              }`}
              onClick={() => onJumpToSection("code-explain")}
            >
              Code
            </button>
          </div>
          <div>
            <button
              className="py-1 px-2 border border-slate-400 rounded-md mr-4 text-sm"
              onClick={onReset}
            >
              Reset
            </button>
            <span>{`${slide} / ${totalSlides}`}</span>
          </div>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col">
            {/* Slide text */}
            <div className={styles["slide-text"]}>
              {SLIDES[slide]?.text ? SLIDES[slide].text : null}
            </div>
            {/* Action button */}
            {SLIDES[slide]?.actionButtons
              ? renderActionButtons(SLIDES[slide]?.actionButtons)
              : null}
          </div>
          {/* Back + Next buttons */}
          <div className="flex justify-center">
            {slide > 1 ? (
              <button
                className="py-1 px-2 border border-slate-500 rounded-md mr-4"
                onClick={() => onBack(SLIDES[slide]?.onBack)}
              >
                Back
              </button>
            ) : null}
            {slide < totalSlides ? (
              <button
                className="py-1 px-2 border border-slate-500 rounded-md mr-4"
                onClick={() => onNext(SLIDES[slide]?.onNext)}
              >
                {SLIDES[slide]?.nextButtonTitle
                  ? SLIDES[slide]?.nextButtonTitle
                  : "Next"}
              </button>
            ) : null}
          </div>
        </div>
      </TextContainer>
      <InteractiveContainer
        className={
          SLIDES[slide]?.section === "code-explain" ? "lg:w-1/2" : "lg:w-2/5"
        }
      >
        <LocalizationSimulation2D
          grid={grid}
          beliefs={beliefs}
          currentPosition={currentPosition}
          showUnderTheHood={showUnderTheHood}
        />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default LocalizationSimulation2DTutorial;
