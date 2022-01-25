import { useState } from "react";
import {
  InteractiveTutorialContainer,
  InteractiveContainer,
  Slides,
} from "../../components";
import { JumpToSectionMenu } from "../../components/Slides";
import GaussianParameterUpdateChart from "./GaussianParameterUpdateChart";
import { getSlides } from "./slides";
import { Section } from "./types";

const GaussianParameterUpdateTutorial = () => {
  const [slide, setSlide] = useState(1);

  const [gaussianParams, setGaussianParams] = useState({
    priorMean: 40,
    priorSigma: 15,
    measurementMean: 70,
    measurementSigma: 6,
  });
  const { priorMean, priorSigma, measurementMean, measurementSigma } =
    gaussianParams;
  const posteriorMean =
    (measurementSigma * priorMean + priorSigma * measurementMean) /
    (priorSigma + measurementSigma);
  const posteriorSigma = 1 / (1 / priorSigma + 1 / measurementSigma);

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => {
    setGaussianParams({
      priorMean: 40,
      priorSigma: 15,
      measurementMean: 70,
      measurementSigma: 6,
    });
    setSlide(1);
  };
  const onJumpToSection = (section: Section) => {
    switch (section) {
      case "overview": {
        setSlide(1);
        break;
      }
      case "calculations": {
        setSlide(7);
        break;
      }
      case "playground": {
        setSlide(12);
        break;
      }
      default:
        return;
    }
  };

  const SLIDES = getSlides({
    gaussianParams: { ...gaussianParams, posteriorMean, posteriorSigma },
    setGaussianParams,
    onNext: goToNextSlide,
  });
  const totalSlides = Object.keys(SLIDES)?.length;
  const sections: JumpToSectionMenu = [
    {
      name: "overview",
      onSelect: () => onJumpToSection("overview"),
    },
    {
      name: "calculations",
      onSelect: () => onJumpToSection("calculations"),
    },
    {
      name: "playground",
      onSelect: () => onJumpToSection("calculations"),
    },
  ];

  return (
    <InteractiveTutorialContainer>
      <Slides
        slide={SLIDES[slide]}
        slideNumber={slide}
        totalSlides={totalSlides}
        onBack={goToPreviousSlide}
        onNext={goToNextSlide}
        onReset={onReset}
        jumpToSectionMenu={sections}
        currentSection={SLIDES[slide].section}
      />
      <InteractiveContainer className="lg:w-3/5">
        <GaussianParameterUpdateChart
          height={
            SLIDES[slide]?.showFormulaAsChart ? "sm:h-[200px]" : "sm:h-[500px]"
          }
          gaussianParams={{ ...gaussianParams, posteriorMean, posteriorSigma }}
          showPriorGaussian={SLIDES[slide]?.showPriorGaussian}
          showMeasurementGaussian={SLIDES[slide]?.showMeasurementGaussian}
          showPosteriorGaussian={SLIDES[slide]?.showPosteriorGaussian}
        />
        {SLIDES[slide]?.showFormulaAsChart ? (
          <div className="sm:h-[300px] p-10 flex-col items-center">
            {SLIDES[slide]?.formula}
          </div>
        ) : null}
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default GaussianParameterUpdateTutorial;
