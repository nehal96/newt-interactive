import React, { Suspense, useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import DynamicCoralMesh from "./DynamicCoralMesh";
import {
  CoralGeometry,
  SimulationParameters,
  defaultSimulationParameters,
} from "./types";
import { createSeedCoralGeometry } from "./core/geometryUtils";
import { runSimulationStep } from "./core/simulation";

interface CoralViewerProps {
  runStepTrigger?: number; // A counter that triggers the simulation step when it changes
  onGeometryUpdate?: (
    geometry: CoralGeometry,
    prevGeometry: CoralGeometry | null
  ) => void; // Optional callback for when geometry updates
}

const CoralViewer: React.FC<CoralViewerProps> = ({
  runStepTrigger,
  onGeometryUpdate,
}) => {
  const [coralGeometry, setCoralGeometry] = useState<CoralGeometry | null>(
    null
  );
  // simulationParams can remain internal or be lifted later if needed
  const [simulationParams, setSimulationParams] =
    useState<SimulationParameters>(defaultSimulationParameters);

  // Ref to track previous trigger value to detect changes
  const prevRunStepTriggerRef = useRef<number>();
  const prevCoralGeometryRef = useRef<CoralGeometry | null>(null); // To store previous geometry for logging

  // Initialize coral geometry on component mount
  useEffect(() => {
    const initialGeometry = createSeedCoralGeometry(1, 1.5); // Default radius and height
    prevCoralGeometryRef.current = null; // No previous geometry on init
    setCoralGeometry(initialGeometry);
    console.log("Initial Coral Geometry:", initialGeometry);
    if (onGeometryUpdate) {
      onGeometryUpdate(initialGeometry, null);
    }
  }, [onGeometryUpdate]);

  // Effect to run simulation step when runStepTrigger changes
  useEffect(() => {
    if (
      runStepTrigger === undefined ||
      runStepTrigger === prevRunStepTriggerRef.current
    ) {
      return; // No change or not initialized
    }

    prevRunStepTriggerRef.current = runStepTrigger;

    if (!coralGeometry) {
      console.error("Coral geometry not initialized yet for step execution.");
      return;
    }
    console.log(
      "Running simulation step via trigger, with params:",
      simulationParams
    );
    prevCoralGeometryRef.current = coralGeometry; // Store current before updating
    const newGeometry = runSimulationStep(coralGeometry, simulationParams);
    setCoralGeometry(newGeometry);
    console.log("New Coral Geometry after triggered step:", newGeometry);
    if (onGeometryUpdate) {
      onGeometryUpdate(newGeometry, prevCoralGeometryRef.current);
    }
  }, [runStepTrigger, coralGeometry, simulationParams, onGeometryUpdate]);

  return (
    <Canvas
      shadows
      style={{
        background: "#f0f9ff",
        border: "1px solid #e0e0e0",
        width: "100%",
        height: "100%",
      }}
      camera={{ position: new THREE.Vector3(0, -4, 3), fov: 50 }}
      onCreated={({ camera }) => {
        camera.up.set(0, 0, 1); // Explicitly set camera's up vector to Z-axis
        camera.lookAt(0, 0, 0);
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 5, 10]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {coralGeometry && (
          <DynamicCoralMesh
            geometry={coralGeometry}
            color="coral"
            vertexRadius={0.04}
          />
        )}
        <OrbitControls target={new THREE.Vector3(0, 0, 0)} />
      </Suspense>
    </Canvas>
  );
};

export default CoralViewer;
