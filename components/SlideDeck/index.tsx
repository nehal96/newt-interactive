import Button from "../Button";
import useSlides from "./hooks";
import SlideNav from "./SlideNav";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../InteractiveContainer";

const SlideDeck = ({
  slides,
  textContainerClass = "lg:w-1/2",
  interactiveContainerClass = "lg:w-1/2",
}) => {
  const {
    slideIndex,
    sections,
    goToPreviousSlide,
    goToNextSlide,
    onReset,
    onJumpToSection,
  } = useSlides(slides);
  const totalSlides = slides.length;

  return (
    <InteractiveTutorialContainer>
      <TextContainer className={textContainerClass}>
        <SlideNav
          slideNumber={slideIndex + 1}
          totalSlides={totalSlides}
          onReset={onReset}
          sections={sections}
          currentSection={slides[slideIndex]?.section}
          onJumpToSection={onJumpToSection}
        />
        <div className="flex flex-col justify-between h-full">
          <div className="font-body flex flex-col *:text-base md:*:text-base">
            {slides[slideIndex].text}
          </div>
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
        </div>
      </TextContainer>
      <InteractiveContainer className={interactiveContainerClass}>
        {slides[slideIndex].interactive}
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default SlideDeck;
