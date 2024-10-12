import { useState } from "react";
import { MathFormula, SlideDeck } from "../../components";
import { ActivatorGraph } from "./ActivatorTutorial";
import { getActivatorHillFunctionData } from "./helpers";
import { VictoryLabel, VictoryLine } from "victory";

export default function ActivatorStepFunctionTutorial() {
  const [activatorN, setActivatorN] = useState(1);

  const slides = [
    {
      text: (
        <>
          <p>Let's re-visit the Hill function for an activator:</p>
          <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
            <MathFormula
              className="mt-6"
              tex="f(X^*) = \dfrac{X^{*n}}{K^n + X^{*n}}"
            />
          </div>
          <p>
            and look at it graphically for different values of{" "}
            <MathFormula tex="n" />.
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
        >
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 8, 1)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 1" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
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
          <div className="mt-4">
            <label htmlFor="beta-slider" className="font-medium block">
              <MathFormula tex="\beta" />: {20}
            </label>
            <input
              type="range"
              id="beta-slider"
              min="0"
              max="20"
              step="0.1"
              value={20}
              disabled
              className="w-11/12 flex-auto cursor-pointer"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="K-slider" className="font-medium block">
              <MathFormula tex="K" />: {5}
            </label>
            <input
              type="range"
              id="K-slider"
              min="1"
              max="10"
              step="0.1"
              value={5}
              disabled
              // onChange={(e) => setActivatorK(parseFloat(e.target.value))}
              className="w-11/12 flex-auto cursor-pointer"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="n-slider" className="font-medium block">
              <MathFormula tex="n" />: {activatorN}
            </label>
            <input
              type="range"
              id="n-slider"
              min="1"
              max="100"
              step="1"
              value={activatorN}
              onChange={(e) => setActivatorN(parseFloat(e.target.value))}
              className="w-11/12 flex-auto cursor-pointer"
            />
          </div>
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
        </ActivatorGraph>
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
}
