import { useEffect } from "react";
import { useRandomGNMNetwork } from "../erdos-renyi-graph/hooks";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import {
  Button,
  CircleNode,
  FloatingEdge,
  InteractiveContainer,
  InteractiveTutorialContainer,
} from "../../components";
import { getEdgeOptions } from "../erdos-renyi-graph/utils";
import "@xyflow/react/dist/style.css";
import { FiRefreshCw } from "react-icons/fi";
const NUM_NODES = 10;
const NUM_EDGES = 14;
const edgeOptions = getEdgeOptions("directed");
const nodeTypes = {
  circle: CircleNode,
};
const edgeTypes = {
  floating: FloatingEdge,
};

const REAL_NETWORK_POSITIONS = [
  { x: 250, y: 0 },
  { x: 150, y: 100 },
  { x: 350, y: 100 },
  { x: 50, y: 200 },
  { x: 150, y: 200 },
  { x: 250, y: 200 },
  { x: 350, y: 200 },
  { x: 450, y: 200 },
  { x: 300, y: 300 },
  { x: 400, y: 300 },
] as const;
const REAL_NETWORK_EXAMPLE_NODES = REAL_NETWORK_POSITIONS.map(
  (position, index) => ({
    id: index.toString(),
    type: "circle",
    data: { color: "#3f3f46" },
    position,
  })
);
const REAL_NETWORK_EDGES = [
  { id: "0->0", source: "0", target: "0", type: "floating" },
  { id: "0->1", source: "0", target: "1", type: "floating" },
  { id: "0->2", source: "0", target: "2", type: "floating" },
  { id: "0->5", source: "0", target: "5", type: "floating" },
  { id: "1->1", source: "1", target: "1", type: "floating" },
  { id: "1->3", source: "1", target: "3", type: "floating" },
  { id: "1->4", source: "1", target: "4", type: "floating" },
  { id: "1->5", source: "1", target: "5", type: "floating" },
  { id: "2->2", source: "2", target: "2", type: "floating" },
  { id: "2->6", source: "2", target: "6", type: "floating" },
  { id: "2->7", source: "2", target: "7", type: "floating" },
  { id: "5->5", source: "5", target: "5", type: "floating" },
  { id: "6->8", source: "6", target: "8", type: "floating" },
  { id: "6->9", source: "6", target: "9", type: "floating" },
];

const RANDOM_NETWORK_POSITIONS = [
  { x: 250, y: 0 },
  { x: 100, y: 100 },
  { x: 400, y: 100 },
  { x: 300, y: 150 },
  { x: 25, y: 175 },
  { x: 200, y: 225 },
  { x: 450, y: 250 },
  { x: 100, y: 325 },
  { x: 400, y: 350 },
  { x: 250, y: 400 },
] as const;
const RANDOM_NETWORK_NODES = RANDOM_NETWORK_POSITIONS.map(
  (position, index) => ({
    id: index.toString(),
    type: "circle",
    data: { color: "#3f3f46" },
    position,
  })
);

const ExampleRealNetwork = () => {
  return (
    <div className="h-[350px] p-3 border border-gray-200 rounded-md">
      <ReactFlow
        fitView
        fitViewOptions={{
          padding: 0.4,
        }}
        nodes={REAL_NETWORK_EXAMPLE_NODES}
        edges={REAL_NETWORK_EDGES}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={edgeOptions}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const ErdosRenyiRandomNetwork = () => {
  const { edges, generateNetwork } = useRandomGNMNetwork({
    numNodes: NUM_NODES,
    numEdges: NUM_EDGES,
    graphType: "directed",
    withSelfLoops: true,
  });
  const { fitView } = useReactFlow();

  useEffect(() => {
    generateNetwork();
  }, []);

  const callback = () => {
    setTimeout(() => {
      fitView({
        padding: 0.2,
        duration: 350,
      });
    }, 0);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          className="absolute bg-white inline-flex items-center py-3 px-3 -top-3 -right-3 sm:px-3 sm:py-1 sm:-top-4 sm:-right-4"
          onClick={() => generateNetwork(callback)}
        >
          <span className="hidden sm:inline-block">Regenerate Network</span>
          <FiRefreshCw size={16} className="sm:ml-1.5" />
        </Button>
      </div>
      <div className="h-[350px] p-3 border border-gray-200 rounded-md">
        <ReactFlow
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
          nodes={RANDOM_NETWORK_NODES}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={edgeOptions}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
};

export const AutoregulationNetworkComparisonTutorial = () => {
  return (
    <InteractiveTutorialContainer className="flex-col">
      <InteractiveContainer className="lg:w-1/2">
        <ReactFlowProvider>
          <ExampleRealNetwork />
        </ReactFlowProvider>
      </InteractiveContainer>
      <InteractiveContainer className="lg:w-1/2">
        <ReactFlowProvider>
          <ErdosRenyiRandomNetwork />
        </ReactFlowProvider>
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};
