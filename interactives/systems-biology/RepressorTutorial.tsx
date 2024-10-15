import React, { useState } from "react";
import { InlineCode, MathFormula, SlideDeck, Switch } from "../../components";
import RepressorGraph from "./RepressorGraph";
import { getRepressorHillFunctionData } from "./helpers";

interface RepressorTutorialProps {
  initialRepressorBeta?: number;
  initialRepressorK?: number;
  initialRepressorN?: number;
}



export const RepressorTutorial = ({
  initialRepressorBeta = 20,
  initialRepressorK = 5,
  initialRepressorN = 1,
}: RepressorTutorialProps) => {
  const [repressorBeta, setRepressorBeta] = useState(initialRepressorBeta);
  const [repressorK, setRepressorK] = useState(initialRepressorK);
  const [repressorN, setRepressorN] = useState(initialRepressorN);
  const [showKIndicator, setShowKIndicator] = useState(false);

  const initialRepressorHillFunctionData = getRepressorHillFunctionData(
    initialRepressorBeta,
    initialRepressorK,
    initialRepressorN,
    0,
    20
  );
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
            When{" "}
            <InlineCode variant="medium">
              <MathFormula tex="n" /> = 1
            </InlineCode>
            , the Hill function for a repressor gradually reduces as the
            concentration of <MathFormula tex="X^*" /> increases, starting at
            the maximal expression, <MathFormula tex="\beta" />, and going to
            zero &mdash; the opposite of the activator Hill function.
          </p>
          <p className="mt-4">
            Just like with the activator, however, half maximal expression is
            found at <MathFormula tex="X^* = K" />.
          </p>
        </>
      ),
      interactive: (
        <RepressorGraph
          repressorBeta={initialRepressorBeta}
          repressorK={initialRepressorK}
          repressorHillFunctionData={initialRepressorHillFunctionData}
          chartOptions={{
            showKIndicator,
          }}
        />
      ),
    },
    {
      text: (
        <>
          <p>
            Feel free to play around with the values for{" "}
            <MathFormula tex="\beta" />, <MathFormula tex="K" />, and{" "}
            <MathFormula tex="n" /> to see how they affect the curve:
          </p>
          <div className="flex justify-between mt-6 w-11/12">
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
            <div className="mt-4">
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
