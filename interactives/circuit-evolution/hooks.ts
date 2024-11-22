import { useEffect } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { evaluateNAND, goal, getTableData } from "./utils";

const initialNodes = [
  {
    id: "1",
    type: "circle",
    position: { x: 50, y: 25 },
    data: {
      booleanValue: 0,
      color: "#3f3f46",
      text: "1",
      style: {
        backgroundColor: "white",
      },
    },
  },
  {
    id: "2",
    type: "circle",
    position: { x: 150, y: 25 },
    data: {
      booleanValue: 0,
      color: "#3f3f46",
      text: "2",
      style: {
        backgroundColor: "white",
      },
    },
  },
  {
    id: "3",
    type: "circle",
    position: { x: 250, y: 25 },
    data: {
      booleanValue: 0,
      color: "#3f3f46",
      text: "3",
      style: {
        backgroundColor: "white",
      },
    },
  },
  {
    id: "4",
    type: "circle",
    position: { x: 350, y: 25 },
    data: {
      booleanValue: 0,
      color: "#3f3f46",
      text: "4",
      style: {
        backgroundColor: "white",
      },
    },
  },
  {
    id: "5",
    type: "nandGate",
    position: { x: 100, y: 100 },
    data: {
      color: "#3f3f46",
      text: "5",
    },
  },
  {
    id: "6",
    type: "nandGate",
    position: { x: 200, y: 100 },
    data: {
      color: "#3f3f46",
      text: "6",
    },
  },
  {
    id: "7",
    type: "nandGate",
    position: { x: 150, y: 175 },
    data: {
      color: "#3f3f46",
      text: "7",
    },
  },
  {
    id: "8",
    type: "nandGate",
    position: { x: 250, y: 175 },
    data: {
      color: "#3f3f46",
      text: "8",
    },
  },
  {
    id: "9",
    type: "nandGate",
    position: { x: 200, y: 250 },
    data: {
      color: "#3f3f46",
      text: "9",
    },
  },
];
const initialEdges = [
  {
    id: "e1-5",
    source: "1",
    target: "5",
  },
  {
    id: "e2-5",
    source: "2",
    target: "5",
  },
  {
    id: "e2-6",
    source: "2",
    target: "6",
  },
  {
    id: "e3-6",
    source: "3",
    target: "6",
  },
  {
    id: "e4-8",
    source: "4",
    target: "8",
  },
  {
    id: "e5-7",
    source: "5",
    target: "7",
  },
  {
    id: "e6-7",
    source: "6",
    target: "7",
  },
  {
    id: "e6-8",
    source: "6",
    target: "8",
  },
  {
    id: "e7-9",
    source: "7",
    target: "9",
  },
  {
    id: "e8-9",
    source: "8",
    target: "9",
  },
];

export const useCircuitEvolution = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, []);

  const evaluateCircuit = (nodes) => {
    const nodeValues = {};

    nodes
      .filter((node) => node.type === "circle")
      .forEach((node) => {
        nodeValues[node.id] = node.data.booleanValue;
      });

    const { gates, inputs } = getTableData(edges);

    gates.forEach((gateId) => {
      const gateInputs = inputs[gates.indexOf(gateId)];
      // Get input values and evaluate NAND
      const input1 = nodeValues[gateInputs[0]];
      const input2 = nodeValues[gateInputs[1]];
      nodeValues[gateId] = evaluateNAND(input1, input2);
    });

    return nodeValues;
  };

  const generateTruthTable = () => {
    const table = [];
    // Generate all possible combinations of 4 inputs
    for (let i = 0; i < 16; i++) {
      const inputs = [(i >> 3) & 1, (i >> 2) & 1, (i >> 1) & 1, i & 1];

      // Update node values temporarily
      const tempNodes = nodes.map((node) => {
        if (node.type === "circle") {
          const index = parseInt(node.id) - 1;
          return {
            ...node,
            data: { ...node.data, booleanValue: inputs[index] },
          };
        }
        return node;
      });

      // Evaluate circuit with these inputs
      const circuitOutput = evaluateCircuit(tempNodes);
      const goalOutput = goal(inputs[0], inputs[1], inputs[2], inputs[3]);

      table.push({
        inputs,
        circuitOutput: circuitOutput["9"], // Node 9 is the output
        goalOutput: goalOutput ? 1 : 0,
      });
    }

    return table;
  };

  const tableData = getTableData(edges);
  const truthTable = generateTruthTable();
  const accuracy =
    (truthTable.filter((row) => row.circuitOutput === row.goalOutput).length /
      truthTable.length) *
    100;

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    tableData,
    truthTable,
    accuracy,
  };
};
