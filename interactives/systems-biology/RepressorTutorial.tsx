import React, { useState } from "react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryScatter,
  VictoryLabel,
  VictoryContainer,
} from "victory";
import {
  axisStyle,
  getDottedLineStyle,
  getGridLineStyle,
  MathFormula,
  SlideDeck,
  Switch,
} from "../../components";
import { getRepressorHillFunctionData } from "./helpers";

interface RepressorGraphProps {
  repressorBeta: number;
  repressorK: number;
  repressorHillFunctionData: { x: number; y: number }[];
  chartOptions?: {
    showKIndicator?: boolean;
  };
}

interface RepressorTutorialProps {
  initialRepressorBeta?: number;
  initialRepressorK?: number;
  initialRepressorN?: number;
}

const RepressorGraph: React.FC<RepressorGraphProps> = ({
  repressorBeta,
  repressorK,
  repressorHillFunctionData,
  chartOptions = {
    showKIndicator: false,
  },
}) => {
  const dottedLineStyle = getDottedLineStyle();
  const gridLineStyle = getGridLineStyle();
  const noTicksStyle = {
    ...axisStyle,
    ticks: { ...axisStyle.ticks, size: 0 },
  };

  const { showKIndicator } = chartOptions;

  const XAxisStyle = showKIndicator ? axisStyle : noTicksStyle;
  const XAxisTickValues = showKIndicator ? [repressorK] : [];
  const XAxisTickFormat = showKIndicator ? () => "K" : () => "";
  const YAxisTickValues = showKIndicator
    ? [repressorBeta / 2, repressorBeta]
    : [repressorBeta];

  return (
    <VictoryChart
      domain={{ x: [0, 20], y: [0, 22] }}
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
          t == repressorBeta ? "β" : repressorBeta > 3.5 ? "β/2" : ""
        }
      />
      <VictoryLine
        style={gridLineStyle}
        data={[
          { x: 0.05, y: repressorBeta },
          { x: 20, y: repressorBeta },
        ]}
      />
      <VictoryLine
        style={{
          data: { stroke: "#3b82f6" },
          parent: { border: "1px solid #ccc" },
        }}
        data={repressorHillFunctionData}
        interpolation="basis"
      />
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: repressorK, y: 0 },
            { x: repressorK, y: repressorBeta / 2 },
          ]}
        />
      )}
      {showKIndicator && (
        <VictoryLine
          style={dottedLineStyle}
          data={[
            { x: 0, y: repressorBeta / 2 },
            { x: repressorK, y: repressorBeta / 2 },
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
              x: repressorK,
              y: repressorBeta / 2,
            },
          ]}
        />
      )}
    </VictoryChart>
  );
};

export const RepressorTutorial = ({
  initialRepressorBeta = 20,
  initialRepressorK = 5,
  initialRepressorN = 1,
}: RepressorTutorialProps) => {
  const [repressorBeta, setRepressorBeta] = useState(initialRepressorBeta);
  const [repressorK, setRepressorK] = useState(initialRepressorK);
  const [repressorN, setRepressorN] = useState(initialRepressorN);
  const [showKIndicator, setShowKIndicator] = useState(false);

  const repressorHillFunctionData = getRepressorHillFunctionData(
    repressorBeta,
    repressorK,
    repressorN,
    0,
    20
  );

  const slides = [
    {
      text: (
        <>
          <p>
            This is the repressor Hill function. Play around with the values for{" "}
            <MathFormula tex="\beta" />, <MathFormula tex="K" />, and{" "}
            <MathFormula tex="n" /> to see how they affect the curve.
          </p>
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {repressorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={repressorBeta}
                onChange={(e) => setRepressorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {repressorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="1"
                max="10"
                step="0.1"
                value={repressorK}
                onChange={(e) => setRepressorK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4 mb-6">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {repressorN}
              </label>
              <input
                type="range"
                id="n-slider"
                min="1"
                max="4"
                step="0.1"
                value={repressorN}
                onChange={(e) => setRepressorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="flex justify-between mb-6 w-11/12">
              <label className="flex-start mr-8">
                Show <MathFormula tex="K" /> indicator:
              </label>
              <Switch
                checked={showKIndicator}
                onCheckedChange={(checked) => setShowKIndicator(checked)}
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <RepressorGraph
          repressorBeta={repressorBeta}
          repressorK={repressorK}
          repressorHillFunctionData={repressorHillFunctionData}
          chartOptions={{
            showKIndicator,
          }}
        />
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};
