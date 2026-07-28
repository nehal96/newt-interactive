import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@ui/controls";
import MathFormula from "@ui/prose/MathFormula";
import { SlideDeck } from "@viz/slides";
import { VisuallyHidden } from "radix-ui";
import {
  accumulationCurve,
  ResponseTimeChart,
  ResponseTimeControls,
} from "./chart";

const ProteinAccumulationEquationSheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
        we can work our way
      </span>
    </SheetTrigger>
    <SheetContent>
      <VisuallyHidden.Root>
        <SheetTitle>Protein Accumulation Equation</SheetTitle>
      </VisuallyHidden.Root>
      <div className="flex flex-col text-md text-sm">
        <p>starting with</p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="\dfrac{dY}{dt} = \beta - \alpha Y"
        />
        <p className="mt-6">we can rearrange to</p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="\dfrac{dY}{dt} + \alpha Y = \beta"
        />
        <p className="mt-6">
          to integrate both sides, let's first define an integrating factor:
        </p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="\mu(t) = e^{\int \alpha \thinspace dt} = e^{\alpha t}"
        />
        <p className="mt-6">
          then multiply both sides by the integrating factor:
        </p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="e^{\alpha t} \dfrac{dY}{dt} + \alpha e^{\alpha t} Y = \beta e^{\alpha t}"
        />
        <p className="mt-6">
          the left-hand side can now be expressed as the derivative of the
          product:
        </p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="\dfrac{d}{dt} (e^{\alpha t} Y) = \beta e^{\alpha t}"
        />
        <p className="mt-6">
          integrating both sides with respect to <MathFormula tex="t" />:
        </p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="\int \dfrac{d}{dt} (e^{\alpha t} Y) \thinspace dt = \int \beta e^{\alpha t} \thinspace dt"
        />
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="e^{\alpha t} Y = \int \beta e^{\alpha t} \thinspace dt"
        />
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="e^{\alpha t} Y = \dfrac{\beta}{\alpha} e^{\alpha t} + C"
        />
        <p className="mt-6">
          now, we can solve for <MathFormula variant="small" tex="Y" />.
          dividing both sides by{" "}
          <MathFormula variant="small" tex="e^{\alpha t}" />:
        </p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="Y = \dfrac{\beta}{\alpha} + C e^{-\alpha t}"
        />
        <p className="mt-6">
          recollect that{" "}
          <MathFormula variant="small" tex="\dfrac{\beta}{\alpha}" /> is the
          steady state value <MathFormula variant="small" tex="Y_{st}" />. The
          second term describes the removal of{" "}
          <MathFormula variant="small" tex="Y" />, so the constant{" "}
          <MathFormula variant="small" tex="C" /> is the starting point of the
          decay, or <MathFormula variant="small" tex="Y_{st}" />. Since it
          represents removal, the term is negative. So, we get:
        </p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="Y(t) = Y_{st} - Y_{st} e^{-\alpha t}"
        />
        <p className="mt-6">which evaluates to:</p>
        <MathFormula
          variant="small"
          className="self-center outline outline-indigo-500 py-2 px-4 ml-6 mt-3"
          tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t})"
        />
      </div>
    </SheetContent>
  </Sheet>
);

const ProteinAccumulationResponseTimeSheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
        we can similarly find
      </span>
    </SheetTrigger>
    <SheetContent>
      <VisuallyHidden.Root>
        <SheetTitle>Protein Accumulation Response Time Equation</SheetTitle>
      </VisuallyHidden.Root>
      <div className="flex flex-col text-md text-sm">
        <p className="mb-3">starting with:</p>
        <MathFormula
          variant="small"
          className="ml-6 mt-3"
          tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t}) \qquad \text{where} \thickspace Y(t) = \dfrac{Y_{st}}{2}"
        />
        <p className="mt-6 mb-2">we get:</p>
        <MathFormula
          variant="small"
          className="mt-3 ml-6"
          tex="\dfrac{Y_{st}}{2} = Y_{st} \thinspace (1 - e^{-\alpha t})"
        />
        <p className="mt-6 mb-2">
          dividing both sides by <MathFormula variant="small" tex="Y_{st}" />:
        </p>
        <MathFormula
          variant="small"
          className="mt-3 ml-6"
          tex="\dfrac{1}{2} = 1 - e^{-\alpha t}"
        />
        <MathFormula
          variant="small"
          className="mt-3 ml-6"
          tex="e^{-\alpha t} = \dfrac{1}{2}"
        />
        <p className="mt-6 mb-2">taking the natural log of both sides:</p>
        <MathFormula
          variant="small"
          className="mt-3 ml-6"
          tex="\ln \left( e^{-\alpha t} \right) = \ln \left( \dfrac{1}{2} \right)"
        />
        <MathFormula
          variant="small"
          className="mt-3 ml-6"
          tex="-\alpha t = \ln \left( \dfrac{1}{2} \right)"
        />
        <MathFormula
          variant="small"
          className="mt-3 ml-6"
          tex="-\alpha t = - \ln (2)"
        />
        <MathFormula
          variant="small"
          className="mt-3 ml-6"
          tex="t = \dfrac{\ln (2)}{\alpha}"
        />
        <p className="mt-6">therefore:</p>
        <MathFormula
          variant="small"
          className="self-center outline outline-indigo-500 py-2 px-4 ml-6 mt-3"
          tex="T_{1/2} = \dfrac{\ln (2)}{\alpha}"
        />
      </div>
    </SheetContent>
  </Sheet>
);

export const ProteinAccumulationResponseTimeTutorial = () => {
  const [steadyState, setSteadyState] = useState(100);
  const [alpha, setAlpha] = useState(0.25);
  const [showHalfLife, setShowHalfLife] = useState(true);

  const slides = [
    {
      text: (
        <>
          <p>
            Again, starting with the equation{" "}
            <MathFormula
              variant="small"
              tex="\dfrac{dY}{dt} = \beta - \alpha Y"
            />{" "}
            (but keeping <MathFormula variant="small" tex="\beta" /> as is this
            time), <ProteinAccumulationEquationSheet /> to the following
            equation:
          </p>
          <div className="flex flex-col justify-center mt-8 mb-8 mx-auto">
            <MathFormula
              variant="small"
              tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t})"
            />
          </div>
          <p>
            which describes how protein concentration{" "}
            <MathFormula variant="small" tex="Y" />
            rises quickly at first, and then gradually converges to the steady
            state <MathFormula variant="small" tex="Y_{st}" />, as shown in the
            graph.
          </p>
        </>
      ),
      interactive: <ResponseTimeChart curve={accumulationCurve} />,
    },
    {
      text: (
        <>
          <p>
            Using this equation, <ProteinAccumulationResponseTimeSheet /> the
            response time:
          </p>
          <div className="flex flex-col justify-center my-8 mx-auto">
            <MathFormula
              variant="small"
              tex="T_{1/2} = \dfrac{\ln 2}{\alpha}"
            />
          </div>
          <p>
            which, as it turns out, is exactly the same as the decay response
            time. Both scenarios &mdash; increasing and decreasing protein
            levels &mdash; only depend on the removal rate{" "}
            <MathFormula variant="small" tex="\alpha" />.
          </p>
        </>
      ),
      interactive: <ResponseTimeChart curve={accumulationCurve} showHalfLife />,
    },
    {
      text: (
        <>
          <p>
            Experiment with different values for the steady state concentration{" "}
            <MathFormula variant="small" tex="Y_{st}" /> and the removal rate{" "}
            <MathFormula variant="small" tex="\alpha" /> to see how they affect
            the protein accumulation curve and the response time.
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
          curve={accumulationCurve}
          steadyState={steadyState}
          alpha={alpha}
          showHalfLife={showHalfLife}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
