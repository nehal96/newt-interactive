import { useState } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
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
  TooltipTrigger,
  Tooltip,
  TooltipContent,
  MathFormula,
} from "../../components";
import "@xyflow/react/dist/style.css";
import { FloatingEdge, CircleNode } from "../../components";
import { getMaxEdges, GraphType, getEdgeOptions } from "./utils";
import { FiInfo } from "react-icons/fi";
import { useRandomGNMNetwork } from "./hooks";

const GraphTypeTooltip = () => (
  <Tooltip>
    <TooltipTrigger>
      <FiInfo size={14} className="ml-[3px] -translate-y-1 inline-block" />
    </TooltipTrigger>
    <TooltipContent>
      <p>
        In a <strong>directed</strong> graph, the connections between nodes
        (edges) have a specific direction. A → B is different from B → A.
      </p>
      <p className="mt-2">
        In an <strong>undirected</strong> graph, the edges don't have a
        direction. A → B is the same as B → A.
      </p>
    </TooltipContent>
  </Tooltip>
);
const AllowSelfLoopsTooltip = () => (
  <Tooltip>
    <TooltipTrigger>
      <FiInfo size={14} className="ml-[3px] -translate-y-1 inline-block" />
    </TooltipTrigger>
    <TooltipContent>
      <p>Allow a node to connect to itself.</p>
    </TooltipContent>
  </Tooltip>
);

const nodeTypes = {
  circle: CircleNode,
};
const edgeTypes = {
  floating: FloatingEdge,
};

const ErdosRenyiGNMNetwork = () => {
  const [graphType, setGraphType] = useState<GraphType>("undirected");
  const [withSelfLoops, setWithSelfLoops] = useState(true);

  const [numNodes, setNumNodes] = useState(10);
  const [numEdges, setNumEdges] = useState(14);

  const { fitView } = useReactFlow();

  const { nodes, edges, maxEdges, generateNetwork } = useRandomGNMNetwork({
    numNodes,
    numEdges,
    graphType,
    withSelfLoops,
  });

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
  const onNumNodesChange = (value: number) => {
    setNumNodes(value);
    const newMaxEdges = getMaxEdges(value, graphType, withSelfLoops);
    if (numEdges > newMaxEdges) {
      setNumEdges(newMaxEdges);
    }
  };

  const edgeOptions = getEdgeOptions(graphType);

  const callback = () => {
    setTimeout(() => {
      fitView({
        padding: 0.4,
        duration: 350,
      });
    }, 0);
  };

  return (
    <InteractiveTutorialContainer className="flex-col">
      <TextContainer className="lg:w-1/2 w-full max-w-[550px] self-center">
        <div className="space-y-4">
          <div className="justify-between flex items-center">
            <label className="text-sm font-medium">
              Graph type
              <GraphTypeTooltip />
            </label>
            <Tabs
              defaultValue="directed"
              value={graphType}
              onValueChange={onGraphTypeChange}
            >
              <TabsList className="bg-slate-150">
                <TabsTrigger className="hover:bg-transparent" value="directed">
                  Directed
                </TabsTrigger>
                <TabsTrigger
                  className="hover:bg-transparent"
                  value="undirected"
                >
                  Undirected
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Allow self-loops
              <AllowSelfLoopsTooltip />
            </label>
            <Switch
              checked={withSelfLoops}
              onCheckedChange={onWithSelfLoopsChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Number of nodes (
              <MathFormula variant="tutorial" tex="n" />
              ): {numNodes}
            </label>
            <Slider
              value={[numNodes]}
              onValueChange={([value]) => onNumNodesChange(value)}
              min={2}
              max={20}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Number of edges (
              <MathFormula variant="tutorial" tex="M" />
              ): {numEdges}
              <span className="text-xs text-slate-500 float-right mt-2">
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
          variant="primary"
          className="max-w-fit px-4 mt-10 self-center mb-2 bg-zinc-700 hover:bg-zinc-800"
          onClick={() => generateNetwork(callback)}
        >
          Generate Network
        </Button>
      </TextContainer>
      <InteractiveContainer className="lg:w-1/2">
        <div className="h-[400px] p-3 border border-gray-200 rounded-md">
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

const ErdosRenyiGNMNetworkWithProvider = () => (
  <ReactFlowProvider>
    <ErdosRenyiGNMNetwork />
  </ReactFlowProvider>
);

export default ErdosRenyiGNMNetworkWithProvider;
