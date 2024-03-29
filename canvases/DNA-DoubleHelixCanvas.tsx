import { Vector3 } from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { DNA } from "../components";

const Lights = () => {
  const spotlight1 = useRef();
  const spotlight2 = useRef();

  // if (process.env.NODE_ENV === "development") {
  //   useHelper(spotlight1, THREE.SpotLightHelper, "white");
  //   useHelper(spotlight2, THREE.SpotLightHelper, "white");
  // }

  return (
    <>
      <spotLight
        ref={spotlight1}
        intensity={4}
        position={[10, 10, 10]}
        distance={30}
        shadow-bias={-0.00005}
        angle={Math.PI / 6}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        ref={spotlight2}
        intensity={4}
        position={[-10, 10, -10]}
        distance={30}
        shadow-bias={-0.00005}
        angle={Math.PI / 6}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </>
  );
};

const GeneticsComponent = () => {
  return (
    <Canvas
      concurrent
      camera={{
        fov: 60,
        near: 0.1,
        far: 1000,
        position: [3, 3, 3],
      }}
    >
      <Suspense fallback={null}>
        <DNA />
        <gridHelper args={[20, 40, "#334155", "#64748b"]} />
        {/* <axesHelper args={[10]} />  */}
        <Lights />
        <OrbitControls target={new Vector3(0, 2.5, 0)} />
      </Suspense>
    </Canvas>
  );
};

export default GeneticsComponent;
