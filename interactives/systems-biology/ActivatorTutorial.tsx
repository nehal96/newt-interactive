import React, { useState } from "react";
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
  getGridLineStyle,
  InlineCode,
  MathFormula,
  SlideDeck,
  Switch,
} from "../../components";
import { getActivatorHillFunctionData } from "./helpers";

interface ActivatorGraphProps {
  activatorBeta: number;
  activatorK: number;
  activatorHillFunctionData: { x: number; y: number }[];
  chartOptions?: {
    showKIndicator?: boolean;
    showNComparisonCurves?: boolean;
  };
}

interface ActivatorTutorialProps {
  initialActivatorBeta?: number;
  initialActivatorK?: number;
  initialActivatorN?: number;
}

export const ActivatorGraph: React.FC<ActivatorGraphProps> = ({
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
  chartOptions = {
    showKIndicator: false,
    showNComparisonCurves: false,
  },
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const gridLineStyle = getGridLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  const XAxisStyle = chartOptions?.showKIndicator ? axisStyle : noTicksStyle;
  const XAxisTickValues = chartOptions?.showKIndicator ? [activatorK] : [];
  const XAxisTickFormat = chartOptions?.showKIndicator ? () => "K" : () => "";
  const YAxisTickValues = chartOptions?.showKIndicator
    ? [activatorBeta / 2, activatorBeta]
    : [activatorBeta];

  const { showKIndicator, showNComparisonCurves } = chartOptions;

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 22] }}
      domainPadding={{ x: showNComparisonCurves ? 40 : 0 }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="X*"
        style={XAxisStyle}
        tickValues={XAxisTickValues}
        tickFormat={XAxisTickFormat}
        axisLabelComponent={<VictoryLabel dy={-37} dx={190} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={YAxisTickValues}
        tickFormat={(t) =>
          t == activatorBeta ? "β" : activatorBeta > 3.5 ? "β/2" : ""
        }
      />
      {showNComparisonCurves && (
        <VictoryLine
          style={{
            data: { stroke: "#cbd5e1" },
            parent: { border: "1px solid #ccc" },
          }}
          data={getActivatorHillFunctionData(20, 5, 2)}
          interpolation="basis"
          labels={({ datum }) => (datum.x === 20 ? "n = 2" : "")}
          labelComponent={
            <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
          }
          animate={{
            onLoad: { duration: 1500 },
          }}
        />
      )}
      {showNComparisonCurves && (
        <VictoryLine
          style={{
            data: { stroke: "#cbd5e1" },
            parent: { border: "1px solid #ccc" },
          }}
          data={getActivatorHillFunctionData(20, 5, 4)}
          interpolation="basis"
          labels={({ datum }) => (datum.x === 20 ? "n = 4" : "")}
          labelComponent={
            <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
          }
          animate={{
            onLoad: { duration: 1500 },
          }}
        />
      )}
      <VictoryLine
        style={{
          data: { stroke: "#c43a31" },
          parent: { border: "1px solid #ccc" },
        }}
        data={activatorHillFunctionData}
        interpolation="basis"
      />
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0.05, y: activatorBeta },
          { x: 20, y: activatorBeta },
        ]}
      />
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: activatorK, y: 0 },
            { x: activatorK, y: activatorBeta / 2 },
          ]}
        />
      )}
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: 0, y: activatorBeta / 2 },
            { x: activatorK, y: activatorBeta / 2 },
          ]}
        />
      )}
      {showKIndicator && (
        <VictoryScatter
          style={{
            data: { stroke: "#1e293b", strokeWidth: 1, fill: "white" },
          }}
          size={4}
          data={[
            {
              x: activatorK,
              y: activatorBeta / 2,
            },
          ]}
        />
      )}
    </VictoryChart>
  );
};

export const ActivatorTutorial = ({
  initialActivatorBeta = 20,
  initialActivatorK = 5,
  initialActivatorN = 1,
}: ActivatorTutorialProps) => {
  const [activatorBeta, setActivatorBeta] = useState(initialActivatorBeta);
  const [activatorK, setActivatorK] = useState(initialActivatorK);
  const [activatorN, setActivatorN] = useState(initialActivatorN);

  const [showKIndicator, setShowKIndicator] = useState(true);

  const activatorHillFunctionData = getActivatorHillFunctionData(
    activatorBeta,
    activatorK,
    activatorN,
    0,
    20
  );

  const slides = [
    {
      text: (
        <>
          <p className="mb-4">
            When{" "}
            <InlineCode variant="medium">
              <MathFormula tex="n = 1" />
            </InlineCode>{" "}
            the curve looks something like this &mdash; a quick ascent, and then
            a gradual tapering off when the concentration gets very high.
          </p>
          <p>
            The saturation of the Hill function at high levels of{" "}
            <MathFormula tex="X^*" /> makes sense; the maximum probability of{" "}
            <MathFormula tex="X^*" /> binding to the promoter is 1, and so after
            a certain point, more <MathFormula tex="X^*" />
            doesn’t mean more proteins. In other words, protein production will
            eventually be bottle-necked by genes.
          </p>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={activatorBeta}
          activatorK={activatorK}
          activatorHillFunctionData={activatorHillFunctionData}
          chartOptions={{
            showKIndicator: false,
            showNComparisonCurves: false,
          }}
        />
      ),
    },
    {
      text: (
        <>
          <p className="mb-4">
            Changing{" "}
            <InlineCode variant="medium">
              <MathFormula tex="n" />
            </InlineCode>{" "}
            changes the shape of the curve. As it goes from 2 and then to 4, it
            starts looking more like an S-shape, a shape that comes with some
            interesting properties that we’ll explore in future lessons.
          </p>
          <p>
            Notice also that there’s a steeper ascent, and the saturation
            reaches closer to the maximal activity <MathFormula tex="\beta" />.
          </p>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={activatorBeta}
          activatorK={activatorK}
          activatorHillFunctionData={activatorHillFunctionData}
          chartOptions={{
            showKIndicator: false,
            showNComparisonCurves: true,
          }}
        />
      ),
    },
    {
      text: (
        <>
          <p>
            Play around with the values for <MathFormula tex="\beta" />,{" "}
            <MathFormula tex="K" />, and <MathFormula tex="n" /> and see how it
            changes the curve.
          </p>
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {activatorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={activatorBeta}
                onChange={(e) => setActivatorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {activatorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="1"
                max="10"
                step="0.1"
                value={activatorK}
                onChange={(e) => setActivatorK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4 mb-6">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {activatorN}
              </label>
              <input
                type="range"
                id="n-slider"
                min="1"
                max="4"
                step="0.1"
                value={activatorN}
                onChange={(e) => setActivatorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={activatorBeta}
          activatorK={activatorK}
          activatorHillFunctionData={activatorHillFunctionData}
          chartOptions={{
            showKIndicator: false,
            showNComparisonCurves: false,
          }}
        />
      ),
    },
    {
      text: (
        <>
          <p>
            You might notice, either from the curve or the equation, that half
            the maximal promoter activity,{" "}
            <MathFormula tex="\dfrac{\beta}{2}" />, occurs when{" "}
            <MathFormula tex="X^* = K" />. Play around with the sliders again to
            see how they remain the same:
          </p>
          <div className="flex justify-between mt-8 w-11/12">
            <label className="flex-start mr-8">
              Show <MathFormula tex="K" /> indicator:
            </label>
            <Switch
              checked={showKIndicator}
              onCheckedChange={(checked) => setShowKIndicator(checked)}
            />
          </div>
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {activatorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={activatorBeta}
                onChange={(e) => setActivatorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {activatorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="1"
                max="10"
                step="0.1"
                value={activatorK}
                onChange={(e) => setActivatorK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4 mb-6">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {activatorN}
              </label>
              <input
                type="range"
                id="n-slider"
                min="1"
                max="4"
                step="0.1"
                value={activatorN}
                onChange={(e) => setActivatorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={activatorBeta}
          activatorK={activatorK}
          activatorHillFunctionData={activatorHillFunctionData}
          chartOptions={{
            showKIndicator,
            showNComparisonCurves: false,
          }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
