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
import { GridPosition, SimulationGrid } from "./types";

export default function useLocalizationSimulation() {
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
  const pHit = 100;
  const pMiss = 1;
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

  const move = () => {
    const { dx, dy } = randomMove();
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

  return {
    grid,
    height,
    width,
    beliefs,
    currentPosition,
    getObservedColor,
    sense,
    move,
  };
}
