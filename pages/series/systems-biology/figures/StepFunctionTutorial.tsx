import { useState } from "react";
import { TabsList, TabsTrigger } from "@ui/controls";
import { InlineCode } from "@ui/prose/Code";
import MathFormula from "@ui/prose/MathFormula";
import { SlideDeck } from "@viz/slides";
import { ActivatorGraph } from "./ActivatorGraph";
import { RepressorGraph } from "./RepressorGraph";
import { ComparisonCurve, CURVE, Curve, HILL, StepFunction } from "./chart";
import {
  getActivatorHillFunctionData,
  getRepressorHillFunctionData,
} from "./helpers";
import { Tabs } from "@ui/controls";

export function StepFunctionTutorial() {
  const [activatorN, setActivatorN] = useState(1);

  const slides = [
    {
      text: (
        <>
          <p>
            Before we look at the step function, let's re-visit the Hill
            function for an activator:
          </p>
          <div className="flex flex-col justify-center my-8 mx-auto">
            <MathFormula
              variant="small"
              tex="f(X^*) = \dfrac{X^{*n}}{K^n + X^{*n}}"
            />
          </div>
          <p>
            and look at it graphically for different values of{" "}
            <MathFormula variant="small" tex="n" />. Notice its smooth shape.
          </p>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={20}
          activatorK={8}
          activatorHillFunctionData={getActivatorHillFunctionData(
            20,
            8,
            1,
            0,
            20
          )}
          showNComparisonCurves
        />
      ),
    },
    {
      text: (
        <>
          <p>
            Now let's look at what the step function looks like for an
            activator.
          </p>
          <p className="mt-4">
            The smooth curve is replaced with a jump, or step, from{" "}
            <MathFormula variant="small" tex="0" /> to{" "}
            <MathFormula variant="small" tex="\beta" /> at the threshold{" "}
            <MathFormula variant="small" tex="K" />.
          </p>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={20}
          activatorK={8}
          activatorHillFunctionData={getActivatorHillFunctionData(
            20,
            8,
            1,
            0,
            20
          )}
          showNComparisonCurves
          showKTick
          hideMainCurve
        >
          <ComparisonCurve
            points={getActivatorHillFunctionData(20, 8, 1)}
            label="n = 1"
          />
          <StepFunction
            beta={20}
            K={8}
            variant="activator"
            stroke={CURVE.activator}
          />
        </ActivatorGraph>
      ),
    },
    {
      text: (
        <>
          <p>
            One interesting aspect is that the Hill function and the step
            function are related.
          </p>
          <p className="mt-4">
            Try different values of{" "}
            <InlineCode variant="medium">
              <MathFormula variant="small" tex="n" />
            </InlineCode>{" "}
            to see how it changes the curve:
          </p>
          <Tabs
            onValueChange={(value) => setActivatorN(Number(value))}
            defaultValue="1"
            className="mt-2"
          >
            <TabsList className="w-full">
              <TabsTrigger className="grow" value="1">
                1
              </TabsTrigger>
              <TabsTrigger className="grow" value="2">
                2
              </TabsTrigger>
              <TabsTrigger className="grow" value="4">
                4
              </TabsTrigger>
              <TabsTrigger className="grow" value="10">
                10
              </TabsTrigger>
              <TabsTrigger className="grow" value="50">
                50
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="mt-8">
            You'll notice that as <MathFormula tex="n" /> gets large, the curve
            becomes more and more like the step function. In fact, the step
            function is equivalent to the Hill function as{" "}
            <MathFormula variant="small" tex="n\to\infty" />.
          </p>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={20}
          activatorK={8}
          activatorHillFunctionData={getActivatorHillFunctionData(
            20,
            8,
            activatorN,
            0,
            20
          )}
          showKTick
          hideMainCurve
        >
          <StepFunction
            beta={20}
            K={8}
            variant="activator"
            stroke={CURVE.comparison}
          />
          <Curve
            points={getActivatorHillFunctionData(20, 8, activatorN)}
            scale={HILL}
            stroke={CURVE.activator}
          />
        </ActivatorGraph>
      ),
    },
    {
      text: (
        <>
          <p>
            The phenomena works exactly the same for the repressor, except that
            the step function drops from the maximum value{" "}
            <MathFormula variant="small" tex="\beta" /> to{" "}
            <MathFormula variant="small" tex="0" /> at the threshold{" "}
            <MathFormula variant="small" tex="K" />.
          </p>
        </>
      ),
      interactive: (
        <RepressorGraph
          repressorBeta={20}
          repressorK={8}
          repressorHillFunctionData={getRepressorHillFunctionData(
            20,
            8,
            1,
            0,
            20
          )}
          mainLineColor={CURVE.comparison}
        >
          <StepFunction
            beta={20}
            K={8}
            variant="repressor"
            stroke={CURVE.repressor}
          />
        </RepressorGraph>
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
}
