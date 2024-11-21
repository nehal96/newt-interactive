import { Handle, Position } from "@xyflow/react";

const NAND_GATE_SVG = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.00002 15.5L1.00004 1H25V15.5H24.9999L25.0001 15.51L25.0001 15.5103L25.0002 15.5107L25.0002 15.5135L25.0003 15.5311C25.0003 15.5476 25.0002 15.5736 24.9996 15.6085C24.9982 15.6782 24.9947 15.7833 24.9859 15.9187C24.9683 16.1896 24.9294 16.5808 24.8444 17.0518C24.674 17.9957 24.3203 19.2489 23.5904 20.4977C22.1507 22.9608 19.1951 25.5 13 25.5C6.80488 25.5 3.84933 22.9608 2.40965 20.4977C1.67972 19.2489 1.32608 17.9957 1.15568 17.0518C1.07065 16.5808 1.03177 16.1896 1.01413 15.9187C1.00532 15.7833 1.00183 15.6782 1.00051 15.6085C0.999845 15.5736 0.999729 15.5476 0.999761 15.5311L0.99987 15.5135L0.999909 15.5107L1.00002 15.5107V15.5Z"
      fill="white"
      stroke="#3f3f46"
    />
  </svg>
);

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

export const NANDNode = ({ data, isConnectable }) => (
  <div>
    <NAND_GATE_SVG />
    <Handle
      type="target"
      position={Position.Bottom}
      isConnectable={isConnectable}
      style={{
        backgroundColor: "white",
        border: "1px solid #3f3f46",
      }}
    />
  </div>
);
