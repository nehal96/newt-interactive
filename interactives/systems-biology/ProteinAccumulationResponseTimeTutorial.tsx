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
  axisStyle,
  getDottedLineStyle,
  InlineCode,
  MathFormula,
  Popover,
  SlideDeck,
  Switch,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "../../components";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const ProteinAccumulationEquationSheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
        we can work our way
      </span>
    </SheetTrigger>
    <SheetContent>
      <VisuallyHidden>
        <SheetTitle>Protein Accumulation Equation</SheetTitle>
      </VisuallyHidden>
      <div className="flex flex-col text-md text-sm">
        <p>starting with</p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="\dfrac{dY}{dt} = \beta - \alpha Y"
        />
        <p className="mt-6">we can rearrange to</p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="\dfrac{dY}{dt} + \alpha Y = \beta"
        />
        <p className="mt-6">
          to integrate both sides, let's first define an integrating factor:
        </p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="\mu(t) = e^{\int \alpha \thinspace dt} = e^{\alpha t}"
        />
        <p className="mt-6">
          then multiply both sides by the integrating factor:
        </p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="e^{\alpha t} \dfrac{dY}{dt} + \alpha e^{\alpha t} Y = \beta e^{\alpha t}"
        />
        <p className="mt-6">
          the left-hand side can now be expressed as the derivative of the
          product:
        </p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="\dfrac{d}{dt} (e^{\alpha t} Y) = \beta e^{\alpha t}"
        />
        <p className="mt-6">
          integrating both sides with respect to <MathFormula tex="t" />:
        </p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="\int \dfrac{d}{dt} (e^{\alpha t} Y) \thinspace dt = \int \beta e^{\alpha t} \thinspace dt"
        />
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="e^{\alpha t} Y = \int \beta e^{\alpha t} \thinspace dt"
        />
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="e^{\alpha t} Y = \dfrac{\beta}{\alpha} e^{\alpha t} + C"
        />
        <p className="mt-6">
          now, we can solve for <MathFormula variant="popover" tex="Y" />.
          dividing both sides by{" "}
          <MathFormula variant="popover" tex="e^{\alpha t}" />:
        </p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="Y = \dfrac{\beta}{\alpha} + C e^{-\alpha t}"
        />
        <p className="mt-6">
          recollect that{" "}
          <MathFormula variant="popover" tex="\dfrac{\beta}{\alpha}" /> is the
          steady state value <MathFormula variant="popover" tex="Y_{st}" />. The
          second term describes the exponential decay of{" "}
          <MathFormula variant="popover" tex="Y" />, so the constant{" "}
          <MathFormula variant="popover" tex="C" /> is the starting point of the
          decay, or <MathFormula variant="popover" tex="Y_{st}" />. Since it
          represents decay, the term is negative. So, we get:
        </p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="Y(t) = Y_{st} - Y_{st} e^{-\alpha t}"
        />
        <p className="mt-6">which evaluates to:</p>
        <MathFormula
          variant="popover"
          className="self-center outline outline-indigo-500 py-2 px-4 ml-6 mt-3"
          tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t})"
        />
      </div>
    </SheetContent>
  </Sheet>
);

const ProteinAccumulationResponseTimeSheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
        we can similarly find
      </span>
    </SheetTrigger>
    <SheetContent>
      <VisuallyHidden>
        <SheetTitle>Protein Accumulation Response Time Equation</SheetTitle>
      </VisuallyHidden>
      <div className="flex flex-col text-md text-sm">
        <p className="mb-3">starting with:</p>
        <MathFormula
          variant="popover"
          className="ml-6 mt-3"
          tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t}) \qquad \text{where} \thickspace Y(t) = \dfrac{Y_{st}}{2}"
        />
        <p className="mt-6 mb-2">we get:</p>
        <MathFormula
          variant="popover"
          className="mt-3 ml-6"
          tex="\dfrac{Y_{st}}{2} = Y_{st} \thinspace (1 - e^{-\alpha t})"
        />
        <p className="mt-6 mb-2">
          dividing both sides by <MathFormula variant="popover" tex="Y_{st}" />:
        </p>
        <MathFormula
          variant="popover"
          className="mt-3 ml-6"
          tex="\dfrac{1}{2} = 1 - e^{-\alpha t}"
        />
        <MathFormula
          variant="popover"
          className="mt-3 ml-6"
          tex="e^{-\alpha t} = \dfrac{1}{2}"
        />
        <p className="mt-6 mb-2">taking the natural log of both sides:</p>
        <MathFormula
          variant="popover"
          className="mt-3 ml-6"
          tex="\ln \left( e^{-\alpha t} \right) = \ln \left( \dfrac{1}{2} \right)"
        />
        <MathFormula
          variant="popover"
          className="mt-3 ml-6"
          tex="-\alpha t = \ln \left( \dfrac{1}{2} \right)"
        />
        <MathFormula
          variant="popover"
          className="mt-3 ml-6"
          tex="-\alpha t = - \ln (2)"
        />
        <MathFormula
          variant="popover"
          className="mt-3 ml-6"
          tex="t = \dfrac{\ln (2)}{\alpha}"
        />
        <p className="mt-6">therefore:</p>
        <MathFormula
          variant="popover"
          className="self-center outline outline-indigo-500 py-2 px-4 ml-6 mt-3"
          tex="T_{1/2} = \dfrac{\ln (2)}{\alpha}"
        />
      </div>
    </SheetContent>
  </Sheet>
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

  const data = getProteinAccumulationData(alpha, steadyState);

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

const ProteinAccumulationResponseTimeTutorial = () => {
  const [steadyState, setSteadyState] = useState(100);
  const [alpha, setAlpha] = useState(0.25);
  const [showHalfLifeIndicator, setShowHalfLifeIndicator] = useState(true);

  const slides = [
    {
      text: (
        <>
          <p>
            Again, starting with the equation{" "}
            <MathFormula
              variant="tutorial"
              className="text-sm md:text-base"
              tex="\dfrac{dY}{dt} = \beta - \alpha Y"
            />{" "}
            (but keeping <MathFormula variant="tutorial" tex="\beta" /> as is
            this time), <ProteinAccumulationEquationSheet /> to the following
            equation:
          </p>
          <div className="flex flex-col justify-center mt-8 mb-8 mx-auto">
            <MathFormula
              variant="tutorial"
              tex="Y(t) = Y_{st} \thinspace (1 - e^{-\alpha t})"
            />
          </div>
          <p>
            which describes how protein concentration{" "}
            <MathFormula variant="tutorial" tex="Y" />
            rises quickly at first, and then gradually converges to the steady
            state <MathFormula variant="tutorial" tex="Y_{st}" />, as shown in
            the graph.
          </p>
        </>
      ),
      interactive: <ProteinAccumulationResponseTimeChart />,
    },
    {
      text: (
        <>
          <p>
            Using this equation, <ProteinAccumulationResponseTimeSheet /> the
            response time:
          </p>
          <div className="flex flex-col justify-center my-8 mx-auto">
            <MathFormula
              variant="tutorial"
              tex="T_{1/2} = \dfrac{\ln 2}{\alpha}"
            />
          </div>
          <p>
            which, as it turns out, is exactly the same as the decay response
            time. Both scenarios &mdash; increasing and decreasing protein
            levels &mdash; only depend on the removal rate{" "}
            <MathFormula variant="tutorial" tex="\alpha" />.
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
    {
      text: (
        <>
          <p>
            Experiment with different values for the steady state concentration{" "}
            <MathFormula variant="tutorial" tex="Y_{st}" /> and the removal rate{" "}
            <MathFormula variant="tutorial" tex="\alpha" /> to see how they
            affect the protein accumulation curve and the response time.
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
                <MathFormula tex="Y_{st}" />: {steadyState}
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
                <MathFormula tex="\alpha" />: {alpha.toFixed(2)}
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
            Response time <MathFormula tex="T_{1/2}" />:{" "}
            <InlineCode className="ml-2" variant="medium">
              {(Math.log(2) / alpha).toFixed(2)}
            </InlineCode>
          </p>
        </>
      ),
      interactive: (
        <ProteinAccumulationResponseTimeChart
          steadyState={steadyState}
          alpha={alpha}
          chartOptions={{ showHalfLifeIndicator }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default ProteinAccumulationResponseTimeTutorial;
