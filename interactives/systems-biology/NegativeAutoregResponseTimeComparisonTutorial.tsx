import { useState } from "react";
import {
  VictoryAxis,
  VictoryLine,
  VictoryContainer,
  VictoryLabel,
} from "victory";
import { VictoryChart } from "victory";
import {
  axisStyle,
  getDottedLineStyle,
  InlineCode,
  MathFormula,
  SlideDeck,
  Slider,
} from "../../components";
import { cn } from "../../lib/utils";

// Helper Functions
const calculateTHalfNAR = (K: number, betaNAR: number) => K / (2 * betaNAR);
const calculateTHalfSimpleReg = (alphaSimpleReg: number) =>
  Math.log(2) / alphaSimpleReg;

export const NegativeAutoregResponseTimeComparisonChart = ({
  steadyState = 100,
  betaNAR = 12,
  alphaSimpleReg = 0.25,
  tHalfNAR = 10,
  tHalfSimpleReg = 4,
  chartOptions = {
    showResponseTime: false,
  },
}) => {
  const { showResponseTime } = chartOptions;
  const dottedLineStyle = getDottedLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };
  const XAxisTickValues = showResponseTime ? [tHalfNAR, tHalfSimpleReg] : [];
  const YAxisTickValues = showResponseTime
    ? [steadyState / 2, steadyState]
    : [steadyState];

  const getNARLineData = (
    steadyState: number,
    beta = 12,
    domainMin = 0,
    domainMax = 20
  ) => {
    const data = [];
    const tSteady = steadyState / beta;

    for (let t = domainMin; t <= tSteady; t += 0.1) {
      data.push({ x: t, y: t * beta });
    }

    for (let t = tSteady; t <= domainMax; t += 0.1) {
      data.push({ x: t, y: steadyState });
    }

    return data;
  };

  const simpleRegProteinAccumulationFunction = (
    t,
    alpha = 0.25,
    steadyState = 100
  ) => {
    return steadyState * (1 - Math.exp(-alpha * t));
  };

  const getSimpleRegProteinAccumulationData = (
    alpha = 0.25,
    steadyState = 100,
    domainMin = 0,
    domainMax = 20
  ) => {
    const data = [];

    for (let t = domainMin; t <= domainMax; t++) {
      const y = simpleRegProteinAccumulationFunction(t, alpha, steadyState);
      data.push({ x: t, y });
    }

    return data;
  };

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 210] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="time"
        style={noTicksStyle}
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
          data: { stroke: "#cbd5e1" },
        }}
        data={getSimpleRegProteinAccumulationData(alphaSimpleReg, steadyState)}
        interpolation="basis"
      />
      <VictoryLine
        style={{
          data: { stroke: "#2dd4bf", strokeWidth: 2 },
        }}
        data={getNARLineData(steadyState, betaNAR)}
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

export const NegativeAutoregResponseTimeComparisonTutorial = () => {
  const [uncontrolledBetaNAR, setUncontrolledBetaNAR] = useState(24);
  const [uncontrolledAlphaSimpleReg, setUncontrolledAlphaSimpleReg] =
    useState(0.1);
  const [uncontrolledK, setUncontrolledK] = useState(130);

  const [betaSimpleReg2, setBetaSimpleReg2] = useState(12);
  const [alphaSimpleReg2, setAlphaSimpleReg2] = useState(0.12);
  const [betaNAR2, setBetaNAR2] = useState(24);

  const calculatedK2 = betaSimpleReg2 / alphaSimpleReg2;
  const tHalfNAR2 = calculateTHalfNAR(calculatedK2, betaNAR2);
  const tHalfSimpleReg2 = calculateTHalfSimpleReg(alphaSimpleReg2);

  const uncontrolledTHalfNAR = calculateTHalfNAR(
    uncontrolledK,
    uncontrolledBetaNAR
  );
  const uncontrolledTHalfSimpleReg = calculateTHalfSimpleReg(
    uncontrolledAlphaSimpleReg
  );

  const [betaNAR, setBetaNAR] = useState(24);
  const [betaSimpleReg, setBetaSimpleReg] = useState(12);
  const [alphaSimpleReg, setAlphaSimpleReg] = useState(0.1);

  const K = betaSimpleReg / alphaSimpleReg;
  const tHalfNAR = calculateTHalfNAR(K, betaNAR);
  const tHalfSimpleReg = calculateTHalfSimpleReg(alphaSimpleReg);
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
          betaNAR={betaNAR}
          alphaSimpleReg={alphaSimpleReg}
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
          steadyState={K}
          betaNAR={betaNAR}
          alphaSimpleReg={alphaSimpleReg}
          tHalfNAR={tHalfNAR}
          tHalfSimpleReg={tHalfSimpleReg}
          chartOptions={{ showResponseTime: true }}
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
                {uncontrolledAlphaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[uncontrolledAlphaSimpleReg]}
                onValueChange={(values) =>
                  setUncontrolledAlphaSimpleReg(values[0])
                }
                min={0.1}
                max={0.2}
                step={0.01}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta_{NAR}" />:{" "}
                {uncontrolledBetaNAR.toFixed(2)}
              </label>
              <Slider
                value={[uncontrolledBetaNAR]}
                onValueChange={(values) => setUncontrolledBetaNAR(values[0])}
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
          steadyState={uncontrolledK}
          betaNAR={uncontrolledBetaNAR}
          alphaSimpleReg={uncontrolledAlphaSimpleReg}
          tHalfNAR={uncontrolledTHalfNAR}
          tHalfSimpleReg={uncontrolledTHalfSimpleReg}
          chartOptions={{ showResponseTime: true }}
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
              <MathFormula tex="K" />: {uncontrolledK.toFixed(2)}
            </label>
            <Slider
              value={[uncontrolledK]}
              onValueChange={(values) => setUncontrolledK(values[0])}
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
          steadyState={uncontrolledK}
          betaNAR={uncontrolledBetaNAR}
          alphaSimpleReg={uncontrolledAlphaSimpleReg}
          tHalfNAR={uncontrolledTHalfNAR}
          tHalfSimpleReg={uncontrolledTHalfSimpleReg}
          chartOptions={{ showResponseTime: true }}
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
                {betaSimpleReg2.toFixed(2)}
              </label>
              <Slider
                value={[betaSimpleReg2]}
                onValueChange={(values) => setBetaSimpleReg2(values[0])}
                min={12}
                max={20}
                step={1}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\alpha_{simple}" />:{" "}
                {alphaSimpleReg2.toFixed(2)}
              </label>
              <Slider
                // disabled
                value={[alphaSimpleReg2]}
                onValueChange={(values) => setAlphaSimpleReg2(values[0])}
                min={0.1}
                max={0.25}
                step={0.01}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta_{NAR}" />: {betaNAR2.toFixed(2)}
              </label>
              <Slider
                value={[betaNAR2]}
                onValueChange={(values) => setBetaNAR2(values[0])}
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
                    calculatedK2.toFixed(2) === "100.00"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  )}
                >
                  {calculatedK2.toFixed(2)}
                </InlineCode>
              </div>
            </div>
          </div>
        </>
      ),
      interactive: (
        <NegativeAutoregResponseTimeComparisonChart
          steadyState={calculatedK2}
          betaNAR={betaNAR2}
          alphaSimpleReg={alphaSimpleReg2}
          tHalfNAR={tHalfNAR2}
          tHalfSimpleReg={tHalfSimpleReg2}
          chartOptions={{ showResponseTime: true }}
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
          steadyState={calculatedK2}
          betaNAR={betaNAR2}
          alphaSimpleReg={alphaSimpleReg2}
          tHalfNAR={tHalfNAR2}
          tHalfSimpleReg={tHalfSimpleReg2}
          chartOptions={{ showResponseTime: true }}
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
                {betaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[betaSimpleReg]}
                onValueChange={(values) => setBetaSimpleReg(values[0])}
                min={12}
                max={20}
                step={1}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula variant="small" tex="\alpha_{simple}" />:{" "}
                {alphaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[alphaSimpleReg]}
                onValueChange={(values) => setAlphaSimpleReg(values[0])}
                min={0.1}
                max={0.25}
                step={0.01}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula variant="small" tex="\beta_{NAR}" />:{" "}
                {betaNAR.toFixed(2)}
              </label>
              <Slider
                value={[betaNAR]}
                onValueChange={(values) => setBetaNAR(values[0])}
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
          steadyState={K}
          betaNAR={betaNAR}
          alphaSimpleReg={alphaSimpleReg}
          tHalfNAR={tHalfNAR}
          tHalfSimpleReg={tHalfSimpleReg}
          chartOptions={{ showResponseTime: true }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
