import { Suspense } from "react";
import { Canvas } from "react-three-fiber";

const AnimationsCanvas = () => {
  return (
    <Canvas
      concurrent
      camera={{
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [3, 3, 3],
      }}
    >
      <Suspense fallback={null}>
        <gridHelper args={[20, 40, "#334155", "#64748b"]} />
      </Suspense>
    </Canvas>
  );
};

export default AnimationsCanvas;
