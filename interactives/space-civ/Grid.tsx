const Grid = ({ numRows = 3, numCols = 3 }) => {
  const rows = new Array(numRows).fill(null);
  const cols = new Array(numCols).fill(null);

  return (
    <div>
      {rows.map((row) => {
        return (
          <div className={`grid grid-cols-${numCols}`}>
            {cols.map((col) => {
              return (
                <div className="h-32 flex items-center justify-center border border-gray-400 hover:bg-gray-200">
                  col
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
