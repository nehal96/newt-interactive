import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
} from "victory";
import {
  axisStyle,
  getDottedLineStyle,
  MathFormula,
  SlideDeck,
  Slider,
} from "../../components";
import { useState } from "react";

interface NegativeAutoregAccumulationChartProps {
  beta?: number;
  steadyState?: number;
}

const getData = (
  steadyState: number,
  beta: number,
  domainMin = 0,
  domainMax = 20
) => {
  const data = [];
  const tSteady = steadyState / beta;

  for (let t = domainMin; t < tSteady; t += 0.1) {
    data.push({ x: t, y: t * beta });
  }

  for (let t = tSteady; t <= domainMax; t += 0.1) {
    data.push({ x: t, y: steadyState });
  }

  return data;
};

export const NegativeAutoregAccumulationChart = ({
  beta = 12,
  steadyState = 80,
}: NegativeAutoregAccumulationChartProps) => {
  const dottedLineStyle = getDottedLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };
  const XAxisTickValues = [];

  const tSteady = steadyState / beta;

  const getDottedLineData = () => {
    const data = [];
    for (let t = tSteady; t <= 20; t += 0.1) {
      data.push({ x: t, y: t * beta });
    }
    return data;
  };

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 130] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="time"
        style={noTicksStyle}
        tickValues={XAxisTickValues}
        axisLabelComponent={<VictoryLabel dy={-39} dx={195} />}
      />
      <VictoryAxis
        dependentAxis
        label="X(t)"
        style={axisStyle}
        tickValues={[steadyState]}
        tickFormat={() => "K"}
      />
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: 0, y: steadyState },
          { x: tSteady, y: steadyState },
        ]}
      />
      <VictoryLine
        style={{
          data: { stroke: "#2dd4bf", strokeWidth: 2 },
        }}
        data={getData(steadyState, beta)}
      />
      <VictoryLine
        style={{
          data: {
            ...dottedLineStyle.data,
            strokeWidth: 2,
            strokeDasharray: "4,4",
            stroke: "#0d9488",
          },
        }}
        data={getDottedLineData()}
      />
    </VictoryChart>
  );
};

export const NegativeAutoregAccumulationTutorial = () => {
  const [beta, setBeta] = useState(20);

  const slides = [
    {
      text: (
        <>
          <p>
            Starting at <MathFormula variant="small" tex="t = 0" />, protein{" "}
            <MathFormula variant="small" tex="X" /> is produced at a rate of{" "}
            <MathFormula variant="small" tex="\beta" /> per unit time until it
            reaches the threshold <MathFormula variant="small" tex="K" />, after
            which production stops and stays at zero (the horizontal line):
          </p>
          <p className="mt-4">
            The green dotted line indicates the continued production of{" "}
            <MathFormula variant="small" tex="X" /> if it did not regulate
            itself.
          </p>
        </>
      ),
      interactive: <NegativeAutoregAccumulationChart beta={beta} />,
    },
    {
      text: (
        <>
          <p>
            How quickly the protein levels rise to the threshold depends on the
            value of <MathFormula variant="small" tex="\beta" />. Try changing
            its value to see how the graph changes:
          </p>
          <div className="mt-4">
            <label className="font-medium block mb-1.5">
              <MathFormula variant="small" tex="\beta" />: {beta}
            </label>
            <Slider
              value={[beta]}
              onValueChange={(values) => setBeta(values[0])}
              min={10}
              max={30}
              step={1}
              className="w-11/12"
            />
          </div>
        </>
      ),
      interactive: <NegativeAutoregAccumulationChart beta={beta} />,
    },
  ];

  return <SlideDeck slides={slides} />;
};
