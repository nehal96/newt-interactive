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
  chartOptions?: {
    showDampedOscillation: boolean;
    showDottedBetaLine: boolean;
  };
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

const getDampedOscillationData = (
  steadyState: number,
  beta: number,
  tSteady: number,
  domainMax = 20
) => {
  const data = [];
  const dampingFactor = 0.25;
  const frequency = 1.25;

  // Start exactly where the linear accumulation ended
  const startY = tSteady * beta; // This should equal steadyState

  for (let t = tSteady; t <= domainMax; t += 0.1) {
    const amplitude = steadyState * 0.25;
    const oscillation =
      amplitude *
      Math.exp(-dampingFactor * (t - tSteady)) *
      Math.cos(frequency * (t - tSteady) - Math.PI / 2 + 0.8);
    // Start from startY and oscillate towards steadyState
    const y = steadyState + oscillation;
    // Apply a smooth transition from startY to the oscillating curve
    const transitionFactor = Math.exp(-1.5 * (t - tSteady));
    data.push({
      x: t,
      y: startY * transitionFactor + y * (1 - transitionFactor),
    });
  }
  return data;
};

export const NegativeAutoregAccumulationChart = ({
  beta = 12,
  steadyState = 80,
  chartOptions = {
    showDampedOscillation: false,
    showDottedBetaLine: true,
  },
}: NegativeAutoregAccumulationChartProps) => {
  const { showDampedOscillation, showDottedBetaLine } = chartOptions;
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
        style={{
          data: { stroke: "#2dd4bf", strokeWidth: 2 },
        }}
        data={getData(steadyState, beta, 0, 20)}
      />
      {showDampedOscillation && (
        <VictoryLine
          style={{
            data: { stroke: "#2dd4bf", strokeWidth: 2, opacity: 0.3 },
          }}
          data={getDampedOscillationData(steadyState, beta, steadyState / beta)}
        />
      )}
      {showDottedBetaLine && (
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
      )}
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
    {
      text: (
        <>
          <p>
            In reality, there won't be such a perfect cut-off; small
            oscillations will occur around{" "}
            <MathFormula variant="small" tex="X = K" /> if there are delays
            within the system.
          </p>
          <p className="mt-4">
            <MathFormula variant="small" tex="X" /> will slightly overshoot, and
            after production stops, decline below{" "}
            <MathFormula variant="small" tex="K" />, before starting up again
            and eventually damping down to consistently stay at{" "}
            <MathFormula variant="small" tex="K" />.
          </p>
        </>
      ),
      interactive: (
        <NegativeAutoregAccumulationChart
          beta={beta}
          chartOptions={{
            showDampedOscillation: true,
            showDottedBetaLine: false,
          }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
