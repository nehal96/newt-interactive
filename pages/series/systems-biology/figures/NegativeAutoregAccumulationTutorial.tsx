import { Slider } from "@ui/controls";
import MathFormula from "@ui/prose/MathFormula";
import { SlideDeck } from "@viz/slides";
import { useState } from "react";
import { Axes, CURVE, Curve, Plot, scaleFor } from "./chart";
import { rampToSteadyState, sample } from "./helpers";

interface NegativeAutoregAccumulationChartProps {
  beta?: number;
  steadyState?: number;
  showDampedOscillation?: boolean;
  showDottedBetaLine?: boolean;
}

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

const SCALE = scaleFor(20, 130);

export const NegativeAutoregAccumulationChart = ({
  beta = 12,
  steadyState = 80,
  showDampedOscillation = false,
  showDottedBetaLine = true,
}: NegativeAutoregAccumulationChartProps) => {
  const tSteady = steadyState / beta;

  return (
    <Plot
      title="Negative autoregulation accumulation"
      desc={`Protein X accumulating at a rate of ${beta} per unit time until it reaches the threshold K, then holding there.${
        showDampedOscillation
          ? " Delays in the system make it overshoot and oscillate before settling."
          : ""
      }`}
    >
      <Axes
        scale={SCALE}
        xLabel="time"
        yLabel="X(t)"
        yTicks={[[steadyState, "K"]]}
      />
      {showDottedBetaLine && (
        <Curve
          points={sample((t) => t * beta, { min: tSteady, max: 20, step: 0.1 })}
          scale={SCALE}
          stroke={CURVE.unregulated}
          width={2}
          dashed
          clip
        />
      )}
      <Curve
        points={rampToSteadyState(steadyState, beta)}
        scale={SCALE}
        stroke={CURVE.response}
        width={2}
      />
      {showDampedOscillation && (
        <Curve
          points={getDampedOscillationData(steadyState, beta, tSteady)}
          scale={SCALE}
          stroke={CURVE.response}
          width={2}
          opacity={0.3}
        />
      )}
    </Plot>
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
            reaches the threshold <MathFormula variant="small" tex="K" /> (the
            linear line), after which production stops and stays at the same
            level (the horizontal line):
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
          showDampedOscillation
          showDottedBetaLine={false}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
