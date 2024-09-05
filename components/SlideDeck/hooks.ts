import { useState } from "react";

export default function useSlides() {
  const [slideIndex, setSlideIndex] = useState(0);

  const goToPreviousSlide = () => {
    setSlideIndex(slideIndex - 1);
  };

  const goToNextSlide = () => {
    setSlideIndex(slideIndex + 1);
  };

  const onReset = () => setSlideIndex(1);

  return {
    slideIndex,
    goToPreviousSlide,
    goToNextSlide,
    onReset,
  };
}
