import { useRef, useState } from "react";
import PartsManifest from "./PartsManifest";
import AnatomyBuildup, { type Beat } from "./AnatomyBuildup";

/**
 * The anatomy section: the parts manifest (a list of the raw components) sitting
 * above the build-up block. They share `beat` state, so clicking a linkable part
 * in the manifest selects that beat in the build-up and scrolls it into view —
 * the manifest doubles as a visual table of contents.
 */
export default function AnatomySection() {
  const [beat, setBeat] = useState<Beat>("iron");
  const buildupRef = useRef<HTMLDivElement>(null);

  const handleSelectPart = (next: Beat) => {
    setBeat(next);
    buildupRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <PartsManifest onSelectPart={handleSelectPart} />
      <div ref={buildupRef} className="scroll-mt-24">
        <AnatomyBuildup beat={beat} onBeatChange={setBeat} />
      </div>
    </>
  );
}
