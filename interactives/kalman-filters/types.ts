type Slide = {
  text: React.ReactNode;
  showPriorGaussian: boolean;
  showMeasurementGaussian: boolean;
  showPosteriorGaussian: boolean;
  showFormulaAsChart?: boolean;
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
  onNext?: () => void;
};

export type GaussianNameProps = {
  name: "Prior" | "Measurement" | "Posterior";
};
