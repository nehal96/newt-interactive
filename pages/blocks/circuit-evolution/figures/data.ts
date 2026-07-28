import { CircuitNode, CircuitEdge } from "./types";

export const initialNodes: CircuitNode[] = [
  {
    id: "1",
    type: "circle",
    position: { x: 50, y: 25 },
    data: {
      booleanValue: 0,
      text: "X",
      style: {
        backgroundColor: "white",
        borderColor: "#3f3f46",
        color: "#3f3f46",
      },
    },
  },
  {
    id: "2",
    type: "circle",
    position: { x: 150, y: 25 },
    data: {
      booleanValue: 0,
      text: "Y",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "3",
    type: "circle",
    position: { x: 250, y: 25 },
    data: {
      booleanValue: 0,
      text: "Z",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "4",
    type: "circle",
    position: { x: 350, y: 25 },
    data: {
      booleanValue: 0,
      text: "W",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "5",
    type: "nandGate",
    position: { x: 100, y: 100 },
    data: {
      text: "5",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "6",
    type: "nandGate",
    position: { x: 200, y: 100 },
    data: {
      text: "6",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "7",
    type: "nandGate",
    position: { x: 300, y: 100 },
    data: {
      text: "7",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "8",
    type: "nandGate",
    position: { x: 150, y: 175 },
    data: {
      text: "8",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "9",
    type: "nandGate",
    position: { x: 250, y: 175 },
    data: {
      text: "9",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
      },
    },
  },
  {
    id: "10",
    type: "nandGate",
    position: { x: 100, y: 250 },
    data: {
      text: "10",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "11",
    type: "nandGate",
    position: { x: 200, y: 250 },
    data: {
      text: "11",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "12",
    type: "nandGate",
    position: { x: 300, y: 250 },
    data: {
      text: "12",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "13",
    type: "nandGate",
    position: { x: 150, y: 325 },
    data: {
      text: "13",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "14",
    type: "nandGate",
    position: { x: 250, y: 325 },
    data: {
      text: "14",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
  {
    id: "15",
    type: "nandGate",
    position: { x: 200, y: 400 },
    data: {
      text: "15",
      style: {
        backgroundColor: "white",
        color: "#3f3f46",
        borderColor: "#3f3f46",
      },
    },
  },
];

export const initialEdges: CircuitEdge[] = [
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
    id: "e3-7",
    source: "3",
    target: "7",
  },
  {
    id: "e4-7",
    source: "4",
    target: "7",
  },
  {
    id: "e5-8",
    source: "5",
    target: "8",
  },
  {
    id: "e6-8",
    source: "6",
    target: "8",
  },
  {
    id: "e6-9",
    source: "6",
    target: "9",
  },
  {
    id: "e7-9",
    source: "7",
    target: "9",
  },
  {
    id: "e5-10",
    source: "5",
    target: "10",
  },
  {
    id: "e8-10",
    source: "8",
    target: "10",
  },
  {
    id: "e8-11",
    source: "8",
    target: "11",
  },
  {
    id: "e9-11",
    source: "9",
    target: "11",
  },
  {
    id: "e7-12",
    source: "7",
    target: "12",
  },
  {
    id: "e9-12",
    source: "9",
    target: "12",
  },
  {
    id: "e10-13",
    source: "10",
    target: "13",
  },
  {
    id: "e11-13",
    source: "11",
    target: "13",
  },
  {
    id: "e11-14",
    source: "11",
    target: "14",
  },
  {
    id: "e12-14",
    source: "12",
    target: "14",
  },
  {
    id: "e13-15",
    source: "13",
    target: "15",
  },
  {
    id: "e14-15",
    source: "14",
    target: "15",
  },
];
