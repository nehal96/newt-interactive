import React, { useState } from "react";
import {
  InlineCode,
  MathFormula,
  Popover,
  SlideDeck,
  Switch,
} from "../../components";
import { getActivatorHillFunctionData } from "./helpers";
import ActivatorGraph from "./ActivatorGraph";

interface ActivatorTutorialProps {
  initialActivatorBeta?: number;
  initialActivatorK?: number;
  initialActivatorN?: number;
}

const EquationPopoverContent = () => (
  <div className="flex flex-col text-md w-[350px]">
    <p className="mb-3">we have:</p>
    <div>
      <MathFormula
        variant="small"
        className="ml-6"
        tex="f(X^*) = \beta\dfrac{X^{*n}}{K^{n} + X^{*n}}"
      />
      , where <MathFormula variant="small" tex="X^* = K" />
    </div>
    <p className="mt-6 mb-3">so:</p>
    <MathFormula
      variant="small"
      className="ml-6"
      tex="f(K) = \beta\dfrac{X^{*n}}{X^{*n} + X^{*n}}"
    />
    <MathFormula
      className="ml-6 mt-3"
      variant="small"
      tex="f(K) = \beta\dfrac{\cancel{X^{*n}}}{2\cancel{X^{*n}}}"
    />
    <MathFormula
      variant="small"
      className="ml-6 mt-3"
      tex="f(K) = \dfrac{\beta}{2}"
    />
  </div>
);

export const ActivatorTutorial = ({
  initialActivatorBeta = 20,
  initialActivatorK = 5,
  initialActivatorN = 1,
}: ActivatorTutorialProps) => {
  const [activatorBeta, setActivatorBeta] = useState(initialActivatorBeta);
  const [activatorK, setActivatorK] = useState(initialActivatorK);
  const [activatorN, setActivatorN] = useState(initialActivatorN);

  const [showKIndicator, setShowKIndicator] = useState(true);

  const initialActivatorHillFunctionData = getActivatorHillFunctionData(
    initialActivatorBeta,
    initialActivatorK,
    initialActivatorN,
    0,
    20
  );
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
              <MathFormula variant="small" tex="n = 1" />
            </InlineCode>{" "}
            the curve looks something like this &mdash; a quick ascent, and then
            a gradual tapering off when the concentration gets very high,
            trending towards <MathFormula variant="small" tex="\beta" />.
          </p>
          <p>
            The Hill function gets saturated at high levels of{" "}
            <MathFormula variant="small" tex="X^*" />, so more{" "}
            <MathFormula variant="small" tex="X^*" /> leads to less and less
            additional proteins until it levels off at the maximum.
          </p>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={initialActivatorBeta}
          activatorK={initialActivatorK}
          activatorHillFunctionData={initialActivatorHillFunctionData}
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
              <MathFormula variant="small" tex="n" />
            </InlineCode>{" "}
            changes the shape of the curve. As it goes from 2 and then to 4, it
            gets more of an S-shape &mdash; a shape that comes with some
            interesting properties that we’ll explore in future posts.
          </p>
          <p>
            Notice also that there’s a steeper ascent, albeit with a little
            delay, and maximal activity{" "}
            <MathFormula variant="small" tex="\beta" /> is reached quicker.
          </p>
        </>
      ),
      interactive: (
        <ActivatorGraph
          activatorBeta={initialActivatorBeta}
          activatorK={initialActivatorK}
          activatorHillFunctionData={initialActivatorHillFunctionData}
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
            Play around with the values for{" "}
            <MathFormula variant="small" tex="\beta" />,{" "}
            <MathFormula variant="small" tex="K" />, and{" "}
            <MathFormula variant="small" tex="n" /> and see how it changes the
            curve.
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
            <div className="mt-4">
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
            You might notice, either from the curve or the{" "}
            <Popover
              trigger={
                <span className="underline decoration-indigo-500 decoration-2 underline-offset-[3px] hover:bg-indigo-100 cursor-pointer">
                  equation
                </span>
              }
              content={<EquationPopoverContent />}
              side="top"
              triggerOnHover={true}
            />
            , that half the maximal promoter activity,{" "}
            <MathFormula variant="small" tex="\beta / 2" />, occurs when{" "}
            <MathFormula variant="small" tex="X^* = K" />. (This halfway value
            will play an important role when we look at{" "}
            <strong>response time</strong> in the next post in the series).
          </p>
          <div className="flex justify-between mt-8 w-11/12">
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
            <div className="mt-4">
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
