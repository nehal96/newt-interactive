import { useMemo, useState } from "react";
import LocalizationSimulation2D from "./LocalizationSimulation2D";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  Slides,
} from "../../components";
import useLocalizationSimulation from "./hooks";
import { getSlides } from "./slides";
import {
  BackAction,
  GridPositionChange,
  NextAction,
  Section,
  Slide,
} from "./types";
import { JumpToSectionMenu } from "../../components/Slides";
import _ from "lodash";

const LocalizationSimulation2DTutorial = () => {
  const [slide, setSlide] = useState(1);
  const {
    grid,
    beliefs,
    currentPosition,
    sense,
    move,
    reset,
    pHit,
    setPHit,
    pMiss,
    setPMiss,
  } = useLocalizationSimulation();
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
      case "code": {
        // TODO: might have to change slides data structure to array to find
        // slide programmatically
        setSlide(11);
        setShowUnderTheHood(true);
        break;
      }
      case "playground": {
        setSlide(20);
        setShowUnderTheHood(true);
        reset();
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

  const onSense = (goNext: boolean) => {
    sense();
    if (goNext) {
      setSlide(slide + 1);
    }
  };
  const onMove = (args: GridPositionChange, goNext: boolean) => {
    args ? move(args) : move();
    if (goNext) {
      setSlide(slide + 1);
    }
  };
  const playgroundValues = {
    pHit,
    setPHit,
    pMiss,
    setPMiss,
  };
  const SLIDES = useMemo(
    () => getSlides({ onSense, onMove, playgroundValues }),
    [onSense, onMove]
  );
  const sections: JumpToSectionMenu = _.chain(SLIDES)
    .map((slide: Slide) => slide.section)
    .uniq()
    .map((section: Section) => ({
      name: section,
      onSelect: () => onJumpToSection(section),
    }))
    .value();

  return (
    <InteractiveTutorialContainer>
      <Slides
        slides={SLIDES}
        currentSlideNumber={slide}
        onBack={onBack}
        onNext={onNext}
        jumpToSectionMenu={sections}
        currentSection={SLIDES[slide].section}
        onReset={onReset}
      />
      <InteractiveContainer
        className={
          SLIDES[slide]?.section === "overview" ? "lg:w-2/5" : "lg:w-1/2"
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
