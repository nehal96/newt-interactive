import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  useNodesState,
  useEdgesState,
  EdgeMarker,
} from "@xyflow/react";
import { throttle } from "lodash";
import { ZState } from "./types";
import { initialNodes, initialEdges } from "./data";
import { CIRCUIT_CONFIG, nodeTypes } from "./config";

interface CircuitDisplayProps {
  onProximityChange?: (isNear: boolean) => void;
  accumulationProgress?: number;
  isAccumulating?: boolean;
  signalForX?: boolean;
  zState: ZState;
  isPlaying?: boolean;
}

const CircuitDisplay = ({
  onProximityChange,
  accumulationProgress = 0,
  isAccumulating = false,
  signalForX = false,
  zState,
  isPlaying = false,
}: CircuitDisplayProps) => {
  // Find X node position from initialNodes
  const xNode = initialNodes.find((n) => n.id === "1");

  // Add proximity zone node centered on X node
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
              y:
                baseY +
                (accumulationProgress === 1
                  ? CIRCUIT_CONFIG.ACTIVE_TF_Y_OFFSET
                  : 0),
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
          const baseY =
            initialNodes.find((n) => n.id === "3")?.position.y || 160;

          return {
            ...node,
            data: {
              ...node.data,
              progress: signalForX ? 1 : 0,
              isAccumulating: false,
            },
            position: {
              x: node.position.x,
              y: baseY + (signalForX ? CIRCUIT_CONFIG.ACTIVE_TF_Y_OFFSET : 0),
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

    // Update all edges
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === "z-gene-to-protein") {
          return {
            ...edge,
            animated: zState === "accumulating" && isPlaying,
            style: {
              ...edge.style,
              stroke:
                zState === "accumulating" && isPlaying ? "#3f3f46" : "#a1a1aa",
            },
            markerEnd: {
              ...(edge.markerEnd as EdgeMarker),
              color:
                zState === "accumulating" && isPlaying ? "#3f3f46" : "#a1a1aa",
            },
          };
        }
        // Handle other edges
        return {
          ...edge,
          animated:
            (edge.source === "1" ||
              edge.source === "2" ||
              edge.source === "4") &&
            isPlaying &&
            signalForX,
        };
      })
    );
  }, [signalForX, accumulationProgress, isAccumulating, zState, isPlaying]);

  // Throttle the drag handler for better performance
  const onNodeDrag = useCallback(
    throttle((_, node: Node) => {
      if (node.id === "sx" && xNode) {
        const distance = Math.sqrt(
          Math.pow(node.position.x - xNode.position.x, 2) +
            Math.pow(node.position.y - xNode.position.y, 2)
        );

        const isNear = distance < CIRCUIT_CONFIG.PROXIMITY_THRESHOLD;

        // Update edges animation and style, excluding z-gene-to-protein edge
        setEdges((currentEdges) =>
          currentEdges.map((edge) => {
            if (edge.id === "z-gene-to-protein") {
              return edge; // Skip modifications for this edge
            }
            return {
              ...edge,
              animated:
                (edge.source === "1" ||
                  edge.source === "2" ||
                  edge.source === "4") &&
                isNear &&
                isPlaying,
              style: {
                ...edge.style,
                stroke: isNear ? "#3f3f46" : "#a1a1aa",
              },
              markerEnd: {
                ...(edge.markerEnd as EdgeMarker),
                color: isNear ? "#3f3f46" : "#a1a1aa",
              },
            };
          })
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
