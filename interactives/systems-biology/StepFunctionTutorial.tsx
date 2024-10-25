import { useState } from "react";
import {
  InlineCode,
  MathFormula,
  SlideDeck,
  TabsList,
  TabsTrigger,
} from "../../components";
import ActivatorGraph, { SecondaryLine } from "./ActivatorGraph";
import RepressorGraph from "./RepressorGraph";
import {
  getActivatorHillFunctionData,
  getRepressorHillFunctionData,
} from "./helpers";
import { VictoryLabel, VictoryLine } from "victory";
import { Tabs } from "../../components/Tabs";

export default function StepFunctionTutorial() {
  const [activatorN, setActivatorN] = useState(1);

  const slides = [
    {
      text: (
        <>
          <p>
            Before we look at the step function, let's re-visit the Hill
            function for an activator:
          </p>
          <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
            <MathFormula
              className="mt-6"
              tex="f(X^*) = \dfrac{X^{*n}}{K^n + X^{*n}}"
            />
          </div>
          <p>
            and look at it graphically for different values of{" "}
            <MathFormula tex="n" />. Notice its smooth shape.
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
          chartOptions={{
            showNComparisonCurves: true,
          }}
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
            <MathFormula tex="0" /> to <MathFormula tex="\beta" /> at the
            threshold <MathFormula tex="K" />.
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
          chartOptions={{
            showNComparisonCurves: true,
            xAxisTickValues: [8],
            xAxisTickFormat: () => "K",
            hideMainCurve: true,
          }}
        >
          <SecondaryLine
            data={getActivatorHillFunctionData(20, 8, 1)}
            label="n = 1"
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 0, y: 0.1 },
              { x: 8, y: 0.1 },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 8, y: 0 },
              { x: 8, y: 20 },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 8, y: 20 },
              { x: 20, y: 20 },
            ]}
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
              <MathFormula tex="n" />
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
            <MathFormula tex="n\to\infty" />.
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
          chartOptions={{
            xAxisTickValues: [8],
            xAxisTickFormat: () => "K",
            hideMainCurve: true,
          }}
        >
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 0, y: 0.1 },
              { x: 8, y: 0.1 },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 8, y: 0 },
              { x: 8, y: 20 },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 8, y: 20 },
              { x: 20, y: 20 },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 8, activatorN)}
            interpolation="basis"
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
            <MathFormula tex="\beta" /> to 0 at the threshold,{" "}
            <MathFormula tex="K" />.
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
          mainLineColor="#cbd5e1"
        >
          <VictoryLine
            style={{
              data: { stroke: "#3b82f6" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 0, y: 20 },
              { x: 8, y: 20 },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#3b82f6" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 8, y: 20 },
              { x: 8, y: 0.1 },
            ]}
          />
          <VictoryLine
            style={{
              data: { stroke: "#3b82f6" },
              parent: { border: "1px solid #ccc" },
            }}
            data={[
              { x: 8, y: 0.1 },
              { x: 20, y: 0.1 },
            ]}
          />
        </RepressorGraph>
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
}
