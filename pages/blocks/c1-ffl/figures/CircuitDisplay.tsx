import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  useNodesState,
  useEdgesState,
  EdgeMarker,
  useReactFlow,
} from "@xyflow/react";
import { throttle, debounce } from "lodash";
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
  const { getNode } = useReactFlow();

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

  // Add local state for proximity
  const [isNearSignal, setIsNearSignal] = useState(false);

  // Debounce the store update
  const debouncedSetSignalForX = useCallback(
    debounce((value: boolean) => {
      onProximityChange?.(value);
    }, 100),
    [onProximityChange]
  );

  // Throttle the drag handler for better performance
  const onNodeDrag = useCallback(
    throttle((_, node: Node) => {
      const xNode = getNode("X");

      if (node.id === "Sx" && xNode) {
        // Calculate distance between centers
        const distance = Math.sqrt(
          Math.pow(node.position.x - xNode.position.x, 2) +
            Math.pow(node.position.y - xNode.position.y, 2)
        );

        // Use the actual SVG circle radius of 12.5
        const sxRadius = CIRCUIT_CONFIG.NODE_DIMENSIONS.PROTEIN.CIRCLE_RADIUS;
        // Proximity zone radius is half of PROXIMITY_THRESHOLD
        const proximityRadius = CIRCUIT_CONFIG.PROXIMITY_THRESHOLD / 2;

        // Node is "near" when the edges touch, not the centers
        const isNear =
          distance <= proximityRadius + sxRadius - CIRCUIT_CONFIG.BUFFER;

        if (isNear !== isNearSignal) {
          setIsNearSignal(isNear);
          debouncedSetSignalForX(isNear);
        }

        // Update visual elements using local state
        setEdges((currentEdges) =>
          currentEdges.map((edge) => {
            if (edge.id === "z-gene-to-Z") return edge;
            return {
              ...edge,
              animated:
                (edge.source === "X" ||
                  edge.source === "X*1" ||
                  edge.source === "Y") &&
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
            node.id === "sx-proximity-zone"
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
    [isNearSignal, isPlaying, debouncedSetSignalForX]
  );

  return (
    <div className="w-full h-[350px] mb-4 lg:mb-0 border rounded-md border-slate-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeDrag={onNodeDrag}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{
          padding: 0.3,
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CircuitDisplay;
