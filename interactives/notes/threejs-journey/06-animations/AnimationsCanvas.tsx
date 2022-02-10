import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";
import { Slide } from "./types";

const Box = ({ animationCode, ...props }) => {
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
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
};

const AnimationsCanvas = ({
  animationCode,
}: {
  animationCode?: Slide["code"];
}) => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <PerspectiveCamera fov={75} position={[0, 0, 3]} />
        <ambientLight />
        <Box animationCode={animationCode} />
      </Suspense>
    </Canvas>
  );
};

export default AnimationsCanvas;
