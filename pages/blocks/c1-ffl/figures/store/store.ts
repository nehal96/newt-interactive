import { create } from "zustand";
import { SimulationStore } from "../types";
import { createSimulationMiddleware } from "./middleware";

export const useSimulationStore = create<SimulationStore>((set, get) => {
  // Create middleware
  const middleware = createSimulationMiddleware(set, get);

  return {
    // Initial state
    time: 0,
    isPlaying: false,
    signalForX: false,
    signalData: [{ x: 0, y: 0 }],
    proteinYData: [],
    proteinZData: [],
    params: {
      alphaY: 0.1,
      betaY: 1,
      alphaZ: 0.1,
      betaZ: 1,
      Kyz: 5,
    },
    delayTimeData: { delays: [], hasDelay: false },
    accumulationProgress: 0,
    isAccumulating: false,
    zState: { state: "inactive", progress: 0 },

    // Actions
    setTime: (time) => {
      set({ time });
      middleware._updateProteinData();
    },

    setIsPlaying: (isPlaying) => {
      set({ isPlaying });
      if (isPlaying) {
        middleware._startTimer();
      } else {
        middleware._clearTimer();
      }
    },

    setSignalForX: (signalForX) => {
      const state = get();
      // Only update if value actually changed
      if (state.signalForX !== signalForX) {
        set({
          signalForX,
          // Update initial signal data if simulation hasn't started
          ...(state.time === 0 && {
            signalData: [{ x: 0, y: signalForX ? 1 : 0.01 }],
          }),
        });
        middleware._updateProteinData();
      }
    },

    updateParams: (newParams) => {
      set((state) => ({
        params: { ...state.params, ...newParams },
      }));
      middleware._updateProteinData();
    },

    resetSimulation: () => {
      middleware._clearTimer();
      set((state) => ({
        time: 0,
        isPlaying: false,
        signalData: [{ x: 0, y: state.signalForX ? 1 : 0.01 }],
        proteinYData: [],
        proteinZData: [],
      }));
      middleware._updateProteinData();
    },

    tick: () => {
      set((state) => ({
        time: state.time + 1,
        signalData: [
          ...state.signalData,
          {
            x: state.time + 1,
            y: state.signalForX ? 1 : 0.01,
          },
        ],
      }));
      middleware._updateProteinData();
    },
  };
});
