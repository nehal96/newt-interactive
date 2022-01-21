import { InlineCode } from "../../components";
import { GetSlidesParams, Slides } from "./types";

export function getSlides({ gaussianParams }: GetSlidesParams): Slides {
  const { priorMean, priorSigma } = gaussianParams;

  return {
    1: {
      text: (
        <>
          <p>
            Let's initialize a chart with the x-axis representing the position
            of the robot in our 100m-long world.
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
      text: (
        <>
          <p>
            The indigo Gaussian, which we're going to call the{" "}
            <span className="bg-indigo-200 text-indigo-800 py-1 px-2 rounded-md">
              Prior
            </span>
            , represents the belief, or probability distribution, of where the
            robot initially resides.
          </p>
          <p>
            We don't know exactly where it is, but we know that it follows a
            normal distribution with a mean of{" "}
            <InlineCode variant="medium">{priorMean}</InlineCode> and a
            covariance of <InlineCode variant="medium">{priorSigma}</InlineCode>
            .
          </p>
          <p>
            In other words, we are ~68% confident the robot lies {priorSigma}m
            either side of the mean (so, between {priorMean - priorSigma}m and{" "}
            {priorMean + priorSigma}m), ~95% confident it lies {priorSigma * 2}m
            either side (between {priorMean - 2 * priorSigma}m and{" "}
            {priorMean + 2 * priorSigma}m), and so on.
          </p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: false,
      showPosteriorGaussian: false,
    },
  };
}
