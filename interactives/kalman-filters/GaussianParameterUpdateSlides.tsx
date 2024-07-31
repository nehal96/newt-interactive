import { useState } from "react";
import { capitalize } from "lodash";
import {
  TextContainer,
  Button,
  MathFormula,
  InlineCode,
} from "../../components";
import styles from "./styles.module.css";
import {
  GaussianNameProps,
  GaussianParamterUpdateSlidesProps,
  PlaygroundProps,
  Section,
} from "./types";
import * as Select from "@radix-ui/react-select";
import { FiCheck, FiChevronDown } from "react-icons/fi";

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
      <div className="flex items-center justify-between text-slate-400 mb-6">
        <div>
          <Select.Root
            value={slide?.section}
            onValueChange={(value: Section) => onJumpToSection(value)}
          >
            <Select.Trigger className="inline-flex items-center justify-center leading-none data-[placeholder]:text-slate-600 outline-none text-sm hover:text-slate-600">
              <Select.Value aria-label={slide?.section}>
                {capitalize(slide?.section)}
              </Select.Value>
              <Select.Icon>
                <FiChevronDown className="ml-1" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                <Select.Viewport className="p-[5px]">
                  <Select.Item
                    className="text-sm leading-none rounded-sm flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-600 data-[highlighted]:text-white"
                    value="overview"
                  >
                    <Select.ItemText>Overview</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                      <FiCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    className="text-sm leading-none rounded-sm flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-600 data-[highlighted]:text-white"
                    value="calculations"
                  >
                    <Select.ItemText>Calculations</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                      <FiCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                  <Select.Item
                    className="text-sm leading-none rounded-sm flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-600 data-[highlighted]:text-white"
                    value="playground"
                  >
                    <Select.ItemText>Playground</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                      <FiCheck />
                    </Select.ItemIndicator>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <div>
          <Button
            variant="outline"
            className="mr-2 text-xs hover:text-slate-500 md:mr-4 md:text-sm"
            onClick={onReset}
          >
            Reset
          </Button>
          <span className="text-xs md:text-sm">{`${slideNumber} / ${totalSlides}`}</span>
        </div>
      </div>
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
