import { useState, useEffect, useCallback, useMemo } from "react";
import {
  SignalData,
  SimulationParams,
  UseSimulationProps,
  UseSimulationReturn,
} from "./types";

export const useSimulation = ({
  initialParams,
}: UseSimulationProps): UseSimulationReturn => {
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [signalForX, setSignalForX] = useState(false);
  const [signalData, setSignalData] = useState<SignalData[]>([{ x: 0, y: 0 }]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

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
  };
};
