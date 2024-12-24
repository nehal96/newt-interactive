import { memo } from "react";

const CircuitPromoterNode = memo(({ data }: any) => {
  return (
    <div style={{ width: "100px", height: "50px", ...data?.style }}>
      <svg width="100%" height="100%" viewBox="0 0 100 50">
        <rect
          x="5"
          y="5"
          width="50"
          height="25"
          rx="5"
          ry="5"
          fill="white"
          stroke={data?.style?.stroke || "#52525b"}
          strokeWidth={data?.style?.strokeWidth || "1.5"}
          className="transition-stroke duration-300 ease-in-out delay-75"
        />
      </svg>
    </div>
  );
});

export default CircuitPromoterNode;
