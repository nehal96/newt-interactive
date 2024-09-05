import { useState } from "react";
import { MathFormula, SlideDeck } from "../../components";
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from "victory";

const getHillFunctionData = (
  beta = 10,
  K = 1,
  n = 1,
  domainMin = 0,
  domainMax = 20
) => {
  const data = [];

  const hillFunction = (x) => {
    return (beta * x ** n) / (K ** n + x ** n);
  };

  for (let x = domainMin; x <= domainMax; x++) {
    const y = hillFunction(x);
    data.push({ x, y });
  }

  return data;
};

const TranscriptionNetworkTutorial = () => {
  const [beta, setBeta] = useState(10);
  const [K, setK] = useState(1);
  const [n, setN] = useState(1);

  const hillFunctionData = getHillFunctionData(beta, K, n, 0, 20);

  const slides = [
    {
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
                <MathFormula tex="\beta" />: {beta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={beta}
                onChange={(e) => setBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {K}
              </label>
              <input
                type="range"
                id="K-slider"
                min="0.1"
                max="10"
                step="0.1"
                value={K}
                onChange={(e) => setK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {n}
              </label>
              <input
                type="range"
                id="n-slider"
                min="0.1"
                max="4"
                step="0.1"
                value={n}
                onChange={(e) => setN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <VictoryChart domain={{ x: [0, 20], y: [0, 20] }}>
          <VictoryAxis
            crossAxis
            domain={[0, 20]}
            standalone={false}
            style={{
              axis: { stroke: "#090a0b" },
              axisLabel: { padding: 30 },
              tickLabels: { fontSize: 14, fill: "#334155" },
              ticks: { stroke: "#94a3b8", size: 4 },
            }}
          />
          <VictoryAxis
            dependentAxis
            crossAxis
            domain={[0, 20]}
            theme={VictoryTheme.material}
            style={{
              axis: { stroke: "#94a3b8" },
              axisLabel: { padding: 30 },
              tickLabels: { fontSize: 14, fill: "#334155" },
              ticks: { stroke: "#94a3b8", size: 4 },
            }}
            standalone={false}
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={hillFunctionData}
            interpolation="basis"
          />
        </VictoryChart>
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default TranscriptionNetworkTutorial;
