import { useState } from "react";
import { MathFormula, InlineCode } from "../../components";
import { GaussianNameProps, PlaygroundProps } from "./types";

export const GaussianName = ({ name }: GaussianNameProps) => {
  const getStyle = () => {
    switch (name) {
      case "Prior":
        return "bg-indigo-200 text-indigo-800";
      case "Measurement":
        return "bg-emerald-100 text-emerald-800";
      case "Posterior":
        return "bg-sky-200 text-sky-900";
    }
  };
  return (
    <span className={`py-1 px-2 rounded-md font-medium ${getStyle()}`}>
      {name}
    </span>
  );
};

export const Playground = ({
  gaussianParams,
  setGaussianParams,
}: PlaygroundProps) => {
  const [showParamMeanings, setShowParamMeanings] = useState(false);

  const {
    priorMean,
    priorSigma,
    measurementMean,
    measurementSigma,
    posteriorMean,
    posteriorSigma,
  } = gaussianParams;

  return (
    <>
      <div className="self-end text-xs flex align-middle">
        <input
          type="checkbox"
          checked={showParamMeanings}
          onChange={() => setShowParamMeanings(!showParamMeanings)}
        />
        <label className="ml-1">Show parameter meanings</label>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <MathFormula tex="\mu = " />
          <input
            className="px-2 py-1 border border-slate-400 rounded-md ml-2 w-20"
            defaultValue={priorMean}
            type="number"
            onChange={(e) =>
              setGaussianParams({
                ...gaussianParams,
                priorMean: Number(e.target.value),
              })
            }
            min={0}
          />
        </div>
        {showParamMeanings ? (
          <span className="text-xs text-slate-600">
            <GaussianName name="Prior" /> mean
          </span>
        ) : null}
      </div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <MathFormula tex="\sigma^2 =" />
          <input
            className="px-2 py-1 border border-slate-400 rounded-md ml-2 w-20"
            defaultValue={priorSigma}
            type="number"
            onChange={(e) =>
              setGaussianParams({
                ...gaussianParams,
                priorSigma: Number(e.target.value),
              })
            }
            min={1}
          />
        </div>
        {showParamMeanings ? (
          <span className="text-xs text-slate-600">
            <GaussianName name="Prior" /> covariance
          </span>
        ) : null}
      </div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <MathFormula tex="\nu = " />
          <input
            className="px-2 py-1 border border-slate-400 rounded-md ml-2 w-20"
            defaultValue={measurementMean}
            type="number"
            onChange={(e) =>
              setGaussianParams({
                ...gaussianParams,
                measurementMean: Number(e.target.value),
              })
            }
            min={0}
          />
        </div>
        {showParamMeanings ? (
          <span className="text-xs text-slate-600">
            <GaussianName name="Measurement" /> mean
          </span>
        ) : null}
      </div>
      <div className="mb-10 flex justify-between items-center">
        <div>
          <MathFormula tex="r^2 = " />
          <input
            className="px-2 py-1 border border-slate-400 rounded-md ml-2 w-20"
            defaultValue={measurementSigma}
            type="number"
            onChange={(e) =>
              setGaussianParams({
                ...gaussianParams,
                measurementSigma: Number(e.target.value),
              })
            }
            min={1}
          />
        </div>
        {showParamMeanings ? (
          <span className="text-xs text-slate-600">
            <GaussianName name="Measurement" /> covariance
          </span>
        ) : null}
      </div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <MathFormula tex="\mu' =" />
          <InlineCode variant="medium" className="ml-2">
            {posteriorMean.toFixed(2)}
          </InlineCode>
        </div>
        {showParamMeanings ? (
          <span className="text-xs text-slate-600">
            <GaussianName name="Posterior" /> mean
          </span>
        ) : null}
      </div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <MathFormula tex="\sigma^{2'} =" />
          <InlineCode variant="medium" className="ml-2">
            {posteriorSigma.toFixed(2)}
          </InlineCode>
        </div>
        {showParamMeanings ? (
          <span className="text-xs text-slate-600">
            <GaussianName name="Posterior" /> covariance
          </span>
        ) : null}
      </div>
    </>
  );
};
