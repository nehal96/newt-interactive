import { useEffect, useState } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import {
  generateValidMutation,
  generateTruthTable,
  getInputTableData,
} from "./utils";
import { initialNodes, initialEdges } from "./data";

export const useCircuitEvolution = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [chartData, setChartData] = useState([{ x: 0, y: 0.438 }]);
  const [mutationLogs, setMutationLogs] = useState<string[]>([]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
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
    setChartData([{ x: 0, y: 0.438 }]);
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
