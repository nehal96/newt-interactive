import { memo, useState } from "react";
import { ReactFlow, Background, Controls, StraightEdge } from "@xyflow/react";
import { FiInfo } from "react-icons/fi";
import {
  Button,
  Checkbox,
  CircleNode,
  NANDNode,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
  Tabs,
  TabsTrigger,
  TabsList,
  Popover,
} from "../../components";
import { CIRCUIT_CONFIG } from "./config";
import {
  SimulationType,
  CircuitDisplayProps,
  SimulationTypeToggleProps,
} from "./types";

const nodeTypes = {
  circle: CircleNode,
  nandGate: NANDNode,
};

const edgeTypes = {
  straight: StraightEdge,
};

const Circuit = ({ nodes, edges, onNodesChange, onEdgesChange }) => (
  <div className="h-[300px] md:h-[400px] border border-slate-200 rounded-md">
    <ReactFlow
      fitView
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={{
        type: "straight",
        style: { stroke: "#3f3f46" },
      }}
    >
      <Background />
      <Controls />
    </ReactFlow>
  </div>
);

const SimulationTypeInfoPopoverContent = memo(() => (
  <div className="text-sm font-body">
    <div className="mb-2">
      When <span className="font-semibold">Mutation</span> is selected, a single
      random change is made to the circuit &mdash; in this case, adding,
      removing, or modifying a connection.
    </div>
    <div>
      When <span className="font-semibold">Generation</span> is selected,
      multiple circuit variations are created, each with a single mutation, and
      the best performing one is chosen, similar to natural selection.
    </div>
  </div>
));

const SimulationTypeToggle = ({
  simulationType,
  setSimulationType,
  chartData,
  resetCircuit,
  showResetWarning,
  setShowResetWarning,
  skipResetWarning,
  setSkipResetWarning,
}: SimulationTypeToggleProps) => {
  const [pendingSimulationType, setPendingSimulationType] =
    useState<SimulationType | null>(null);

  const handleSimulationTypeChange = (value: SimulationType) => {
    if (chartData.length <= 1 || skipResetWarning) {
      setSimulationType(value);
      resetCircuit();
      return;
    }

    setPendingSimulationType(value);
    setShowResetWarning(true);
  };

  return (
    <div className="flex items-center">
      <Tabs value={simulationType} onValueChange={handleSimulationTypeChange}>
        <TabsList>
          <TabsTrigger className="text-sm" value={SimulationType.MUTATION}>
            Mutation
          </TabsTrigger>
          <TabsTrigger className="text-sm" value={SimulationType.GENERATION}>
            Generation
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <Dialog open={showResetWarning} onOpenChange={setShowResetWarning}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Simulation?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Changing the simulation type will reset your current progress. Do
            you want to continue?
          </div>
          <DialogFooter className="flex justify-between items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="skipWarning"
                checked={skipResetWarning}
                onCheckedChange={setSkipResetWarning}
              />
              <label
                htmlFor="skipWarning"
                className="text-sm text-slate-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Don't ask me again
              </label>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowResetWarning(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="bg-slate-800 hover:bg-slate-900"
                onClick={() => {
                  if (pendingSimulationType) {
                    setSimulationType(pendingSimulationType);
                    resetCircuit();
                  }
                  setShowResetWarning(false);
                }}
              >
                Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const CircuitDisplay = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  simulate,
  resetCircuit,
  simulationType,
  setSimulationType,
  chartData,
  showResetWarning,
  setShowResetWarning,
  skipResetWarning,
  setSkipResetWarning,
}: CircuitDisplayProps) => (
  <div className="flex flex-col w-full lg:w-1/3">
    <Circuit
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    />
    <div className="mt-6 flex flex-col self-center font-mono max-w-[400px]">
      <div className="flex justify-between items-center mb-5">
        <div className="flex text-sm items-center">
          Simulation type:
          <Popover
            side="right"
            trigger={
              <button className="text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1 mr-1">
                <FiInfo size={16} />
              </button>
            }
            content={<SimulationTypeInfoPopoverContent />}
            className="md:max-w-[450px]"
          />
        </div>
        <SimulationTypeToggle
          simulationType={simulationType}
          setSimulationType={setSimulationType}
          chartData={chartData}
          resetCircuit={resetCircuit}
          showResetWarning={showResetWarning}
          setShowResetWarning={setShowResetWarning}
          skipResetWarning={skipResetWarning}
          setSkipResetWarning={setSkipResetWarning}
        />
      </div>
      <Button
        variant="primary"
        onClick={simulate}
        disabled={chartData.length >= CIRCUIT_CONFIG.MAX_GENERATIONS}
      >
        Simulate a{" "}
        {simulationType === SimulationType.MUTATION ? "Mutation" : "Generation"}
      </Button>
      <Button
        className="mt-2 mb-4 lg:mb-0"
        variant="outline"
        onClick={resetCircuit}
      >
        Reset
      </Button>
    </div>
  </div>
);

export default CircuitDisplay;
