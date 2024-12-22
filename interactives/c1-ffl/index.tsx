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
  Slider,
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
    <div className="h-[150px]">
      <VictoryChart
        width={200}
        height={100}
        padding={{ top: 5, bottom: 10, left: 25, right: 10 }}
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

const ProteinYChart = ({ signalData, alpha = 0.1, beta = 1, Kyz = 5 }) => {
  const steadyState = beta / alpha;
  const proteinData = signalData.reduce((acc, point, index) => {
    if (index === 0) {
      return [{ x: point.x, y: point.y === 1 ? 0 : 0 }];
    }

    const prevPoint = acc[acc.length - 1];
    const timeSinceLastChange = point.x - prevPoint.x;

    const y =
      point.y === 1
        ? // Accumulation: starting from previous value, approaching beta/alpha
          steadyState -
          (steadyState - prevPoint.y) * Math.exp(-alpha * timeSinceLastChange)
        : // Decay: starting from previous value
          prevPoint.y * Math.exp(-alpha * timeSinceLastChange);

    return [...acc, { x: point.x, y }];
  }, []);

  return (
    <>
      <div className="text-sm font-mono mb-2 mt-4">
        Protein Y concentration:
      </div>
      <div className="h-[150px]">
        <VictoryChart
          width={200}
          height={100}
          padding={{ top: 5, bottom: 10, left: 25, right: 10 }}
          domain={{ x: [0, 61], y: [0, steadyState + 2] }}
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
            tickValues={[steadyState, Kyz]}
            tickFormat={(t) => (t === Kyz ? "Kyz" : t.toFixed(0))}
          />
          <VictoryLine
            style={{
              data: {
                stroke: "#94a3b8",
                strokeDasharray: "4,4",
                strokeWidth: 1,
              },
            }}
            data={[
              { x: 0, y: Kyz },
              { x: 60, y: Kyz },
            ]}
          />
          {proteinData.length > 0 && (
            <VictoryLine
              style={{
                data: { stroke: "#3f3f46" },
              }}
              data={proteinData}
            />
          )}
          {proteinData.length > 0 && (
            <VictoryScatter
              style={{
                data: { fill: "#ef4444" },
              }}
              size={2}
              data={[proteinData[proteinData.length - 1]]}
            />
          )}
        </VictoryChart>
      </div>
    </>
  );
};

const ProteinZChart = ({
  signalData,
  proteinYData,
  alpha = 0.1,
  beta = 1,
  Kyz = 5,
}) => {
  const steadyState = beta / alpha;
  const proteinZData = signalData.reduce((acc, point, index) => {
    if (index === 0) {
      return [{ x: point.x, y: 0 }];
    }

    const prevPoint = acc[acc.length - 1];
    const timeSinceLastChange = point.x - prevPoint.x;
    const correspondingY = proteinYData[index].y;

    // Z accumulates only when both X is active AND Y is above threshold
    const isActive = point.y === 1 && correspondingY > Kyz;

    const y = isActive
      ? // Accumulation: starting from previous value, approaching beta/alpha
        steadyState -
        (steadyState - prevPoint.y) * Math.exp(-alpha * timeSinceLastChange)
      : // Decay: starting from previous value
        prevPoint.y * Math.exp(-alpha * timeSinceLastChange);

    return [...acc, { x: point.x, y }];
  }, []);

  return (
    <>
      <div className="text-sm font-mono mb-2 mt-4">
        Protein Z concentration:
      </div>
      <div className="h-[150px]">
        <VictoryChart
          width={200}
          height={100}
          padding={{ top: 5, bottom: 10, left: 25, right: 10 }}
          domain={{ x: [0, 61], y: [0, steadyState + 2] }}
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
            tickValues={[steadyState]}
            tickFormat={(t) => t.toFixed(0)}
          />
          {proteinZData.length > 0 && (
            <VictoryLine
              style={{
                data: { stroke: "#3f3f46" },
              }}
              data={proteinZData}
            />
          )}
          {proteinZData.length > 0 && (
            <VictoryScatter
              style={{
                data: { fill: "#ef4444" },
              }}
              size={2}
              data={[proteinZData[proteinZData.length - 1]]}
            />
          )}
        </VictoryChart>
      </div>
    </>
  );
};

const C1FFLDynamicsSimulator = () => {
  const [signalForX, setSignalForX] = useState(false);
  const [signalData, setSignalData] = useState([{ x: 0, y: 0 }]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  const [alphaY, setAlphaY] = useState(0.1);
  const [betaY, setBetaY] = useState(1);
  const [alphaZ, setAlphaZ] = useState(0.1);
  const [betaZ, setBetaZ] = useState(1);
  const [Kyz, setKyz] = useState(5);

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

  // Calculate Y protein data for use in Z chart
  const proteinYData = signalData.reduce((acc, point, index) => {
    if (index === 0) {
      return [{ x: point.x, y: point.y === 1 ? 0 : 0 }];
    }

    const prevPoint = acc[acc.length - 1];
    const timeSinceLastChange = point.x - prevPoint.x;

    const y =
      point.y === 1
        ? betaY / alphaY -
          (betaY / alphaY - prevPoint.y) *
            Math.exp(-alphaY * timeSinceLastChange)
        : prevPoint.y * Math.exp(-alphaY * timeSinceLastChange);

    return [...acc, { x: point.x, y }];
  }, []);

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
          <div className="flex flex-col gap-4 mb-6 p-3 bg-slate-50 rounded-md">
            <div className="text-sm font-mono mb-1">Parameters:</div>

            <div className="text-sm font-mono mt-2 mb-1">Protein Y:</div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\alpha_Y" />
              </span>
              <Slider
                value={[alphaY]}
                onValueChange={([value]) => setAlphaY(value)}
                min={0.01}
                max={0.5}
                step={0.01}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {alphaY.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\beta_Y" />
              </span>
              <Slider
                value={[betaY]}
                onValueChange={([value]) => setBetaY(value)}
                min={0.1}
                max={5}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {betaY.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="K_{YZ}" />
              </span>
              <Slider
                value={[Kyz]}
                onValueChange={([value]) => setKyz(value)}
                min={1}
                max={10}
                step={0.5}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{Kyz.toFixed(1)}</span>
            </div>

            <div className="text-sm font-mono mt-2 mb-1">Protein Z:</div>
            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\alpha_Z" />
              </span>
              <Slider
                value={[alphaZ]}
                onValueChange={([value]) => setAlphaZ(value)}
                min={0.01}
                max={0.5}
                step={0.01}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {alphaZ.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm w-16">
                <MathFormula tex="\beta_Z" />
              </span>
              <Slider
                value={[betaZ]}
                onValueChange={([value]) => setBetaZ(value)}
                min={0.1}
                max={5}
                step={0.1}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">
                {betaZ.toFixed(1)}
              </span>
            </div>
          </div>
          <SignalChart signalData={signalData} />
          <ProteinYChart
            signalData={signalData}
            alpha={alphaY}
            beta={betaY}
            Kyz={Kyz}
          />
          <ProteinZChart
            signalData={signalData}
            proteinYData={proteinYData}
            alpha={alphaZ}
            beta={betaZ}
            Kyz={Kyz}
          />
        </div>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default C1FFLDynamicsSimulator;
