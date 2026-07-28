import { useState } from "react";
import { Button } from "@ui/controls";
import { TextContainer } from "@ui/layout";
import { InlineCode } from "@ui/prose/Code";
import MathFormula from "@ui/prose/MathFormula";
import { SlideNav } from "@viz/slides";
import styles from "./styles.module.css";
import {
  GaussianNameProps,
  GaussianParamterUpdateSlidesProps,
  PlaygroundProps,
  Section,
} from "./types";

const SECTIONS = [
  { value: "overview", label: "Overview" },
  { value: "calculations", label: "Calculations" },
  { value: "playground", label: "Playground" },
];

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

const GaussianParameterUpdateSlides = ({
  slide,
  slideNumber,
  totalSlides,
  onBack,
  onNext,
  onJumpToSection,
  onReset,
}: GaussianParamterUpdateSlidesProps) => {
  return (
    <TextContainer className="lg:w-2/5">
      <SlideNav
        slideNumber={slideNumber}
        totalSlides={totalSlides}
        onReset={onReset}
        sections={SECTIONS}
        currentSection={slide?.section}
        onJumpToSection={(value) => onJumpToSection(value as Section)}
      />
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col">
          {/* Slide text */}
          <div className={styles["slide-text"]}>
            {slide?.text ? slide.text : null}
          </div>
        </div>
        {/* Back + Next buttons */}
        <div className="flex justify-center">
          {slideNumber > 1 ? (
            <Button variant="secondary" className="mr-2 px-4" onClick={onBack}>
              Back
            </Button>
          ) : null}
          {slideNumber < totalSlides ? (
            <Button variant="secondary" className="ml-2 px-4" onClick={onNext}>
              Next
            </Button>
          ) : null}
        </div>
      </div>
    </TextContainer>
  );
};

export default GaussianParameterUpdateSlides;
