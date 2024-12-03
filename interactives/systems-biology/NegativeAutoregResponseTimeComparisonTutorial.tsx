import { useState } from "react";
import {
  VictoryAxis,
  VictoryLine,
  VictoryContainer,
  VictoryLabel,
  DomainTuple,
} from "victory";
import { VictoryChart } from "victory";
import {
  axisStyle,
  getDottedLineStyle,
  InlineCode,
  MathFormula,
  SlideDeck,
  Slider,
  Switch,
} from "../../components";
import { cn } from "../../lib/utils";

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
      domain={{ x: [0, 20], y: [0, 140] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="time"
        style={noTicksStyle}
        tickValues={XAxisTickValues}
        tickFormat={(tick) => {
          if (tick === tHalfNAR) return "T1/2_N";
          if (tick === tHalfSimpleReg) return "T1/2_S";
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
  const [uncontrolledBetaSimpleReg, setUncontrolledBetaSimpleReg] =
    useState(13);
  const [uncontrolledAlphaSimpleReg, setUncontrolledAlphaSimpleReg] =
    useState(0.1);
  const [uncontrolledK, setUncontrolledK] = useState(130);

  const [betaSimpleReg2, setBetaSimpleReg2] = useState(12);
  const [alphaSimpleReg2, setAlphaSimpleReg2] = useState(0.12);
  const [betaNAR2, setBetaNAR2] = useState(24);

  const calculatedK2 = betaSimpleReg2 / alphaSimpleReg2;
  const tHalfNAR2 = calculatedK2 / (2 * betaNAR2);
  const tHalfSimpleReg2 = Math.log(2) / alphaSimpleReg2;

  const calculatedUncontrolledK =
    uncontrolledBetaSimpleReg / uncontrolledAlphaSimpleReg;
  const uncontrolledTHalfNAR =
    calculatedUncontrolledK / (2 * uncontrolledBetaNAR);
  const uncontrolledTHalfSimpleReg = Math.log(2) / uncontrolledAlphaSimpleReg;

  const [betaNAR, setBetaNAR] = useState(24);
  const [betaSimpleReg, setBetaSimpleReg] = useState(12);
  const [alphaSimpleReg, setAlphaSimpleReg] = useState(0.1);

  const K = betaSimpleReg / alphaSimpleReg;
  const tHalfNAR = K / (2 * betaNAR);
  const tHalfSimpleReg = Math.log(2) / alphaSimpleReg;
  const ratio = tHalfNAR / tHalfSimpleReg;
  const percentFaster = ((tHalfSimpleReg - tHalfNAR) / tHalfNAR) * 100;

  const onChangeBetaSimpleReg = (value) => {
    const newK = value / alphaSimpleReg;
    const newBetaNAR = newK / (2 * tHalfNAR);
    setBetaSimpleReg(value);
    setBetaNAR(newBetaNAR);
  };

  const onChangeAlphaSimpleReg = (value) => {
    const newK = betaSimpleReg / value;
    const newBetaNAR = newK / (2 * tHalfNAR);
    setAlphaSimpleReg(value);
    setBetaNAR(newBetaNAR);
  };

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
              tex="X_{SR}(t) = X_{st} (1 - e^{-\alpha_{SR} t})"
            />
          </div>
          <p>
            where <MathFormula variant="small" tex="\alpha_{SR}" /> is the
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
              tex="T_{1/2_{SR}} = \dfrac{\ln(2)}{\alpha_{SR}}"
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
            <MathFormula tex="X_{st} = K = \dfrac{\beta_{SR}}{\alpha_{SR}}" />
          </div>
          <p>
            Try changing <MathFormula tex="K" /> and see what happens:
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
                max={25}
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
          <div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta_{NAR}" />: {betaNAR.toFixed(2)}
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
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\alpha_{simple}" />:{" "}
                {alphaSimpleReg.toFixed(2)}
              </label>
              <Slider
                value={[alphaSimpleReg]}
                onValueChange={(values) => onChangeAlphaSimpleReg(values[0])}
                min={0.1}
                max={0.25}
                step={0.01}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta_{simple}" />: {betaSimpleReg}
              </label>
              <Slider
                value={[betaSimpleReg]}
                onValueChange={(values) => onChangeBetaSimpleReg(values[0])}
                min={6}
                max={13}
                step={1}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="K = X_{st} = \dfrac{\beta_{simple}}{\alpha_{simple}}" />
                : {K.toFixed(2)}
              </label>
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="T_{1/2_{NAR}} = \dfrac{K}{2 \beta_{NAR}}" />:{" "}
                {tHalfNAR.toFixed(2)}
              </label>
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="T_{1/2_{simple}} = \dfrac{\ln(2)}{\alpha_{simple}}" />
                : {tHalfSimpleReg.toFixed(2)}
              </label>
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\text{Ratio} = \dfrac{T_{1/2_{NAR}}}{T_{1/2_{simple}}}" />
                : {`${ratio.toFixed(2)} (${percentFaster.toFixed(2)}% faster)`}
              </label>
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
