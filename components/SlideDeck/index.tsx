import Button from "../Button";
import {
  NestedInteractiveCanvasContainer,
  NestedInteractiveContainer,
  NestedInteractiveTextContainer,
} from "../NestedInteractiveContainer";
import useSlides from "./hooks";

const SlideDeck = ({ slides }) => {
  const { slideIndex, goToPreviousSlide, goToNextSlide, onReset } = useSlides();
  const totalSlides = slides.length;

  return (
    <NestedInteractiveContainer>
      <NestedInteractiveTextContainer>
        {slides[slideIndex].text}
        <div className="flex justify-center mt-6">
          {slideIndex > 0 ? (
            <Button
              variant="secondary"
              className="mr-2 px-4"
              onClick={goToPreviousSlide}
            >
              Back
            </Button>
          ) : null}
          {slideIndex < totalSlides - 1 ? (
            <Button
              variant="secondary"
              className="ml-2 px-4"
              onClick={goToNextSlide}
            >
              Next
            </Button>
          ) : null}
        </div>
      </NestedInteractiveTextContainer>
      <NestedInteractiveCanvasContainer className="bg-white">
        {slides[slideIndex].interactive}
      </NestedInteractiveCanvasContainer>
    </NestedInteractiveContainer>
  );
};

export default SlideDeck;
