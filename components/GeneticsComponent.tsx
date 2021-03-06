import { Canvas } from "react-three-fiber";
import { lazy, Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

interface Genetics {
  slide: number;
}

// Loading GLTF files in Next is a mess (can't be in pages), so here's a
// commit that works
// https://github.com/pmndrs/react-three-fiber/discussions/504
const DNA = lazy(() => import("./Dna-5"));

const GeneticsComponent = ({ slide }: Genetics) => {
  return (
    <Canvas
      concurrent
      camera={{
        fov: 60,
        near: 0.1,
        far: 1000,
        position: [6, 6, 6],
      }}
    >
      {/* <cameraHelper /> */}
      <Suspense fallback={null}>
        <DNA exploreMode={slide === 0 ? true : false} />
        <gridHelper args={[20, 40, "blue", "hotpink"]} />
        <axesHelper args={[10]} />
        <spotLight
          intensity={2}
          position={[20, 20, 20]}
          shadow-bias={-0.00005}
          angle={Math.PI / 6}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          // castShadow
        />
        {slide === 0 ? <OrbitControls /> : null}
      </Suspense>
    </Canvas>
  );
};

export default GeneticsComponent;
