import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@ui/controls";
import MathFormula from "@ui/prose/MathFormula";
import { SlideDeck } from "@viz/slides";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { decayCurve, ResponseTimeChart, ResponseTimeControls } from "./chart";

const ExponentialDecayEquationSheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
        we can work our way
      </span>
    </SheetTrigger>
    <SheetContent>
      <VisuallyHidden>
        <SheetTitle>Protein Decay Equation</SheetTitle>
      </VisuallyHidden>
      <div className="flex flex-col text-md text-sm">
        <p className="mb-3">starting with:</p>
        <MathFormula
          variant="small"
          className="ml-6"
          tex="\dfrac{dY}{dt} = 0 - \alpha Y"
        />
        <p className="mt-6 mb-3">we can rearrange to:</p>
        <MathFormula
          className="ml-6"
          variant="small"
          tex="\dfrac{dY}{Y} = -\alpha \thinspace dt"
        />
        <p className="mt-6 mb-3">integrating both sides:</p>
        <MathFormula
          className="ml-6"
          variant="small"
          tex="\int \dfrac{dY}{Y} = \int -\alpha \thinspace dt"
        />
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="\ln |Y| = -\alpha t + C"
        />
        <p className="mt-6 mb-3">
          we can expontiate both sides to solve for{" "}
          <MathFormula variant="small" tex="Y" />:
        </p>
        <MathFormula
          className="ml-6"
          variant="small"
          tex="e^{\ln |Y|} = e^{-\alpha t + C}"
        />
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="|Y| = e^{-\alpha t} \cdot e^C"
        />
        <p className="mt-6 mb-3">
          the constant <MathFormula variant="small" tex="e^C" /> is the starting
          point of the decay, known as the initial condition. Since this is
          describing the decay of <MathFormula variant="small" tex="Y" />, we
          can assume this to be the steady state concentration{" "}
          <MathFormula variant="small" tex="Y_{st}" />.
        </p>
        <p className="mb-4">
          We can also remove the absolute value since the equation doesn't go
          below zero, giving us:
        </p>
        <MathFormula
          className="self-center outline outline-indigo-500 py-2 px-4"
          variant="small"
          tex="Y(t) = Y_{st} e^{-\alpha t}"
        />
      </div>
    </SheetContent>
  </Sheet>
);

const ResponseTimeSheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
        Using this in the previous formula we can find
      </span>
    </SheetTrigger>
    <SheetContent>
      <VisuallyHidden>
        <SheetTitle>Protein Decay Response Time Equation</SheetTitle>
      </VisuallyHidden>
      <div className="flex flex-col text-md text-sm">
        <p className="mb-3">starting with:</p>
        <MathFormula
          className="ml-6"
          variant="small"
          tex="Y(t) = Y_{st} e^{-\alpha t} \qquad \text{where} \thickspace Y(t) = \dfrac{Y_{st}}{2}"
        />
        <p className="mt-6 mb-2">we get:</p>
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="\dfrac{Y_{st}}{2} = Y_{st} e^{-\alpha t}"
        />
        <p className="mt-6 mb-2">
          dividing both sides by <MathFormula variant="small" tex="Y_{st}" />:
        </p>
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="\dfrac{1}{2} = e^{-\alpha t}"
        />
        <p className="mt-6 mb-2">
          taking the natural log of both sides to solve for{" "}
          <MathFormula variant="small" tex="t" />:
        </p>
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="\ln \left( \dfrac{1}{2} \right) = \ln \left( e^{-\alpha t} \right)"
        />
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="\ln \left( \dfrac{1}{2} \right) = -\alpha t"
        />
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="t = \dfrac{\ln \left( \dfrac{1}{2} \right)}{-\alpha}"
        />
        <MathFormula
          className="mt-3 ml-6"
          variant="small"
          tex="t = \dfrac{\ln 2}{\alpha}"
        />
        <MathFormula
          className="mt-3 self-center outline outline-indigo-500 py-2 px-4"
          variant="small"
          tex="T_{1/2} = \dfrac{\ln 2}{\alpha}"
        />
      </div>
    </SheetContent>
  </Sheet>
);

export const ProteinDecayResponseTimeTutorial = () => {
  const [steadyState, setSteadyState] = useState(100);
  const [alpha, setAlpha] = useState(0.25);
  const [showHalfLife, setShowHalfLife] = useState(true);

  const slides = [
    {
      text: (
        <>
          <p>
            Starting with the equation{" "}
            <MathFormula
              variant="small"
              tex="\dfrac{dY}{dt} = \beta - \alpha Y"
            />{" "}
            and setting <MathFormula variant="small" tex="\beta = 0" />,{" "}
            <ExponentialDecayEquationSheet /> to the following equation:
          </p>
          <div className="flex flex-col justify-center mt-8 mb-8 mx-auto">
            <MathFormula
              variant="small"
              tex="Y(t) = Y_{st} \thinspace e^{-\alpha t}"
            />
          </div>
          <p>
            which reveals that the concentration decays exponentially over time,
            as shown in the graph.
          </p>
        </>
      ),
      interactive: <ResponseTimeChart curve={decayCurve} />,
    },
    {
      text: (
        <>
          <p>
            It's important to know how quickly{" "}
            <MathFormula variant="small" tex="Y" /> levels decay in a cell. It
            can often take a really long time to get to zero, so the measure for
            this is defined as the time it takes for the concentration to decay
            to half of its steady state value. This is known as the{" "}
            <strong>response time</strong>, and is denoted as{" "}
            <MathFormula variant="small" tex="T_{1/2}" />.
          </p>
          <p className="mt-4">
            The halfway point for concentration that starts at{" "}
            <MathFormula variant="small" tex="Y_{st}" /> and ends at{" "}
            <MathFormula variant="small" tex="0" /> is{" "}
            <MathFormula variant="small" tex="Y_{st}/2" />.{" "}
            <ResponseTimeSheet /> the formula for response time:
          </p>
          <div className="flex flex-col justify-center mt-4 mx-auto">
            <MathFormula
              variant="small"
              tex="T_{1/2} = \dfrac{\ln(2)}{\alpha}"
            />
          </div>
        </>
      ),
      interactive: <ResponseTimeChart curve={decayCurve} showHalfLife />,
    },
    {
      text: (
        <>
          <div className="flex flex-col justify-center mb-4 mx-auto">
            <MathFormula
              variant="small"
              tex="T_{1/2} = \dfrac{\ln(2)}{\alpha}"
            />
          </div>
          <p className="mt-4">
            As the formula shows, the response time for decay only depends on
            the removal rate <MathFormula variant="small" tex="\alpha" />. A
            high removal rate means a fast decay, but it also means a high
            production rate to maintain the steady-state concentration.
          </p>
          <p className="mt-4">
            Quickly producing and quickly destroying proteins doesn't seem
            efficient, but it does give the cell the ability to adapt quickly,
            which we'll see is quite an important feature.
          </p>
        </>
      ),
      interactive: <ResponseTimeChart curve={decayCurve} showHalfLife />,
    },
    {
      text: (
        <>
          <p>
            Experiment with different values for the steady state concentration{" "}
            <MathFormula variant="small" tex="Y_{st}" /> and the removal rate{" "}
            <MathFormula variant="small" tex="\alpha" /> to see how they affect
            the protein decay curve and the response time.
          </p>
          <ResponseTimeControls
            steadyState={steadyState}
            onSteadyState={setSteadyState}
            alpha={alpha}
            onAlpha={setAlpha}
            showHalfLife={showHalfLife}
            onShowHalfLife={setShowHalfLife}
          />
        </>
      ),
      interactive: (
        <ResponseTimeChart
          curve={decayCurve}
          steadyState={steadyState}
          alpha={alpha}
          showHalfLife={showHalfLife}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
