import { PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "react-three-fiber";

const Box = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
};

const AnimationsCanvas = () => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <PerspectiveCamera fov={75} position={[0, 0, 3]} />
        <ambientLight />
        <Box />
      </Suspense>
    </Canvas>
  );
};

export default AnimationsCanvas;
