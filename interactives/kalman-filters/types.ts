type Slide = {
  text: React.ReactNode;
  showPriorGaussian: boolean;
  showMeasurementGaussian: boolean;
  showPosteriorGaussian: boolean;
};
export type Slides = {
  [index: number]: Slide;
};

export type GaussianParameterUpdateChartParams = {
  showPriorGaussian: boolean;
  showMeasurementGaussian: boolean;
  showPosteriorGaussian: boolean;
};
