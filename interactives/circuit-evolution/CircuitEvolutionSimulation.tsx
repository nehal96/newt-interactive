import { Fragment } from "react";
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
} from "../../components";
import { useCircuitEvolution } from "./hooks";
import { fitnessChartAxisStyle } from "./utils";

const nodeTypes = {
  circle: CircleNode,
  nandGate: NANDNode,
};

const edgeTypes = {
  straight: StraightEdge,
};

const CircuitDisplay = ({ nodes, edges, onNodesChange, onEdgesChange }) => (
  <div className="w-1/2 h-[400px] border border-slate-200 rounded-md">
    <ReactFlow
      fitView
      fitViewOptions={{ maxZoom: 0.9 }}
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

const InputTable = ({ inputTableData }) => (
  <table className="font-mono border border-slate-200">
    <tbody>
      <tr className="border-b border-slate-200">
        <th className="text-left pr-2 pl-1 border-r border-slate-200">
          Inputs
        </th>
        {inputTableData.inputs.map((inputArray, arrayIndex) => (
          <Fragment key={`input-array-${arrayIndex}`}>
            {inputArray.map((input, idx) => (
              <td
                key={`input-${arrayIndex}-${idx}`}
                className="px-2 text-center border-r border-slate-200"
              >
                {input}
              </td>
            ))}
          </Fragment>
        ))}
      </tr>
      <tr className="border-b border-slate-200">
        <th className="text-left pr-2 pl-1 border-r border-slate-200">Gate</th>
        {inputTableData.gates.map((gate, index) => (
          <td
            key={`gate-${index}`}
            className="px-2 text-center border-r border-slate-200"
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
  <table className="font-mono border border-slate-200">
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

const FitnessGraph = ({ chartData }) => (
  <>
    <div>
      Fitness formula:{" "}
      <MathFormula tex="\text{fraction of correct outputs} - \epsilon n" />
    </div>
    <div className="mt-4">
      Fitness score (assuming <MathFormula tex="\epsilon = 0" />
      ):{" "}
      <MathFormula tex={`${chartData[chartData.length - 1].y.toFixed(3)} `} />
    </div>
    <div className="mt-4">Fitness graph:</div>
    <div className="h-[240px]">
      <VictoryChart
        width={200}
        height={120}
        padding={{ top: 10, bottom: 30, left: 40, right: 10 }}
        domain={{ x: [0, 100], y: [0, 1] }}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        <VictoryAxis
          label="Generation"
          style={fitnessChartAxisStyle}
          tickValues={[0, 50, 100]}
          tickFormat={(t) => t.toString()}
        />
        <VictoryAxis
          dependentAxis
          style={fitnessChartAxisStyle}
          tickValues={[0, 0.5, 1]}
        />
        <VictoryLine
          style={{
            data: { stroke: "#3f3f46" },
          }}
          data={chartData}
          interpolation="monotoneX"
        />
        <VictoryScatter
          style={{
            data: { fill: "#ef4444" },
          }}
          size={2}
          data={[chartData[chartData.length - 1]]}
        />
      </VictoryChart>
    </div>
  </>
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
    mutateCircuit,
    resetCircuit,
  } = useCircuitEvolution();

  return (
    <InteractiveTutorialContainer>
      <CircuitDisplay
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      />
      <div className="w-1/2 lg:ml-4 mb-4 lg:my-0">
        <div className="mb-4">
          <p className="font-mono">
            Circuit goal:{" "}
            <MathFormula tex="(X \enspace \text{XOR} \enspace Y) \enspace \text{AND} \enspace (Z \enspace \text{XOR} \enspace W)" />
          </p>
        </div>
        <InputTable inputTableData={inputTableData} />
        <div className="flex flex-row mt-4">
          <TruthTable truthTable={truthTable} accuracy={accuracy} />
          <div className="ml-4 flex-col font-mono">
            <FitnessGraph chartData={chartData} />
            <Button variant="outline" onClick={mutateCircuit}>
              Simulate a Mutation
            </Button>
            <Button className="mt-2" variant="outline" onClick={resetCircuit}>
              Reset Circuit
            </Button>
          </div>
        </div>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default CircuitEvolutionSimulation;
