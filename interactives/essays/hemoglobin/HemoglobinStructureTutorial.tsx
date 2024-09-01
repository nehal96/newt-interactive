import { Suspense, useRef } from "react";
import { Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import {
  NestedInteractiveCanvasContainer,
  NestedInteractiveContainer,
  NestedInteractiveTextContainer,
  DNA,
  Button,
  Hemoglobin,
} from "../../../components";
import { OrbitControls } from "@react-three/drei";
import * as Select from "@radix-ui/react-select";
import { FiChevronDown } from "react-icons/fi";
import HemoglobinModel from "./HemoglobinModel";

const HemoglobinStructureTutorial = () => {
  const spotlight1 = useRef();

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
        <Canvas
          camera={{
            fov: 60,
            near: 0.1,
            far: 1000,
            position: [50, 50, 50],
          }}
          className="bg-slate-200/50 rounded-lg backdrop-blur-lg"
        >
          <Suspense fallback={null}>
            <Hemoglobin />
            {/* <HemoglobinModel /> */}
            {/* <gridHelper args={[20, 40, "#334155", "#64748b"]} /> */}
            <spotLight
              ref={spotlight1}
              intensity={4}
              position={[40, 40, 40]}
              distance={60}
              shadow-bias={-0.00005}
              angle={Math.PI / 6}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            {/* <ambientLight intensity={0.25} /> */}
            <rectAreaLight
              intensity={4}
              position={[40, 40, 40]}
              width={50}
              height={50}
              helper={true}
            />
            <rectAreaLight
              intensity={4}
              position={[-40, 40, -40]}
              width={50}
              height={50}
            />
            <rectAreaLight
              intensity={4}
              position={[-5, -50, 20]}
              width={50}
              height={50}
            />
            <OrbitControls target={new Vector3(0, 0, 0)} />
          </Suspense>
        </Canvas>
      </NestedInteractiveCanvasContainer>
    </NestedInteractiveContainer>
  );
};

export default HemoglobinStructureTutorial;
