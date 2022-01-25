import { Dispatch, SetStateAction } from "react";

export type Section = "overview" | "calculations" | "playground";
export type Slide = {
  section: Section;
  text: React.ReactNode;
  showPriorGaussian: boolean;
  showMeasurementGaussian: boolean;
  showPosteriorGaussian: boolean;
  showFormulaAsChart?: boolean;
  formula?: React.ReactNode;
};
export type Slides = {
  [index: number]: Slide;
};

type GaussianParams = {
  priorMean: number;
  priorSigma: number;
  measurementMean: number;
  measurementSigma: number;
  posteriorMean: number;
  posteriorSigma: number;
};

export type GaussianParameterUpdateChartParams = {
  height: string;
  gaussianParams: GaussianParams;
  showPriorGaussian: boolean;
  showMeasurementGaussian: boolean;
  showPosteriorGaussian: boolean;
};

export type GetSlidesParams = {
  gaussianParams: GaussianParams;
  setGaussianParams: Dispatch<
    SetStateAction<{
      priorMean: number;
      priorSigma: number;
      measurementMean: number;
      measurementSigma: number;
    }>
  >;
  onNext?: () => void;
};

export type GaussianNameProps = {
  name: "Prior" | "Measurement" | "Posterior";
};
export type PlaygroundProps = {
  gaussianParams: GaussianParams;
  setGaussianParams: Dispatch<
    SetStateAction<{
      priorMean: number;
      priorSigma: number;
      measurementMean: number;
      measurementSigma: number;
    }>
  >;
};
export interface GaussianParamterUpdateSlidesProps {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  onBack: () => void;
  onNext: () => void;
  onJumpToSection: (section: Section) => void;
  onReset: () => void;
}
