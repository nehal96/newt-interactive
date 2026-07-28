import { useState } from "react";
import {
  VictoryAxis,
  VictoryLine,
  VictoryContainer,
  VictoryLabel,
} from "victory";
import { VictoryChart } from "victory";
import { Slider } from "@ui/controls";
import { InlineCode } from "@ui/prose/Code";
import MathFormula from "@ui/prose/MathFormula";
import { axisStyle, getDottedLineStyle } from "@viz/chart";
import { SlideDeck } from "@viz/slides";
import { cn } from "@lib/utils";
import {
  accumulationCurve,
  rampToSteadyState,
  responseTime,
  sample,
} from "./helpers";
import {
  CURVE_COLOR,
  noTicksAxisStyle,
  SECONDARY_CURVE_COLOR,
} from "./victory-chart";

const calculateTHalfNAR = (K: number, betaNAR: number) => K / (2 * betaNAR);
const calculateTHalfSimpleReg = responseTime;

type NegativeAutoregResponseTimeComparisonChartProps = {
  steadyState?: number;
  betaNAR?: number;
  alphaSimpleReg?: number;
  tHalfNAR?: number;
  tHalfSimpleReg?: number;
  showResponseTime?: boolean;
};

export const NegativeAutoregResponseTimeComparisonChart = ({
  steadyState = 100,
  betaNAR = 12,
  alphaSimpleReg = 0.25,
  tHalfNAR = 10,
  tHalfSimpleReg = 4,
  showResponseTime = false,
}: NegativeAutoregResponseTimeComparisonChartProps) => {
  const dottedLineStyle = getDottedLineStyle();
  const XAxisTickValues = showResponseTime ? [tHalfNAR, tHalfSimpleReg] : [];
  const YAxisTickValues = showResponseTime
    ? [steadyState / 2, steadyState]
    : [steadyState];

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 210] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="time"
        style={noTicksAxisStyle}
        tickValues={XAxisTickValues}
        tickFormat={(tick) => {
          if (tick === tHalfNAR) return "Tn";
          if (tick === tHalfSimpleReg) return "Ts";
        }}
        axisLabelComponent={<VictoryLabel dy={-39} dx={195} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={YAxisTickValues}
        tickFormat={(tick) => {
          if (tick === steadyState / 2) return "X_st/2";
          if (tick === steadyState) return "X_st";
        }}
      />
      <VictoryLine
        style={{
          data: { stroke: SECONDARY_CURVE_COLOR },
        }}
        data={sample((t) => accumulationCurve(t, alphaSimpleReg, steadyState))}
        interpolation="basis"
      />
      <VictoryLine
        style={{
          data: { stroke: CURVE_COLOR, strokeWidth: 2 },
        }}
        data={rampToSteadyState(steadyState, betaNAR)}
      />
      {showResponseTime && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: 0, y: steadyState / 2 },
            { x: tHalfSimpleReg, y: steadyState / 2 },
          ]}
        />
      )}
      {showResponseTime && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: tHalfNAR, y: steadyState / 2 },
            { x: tHalfNAR, y: 0 },
          ]}
        />
      )}
      {showResponseTime && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: tHalfSimpleReg, y: steadyState / 2 },
            { x: tHalfSimpleReg, y: 0 },
          ]}
        />
      )}
    </VictoryChart>
  );
};

// Each slide group drives the chart from its own parameter set; `free` sets the
// steady state directly, the others derive it from beta/alpha.
const useParams = <T extends Record<string, number>>(initial: T) => {
  const [params, setParams] = useState(initial);
  const set = (key: keyof T) => (values: number[]) =>
    setParams((current) => ({ ...current, [key]: values[0] }));

  return [params, set] as const;
};

export const NegativeAutoregResponseTimeComparisonTutorial = () => {
  const [free, setFree] = useParams({
    betaNAR: 24,
    alphaSimpleReg: 0.1,
    K: 130,
  });
  const [matched, setMatched] = useParams({
    betaSimpleReg: 12,
    alphaSimpleReg: 0.12,
    betaNAR: 24,
  });
  const [combined, setCombined] = useParams({
    betaSimpleReg: 12,
    alphaSimpleReg: 0.1,
    betaNAR: 24,
  });

  const freeChart = {
    steadyState: free.K,
    betaNAR: free.betaNAR,
    alphaSimpleReg: free.alphaSimpleReg,
    tHalfNAR: calculateTHalfNAR(free.K, free.betaNAR),
    tHalfSimpleReg: calculateTHalfSimpleReg(free.alphaSimpleReg),
  };

  const matchedK = matched.betaSimpleReg / matched.alphaSimpleReg;
  const matchedChart = {
    steadyState: matchedK,
    betaNAR: matched.betaNAR,
    alphaSimpleReg: matched.alphaSimpleReg,
    tHalfNAR: calculateTHalfNAR(matchedK, matched.betaNAR),
    tHalfSimpleReg: calculateTHalfSimpleReg(matched.alphaSimpleReg),
  };

  const K = combined.betaSimpleReg / combined.alphaSimpleReg;
  const tHalfNAR = calculateTHalfNAR(K, combined.betaNAR);
  const tHalfSimpleReg = calculateTHalfSimpleReg(combined.alphaSimpleReg);
  const combinedChart = {
    steadyState: K,
    betaNAR: combined.betaNAR,
    alphaSimpleReg: combined.alphaSimpleReg,
    tHalfNAR,
    tHalfSimpleReg,
  };

  const ratio = tHalfSimpleReg / tHalfNAR;
  const percentFaster = (ratio - 1) * 100;

  const slides = [
    {
      text: (
        <>
          <p>
            Let's start by plotting both the (approximate) negative
            autoregulation curve (in green) and the simple regulation curve (in
            grey).
          </p>
          <p className="mt-4">
            The simple regulation curve, as seen before, is given by the
            equation:
          </p>
          <div className="text-center my-8">
            <MathFormula
              variant="small"
              tex="X(t) = X_{st} (1 - e^{-\alpha_{simple} t})"
            />
          </div>
          <p>
            where <MathFormula variant="small" tex="\alpha_{simple}" /> is the
            removal rate for the simple regulation.
          </p>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          steadyState={K}
          betaNAR={combined.betaNAR}
          alphaSimpleReg={combined.alphaSimpleReg}
        />
      ),
    },
    {
      text: (
        <>
          <p>
            The response time for simple regulation and negative autoregulation
            are given by the equations:
          </p>
          <div className="text-center flex flex-col gap-4 my-8">
            <MathFormula
              variant="small"
              tex="T_{1/2_{simple}} = \dfrac{\ln(2)}{\alpha_{simple}}"
            />
            <MathFormula
              variant="small"
              tex="T_{1/2_{NAR}} = \dfrac{K}{2 \beta_{NAR}}"
            />
          </div>
          <p>
            But before comparing them analytically, we can plot them on the
            chart
          </p>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          {...combinedChart}
          showResponseTime
        />
      ),
    },
    {
      text: (
        <>
          <p>
            Let's play with the two curves' parameters individually and see how
            it changes the curve and their response time (not a mathematically
            controlled comparison).
          </p>
          <div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\alpha_{simple}" />:{" "}
                {free.alphaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[free.alphaSimpleReg]}
                onValueChange={setFree("alphaSimpleReg")}
                min={0.1}
                max={0.2}
                step={0.01}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta_{NAR}" />: {free.betaNAR.toFixed(2)}
              </label>
              <Slider
                value={[free.betaNAR]}
                onValueChange={setFree("betaNAR")}
                min={12}
                max={50}
                step={1}
                className="w-11/12"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          {...freeChart}
          showResponseTime
        />
      ),
    },
    {
      text: (
        <>
          <p>
            To make it a mathematically controlled comparison, we need to ensure
            that the steady state is the same for both curves:
          </p>
          <div className="text-center my-8">
            <MathFormula
              variant="small"
              tex="X_{st} = K = \dfrac{\beta_{simple}}{\alpha_{simple}}"
            />
          </div>
          <p>
            Try changing <MathFormula variant="small" tex="K" /> and see what
            happens:
          </p>
          <div className="mt-4">
            <label className="font-medium block mb-1.5">
              <MathFormula tex="K" />: {free.K.toFixed(2)}
            </label>
            <Slider
              value={[free.K]}
              onValueChange={setFree("K")}
              min={60}
              max={130}
              step={1}
              className="w-11/12"
            />
          </div>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          {...freeChart}
          showResponseTime
        />
      ),
    },
    {
      text: (
        <>
          <p>
            <MathFormula tex="K" /> depends on both{" "}
            <MathFormula tex="\beta_{simple}" /> and{" "}
            <MathFormula tex="\alpha_{simple}" />. Play around with changing{" "}
            <MathFormula tex="\beta_{simple}" /> and{" "}
            <MathFormula tex="\alpha_{simple}" /> while keeping{" "}
            <MathFormula tex="K" /> at 100.
          </p>
          <p className="mt-4">
            If you then match <MathFormula tex="\beta_{NAR}" /> with{" "}
            <MathFormula tex="\beta_{simple}" />, how do their response times
            compare?
          </p>
          <div>
            <div className="mt-6">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta_{simple}" />:{" "}
                {matched.betaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[matched.betaSimpleReg]}
                onValueChange={setMatched("betaSimpleReg")}
                min={12}
                max={20}
                step={1}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\alpha_{simple}" />:{" "}
                {matched.alphaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[matched.alphaSimpleReg]}
                onValueChange={setMatched("alphaSimpleReg")}
                min={0.1}
                max={0.25}
                step={0.01}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta_{NAR}" />: {matched.betaNAR.toFixed(2)}
              </label>
              <Slider
                value={[matched.betaNAR]}
                onValueChange={setMatched("betaNAR")}
                min={12}
                max={25}
                step={1}
                className="w-11/12"
              />
              <div className="mt-6">
                <MathFormula tex="K" />:{" "}
                <InlineCode
                  className={cn(
                    "bg-slate-200 text-slate-800",
                    matchedK.toFixed(2) === "100.00"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  )}
                >
                  {matchedK.toFixed(2)}
                </InlineCode>
              </div>
            </div>
          </div>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          {...matchedChart}
          showResponseTime
        />
      ),
    },
    {
      text: (
        <>
          <p>
            You might have noticed that, when keeping <MathFormula tex="K" /> at
            100 (or any constant value for that matter) and matching both
            promoter values, negative autoregulation is always a little bit
            faster.
          </p>
          <p className="mt-4">
            But how much faster? Let's create a ratio to compare:
          </p>
          <div className="flex flex-col text-center my-8">
            <MathFormula
              variant="small"
              tex="\text{ratio} = \dfrac{T_{1/2_{simple}}}{T_{1/2_{NAR}}}"
            />
            <MathFormula
              variant="small"
              className="mt-4"
              tex="\hspace{4.75em} = \dfrac{2\ln(2) \cdot \beta_{NAR}}{\beta_{simple}}"
            />
          </div>
          <p>
            The ratio value gives us a multiplier for how much faster negative
            autoregulation is compared to simple regulation. If{" "}
            <MathFormula tex="T_{1/2_{simple}}" /> is 1s and{" "}
            <MathFormula tex="T_{1/2_{NAR}}" /> is 0.5s, then the ratio is 2, as
            in twice as fast.
          </p>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          {...matchedChart}
          showResponseTime
        />
      ),
    },
    {
      text: (
        <>
          <p>Combining everything:</p>
          <div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula variant="small" tex="\beta_{simple}" />:{" "}
                {combined.betaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[combined.betaSimpleReg]}
                onValueChange={setCombined("betaSimpleReg")}
                min={12}
                max={20}
                step={1}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula variant="small" tex="\alpha_{simple}" />:{" "}
                {combined.alphaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[combined.alphaSimpleReg]}
                onValueChange={setCombined("alphaSimpleReg")}
                min={0.1}
                max={0.25}
                step={0.01}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula variant="small" tex="\beta_{NAR}" />:{" "}
                {combined.betaNAR.toFixed(2)}
              </label>
              <Slider
                value={[combined.betaNAR]}
                onValueChange={setCombined("betaNAR")}
                min={12}
                max={26}
                step={1}
                className="w-11/12"
              />
            </div>
            <div className="mt-6 flex flex-col space-y-4 w-11/12">
              <div className="flex justify-between items-center">
                <label className="font-medium block mb-1.5">
                  <MathFormula
                    variant="small"
                    tex="K = X_{st} = \dfrac{\beta_{simple}}{\alpha_{simple}}"
                  />
                  :
                </label>
                <span>
                  <InlineCode variant="medium">{`${K.toFixed(2)}`}</InlineCode>
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <label className="font-medium block mb-1.5">
                  <MathFormula
                    variant="small"
                    tex="T_{1/2_{NAR}} = \dfrac{K}{2 \beta_{NAR}}"
                  />
                  :
                </label>
                <span>
                  <InlineCode variant="medium">{`${tHalfNAR.toFixed(
                    2
                  )}`}</InlineCode>
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <label className="font-medium block mb-1.5">
                  <MathFormula
                    variant="small"
                    tex="T_{1/2_{simple}} = \dfrac{\ln(2)}{\alpha_{simple}}"
                  />
                  :
                </label>
                <span>
                  <InlineCode variant="medium">{`${tHalfSimpleReg.toFixed(
                    2
                  )}`}</InlineCode>
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <label className="font-medium block mb-1.5">
                  <MathFormula
                    variant="small"
                    tex="\text{Ratio} = \dfrac{T_{1/2_{simple}}}{T_{1/2_{NAR}}}"
                  />
                  :
                </label>
                <div className="flex flex-col items-end">
                  <span>
                    <InlineCode variant="medium">{`${ratio.toFixed(
                      2
                    )}`}</InlineCode>
                  </span>
                  <span className="text-sm text-slate-500">
                    {percentFaster.toFixed(0)}% faster
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          {...combinedChart}
          showResponseTime
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
