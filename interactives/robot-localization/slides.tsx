import { Slides } from "./types";

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
          Take a quick look at the grid, and then let's start by sensing the
          current tile. Click the Sense button to begin.
        </p>
      </>
    ),
    actionButtons: [
      {
        type: "sense",
        args: null,
        goToNextSlide: true,
      },
    ],
  },
  4: {
    text: (
      <>
        <p>Did you notice what happened?</p>
        <p>
          The robot sensed it was on an orange tile, and then updated its{" "}
          <b>belief</b> about where it was on the grid.
        </p>
        <p>
          It now believes its more likely to be on an orange tile, and less
          likely to be on a blue one, and the probabilities have shifted
          accordingly.
        </p>
      </>
    ),
  },
  5: {
    text: (
      <>
        <p>
          Now let's move the robot up by one tile, onto the light blue square on
          row 4.
        </p>
        <p>Make note of the positions of the dark blue circles.</p>
      </>
    ),
    actionButtons: [
      {
        type: "move",
        args: {
          dx: 0,
          dy: -1,
        },
        goToNextSlide: true,
      },
    ],
  },
  6: {
    text: (
      <>
        <p>Did you notice the change?</p>
        <p>
          All the robots beliefs shifted up by one as well, to account for its
          movement.
        </p>
        <p>
          Now, we'll see how, with this Sense and Move cycle, a robot can
          eventually be confident in its current position even if the sensors
          make mistakes every now and then.
        </p>
      </>
    ),
  },
  7: {
    text: (
      <>
        <p>We've sensed and moved once. Let's do it once more.</p>
      </>
    ),
    actionButtons: [
      {
        type: "sense",
        args: null,
        goToNextSlide: true,
      },
    ],
  },
  8: {
    text: (
      <>
        <p>
          Last time, we specifically moved up a tile. This time, let's move in a
          random direction.
        </p>
        <p>
          This can be up or down, left or right, or any of the four diagonals.
        </p>
      </>
    ),
    actionButtons: [
      {
        type: "move",
        args: null,
        goToNextSlide: true,
      },
    ],
  },
  9: {
    text: (
      <p>
        Now, let's repeat this Sense and move cycle several more times, and
        notice what happens.
      </p>
    ),
    actionButtons: [
      {
        type: "sense",
        args: null,
        goToNextSlide: false,
      },
      {
        type: "move",
        args: null,
        goToNextSlide: false,
      },
    ],
  },
};

export const totalSlides = Object.keys(SLIDES).length;
