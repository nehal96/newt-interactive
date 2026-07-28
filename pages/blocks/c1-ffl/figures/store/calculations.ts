import {
  SignalData,
  DelayPeriod,
  DelayTimeData,
  ZState,
  AccumulationState,
  SimulationParams,
} from "../types";

export const calculateProteinData = (
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
};

export const calculateDelayTimeData = (
  proteinYData: SignalData[],
  threshold: number
): DelayTimeData => {
  if (proteinYData.length < 2) {
    return {
      delays: [],
      hasDelay: false,
    };
  }

  const delays: DelayPeriod[] = [];
  let accumulationStart: number | null = null;

  proteinYData.forEach((point, index) => {
    const prevY = index > 0 ? proteinYData[index - 1].y : 0;

    // Detect when Y starts accumulating
    if (
      point.y > prevY && // Y is increasing
      (prevY === 0 || point.y < threshold) && // Either from zero or below threshold
      accumulationStart === null // Haven't started tracking yet
    ) {
      accumulationStart = point.x;
    }

    // Detect crossing threshold
    if (prevY < threshold && point.y >= threshold) {
      if (accumulationStart !== null) {
        delays.push({
          start: accumulationStart,
          end: point.x,
        });
        accumulationStart = null;
      }
    }

    // Reset accumulation tracking if Y is decreasing and below threshold
    if (point.y < prevY && point.y < threshold) {
      accumulationStart = null;
    }
  });

  return {
    delays,
    hasDelay: delays.length > 0,
  };
};

export const calculateAccumulationState = (
  proteinYData: SignalData[],
  threshold: number
): AccumulationState => {
  if (proteinYData.length < 2) {
    return { progress: 0, isAccumulating: false };
  }

  const currentY = proteinYData[proteinYData.length - 1].y;
  const prevY = proteinYData[proteinYData.length - 2].y;

  // Check if Y is currently accumulating (increasing and below threshold)
  const isAccumulating = currentY > prevY && currentY < threshold;

  // Calculate progress as percentage of threshold
  let progress = 0;
  if (currentY > 0 && currentY < threshold) {
    progress = currentY / threshold;
  } else if (currentY >= threshold) {
    progress = 1;
  }

  return { progress, isAccumulating };
};

export const calculateZState = (
  proteinZData: SignalData[],
  params: SimulationParams
): ZState => {
  if (proteinZData.length < 2) {
    return { state: "inactive", progress: 0 };
  }

  const currentZ = proteinZData[proteinZData.length - 1].y;
  const prevZ = proteinZData[proteinZData.length - 2].y;
  const steadyState = params.betaZ / params.alphaZ;
  const threshold = steadyState * 0.95;

  // Calculate progress as percentage of threshold
  let progress = 0;
  if (currentZ > 0 && currentZ < threshold) {
    progress = currentZ / threshold;
  } else if (currentZ >= threshold) {
    progress = 1;
  }

  if (currentZ === 0) {
    return { state: "inactive", progress };
  } else if (currentZ > prevZ) {
    return { state: "accumulating", progress };
  } else if (currentZ < prevZ) {
    return { state: "reducing", progress };
  } else if (currentZ > 0) {
    return { state: "active", progress };
  }

  return { state: "inactive", progress };
};
