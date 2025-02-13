import { MarkerType, Node } from "@xyflow/react";

export type GraphType = "directed" | "undirected";

export const getEdgeOptions = (graphType: GraphType) => ({
  type: "floating",
  style: {
    strokeWidth: 2,
    stroke: "#a1a1aa",
  },
  ...(graphType === "directed" && {
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 12,
      height: 12,
      color: "#a1a1aa",
    },
  }),
});

export const getUndirectedAndSelfLoopsMaxEdges = (n: number) => {
  return Math.floor((n * (n + 1)) / 2);
};

export const getDirectedAndSelfLoopsMaxEdges = (n: number) => {
  return n * n;
};

export const getUndirectedMaxEdgesNoSelfLoops = (n: number) => {
  return Math.floor((n * (n - 1)) / 2);
};

export const getDirectedMaxEdgesNoSelfLoops = (n: number) => {
  return n * (n - 1);
};

export const getMaxEdges = (
  n: number,
  graphType: GraphType,
  withSelfLoops: boolean
) => {
  if (graphType === "directed") {
    return withSelfLoops
      ? getDirectedAndSelfLoopsMaxEdges(n)
      : getDirectedMaxEdgesNoSelfLoops(n);
  }

  return withSelfLoops
    ? getUndirectedAndSelfLoopsMaxEdges(n)
    : getUndirectedMaxEdgesNoSelfLoops(n);
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

export const generateAllPossibleUndirectedEdgesNoSelfLoops = (n: number) => {
  const allPossibleEdges = [];

  for (let i = 0; i < n; i++) {
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

export const generateAllPossibleDirectedEdgesNoSelfLoops = (n: number) => {
  const allPossibleEdges = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        allPossibleEdges.push({
          id: `${i}->${j}`,
          source: `${i}`,
          target: `${j}`,
          type: "floating",
        });
      }
    }
  }
  return allPossibleEdges;
};

export const generateAllPossibleEdges = (
  n: number,
  graphType: GraphType,
  withSelfLoops: boolean
) => {
  if (graphType === "directed") {
    return withSelfLoops
      ? generateAllPossibleDirectedAndSelfLoopsEdges(n)
      : generateAllPossibleDirectedEdgesNoSelfLoops(n);
  }

  return withSelfLoops
    ? generateAllPossibleUndirectedAndSelfLoopsEdges(n)
    : generateAllPossibleUndirectedEdgesNoSelfLoops(n);
};

export const generateNodePositions = (n: number, radius: number = 200) => {
  const nodes: Node[] = [];
  const angleStep = (2 * Math.PI) / n;

  for (let i = 0; i < n; i++) {
    const angle = i * angleStep;
    // Calculate x and y coordinates on the circle
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    nodes.push({
      id: `${i}`,
      type: "circle",
      position: { x, y },
      data: {
        style: {
          backgroundColor: "#3f3f46",
          color: "#3f3f46",
          borderColor: "#3f3f46",
        },
      },
    });
  }

  return nodes;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};
