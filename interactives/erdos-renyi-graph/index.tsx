import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import { InteractiveContainer } from "../../components";
import "@xyflow/react/dist/style.css";
import { FloatingEdge } from "../../components";

const CircleNode = ({ data, isConnectable }) => (
  <div
    style={{
      width: 25,
      height: 25,
      border: "1px solid #020617",
      borderRadius: "50%",
      backgroundColor: data.color || "#cbd5e1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Handle
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
      style={{
        visibility: "hidden",
      }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
      style={{
        visibility: "hidden",
      }}
    />
  </div>
);

const ErdosRenyiGNMNetwork = () => {
  const nodeTypes = {
    circle: CircleNode,
  };
  const edgeTypes = {
    floating: FloatingEdge,
  };

  const nodes: Node[] = [
    {
      id: "1",
      type: "circle",
      position: { x: 250, y: 20 },
      data: {
        color: "#020617",
      },
    },
    {
      id: "2",
      type: "circle",
      position: { x: 120, y: 150 },
      data: {
        color: "#020617",
      },
    },
    {
      id: "3",
      type: "circle",
      position: { x: 380, y: 150 },
      data: {
        color: "#fafafa",
      },
    },
  ];

  const edges = [
    {
      id: "1->2",
      source: "1",
      target: "2",
      type: "floating",
    },
    {
      id: "1->3",
      source: "1",
      target: "3",
      type: "floating",
    },
  ];

  return (
    <InteractiveContainer className="lg:w-full">
      <div className="h-[400px] p-3 border border-gray-200 rounded-md">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: "floating",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: "#020617",
            },
            style: {
              strokeWidth: 2,
              stroke: "#020617",
            },
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </InteractiveContainer>
  );
};

export default ErdosRenyiGNMNetwork;
