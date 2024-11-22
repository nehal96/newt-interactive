import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  StraightEdge,
} from "@xyflow/react";
import {
  InteractiveTutorialContainer,
  CircleNode,
  NANDNode,
} from "../../components";
import "@xyflow/react/dist/style.css";
import { useEffect } from "react";

const nodeTypes = {
  circle: CircleNode,
  nandGate: NANDNode,
};

const edgeTypes = {
  straight: StraightEdge,
};

const CircuitEvolutionSimulation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes([
      {
        id: "1",
        type: "circle",
        position: { x: 50, y: 25 },
        data: {
          color: "#3f3f46",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "2",
        type: "circle",
        position: { x: 150, y: 25 },
        data: {
          color: "#3f3f46",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "3",
        type: "circle",
        position: { x: 250, y: 25 },
        data: {
          color: "#3f3f46",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "4",
        type: "circle",
        position: { x: 350, y: 25 },
        data: {
          color: "#3f3f46",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "5",
        type: "nandGate",
        position: { x: 100, y: 100 },
        data: {
          color: "#3f3f46",
        },
      },
      {
        id: "6",
        type: "nandGate",
        position: { x: 200, y: 100 },
        data: {
          color: "#3f3f46",
        },
      },
      {
        id: "7",
        type: "nandGate",
        position: { x: 150, y: 175 },
        data: {
          color: "#3f3f46",
        },
      },
      {
        id: "8",
        type: "nandGate",
        position: { x: 250, y: 175 },
        data: {
          color: "#3f3f46",
        },
      },
      {
        id: "9",
        type: "nandGate",
        position: { x: 200, y: 250 },
        data: {
          color: "#3f3f46",
        },
      },
    ]);

    setEdges([
      {
        id: "e1-5",
        source: "1",
        target: "5",
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
      },
      {
        id: "e2-6",
        source: "2",
        target: "6",
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
      },
      {
        id: "e4-8",
        source: "4",
        target: "8",
      },
      {
        id: "e5-7",
        source: "5",
        target: "7",
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
      },
      {
        id: "e6-8",
        source: "6",
        target: "8",
      },
      {
        id: "e7-9",
        source: "7",
        target: "9",
      },
      {
        id: "e8-9",
        source: "8",
        target: "9",
      },
    ]);
  }, []);

  return (
    <InteractiveTutorialContainer>
      <div className="w-1/2 h-[400px] border border-slate-200 rounded-md">
        <ReactFlow
          fitView
          fitViewOptions={{
            maxZoom: 0.9,
          }}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: "straight",
            style: {
              stroke: "#3f3f46",
            },
          }}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default CircuitEvolutionSimulation;
