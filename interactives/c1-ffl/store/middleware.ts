import {
  calculateProteinData,
  calculateDelayTimeData,
  calculateAccumulationState,
  calculateZState,
} from "./calculations";

export const createSimulationMiddleware = (set, get) => {
  let intervalId: NodeJS.Timeout;
  let lastProteinUpdate = {
    params: null,
    signalData: null,
    result: null,
  };

  const updateProteinData = () => {
    const state = get();

    // Check if we need to recalculate
    const paramsChanged =
      JSON.stringify(state.params) !== JSON.stringify(lastProteinUpdate.params);
    const signalChanged =
      JSON.stringify(state.signalData) !==
      JSON.stringify(lastProteinUpdate.signalData);

    if (!paramsChanged && !signalChanged && lastProteinUpdate.result) {
      return lastProteinUpdate.result;
    }

    // Calculate protein data
    const proteinYData = calculateProteinData(
      state.signalData,
      state.params.alphaY,
      state.params.betaY
    );

    const proteinZData = calculateProteinData(
      state.signalData,
      state.params.alphaZ,
      state.params.betaZ,
      {
        dependentData: proteinYData,
        threshold: state.params.Kyz,
      }
    );

    // Calculate animation states
    const { progress, isAccumulating } = calculateAccumulationState(
      proteinYData,
      state.params.Kyz
    );
    const zState = calculateZState(proteinZData);

    // Calculate delay data
    const delayTimeData = calculateDelayTimeData(
      proteinYData,
      state.params.Kyz
    );

    // Cache the results
    lastProteinUpdate = {
      params: { ...state.params },
      signalData: [...state.signalData],
      result: {
        proteinYData,
        proteinZData,
        delayTimeData,
        accumulationProgress: progress,
        isAccumulating,
        zState,
      },
    };

    // Update state
    set(lastProteinUpdate.result);
  };

  // Handle simulation timer
  const startTimer = () => {
    if (intervalId) clearInterval(intervalId);

    const state = get();
    if (state.isPlaying && state.time < 60) {
      intervalId = setInterval(() => {
        const currentState = get();
        if (currentState.time >= 60) {
          set({ isPlaying: false });
          clearInterval(intervalId);
        } else {
          get().tick();
        }
      }, 1000);
    }
  };

  return {
    // Middleware actions
    _updateProteinData: updateProteinData,
    _startTimer: startTimer,
    _clearTimer: () => {
      if (intervalId) clearInterval(intervalId);
    },
  };
};
