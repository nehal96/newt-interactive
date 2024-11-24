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
    const initialTruthTable = generateTruthTable(nodes, edges);
    const initialAccuracy =
      initialTruthTable.filter((row) => row.circuitOutput === row.goalOutput)
        .length / initialTruthTable.length;

    setChartData([{ x: 0, y: initialAccuracy }]);
  }, []);

  const mutateCircuit = () => {
    const mutation = generateValidMutation(nodes, edges);

    // Remove old edge and add new edge
    setEdges((currentEdges) => {
      const updatedEdges = currentEdges.filter(
        (edge) => edge.id !== mutation.oldEdge.id
      );
      const newEdges = [...updatedEdges, mutation.newEdge];

      // Calculate new fitness here with the updated edges
      const newTruthTable = generateTruthTable(nodes, newEdges);
      const newAccuracy =
        (newTruthTable.filter((row) => row.circuitOutput === row.goalOutput)
          .length /
          newTruthTable.length) *
        100;

      // Update chart data with the new accuracy
      setChartData((currentData) => {
        const newGeneration = currentData.length;
        const newFitness = newAccuracy / 100;
        return [...currentData, { x: newGeneration, y: newFitness }];
      });

      // Add log entry
      if (mutation.oldEdge && mutation.newEdge) {
        setMutationLogs((prev) => [
          ...prev,
          `Removed ${mutation.oldEdge.source}->${mutation.oldEdge.target}, Added ${mutation.newEdge.source}->${mutation.newEdge.target}`,
        ]);
      } else {
        setMutationLogs((prev) => [...prev, "No changes in this mutation"]);
      }

      return newEdges;
    });
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
