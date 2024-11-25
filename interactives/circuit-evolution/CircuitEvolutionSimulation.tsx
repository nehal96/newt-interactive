import { Fragment, useState } from "react";
import { ReactFlow, Background, Controls, StraightEdge } from "@xyflow/react";
import {
  VictoryChart,
  VictoryLine,
  VictoryContainer,
  VictoryAxis,
  VictoryScatter,
} from "victory";
import "@xyflow/react/dist/style.css";
import {
  InteractiveTutorialContainer,
  CircleNode,
  NANDNode,
  MathFormula,
  Button,
  Popover,
  Tabs,
  TabsTrigger,
  TabsList,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Checkbox,
} from "../../components";
import { useCircuitEvolution } from "./hooks";
import { fitnessChartAxisStyle } from "./utils";
import { FiInfo, FiX } from "react-icons/fi";
import {
  CircuitDisplayProps,
  SimulationType,
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
  <div className="h-[400px] border border-slate-200 rounded-md">
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

const SimulationTypeInfoPopoverContent = () => (
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
);

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
    if (chartData.length === 0 || skipResetWarning) {
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
    <div className="mt-6 flex flex-col font-mono">
      <div className="flex justify-between items-center mb-5">
        <div className="flex text-sm items-center">
          Simulation type:
          <Popover
            side="right"
            trigger={
              <button className="text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1">
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
        className="bg-slate-800 hover:bg-slate-900"
        onClick={simulate}
      >
        Simulate a{" "}
        {simulationType === SimulationType.MUTATION ? "Mutation" : "Generation"}
      </Button>
      <Button className="mt-2" variant="outline" onClick={resetCircuit}>
        Reset
      </Button>
    </div>
  </div>
);

const InputTable = ({ inputTableData }) => (
  <table className="w-full border border-slate-200 text-sm">
    <tbody>
      <tr className="border-b border-slate-200">
        <th className="text-left px-1.5 border-r border-slate-200">Inputs</th>
        {inputTableData.inputs.map((inputArray, arrayIndex) => (
          <Fragment key={`input-array-${arrayIndex}`}>
            {inputArray.map((input, idx) => (
              <td
                key={`input-${arrayIndex}-${idx}`}
                className="px-1.5 text-center border-r border-slate-200"
              >
                {input}
              </td>
            ))}
          </Fragment>
        ))}
      </tr>
      <tr className="border-b border-slate-200">
        <th className="text-left px-1 border-r border-slate-200">Gate</th>
        {inputTableData.gates.map((gate, index) => (
          <td
            key={`gate-${index}`}
            className="px-1.5 text-center border-r border-slate-200"
            colSpan={inputTableData.inputs[index].length}
          >
            {gate}
          </td>
        ))}
      </tr>
    </tbody>
  </table>
);

const TruthTable = ({ truthTable, accuracy }) => (
  <table className="font-mono border border-slate-200 w-full">
    <thead>
      <tr className="border-b border-slate-200">
        <th className="px-2 border-r border-slate-200">X</th>
        <th className="px-2 border-r border-slate-200">Y</th>
        <th className="px-2 border-r border-slate-200">Z</th>
        <th className="px-2 border-r border-slate-200">W</th>
        <th className="px-2 border-r border-slate-200">Circuit</th>
        <th className="px-2">Goal</th>
      </tr>
    </thead>
    <tbody>
      {truthTable.map((row, i) => (
        <tr key={i} className="border-b border-slate-200">
          {row.inputs.map((input, j) => (
            <td key={j} className="px-2 text-center border-r border-slate-200">
              {input}
            </td>
          ))}
          <td
            className={`px-2 text-center border-r border-slate-200 ${
              row.circuitOutput !== row.goalOutput ? "bg-red-100" : ""
            }`}
          >
            {row.circuitOutput}
          </td>
          <td className="px-2 text-center">{row.goalOutput}</td>
        </tr>
      ))}
      <tr className="border-t border-slate-200 font-semibold">
        <td colSpan={4} className="px-2 text-right border-r border-slate-200">
          Accuracy:
        </td>
        <td colSpan={2} className="px-2 text-right">
          {accuracy.toFixed(1)}%
        </td>
      </tr>
    </tbody>
  </table>
);

const FitnessInfoPopoverContent = () => (
  <div className="text-sm font-mono">
    <div>
      <span className="underline">Fitness formula:</span>{" "}
      <MathFormula
        variant="small"
        tex="\text{fraction of correct outputs} - \epsilon n"
      />
    </div>
    <div className="text-sm text-slate-600 font-body">
      <MathFormula variant="small" tex="\epsilon" /> is the fitness penalty per
      node, <MathFormula variant="small" tex="n" /> is total number of nodes in
      the circuit. For simplicity,{" "}
      <MathFormula variant="small" tex="\epsilon" /> is set to 0.
    </div>
  </div>
);

const FitnessGraph = ({ simulationType, chartData }) => (
  <>
    <div className="mt-4 underline">Fitness graph:</div>
    <div className="h-[200px] w-[350px]">
      <VictoryChart
        width={200}
        height={120}
        padding={{ top: 10, bottom: 40, left: 10, right: 10 }}
        domain={{ x: [0, 100], y: [0, 1] }}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        <VictoryAxis
          label={
            simulationType === SimulationType.MUTATION
              ? "Mutations"
              : "Generations"
          }
          style={fitnessChartAxisStyle}
          tickValues={[0, 50, 100]}
          tickFormat={(t) => t.toString()}
        />
        <VictoryAxis
          dependentAxis
          style={fitnessChartAxisStyle}
          tickValues={[0, 0.5, 1]}
        />
        {chartData.length > 0 && (
          <VictoryLine
            style={{
              data: { stroke: "#3f3f46" },
            }}
            data={chartData}
            interpolation="monotoneX"
          />
        )}
        {chartData.length > 0 && (
          <VictoryScatter
            style={{
              data: { fill: "#ef4444" },
            }}
            size={2}
            data={[chartData?.[chartData.length - 1]]}
          />
        )}
      </VictoryChart>
    </div>
  </>
);

const MutationLog = ({ simulationType, logs, onHide }) => (
  <div className="mt-4">
    <div className="flex justify-between items-center underline mb-2">
      <span>Mutation log:</span>
      <Button variant="ghost" onClick={onHide} className="text-sm">
        <FiX size={16} />
      </Button>
    </div>
    <div className="bg-slate-800 text-white p-3 rounded-md font-mono text-sm h-[183px] overflow-y-auto">
      {logs.length === 0 ? (
        <div className="opacity-50">No mutations yet...</div>
      ) : (
        logs.map((log, index) => (
          <div key={index} className="mb-1">
            {`> ${
              simulationType === SimulationType.MUTATION
                ? "Mutation"
                : "Generation"
            } ${index + 1}: ${log}`}
          </div>
        ))
      )}
    </div>
  </div>
);

const CircuitEvolutionSimulation = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    inputTableData,
    truthTable,
    accuracy,
    chartData,
    simulate,
    resetCircuit,
    mutationLogs,
    simulationType,
    setSimulationType,
  } = useCircuitEvolution();

  const [showMutationLog, setShowMutationLog] = useState(false);
  const [showResetWarning, setShowResetWarning] = useState(false);
  const [skipResetWarning, setSkipResetWarning] = useState(false);

  const onToggleMutationLog = () => setShowMutationLog(!showMutationLog);

  return (
    <InteractiveTutorialContainer className="flex-col">
      <CircuitDisplay
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        simulate={simulate}
        resetCircuit={resetCircuit}
        simulationType={simulationType}
        setSimulationType={setSimulationType}
        chartData={chartData}
        showResetWarning={showResetWarning}
        setShowResetWarning={setShowResetWarning}
        skipResetWarning={skipResetWarning}
        setSkipResetWarning={setSkipResetWarning}
      />
      <div className="flex flex-col w-full lg:w-2/3 lg:ml-4 mb-4 lg:my-0 font-mono border border-slate-200 rounded-md p-5">
        <div className="mb-4">
          <p className="text-center">
            Circuit goal:{" "}
            <MathFormula tex="(X \enspace \text{XOR} \enspace Y) \enspace \text{AND} \enspace (Z \enspace \text{XOR} \enspace W)" />
          </p>
        </div>
        <div className="flex flex-col">
          <InputTable inputTableData={inputTableData} />
          <div className="flex flex-row">
            <div className="flex-col mt-4 flex-grow mr-4">
              <div className="flex mt-4 items-center">
                <span className="underline">Fitness score:</span>
                <Popover
                  side="right"
                  trigger={
                    <button className="text-slate-800 hover:text-slate-900 hover:bg-slate-100 rounded-md p-1">
                      <FiInfo size={16} />
                    </button>
                  }
                  content={<FitnessInfoPopoverContent />}
                  className="md:max-w-[450px]"
                />
                {chartData.length > 0 && (
                  <MathFormula
                    className="ml-2"
                    tex={`${chartData?.[chartData.length - 1]?.y.toFixed(3)} `}
                  />
                )}
              </div>
              <FitnessGraph
                simulationType={simulationType}
                chartData={chartData}
              />
              {!showMutationLog && (
                <Button
                  variant="ghost"
                  onClick={onToggleMutationLog}
                  className="mt-4 text-sm"
                >
                  Show mutation log
                </Button>
              )}
              {showMutationLog && (
                <MutationLog
                  simulationType={simulationType}
                  logs={mutationLogs}
                  onHide={onToggleMutationLog}
                />
              )}
            </div>
            <div className="flex-col mt-4">
              <div className="underline">Truth table:</div>
              <TruthTable truthTable={truthTable} accuracy={accuracy} />
            </div>
          </div>
        </div>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default CircuitEvolutionSimulation;
