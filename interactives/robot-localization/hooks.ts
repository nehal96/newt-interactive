import { useState } from "react";
import {
  initializeBeliefs,
  normalize,
  randomChoice,
  blur,
  initialize2DArray,
  mod,
  randomMove,
} from "./helpers";
import { GridPosition, GridPositionChange, SimulationGrid } from "./types";

const INITIAL_P_HIT = 99;
const INITIAL_P_MISS = 1;

export default function useLocalizationSimulation() {
  const [pHit, setPHit] = useState(INITIAL_P_HIT);
  const [pMiss, setPMiss] = useState(INITIAL_P_MISS);
  const colors = ["orange", "lightblue"];
  const [O, B] = colors;
  const grid: SimulationGrid = [
    [O, B, B, B, O],
    [B, B, O, B, O],
    [B, O, B, B, B],
    [O, O, B, O, B],
    [O, B, O, B, O],
  ];
  const height = grid.length;
  const width = grid[0].length;
  const [beliefs, setBeliefs] = useState(initializeBeliefs(grid));
  const [currentPosition, setCurrentPosition] = useState<GridPosition>({
    row: 4,
    col: 2,
  });
  const [prevPosition, setPrevPosition] = useState<GridPosition>({
    row: 4,
    col: 2,
  });
  const incorrectSenseProbability = pMiss / (pHit + pMiss);
  const blurring = 0.1;

  const getObservedColor = () => {
    const trueColor = grid[currentPosition.row][currentPosition.col];
    let observedColor;

    if (Math.random() < incorrectSenseProbability) {
      const possibleColors = [];
      colors.forEach((color) => {
        if (color !== trueColor) {
          possibleColors.push(color);
        }
      });
      observedColor = randomChoice(possibleColors);
    } else {
      observedColor = trueColor;
    }

    return observedColor;
  };

  const sense = () => {
    const color = getObservedColor();
    const newBeliefs = [];

    for (let i = 0; i < height; i++) {
      const newBeliefsRow = [];

      for (let j = 0; j < width; j++) {
        const isHit = grid[i][j] === color ? 1 : 0;
        const newBelief = beliefs[i][j] * (isHit * pHit + (1 - isHit) * pMiss);
        newBeliefsRow.push(newBelief);
      }

      newBeliefs.push(newBeliefsRow);
    }

    const normalizedNewBeliefs = normalize(newBeliefs);

    setBeliefs(normalizedNewBeliefs);
  };

  const move = (to?: GridPositionChange) => {
    let dx, dy;

    if (!to) {
      const pos = randomMove();
      dx = pos.dx;
      dy = pos.dy;
    } else {
      dx = to.dx;
      dy = to.dy;
    }

    const newX = mod(currentPosition.col + dx, width);
    const newY = mod(currentPosition.row + dy, height);

    const shiftedBeliefs = initialize2DArray(height, width);

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const newI = mod(i + dy, height);
        const newJ = mod(j + dx, width);
        shiftedBeliefs[newI][newJ] = beliefs[i][j];
      }
    }

    setPrevPosition({ row: currentPosition.row, col: currentPosition.col });
    setCurrentPosition({ row: newY, col: newX });
    setBeliefs(blur(shiftedBeliefs, blurring));
  };

  const reset = () => {
    setBeliefs(initializeBeliefs(grid));
    setCurrentPosition({ row: 4, col: 2 });
    setPHit(INITIAL_P_HIT);
    setPMiss(INITIAL_P_MISS);
  };

  return {
    grid,
    height,
    width,
    beliefs,
    currentPosition,
    getObservedColor,
    sense,
    move,
    reset,
    pHit,
    setPHit,
    pMiss,
    setPMiss,
  };
}
