import { Slides } from "./types";

export function getSlides(): Slides {
  return {
    1: {
      text: (
        <>
          <p>
            Let's initialize a chart with the x-axis representing the position
            of the robot.
          </p>
          <p>
            We're only working with one-dimension of position here &mdash; left
            and right &mdash; which is what makes this the simplified version.
          </p>
        </>
      ),
      showPriorGaussian: false,
      showMeasurementGaussian: false,
      showPosteriorGaussian: false,
    },
    2: {
      text: <p>2</p>,
      showPriorGaussian: true,
      showMeasurementGaussian: false,
      showPosteriorGaussian: false,
    },
  };
}
