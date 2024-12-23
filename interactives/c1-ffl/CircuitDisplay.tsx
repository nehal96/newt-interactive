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

const CircuitDisplay = ({
  nodes: initialNodes,
  edges: initialEdges,
}: CircuitDisplayProps) => {
  // Add Sx node to the existing nodes
  const [nodes, setNodes, onNodesChange] = useNodesState([
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

  // Memoize the X node lookup
  const xNode = useMemo(() => nodes.find((n) => n.id === "1"), [nodes]);

  // Throttle the drag handler for better performance
  const onNodeDrag = useCallback(
    throttle((_, node: Node) => {
      if (node.id === "sx" && xNode) {
        // Calculate distance between Sx and X
        const distance = Math.sqrt(
          Math.pow(node.position.x - xNode.position.x, 2) +
            Math.pow(node.position.y - xNode.position.y, 2)
        );

        // Update edges with animation based on proximity
        setEdges((currentEdges) =>
          currentEdges.map((edge) => {
            if (edge.source === "1") {
              return {
                ...edge,
                animated: distance < PROXIMITY_THRESHOLD,
              };
            }
            return edge;
          })
        );
      }
    }, 16), // Throttle to roughly 60fps
    [xNode]
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
