import { useState } from "react";
import {
  ChartXAxis,
  ChartYAxis,
  MathFormula,
  SlideDeck,
} from "../../components";
import { VictoryChart, VictoryLine } from "victory";

const getActivatorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  domainMin = 0,
  domainMax = 20
) => {
  const data = [];

  const activatorHillFunction = (x) => {
    return (beta * x ** n) / (K ** n + x ** n);
  };

  for (let x = domainMin; x <= domainMax; x++) {
    const y = activatorHillFunction(x);
    data.push({ x, y });
  }

  return data;
};

const getRepressorHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  domainMin = 0,
  domainMax = 20
) => {
  const data = [];

  const repressorHillFunction = (x) => {
    return (beta * K ** n) / (K ** n + x ** n);
  };

  for (let x = domainMin; x <= domainMax; x++) {
    const y = repressorHillFunction(x);
    data.push({ x, y });
  }

  return data;
};

const TranscriptionNetworkTutorial = () => {
  const [activatorBeta, setActivatorBeta] = useState(10);
  const [activatorK, setActivatorK] = useState(1);
  const [activatorN, setActivatorN] = useState(1);
  const [repressorBeta, setRepressorBeta] = useState(10);
  const [repressorK, setRepressorK] = useState(1);
  const [repressorN, setRepressorN] = useState(1);

  const activatorHillFunctionData = getActivatorHillFunctionData(
    activatorBeta,
    activatorK,
    activatorN,
    0,
    20
  );
  const repressorHillFunctionData = getRepressorHillFunctionData(
    repressorBeta,
    repressorK,
    repressorN,
    0,
    20
  );

  const slides = [
    {
      section: "Functions",
      text: (
        <>
          <div>
            This graph shows the Hill function for an activator:
            <div className="my-4 flex items-center justify-center">
              <MathFormula tex="f(X^*) = \beta \frac{X^{*n}}{K^n + X^{*n}}" />
            </div>
            where:
            <br />
            <MathFormula tex="\beta" /> is the maximal promoter activity
            <br />
            <MathFormula tex="K" /> is the activation coefficient
            <br />
            <MathFormula tex="n" /> is the Hill coefficient
            <br />
            <MathFormula tex="X^*" /> is the concentration of transcription
            factor in its active form
          </div>
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {activatorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={activatorBeta}
                onChange={(e) => setActivatorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {activatorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="0.1"
                max="10"
                step="0.1"
                value={activatorK}
                onChange={(e) => setActivatorK(parseFloat(e.target.value))}
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
                min="0.1"
                max="4"
                step="0.1"
                value={activatorN}
                onChange={(e) => setActivatorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <VictoryChart domain={{ x: [0, 20], y: [0, 22] }}>
          <ChartXAxis standalone={false} />
          <ChartYAxis standalone={false} />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={activatorHillFunctionData}
            interpolation="basis"
          />
        </VictoryChart>
      ),
    },
    {
      section: "Functions",
      text: (
        <>
          <p className="mb-4">
            Now let's look at the Hill function for a repressor. The equation
            for a repressor is:
          </p>
          <div className="flex items-center justify-center">
            <MathFormula tex="f(X^*) = \beta \frac{K^n}{K^n + X^{*n}}" />
          </div>
          <p className="my-4">
            Adjust the sliders to see how the parameters affect the repressor
            function:
          </p>
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {repressorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={repressorBeta}
                onChange={(e) => setRepressorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {repressorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="0.1"
                max="10"
                step="0.1"
                value={repressorK}
                onChange={(e) => setRepressorK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {repressorN}
              </label>
              <input
                type="range"
                id="n-slider"
                min="0.1"
                max="4"
                step="0.1"
                value={repressorN}
                onChange={(e) => setRepressorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <VictoryChart domain={{ x: [0, 20], y: [0, 22] }}>
          <ChartXAxis standalone={false} />
          <ChartYAxis standalone={false} />
          <VictoryLine
            style={{
              data: { stroke: "#3b82f6" },
              parent: { border: "1px solid #ccc" },
            }}
            data={repressorHillFunctionData}
            interpolation="basis"
          />
        </VictoryChart>
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default TranscriptionNetworkTutorial;
