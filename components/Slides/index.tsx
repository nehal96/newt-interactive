import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import { Button, TextContainer } from "..";
import { isEmpty, capitalize } from "lodash";
import { FiChevronDown } from "react-icons/fi";
import styles from "./Slides.module.css";

type Slide = {
  text: React.ReactNode;
  onBackActions?: string[];
  onNextActions?: string[];
};
export type JumpToSectionMenu = {
  name: string;
  onSelect: () => void;
}[];
interface SlidesProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  slide: Slide;
  slideNumber: number;
  totalSlides: number;
  onBack: (callback?: any) => void;
  onNext: (callback?: any) => void;
  onReset: () => void;
  jumpToSectionMenu?: JumpToSectionMenu;
  currentSection?: string;
}

// Text slides for interactives
const Slides = ({
  slide,
  slideNumber,
  totalSlides,
  onBack,
  onNext,
  onReset,
  jumpToSectionMenu,
  currentSection,
  className,
}: SlidesProps) => {
  return (
    <TextContainer className={className}>
      <div className="flex items-center justify-between text-slate-400 mb-6">
        {!isEmpty(jumpToSectionMenu) ? (
          <div>
            <Menu>
              <MenuButton className="inline-flex text-xs items-center hover:text-slate-500">
                {capitalize(currentSection)}
                <span>
                  <FiChevronDown className="ml-1" />
                </span>
              </MenuButton>
              <MenuList className="rounded-md">
                {jumpToSectionMenu.map((section) => (
                  <MenuItem
                    className={styles["menu-item"]}
                    onSelect={section.onSelect}
                  >
                    {capitalize(section.name)}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
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
              onClick={() => onBack(slide?.onBackActions)}
            >
              Back
            </Button>
          ) : null}
          {slideNumber < totalSlides ? (
            <Button
              variant="secondary"
              className="ml-2 px-4"
              onClick={() => onNext(slide?.onNextActions)}
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
