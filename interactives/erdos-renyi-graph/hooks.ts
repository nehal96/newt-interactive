import { useCallback } from "react";
import { useNodesState, useEdgesState, useReactFlow } from "@xyflow/react";
import {
  generateNodePositions,
  generateAllPossibleEdges,
  shuffleArray,
  GraphType,
} from "./utils";

interface UseRandomGNMNetworkProps {
  numNodes: number;
  numEdges: number;
  maxEdges: number;
  graphType: GraphType;
  withSelfLoops: boolean;
}

export function useRandomGNMNetwork({
  numNodes,
  numEdges,
  maxEdges,
  graphType,
  withSelfLoops,
}: UseRandomGNMNetworkProps) {
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const generateNetwork = useCallback(() => {
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

    setTimeout(() => {
      fitView({ maxZoom: 0.7, duration: 150 });
    }, 0);
  }, [numNodes, numEdges, maxEdges, withSelfLoops, graphType, fitView]);

  return {
    nodes,
    edges,
    generateNetwork,
  };
}
