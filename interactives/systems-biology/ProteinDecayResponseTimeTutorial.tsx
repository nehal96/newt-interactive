import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLine,
} from "victory";
import { MathFormula, Popover, SlideDeck } from "../../components";
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

const ProteinDecayResponseTimeChart = () => {
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

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
      <VictoryAxis style={noTicksStyle} tickValues={[]} tickFormat={() => ""} />
      <VictoryAxis
        dependentAxis
        style={noTicksStyle}
        tickValues={[]}
        tickFormat={() => ""}
      />
      <VictoryLine
        style={{
          data: { stroke: "#2dd4bf" },
          parent: { border: "1px solid #ccc" },
        }}
        data={data}
        interpolation="basis"
      />
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
  ];

  return <SlideDeck slides={slides} />;
};

export default ProteinDecayResponseTimeTutorial;
