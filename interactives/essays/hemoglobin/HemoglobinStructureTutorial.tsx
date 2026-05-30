import dynamic from "next/dynamic";
import {
  NestedInteractiveCanvasContainer,
  NestedInteractiveContainer,
  NestedInteractiveTextContainer,
  Button,
} from "../../../components";
import * as Select from "@radix-ui/react-select";
import { FiChevronDown } from "react-icons/fi";

// NOTE: The 3D molecular view is being rebuilt on top of Mol* (see
// docs/hemoglobin-3d-animation-exploration.md). The previous react-three-fiber
// attempts (r3f-models/Hemoglobin*, components/3D-Models, the runtime PDBLoader)
// were intentionally left behind during the branch update.
//
// Mol* must be client-only (its own WebGL engine, no SSR) and should stay out
// of the initial bundle, so it's loaded lazily with ssr:false.
const MolstarViewer = dynamic(() => import("./MolstarViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-200/50 text-sm text-slate-400 backdrop-blur-lg">
      Loading 3D viewer…
    </div>
  ),
});

const HemoglobinStructureTutorial = () => {
  return (
    <NestedInteractiveContainer className="bg-slate-100/70">
      <NestedInteractiveTextContainer>
        <div
          className={`flex items-center justify-between text-slate-500 mb-6 lg:mr-8`}
        >
          {/* for mobile, I want to move this to the top, above the interactive */}
          <div>
            <Select.Root value={"Intro"}>
              <Select.Trigger className="inline-flex items-center justify-center leading-none data-[placeholder]:text-slate-600 outline-none text-sm hover:text-slate-600">
                <Select.Value aria-label={"Intro"}>Intro</Select.Value>
                <Select.Icon>
                  <FiChevronDown className="ml-1" />
                </Select.Icon>
              </Select.Trigger>
            </Select.Root>
          </div>
          <div>
            <Button
              variant="outline"
              className="mr-2 text-xs hover:text-slate-500 md:mr-4 md:text-sm"
              // onClick={onReset}
            >
              Reset
            </Button>
            <span className="text-xs md:text-sm">1 / 15</span>
          </div>
        </div>
        <div className="text-slate-600">example text</div>
      </NestedInteractiveTextContainer>
      <NestedInteractiveCanvasContainer className="h-[300px] lg:h-[450px]">
        {/* Mol* viewer (client-only, lazy-loaded). PoC: loads vendored
            deoxyhemoglobin 2HHB and renders the default representation. */}
        <MolstarViewer className="overflow-hidden rounded-lg" />
      </NestedInteractiveCanvasContainer>
    </NestedInteractiveContainer>
  );
};

export default HemoglobinStructureTutorial;
