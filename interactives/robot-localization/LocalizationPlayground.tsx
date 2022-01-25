import { Button, Code, InlineCode } from "../../components";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import { FiChevronDown, FiInfo } from "react-icons/fi";
import "@reach/accordion/styles.css";
import "@reach/menu-button/styles.css";
import { PlaygroundValues } from "./types";

export const ActionButton = ({ children, onClick }) => {
  return (
    <Button
      variant="primary"
      className="w-1/2 self-center mb-4"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const LocalizationPlayground = ({ values }: { values: PlaygroundValues }) => {
  const { pHit, setPHit, pMiss, setPMiss } = values;
  const incorrectSenseProb = pMiss / (pHit + pMiss);

  return (
    <>
      <div className="mb-6">
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
      <div className="mb-6">
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
      <div className="mb-6">
        <Code
          variant="medium"
          className="text-sm"
        >{`incorrectSenseProbability = ${incorrectSenseProb.toPrecision(
          3
        )}`}</Code>
      </div>
      <Accordion collapsible className="mb-8">
        <AccordionItem>
          <div>
            <AccordionButton className="flex items-center text-xs sm:text-sm text-slate-600 hover:text-slate-800">
              <FiInfo className="mr-1.5" /> See how the values are used to
              update beliefs <FiChevronDown className="ml-1" />
            </AccordionButton>
          </div>
          <AccordionPanel className="mt-2 pl-3 border-l-2 border-l-slate-300">
            <Code variant="dark" className="text-sm mb-2">
              {`const newBelief = beliefs[i][j] * (isHit * pHit + (1 - isHit) * pMiss);`}
            </Code>
            <blockquote className="text-xs sm:text-sm text-slate-800">
              where <InlineCode variant="medium">i</InlineCode> and{" "}
              <InlineCode variant="medium">j</InlineCode> are the indicies of
              the row and column, and{" "}
              <InlineCode variant="medium">isHit</InlineCode> is either 1 or 0
              depending on whether the sensed color is correct or not.
            </blockquote>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default LocalizationPlayground;
