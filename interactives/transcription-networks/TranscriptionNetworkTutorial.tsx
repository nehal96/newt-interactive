import { useState } from "react";
import {
  NestedInteractiveContainer,
  NestedInteractiveTextContainer,
  NestedInteractiveCanvasContainer,
  MathFormula,
} from "../../components";
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
  return (
    <NestedInteractiveContainer>
      <NestedInteractiveTextContainer>
        <p className="mb-4">
          This graph shows the Hill function for an activator:
          <div className="my-4">
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
          <MathFormula tex="X^*" /> is the concentration of transcription factor
          in its active form
          <br />
        </p>
      </NestedInteractiveTextContainer>
      <NestedInteractiveCanvasContainer className="bg-white">
        <VictoryChart domain={{ x: [0, 20], y: [0, 20] }}>
          <VictoryAxis
            crossAxis
            domain={[0, 20]}
            standalone={false}
            style={{
              axis: { stroke: "#94a3b8" },
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
            data={getHillFunctionData()}
            interpolation="natural"
          />
        </VictoryChart>
      </NestedInteractiveCanvasContainer>
    </NestedInteractiveContainer>
  );
};

export default TranscriptionNetworkTutorial;
