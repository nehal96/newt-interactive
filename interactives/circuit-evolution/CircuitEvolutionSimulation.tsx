import { ReactFlow, Background, Controls, StraightEdge } from "@xyflow/react";
import {
  InteractiveTutorialContainer,
  CircleNode,
  NANDNode,
  MathFormula,
} from "../../components";
import "@xyflow/react/dist/style.css";
import { Fragment } from "react";
import { useCircuitEvolution } from "./hooks";

const nodeTypes = {
  circle: CircleNode,
  nandGate: NANDNode,
};

const edgeTypes = {
  straight: StraightEdge,
};

const CircuitEvolutionSimulation = () => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    tableData,
    truthTable,
    accuracy,
  } = useCircuitEvolution();

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
      <div className="w-1/2 lg:ml-4 mb-4 lg:my-0">
        <div className="mb-4">
          <p className="font-mono">
            Circuit goal:{" "}
            <MathFormula tex="(X \enspace \text{XOR} \enspace Y) \enspace \text{AND} \enspace (Z \enspace \text{XOR} \enspace W)" />
          </p>
        </div>
        <table className="font-mono border border-slate-200">
          <tbody>
            <tr className="border-b border-slate-200">
              <th className="text-left pr-2 pl-1 border-r border-slate-200">
                Inputs
              </th>
              {tableData.inputs.map((inputArray, arrayIndex) => (
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
              <th className="text-left pr-2 pl-1 border-r border-slate-200">
                Gate
              </th>
              {tableData.gates.map((gate, index) => (
                <td
                  key={`gate-${index}`}
                  className="px-2 text-center border-r border-slate-200"
                  colSpan={tableData.inputs[index].length}
                >
                  {gate}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <div className="flex flex-row mt-4">
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
                    <td
                      key={j}
                      className="px-2 text-center border-r border-slate-200"
                    >
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
                <td
                  colSpan={4}
                  className="px-2 text-right border-r border-slate-200"
                >
                  Accuracy:
                </td>
                <td colSpan={2} className="px-2 text-right">
                  {accuracy.toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
          <div className="ml-4 flex-col font-mono">
            <div>
              Fitness formula:{" "}
              <MathFormula tex="\text{fraction of correct outputs} - \epsilon n" />
            </div>
            <div className="mt-4">
              Fitness score (assuming <MathFormula tex="\epsilon = 0" />
              ): <MathFormula tex={`${(accuracy / 100).toFixed(3)} `} />
            </div>
          </div>
        </div>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default CircuitEvolutionSimulation;
