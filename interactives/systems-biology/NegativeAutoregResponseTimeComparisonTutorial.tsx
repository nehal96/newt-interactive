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
  MathFormula,
  SlideDeck,
  Slider,
} from "../../components";

export const NegativeAutoregResponseTimeComparisonChart = ({
  steadyState = 100,
  betaNAR = 12,
  alphaSimpleReg = 0.25,
  tHalfNAR = 10,
  tHalfSimpleReg = 4,
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };
  const XAxisTickValues = [tHalfNAR, tHalfSimpleReg];

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
        tickValues={[steadyState / 2, steadyState]}
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
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: 0, y: steadyState / 2 },
          { x: tHalfSimpleReg, y: steadyState / 2 },
        ]}
      />
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: tHalfNAR, y: steadyState / 2 },
          { x: tHalfNAR, y: 0 },
        ]}
      />
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: tHalfSimpleReg, y: steadyState / 2 },
          { x: tHalfSimpleReg, y: 0 },
        ]}
      />
    </VictoryChart>
  );
};

export const NegativeAutoregResponseTimeComparisonTutorial = () => {
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
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
