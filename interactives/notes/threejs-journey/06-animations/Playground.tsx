const BoxAnimationsPlayground = ({ boxArgs, setBoxArgs }) => {
  return (
    <>
      <p>Play around and change some values:</p>
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
    </>
  );
};

export default BoxAnimationsPlayground;
