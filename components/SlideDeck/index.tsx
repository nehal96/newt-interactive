import * as Select from "@radix-ui/react-select";
import Button from "../Button";
import {
  NestedInteractiveCanvasContainer,
  NestedInteractiveContainer,
  NestedInteractiveTextContainer,
} from "../NestedInteractiveContainer";
import useSlides from "./hooks";
import { isEmpty } from "lodash";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const SlideDeckNavBar = ({
  slide,
  slideIndex,
  totalSlides,
  jumpToSectionMenu,
  onReset,
  onJumpToSection,
}) => {
  const slideNumber = slideIndex + 1;
  const currentSection = slide?.section;

  return (
    <div
      className={`flex items-center ${
        isEmpty(jumpToSectionMenu) ? "justify-end" : "justify-between"
      } text-slate-400 mb-6`}
    >
      {!isEmpty(jumpToSectionMenu) ? (
        <div>
          <Select.Root value={currentSection} onValueChange={onJumpToSection}>
            <Select.Trigger className="inline-flex items-center justify-center leading-none data-[placeholder]:text-slate-600 outline-none text-sm hover:text-slate-600">
              <Select.Value aria-label={currentSection}>
                {currentSection}
              </Select.Value>
              <Select.Icon>
                <FiChevronDown className="ml-1" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={6}
                className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
              >
                <Select.Viewport className="p-[5px]">
                  {jumpToSectionMenu.map((section) => (
                    <Select.Item
                      className="text-sm leading-none rounded-sm flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-600 data-[highlighted]:text-white"
                      value={section}
                      key={section}
                    >
                      <Select.ItemText>{section}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                        <FiCheck />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      ) : null}
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
  );
};

const SlideDeck = ({ slides }) => {
  const {
    slideIndex,
    jumpToSectionMenu,
    goToPreviousSlide,
    goToNextSlide,
    onReset,
    onJumpToSection,
  } = useSlides(slides);
  const totalSlides = slides.length;

  return (
    <NestedInteractiveContainer>
      <NestedInteractiveTextContainer>
        <SlideDeckNavBar
          slide={slides[slideIndex]}
          slideIndex={slideIndex}
          totalSlides={totalSlides}
          jumpToSectionMenu={jumpToSectionMenu}
          onReset={onReset}
          onJumpToSection={onJumpToSection}
        />
        {slides[slideIndex].text}
        <div className="flex justify-center mt-6">
          <Button
            variant="secondary"
            disabled={slideIndex === 0}
            className="mr-2 px-4"
            onClick={goToPreviousSlide}
          >
            Back
          </Button>
          <Button
            variant="secondary"
            disabled={slideIndex === totalSlides - 1}
            className="ml-2 px-4"
            onClick={goToNextSlide}
          >
            Next
          </Button>
        </div>
      </NestedInteractiveTextContainer>
      <NestedInteractiveCanvasContainer className="bg-white">
        {slides[slideIndex].interactive}
      </NestedInteractiveCanvasContainer>
    </NestedInteractiveContainer>
  );
};

export default SlideDeck;
