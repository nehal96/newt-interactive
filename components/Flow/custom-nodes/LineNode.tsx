import React from "react";

interface LineNodeProps {
  data: {
    length?: number;
    style?: React.CSSProperties;
  };
}

const LineNode: React.FC<LineNodeProps> = ({ data }) => {
  const lineLength = data.length || 100;

  return (
    <div style={{ position: "relative", ...data?.style }}>
      <svg width={lineLength} height="2">
        <line
          x1="0"
          y1="1"
          x2={lineLength}
          y2="1"
          stroke="black"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default LineNode;
