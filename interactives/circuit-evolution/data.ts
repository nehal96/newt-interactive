export const initialNodes = [
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

export const initialEdges = [
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
