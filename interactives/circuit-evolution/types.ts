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

export interface CircuitState {
  nodes: CircuitNode[];
  edges: CircuitEdge[];
  accuracy: number;
  chartData: { x: number; y: number }[];
}
