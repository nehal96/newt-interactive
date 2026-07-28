import { Position } from "@xyflow/react";
import { edgeStyles, generateProximityZone } from "./utils";
import { CircuitNode, CircuitNodeTypes } from "./types";
import { CircuitEdge } from "./types";

const proteinNodes: CircuitNode[] = [
  {
    id: "Sx",
    type: "circle" as CircuitNodeTypes,
    position: { x: 50, y: 50 },
    data: {
      text: "Sx",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    draggable: true,
  },
  {
    id: "Sy",
    type: "circle" as CircuitNodeTypes,
    position: { x: 325, y: 80 },
    data: {
      text: "Sy",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
    draggable: false,
    selectable: false,
  },
  {
    id: "X",
    type: "protein" as CircuitNodeTypes,
    position: { x: 100, y: 100 },
    draggable: false,
    selectable: false,
    data: {
      text: "X",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
  },
  {
    id: "X*1",
    type: "protein" as CircuitNodeTypes,
    position: { x: 175, y: 100 },
    draggable: false,
    selectable: false,
    data: {
      text: "X*",
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    },
  },
  {
    id: "X*2",
    type: "protein" as CircuitNodeTypes,
    position: { x: 240, y: 160 },
    draggable: false,
    selectable: false,
    data: {
      text: "X*",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    },
  },
  {
    id: "Y",
    type: "protein" as CircuitNodeTypes,
    position: { x: 300, y: 100 },
    draggable: false,
    selectable: false,
    data: {
      text: "Y",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Left,
    },
  },
  {
    id: "Y*",
    type: "protein" as CircuitNodeTypes,
    position: { x: 300, y: 160 },
    draggable: false,
    selectable: false,
    data: {
      text: "Y*",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      progress: 0,
      isAccumulating: false,
    },
  },
  {
    id: "Z",
    type: "protein" as CircuitNodeTypes,
    position: { x: 400, y: 135 },
    draggable: false,
    selectable: false,
    data: {
      text: "Z",
      isActive: false,
      targetPosition: Position.Left,
      style: {
        opacity: 0.5,
        transform: "scale(1)",
        transition: "all 0.5s ease",
      },
    },
  },
];

// First define the X node position since other elements depend on it
const xNodePosition = proteinNodes.find((node) => node.id === "X")?.position;
const yNodePosition = proteinNodes.find((node) => node.id === "Y")?.position;

const circuitNodes: CircuitNode[] = [
  generateProximityZone("sx", xNodePosition, false),
  generateProximityZone("sy", yNodePosition, true),
  {
    id: "z-gene-line",
    type: "line" as CircuitNodeTypes,
    position: { x: 205, y: 207 },
    draggable: false,
    selectable: false,
    data: {
      length: 250,
      style: { zIndex: -1 },
    },
  },
  {
    id: "x-promoter",
    type: "promoter" as CircuitNodeTypes,
    position: { x: 225, y: 190 },
    draggable: false,
    selectable: false,
    data: {},
  },
  {
    id: "y-promoter",
    type: "promoter" as CircuitNodeTypes,
    position: { x: 285, y: 190 },
    draggable: false,
    selectable: false,
    data: {},
  },
  {
    id: "z-gene-arrow-node",
    type: "protein" as CircuitNodeTypes,
    position: { x: 350, y: 202 },
    draggable: false,
    selectable: false,
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
    data: {
      sourcePosition: Position.Top,
      svgStyle: {
        opacity: 0.01,
        width: 10,
        height: 10,
      },
    },
  },
  {
    id: "z-gene-label",
    type: "label" as CircuitNodeTypes,
    position: { x: 350, y: 210 },
    draggable: false,
    selectable: false,
    data: { label: "Gene Z" },
  },
];

export const initialNodes: CircuitNode[] = [...circuitNodes, ...proteinNodes];

export const initialEdges: CircuitEdge[] = [
  {
    id: "X-X*1",
    source: "X",
    target: "X*1",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "X*1-X*2",
    source: "X*1",
    target: "X*2",
    type: "step",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "X*1-Y",
    source: "X*1",
    target: "Y",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "Y-Y*",
    source: "Y",
    target: "Y*",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "z-gene-to-Z",
    source: "z-gene-arrow-node",
    target: "Z",
    animated: false,
    style: { ...edgeStyles.style },
    markerEnd: edgeStyles.markerEnd,
  },
];
