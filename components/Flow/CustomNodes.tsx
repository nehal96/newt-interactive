import { Handle, Position } from "@xyflow/react";

export const CircleNode = ({ data, isConnectable }) => (
  <div
    style={{
      width: 25,
      height: 25,
      border: `1px solid ${data?.color || "#cbd5e1"}`,
      borderRadius: "50%",
      backgroundColor: data?.color || "#cbd5e1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Handle
      type="target"
      position={Position.Top}
      isConnectable={isConnectable}
      style={{
        visibility: "hidden",
      }}
    />
    <Handle
      type="source"
      position={Position.Bottom}
      isConnectable={isConnectable}
      style={{
        visibility: "hidden",
      }}
    />
  </div>
);
