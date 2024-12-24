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
import { updateNode, updateEdge, circuitStyles } from "./utils";

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
    const state = {
      signalForX,
      accumulationProgress,
      isAccumulating,
      zState,
      isPlaying,
    };

    setNodes((nds) => nds.map((node) => updateNode(node, state)));
    setEdges((eds) => eds.map((edge) => updateEdge(edge, state)));
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
                stroke: isNear
                  ? circuitStyles.edge.active.stroke
                  : circuitStyles.edge.inactive.stroke,
              },
              markerEnd: {
                ...(edge.markerEnd as EdgeMarker),
                color: isNear
                  ? circuitStyles.edge.active.markerColor
                  : circuitStyles.edge.inactive.markerColor,
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
                      ...(isNear
                        ? circuitStyles.proximityZone.near
                        : circuitStyles.proximityZone.far),
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
