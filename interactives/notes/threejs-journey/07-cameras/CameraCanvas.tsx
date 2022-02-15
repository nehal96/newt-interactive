import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
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

const CameraCanvas = ({ fov, near, far }) => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <PerspectiveCamera
          makeDefault
          fov={fov}
          aspect={2}
          near={near}
          far={far}
          position={[0, 0, 3]}
        />
        <ambientLight />
        <OrbitControls />
        <Box />
      </Suspense>
    </Canvas>
  );
};

export default CameraCanvas;
