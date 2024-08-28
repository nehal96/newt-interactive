import { Suspense, useRef } from "react";
import { Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import {
  NestedInteractiveCanvasContainer,
  NestedInteractiveContainer,
  NestedInteractiveTextContainer,
  DNA,
} from "../../../components";
import { OrbitControls } from "@react-three/drei";

const HemoglobinStructureTutorial = () => {
  const spotlight1 = useRef();

  return (
    <NestedInteractiveContainer className="bg-slate-100/70">
      <NestedInteractiveTextContainer>
        example text
      </NestedInteractiveTextContainer>
      <NestedInteractiveCanvasContainer className="h-[300px] lg:h-[450px]">
        <Canvas
          camera={{
            fov: 60,
            near: 0.1,
            far: 1000,
            position: [3, 3, 3],
          }}
          className="bg-slate-200/50 rounded-lg backdrop-blur-lg"
        >
          <Suspense fallback={null}>
            <DNA />
            <gridHelper args={[20, 40, "#334155", "#64748b"]} />
            <spotLight
              ref={spotlight1}
              intensity={4}
              position={[10, 10, 10]}
              distance={30}
              shadow-bias={-0.00005}
              angle={Math.PI / 6}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <OrbitControls target={new Vector3(0, 2.5, 0)} />
          </Suspense>
        </Canvas>
      </NestedInteractiveCanvasContainer>
    </NestedInteractiveContainer>
  );
};

export default HemoglobinStructureTutorial;
