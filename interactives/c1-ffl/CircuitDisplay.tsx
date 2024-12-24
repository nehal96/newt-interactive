import { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Position,
  useNodesState,
  useEdgesState,
  EdgeMarker,
  Edge,
} from "@xyflow/react";
import {
  CircleNode,
  CircuitPromoterNode,
  CircuitProteinNode,
  LineNode,
} from "../../components";
import { throttle } from "lodash";
import { ZState } from "./types";

const nodeTypes = {
  circle: CircleNode,
  protein: CircuitProteinNode,
  promoter: CircuitPromoterNode,
  line: LineNode,
};

const PROXIMITY_THRESHOLD = 40; // Distance in pixels to consider Sx "near" X
const BUFFER = 2.5;
const ACTIVE_TF_Y_OFFSET = 17;

interface CircuitDisplayProps {
  nodes: Node[];
  edges: Edge[];
  onProximityChange?: (isNear: boolean) => void;
  accumulationProgress?: number;
  isAccumulating?: boolean;
  signalForX?: boolean;
  zState: ZState;
}

const CircuitDisplay = ({
  nodes: initialNodes,
  edges: initialEdges,
  onProximityChange,
  accumulationProgress = 0,
  isAccumulating = false,
  signalForX = false,
  zState,
}: CircuitDisplayProps) => {
  // Find X node position from initialNodes
  const xNode = initialNodes.find((n) => n.id === "1");

  // Add proximity zone node centered on X node
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "proximity-zone",
      type: "circle",
      // This is hardcoded and should probs be changed later. Imp. to note that
      // position is top left corner of svg, not centre of circle
      position: {
        x: 100 - (PROXIMITY_THRESHOLD + 14 + BUFFER) / 2 + 14,
        y: 100 - (PROXIMITY_THRESHOLD + 14 + BUFFER) / 2 + 14,
      },
      data: {
        isProximity: true,
        style: {
          width: PROXIMITY_THRESHOLD + 14 + BUFFER,
          height: PROXIMITY_THRESHOLD + 14 + BUFFER,
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
      type: "line",
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
      type: "promoter",
      position: { x: 225, y: 190 },
      draggable: false,
      selectable: false,
      data: {},
    },
    {
      id: "y-promoter",
      type: "promoter",
      position: { x: 285, y: 190 },
      draggable: false,
      selectable: false,
      data: {},
    },
    ...initialNodes,
    {
      id: "sx",
      type: "circle",
      position: { x: 50, y: 50 },
      data: {
        text: "Sx",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
      draggable: true,
    },
    {
      id: "5",
      type: "protein",
      position: { x: 300, y: 160 },
      draggable: false,
      selectable: false,
      data: {
        text: "Y*",
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        progress: accumulationProgress,
        isAccumulating: isAccumulating,
      },
    },
    {
      id: "z-protein",
      type: "protein",
      position: { x: 400, y: 135 },
      draggable: false,
      selectable: false,
      data: {
        text: "Z",
        isActive: zState === "accumulating",
        style: {
          opacity: zState === "inactive" ? 0.5 : 1,
          transform: zState === "accumulating" ? "scale(1)" : "none",
          transition: "all 0.5s ease",
        },
      },
    },
  ]);

  // Update both X* and Y* nodes when state changes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "5") {
          const baseY = 160; // change after initial nodes are cleaned up

          return {
            ...node,
            data: {
              ...node.data,
              progress: accumulationProgress,
              isAccumulating: isAccumulating,
            },
            position: {
              x: node.position.x,
              y: baseY + (accumulationProgress === 1 ? ACTIVE_TF_Y_OFFSET : 0),
            },
            style: { transition: "all 0.5s ease" },
          };
        }
        if (node.id === "y-promoter") {
          return {
            ...node,
            data: {
              ...node.data,
              style: {
                stroke: accumulationProgress === 1 ? "#22c55e" : "#52525b",
                strokeWidth: accumulationProgress === 1 ? 2 : 1.5,
              },
            },
          };
        }
        if (node.id === "3") {
          const baseY = initialNodes.find((n) => n.id === "3")?.position.y;

          return {
            ...node,
            data: {
              ...node.data,
              progress: signalForX ? 1 : 0,
              isAccumulating: false,
            },
            position: {
              x: node.position.x,
              y: baseY + (signalForX ? ACTIVE_TF_Y_OFFSET : 0),
            },
            style: { transition: "all 0.5s ease" },
          };
        }
        if (node.id === "x-promoter") {
          return {
            ...node,
            data: {
              ...node.data,
              style: {
                stroke: signalForX ? "#22c55e" : "#52525b",
                strokeWidth: signalForX ? 2 : 1.5,
              },
            },
          };
        }
        if (node.id === "z-protein") {
          return {
            ...node,
            data: {
              ...node.data,
              isActive: signalForX && accumulationProgress === 1,
              style: {
                opacity: zState === "inactive" ? 0.5 : 1,
              },
            },
          };
        }

        return node;
      })
    );
  }, [signalForX, accumulationProgress, isAccumulating]);

  // Update edges with initial styling
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Throttle the drag handler for better performance
  const onNodeDrag = useCallback(
    throttle((_, node: Node) => {
      if (node.id === "sx" && xNode) {
        const distance = Math.sqrt(
          Math.pow(node.position.x - xNode.position.x, 2) +
            Math.pow(node.position.y - xNode.position.y, 2)
        );

        const isNear = distance < PROXIMITY_THRESHOLD;

        // Update edges animation and style
        setEdges((currentEdges) =>
          currentEdges.map((edge) => ({
            ...edge,
            animated:
              edge.source === "1" || edge.source === "2" || edge.source === "4"
                ? isNear
                : edge.animated,
            style: {
              ...edge.style,
              stroke: isNear ? "#3f3f46" : "#a1a1aa",
            },
            markerEnd: {
              ...(edge.markerEnd as EdgeMarker),
              color: isNear ? "#3f3f46" : "#a1a1aa",
            },
          }))
        );

        // Update proximity zone color
        setNodes((currentNodes) =>
          currentNodes.map((node) =>
            node.id === "proximity-zone"
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    style: {
                      ...(node.data.style as {}),
                      backgroundColor: isNear
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(248, 113, 113, 0.1)",
                      border: isNear
                        ? "2px dashed #86efac"
                        : "2px dashed #fca5a5",
                    },
                  },
                }
              : node
          )
        );

        // Notify parent component
        onProximityChange?.(isNear);
      }
    }, 16),
    [xNode, onProximityChange]
  );

  return (
    <div className="w-full h-[350px] lg:w-2/5 mb-4 lg:mb-0 border rounded-md border-slate-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeDrag={onNodeDrag}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CircuitDisplay;
