import { useCallback, useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Handle,
  Position,
  MarkerType,
  Edge,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { Button, InteractiveContainer } from "../../components";
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

const nodeTypes = {
  circle: CircleNode,
};
const edgeTypes = {
  floating: FloatingEdge,
};
const initialNodes: Node[] = [
  {
    id: "1",
    type: "circle",
    position: { x: 250, y: 20 },
    data: {
      color: "#020617",
    },
    sourcePosition: Position.Left,
    targetPosition: Position.Right,
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

const initialEdges: Edge[] = [
  {
    id: "1->1",
    source: "1",
    target: "1",
    type: "floating",
  },
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

const ErdosRenyiGNMNetwork = () => {
  const [numNodes, setNumNodes] = useState(10);
  const [numEdges, setNumEdges] = useState(14);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { fitView } = useReactFlow();

  // Calculate maximum possible edges including self-loops
  const maxEdges = Math.floor((numNodes * (numNodes + 1)) / 2);
  // const maxEdges = (numNodes * (numNodes - 1)) / 2;

  const generateAllPossibleEdges = (n: number) => {
    const allPossibleEdges = [];

    for (let i = 0; i < n; i++) {
      // include self-loops
      allPossibleEdges.push({
        id: `${i}->${i}`,
        source: `${i}`,
        target: `${i}`,
        type: "floating",
      });

      // include all other edges
      for (let j = i + 1; j < n; j++) {
        allPossibleEdges.push({
          id: `${i}->${j}`,
          source: `${i}`,
          target: `${j}`,
          type: "floating",
        });
      }
    }

    return allPossibleEdges;
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const generateRandomNetwork = useCallback(() => {
    if (numEdges > maxEdges) {
      alert("Number of edges cannot exceed maximum possible edges");
    }

    // set node positions
    const nodePositions = generateNodePositions(numNodes);

    // generate all possible edges and shuffle them
    const allPossibleEdges = generateAllPossibleEdges(numNodes);
    const shuffledEdges = shuffleArray([...allPossibleEdges]);

    // take first m edges
    const selectedEdges = shuffledEdges.slice(0, numEdges);

    setNodes(nodePositions);
    setEdges(selectedEdges);

    // Add setTimeout to ensure the nodes are rendered before fitting view
    setTimeout(() => {
      fitView({ maxZoom: 0.7, duration: 150 });
    }, 0);
  }, [numNodes, numEdges, maxEdges]);

  const generateNodePositions = (n: number, radius: number = 200) => {
    const nodes: Node[] = [];
    const angleStep = (2 * Math.PI) / n;

    for (let i = 0; i < n; i++) {
      const angle = i * angleStep;
      // Calculate x and y coordinates on the circle
      const x = radius * Math.cos(angle) + radius;
      const y = radius * Math.sin(angle) + radius;

      nodes.push({
        id: `${i}`,
        type: "circle",
        position: { x, y },
        data: {
          color: "#020617",
        },
      });
    }

    return nodes;
  };

  return (
    <>
      <Button
        variant="outline"
        className="max-w-fit self-center mb-2"
        onClick={generateRandomNetwork}
      >
        Generate Network
      </Button>
      <InteractiveContainer className="lg:w-full">
        <div className="h-[400px] p-3 border border-gray-200 rounded-md">
          <ReactFlow
            fitView
            fitViewOptions={{
              maxZoom: 0.8,
            }}
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
    </>
  );
};

const ErdosRenyiGNMNetworkWithProvider = () => (
  <ReactFlowProvider>
    <ErdosRenyiGNMNetwork />
  </ReactFlowProvider>
);

export default ErdosRenyiGNMNetworkWithProvider;
