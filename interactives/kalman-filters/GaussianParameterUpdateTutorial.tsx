import { useState } from "react";
import {
  InteractiveTutorialContainer,
  InteractiveContainer,
} from "../../components";
import GaussianParameterUpdateChart from "./GaussianParameterUpdateChart";
import GaussianParameterUpdateSlides from "./GaussianParameterUpdateSlides";
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
  const onReset = () => setSlide(1);
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

  return (
    <InteractiveTutorialContainer>
      <GaussianParameterUpdateSlides
        slide={SLIDES[slide]}
        slideNumber={slide}
        totalSlides={totalSlides}
        onBack={goToPreviousSlide}
        onNext={goToNextSlide}
        onJumpToSection={onJumpToSection}
        onReset={onReset}
      />
      <InteractiveContainer className="lg:w-3/5">
        <GaussianParameterUpdateChart
          height={SLIDES[slide]?.showFormulaAsChart ? "h-[200px]" : "h-[500px]"}
          gaussianParams={{ ...gaussianParams, posteriorMean, posteriorSigma }}
          showPriorGaussian={SLIDES[slide]?.showPriorGaussian}
          showMeasurementGaussian={SLIDES[slide]?.showMeasurementGaussian}
          showPosteriorGaussian={SLIDES[slide]?.showPosteriorGaussian}
        />
        {SLIDES[slide]?.showFormulaAsChart ? (
          <div className="h-[300px] p-10 flex-col items-center">
            {SLIDES[slide]?.formula}
          </div>
        ) : null}
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default GaussianParameterUpdateTutorial;
