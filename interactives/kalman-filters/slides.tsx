import { InlineCode } from "../../components";
import { ActionButton } from "../robot-localization/LocalizationSlides";
import { GetSlidesParams, Slides } from "./types";

export function getSlides({ gaussianParams, onNext }: GetSlidesParams): Slides {
  const { priorMean, priorSigma, measurementMean, measurementSigma } =
    gaussianParams;

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
            <span className="bg-indigo-200 text-indigo-800 py-1 px-2 rounded-md font-medium">
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
    3: {
      text: (
        <>
          <p>
            Now, let's say the robot has a sensor that can measure where it is
            with some uncertainty.
          </p>
          <p>Click the Sense button to take a measurment.</p>
          <ActionButton onClick={onNext}>Sense</ActionButton>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: false,
      showPosteriorGaussian: false,
    },
    4: {
      text: (
        <>
          <p>
            Because the robot's measurement is uncertain, we get another
            Gaussian, which we'll call the{" "}
            <span className="bg-emerald-100 text-emerald-800 py-1 px-2 rounded-md font-medium">
              Measurement
            </span>
            .
          </p>
          <p>
            This distribution has a mean of{" "}
            <InlineCode variant="medium">{measurementMean}</InlineCode> and a
            covariance of{" "}
            <InlineCode variant="medium">{measurementSigma}</InlineCode>.
          </p>
          <p>
            Notice that this distribution has less uncertainity (the covariance
            is lower, thus the higher spike), which makes sense because we
            expect the measurement to increase confidence about the robot's
            position.
          </p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: false,
    },
    5: {
      text: (
        <>
          <p>
            Now, we're going to combine the information we have &mdash; our{" "}
            <span className="bg-indigo-200 text-indigo-800 py-1 px-2 rounded-md font-medium">
              Prior
            </span>{" "}
            and our{" "}
            <span className="bg-emerald-100 text-emerald-800 py-1 px-2 rounded-md font-medium">
              Measurement
            </span>{" "}
            &mdash; and get a result that gives us new information about the
            position of the robot.
          </p>
          <p>
            But what's this information going to look like? Where do you think
            the mean will be? In between the two Gaussians? Or to the left or
            right of one of them?
          </p>
          <p>
            What about the covariance? Do you think we're going to be more
            confident about the robot's position after combining, or less
            confident?
          </p>
          <p>Try and make a guess, then click Next when you're ready.</p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: false,
    },
    6: {
      text: (
        <>
          <p>6</p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: false,
    },
  };
}
