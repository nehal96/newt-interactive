import { Switch } from "../../../../components";
import { BoxAnimationsPlaygroundProps } from "./types";

const BoxAnimationsPlayground = ({
  boxArgs,
  setBoxArgs,
  rps,
  setRps,
}: BoxAnimationsPlaygroundProps) => {
  return (
    <>
      <p>Play around and change some values:</p>
      <div className="mb-6">
        <label className="font-medium">Box width, height, and depth:</label>
        <div className="flex">
          <input
            name="box args"
            type="range"
            value={boxArgs[0]}
            min={1}
            max={3}
            step={0.05}
            onChange={(e) =>
              setBoxArgs([
                Number(e.target.value),
                Number(e.target.value),
                Number(e.target.value),
              ])
            }
            className="flex-auto"
          />
          <span className="w-8 ml-2">{boxArgs[0]}</span>
        </div>
      </div>
      <div className="mb-6">
        <label className="font-medium">RPS (rotations per second):</label>
        <div className="flex">
          <input
            name="rps"
            type="range"
            value={rps}
            min={0}
            max={4}
            step={0.05}
            onChange={(e) => setRps(Number(e.target.value))}
            className="flex-auto"
          />
          <span className="w-8 ml-2">{rps}</span>
        </div>
      </div>
      <div className="mb-6 flex items-center">
        <label className="font-medium mr-8">Enable Orbit Controls</label>
        <Switch />
      </div>
    </>
  );
};

export default BoxAnimationsPlayground;
