import React from "react";
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

export const ActivatorGraph: React.FC<ActivatorGraphProps> = ({
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
  chartOptions,
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
          animate={{
            onLoad: { duration: 1500 },
          }}
        />
      )}
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: 0, y: activatorBeta / 2 },
            { x: activatorK, y: activatorBeta / 2 },
          ]}
          animate={{
            onLoad: { duration: 1500 },
          }}
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
  activatorBeta,
  activatorK,
  activatorHillFunctionData,
}: ActivatorGraphProps) => {
  const slides = [
    {
      text: (
        <>
          <p>
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
          <p>
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
  ];

  return <SlideDeck slides={slides} />;
};

export const RepressorGraph = ({
  repressorBeta,
  repressorK,
  repressorHillFunctionData,
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const gridLineStyle = getGridLineStyle();

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 22] }}
      containerComponent={<VictoryContainer responsive={true} />}
    >
      <VictoryAxis
        label="X*"
        style={axisStyle}
        tickValues={[repressorK]}
        tickFormat={() => "K"}
        axisLabelComponent={<VictoryLabel dy={-37} dx={190} />}
      />
      <VictoryAxis
        dependentAxis
        style={axisStyle}
        tickValues={[repressorBeta / 2, repressorBeta]}
        tickFormat={(t) =>
          t == repressorBeta ? "β" : repressorBeta > 3.5 ? "β/2" : ""
        }
      />
      <VictoryLine
        style={{
          data: { stroke: "#3b82f6" },
          parent: { border: "1px solid #ccc" },
        }}
        data={repressorHillFunctionData}
        interpolation="basis"
      />

      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: repressorK, y: 0 },
          { x: repressorK, y: repressorBeta / 2 },
        ]}
      />
      <VictoryLine
        style={dottedLineStyle}
        data={[
          { x: 0, y: repressorBeta / 2 },
          { x: repressorK, y: repressorBeta / 2 },
        ]}
      />
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0, y: repressorBeta },
          { x: 20, y: repressorBeta },
        ]}
      />
      <VictoryScatter
        style={{
          data: { stroke: "#1e293b", strokeWidth: 1, fill: "white" },
        }}
        size={4}
        data={[
          {
            x: repressorK,
            y: repressorBeta / 2,
          },
        ]}
      />
    </VictoryChart>
  );
};
