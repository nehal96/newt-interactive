import { useRef } from "react";
import { generateCellId } from "./magic-squares.helpers";
import { CellGrouping, Cells } from "./types";

interface AnimationProps {
  shouldAnimate: boolean;
  cells: Cells;
  animationGroups: CellGrouping;
  drawnSquareSize: number;
  squareName: string;
  shouldStopAnimation: boolean;
  onFinishAnimation: () => void;
}

const Animation = ({
  shouldAnimate,
  cells,
  animationGroups,
  drawnSquareSize,
  squareName,
  shouldStopAnimation,
  onFinishAnimation,
}: AnimationProps) => {
  const timers = useRef([]);

  if (shouldStopAnimation) {
    // Clear all the timers
    timers.current.forEach((timerId) => {
      clearTimeout(timerId);
    });

    // Reset timers ref to empty array
    timers.current = [];

    // Not sure why just calling onFinishAnimation throws an error saying can't
    // update parent state while still rendering, but like below, works when
    // wrapped in a setTimeout
    setTimeout(() => onFinishAnimation(), 100);
  }

  if (shouldAnimate) {
    // Row/columns start at 1, end at size of drawn square
    const start = 1;
    const end = drawnSquareSize;

    // Timeout delay
    const delay = 250;
    // const timers = [];

    // Counter for each animation step (which is each cell)
    let stepCounter = 1;

    // Counter for animation group step (which is rows and columns and diagonals)
    let animationStep = 0;

    // Helper to imperatively change background color property of cell
    const changeCellBackgroundColor = (cellId, color) => {
      cells[cellId].style.backgroundColor = color;
    };
    // Helper to change innerHTML value of a cell
    const changeCellValue = (cellId, value) => {
      cells[cellId].innerHTML = value;
    };

    // Animating by each group (or animation step)
    const animateCellGroup = (cellGroup, totalsCellId, isLastAnimation) => {
      const timers = [];

      for (let i = 0; i <= cellGroup.length; i++) {
        const timerId = setTimeout(() => {
          const isOnTotalsCell = i === cellGroup.length;

          if (isOnTotalsCell) {
            changeCellBackgroundColor(totalsCellId, "lightgreen");

            // Change square row/col/diagonal cells back to white
            cellGroup.forEach((cellId) => {
              changeCellBackgroundColor(cellId, "white");
            });

            // For the last animation (left diagonal), also change the top-right
            // totals cell so it looks more even
            if (isLastAnimation) {
              const topRightCellId = generateCellId(squareName, start, end);
              const lastTotalsCellValue = cells[totalsCellId].innerHTML;

              changeCellBackgroundColor(topRightCellId, "lightgreen");
              changeCellValue(topRightCellId, lastTotalsCellValue);
            }
          } else {
            const currentTotalsValue = cells[totalsCellId].innerHTML
              ? Number(cells[totalsCellId].innerHTML)
              : 0;
            const currentCellValue = Number(cells[cellGroup[i]].innerHTML);

            changeCellBackgroundColor(cellGroup[i], "orange");

            // Change value (add to or initialize) of totals cell for that row/col/diagonal
            changeCellValue(
              totalsCellId,
              currentTotalsValue
                ? currentTotalsValue + currentCellValue
                : currentCellValue
            );
          }
        }, delay * stepCounter);

        timers.push(timerId);
        stepCounter++;
      }

      animationStep++;

      // Recursively call animate function
      animate(animationStep);

      return timers;
    };

    const allTotalsCellsIds = Object.keys(animationGroups);

    const animate = (animationStep: number) => {
      const isLastAnimation = animationStep === allTotalsCellsIds.length - 1;

      // Each totals cell Id is one step/group, so call the group animating func.
      // as long as there are groups left to be animated
      if (animationStep < allTotalsCellsIds.length) {
        const timerIds = animateCellGroup(
          animationGroups[allTotalsCellsIds[animationStep]],
          allTotalsCellsIds[animationStep],
          isLastAnimation
        );

        // Spread all the timer ids to timers ref
        timers.current = [...timers.current, ...timerIds];
      } else {
        setTimeout(() => onFinishAnimation(), stepCounter * delay);
      }
    };

    // Start animation
    animate(animationStep);
  }

  return null;
};

export default Animation;
