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
