import { useState, useEffect } from "react";

type ScreenBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpointToQuery = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

export default function useScreenBreakpoint(breakpoint: ScreenBreakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = breakpointToQuery[breakpoint];
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, breakpoint]);

  return matches;
}
