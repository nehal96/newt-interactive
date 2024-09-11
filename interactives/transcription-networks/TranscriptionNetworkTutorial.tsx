import { useState } from "react";
import {
  ChartXAxis,
  ChartYAxis,
  MathFormula,
  SlideDeck,
} from "../../components";
import { VictoryChart, VictoryLabel, VictoryLine } from "victory";
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
import {
  getActivatorHillFunctionData,
  getRepressorHillFunctionData,
  getActivatorStepFunctionData,
} from "./helpers";

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

const TranscriptionNetworkTutorial = () => {
  const [activatorBeta, setActivatorBeta] = useState(20);
  const [activatorK, setActivatorK] = useState(1);
  const [activatorN, setActivatorN] = useState(1);
  const [repressorBeta, setRepressorBeta] = useState(20);
  const [repressorK, setRepressorK] = useState(1);
  const [repressorN, setRepressorN] = useState(1);

  const activatorHillFunctionData = getActivatorHillFunctionData(
    activatorBeta,
    activatorK,
    activatorN,
    0,
    20
  );
  const repressorHillFunctionData = getRepressorHillFunctionData(
    repressorBeta,
    repressorK,
    repressorN,
    0,
    20
  );

  const nodeTypes = {
    circle: CircleNode,
  };

  const nodes: Node[] = [
    {
      id: "1",
      type: "circle",
      position: { x: 250, y: 20 },
      data: {
        color: "#020617",
      },
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

  const edges = [
    {
      id: "1->2",
      source: "1",
      target: "2",
    },
    {
      id: "1->3",
      source: "1",
      target: "3",
    },
  ];

  const slides = [
    {
      section: "Network",
      text: (
        <>
          <p>example transcription network diagram</p>
        </>
      ),
      interactive: (
        <div className="flex justify-center py-4">
          <Image
            src="/images/transcription-network-systems-biology.png"
            alt="Transcription Network"
            width={500}
            height={500}
          />
        </div>
      ),
    },
    {
      section: "Network",
      text: "network diagram, closer look",
      interactive: (
        <div style={{ height: 400 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{
              type: "default",
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
      ),
    },
    {
      section: "Functions",
      text: (
        <>
          <div>
            <p className="mb-4">
              The arrows not only have signs, but also numbers that determine
              the <span className="font-bold">strength</span> of the
              interaction. The strength of the effect of a transcription factor
              on a target gene is described by an input function.
            </p>
            <p className="mb-4">
              This input function describes the relationship between the
              concentration of a transcription factor in its active form,{" "}
              <MathFormula tex="X^*" />, and the rate of production of the
              protein that it regulates, <MathFormula tex="Y" />
            </p>
            <div className="mb-6 flex items-center justify-center">
              <MathFormula tex="\text{rate of production of } Y = f(X^*)" />
            </div>
            <p className="mb-4">
              When X is an activator, it is an increasing function, and when X
              is a repressor, it is a decreasing function.
            </p>
            <p className="mb-4">
              A function that realistically describes many gene interactions is
              called the <span className="font-bold">Hill Function</span>. The
              chart on the right shows a Hill function for an activator, and is
              explained more in the next slide.
            </p>
          </div>
        </>
      ),
      interactive: (
        <VictoryChart domain={{ x: [0, 20], y: [0, 22] }}>
          <ChartXAxis standalone={false} label="Activator concentration (X*)" />
          <ChartYAxis standalone={false} label="Promoter activity" />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 5, 1)}
            interpolation="basis"
          />
        </VictoryChart>
      ),
    },
    {
      section: "Functions",
      text: (
        <>
          <p className="mb-4">
            The Hill function for an activator is described by:
          </p>
          <div className="mb-6 flex items-center justify-center">
            <MathFormula tex="f(X^*) = \beta \frac{X^{*n}}{K^n + X^{*n}}" />
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-3 mb-4">
            <div className="w-10">
              <MathFormula tex="X^*" />
            </div>
            <div>
              is the concentration of the transcription factor in its active
              form
            </div>
            <div className="w-10">
              <MathFormula tex="\beta" />
            </div>
            <div>
              is the{" "}
              <span className="font-bold">maximal promoter activity</span>, the
              maximum rate of production of <MathFormula tex="Y" />
            </div>
            <div className="w-10">
              <MathFormula tex="K" />
            </div>
            <div>
              is the <span className="font-bold">activation coefficient</span>
              , the concentration of <MathFormula tex="X^*" /> needed to
              activate expression
            </div>
            <div className="w-10">
              <MathFormula tex="n" />
            </div>
            <div>
              is the <span className="font-bold">Hill coefficient</span>, which
              determines the steepness of the curve
            </div>
          </div>
          <p className="mb-4">
            Maximal promoter activity is achieved at high activator
            concentrations because the activator is more likely to bind to the
            promoter and enable RNAp to produce mRNA.
          </p>
          <p className="mb-4">
            On the next slide, you can adjust the parameters of the Hill
            function to see how they affect the curve.
          </p>
        </>
      ),
      interactive: (
        <VictoryChart
          domain={{ x: [0, 20], y: [0, 22] }}
          domainPadding={{ x: 40 }}
        >
          <ChartXAxis standalone={false} label="Activator concentration (X*)" />
          <ChartYAxis standalone={false} label="Promoter activity" />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 5, 2)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 2" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 5, 4)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 4" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 5, 1)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 1" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#334155" }} />
            }
          />
        </VictoryChart>
      ),
    },
    {
      section: "Functions",
      text: (
        <>
          <p className="mb-4">
            Adjust the sliders to see how the parameters affect the activator
            function:
          </p>
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {activatorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={activatorBeta}
                onChange={(e) => setActivatorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {activatorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="0.1"
                max="10"
                step="0.1"
                value={activatorK}
                onChange={(e) => setActivatorK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {activatorN}
              </label>
              <input
                type="range"
                id="n-slider"
                min="0.1"
                max="4"
                step="0.1"
                value={activatorN}
                onChange={(e) => setActivatorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <VictoryChart domain={{ x: [0, 20], y: [0, 22] }}>
          <ChartXAxis standalone={false} label="Activator concentration (X*)" />
          <ChartYAxis standalone={false} label="Promoter activity" />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={activatorHillFunctionData}
            interpolation="basis"
          />
        </VictoryChart>
      ),
    },
    {
      section: "Functions",
      text: (
        <>
          <p className="mb-4">
            Now let's look at the Hill function for a repressor. The equation
            for a repressor is:
          </p>
          <div className="flex items-center justify-center">
            <MathFormula tex="f(X^*) = \beta \frac{K^n}{K^n + X^{*n}}" />
          </div>
          <p className="my-4">
            Adjust the sliders to see how the parameters affect the repressor
            function:
          </p>
          <div>
            <div className="mt-4">
              <label htmlFor="beta-slider" className="font-medium block">
                <MathFormula tex="\beta" />: {repressorBeta}
              </label>
              <input
                type="range"
                id="beta-slider"
                min="0"
                max="20"
                step="0.1"
                value={repressorBeta}
                onChange={(e) => setRepressorBeta(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="K-slider" className="font-medium block">
                <MathFormula tex="K" />: {repressorK}
              </label>
              <input
                type="range"
                id="K-slider"
                min="0.1"
                max="10"
                step="0.1"
                value={repressorK}
                onChange={(e) => setRepressorK(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="n-slider" className="font-medium block">
                <MathFormula tex="n" />: {repressorN}
              </label>
              <input
                type="range"
                id="n-slider"
                min="0.1"
                max="4"
                step="0.1"
                value={repressorN}
                onChange={(e) => setRepressorN(parseFloat(e.target.value))}
                className="w-11/12 flex-auto cursor-pointer"
              />
            </div>
          </div>
        </>
      ),
      interactive: (
        <VictoryChart domain={{ x: [0, 20], y: [0, 22] }}>
          <ChartXAxis standalone={false} label="Repressor concentration (X*)" />
          <ChartYAxis standalone={false} label="Promoter activity" />
          <VictoryLine
            style={{
              data: { stroke: "#3b82f6" },
              parent: { border: "1px solid #ccc" },
            }}
            data={repressorHillFunctionData}
            interpolation="basis"
          />
        </VictoryChart>
      ),
    },
    {
      section: "Functions",
      text: (
        <>
          <p className="mb-4">
            Sometimes, rather than using full mathematical functions, its easier
            to use simpler functions that approximate the essential behaviors.
          </p>
          <p className="mb-4">
            Hill functions describe a transition from high to low, or low to
            high -- we can approximate that transition with a step function.
            Essentially, a jump from high to low, or low to high rather than a
            smooth ascent or descent.
          </p>
          <p className="mb-4">
            For activators, the logic input function can be described using a
            step-function <MathFormula tex="\theta(X^* > K)" /> that makes a
            step when <MathFormula tex="X^*" />
            exceeds the threshold <MathFormula tex="K" />:
          </p>
          <div className="flex items-center justify-center">
            <MathFormula tex="f(X^*) = \beta \theta(X^* > K)" />
          </div>
        </>
      ),
      interactive: (
        <VictoryChart
          domain={{ x: [0, 20], y: [0, 22] }}
          domainPadding={{ x: 40 }}
        >
          <ChartXAxis standalone={false} label="Activator concentration (X*)" />
          <ChartYAxis standalone={false} label="Promoter activity" />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 10, 1)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 1" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 10, 2)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 2" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getActivatorHillFunctionData(20, 10, 4)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 4" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#c43a31", strokeWidth: 2 },
            }}
            data={getActivatorStepFunctionData()}
          />
        </VictoryChart>
      ),
    },
    {
      section: "Functions",
      text: (
        <>
          <p className="mb-4">
            Now let's look at the logical approximation function for a
            repressor:
          </p>
          <div className="flex items-center justify-center mb-4">
            <MathFormula tex="f(X^*) = \beta \theta(X^* < K)" />
          </div>
        </>
      ),
      interactive: (
        <VictoryChart
          domain={{ x: [0, 20], y: [0, 22] }}
          domainPadding={{ x: 40 }}
        >
          <ChartXAxis standalone={false} label="Repressor concentration (X*)" />
          <ChartYAxis standalone={false} label="Promoter activity" />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getRepressorHillFunctionData(20, 10, 1)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 1" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getRepressorHillFunctionData(20, 10, 2)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 2" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#cbd5e1" },
              parent: { border: "1px solid #ccc" },
            }}
            data={getRepressorHillFunctionData(20, 10, 4)}
            interpolation="basis"
            labels={({ datum }) => (datum.x === 20 ? "n = 4" : "")}
            labelComponent={
              <VictoryLabel dx={18} dy={5} style={{ fill: "#94a3b8" }} />
            }
          />
          <VictoryLine
            style={{
              data: { stroke: "#3b82f6", strokeWidth: 2 },
            }}
            data={[
              { x: 0, y: 20 },
              { x: 10, y: 20 },
              { x: 10, y: 0.1 },
              { x: 20, y: 0.1 },
            ]}
          />
        </VictoryChart>
      ),
    },
  ];

  return <SlideDeck slides={slides} />;
};

export default TranscriptionNetworkTutorial;
