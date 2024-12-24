import { Position } from "@xyflow/react";
import { edgeStyles } from "./utils";
import { CIRCUIT_CONFIG } from "./config";
import { CircuitNode, CircuitNodeTypes } from "./types";
import { CircuitEdge } from "./types";

const proteinNodes: CircuitNode[] = [
  {
    id: "sx",
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
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "z-protein",
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

const circuitNodes: CircuitNode[] = [
  {
    id: "proximity-zone",
    type: "circle" as CircuitNodeTypes,
    // This is hardcoded and should probs be changed later. Imp. to note that
    // position is top left corner of svg, not centre of circle
    position: {
      x:
        100 -
        (CIRCUIT_CONFIG.PROXIMITY_THRESHOLD + 14 + CIRCUIT_CONFIG.BUFFER) / 2 +
        14,
      y:
        100 -
        (CIRCUIT_CONFIG.PROXIMITY_THRESHOLD + 14 + CIRCUIT_CONFIG.BUFFER) / 2 +
        14,
    },
    data: {
      isProximity: true,
      style: {
        width: CIRCUIT_CONFIG.PROXIMITY_THRESHOLD + 14 + CIRCUIT_CONFIG.BUFFER,
        height: CIRCUIT_CONFIG.PROXIMITY_THRESHOLD + 14 + CIRCUIT_CONFIG.BUFFER,
        backgroundColor: "rgba(248, 113, 113, 0.1)",
        border: "2px dashed #fca5a5",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: -1,
      },
    },
    draggable: false,
    selectable: false,
  },
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
      style: {
        opacity: 0.01,
        width: 10,
        height: 10,
      },
    },
  },
];

export const initialNodes: CircuitNode[] = [...circuitNodes, ...proteinNodes];

export const initialEdges: CircuitEdge[] = [
  {
    id: "1-2",
    source: "1",
    target: "2",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "2-3",
    source: "2",
    target: "3",
    type: "step",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "2-4",
    source: "2",
    target: "4",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "4-5",
    source: "4",
    target: "5",
    animated: false,
    markerEnd: edgeStyles.markerEnd,
    style: edgeStyles.style,
  },
  {
    id: "z-gene-to-protein",
    source: "z-gene-arrow-node",
    target: "z-protein",
    animated: false,
    style: { ...edgeStyles.style },
    markerEnd: edgeStyles.markerEnd,
  },
];
