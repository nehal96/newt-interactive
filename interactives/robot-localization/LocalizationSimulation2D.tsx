import { useState } from "react";
import {
  initializeBeliefs,
  mod,
  randomChoice,
  randomMove,
  blur,
  normalize,
} from "./helpers";
import styles from "./LocalizationSimulation.module.css";
import { SimulationGrid } from "./types";

const LocalizationSimlation2D = () => {
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
  const [currentPosition, setCurrentPosition] = useState({ row: 4, col: 2 });
  const [prevPosition, setPrevPosition] = useState({ row: 4, col: 2 });
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

  const sense = (color: string, pHit: number, pMiss: number) => {
    let total = 0;
    const newBeliefs = [];

    for (let i = 0; i < height; i++) {
      const newBeliefsRow = [];

      for (let j = 0; j < width; j++) {
        const isHit = grid[i][j] === color ? 1 : 0;
        const newBelief = beliefs[i][j] * (isHit * pHit + (1 - isHit) * pMiss);
        newBeliefsRow.push(newBelief);

        total += newBelief;
      }

      newBeliefs.push(newBeliefsRow);
    }

    const normalizedNewBeliefs = normalize(newBeliefs, total);

    setBeliefs(normalizedNewBeliefs);
  };

  const move = () => {
    const { dx, dy } = randomMove();
    const newX = mod(currentPosition.col + dx, width);
    const newY = mod(currentPosition.row + dy, height);

    console.log({
      prevX: currentPosition.col,
      prevY: currentPosition.row,
      dx,
      dy,
      newX,
      newY,
    });

    const shiftedBeliefs = new Array(height).fill(new Array(width).fill(0));

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const newI = mod(i + dy, height);
        const newJ = mod(j + dx, width);
        shiftedBeliefs[newI][newJ] = beliefs[i][j];
      }
    }

    // TODO: blurring
    console.log({ beliefs, shiftedBeliefs });

    setPrevPosition({ row: currentPosition.row, col: currentPosition.col });
    setCurrentPosition({ row: newY, col: newX });
    setBeliefs(blur(shiftedBeliefs, blurring));
  };

  return (
    <>
      <table className={styles.grid}>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((val, colIndex) => (
                <td
                  key={`r${rowIndex + 1}c${colIndex + 1}`}
                  className={styles.cell}
                  style={{ backgroundColor: val }}
                >
                  <svg
                    height="100%"
                    width="100%"
                    style={{ display: "block", margin: 0 }}
                  >
                    <circle
                      cx="50%"
                      cy="50%"
                      r={beliefs[rowIndex][colIndex] * 36}
                      fill="darkblue"
                    />
                    {rowIndex === currentPosition.row &&
                    colIndex === currentPosition.col ? (
                      <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                      >
                        Q
                      </text>
                    ) : null}
                  </svg>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => sense(getObservedColor(), pHit, pMiss)}
        style={{ width: 200, marginTop: "2rem", alignSelf: "center" }}
      >
        Sense
      </button>
      <button
        onClick={() => move()}
        style={{ width: 200, marginTop: "1rem", alignSelf: "center" }}
      >
        Random move
      </button>
    </>
  );
};

export default LocalizationSimlation2D;
