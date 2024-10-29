import { Node } from "@xyflow/react";

export type GraphType = "directed" | "undirected";

export const getUndirectedAndSelfLoopsMaxEdges = (n: number) => {
  return Math.floor((n * (n + 1)) / 2);
};

export const getDirectedAndSelfLoopsMaxEdges = (n: number) => {
  return n * n;
};

export const getMaxEdges = (n: number, graphType: GraphType) => {
  return graphType === "directed"
    ? getDirectedAndSelfLoopsMaxEdges(n)
    : getUndirectedAndSelfLoopsMaxEdges(n);
};

export const generateAllPossibleUndirectedAndSelfLoopsEdges = (n: number) => {
  const allPossibleEdges = [];

  for (let i = 0; i < n; i++) {
    // include self-loops
    allPossibleEdges.push({
      id: `${i}->${i}`,
      source: `${i}`,
      target: `${i}`,
      type: "floating",
    });

    // include all other edges
    for (let j = i + 1; j < n; j++) {
      allPossibleEdges.push({
        id: `${i}->${j}`,
        source: `${i}`,
        target: `${j}`,
        type: "floating",
      });
    }
  }

  return allPossibleEdges;
};

export const generateAllPossibleDirectedAndSelfLoopsEdges = (n: number) => {
  const allPossibleEdges = [];

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      allPossibleEdges.push({
        id: `${i}->${j}`,
        source: `${i}`,
        target: `${j}`,
        type: "floating",
      });
    }
  }

  return allPossibleEdges;
};

export const generateAllPossibleEdges = (
  n: number,
  graphType: GraphType,
  withSelfLoops: boolean
) => {
  if (graphType === "undirected" && withSelfLoops) {
    return generateAllPossibleUndirectedAndSelfLoopsEdges(n);
  } else if (graphType === "directed" && withSelfLoops) {
    return generateAllPossibleDirectedAndSelfLoopsEdges(n);
  }

  return [];
};

export const generateNodePositions = (n: number, radius: number = 200) => {
  const nodes: Node[] = [];
  const angleStep = (2 * Math.PI) / n;

  for (let i = 0; i < n; i++) {
    const angle = i * angleStep;
    // Calculate x and y coordinates on the circle
    const x = radius * Math.cos(angle) + radius;
    const y = radius * Math.sin(angle) + radius;

    nodes.push({
      id: `${i}`,
      type: "circle",
      position: { x, y },
      data: {
        color: "#3f3f46",
      },
    });
  }

  return nodes;
};
