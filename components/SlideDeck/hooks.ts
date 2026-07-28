import { useState } from "react";
import type { SlideSection } from "./SlideNav";

export default function useSlides(slides) {
  const [slideIndex, setSlideIndex] = useState(0);

  const goToPreviousSlide = () => setSlideIndex(slideIndex - 1);
  const goToNextSlide = () => setSlideIndex(slideIndex + 1);
  const onReset = () => setSlideIndex(0);

  const sections: SlideSection[] | undefined = slides[0].section
    ? slides
        .map((slide) => slide.section as string)
        .filter((section, i, all) => all.indexOf(section) === i)
        .map((section) => ({ value: section, label: section }))
    : undefined;

  const onJumpToSection = (section: string) =>
    setSlideIndex(slides.findIndex((slide) => slide.section === section));

  return {
    slideIndex,
    goToPreviousSlide,
    goToNextSlide,
    onReset,
    sections,
    onJumpToSection,
  };
}
