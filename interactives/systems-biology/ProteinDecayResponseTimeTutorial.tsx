import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from "victory";
import {
  getDottedLineStyle,
  MathFormula,
  Popover,
  SlideDeck,
} from "../../components";
import { axisStyle } from "../../components";

const ExponentialDecayEquationPopoverContent = () => (
  <div className="flex flex-col text-md w-[350px] text-sm">
    <p className="mb-3">starting with:</p>
    <MathFormula tex="\dfrac{dY}{dt} = 0 - \alpha Y" />
    <p className="mt-6 mb-3">we can rearrange to:</p>
    <MathFormula tex="\dfrac{dY}{Y} = -\alpha \thinspace dt" />
    <p className="mt-6 mb-3">integrating both sides:</p>
    <MathFormula tex="\int \dfrac{dY}{Y} = \int -\alpha \thinspace dt" />
    <MathFormula className="mt-3" tex="\ln |Y| = -\alpha t + C" />
    <p className="mt-6 mb-3">
      we can expontiate both sides to solve for <MathFormula tex="Y" />:
    </p>
    <MathFormula tex="e^{\ln |Y|} = e^{-\alpha t + C}" />
    <MathFormula className="mt-3" tex="|Y| = e^{-\alpha t} \cdot e^C" />
    <p className="mt-6 mb-3">
      the constant <MathFormula tex="e^C" /> is the starting point of the decay,
      known as the initial condition. Since this is describing the decay of{" "}
      <MathFormula tex="Y" />, we can assume this to be the steady state
      concentration <MathFormula tex="Y_{st}" />.
    </p>
    <p className="mb-4">
      We can also remove the absolute value since the equation doesn't go below
      zero, giving us:
    </p>
    <MathFormula
      className="self-center outline outline-indigo-500 py-2 px-4"
      tex="Y(t) = Y_{st} e^{-\alpha t}"
    />
  </div>
);

const ProteinDecayResponseTimeChart = ({
  steadyState = 100,
  alpha = 0.25,
  chartOptions = {
    showHalfLifeIndicator: false,
  },
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  const XAxisStyle = chartOptions?.showHalfLifeIndicator
    ? axisStyle
    : noTicksStyle;
  const XAxisTickValues = chartOptions?.showHalfLifeIndicator
    ? [Math.log(2) / alpha]
    : [];
  const XAxisTickFormat = chartOptions?.showHalfLifeIndicator
    ? () => "T 1/2"
    : () => "";
  const YAxisTickValues = chartOptions?.showHalfLifeIndicator
    ? [steadyState / 2, steadyState]
    : [steadyState];
  const YAxisTickFormat = chartOptions?.showHalfLifeIndicator
    ? (t) => (t === steadyState / 2 ? "Y_st/2" : "Y_st")
    : (t) => (t === steadyState ? "Y_st" : "");

  const { showHalfLifeIndicator } = chartOptions;

  const proteinDecayResponseTimeFunction = (t, alpha = 2, steadyState = 10) => {
    return steadyState * Math.exp(-alpha * t);
  };

  const getProteinDecayResponseTimeData = (
    alpha = 0.25,
    steadyState = 100,
    domainMin = 0,
    domainMax = 20
  ) => {
    const data = [];

    for (let t = domainMin; t <= domainMax; t++) {
      const y = proteinDecayResponseTimeFunction(t, alpha, steadyState);
      data.push({ x: t, y });
    }

    return data;
  };

  const data = getProteinDecayResponseTimeData();

  return (
    <VictoryChart containerComponent={<VictoryContainer responsive={true} />}>
      <VictoryAxis
        label="time"
        style={XAxisStyle}
        tickValues={XAxisTickValues}
        tickFormat={XAxisTickFormat}
        axisLabelComponent={<VictoryLabel dy={-39} dx={195} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={YAxisTickValues}
        tickFormat={YAxisTickFormat}
      />
      <VictoryLine
        style={{
          data: { stroke: "#2dd4bf" },
          parent: { border: "1px solid #ccc" },
        }}
        data={data}
        interpolation="basis"
      />
      {showHalfLifeIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: Math.log(2) / alpha, y: 0 },
            { x: Math.log(2) / alpha, y: steadyState / 2 },
          ]}
        />
      )}
      {showHalfLifeIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: 0, y: steadyState / 2 },
            { x: Math.log(2) / alpha, y: steadyState / 2 },
          ]}
        />
      )}
      {showHalfLifeIndicator && (
        <VictoryScatter
          style={{
            data: { stroke: "#1e293b", strokeWidth: 1, fill: "white" },
          }}
          size={4}
          data={[{ x: Math.log(2) / alpha, y: steadyState / 2 }]}
        />
      )}
    </VictoryChart>
  );
};

export const ProteinDecayResponseTimeTutorial = () => {
  const slides = [
    {
      text: (
        <>
          <p>
            Starting with the equation{" "}
            <MathFormula
              className="text-lg"
              tex="\dfrac{dY}{dt} = \beta - \alpha Y"
            />{" "}
            and setting <MathFormula className="text-lg" tex="\beta = 0" />,{" "}
            <Popover
              trigger={
                <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
                  we can work our way
                </span>
              }
              content={<ExponentialDecayEquationPopoverContent />}
              side="top"
              triggerOnHover={true}
            />{" "}
            to the following equation:
          </p>
          <div className="flex flex-col justify-center mt-4 mb-12 mx-auto">
            <MathFormula
              className="text-lg"
              tex="Y(t) = Y_{st} e^{-\alpha t}"
            />
          </div>
          <p>
            which describes the exponential decay of concentration{" "}
            <MathFormula className="text-lg" tex="Y" /> over time, as shown in
            the graph. <MathFormula className="text-lg" tex="Y_{st}" /> is the
            steady state concentration.
          </p>
        </>
      ),
      interactive: <ProteinDecayResponseTimeChart />,
    },
    {
      text: (
        <>
          <p>
            The time it takes for the concentration to decay to half of its
            steady state value is known as the half-life, or{" "}
            <MathFormula className="text-lg" tex="T_{1/2}" />.
          </p>
        </>
      ),
      interactive: (
        <ProteinDecayResponseTimeChart
          chartOptions={{ showHalfLifeIndicator: true }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default ProteinDecayResponseTimeTutorial;
