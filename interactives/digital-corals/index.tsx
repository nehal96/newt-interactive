import React, { useState, useCallback } from "react";
import {
  InteractiveContainer,
  InteractiveTutorialContainer,
  TextContainer,
} from "../../components/InteractiveContainer";
import CoralViewer from "./CoralViewer";
import Button from "../../components/Button";
import { CoralGeometry, Vector3 } from "./types";

// Helper to format Vector3 for logging
const formatVec = (v: Vector3) =>
  `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;

// Helper to check if two vectors are different (with small tolerance for floating point)
const vectorsAreDifferent = (v1: Vector3, v2: Vector3, tolerance = 0.001) => {
  return (
    Math.abs(v1.x - v2.x) > tolerance ||
    Math.abs(v1.y - v2.y) > tolerance ||
    Math.abs(v1.z - v2.z) > tolerance
  );
};

const DigitalCoralSimulator = () => {
  const [runStepTrigger, setRunStepTrigger] = useState<number>(0);
  const [currentGeometry, setCurrentGeometry] = useState<CoralGeometry | null>(
    null
  );
  const [simulationLog, setSimulationLog] = useState<string[]>([]);

  const handleRunSimulationStep = useCallback(() => {
    setRunStepTrigger((prev) => prev + 1);
  }, []);

  const handleGeometryUpdate = useCallback(
    (newGeom: CoralGeometry, prevGeom: CoralGeometry | null) => {
      setCurrentGeometry(newGeom);
      const stepNumber = runStepTrigger;
      const newLogs: string[] = [
        `=== Simulation Step ${stepNumber}: Processed ${newGeom.polyps.length} polyps ===`,
      ];

      let normalChangesCount = 0;
      let positionChangesCount = 0;

      newGeom.polyps.forEach((polyp) => {
        const prevPolyp = prevGeom?.polyps.find((p) => p.id === polyp.id);

        // Check for position changes
        const positionChanged =
          prevPolyp &&
          (polyp.position.x !== prevPolyp.position.x ||
            polyp.position.y !== prevPolyp.position.y ||
            polyp.position.z !== prevPolyp.position.z);

        // Check for normal changes
        const normalChanged =
          prevPolyp &&
          polyp.normal &&
          prevPolyp.normal &&
          vectorsAreDifferent(polyp.normal, prevPolyp.normal);

        if (positionChanged) positionChangesCount++;
        if (normalChanged) normalChangesCount++;

        let logEntry = `${polyp.id}: xi=${polyp.xi?.toFixed(3)}`;

        // Log normal changes
        if (normalChanged) {
          logEntry += ` 🔄 Normal: ${formatVec(
            prevPolyp.normal!
          )} → ${formatVec(polyp.normal!)}`;
        } else if (polyp.normal) {
          logEntry += ` Normal: ${formatVec(polyp.normal)}`;
        }

        // Log position changes
        if (positionChanged) {
          logEntry += ` 📍 Moved: ${formatVec(
            prevPolyp.position
          )} → ${formatVec(polyp.position)}`;
        } else {
          logEntry += ` Position: ${formatVec(polyp.position)} (unchanged)`;
        }

        newLogs.push(logEntry);
      });

      // Summary log
      newLogs.unshift(
        `📊 Summary: ${positionChangesCount} polyps moved, ${normalChangesCount} normals recalculated`
      );

      setSimulationLog((prevLogs) => [...newLogs, ...prevLogs].slice(0, 30));
    },
    [runStepTrigger]
  );

  return (
    <InteractiveTutorialContainer>
      <TextContainer className="lg:w-1/2">
        <h2 className="text-xl font-semibold mb-4">Controls</h2>
        <p className="mb-4">
          Control panel for the digital coral simulator. Interact with the 3D
          view on the right using your mouse to orbit, pan, and zoom.
        </p>
        <Button
          onClick={handleRunSimulationStep}
          variant="primary"
          className="mb-4"
        >
          Run Single Simulation Step
        </Button>
        {currentGeometry && (
          <div className="mb-4">
            <p>Polyps: {currentGeometry.polyps.length}</p>
            <p>Faces: {currentGeometry.faces.length}</p>
          </div>
        )}
        <div className="text-xs mt-4 p-2 border rounded bg-gray-50 h-48 overflow-y-auto">
          <h3 className="font-semibold mb-1">Simulation Log:</h3>
          {simulationLog.length === 0 && <p>No simulation steps run yet.</p>}
          {simulationLog.map((log, index) => (
            <p key={index} className="whitespace-pre-wrap">
              {log}
            </p>
          ))}
        </div>
      </TextContainer>
      <InteractiveContainer className="lg:w-1/2">
        <div className="w-full h-96">
          <CoralViewer
            runStepTrigger={runStepTrigger}
            onGeometryUpdate={handleGeometryUpdate}
          />
        </div>
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export default DigitalCoralSimulator;
