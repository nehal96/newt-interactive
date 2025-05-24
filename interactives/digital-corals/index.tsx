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
        `Simulation Step ${stepNumber}: Processed ${newGeom.polyps.length} polyps.`,
      ];

      newGeom.polyps.forEach((polyp) => {
        const prevPolyp = prevGeom?.polyps.find((p) => p.id === polyp.id);
        let logEntry = `Polyp ${polyp.id}: xi=${polyp.xi?.toFixed(3)}, Normal=${
          polyp.normal ? formatVec(polyp.normal) : "N/A"
        }`;
        if (
          prevPolyp &&
          (polyp.position.x !== prevPolyp.position.x ||
            polyp.position.y !== prevPolyp.position.y ||
            polyp.position.z !== prevPolyp.position.z)
        ) {
          logEntry += `, Moved from ${formatVec(
            prevPolyp.position
          )} to ${formatVec(polyp.position)}`;
        } else {
          logEntry += `, Position=${formatVec(
            polyp.position
          )} (unchanged or new)`;
        }
        newLogs.push(logEntry);
      });
      setSimulationLog((prevLogs) => [...newLogs, ...prevLogs].slice(0, 25));
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
