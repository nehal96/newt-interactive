import { useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import {
  generateValidMutation,
  generateTruthTable,
  getInputTableData,
} from "./utils";
import { initialNodes, initialEdges } from "./data";
import { SimulationType } from "./types";

export const useCircuitEvolution = ({
  numVariations,
}: {
  numVariations: number;
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [chartData, setChartData] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [mutationLogs, setMutationLogs] = useState<string[]>([]);
  const [simulationType, setSimulationType] = useState<SimulationType>(
    SimulationType.MUTATION
  );
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [skipResetWarning, setSkipResetWarning] = useState(false);
  const [pendingSimulationType, setPendingSimulationType] =
    useState<SimulationType | null>(null);

  // Calculate initial fitness on first render
  useEffect(() => {
    try {
      const initialTruthTable = generateTruthTable(nodes, edges);
      const initialFitness =
        initialTruthTable.filter((row) => row.circuitOutput === row.goalOutput)
          .length / initialTruthTable.length;

      setChartData([{ x: 0, y: initialFitness }]);
    } catch (error) {
      console.error("Error calculating initial fitness:", error);
      setMutationLogs((prev) => [
        ...prev,
        `Error calculating initial fitness: ${error.message}`,
      ]);
    }
  }, []);

  const mutateCircuit = () => {
    try {
      const mutation = generateValidMutation(nodes, edges);
      if (!mutation) {
        setMutationLogs((prev) => [
          ...prev,
          "Failed to generate valid mutation",
        ]);
        return;
      }

      setEdges((currentEdges) => {
        try {
          const updatedEdges = currentEdges.filter(
            (edge) => edge.id !== mutation.oldEdge.id
          );
          const newEdges = [...updatedEdges, mutation.newEdge];

          const newTruthTable = generateTruthTable(nodes, newEdges);
          const newFitness =
            newTruthTable.filter((row) => row.circuitOutput === row.goalOutput)
              .length / newTruthTable.length;

          setChartData((currentData) => {
            const newGeneration = currentData.length;
            return [...currentData, { x: newGeneration, y: newFitness }];
          });

          if (mutation.oldEdge && mutation.newEdge) {
            setMutationLogs((prev) => [
              ...prev,
              `Removed ${mutation.oldEdge.source}->${mutation.oldEdge.target}, Added ${mutation.newEdge.source}->${mutation.newEdge.target}`,
            ]);
          }

          return newEdges;
        } catch (error) {
          console.error("Error processing mutation:", error);
          setMutationLogs((prev) => [
            ...prev,
            `Error processing mutation: ${error.message}`,
          ]);
          return currentEdges; // Return unchanged edges if there's an error
        }
      });
    } catch (error) {
      console.error("Error during circuit mutation:", error);
      setMutationLogs((prev) => [
        ...prev,
        `Error during circuit mutation: ${error.message}`,
      ]);
    }
  };

  const resetCircuit = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    const initialTruthTable = generateTruthTable(initialNodes, initialEdges);
    const initialAccuracy =
      initialTruthTable.filter((row) => row.circuitOutput === row.goalOutput)
        .length / initialTruthTable.length;
    setChartData([{ x: 0, y: initialAccuracy }]);
    setMutationLogs([]);
  };

  const inputTableData = getInputTableData(edges);
  const truthTable = generateTruthTable(nodes, edges);
  const accuracy =
    (truthTable.filter((row) => row.circuitOutput === row.goalOutput).length /
      truthTable.length) *
    100;

  const simulateGeneration = () => {
    try {
      const currentEdges = [...edges];
      const currentFitness = chartData[chartData.length - 1]?.y ?? 0;

      let bestMutation = null;
      let bestFitness = currentFitness;

      for (let i = 0; i < numVariations; i++) {
        const mutation = generateValidMutation(nodes, currentEdges);
        if (!mutation) continue;

        const testEdges = [
          ...currentEdges.filter((edge) => edge.id !== mutation.oldEdge.id),
          mutation.newEdge,
        ];

        const newTruthTable = generateTruthTable(nodes, testEdges);
        const newFitness =
          newTruthTable.filter((row) => row.circuitOutput === row.goalOutput)
            .length / newTruthTable.length;

        if (newFitness > bestFitness) {
          bestMutation = mutation;
          bestFitness = newFitness;
        }
      }

      if (bestMutation && bestFitness > currentFitness) {
        setEdges((currentEdges) => {
          const updatedEdges = currentEdges.filter(
            (edge) => edge.id !== bestMutation.oldEdge.id
          );
          const newEdges = [...updatedEdges, bestMutation.newEdge];

          setChartData((currentData) => {
            const newGeneration = currentData.length;
            return [...currentData, { x: newGeneration, y: bestFitness }];
          });

          setMutationLogs((prev) => [
            ...prev,
            `Removed ${bestMutation.oldEdge.source}->${
              bestMutation.oldEdge.target
            }, Added ${bestMutation.newEdge.source}->${
              bestMutation.newEdge.target
            } (Fitness: ${bestFitness.toFixed(3)})`,
          ]);

          return newEdges;
        });
      } else {
        setChartData((currentData) => {
          const newGeneration = currentData.length;
          return [...currentData, { x: newGeneration, y: currentFitness }];
        });
        setMutationLogs((prev) => [
          ...prev,
          `No improvement found after ${numVariations} mutations`,
        ]);
      }
    } catch (error) {
      console.error("Error during generation simulation:", error);
      setMutationLogs((prev) => [
        ...prev,
        `Error during generation simulation: ${error.message}`,
      ]);
    }
  };

  const simulate = () => {
    if (simulationType === SimulationType.MUTATION) {
      mutateCircuit();
    } else {
      simulateGeneration();
    }
  };

  const handleSimulationTypeChange = (value: SimulationType) => {
    if (chartData.length === 0 || skipResetWarning) {
      setSimulationType(value);
      resetCircuit();
      return;
    }

    setPendingSimulationType(value);
    setShowResetWarning(true);
  };

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    inputTableData,
    truthTable,
    accuracy,
    chartData,
    mutateCircuit,
    resetCircuit,
    mutationLogs,
    simulate,
    simulationType,
    setSimulationType,
    showResetWarning,
    setShowResetWarning,
    skipResetWarning,
    setSkipResetWarning,
    pendingSimulationType,
    setPendingSimulationType,
    handleSimulationTypeChange,
  };
};
