import { PerspectiveCamera } from "@react-three/drei";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "react-three-fiber";

const Box = ({ slideNumber, ...props }) => {
  const mesh = useRef(null);

  useFrame(() => {
    if (slideNumber === 2) {
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
};

const AnimationsCanvas = ({ slideNumber }: { slideNumber: number }) => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <PerspectiveCamera fov={75} position={[0, 0, 3]} />
        <ambientLight />
        <Box slideNumber={slideNumber} />
      </Suspense>
    </Canvas>
  );
};

export default AnimationsCanvas;
