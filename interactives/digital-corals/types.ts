export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Initially, Polyp only contains id and position as per revised Step 1
export interface Polyp {
  id: string;
  position: Vector3;
  // normal and xi will be added in later steps
  // normal?: Vector3;
  // xi?: number;
}

// Represents a triangular face using indices of polyps in the polyps array
export type Face = [number, number, number]; // Indices of polyps

export interface CoralGeometry {
  polyps: Polyp[];
  faces: Face[];
}

export interface SimulationParameters {
  s_min: number; // Growth mode min (0-1)
  s_max: number; // Growth mode max (0-1)
  elongationRateV: number; // Linear elongation rate (e.g., cm/year)
  subdivisionDistanceDeltaSub: number; // Max inter-polyp distance for subdivision (cm)
  interBranchingLengthLbr: number; // Inter-branching length (cm)
  branchingAngleTheta: number; // Branching angle (degrees)
  deltaTime: number; // Simulation time step
}

// Default parameters, even if not all are used in early steps
export const defaultSimulationParameters: SimulationParameters = {
  s_min: 0.2,
  s_max: 0.8,
  elongationRateV: 1.0,
  subdivisionDistanceDeltaSub: 0.5,
  interBranchingLengthLbr: 5.0,
  branchingAngleTheta: 30.0,
  deltaTime: 0.1,
};

export const initialCoralGeometry: CoralGeometry = {
  polyps: [],
  faces: [],
};
