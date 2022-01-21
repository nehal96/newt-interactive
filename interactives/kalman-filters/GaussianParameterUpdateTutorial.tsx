import { useState } from "react";
import {
  InteractiveTutorialContainer,
  InteractiveContainer,
} from "../../components";
import GaussianParameterUpdateChart from "./GaussianParameterUpdateChart";
import GaussianParameterUpdateSlides from "./GaussianParameterUpdateSlides";
import { getSlides } from "./slides";

const GaussianParameterUpdateTutorial = () => {
  const [slide, setSlide] = useState(1);

  const priorMean = 40,
    priorSigma = 16;
  const measurementMean = 60,
    measurementSigma = 6;
  const gaussianParams = {
    priorMean,
    priorSigma,
    measurementMean,
    measurementSigma,
  };

  const goToNextSlide = () => setSlide(slide + 1);
  const goToPreviousSlide = () => setSlide(slide - 1);
  const onReset = () => setSlide(1);

  const SLIDES = getSlides({ gaussianParams, onNext: goToNextSlide });
  const totalSlides = Object.keys(SLIDES)?.length;

  return (
    <InteractiveTutorialContainer>
      <GaussianParameterUpdateSlides
        slide={SLIDES[slide]}
        slideNumber={slide}
        totalSlides={totalSlides}
        onBack={goToPreviousSlide}
        onNext={goToNextSlide}
        onReset={onReset}
      />
      <InteractiveContainer className="lg:w-3/5">
        <GaussianParameterUpdateChart
          gaussianParams={gaussianParams}
          showPriorGaussian={SLIDES[slide]?.showPriorGaussian}
          showMeasurementGaussian={SLIDES[slide]?.showMeasurementGaussian}
          showPosteriorGaussian={SLIDES[slide]?.showPosteriorGaussian}
        />
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default GaussianParameterUpdateTutorial;
