import { useState, useEffect, useCallback, useMemo } from "react";
import {
  SignalData,
  SimulationParams,
  UseSimulationProps,
  UseSimulationReturn,
  DelayTimeData,
  DelayPeriod,
  ZState,
} from "./types";

interface AccumulationState {
  progress: number;
  isAccumulating: boolean;
}

export const useSimulation = ({
  initialParams,
}: UseSimulationProps): UseSimulationReturn => {
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [signalForX, setSignalForX] = useState(false);
  const [signalData, setSignalData] = useState<SignalData[]>([{ x: 0, y: 0 }]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [delayTimeData, setDelayTimeData] = useState<DelayTimeData>({
    delays: [],
    hasDelay: false,
  });
  const [accumulationState, setAccumulationState] = useState<AccumulationState>(
    {
      progress: 0,
      isAccumulating: false,
    }
  );
  const [zState, setZState] = useState<ZState>("inactive");

  const calculateProteinData = useCallback(
    (
      signalData: SignalData[],
      alpha: number,
      beta: number,
      conditions?: {
        dependentData?: SignalData[];
        threshold?: number;
      }
    ) => {
      const steadyState = beta / alpha;

      return signalData.reduce((acc, point, index) => {
        if (index === 0) {
          return [{ x: point.x, y: 0 }];
        }

        const prevPoint = acc[acc.length - 1];
        const timeSinceLastChange = point.x - prevPoint.x;

        let isActive = point.y === 1;

        // Additional conditions for protein Z
        if (conditions?.dependentData && conditions.threshold) {
          const dependentValue = conditions.dependentData[index].y;
          isActive = isActive && dependentValue > conditions.threshold;
        }

        const y = isActive
          ? steadyState -
            (steadyState - prevPoint.y) * Math.exp(-alpha * timeSinceLastChange)
          : prevPoint.y * Math.exp(-alpha * timeSinceLastChange);

        return [...acc, { x: point.x, y }];
      }, [] as SignalData[]);
    },
    []
  );

  // Calculate protein Y data
  const proteinYData = useMemo(() => {
    return calculateProteinData(signalData, params.alphaY, params.betaY);
  }, [signalData, params.alphaY, params.betaY, calculateProteinData]);

  // Calculate protein Z data
  const proteinZData = useMemo(() => {
    return calculateProteinData(signalData, params.alphaZ, params.betaZ, {
      dependentData: proteinYData,
      threshold: params.Kyz,
    });
  }, [
    signalData,
    proteinYData,
    params.alphaZ,
    params.betaZ,
    params.Kyz,
    calculateProteinData,
  ]);

  // Update signal data when signalForX changes
  useEffect(() => {
    if (time === 0) {
      // Only update if simulation hasn't started
      setSignalData([{ x: 0, y: signalForX ? 1 : 0.01 }]);
    }
  }, [signalForX, time]);

  const resetSimulation = useCallback(() => {
    setTime(0);
    setSignalData([{ x: 0, y: signalForX ? 1 : 0.01 }]);
    setIsPlaying(false);
  }, [signalForX]);

  const updateParams = useCallback((newParams: Partial<SimulationParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying && time < 60) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;
          if (newTime >= 60) {
            setIsPlaying(false);
          }
          return newTime;
        });

        setSignalData((prev) => [
          ...prev,
          {
            x: time + 1,
            y: signalForX ? 1 : 0.01,
          },
        ]);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, time, signalForX]);

  useEffect(() => {
    if (proteinYData.length < 2) {
      setDelayTimeData({
        delays: [],
        hasDelay: false,
      });
      return;
    }

    const delays: DelayPeriod[] = [];
    let accumulationStart: number | null = null;

    // Iterate through the data to find accumulation starts and threshold crossings
    proteinYData.forEach((point, index) => {
      const prevY = index > 0 ? proteinYData[index - 1].y : 0;

      // Detect when Y starts accumulating in two cases:
      // 1. From zero
      // 2. When it was decreasing and starts increasing again
      if (
        point.y > prevY && // Y is increasing
        (prevY === 0 || point.y < params.Kyz) && // Either from zero or below threshold
        accumulationStart === null
      ) {
        // Haven't started tracking yet
        accumulationStart = point.x;
      }

      // Detect crossing Kyz threshold
      if (prevY < params.Kyz && point.y >= params.Kyz) {
        if (accumulationStart !== null) {
          delays.push({
            start: accumulationStart,
            end: point.x,
          });
          accumulationStart = null; // Reset for potential next cycle
        }
      }

      // Reset accumulation tracking if Y is decreasing and below threshold
      if (point.y < prevY && point.y < params.Kyz) {
        accumulationStart = null;
      }
    });

    setDelayTimeData({
      delays,
      hasDelay: delays.length > 0,
    });
  }, [proteinYData, params.Kyz]);

  // Add new effect to calculate accumulation state
  useEffect(() => {
    // Find the current Y value
    const currentY = proteinYData[proteinYData.length - 1]?.y || 0;
    const prevY = proteinYData[proteinYData.length - 2]?.y || 0;

    // Check if Y is currently accumulating (increasing and below threshold)
    const isAccumulating = currentY > prevY && currentY < params.Kyz;

    // Calculate progress as the ratio of current Y value to the threshold
    let progress = 0;
    if (currentY > 0 && currentY < params.Kyz) {
      progress = currentY / params.Kyz;
    } else if (currentY >= params.Kyz) {
      progress = 1;
    }

    setAccumulationState({
      progress,
      isAccumulating,
    });
  }, [proteinYData, params.Kyz]);

  // Add new effect to track Z state
  useEffect(() => {
    const currentZ = proteinZData[proteinZData.length - 1]?.y || 0;
    const prevZ = proteinZData[proteinZData.length - 2]?.y || 0;

    if (currentZ === 0) {
      setZState("inactive");
    } else if (currentZ > prevZ) {
      setZState("accumulating");
    } else if (currentZ < prevZ) {
      setZState("reducing");
    } else if (currentZ > 0) {
      setZState("active");
    }
  }, [proteinZData]);

  return {
    time,
    isPlaying,
    signalForX,
    signalData,
    proteinYData,
    proteinZData,
    params,
    setSignalForX,
    setIsPlaying,
    resetSimulation,
    updateParams,
    delayTimeData,
    accumulationProgress: accumulationState.progress,
    isAccumulating: accumulationState.isAccumulating,
    zState,
  };
};
