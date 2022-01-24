import {
  InlineCode,
  MathFormula,
  Popover,
  PopoverContent,
} from "../../components";
import { ActionButton } from "../robot-localization/LocalizationSlides";
import { GaussianName, Playground } from "./GaussianParameterUpdateSlides";
import { GetSlidesParams, Slides } from "./types";

export function getSlides({
  gaussianParams,
  setGaussianParams,
  onNext,
}: GetSlidesParams): Slides {
  const {
    priorMean,
    priorSigma,
    measurementMean,
    measurementSigma,
    posteriorMean,
    posteriorSigma,
  } = gaussianParams;

  return {
    1: {
      section: "overview",
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
      section: "overview",
      text: (
        <>
          <p>
            The indigo Gaussian, which we're going to call the{" "}
            <GaussianName name="Prior" />, represents the belief, or probability
            distribution, of where the robot initially resides.
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
      section: "overview",
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
      section: "overview",
      text: (
        <>
          <p>
            Because the robot's measurement is uncertain, we get another
            Gaussian, which we'll call the <GaussianName name="Measurement" />.
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
      section: "overview",
      text: (
        <>
          <p>
            Now, we're going to combine the information we have &mdash; our{" "}
            <GaussianName name="Prior" /> and our{" "}
            <GaussianName name="Measurement" /> &mdash; and get a result that
            gives us new information about the position of the robot.
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
      section: "overview",
      text: (
        <>
          <p>
            The result of the combination is a new Gaussian, called the{" "}
            <GaussianName name="Posterior" />.
          </p>
          <p>
            It has a mean of{" "}
            <InlineCode variant="medium">{posteriorMean.toFixed(2)}</InlineCode>{" "}
            and a covariance of{" "}
            <InlineCode variant="medium">
              {posteriorSigma.toFixed(2)}
            </InlineCode>
            , so if you guessed a mean in the middle, and a covariance less than
            both (or increased confidence), great job!
          </p>
          <p>
            The mean being in the middle might have been intuitive, but the{" "}
            certainty <i>increasing</i> definitely wasn't.
          </p>
          <p>It's one aspect of what makes the Kalman filter so powerful.</p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: true,
    },
    7: {
      section: "calculations",
      text: (
        <>
          <p>
            So, how did we calculate the <GaussianName name="Posterior" />? How
            did we get a mean of{" "}
            <InlineCode variant="medium">{posteriorMean.toFixed(2)}</InlineCode>{" "}
            and a covariance of{" "}
            <InlineCode variant="medium">
              {posteriorSigma.toFixed(2)}
            </InlineCode>
            ?
          </p>
          <p>
            Here's the formulas
            <Popover
              content={
                <PopoverContent>
                  In some future version I'll prove/derive these formulas. If
                  you'd like to see it earlier, reach out to me.
                </PopoverContent>
              }
            />
            :
          </p>
          <div className="flex-col items-center">
            <div className="mb-6 flex justify-center">
              <MathFormula tex="\mu' = \dfrac{r^2\mu + \sigma^2\nu}{r^2 + \sigma^2}" />
            </div>
            <div className="mb-6 flex justify-center">
              <MathFormula tex="\sigma^{2'} = \dfrac{1}{\dfrac{1}{r^2} + \dfrac{1}{\sigma^2}}" />
            </div>
          </div>
          <p>Let's break these down in the next slide.</p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: true,
    },
    8: {
      section: "calculations",
      text: (
        <>
          <p>
            <MathFormula tex="\mu'" /> is what we're calculating, the{" "}
            <GaussianName name="Posterior" /> mean.
          </p>
          <p className="mt-3">
            <MathFormula tex="\mu" /> is the <GaussianName name="Prior" /> mean.
          </p>
          <p>
            <MathFormula tex="\sigma^2" /> is the <GaussianName name="Prior" />{" "}
            covariance.
          </p>
          <p>
            <MathFormula tex="\nu" /> is the <GaussianName name="Measurement" />{" "}
            mean.
          </p>
          <p>
            <MathFormula tex="r^2" /> is the <GaussianName name="Measurement" />{" "}
            covariance.
          </p>
          <p className="mt-3">Let's plug in the numbers in the next slide.</p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: false,
      showFormulaAsChart: true,
      formula: (
        <div className="mb-6 flex justify-center text-lg">
          <MathFormula tex="\mu' = \dfrac{r^2\mu + \sigma^2\nu}{r^2 + \sigma^2}" />
        </div>
      ),
    },
    9: {
      section: "calculations",
      text: (
        <>
          <p>
            <MathFormula tex="\mu'" /> is what we're calculating, the{" "}
            <GaussianName name="Posterior" /> mean.
          </p>
          <p className="mt-3 flex justify-between">
            <MathFormula tex={`\\mu = ${priorMean}`} />
            <span className="flex items-center text-xs text-slate-600">
              <GaussianName name="Prior" /> mean
            </span>
          </p>
          <p className="flex justify-between">
            <MathFormula tex={`\\sigma^2 = ${priorSigma}`} />
            <span className="flex items-center text-xs text-slate-600">
              <GaussianName name="Prior" /> covariance
            </span>
          </p>
          <p className="flex justify-between">
            <MathFormula tex={`\\nu = ${measurementMean}`} />
            <span className="flex items-center text-xs text-slate-600">
              <GaussianName name="Measurement" /> mean
            </span>
          </p>
          <p className="flex justify-between">
            <MathFormula tex={`r^2 = ${measurementSigma}`} />
            <span className="flex items-center text-xs text-slate-600">
              <GaussianName name="Measurement" /> covariance
            </span>
          </p>
          <p className="mt-6">Next, let's calculate the covariance.</p>
        </>
      ),
      showFormulaAsChart: true,
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: false,
      formula: (
        <>
          <div className="mb-6 flex justify-center text-lg">
            <MathFormula tex="\mu' = \dfrac{r^2\mu + \sigma^2\nu}{r^2 + \sigma^2}" />
          </div>
          <div className="mb-6 flex justify-center text-lg">
            <MathFormula
              tex={`\\mu' = \\dfrac{${measurementSigma} \\times ${priorMean} + ${priorSigma} \\times ${measurementMean}}{${measurementSigma} + ${priorSigma}}`}
            />
          </div>
          <div className="mb-6 flex justify-center text-lg">
            <MathFormula tex={`\\mu' = \\dfrac{240 + 1050}{21}`} />
          </div>
          <div className="mb-6 flex justify-center text-lg">
            <MathFormula tex={`\\mu' = 61.43`} />
          </div>
        </>
      ),
    },
    10: {
      section: "calculations",
      text: (
        <>
          <p>
            <MathFormula tex="\sigma^{2'}" /> is what we're calculating, the{" "}
            <GaussianName name="Posterior" /> covariance.
          </p>
          <p className="mt-3 flex justify-between">
            <MathFormula tex={`\\sigma^2 = ${priorSigma}`} />
            <span className="flex items-center text-xs text-slate-600">
              <GaussianName name="Prior" /> covariance
            </span>
          </p>
          <p className="flex justify-between">
            <MathFormula tex={`r^2 = ${measurementSigma}`} />
            <span className="flex items-center text-xs text-slate-600">
              <GaussianName name="Measurement" /> covariance
            </span>
          </p>
          <p className="mt-6">
            Plotting our calculated mean of{" "}
            <InlineCode variant="medium">{posteriorMean.toFixed(2)}</InlineCode>{" "}
            and covariance of{" "}
            <InlineCode variant="medium">
              {posteriorSigma.toFixed(2)}
            </InlineCode>{" "}
            gives us...
          </p>
        </>
      ),
      showFormulaAsChart: true,
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: false,
      formula: (
        <>
          <div className="mb-6 flex justify-center">
            <MathFormula tex="\sigma^{2'} = \dfrac{1}{\dfrac{1}{r^2} + \dfrac{1}{\sigma^2}}" />
          </div>
          <div className="mb-6 flex justify-center">
            <MathFormula
              tex={`\\sigma^{2'} = \\dfrac{1}{\\dfrac{1}{${measurementSigma}} + \\dfrac{1}{${priorSigma}}}`}
            />
          </div>
          <div className="mb-6 flex justify-center">
            <MathFormula tex="\sigma^{2'} = 4.29" />
          </div>
        </>
      ),
    },
    11: {
      section: "calculations",
      text: (
        <>
          <p>
            ...our <GaussianName name="Posterior" />!
          </p>
          <p>
            <Popover
              content={
                <PopoverContent>
                  If you're interested in this, reach out to me (info at the
                  bottom of the page)
                </PopoverContent>
              }
              highlightColor="newt-blue-100"
              placement="bottom"
            >
              (In some future version, I'll derive those two formulas so you can
              better understand where it comes from and why it works).
            </Popover>
          </p>
          <p>
            For now, just know that the beauty and power of the Kalman filter is
            in its ability to efficiently combine uncertain information to make
            predictions in a continuously changing environment &mdash; very
            useful in robots and self-driving cars.
          </p>
          <p>
            In the next section, play around with different mean and covariance
            values to see how the predictions change.
          </p>
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: true,
    },
    12: {
      section: "playground",
      text: (
        <>
          <p>Change the values below and see the changes on the chart:</p>
          <Playground
            gaussianParams={gaussianParams}
            setGaussianParams={setGaussianParams}
          />
        </>
      ),
      showPriorGaussian: true,
      showMeasurementGaussian: true,
      showPosteriorGaussian: true,
    },
  };
}
