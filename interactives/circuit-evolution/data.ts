import { CircuitNode, CircuitEdge } from "./types";

export const initialNodes: CircuitNode[] = [
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
    position: { x: 300, y: 100 },
    data: {
      color: "#3f3f46",
      text: "7",
    },
  },
  {
    id: "8",
    type: "nandGate",
    position: { x: 150, y: 175 },
    data: {
      color: "#3f3f46",
      text: "8",
    },
  },
  {
    id: "9",
    type: "nandGate",
    position: { x: 250, y: 175 },
    data: {
      color: "#3f3f46",
      text: "9",
    },
  },
  {
    id: "10",
    type: "nandGate",
    position: { x: 100, y: 250 },
    data: {
      color: "#3f3f46",
      text: "10",
    },
  },
  {
    id: "11",
    type: "nandGate",
    position: { x: 200, y: 250 },
    data: {
      color: "#3f3f46",
      text: "11",
    },
  },
  {
    id: "12",
    type: "nandGate",
    position: { x: 300, y: 250 },
    data: {
      color: "#3f3f46",
      text: "12",
    },
  },
  {
    id: "13",
    type: "nandGate",
    position: { x: 150, y: 325 },
    data: {
      color: "#3f3f46",
      text: "13",
    },
  },
  {
    id: "14",
    type: "nandGate",
    position: { x: 250, y: 325 },
    data: {
      color: "#3f3f46",
      text: "14",
    },
  },
  {
    id: "15",
    type: "nandGate",
    position: { x: 200, y: 400 },
    data: {
      color: "#3f3f46",
      text: "15",
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
