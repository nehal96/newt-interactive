export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

// Initially, Polyp only contains id and position as per revised Step 1
export interface Polyp {
  id: string;
  position: Vector3;
  normal?: Vector3; // Optional: Normal vector of the polyp's surface
  xi?: number; // Optional: Orientation factor
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
  s_min: 0.0, // Growth mode min (0-1)
  s_max: 1.0, // Growth mode max (0-1)
  elongationRateV: 1.0, // Linear elongation rate (e.g., 1 cm/year)
  subdivisionDistanceDeltaSub: 0.5, // Max inter-polyp distance for subdivision (e.g., 0.5 cm)
  interBranchingLengthLbr: 4.0, // Inter-branching length (cm)
  branchingAngleTheta: 60, // Branching angle (degrees)
  deltaTime: 0.1, // Simulation time step (e.g., 0.1 year per step)
};

export const initialCoralGeometry: CoralGeometry = {
  polyps: [],
  faces: [],
};
