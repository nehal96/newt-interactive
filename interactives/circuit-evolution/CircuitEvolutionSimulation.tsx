import { ReactFlow, Background, Controls } from "@xyflow/react";
import {
  InteractiveTutorialContainer,
  CircleNode,
  NANDNode,
} from "../../components";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  circle: CircleNode,
  nandGate: NANDNode,
};

const CircuitEvolutionSimulation = () => {
  const nodes = [
    {
      id: "1",
      type: "nandGate",
      position: { x: 100, y: 100 },
      data: {
        color: "#3f3f46",
      },
    },
  ];

  return (
    <InteractiveTutorialContainer>
      <div className="w-1/2 h-[400px] border border-slate-200 rounded-md">
        <ReactFlow fitView nodes={nodes} edges={[]} nodeTypes={nodeTypes}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default CircuitEvolutionSimulation;
