import { create } from "zustand";
import {
  CoralGeometry,
  SimulationParameters,
  initialCoralGeometry,
  defaultSimulationParameters,
} from "../types";

// Define the state structure for the simulation
interface SimulationState {
  parameters: SimulationParameters;
  currentGeometry: CoralGeometry;
  // Actions
  updateParameter: <K extends keyof SimulationParameters>(
    paramName: K,
    value: SimulationParameters[K]
  ) => void;
  setInitialGeometry: (geometry: CoralGeometry) => void;
  setCurrentGeometry: (geometry: CoralGeometry) => void;
  // More actions like resetSimulation, toggleIsRunning will be added in later steps
}

export const useSimulationStore = create<SimulationState>((set) => ({
  parameters: defaultSimulationParameters,
  currentGeometry: initialCoralGeometry,

  updateParameter: (paramName, value) =>
    set((state) => ({
      parameters: {
        ...state.parameters,
        [paramName]: value,
      },
    })),

  setInitialGeometry: (geometry) =>
    set({
      currentGeometry: geometry,
      // In a later step, we might store this separately for reset purposes
      // initialSeedGeometry: geometry,
    }),

  setCurrentGeometry: (geometry) => set({ currentGeometry: geometry }),
}));

// Selectors (optional, but good practice)
export const selectParameters = (state: SimulationState) => state.parameters;
export const selectCurrentGeometry = (state: SimulationState) =>
  state.currentGeometry;
