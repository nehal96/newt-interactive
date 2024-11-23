import { axisStyle } from "../../components/Chart/styles";

export const evaluateNAND = (input1: number, input2: number): number => {
  return input1 === 1 && input2 === 1 ? 0 : 1;
};

// (X xor Y) AND (Z xor W) -- programming logic evaluated from https://www.dcode.fr/boolean-expressions-calculator
export const goal = (x: number, y: number, z: number, w: number) => {
  return (
    (w && x && !y && !z) ||
    (w && !x && y && !z) ||
    (!w && x && !y && z) ||
    (!w && !x && y && z)
  );
};

export const getTableData = (edges: any[]) => {
  // Create a map to store inputs for each target node
  const gateInputs: { [key: string]: string[] } = {};

  // Process edges to group inputs by target
  edges.forEach((edge) => {
    if (!gateInputs[edge.target]) {
      gateInputs[edge.target] = [];
    }
    gateInputs[edge.target].push(edge.source);
  });

  // Sort gates by number
  const sortedGates = Object.keys(gateInputs).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return {
    gates: sortedGates,
    inputs: sortedGates.map((gate) => gateInputs[gate].sort()),
  };
};

export const fitnessChartAxisStyle = {
  ...axisStyle,
  axisLabel: {
    ...axisStyle.axisLabel,
    fontSize: 11,
    fontFamily: "monospace",
    padding: 25,
  },
  tickLabels: {
    ...axisStyle.tickLabels,
    fontSize: 11,
    fontFamily: "monospace",
  },
  ticks: { ...axisStyle.ticks, size: 0 },
};

export const generateValidMutation = (nodes: any[], edges: any[]) => {
  // Get all possible source nodes (inputs 1-4 and NAND gates 5-8)
  const possibleSources = nodes
    .filter((node) => parseInt(node.id) < 9)
    .map((node) => node.id);

  // Get all possible target nodes (NAND gates 5-9)
  const possibleTargets = nodes
    .filter((node) => node.type === "nandGate")
    .map((node) => node.id);

  // Count current outputs for each source
  const currentSourceOutputs = edges.reduce((acc, edge) => {
    acc[edge.source] = (acc[edge.source] || 0) + 1;
    return acc;
  }, {});

  // Only allow removing edges that won't disconnect input nodes
  const validEdgesToRemove = edges.filter((edge) => {
    const isInputNode = parseInt(edge.source) <= 4;
    if (!isInputNode) return true;
    return currentSourceOutputs[edge.source] > 1;
  });

  // Pick a random edge to mutate from valid options
  const edgeToMutate =
    validEdgesToRemove[Math.floor(Math.random() * validEdgesToRemove.length)];

  // Create new edges array without the selected edge
  const remainingEdges = edges.filter((edge) => edge.id !== edgeToMutate.id);

  // Count inputs for each target after removing the edge
  const targetInputCounts = remainingEdges.reduce((acc, edge) => {
    acc[edge.target] = (acc[edge.target] || 0) + 1;
    return acc;
  }, {});

  // Create a set of existing connections
  const existingConnections = new Set(
    remainingEdges.map((edge) => `${edge.source}-${edge.target}`)
  );

  // Filter valid targets (those with less than 2 inputs)
  const validTargets = possibleTargets.filter(
    (target) => (targetInputCounts[target] || 0) < 2
  );

  // Generate new connection ensuring it's unique
  let attempts = 0;
  let newSource, newTarget;

  do {
    // Prioritize disconnected inputs
    const disconnectedInputs = possibleSources.filter(
      (source) =>
        parseInt(source) <= 4 &&
        !remainingEdges.some((edge) => edge.source === source)
    );

    if (disconnectedInputs.length > 0) {
      // If there are disconnected inputs, use one of them as the source
      newSource =
        disconnectedInputs[
          Math.floor(Math.random() * disconnectedInputs.length)
        ];
    } else {
      newSource =
        possibleSources[Math.floor(Math.random() * possibleSources.length)];
    }

    newTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
    attempts++;

    // Prevent infinite loop if no valid combinations are available
    if (attempts > 100) {
      console.error("No valid mutations available");
      return null;
    }
  } while (existingConnections.has(`${newSource}-${newTarget}`));

  return {
    oldEdge: edgeToMutate,
    newEdge: {
      id: `e${newSource}-${newTarget}`,
      source: newSource,
      target: newTarget,
    },
  };
};
