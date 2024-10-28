import { EdgeProps, getStraightPath, useInternalNode } from "@xyflow/react";
import { getEdgeParams } from "./utils";

const FloatingEdge = ({
  id,
  source,
  target,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  ...props
}: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  if (source === target) {
    const { sourceX, sourceY } = props;

    // Adjust starting and ending points to be on the left and right sides
    // sourceX and targetX seem to be the same number for some reason, needs a
    // deeper look. These numbers were hardcoded based on visual inspection +
    // circle radius of 25
    const startX = sourceX - 17.5; // Left side
    const endX = sourceX + 17.5; // Right side

    const radiusX = 24.5; // Width of the loop
    const radiusY = 22.5; // Height of the loop

    const edgePath = `M ${startX} ${
      sourceY - 17.5
    } A ${radiusX} ${radiusY} 0 1 1 ${endX - 1} ${sourceY - 17.5}`;

    return (
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={style}
      />
    );
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode
  );

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className="react-flow__edge-path"
      d={edgePath}
      markerEnd={markerEnd}
      style={style}
    />
  );
};

export default FloatingEdge;
