import { useState } from "react";
import _ from "lodash";

export default function useSlides(slides) {
  const [slideIndex, setSlideIndex] = useState(0);

  const goToPreviousSlide = () => {
    setSlideIndex(slideIndex - 1);
  };

  const goToNextSlide = () => {
    setSlideIndex(slideIndex + 1);
  };

  const onReset = () => setSlideIndex(0);

  const jumpToSectionMenu =
    slides[0].section &&
    _.chain(slides)
      .map((slide) => slide.section)
      .uniq()
      .value();

  const onJumpToSection = (section) => {
    const sectionIndex = slides.indexOf(section);
    setSlideIndex(sectionIndex);
  };

  return {
    slideIndex,
    goToPreviousSlide,
    goToNextSlide,
    onReset,
    jumpToSectionMenu,
    onJumpToSection,
  };
}
