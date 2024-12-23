import { useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Position,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  CircleNode,
  InteractiveTutorialContainer,
  Switch,
  MathFormula,
  Slider,
} from "../../components";
import { chartStyles } from "./utils";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryContainer,
  VictoryScatter,
  VictoryLabel,
  VictoryArea,
} from "victory";
import { FiPlay, FiPause } from "react-icons/fi";
import { DelayTimeData, SignalData } from "./types";
import { useSimulation } from "./hooks";

const nodeTypes = {
  circle: CircleNode,
};

interface ProteinYChartProps {
  data: SignalData[];
  steadyState: number;
  Kyz: number;
  delayData: DelayTimeData;
}

const SignalChart = ({ signalData }) => (
  <>
    <div className="text-sm font-mono mb-2">Signal over time:</div>
    <div className="h-[150px]">
      <VictoryChart
        {...chartStyles.chart}
        domain={{ x: [0, 61], y: [0, 1.2] }}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        <VictoryAxis
          label="t"
          style={chartStyles.axis.style}
          axisLabelComponent={<VictoryLabel dy={-5} dx={190} />}
          tickValues={[0, 60]}
          tickFormat={(t) => t.toString()}
        />
        <VictoryAxis
          dependentAxis
          style={chartStyles.axis.style}
          axisLabelComponent={<VictoryLabel dy={-5} dx={190} />}
          tickValues={[1]}
        />
        {signalData.length > 0 && (
          <VictoryLine {...chartStyles.line.default} data={signalData} />
        )}
        {signalData.length > 0 && (
          <VictoryScatter
            style={chartStyles.scatter}
            size={2}
            data={[signalData[signalData.length - 1]]}
          />
        )}
      </VictoryChart>
    </div>
  </>
);

const DelayTimeDisplay = ({ delayData }: { delayData: DelayTimeData }) => {
  if (!delayData.hasDelay) return null;

  const delayTime = delayData.zActivationTime! - delayData.yActivationTime!;
  return (
    <div className="text-sm font-mono mt-2 p-2 bg-slate-50 rounded border border-slate-200">
      Delay time (Ton): {delayTime.toFixed(1)}s
    </div>
  );
};

export const ProteinYChart = ({
  data,
  steadyState,
  Kyz,
}: ProteinYChartProps) => (
  <>
    <div className="text-sm font-mono mb-2 mt-4">Protein Y concentration:</div>
    <div className="h-[150px]">
      <VictoryChart
        {...chartStyles.chart}
        domain={{ x: [0, 61], y: [0, steadyState + 2] }}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        <VictoryAxis
          label="t"
          style={chartStyles.axis.style}
          axisLabelComponent={<VictoryLabel dy={-5} dx={190} />}
          tickValues={[0, 60]}
          tickFormat={(t) => t.toString()}
        />
        <VictoryAxis
          dependentAxis
          style={chartStyles.axis.style}
          tickValues={[steadyState, Kyz]}
          tickFormat={(t) => (t === Kyz ? "Kyz" : t.toFixed(0))}
        />
        <VictoryLine
          style={chartStyles.line.dashed}
          data={[
            { x: 0, y: Kyz },
            { x: 60, y: Kyz },
          ]}
        />
        {data.length > 0 && (
          <VictoryLine {...chartStyles.line.default} data={data} />
        )}
        {data.length > 0 && (
          <VictoryScatter
            style={chartStyles.scatter}
            size={2}
            data={[data[data.length - 1]]}
          />
        )}
      </VictoryChart>
    </div>
  </>
);

const ProteinZChart = ({ data, steadyState, delayData }) => {
  return (
    <>
      <div className="text-sm font-mono mb-2 mt-4">
        Protein Z concentration:
      </div>
      <div className="h-[150px]">
        <VictoryChart
          {...chartStyles.chart}
          domain={{ x: [0, 61], y: [0, steadyState + 2] }}
          containerComponent={<VictoryContainer responsive={true} />}
        >
          <VictoryAxis
            label="t"
            style={chartStyles.axis.style}
            axisLabelComponent={<VictoryLabel dy={-5} dx={190} />}
            tickValues={[0, 60]}
            tickFormat={(t) => t.toString()}
          />
          <VictoryAxis
            dependentAxis
            style={chartStyles.axis.style}
            tickValues={[steadyState]}
            tickFormat={(t) => t.toFixed(0)}
          />
          {delayData.hasDelay && (
            <VictoryArea
              style={chartStyles.delayIndicator}
              data={[
                { x: delayData.yActivationTime, y: 0 },
                { x: delayData.yActivationTime, y: steadyState + 2 },
                { x: delayData.zActivationTime, y: steadyState + 2 },
                { x: delayData.zActivationTime, y: 0 },
              ]}
            />
          )}
          {data.length > 0 && (
            <VictoryLine {...chartStyles.line.default} data={data} />
          )}
          {data.length > 0 && (
            <VictoryScatter
              style={chartStyles.scatter}
              size={2}
              data={[data[data.length - 1]]}
            />
          )}
        </VictoryChart>
      </div>
    </>
  );
};

const C1FFLDynamicsSimulator = () => {
  const {
    time,
    isPlaying,
    signalForX,
    signalData,
    proteinYData,
    proteinZData,
    params,
    delayTimeData,
    setSignalForX,
    setIsPlaying,
    resetSimulation,
    updateParams,
  } = useSimulation({
    initialParams: {
      alphaY: 0.1,
      betaY: 1,
      alphaZ: 0.1,
      betaZ: 1,
      Kyz: 5,
    },
  });

  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "1",
      type: "circle",
      position: { x: 100, y: 100 },
      data: {
        text: "X",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    },
    {
      id: "2",
      type: "circle",
      position: { x: 200, y: 100 },
      data: {
        text: "X*",
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      },
    },
  ]);

  const [edges, setEdges] = useState<Edge[]>([
    {
      id: "1-2",
      source: "1",
      target: "2",
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#a1a1aa",
        width: 8,
        height: 8,
      },
      style: {
        stroke: "#a1a1aa",
        strokeWidth: 2,
      },
    },
  ]);

  const steadyStateY = params.betaY / params.alphaY;
  const steadyStateZ = params.betaZ / params.alphaZ;

  return (
    <InteractiveTutorialContainer>
      <div className="w-full h-[350px] lg:w-1/2 border rounded-md border-slate-200">
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div className="w-full lg:w-1/2 lg:ml-4 mb-4 lg:my-0 font-mono border rounded-md transition-all duration-200 ease-in">
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono">
                <MathFormula tex="S_x" />
              </span>
              <Switch
                checked={signalForX}
                onCheckedChange={(checked) => {
                  setSignalForX(checked);
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 rounded-lg hover:bg-slate-100"
                disabled={time >= 60}
              >
                {isPlaying ? (
                  <FiPause className="w-5 h-5 text-slate-600" />
                ) : (
                  <FiPlay className="w-5 h-5 text-slate-600" />
                )}
              </button>
              <span className="text-sm font-mono w-16">{time}/60s</span>
              <button
                onClick={resetSimulation}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-4 mb-6 p-3 bg-slate-50 rounded-md">
            <div className="text-sm font-mono mb-1">Parameters:</div>

            <div className="text-sm font-mono mt-2 mb-1">Protein Y:</div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\alpha_Y" />
              </span>
              <Slider
                value={[params.alphaY]}
                onValueChange={([value]) => updateParams({ alphaY: value })}
                min={0.01}
                max={0.5}
                step={0.01}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {params.alphaY.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\beta_Y" />
              </span>
              <Slider
                value={[params.betaY]}
                onValueChange={([value]) => updateParams({ betaY: value })}
                min={0.1}
                max={5}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {params.betaY.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="K_{YZ}" />
              </span>
              <Slider
                value={[params.Kyz]}
                onValueChange={([value]) => updateParams({ Kyz: value })}
                min={1}
                max={10}
                step={0.5}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {params.Kyz.toFixed(1)}
              </span>
            </div>

            <div className="text-sm font-mono mt-2 mb-1">Protein Z:</div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\alpha_Z" />
              </span>
              <Slider
                value={[params.alphaZ]}
                onValueChange={([value]) => updateParams({ alphaZ: value })}
                min={0.01}
                max={0.5}
                step={0.01}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {params.alphaZ.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\beta_Z" />
              </span>
              <Slider
                value={[params.betaZ]}
                onValueChange={([value]) => updateParams({ betaZ: value })}
                min={0.1}
                max={5}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {params.betaZ.toFixed(1)}
              </span>
            </div>
          </div>
          <SignalChart signalData={signalData} />
          <DelayTimeDisplay delayData={delayTimeData} />
          <ProteinYChart
            data={proteinYData}
            steadyState={steadyStateY}
            Kyz={params.Kyz}
            delayData={delayTimeData}
          />
          <ProteinZChart
            data={proteinZData}
            steadyState={steadyStateZ}
            delayData={delayTimeData}
          />
        </div>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default C1FFLDynamicsSimulator;
