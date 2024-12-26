import { Handle, Position } from "@xyflow/react";

const defaultStyle = {
  width: 25,
  height: 25,
  backgroundColor: "white",
  border: "1px solid #3f3f46",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const CircleNode = ({ data, isConnectable }) => {
  const { style, text, sourcePosition, targetPosition } = data;

  return (
    <div style={{ ...defaultStyle, ...style }}>
      {text && (
        <span style={{ color: style?.color || "#3f3f46" }} className="text-xs">
          {text}
        </span>
      )}
      <Handle
        type="target"
        position={targetPosition || Position.Top}
        isConnectable={isConnectable}
        style={{ visibility: "hidden" }}
      />
      <Handle
        type="source"
        position={sourcePosition || Position.Bottom}
        isConnectable={isConnectable}
        style={{ visibility: "hidden" }}
      />
    </div>
  );
};

export default CircleNode;
