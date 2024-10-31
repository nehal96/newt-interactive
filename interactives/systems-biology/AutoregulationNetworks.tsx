import { useEffect, useState } from "react";
import { useRandomGNMNetwork } from "../erdos-renyi-graph/hooks";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
} from "@xyflow/react";
import {
  CircleNode,
  FloatingEdge,
  InteractiveContainer,
  InteractiveTutorialContainer,
} from "../../components";
import { getEdgeOptions } from "../erdos-renyi-graph/utils";
import "@xyflow/react/dist/style.css";

export const ErdosRenyiRandomNetwork = () => {
  const [numNodes] = useState(10);
  const [numEdges] = useState(14);

  const { nodes, edges, generateNetwork } = useRandomGNMNetwork({
    numNodes,
    numEdges,
    graphType: "undirected",
    withSelfLoops: true,
  });

  useEffect(() => {
    generateNetwork();
  }, []);

  const edgeOptions = getEdgeOptions("undirected");

  const nodeTypes = {
    circle: CircleNode,
  };
  const edgeTypes = {
    floating: FloatingEdge,
  };

  return (
    <InteractiveTutorialContainer>
      <InteractiveContainer className="lg:w-1/2">
        <div className="h-[350px] p-3 border border-gray-200 rounded-md">
          <ReactFlow
            fitView
            fitViewOptions={{
              maxZoom: 0.7,
            }}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={edgeOptions}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </InteractiveContainer>
    </InteractiveTutorialContainer>
  );
};

export const ErdosRenyiRandomNetworkWithProvider = () => {
  return (
    <ReactFlowProvider>
      <ErdosRenyiRandomNetwork />
    </ReactFlowProvider>
  );
};
