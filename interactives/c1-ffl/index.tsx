import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { InteractiveTutorialContainer } from "../../components";
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
import { useSimulationStore } from "./store/store";
import CircuitDisplay from "./CircuitDisplay";
import ParametersDisplay from "./ParameterDisplay";

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

  return (
    <div className="text-sm font-mono mt-2 p-2 bg-slate-50 rounded border border-slate-200">
      {delayData.delays.map((delay, index) => (
        <div key={index}>
          Delay {index + 1}: {(delay.end - delay.start).toFixed(1)}s
        </div>
      ))}
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
          {delayData.delays.map((delay, index) => (
            <VictoryArea
              key={index}
              style={chartStyles.delayIndicator}
              data={[
                { x: delay.start, y: 0 },
                { x: delay.start, y: steadyState + 2 },
                { x: delay.end, y: steadyState + 2 },
                { x: delay.end, y: 0 },
              ]}
            />
          ))}
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
    accumulationProgress,
    isAccumulating,
    setSignalForX,
    setIsPlaying,
    resetSimulation,
    updateParams,
    zState,
  } = useSimulationStore();

  const handleProximityChange = (isNear: boolean) => {
    setSignalForX(isNear);
  };

  const steadyStateY = params.betaY / params.alphaY;
  const steadyStateZ = params.betaZ / params.alphaZ;

  return (
    <InteractiveTutorialContainer className="flex-col">
      <div className="flex flex-col w-full lg:w-1/2">
        <ReactFlowProvider>
          <CircuitDisplay
            onProximityChange={handleProximityChange}
            accumulationProgress={accumulationProgress}
            isAccumulating={isAccumulating}
            signalForX={signalForX}
            zState={zState}
            isPlaying={isPlaying}
          />
        </ReactFlowProvider>
        <ParametersDisplay params={params} updateParams={updateParams} />
      </div>
      <div className="w-full lg:w-1/2 lg:ml-4 mb-4 lg:my-0 font-mono border rounded-md transition-all duration-200 ease-in">
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-mono">
              Status:{" "}
              {signalForX ? (
                <span className="text-green-600 font-semibold">ACTIVE</span>
              ) : (
                <span className="text-red-600 font-semibold">INACTIVE</span>
              )}
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
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-3/5">
              <SignalChart signalData={signalData} />
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
              <DelayTimeDisplay delayData={delayTimeData} />
            </div>
          </div>
        </div>
      </div>
    </InteractiveTutorialContainer>
  );
};

export default C1FFLDynamicsSimulator;
