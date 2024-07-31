import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Button, TextContainer } from "..";
import { isEmpty } from "lodash";
import * as Select from "@radix-ui/react-select";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import styles from "./Slides.module.css";

type Slide = {
  text: React.ReactNode;
  onBackActions?: string[];
  onNextActions?: string[];
};
type Slides = {
  [index: number]: Slide;
};
export type JumpToSectionMenu = {
  name: string;
}[];
interface SlidesProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  slides: Slides;
  currentSlideNumber: number;
  onBack: (callback?: any) => void;
  onNext: (callback?: any) => void;
  onReset: () => void;
  onJumpToSection: (value: string) => void;
  jumpToSectionMenu?: JumpToSectionMenu;
  currentSection?: string;
}

// Text slides for interactives
const Slides = ({
  slides,
  currentSlideNumber,
  onBack,
  onNext,
  onReset,
  onJumpToSection,
  jumpToSectionMenu,
  currentSection,
  className,
}: SlidesProps) => {
  const currentSlide = slides[currentSlideNumber];
  const totalSlides = Object.keys(slides)?.length;

  return (
    <TextContainer className={className}>
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
                    {jumpToSectionMenu.map((section, index) => (
                      <Select.Item
                        className="text-sm leading-none rounded-sm flex items-center h-6 pr-9 pl-6 relative select-none data-[disabled]:text-slate-400 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-600 data-[highlighted]:text-white"
                        value={section.name}
                        key={section.name}
                      >
                        <Select.ItemText>{section.name}</Select.ItemText>
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
          <span className="text-xs md:text-sm">{`${currentSlideNumber} / ${totalSlides}`}</span>
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col">
          {/* Slide text */}
          <div className={styles["slide-text"]}>
            {currentSlide?.text ? currentSlide.text : null}
          </div>
        </div>
        {/* Back + Next buttons */}
        <div className="flex justify-center">
          {currentSlideNumber > 1 ? (
            <Button
              variant="secondary"
              className="mr-2 px-4"
              onClick={() => onBack(currentSlide?.onBackActions)}
            >
              Back
            </Button>
          ) : null}
          {currentSlideNumber < totalSlides ? (
            <Button
              variant="secondary"
              className="ml-2 px-4"
              onClick={() => onNext(currentSlide?.onNextActions)}
            >
              Next
            </Button>
          ) : null}
        </div>
      </div>
    </TextContainer>
  );
};

export default Slides;
