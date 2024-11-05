import React, { useState } from "react";
import {
  InlineCode,
  MathFormula,
  SlideDeck,
  Slider,
  Switch,
} from "../../components";
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
              <MathFormula variant="small" tex="n" /> = 1
            </InlineCode>
            , the Hill function for a repressor gradually reduces as the
            concentration of <MathFormula variant="small" tex="X^*" />{" "}
            increases, starting at the maximal expression,{" "}
            <MathFormula variant="small" tex="\beta" />, and going to zero
            &mdash; the opposite of the activator Hill function.
          </p>
          <p className="mt-4">
            Just like with the activator, however, half maximal expression is
            found at <MathFormula variant="small" tex="X^* = K" />.
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
            <MathFormula variant="small" tex="\beta" />,{" "}
            <MathFormula variant="small" tex="K" />, and{" "}
            <MathFormula variant="small" tex="n" /> to see how they affect the
            curve:
          </p>
          <div className="flex justify-between mt-6 w-11/12">
            <label className="flex-start mr-8">
              Show <MathFormula variant="small" tex="K" /> indicator:
            </label>
            <Switch
              checked={showKIndicator}
              onCheckedChange={(checked) => setShowKIndicator(checked)}
            />
          </div>
          <div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="\beta" />: {repressorBeta}
              </label>
              <Slider
                value={[repressorBeta]}
                onValueChange={(values) => setRepressorBeta(values[0])}
                min={0}
                max={20}
                step={0.1}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="K" />: {repressorK}
              </label>
              <Slider
                value={[repressorK]}
                onValueChange={(values) => setRepressorK(values[0])}
                min={1}
                max={10}
                step={0.1}
                className="w-11/12"
              />
            </div>
            <div className="mt-4">
              <label className="font-medium block mb-1.5">
                <MathFormula tex="n" />: {repressorN}
              </label>
              <Slider
                value={[repressorN]}
                onValueChange={(values) => setRepressorN(values[0])}
                min={1}
                max={4}
                step={0.1}
                className="w-11/12"
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
