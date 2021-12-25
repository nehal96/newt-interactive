import { useState } from "react";
import { Slides } from "./types";

const SenseButton = ({ onClick }) => {
  const [hasClicked, setHasClicked] = useState(false);

  const handleClick = () => {
    onClick();
    setHasClicked(true);
  };

  return (
    <button onClick={handleClick} disabled={hasClicked}>
      Sense
    </button>
  );
};

export const SLIDES: Slides = {
  1: {
    text: (
      <>
        <p>
          Here we have a 5x5 grid with our robot (Q) with tiles of two colours:
          orange and light blue.
        </p>
        <p>
          The dark blue circles indicate the robot's belief of where it
          currently is. Initially, it has no idea, so all positions are equally
          likely.
        </p>
        <p>Luckily, the robot's equipped with a sensor.</p>
      </>
    ),
  },
  2: {
    text: (
      <>
        <p>
          The sensor can identify the colour of the tile it's currently in. But
          the sensor's not a 100% accurate. Sometimes, very rarely, it makes an
          error.
        </p>
        <p>This introduces uncertainty in measurement.</p>
        <p>
          The robot can move as well -- left or right, up or down, or any of the
          four diagonals. The grid's also mirrored -- going past an edge brings
          you to the other side, like going through a portal.
        </p>
      </>
    ),
  },
  3: {
    text: (
      <>
        <p>
          We're going to see how, despite starting clueless of it's starting
          position and having uncertainty in its sensor measurement, a robot can
          move around and localize itself within its environment.
        </p>
        <p>
          Let's start by sensing the current tile first. Click the Sense button
          to begin.
        </p>
      </>
    ),
    actionButton: (sense) => <SenseButton onClick={sense} />,
  },
};

export const totalSlides = Object.keys(SLIDES).length;
