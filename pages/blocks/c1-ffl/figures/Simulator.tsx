import { type ReactNode } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@ui/controls";
import { InteractiveTutorialContainer } from "@ui/layout";
import { Dot, Line, Plot, type Tick, useScale, XAxis, YAxis } from "@viz/chart";
import { cn } from "@lib/utils";
import { chartStyles } from "./utils";
import { FiPlay, FiPause } from "react-icons/fi";
import { DelayPeriod, DelayTimeData, SignalData } from "./types";
import { useSimulationStore } from "./store/store";
import CircuitDisplay from "./CircuitDisplay";
import ParametersDisplay from "./ParameterDisplay";
import InfoPanel from "./InfoPanel";

interface ProteinYChartProps {
  data: SignalData[];
  steadyState: number;
  Kyz: number;
  delayData: DelayTimeData;
}

const ChartBlock = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) => (
  <>
    <div className={cn("text-sm font-mono mb-2", className)}>{label}</div>
    <div className="h-[150px]">{children}</div>
  </>
);

const TimeAxes = ({ yTicks }: { yTicks: Tick[] }) => (
  <>
    <XAxis
      ticks={[
        [0, "0"],
        [60, "60"],
      ]}
      stroke={chartStyles.frame}
      fill={chartStyles.frame}
      fontSize={10}
      tickGap={3}
    />
    <YAxis
      ticks={yTicks}
      stroke={chartStyles.frame}
      fill={chartStyles.frame}
      fontSize={10}
      tickGap={3}
    />
  </>
);

const Trace = ({ data }: { data: SignalData[] }) => {
  const head = data[data.length - 1];
  return (
    <>
      <Line data={data} stroke={chartStyles.line} />
      {head && <Dot x={head.x} y={head.y} fill={chartStyles.marker} />}
    </>
  );
};

const DelayBands = ({ delays }: { delays: DelayPeriod[] }) => {
  const { x, box } = useScale();
  return (
    <>
      {delays.map((delay, index) => (
        <rect
          key={index}
          x={x(delay.start)}
          y={box.top}
          width={x(delay.end) - x(delay.start)}
          height={box.bottom - box.top}
          fill={chartStyles.delay}
        />
      ))}
    </>
  );
};

const TimePlot = ({
  title,
  yMax,
  children,
}: {
  title: string;
  yMax: number;
  children: ReactNode;
}) => (
  <Plot
    {...chartStyles.view}
    x={[0, 61]}
    y={[0, yMax]}
    title={title}
    className="h-full font-mono"
  >
    {children}
  </Plot>
);

const SignalChart = ({ signalData }: { signalData: SignalData[] }) => (
  <ChartBlock label="Signal over time:">
    <TimePlot title="Input signal Sx over the 60-second run" yMax={1.2}>
      <TimeAxes yTicks={[[1, "1"]]} />
      <Trace data={signalData} />
    </TimePlot>
  </ChartBlock>
);

const DelayTimeDisplay = ({ delayData }: { delayData: DelayTimeData }) => {
  if (!delayData.hasDelay) return null;

  return (
    <div className="text-sm font-mono mt-2 p-2 bg-slate-50 rounded border border-slate-200">
      {delayData.delays.map((delay, index) => (
        <div key={index}>
          Delay {index + 1}: ~{(delay.end - delay.start).toFixed(1)}s
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
  <ChartBlock label="Protein Y concentration:" className="mt-4">
    <TimePlot
      title="Protein Y concentration over the 60-second run"
      yMax={steadyState + 2}
    >
      <TimeAxes
        yTicks={[
          [steadyState, steadyState.toFixed(0)],
          [Kyz, "Kyz"],
        ]}
      />
      <Line
        data={[
          { x: 0, y: Kyz },
          { x: 60, y: Kyz },
        ]}
        stroke={chartStyles.threshold}
        width={1}
        dashed
      />
      <Trace data={data} />
    </TimePlot>
  </ChartBlock>
);

const ProteinZChart = ({
  data,
  steadyState,
  delayData,
}: {
  data: SignalData[];
  steadyState: number;
  delayData: DelayTimeData;
}) => (
  <ChartBlock label="Protein Z concentration:" className="mt-4">
    <TimePlot
      title="Protein Z concentration over the 60-second run"
      yMax={steadyState + 2}
    >
      <TimeAxes yTicks={[[steadyState, steadyState.toFixed(0)]]} />
      <DelayBands delays={delayData.delays} />
      <Trace data={data} />
    </TimePlot>
  </ChartBlock>
);

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
      <div className="flex flex-col w-full lg:w-3/5">
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
        <div className="flex gap-4">
          <InfoPanel />
          <ParametersDisplay params={params} updateParams={updateParams} />
        </div>
      </div>
      <div className="w-full lg:w-2/5 lg:ml-4 mb-4 lg:my-0 font-mono border rounded-md transition-all duration-200 ease-in">
        <div className="flex flex-col p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="text-sm font-mono">
              Status:{" "}
              {signalForX ? (
                <span className="text-green-600 font-semibold">ACTIVE</span>
              ) : (
                <span className="text-red-600 font-semibold">INACTIVE</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <Button
                  variant="secondary"
                  onClick={() => setIsPlaying(false)}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200"
                  disabled={time >= 60}
                >
                  <FiPause className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setIsPlaying(true)}
                  className={`flex items-center gap-1 ${
                    time === 0
                      ? "bg-green-200 text-green-800 border-green-200 hover:bg-green-300 hover:border-green-300"
                      : ""
                  }`}
                  disabled={time >= 60}
                >
                  <span className="text-sm font-mono">
                    {time === 0 ? "Run" : "Continue"}
                  </span>
                  <FiPlay className="w-4 h-4" />
                </Button>
              )}
              <span className="text-sm font-mono w-14 text-end">
                {time}/60s
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button
              onClick={resetSimulation}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Reset
            </button>
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
