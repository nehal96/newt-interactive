import styles from "./LocalizationSimulation.module.css";
import { Button, Code, InlineCode, TextContainer } from "../../components";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from "@reach/accordion";
import { Menu, MenuButton, MenuList, MenuItem } from "@reach/menu-button";
import { FiChevronDown, FiInfo } from "react-icons/fi";
import "@reach/accordion/styles.css";
import "@reach/menu-button/styles.css";
import { LocalizationSlidesProps, PlaygroundValues, Section } from "./types";

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

export const Playground = ({ values }: { values: PlaygroundValues }) => {
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
          withSyntaxHighlighting={false}
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
            <Code language="jsx" className="text-sm mb-2">
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

const LocalizationSlides = ({
  slide,
  slideNumber,
  totalSlides,
  onBack,
  onNext,
  onReset,
  onJumpToSection,
}: LocalizationSlidesProps) => {
  const getSectionName = (section: Section) => {
    switch (section) {
      case "overview":
        return "Overview";
      case "code-explain":
        return "Code";
      case "playground":
        return "Playground";
      default:
        return "";
    }
  };

  return (
    <TextContainer
      className={slide?.section === "overview" ? "lg:w-3/5" : "lg:w-1/2"}
    >
      <div className="flex items-center justify-between text-slate-400 mb-6">
        <div>
          <Menu>
            <MenuButton className="inline-flex text-xs items-center hover:text-slate-500">
              {getSectionName(slide?.section)}{" "}
              <span>
                <FiChevronDown className="ml-1" />
              </span>
            </MenuButton>
            <MenuList className="rounded-md">
              <MenuItem
                className={styles["menu-item"]}
                onSelect={() => onJumpToSection("overview")}
              >
                Overview
              </MenuItem>
              <MenuItem
                className={styles["menu-item"]}
                onSelect={() => onJumpToSection("code-explain")}
              >
                Code
              </MenuItem>
              <MenuItem
                className={styles["menu-item"]}
                onSelect={() => onJumpToSection("playground")}
              >
                Playground
              </MenuItem>
            </MenuList>
          </Menu>
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
            <Button
              variant="secondary"
              className="mr-2 px-4"
              onClick={() => onBack(slide?.onBack)}
            >
              Back
            </Button>
          ) : null}
          {slideNumber < totalSlides ? (
            <Button
              variant="secondary"
              className="ml-2 px-4"
              onClick={() => onNext(slide?.onNext)}
            >
              Next
            </Button>
          ) : null}
        </div>
      </div>
    </TextContainer>
  );
};

export default LocalizationSlides;
