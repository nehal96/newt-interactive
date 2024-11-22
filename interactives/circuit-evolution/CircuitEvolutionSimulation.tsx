import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  StraightEdge,
} from "@xyflow/react";
import {
  InteractiveTutorialContainer,
  CircleNode,
  NANDNode,
  MathFormula,
} from "../../components";
import "@xyflow/react/dist/style.css";
import { Fragment, useEffect } from "react";

const nodeTypes = {
  circle: CircleNode,
  nandGate: NANDNode,
};

const edgeTypes = {
  straight: StraightEdge,
};

const CircuitEvolutionSimulation = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes([
      {
        id: "1",
        type: "circle",
        position: { x: 50, y: 25 },
        data: {
          booleanValue: 0,
          color: "#3f3f46",
          text: "1",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "2",
        type: "circle",
        position: { x: 150, y: 25 },
        data: {
          booleanValue: 0,
          color: "#3f3f46",
          text: "2",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "3",
        type: "circle",
        position: { x: 250, y: 25 },
        data: {
          booleanValue: 0,
          color: "#3f3f46",
          text: "3",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "4",
        type: "circle",
        position: { x: 350, y: 25 },
        data: {
          booleanValue: 0,
          color: "#3f3f46",
          text: "4",
          style: {
            backgroundColor: "white",
          },
        },
      },
      {
        id: "5",
        type: "nandGate",
        position: { x: 100, y: 100 },
        data: {
          color: "#3f3f46",
          text: "5",
        },
      },
      {
        id: "6",
        type: "nandGate",
        position: { x: 200, y: 100 },
        data: {
          color: "#3f3f46",
          text: "6",
        },
      },
      {
        id: "7",
        type: "nandGate",
        position: { x: 150, y: 175 },
        data: {
          color: "#3f3f46",
          text: "7",
        },
      },
      {
        id: "8",
        type: "nandGate",
        position: { x: 250, y: 175 },
        data: {
          color: "#3f3f46",
          text: "8",
        },
      },
      {
        id: "9",
        type: "nandGate",
        position: { x: 200, y: 250 },
        data: {
          color: "#3f3f46",
          text: "9",
        },
      },
    ]);

    setEdges([
      {
        id: "e1-5",
        source: "1",
        target: "5",
      },
      {
        id: "e2-5",
        source: "2",
        target: "5",
      },
      {
        id: "e2-6",
        source: "2",
        target: "6",
      },
      {
        id: "e3-6",
        source: "3",
        target: "6",
      },
      {
        id: "e4-8",
        source: "4",
        target: "8",
      },
      {
        id: "e5-7",
        source: "5",
        target: "7",
      },
      {
        id: "e6-7",
        source: "6",
        target: "7",
      },
      {
        id: "e6-8",
        source: "6",
        target: "8",
      },
      {
        id: "e7-9",
        source: "7",
        target: "9",
      },
      {
        id: "e8-9",
        source: "8",
        target: "9",
      },
    ]);
  }, []);

  const getTableData = () => {
    // Create a map to store inputs for each target node
    const gateInputs: { [key: string]: string[] } = {};

    // Process edges to group inputs by target
    edges.forEach((edge) => {
      if (!gateInputs[edge.target]) {
        gateInputs[edge.target] = [];
      }
      gateInputs[edge.target].push(edge.source);
    });

    // Sort gates by number
    const sortedGates = Object.keys(gateInputs).sort(
      (a, b) => parseInt(a) - parseInt(b)
    );

    return {
      gates: sortedGates,
      inputs: sortedGates.map((gate) => gateInputs[gate].sort()),
    };
  };

  const evaluateNAND = (input1: number, input2: number): number => {
    return input1 === 1 && input2 === 1 ? 0 : 1;
  };

  const evaluateCircuit = () => {
    const nodeValues = {};

    nodes
      .filter((node) => node.type === "circle")
      .forEach((node) => {
        nodeValues[node.id] = node.data.booleanValue;
      });

    const { gates, inputs } = getTableData();

    gates.forEach((gateId) => {
      const gateInputs = inputs[gates.indexOf(gateId)];
      // Get input values and evaluate NAND
      const input1 = nodeValues[gateInputs[0]];
      const input2 = nodeValues[gateInputs[1]];
      nodeValues[gateId] = evaluateNAND(input1, input2);
    });

    return nodeValues;
  };

  const evaluateGoal = () => {
    const inputValues = nodes
      .filter((node) => node.type === "circle")
      .map((node) => node.data.booleanValue);

    // (X xor Y) AND (Z xor W) -- programming logic evaluated from https://www.dcode.fr/boolean-expressions-calculator
    const goal = (x: number, y: number, z: number, w: number) => {
      return (
        (w && x && !y && !z) ||
        (w && !x && y && !z) ||
        (!w && x && !y && z) ||
        (!w && !x && y && z)
      );
    };

    return goal(inputValues[0], inputValues[1], inputValues[2], inputValues[3]);
  };

  console.log(evaluateCircuit(), evaluateGoal());

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
              {getTableData().inputs.map((inputArray, arrayIndex) => (
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
              {getTableData().gates.map((gate, index) => (
                <td
                  key={`gate-${index}`}
                  className="px-2 text-center border-r border-slate-200"
                  colSpan={getTableData().inputs[index].length}
                >
                  {gate}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default CircuitEvolutionSimulation;
