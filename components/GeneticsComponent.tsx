import { Canvas } from "react-three-fiber";
import DNAModel from "./DNAModel";
import { lazy, Suspense } from "react";

// Loading GLTF files in Next is a mess (can't be in pages), so here's a
// commit that works
// https://github.com/pmndrs/react-three-fiber/discussions/504
const Materials = lazy(() => import("./Materials"));

const GeneticsComponent = () => {
  return (
    <Canvas
      concurrent
      camera={{ fov: 60, near: 0.1, far: 1000, position: [10, 10, 10] }}
    >
      {/* <cameraHelper /> */}
      <Suspense fallback={null}>
        <DNAModel />
        <Materials />
        <gridHelper args={[20, 40, "blue", "hotpink"]} />
        <axesHelper args={[10]} />
      </Suspense>
    </Canvas>
  );
};

export default GeneticsComponent;
