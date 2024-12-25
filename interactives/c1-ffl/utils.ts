import { EdgeMarker, MarkerType } from "@xyflow/react";
import { ZState, CircuitNode, CircuitEdge } from "./types";
import { CIRCUIT_CONFIG } from "./config";

export const chartStyles = {
  chart: {
    width: 200,
    height: 100,
    padding: { top: 5, bottom: 10, left: 25, right: 10 },
  },
  axis: {
    style: {
      axis: { stroke: "#64748b" },
      tickLabels: { fill: "#64748b", fontSize: 8, padding: 2 },
      grid: { stroke: "none" },
    },
    labelComponent: { dy: -5, dx: 190 },
  },
  line: {
    default: {
      data: { stroke: "#3f3f46" },
    },
    dashed: {
      data: {
        stroke: "#94a3b8",
        strokeDasharray: "4,4",
        strokeWidth: 1,
      },
    },
  },
  scatter: {
    data: { fill: "#ef4444" },
  },
  delayIndicator: {
    data: {
      fill: "rgba(254, 243, 199, 0.6)",
      strokeWidth: 1,
    },
  },
};

export const edgeStyles = {
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#a1a1aa",
    width: 8,
    height: 8,
  },
  style: {
    stroke: "#a1a1aa",
    strokeWidth: 2,
    strokeDasharray: "5,5", // why does changing this to 4,4 make the line animation stutter?
  },
};

export const circuitStyles = {
  promoter: {
    active: {
      stroke: "#22c55e",
      strokeWidth: 2,
    },
    inactive: {
      stroke: "#52525b",
      strokeWidth: 1.5,
    },
  },
  edge: {
    active: {
      stroke: "#3f3f46",
      markerColor: "#3f3f46",
    },
    inactive: {
      stroke: "#a1a1aa",
      markerColor: "#a1a1aa",
    },
  },
  proximityZone: {
    near: {
      backgroundColor: "rgba(34, 197, 94, 0.1)",
      border: "2px dashed #86efac",
    },
    far: {
      backgroundColor: "rgba(248, 113, 113, 0.1)",
      border: "2px dashed #fca5a5",
    },
  },
};

interface CircuitState {
  signalForX: boolean;
  accumulationProgress: number;
  isAccumulating: boolean;
  zState: ZState;
  isPlaying: boolean;
}

export const updateNode = (
  node: CircuitNode,
  state: CircuitState
): CircuitNode => {
  const { signalForX, accumulationProgress, isAccumulating, zState } = state;
  const XstarBaseY = 160;
  const YstarBaseY = 160;

  switch (node.id) {
    case "Y*": // Y TF node
      return {
        ...node,
        data: {
          ...node.data,
          progress: accumulationProgress,
          isAccumulating,
        },
        position: {
          x: node.position.x,
          y:
            YstarBaseY +
            (accumulationProgress === 1
              ? CIRCUIT_CONFIG.ACTIVE_TF_Y_OFFSET
              : 0),
        },
        style: { transition: "all 0.5s ease" },
      };

    case "y-promoter":
      return {
        ...node,
        data: {
          ...node.data,
          svgStyle:
            accumulationProgress === 1
              ? circuitStyles.promoter.active
              : circuitStyles.promoter.inactive,
        },
      };

    case "X*2": // X TF node
      return {
        ...node,
        data: {
          ...node.data,
          progress: signalForX ? 1 : 0,
          isAccumulating: false,
        },
        position: {
          x: node.position.x,
          y: XstarBaseY + (signalForX ? CIRCUIT_CONFIG.ACTIVE_TF_Y_OFFSET : 0),
        },
        style: { transition: "all 0.5s ease" },
      };

    case "x-promoter":
      return {
        ...node,
        data: {
          ...node.data,
          svgStyle: signalForX
            ? circuitStyles.promoter.active
            : circuitStyles.promoter.inactive,
        },
      };

    case "Z":
      return {
        ...node,
        data: {
          ...node.data,
          isActive: signalForX && accumulationProgress === 1,
          style: {
            opacity: zState === "inactive" ? 0.5 : 1,
          },
        },
      };

    default:
      return node;
  }
};

export const updateEdge = (
  edge: CircuitEdge,
  state: CircuitState
): CircuitEdge => {
  const { signalForX, zState, isPlaying } = state;

  if (edge.id === "z-gene-to-protein") {
    const isActive = zState === "accumulating" && isPlaying;
    return {
      ...edge,
      animated: isActive,
      style: {
        ...edge.style,
        stroke: isActive
          ? circuitStyles.edge.active.stroke
          : circuitStyles.edge.inactive.stroke,
      },
      markerEnd: {
        ...(edge.markerEnd as EdgeMarker),
        color: isActive
          ? circuitStyles.edge.active.markerColor
          : circuitStyles.edge.inactive.markerColor,
      },
    };
  }

  return {
    ...edge,
    animated:
      ["X", "X*1", "Y"].includes(edge.source) && isPlaying && signalForX,
  };
};
