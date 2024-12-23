import { Edge, Node } from "@xyflow/react";

export interface SignalData {
  x: number;
  y: number;
}

export interface SimulationParams {
  alphaY: number;
  betaY: number;
  alphaZ: number;
  betaZ: number;
  Kyz: number;
}

export interface SimulationState {
  time: number;
  isPlaying: boolean;
  signalForX: boolean;
  signalData: SignalData[];
  proteinYData: SignalData[];
  proteinZData: SignalData[];
}

export interface UseSimulationProps {
  initialParams: SimulationParams;
}

export interface DelayPeriod {
  start: number;
  end: number;
}

export interface DelayTimeData {
  delays: DelayPeriod[];
  hasDelay: boolean;
}

export interface UseSimulationReturn extends SimulationState {
  setSignalForX: (value: boolean) => void;
  setIsPlaying: (value: boolean) => void;
  resetSimulation: () => void;
  updateParams: (params: Partial<SimulationParams>) => void;
  params: SimulationParams;
  delayTimeData: DelayTimeData;
}

export interface CircuitDisplayProps {
  nodes: Node[];
  edges: Edge[];
  onProximityChange?: (isNear: boolean) => void;
}
