import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { BoxGeometryProps, Canvas, useFrame } from "@react-three/fiber";
import { BoxParams, Slide } from "./types";

interface AnimationCanvasProps {
  boxArgs: BoxGeometryProps["args"];
  enableOrbitControls: boolean;
  animationCode?: Slide["code"];
}

const Box = ({ boxArgs, animationCode, ...props }: BoxParams) => {
  const mesh = useRef(null);

  let time = Date.now();
  function setTime(newTime) {
    time = newTime;
    return;
  }

  useFrame(({ clock, camera }) => {
    if (animationCode) {
      animationCode({ mesh, time, setTime, clock, camera });
    }
  });

  return (
    <mesh ref={mesh} {...props}>
      <boxGeometry args={boxArgs} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
};

const AnimationsCanvas = ({
  boxArgs,
  enableOrbitControls,
  animationCode,
}: AnimationCanvasProps) => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <PerspectiveCamera fov={75} position={[0, 0, 3]} />
        <ambientLight />
        <Box boxArgs={boxArgs} animationCode={animationCode} />
        {enableOrbitControls ? <OrbitControls /> : null}
      </Suspense>
    </Canvas>
  );
};

export default AnimationsCanvas;
