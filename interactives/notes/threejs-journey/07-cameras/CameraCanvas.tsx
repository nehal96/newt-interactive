import { OrbitControls, PerspectiveCamera, useHelper } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "react-three-fiber";
import {
  CameraHelper,
  PerspectiveCamera as PerspectiveCameraType,
} from "three";

const Box = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="pink" />
    </mesh>
  );
};

const Scene = ({ fov, near, far, showHelper }) => {
  const camera = useRef<PerspectiveCameraType>(null);
  useHelper(showHelper && camera, CameraHelper, 1, "royalblue");

  return (
    <>
      {/* First camera is used when helper is enabled, to view the helper */}
      <PerspectiveCamera
        makeDefault={showHelper}
        fov={75}
        position={[3, 0, 4]}
      />
      <PerspectiveCamera
        makeDefault={!showHelper}
        ref={camera}
        fov={fov}
        aspect={2}
        near={near}
        far={far}
        position={[0, 0, 3]}
      />
      <ambientLight />
      {showHelper ? <OrbitControls /> : null}
      <Box />
    </>
  );
};

const CameraCanvas = ({ fov, near, far, showHelper }) => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <Scene fov={fov} near={near} far={far} showHelper={showHelper} />
      </Suspense>
    </Canvas>
  );
};

export default CameraCanvas;
