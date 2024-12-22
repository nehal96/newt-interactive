import { useState, useEffect, useCallback } from "react";
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
} from "../../components";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryContainer,
  VictoryScatter,
  VictoryLabel,
} from "victory";
import { FiPlay, FiPause } from "react-icons/fi";

const nodeTypes = {
  circle: CircleNode,
};

const SignalChart = ({ signalData }) => (
  <>
    <div className="text-sm font-mono mb-2">Signal over time:</div>
    <div className="h-[200px]">
      <VictoryChart
        width={200}
        height={120}
        padding={{ top: 20, bottom: 25, left: 25, right: 10 }}
        domain={{ x: [0, 61], y: [0, 1.2] }}
        containerComponent={<VictoryContainer responsive={true} />}
      >
        <VictoryAxis
          label="t"
          style={{
            axis: { stroke: "#64748b" },
            tickLabels: { fill: "#64748b", fontSize: 8, padding: 2 },
            grid: { stroke: "none" },
          }}
          axisLabelComponent={<VictoryLabel dy={-5} dx={190} />}
          tickValues={[0, 60]}
          tickFormat={(t) => t.toString()}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#64748b" },
            tickLabels: { fill: "#64748b", fontSize: 8, padding: 2 },
            grid: { stroke: "none" },
          }}
          tickValues={[1]}
        />
        {signalData.length > 0 && (
          <VictoryLine
            style={{
              data: { stroke: "#3f3f46" },
            }}
            data={signalData}
          />
        )}
        {signalData.length > 0 && (
          <VictoryScatter
            style={{
              data: { fill: "#ef4444" },
            }}
            size={2}
            data={[signalData[signalData.length - 1]]}
          />
        )}
      </VictoryChart>
    </div>
  </>
);

const C1FFLDynamicsSimulator = () => {
  const [signalForX, setSignalForX] = useState(false);
  const [signalData, setSignalData] = useState([{ x: 0, y: 0 }]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
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

  const resetSimulation = useCallback(() => {
    setTime(0);
    setSignalData([{ x: 0, y: signalForX ? 1 : 0.01 }]);
    setIsPlaying(false);
  }, [signalForX]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && time < 60) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= 60) {
            setIsPlaying(false);
          }
          return newTime;
        });

        setSignalData((prev) => [
          ...prev,
          {
            x: time + 1,
            y: signalForX ? 1 : 0.01,
          },
        ]);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, time, signalForX]);

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
                  if (!isPlaying) {
                    setSignalData([{ x: 0, y: checked ? 1 : 0 }]);
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
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
          <SignalChart signalData={signalData} />
        </div>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default C1FFLDynamicsSimulator;
