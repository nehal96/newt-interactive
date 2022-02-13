import { PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Canvas } from "react-three-fiber";

const Box = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="pink" />
    </mesh>
  );
};

const CameraCanvas = () => {
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

export default CameraCanvas;
