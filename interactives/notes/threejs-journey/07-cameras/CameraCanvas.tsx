import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  useHelper,
} from "@react-three/drei";
import { FunctionComponent, Suspense, useRef } from "react";
import { Canvas } from "react-three-fiber";
import {
  CameraHelper,
  OrthographicCamera as OrthographicCameraType,
  PerspectiveCamera as PerspectiveCameraType,
} from "three";
import { CameraCanvasProps } from "./types";

const Box = (props) => {
  return (
    <mesh {...props}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshBasicMaterial color="pink" />
    </mesh>
  );
};

const Scene: FunctionComponent<CameraCanvasProps> = ({
  fov,
  near,
  far,
  showHelper,
  useOrthographic,
}) => {
  const camera = useRef<PerspectiveCameraType>(null);
  const orthographicCamera = useRef<OrthographicCameraType>(null);

  useHelper(showHelper && camera, CameraHelper, 1, "royalblue");

  return (
    <>
      {/* First camera is used when helper is enabled, to view the helper */}
      <PerspectiveCamera
        makeDefault={showHelper}
        fov={75}
        position={[3, 0, 4]}
      />
      {useOrthographic ? (
        <OrthographicCamera
          ref={orthographicCamera}
          makeDefault
          position={[2, 1, 3]}
          args={[-10, 10, 10, -10]}
          near={0.1}
          far={100}
          zoom={70}
        />
      ) : (
        <PerspectiveCamera
          makeDefault={!showHelper}
          ref={camera}
          fov={fov}
          aspect={2}
          near={near}
          far={far}
          position={[0, 0, 3]}
        />
      )}
      <OrbitControls />
      <ambientLight />
      {showHelper ? <OrbitControls /> : null}
      <Box />
    </>
  );
};

const CameraCanvas: FunctionComponent<CameraCanvasProps> = ({
  fov,
  near,
  far,
  showHelper,
  useOrthographic,
}) => {
  return (
    <Canvas className="bg-black" concurrent>
      <Suspense fallback={null}>
        <Scene
          fov={fov}
          near={near}
          far={far}
          showHelper={showHelper}
          useOrthographic={useOrthographic}
        />
      </Suspense>
    </Canvas>
  );
};

export default CameraCanvas;
