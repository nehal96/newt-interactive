import { CircuitNode, CircuitEdge, TruthTableRow } from "./types";
import { axisStyle } from "../../components/Chart/styles";

// Logic Gates
export const evaluateNAND = (input1: number, input2: number): number => {
  return input1 === 1 && input2 === 1 ? 0 : 1;
};

export const goal = (x: number, y: number, z: number, w: number): number => {
  return Number(
    (w && x && !y && !z) ||
      (w && !x && y && !z) ||
      (!w && x && !y && z) ||
      (!w && !x && y && z)
  );
};

// Circuit Evaluation
export const evaluateCircuit = (
  nodes: CircuitNode[],
  edges: CircuitEdge[]
): Record<string, number> => {
  const nodeValues: Record<string, number> = {};

  nodes
    .filter((node) => node.type === "circle")
    .forEach((node) => {
      if (typeof node.data.booleanValue !== "number") {
        throw new Error(`Node ${node.id} missing boolean value`);
      }
      nodeValues[node.id] = node.data.booleanValue;
    });

  const { gates, inputs } = getInputTableData(edges);

  // Evaluate each gate
  gates.forEach((gateId) => {
    const gateInputs = inputs[gates.indexOf(gateId)];
    const input1 = nodeValues[gateInputs[0]];
    const input2 = nodeValues[gateInputs[1]];
    nodeValues[gateId] = evaluateNAND(input1, input2);
  });

  return nodeValues;
};

// Input Processing
export const getInputTableData = (edges: CircuitEdge[]) => {
  const gateInputs: Record<string, string[]> = {};

  edges.forEach((edge) => {
    if (!gateInputs[edge.target]) {
      gateInputs[edge.target] = [];
    }
    gateInputs[edge.target].push(edge.source);
  });

  const sortedGates = Object.keys(gateInputs).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  return {
    gates: sortedGates,
    inputs: sortedGates.map((gate) => gateInputs[gate].sort()),
  };
};

// Truth Table Generation
export const generateTruthTable = (
  nodes: CircuitNode[],
  edges: CircuitEdge[]
): TruthTableRow[] => {
  const table: TruthTableRow[] = [];
  const nandGates = nodes.filter((node) => node.type === "nandGate");

  if (nandGates.length === 0) {
    throw new Error("No NAND gates found in circuit");
  }

  // Find the output node (highest numbered NAND gate)
  const outputNodeId = nandGates
    .map((node) => node.id)
    .sort((a, b) => parseInt(b) - parseInt(a))[0];

  for (let i = 0; i < 16; i++) {
    const inputs = [(i >> 3) & 1, (i >> 2) & 1, (i >> 1) & 1, i & 1];
    const tempNodes = updateNodesWithInputs(nodes, inputs);
    const circuitOutput = evaluateCircuit(tempNodes, edges);
    const goalOutput = goal(inputs[0], inputs[1], inputs[2], inputs[3]);

    table.push({
      inputs,
      circuitOutput: circuitOutput[outputNodeId],
      goalOutput: goalOutput ? 1 : 0,
    });
  }

  return table;
};

const updateNodesWithInputs = (
  nodes: CircuitNode[],
  inputs: number[]
): CircuitNode[] => {
  return nodes.map((node) => {
    if (node.type === "circle") {
      const index = parseInt(node.id) - 1;
      return {
        ...node,
        data: { ...node.data, booleanValue: inputs[index] },
      };
    }
    return node;
  });
};

// Mutation Logic
export const generateValidMutation = (
  nodes: CircuitNode[],
  edges: CircuitEdge[]
) => {
  // Calculate the highest valid source ID (4 inputs + all NAND gates except the last one)
  const maxSourceId =
    nodes
      .filter((node) => node.type === "nandGate")
      .map((node) => parseInt(node.id))
      .sort((a, b) => b - a)[0] - 1;

  const possibleSources = nodes
    .filter((node) => parseInt(node.id) <= maxSourceId)
    .map((node) => node.id);

  const possibleTargets = nodes
    .filter((node) => node.type === "nandGate")
    .map((node) => node.id);

  const currentSourceOutputs = countSourceOutputs(edges);
  const validEdgesToRemove = filterValidEdgesToRemove(
    edges,
    currentSourceOutputs
  );
  const edgeToMutate =
    validEdgesToRemove[Math.floor(Math.random() * validEdgesToRemove.length)];

  if (!edgeToMutate) return null;

  const remainingEdges = edges.filter((edge) => edge.id !== edgeToMutate.id);
  const { newSource, newTarget } = generateNewConnection(
    possibleSources,
    possibleTargets,
    remainingEdges
  );

  return {
    oldEdge: edgeToMutate,
    newEdge: {
      id: `e${newSource}-${newTarget}`,
      source: newSource,
      target: newTarget,
    },
  };
};

const countSourceOutputs = (edges: CircuitEdge[]): Record<string, number> => {
  return edges.reduce(
    (acc, edge) => ({
      ...acc,
      [edge.source]: (acc[edge.source] || 0) + 1,
    }),
    {}
  );
};

const filterValidEdgesToRemove = (
  edges: CircuitEdge[],
  currentSourceOutputs: Record<string, number>
): CircuitEdge[] => {
  return edges.filter((edge) => {
    const isInputNode = parseInt(edge.source) <= 4;
    return !isInputNode || currentSourceOutputs[edge.source] > 1;
  });
};

const generateNewConnection = (
  possibleSources: string[],
  possibleTargets: string[],
  remainingEdges: CircuitEdge[]
) => {
  const targetInputCounts = remainingEdges.reduce(
    (acc, edge) => ({
      ...acc,
      [edge.target]: (acc[edge.target] || 0) + 1,
    }),
    {}
  );

  const existingConnections = new Set(
    remainingEdges.map((edge) => `${edge.source}-${edge.target}`)
  );

  const validTargets = possibleTargets.filter(
    (target) => (targetInputCounts[target] || 0) < 2
  );

  let attempts = 0;
  let newSource: string, newTarget: string;

  do {
    const disconnectedInputs = findDisconnectedInputs(
      possibleSources,
      remainingEdges
    );
    newSource = selectNewSource(disconnectedInputs, possibleSources);
    newTarget = validTargets[Math.floor(Math.random() * validTargets.length)];
    attempts++;

    if (attempts > 100) {
      throw new Error("No valid mutations available");
    }
  } while (
    existingConnections.has(`${newSource}-${newTarget}`) ||
    newSource === newTarget
  );

  return { newSource, newTarget };
};

const findDisconnectedInputs = (
  possibleSources: string[],
  edges: CircuitEdge[]
): string[] => {
  return possibleSources.filter(
    (source) =>
      parseInt(source) <= 4 && !edges.some((edge) => edge.source === source)
  );
};

const selectNewSource = (
  disconnectedInputs: string[],
  possibleSources: string[]
): string => {
  return disconnectedInputs.length > 0
    ? disconnectedInputs[Math.floor(Math.random() * disconnectedInputs.length)]
    : possibleSources[Math.floor(Math.random() * possibleSources.length)];
};

// Chart Styling
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
