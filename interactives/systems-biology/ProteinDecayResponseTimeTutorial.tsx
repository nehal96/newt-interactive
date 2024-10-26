import { useState } from "react";
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
  InlineCode,
  MathFormula,
  Popover,
  SlideDeck,
  Switch,
} from "../../components";
import { axisStyle } from "../../components";

const ExponentialDecayEquationPopoverContent = () => (
  <div className="flex flex-col text-md w-[350px] text-sm">
    <p className="mb-3">starting with:</p>
    <MathFormula variant="popover" tex="\dfrac{dY}{dt} = 0 - \alpha Y" />
    <p className="mt-6 mb-3">we can rearrange to:</p>
    <MathFormula
      variant="popover"
      tex="\dfrac{dY}{Y} = -\alpha \thinspace dt"
    />
    <p className="mt-6 mb-3">integrating both sides:</p>
    <MathFormula
      variant="popover"
      tex="\int \dfrac{dY}{Y} = \int -\alpha \thinspace dt"
    />
    <MathFormula
      className="mt-3"
      variant="popover"
      tex="\ln |Y| = -\alpha t + C"
    />
    <p className="mt-6 mb-3">
      we can expontiate both sides to solve for{" "}
      <MathFormula variant="popover" tex="Y" />:
    </p>
    <MathFormula variant="popover" tex="e^{\ln |Y|} = e^{-\alpha t + C}" />
    <MathFormula
      className="mt-3"
      variant="popover"
      tex="|Y| = e^{-\alpha t} \cdot e^C"
    />
    <p className="mt-6 mb-3">
      the constant <MathFormula variant="popover" tex="e^C" /> is the starting
      point of the decay, known as the initial condition. Since this is
      describing the decay of <MathFormula variant="popover" tex="Y" />, we can
      assume this to be the steady state concentration{" "}
      <MathFormula variant="popover" tex="Y_{st}" />.
    </p>
    <p className="mb-4">
      We can also remove the absolute value since the equation doesn't go below
      zero, giving us:
    </p>
    <MathFormula
      className="self-center outline outline-indigo-500 py-2 px-4"
      variant="popover"
      tex="Y(t) = Y_{st} e^{-\alpha t}"
    />
  </div>
);

const ResponseTimePopoverContent = () => (
  <div className="flex flex-col text-md w-[350px] text-sm">
    <p className="mb-3">starting with:</p>
    <MathFormula
      className="ml-6"
      variant="popover"
      tex="Y(t) = Y_{st} e^{-\alpha t} \qquad \text{where} \thickspace Y(t) = \dfrac{Y_{st}}{2}"
    />
    <p className="mt-6 mb-2">we get:</p>
    <MathFormula
      className="mt-3 ml-6"
      variant="popover"
      tex="\dfrac{Y_{st}}{2} = Y_{st} e^{-\alpha t}"
    />
    <p className="mt-6 mb-2">
      dividing both sides by <MathFormula variant="popover" tex="Y_{st}" />:
    </p>
    <MathFormula
      className="mt-3 ml-6"
      variant="popover"
      tex="\dfrac{1}{2} = e^{-\alpha t}"
    />
    <p className="mt-6 mb-2">
      taking the natural log of both sides to solve for{" "}
      <MathFormula variant="popover" tex="t" />:
    </p>
    <MathFormula
      className="mt-3 ml-6"
      variant="popover"
      tex="\ln \left( \dfrac{1}{2} \right) = \ln \left( e^{-\alpha t} \right)"
    />
    <MathFormula
      className="mt-3 ml-6"
      variant="popover"
      tex="\ln \left( \dfrac{1}{2} \right) = -\alpha t"
    />
    <MathFormula
      className="mt-3 ml-6"
      variant="popover"
      tex="t = \dfrac{\ln \left( \dfrac{1}{2} \right)}{-\alpha}"
    />
    <MathFormula
      className="mt-3 ml-6"
      variant="popover"
      tex="t = \dfrac{\ln 2}{\alpha}"
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

  const data = getProteinDecayResponseTimeData(alpha, steadyState);

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 110] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
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
  const [steadyState, setSteadyState] = useState(100);
  const [alpha, setAlpha] = useState(0.25);
  const [showHalfLifeIndicator, setShowHalfLifeIndicator] = useState(true);

  const slides = [
    {
      text: (
        <>
          <p>
            Starting with the equation{" "}
            <MathFormula
              variant="tutorial"
              className="text-sm md:text-base"
              tex="\dfrac{dY}{dt} = \beta - \alpha Y"
            />{" "}
            and setting <MathFormula variant="tutorial" tex="\beta = 0" />,{" "}
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
          <div className="flex flex-col justify-center mt-8 mb-8 mx-auto">
            <MathFormula
              variant="tutorial"
              tex="Y(t) = Y_{st} \thinspace e^{-\alpha t}"
            />
          </div>
          <p>
            which reveals that the concentration decays exponentially over time,
            as shown in the graph.
          </p>
        </>
      ),
      interactive: <ProteinDecayResponseTimeChart />,
    },
    {
      text: (
        <>
          <p>
            It's important to know how quickly{" "}
            <MathFormula variant="tutorial" tex="Y" /> levels decay in a cell.
            The measure for this is defined as the time it takes for the
            concentration to decay to half of its steady state value. This is
            known as the <strong>response time</strong>, and is denoted as{" "}
            <MathFormula variant="tutorial" tex="T_{1/2}" />.
          </p>
          <p className="mt-4">
            The halfway point for concentration that starts at{" "}
            <MathFormula variant="tutorial" tex="Y_{st}" /> and ends at{" "}
            <MathFormula variant="tutorial" tex="0" /> is{" "}
            <MathFormula variant="tutorial" tex="Y_{st}/2" />.{" "}
            <Popover
              trigger={
                <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
                  Using this in the previous formula we can find
                </span>
              }
              content={<ResponseTimePopoverContent />}
            />{" "}
            the formula for response time:
          </p>
          <div className="flex flex-col justify-center mt-4 mx-auto">
            <MathFormula
              variant="tutorial"
              tex="T_{1/2} = \dfrac{\ln(2)}{\alpha}"
            />
          </div>
        </>
      ),
      interactive: (
        <ProteinDecayResponseTimeChart
          chartOptions={{ showHalfLifeIndicator: true }}
        />
      ),
    },
    {
      text: (
        <>
          <div className="flex flex-col justify-center mb-4 mx-auto">
            <MathFormula
              variant="tutorial"
              tex="T_{1/2} = \dfrac{\ln(2)}{\alpha}"
            />
          </div>
          <p className="mt-4">
            As the formula shows, the response time for decay only depends on
            the removal rate <MathFormula variant="tutorial" tex="\alpha" />. A
            high removal rate means a fast decay, but it also means a high
            production rate to maintain the steady-state concentration.
          </p>
          <p className="mt-4">
            Quickly producing and quickly destroying proteins doesn't seem
            efficient, but it does give the cell the ability to adapt quickly,
            which we'll see is quite an important feature.
          </p>
        </>
      ),
      interactive: (
        <ProteinDecayResponseTimeChart
          chartOptions={{ showHalfLifeIndicator: true }}
        />
      ),
    },
    {
      text: (
        <>
          <p>
            Experiment with different values for the steady state concentration{" "}
            <MathFormula variant="tutorial" tex="Y_{st}" /> and the removal rate{" "}
            <MathFormula variant="tutorial" tex="\alpha" /> to see how they
            affect the protein decay curve and the response time.
          </p>
          <div className="flex justify-between mt-8 w-11/12">
            <label className="flex-start mr-8">Show half-life indicator:</label>
            <Switch
              checked={showHalfLifeIndicator}
              onCheckedChange={(checked) => setShowHalfLifeIndicator(checked)}
            />
          </div>
          <div>
            <div className="mt-4">
              <label
                htmlFor="steady-state-slider"
                className="font-medium block"
              >
                <MathFormula variant="tutorial" tex="Y_{st}" />: {steadyState}
              </label>
              <input
                type="range"
                id="steady-state-slider"
                min="20"
                max="100"
                step="1"
                value={steadyState}
                onChange={(e) => setSteadyState(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="alpha-slider" className="font-medium block">
                <MathFormula variant="tutorial" tex="\alpha" />:{" "}
                {alpha.toFixed(2)}
              </label>
              <input
                type="range"
                id="alpha-slider"
                min="0.1"
                max="1"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
          <p className="mt-4">
            Response time <MathFormula variant="tutorial" tex="T_{1/2}" />:{" "}
            <InlineCode className="ml-2" variant="medium">
              {(Math.log(2) / alpha).toFixed(2)}
            </InlineCode>
          </p>
        </>
      ),
      interactive: (
        <ProteinDecayResponseTimeChart
          steadyState={steadyState}
          alpha={alpha}
          chartOptions={{ showHalfLifeIndicator }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default ProteinDecayResponseTimeTutorial;
