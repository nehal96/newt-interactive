import { Edge, Node, Position } from "@xyflow/react";

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

export interface AccumulationState {
  progress: number;
  isAccumulating: boolean;
}

export type ZState = "inactive" | "accumulating" | "active" | "reducing";

export interface UseSimulationReturn extends SimulationState {
  setSignalForX: (value: boolean) => void;
  setIsPlaying: (value: boolean) => void;
  resetSimulation: () => void;
  updateParams: (params: Partial<SimulationParams>) => void;
  params: SimulationParams;
  delayTimeData: DelayTimeData;
  accumulationProgress: number;
  isAccumulating: boolean;
  zState: ZState;
}

export interface CircuitDisplayProps {
  nodes: Node[];
  edges: Edge[];
  onProximityChange?: (isNear: boolean) => void;
}

// Node Types
interface BaseNodeData {
  text?: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

interface ProteinNodeData extends BaseNodeData {
  isActive?: boolean;
  progress?: number;
  isAccumulating?: boolean;
}

interface CircleNodeData extends BaseNodeData {
  isProximity?: boolean;
}

interface LineNodeData extends BaseNodeData {
  length: number;
}

interface PromoterNodeData extends BaseNodeData {}

export type CircuitNodeTypes = "circle" | "line" | "promoter" | "protein";

export type CircuitNode = Node<
  ProteinNodeData | CircleNodeData | LineNodeData | PromoterNodeData,
  CircuitNodeTypes
>;

// Edge Types
interface CircuitEdgeData {
  animated: boolean;
  markerEnd?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export type CircuitEdge = Edge<CircuitEdgeData>;

// Store Types
export interface SimulationStore {
  // State
  time: number;
  isPlaying: boolean;
  signalForX: boolean;
  signalData: SignalData[];
  proteinYData: SignalData[];
  proteinZData: SignalData[];
  params: SimulationParams;
  delayTimeData: DelayTimeData;
  accumulationProgress: number;
  isAccumulating: boolean;
  zState: ZState;

  // Actions
  setTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSignalForX: (signalForX: boolean) => void;
  updateParams: (params: Partial<SimulationParams>) => void;
  resetSimulation: () => void;
  tick: () => void;
}
