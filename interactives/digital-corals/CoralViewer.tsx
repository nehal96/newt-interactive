import React, { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SeedCoralMesh from "./SeedCoralMesh";

const CoralViewer: React.FC = () => {
  return (
    <Canvas
      shadows
      style={{
        background: "#f0f9ff",
        borderRadius: "10px",
        border: "1px solid #e0e0e0",
      }}
      camera={{ position: new THREE.Vector3(2.5, 3.5, 4), fov: 50 }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-bias={-0.001}
        />
        <SeedCoralMesh
          radius={1}
          height={1.5}
          color="coral"
          vertexRadius={0.03}
        />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default CoralViewer;
