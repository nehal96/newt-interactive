import { Handle, Position } from "@xyflow/react";
import { useEffect, useRef } from "react";

interface CircuitProteinNodeProps {
  data: {
    text: string;
    sourcePosition?: Position;
    targetPosition?: Position;
    isProximity?: boolean;
    style?: React.CSSProperties;
    progress?: number;
    isAccumulating?: boolean;
  };
}

const PROGRESS_RING_RADIUS = 14;

const CircuitProteinNode = ({ data }: CircuitProteinNodeProps) => {
  const prevProgressRef = useRef(data.progress || 0);
  const rotationRef = useRef(-90); // Start at -90 degrees

  useEffect(() => {
    const currentProgress = data.progress || 0;
    if (currentProgress < prevProgressRef.current) {
      // Progress is decreasing, rotate clockwise
      rotationRef.current = 270;
    } else {
      // Progress is increasing, rotate counterclockwise
      rotationRef.current = -90;
    }
    prevProgressRef.current = currentProgress;
  }, [data.progress]);

  if (data.isProximity) {
    return <div style={data.style} />;
  }

  const isComplete = data.progress === 1;

  return (
    <div className="relative w-[30px] h-[30px]">
      <svg width="30" height="30" viewBox="0 0 30 30">
        {(data.progress || 0) > 0 && (
          <circle
            cx="15"
            cy="15"
            r={PROGRESS_RING_RADIUS}
            fill="none"
            stroke="#86efac"
            strokeWidth="2"
            strokeDasharray={`${
              (data.progress || 0) * 2 * Math.PI * PROGRESS_RING_RADIUS
            } ${2 * Math.PI * PROGRESS_RING_RADIUS}`}
            transform={`rotate(${rotationRef.current} 15 15)`}
            className="transition-[stroke-dasharray] duration-200 ease-in-out"
          />
        )}

        <circle
          cx="15"
          cy="15"
          r="12.5"
          fill={isComplete ? "#dcfce7" : "white"}
          stroke={isComplete ? "#86efac" : "#52525b"}
          strokeWidth="1"
        />

        <text
          x="15"
          y="15"
          textAnchor="middle"
          dominantBaseline="central"
          className="text-xs"
        >
          {data.text}
        </text>
      </svg>

      {data.sourcePosition && (
        <Handle
          type="source"
          position={data.sourcePosition}
          style={{ visibility: "hidden" }}
        />
      )}
      {data.targetPosition && (
        <Handle
          type="target"
          position={data.targetPosition}
          style={{ visibility: "hidden" }}
        />
      )}
    </div>
  );
};

export default CircuitProteinNode;
