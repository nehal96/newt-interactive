type Slide = {
  text: React.ReactNode;
  showPriorGaussian: boolean;
  showMeasurementGaussian: boolean;
  showPosteriorGaussian: boolean;
};
export type Slides = {
  [index: number]: Slide;
};

type GaussianParams = {
  priorMean: number;
  priorSigma: number;
  measurementMean: number;
  measurementSigma: number;
};

export type GaussianParameterUpdateChartParams = {
  gaussianParams: GaussianParams;
  showPriorGaussian: boolean;
  showMeasurementGaussian: boolean;
  showPosteriorGaussian: boolean;
};

export type GetSlidesParams = {
  gaussianParams: GaussianParams;
  onNext?: () => void;
};
