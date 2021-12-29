import { useState } from "react";
import styles from "./LocalizationSimulation.module.css";
import { TextContainer } from "../../components";
import { LocalizationSlidesProps, PlaygroundValues } from "./types";

export const ActionButton = ({ children, onClick }) => {
  return (
    <button
      className="w-1/2 self-center py-1 px-2 border border-slate-500 rounded-md mb-4"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export const Playground = ({ values }: { values: PlaygroundValues }) => {
  const { pHit, setPHit, pMiss, setPMiss } = values;
  const incorrectSenseProb = pMiss / (pHit + pMiss);

  return (
    <>
      <div className="mb-8">
        <label>
          <code>pHit</code>: Sensor hit value
        </label>
        <div className="flex">
          <input
            name="pHit"
            type="range"
            value={pHit}
            min={0}
            max={100}
            step={0.5}
            onChange={(e) => setPHit(Number(e.target.value))}
            className="flex-auto"
          />
          <span className="w-8 ml-2">{pHit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs">0</span>
          <span className="text-xs mr-10">100</span>
        </div>
      </div>
      <div className="mb-8">
        <label>
          <code>pMiss</code>: Sensor miss value
        </label>
        <div className="flex">
          <input
            name="pMiss"
            type="range"
            value={pMiss}
            min={0}
            max={100}
            step={0.5}
            onChange={(e) => setPMiss(Number(e.target.value))}
            className="flex-auto"
          />
          <span className="w-8 ml-2">{pMiss}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs">0</span>
          <span className="text-xs mr-10">100</span>
        </div>
      </div>
      <div className="mb-8">
        <code>{`incorrectSenseProbability = ${incorrectSenseProb.toPrecision(
          3
        )}`}</code>
      </div>
    </>
  );
};

const LocalizationSlides = ({
  slide,
  slideNumber,
  totalSlides,
  onBack,
  onNext,
  onReset,
  onJumpToSection,
}: LocalizationSlidesProps) => {
  return (
    <TextContainer
      className={slide?.section === "overview" ? "lg:w-3/5" : "lg:w-1/2"}
    >
      <div className="flex items-center justify-between text-slate-400 mb-6">
        <div>
          <button
            className={`text-sm mr-2  py-1 px-2 hover:border-b hover:border-b-slate-300 ${
              slide?.section === "overview"
                ? "border-b border-b-slate-400 text-slate-500 hover:border-b-slate-400"
                : ""
            }`}
            onClick={() => onJumpToSection("overview")}
          >
            Overview
          </button>
          <button
            className={`text-sm mr-2  py-1 px-2 hover:border-b hover:border-b-slate-300 ${
              slide?.section === "code-explain"
                ? "border-b border-b-slate-400 text-slate-500 hover:border-b-slate-400"
                : ""
            }`}
            onClick={() => onJumpToSection("code-explain")}
          >
            Code
          </button>
          <button
            className={`text-sm mr-2  py-1 px-2 hover:border-b hover:border-b-slate-300 ${
              slide?.section === "playground"
                ? "border-b border-b-slate-400 text-slate-500 hover:border-b-slate-400"
                : ""
            }`}
            onClick={() => onJumpToSection("playground")}
          >
            Playground
          </button>
        </div>
        <div>
          <button
            className="py-1 px-2 border border-slate-400 rounded-md mr-4 text-sm"
            onClick={onReset}
          >
            Reset
          </button>
          <span>{`${slideNumber} / ${totalSlides}`}</span>
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
            <button
              className="py-1 px-2 border border-slate-500 rounded-md mr-4"
              onClick={() => onBack(slide?.onBack)}
            >
              Back
            </button>
          ) : null}
          {slideNumber < totalSlides ? (
            <button
              className="py-1 px-2 border border-slate-500 rounded-md mr-4"
              onClick={() => onNext(slide?.onNext)}
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </TextContainer>
  );
};

export default LocalizationSlides;
