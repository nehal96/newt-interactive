import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CircleNode, InteractiveTutorialContainer } from "../../components";

const nodeTypes = {
  circle: CircleNode,
};

const C1FFLDynamicsSimulator = () => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      type: "circle",
      position: { x: 100, y: 100 },
      data: {
        text: "X",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    },
    {
      id: "2",
      type: "circle",
      position: { x: 200, y: 100 },
      data: {
        text: "X*",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    {
      id: "1-2",
      source: "1",
      target: "2",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#a1a1aa",
        width: 8,
        height: 8,
      },
      style: {
        stroke: "#a1a1aa",
        strokeWidth: 2,
      },
    },
  ]);

  return (
    <InteractiveTutorialContainer>
      <div className="w-full h-[350px] border rounded-md border-slate-200">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default C1FFLDynamicsSimulator;
