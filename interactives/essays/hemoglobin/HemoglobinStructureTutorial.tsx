import { useState } from "react";
import dynamic from "next/dynamic";
import {
  NestedInteractiveCanvasContainer,
  NestedInteractiveContainer,
  NestedInteractiveTextContainer,
  Button,
} from "../../../components";
import * as Select from "@radix-ui/react-select";
import { FiChevronDown } from "react-icons/fi";
import { HEMOGLOBIN_SCENES } from "./scenes";

// NOTE: The 3D molecular view is being rebuilt on top of Mol* (see
// docs/hemoglobin-3d-animation-exploration.md). The previous react-three-fiber
// attempts (r3f-models/Hemoglobin*, components/3D-Models, the runtime PDBLoader)
// were intentionally left behind during the branch update.
//
// Mol* must be client-only (its own WebGL engine, no SSR) and should stay out
// of the initial bundle, so it's loaded lazily with ssr:false. Scene metadata
// lives in ./scenes (no Mol* imports) so this shell can read it server-side.
const MolstarViewer = dynamic(() => import("./MolstarViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-200/50 text-sm text-slate-400 backdrop-blur-lg">
      Loading 3D viewer…
    </div>
  ),
});

const HemoglobinStructureTutorial = () => {
  const [step, setStep] = useState(0);
  const scene = HEMOGLOBIN_SCENES[step];
  const total = HEMOGLOBIN_SCENES.length;

  const goPrev = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(total - 1, s + 1));
  const onReset = () => setStep(0);

  return (
    <NestedInteractiveContainer className="bg-slate-100/70">
      <NestedInteractiveTextContainer>
        <div
          className={`flex items-center justify-between text-slate-500 mb-6 lg:mr-8`}
        >
          {/* for mobile, I want to move this to the top, above the interactive */}
          <div>
            <Select.Root value={scene.section}>
              <Select.Trigger className="inline-flex items-center justify-center leading-none data-[placeholder]:text-slate-600 outline-none text-sm hover:text-slate-600">
                <Select.Value aria-label={scene.section}>
                  {scene.section}
                </Select.Value>
                <Select.Icon>
                  <FiChevronDown className="ml-1" />
                </Select.Icon>
              </Select.Trigger>
            </Select.Root>
          </div>
          <div className="flex items-center">
            <Button
              variant="outline"
              className="mr-2 text-xs hover:text-slate-500 md:mr-4 md:text-sm"
              onClick={onReset}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              className="mr-2 text-xs hover:text-slate-500 md:text-sm disabled:opacity-40"
              onClick={goPrev}
              disabled={step === 0}
            >
              Prev
            </Button>
            <span className="mr-2 text-xs md:text-sm">
              {step + 1} / {total}
            </span>
            <Button
              variant="outline"
              className="text-xs hover:text-slate-500 md:text-sm disabled:opacity-40"
              onClick={goNext}
              disabled={step === total - 1}
            >
              Next
            </Button>
          </div>
        </div>
        <div className="text-slate-700">
          <h3 className="mb-2 font-medium text-slate-800">{scene.title}</h3>
          <p className="text-slate-600">{scene.text}</p>
        </div>
      </NestedInteractiveTextContainer>
      <NestedInteractiveCanvasContainer className="h-[300px] lg:h-[450px]">
        {/* Mol* viewer (client-only, lazy-loaded). Loads the full protein
            (2HHB) + the baked heme morph in one plugin and applies the
            cinematic layer (camera/fade/labels/trajectory) for `scene`. */}
        <MolstarViewer className="overflow-hidden rounded-lg" scene={step} />
      </NestedInteractiveCanvasContainer>
    </NestedInteractiveContainer>
  );
};

export default HemoglobinStructureTutorial;
