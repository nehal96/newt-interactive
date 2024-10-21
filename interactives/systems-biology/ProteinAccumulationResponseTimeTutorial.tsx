import {
  VictoryAxis,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
  VictoryScatter,
} from "victory";
import {
  axisStyle,
  getDottedLineStyle,
  MathFormula,
  Popover,
  SlideDeck,
} from "../../components";

const ProteinAccumulationEquationPopoverContent = () => (
  <div className="flex flex-col text-md w-[350px] text-sm">
    <p>starting with</p>
    <MathFormula
      className="ml-6 mt-3"
      tex="\dfrac{dY}{dt} = \beta - \alpha Y"
    />
    <p className="mt-6">we can rearrange to</p>
    <MathFormula
      className="ml-6 mt-3"
      tex="\dfrac{dY}{dt} + \alpha Y = \beta"
    />
    <p className="mt-6">
      to integrate both sides, let's first define an integrating factor:
    </p>
    <MathFormula
      className="ml-6 mt-3"
      tex="\mu(t) = e^{\int \alpha \thinspace dt} = e^{\alpha t}"
    />
    <p className="mt-6">then multiply both sides by the integrating factor:</p>
    <MathFormula
      className="ml-6 mt-3"
      tex="e^{\alpha t} \dfrac{dY}{dt} + \alpha e^{\alpha t} Y = \beta e^{\alpha t}"
    />
    <p className="mt-6">
      the left-hand side can now be expressed as the derivative of the product:
    </p>
    <MathFormula
      className="ml-6 mt-3"
      tex="\dfrac{d}{dt} (e^{\alpha t} Y) = \beta e^{\alpha t}"
    />
    <p className="mt-6">
      integrating both sides with respect to <MathFormula tex="t" />:
    </p>
    <MathFormula
      className="ml-6 mt-3"
      tex="\int \dfrac{d}{dt} (e^{\alpha t} Y) \thinspace dt = \int \beta e^{\alpha t} \thinspace dt"
    />
    <MathFormula
      className="ml-6 mt-3"
      tex="e^{\alpha t} Y = \int \beta e^{\alpha t} \thinspace dt"
    />
    <MathFormula
      className="ml-6 mt-3"
      tex="e^{\alpha t} Y = \dfrac{\beta}{\alpha} e^{\alpha t} + C"
    />
    <p className="mt-6">
      now, we can solve for <MathFormula tex="Y" />. dividing both sides by{" "}
      <MathFormula tex="e^{\alpha t}" />:
    </p>
    <MathFormula
      className="ml-6 mt-3"
      tex="Y = \dfrac{\beta}{\alpha} + C e^{-\alpha t}"
    />
    <p className="mt-6">
      recollect that <MathFormula tex="\dfrac{\beta}{\alpha}" /> is the steady
      state value <MathFormula tex="Y_{st}" />. The second term describes the
      exponential decay of <MathFormula tex="Y" />, so the constant{" "}
      <MathFormula tex="C" /> is the starting point of the decay, or{" "}
      <MathFormula tex="Y_{st}" />. Since it represents decay, the term is
      negative. So, we get:
    </p>
    <MathFormula
      className="ml-6 mt-3"
      tex="Y(t) = Y_{st} - Y_{st} e^{-\alpha t}"
    />
    <p className="mt-6">which evaluates to:</p>
    <MathFormula
      className="self-center outline outline-indigo-500 py-2 px-4 ml-6 mt-3"
      tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t})"
    />
  </div>
);

const ProteinAccumulationResponseTimePopoverContent = () => (
  <div className="flex flex-col text-md w-[350px] text-sm">
    <p className="mb-3">starting with:</p>
    <MathFormula
      className="ml-6 mt-3"
      tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t}) \qquad \text{where} \thickspace Y(t) = \dfrac{Y_{st}}{2}"
    />
    <p className="mt-6 mb-2">we get:</p>
    <MathFormula
      className="mt-3 ml-6"
      tex="\dfrac{Y_{st}}{2} = Y_{st} \thinspace (1 - e^{-\alpha t})"
    />
    <p className="mt-6 mb-2">
      dividing both sides by <MathFormula tex="Y_{st}" />:
    </p>
    <MathFormula className="mt-3 ml-6" tex="\dfrac{1}{2} = 1 - e^{-\alpha t}" />
    <MathFormula className="mt-3 ml-6" tex="e^{-\alpha t} = \dfrac{1}{2}" />
    <p className="mt-6 mb-2">taking the natural log of both sides:</p>
    <MathFormula
      className="mt-3 ml-6"
      tex="\ln \left( e^{-\alpha t} \right) = \ln \left( \dfrac{1}{2} \right)"
    />
    <MathFormula
      className="mt-3 ml-6"
      tex="-\alpha t = \ln \left( \dfrac{1}{2} \right)"
    />
    <MathFormula className="mt-3 ml-6" tex="-\alpha t = - \ln (2)" />
    <MathFormula className="mt-3 ml-6" tex="t = \dfrac{\ln (2)}{\alpha}" />
    <p className="mt-6">therefore:</p>
    <MathFormula
      className="self-center outline outline-indigo-500 py-2 px-4 ml-6 mt-3"
      tex="T_{1/2} = \dfrac{\ln (2)}{\alpha}"
    />
  </div>
);

const ProteinAccumulationResponseTimeChart = ({
  steadyState = 100,
  alpha = 0.25,
  chartOptions = {
    showHalfLifeIndicator: false,
  },
}) => {
  const { showHalfLifeIndicator } = chartOptions;

  const dottedLineStyle = getDottedLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  const XAxisStyle = showHalfLifeIndicator ? axisStyle : noTicksStyle;
  const XAxisTickValues = showHalfLifeIndicator ? [Math.log(2) / alpha] : [];
  const XAxisTickFormat = showHalfLifeIndicator ? () => "T 1/2" : () => "";
  const YAxisTickValues = showHalfLifeIndicator
    ? [steadyState / 2, steadyState]
    : [steadyState];
  const YAxisTickFormat = showHalfLifeIndicator
    ? (t) => (t === steadyState / 2 ? "Y_st/2" : "Y_st")
    : (t) => (t === steadyState ? "Y_st" : "");

  const proteinAccumulationFunction = (t, alpha = 0.25, steadyState = 100) => {
    return steadyState * (1 - Math.exp(-alpha * t));
  };

  const getProteinAccumulationData = (
    alpha = 0.25,
    steadyState = 100,
    domainMin = 0,
    domainMax = 20
  ) => {
    const data = [];

    for (let t = domainMin; t <= domainMax; t++) {
      const y = proteinAccumulationFunction(t, alpha, steadyState);
      data.push({ x: t, y });
    }

    return data;
  };

  const data = getProteinAccumulationData();

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

const ProteinAccumulationResponseTimeTutorial = () => {
  const slides = [
    {
      text: (
        <>
          <p>
            Again, starting with the equation{" "}
            <MathFormula tex="\dfrac{dY}{dt} = \beta - \alpha Y" /> (but keeping{" "}
            <MathFormula tex="\beta" /> as is this time),{" "}
            <Popover
              trigger={
                <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
                  we can work our way
                </span>
              }
              content={<ProteinAccumulationEquationPopoverContent />}
              side="top"
              triggerOnHover={true}
            />{" "}
            to the following equation:
          </p>
          <div className="flex flex-col justify-center mt-8 mb-8 mx-auto">
            <MathFormula tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t})" />
          </div>
          <p>
            which describes how protein concentration <MathFormula tex="Y" />
            rises quickly at first, and then gradually converges to the steady
            state <MathFormula tex="Y_{st}" />, as shown in the graph.
          </p>
        </>
      ),
      interactive: <ProteinAccumulationResponseTimeChart />,
    },
    {
      text: (
        <>
          <p>
            Using this equation,{" "}
            <Popover
              trigger={
                <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
                  we can similarly find
                </span>
              }
              content={<ProteinAccumulationResponseTimePopoverContent />}
            />{" "}
            the response time:
          </p>
          <div className="flex flex-col justify-center my-8 mx-auto">
            <MathFormula tex="T_{1/2} = \dfrac{\ln 2}{\alpha}" />
          </div>
          <p>
            which, as it turns out, is exactly the same as the decay response
            time. Both scenarios &mdash; increasing and decreasing protein
            levels &mdash; only depend on the removal rate{" "}
            <MathFormula tex="\alpha" />.
          </p>
        </>
      ),
      interactive: (
        <ProteinAccumulationResponseTimeChart
          chartOptions={{
            showHalfLifeIndicator: true,
          }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default ProteinAccumulationResponseTimeTutorial;
