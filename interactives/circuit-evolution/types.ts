export interface CircuitNode {
  id: string;
  type: "circle" | "nandGate";
  position: { x: number; y: number };
  data: {
    booleanValue?: number;
    color: string;
    text: string;
    style?: {
      backgroundColor: string;
    };
  };
}

export interface CircuitEdge {
  id: string;
  source: string;
  target: string;
}

export interface TruthTableRow {
  inputs: number[];
  circuitOutput: number;
  goalOutput: number;
}

export enum SimulationType {
  MUTATION = "mutation",
  GENERATION = "generation",
}

export interface CircuitState {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  accuracy: number;
  chartData: { x: number; y: number }[];
  simulationType: SimulationType;
}

export type CircuitDisplayProps = {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  simulate: () => void;
  resetCircuit: () => void;
  simulationType: SimulationType;
  setSimulationType: (type: SimulationType) => void;
  chartData: Array<{ x: number; y: number }>;
  showResetWarning: boolean;
  setShowResetWarning: (show: boolean) => void;
  skipResetWarning: boolean;
  setSkipResetWarning: (skip: boolean) => void;
};

export type SimulationTypeToggleProps = {
  simulationType: SimulationType;
  setSimulationType: (type: SimulationType) => void;
  chartData: Array<{ x: number; y: number }>;
  resetCircuit: () => void;
  showResetWarning: boolean;
  setShowResetWarning: (show: boolean) => void;
  skipResetWarning: boolean;
  setSkipResetWarning: (skip: boolean) => void;
};
