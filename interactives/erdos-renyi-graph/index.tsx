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
import {
  Button,
  InteractiveContainer,
  InteractiveTutorialContainer,
  Slider,
  TextContainer,
  Tabs,
  TabsList,
  TabsTrigger,
  Switch,
} from "../../components";
import "@xyflow/react/dist/style.css";
import { FloatingEdge } from "../../components";
import {
  getUndirectedAndSelfLoopsMaxEdges,
  getMaxEdges,
  generateAllPossibleEdges,
  generateNodePositions,
  GraphType,
} from "./utils";

const CircleNode = ({ data, isConnectable }) => (
  <div
    style={{
      width: 25,
      height: 25,
      border: `1px solid ${data.color || "#cbd5e1"}`,
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
      color: "#020617",
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
  const [graphType, setGraphType] = useState<GraphType>("undirected");
  const [withSelfLoops, setWithSelfLoops] = useState(true);

  const [numNodes, setNumNodes] = useState(10);
  const [numEdges, setNumEdges] = useState(14);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { fitView } = useReactFlow();

  // Calculate maximum possible edges including self-loops
  const maxEdges = getMaxEdges(numNodes, graphType, withSelfLoops);

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
    const allPossibleEdges = generateAllPossibleEdges(
      numNodes,
      graphType,
      withSelfLoops
    );
    const shuffledEdges = shuffleArray([...allPossibleEdges]);

    // take first m edges
    const selectedEdges = shuffledEdges.slice(0, numEdges);

    setNodes(nodePositions);
    setEdges(selectedEdges);

    // Add setTimeout to ensure the nodes are rendered before fitting view
    setTimeout(() => {
      fitView({ maxZoom: 0.7, duration: 150 });
    }, 0);
  }, [numNodes, numEdges, maxEdges, withSelfLoops, graphType]);

  const onGraphTypeChange = (value: GraphType) => {
    setGraphType(value);
    // Update number of edges if it exceeds new maximum
    const newMaxEdges = getMaxEdges(numNodes, value, withSelfLoops);
    if (numEdges > newMaxEdges) {
      setNumEdges(newMaxEdges);
    }
  };
  const onWithSelfLoopsChange = (checked: boolean) => {
    setWithSelfLoops(checked);
    const newMaxEdges = getMaxEdges(numNodes, graphType, checked);
    if (numEdges > newMaxEdges) {
      setNumEdges(newMaxEdges);
    }
  };

  const edgeOptions = {
    type: "floating",
    style: {
      strokeWidth: 2,
      stroke: "#a1a1aa",
    },
    ...(graphType === "directed" && {
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 12,
        color: "#a1a1aa",
      },
    }),
  };

  return (
    <InteractiveTutorialContainer className="flex-col">
      <TextContainer className="lg:w-1/2 bg-white border border-gray-200 rounded-md w-full max-w-[550px] self-center">
        <div className="space-y-4">
          <div className="justify-between flex items-center">
            <label className="text-sm font-medium">Graph type:</label>
            <Tabs
              defaultValue="directed"
              value={graphType}
              onValueChange={onGraphTypeChange}
            >
              <TabsList className="bg-slate-100">
                <TabsTrigger
                  className="data-[state=active]:bg-white"
                  value="directed"
                >
                  Directed
                </TabsTrigger>
                <TabsTrigger
                  className="data-[state=active]:bg-white"
                  value="undirected"
                >
                  Undirected
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Allow self-loops</label>
            <Switch
              checked={withSelfLoops}
              onCheckedChange={onWithSelfLoopsChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Number of nodes (n): {numNodes}
            </label>
            <Slider
              value={[numNodes]}
              onValueChange={([value]) => {
                setNumNodes(value);
                setNumEdges(
                  Math.min(numEdges, getUndirectedAndSelfLoopsMaxEdges(value))
                );
              }}
              min={2}
              max={20}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Number of edges (m): {numEdges}
              <span className="text-xs text-slate-400 float-right mt-2">
                max: {maxEdges}
              </span>
            </label>
            <Slider
              value={[numEdges]}
              onValueChange={([value]) => setNumEdges(value)}
              min={0}
              max={maxEdges}
            />
          </div>
        </div>
        <Button
          variant="outline"
          className="max-w-fit mt-4 self-center mb-2"
          onClick={generateRandomNetwork}
        >
          Generate Network
        </Button>
      </TextContainer>
      <InteractiveContainer className="lg:w-1/2">
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

const ErdosRenyiGNMNetworkWithProvider = () => (
  <ReactFlowProvider>
    <ErdosRenyiGNMNetwork />
  </ReactFlowProvider>
);

export default ErdosRenyiGNMNetworkWithProvider;
