import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Position,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import { CircleNode } from "../../components";
import { CircuitDisplayProps } from "./types";
import { throttle } from "lodash";

const nodeTypes = {
  circle: CircleNode,
};

const PROXIMITY_THRESHOLD = 40; // Distance in pixels to consider Sx "near" X
const BUFFER = 2.5;

const CircuitDisplay = ({
  nodes: initialNodes,
  edges: initialEdges,
  onProximityChange,
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
        x: 100 - (PROXIMITY_THRESHOLD + 12.5 + BUFFER) / 2 + 12.5,
        y: 100 - (PROXIMITY_THRESHOLD + 12.5 + BUFFER) / 2 + 12.5,
      },
      data: {
        isProximity: true,
        style: {
          width: PROXIMITY_THRESHOLD + 12.5 + BUFFER,
          height: PROXIMITY_THRESHOLD + 12.5 + BUFFER,
          backgroundColor: "rgba(200, 200, 200, 0.1)",
          border: "2px dashed #ccc",
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
  ]);

  // Update edges with initial styling
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map((edge) => ({
      ...edge,
      animated: false as boolean,
      style: {
        ...edge.style,
        strokeDasharray: "5,5",
        opacity: 0.5,
      },
    }))
  );

  // Throttle the drag handler for better performance
  const onNodeDrag = useCallback(
    throttle((_, node: Node) => {
      if (node.id === "sx" && xNode) {
        const distance = Math.sqrt(
          Math.pow(node.position.x - xNode.position.x, 2) +
            Math.pow(node.position.y - xNode.position.y, 2)
        );

        const isNear = distance < PROXIMITY_THRESHOLD;

        // Update edges animation
        setEdges((currentEdges) =>
          currentEdges.map((edge) => ({
            ...edge,
            animated: edge.source === "1" ? isNear : edge.animated,
          }))
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
