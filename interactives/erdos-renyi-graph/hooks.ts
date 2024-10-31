import { useCallback, useMemo } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import {
  generateNodePositions,
  generateAllPossibleEdges,
  shuffleArray,
  GraphType,
  getMaxEdges,
} from "./utils";

interface UseRandomGNMNetworkProps {
  numNodes: number;
  numEdges: number;
  graphType: GraphType;
  withSelfLoops: boolean;
}

export function useRandomGNMNetwork({
  numNodes,
  numEdges,
  graphType,
  withSelfLoops,
}: UseRandomGNMNetworkProps) {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);

  // Calculate maximum possible edges including self-loops
  const maxEdges = useMemo(
    () => getMaxEdges(numNodes, graphType, withSelfLoops),
    [numNodes, graphType, withSelfLoops]
  );

  const generateNetwork = useCallback(
    (callback?: () => void) => {
      if (numEdges > maxEdges) {
        alert("Number of edges cannot exceed maximum possible edges");
      }

      const nodePositions = generateNodePositions(numNodes);
      const allPossibleEdges = generateAllPossibleEdges(
        numNodes,
        graphType,
        withSelfLoops
      );
      const shuffledEdges = shuffleArray([...allPossibleEdges]);
      const selectedEdges = shuffledEdges.slice(0, numEdges);

      setNodes(nodePositions);
      setEdges(selectedEdges);

      callback?.();
    },
    [numNodes, numEdges, maxEdges, withSelfLoops, graphType]
  );

  return {
    nodes,
    edges,
    maxEdges,
    generateNetwork,
  };
}
