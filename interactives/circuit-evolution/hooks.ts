import { useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import {
  generateValidMutation,
  generateTruthTable,
  getInputTableData,
} from "./utils";
import { initialNodes, initialEdges } from "./data";

export const useCircuitEvolution = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [chartData, setChartData] = useState<Array<{ x: number; y: number }>>(
    []
  );
  const [mutationLogs, setMutationLogs] = useState<string[]>([]);

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
  };
};
