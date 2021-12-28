import { Popover, PopoverContent } from "../../components";
import { Slides } from "./types";

export const SLIDES: Slides = {
  1: {
    section: "overview",
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
    section: "overview",
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
    section: "overview",
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
    section: "overview",
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
    section: "overview",
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
    section: "overview",
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
    section: "overview",
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
    section: "overview",
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
    section: "overview",
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
  10: {
    section: "overview",
    text: (
      <>
        <p>
          If you've run this several times, you should see that the robot's
          belief has converged to its actual location (the blue circle is
          largest where the robot is).
        </p>
        <p>
          So far, you haven't seen what's happening under the hood. So let's
          take a look.
        </p>
      </>
    ),
    onNext: ["reset", "show under the hood"],
  },
  11: {
    section: "code-explain",
    text: (
      <>
        <p>
          We've reset back to where we started. We've also displayed a box below
          the grid displaying the associated data -- a peek under the hood.
        </p>
        <p>
          Beliefs is represented as a <code>2D array</code>. Each row in the
          array represents a row on the grid, and each value in the array
          represents the robot's belief that it's on that cell.
        </p>
        <p>
          The robot's position is denoted by the <code>currentPosition</code>{" "}
          object, which has the fields <code>row</code> and <code>col</code>{" "}
          representing the row and column. The values are{" "}
          <Popover
            content={
              <PopoverContent>
                The first row or column is actally denoted by the number 0
              </PopoverContent>
            }
            highlightColor="newt-blue-100"
          >
            zero-indexed
          </Popover>{" "}
          because arrays are zero-indexed, which why the current position has a
          value of <code>(4, 2)</code>.
        </p>
      </>
    ),
    onBack: ["hide under the hood"],
  },
  12: {
    section: "code-explain",
    text: (
      <>
        <p>
          When we click Sense, we do two things. First the robot measures the
          color of the tile it's on, which will make a correct measurement 99%
          of the time. Then based on the measurement, it will update its belief
          across the entire grid. If it senses that the tile it's on is orange,
          then it increases the probability of all orange tiles and decreases
          the probability of all light-blue tiles.
        </p>
        <p>First, how did we get that 99% value? Here's the math:</p>
        <pre className="mb-4 p-4 border border-slate-700 rounded-md bg-slate-700 text-slate-50">
          <code>{`pHit = 99\npMiss = 1\nincorrectSenseProbability = pMiss / (pHit + pMiss)`}</code>
        </pre>
        <p>
          With these values, the probability the robot senses incorrectly is{" "}
          <code>1/100</code> or 1%, which means the probability it senses
          correctly is 99%. Later, you'll be able to change these values and see
          how it affects the outcome.
        </p>
      </>
    ),
  },
  13: {
    section: "code-explain",
    text: (
      <>
        <pre className="mb-4 p-4 border border-slate-700 rounded-md bg-slate-700 text-slate-50">
          <code>{`pHit = 99\npMiss = 1\n`}</code>
        </pre>
        <p>
          So now after taking a measurment, we go over each cell in the grid,
          and if the color matches the measured color, we multiply the belief by{" "}
          <code>pHit</code>, otherwise we multiply with <code>pMiss</code>.
        </p>
        <p>
          So in this example, if the robot senses orange, all orange cells
          belief value will be multiplied by 99, and all light-blue tiles will
          be multipled by 1.
        </p>
        <p>
          Let's try this again. Click on Sense and see what happens to the
          belief values
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
  14: {
    section: "code-explain",
    text: (
      <>
        <p>
          Now, most likely the robot sensed 'orange', and all orange tiles have
          a slightly larger blue circle. (If you're part of the 1% that sensed
          incorrectly, it will be the light blue tiles).
        </p>
        <p>
          Take a look at the beliefs array below. It was previously all{" "}
          <code>0.04</code>. Now, some{" "}
          <Popover
            content={
              <PopoverContent>
                I've rounded the digits to 2 sigfigs to make them easier to read
              </PopoverContent>
            }
            highlightColor="newt-blue-100"
          >
            should be <code>0.09</code> and others <code>0.0009</code>.
          </Popover>
        </p>
        <p>
          We've updated our beliefs about where the robot is, and if you got
          orange, the robot has more-or-less narrowed it down to 11 tiles.
        </p>
        <p>
          In the previous slide, I said that we could multiply the measured
          probability values by 99. So how did we get decimals here?
        </p>
        <p>
          After the multiplication, we <b>normalized</b> the array -- because
          probabilities have to add up to 1, we divided each multiplied value by
          the array's total to get the same proportion.
        </p>
      </>
    ),
  },
  15: {
    section: "code-explain",
    text: (
      <>
        <p>
          Now the next step for our robot is to move. Once again, we're going to
          move up a tile by 1.
        </p>
        <p>
          Notice where the dark-blue circles are now, and try and predict where
          they'll shift to after the robot moves.
        </p>
      </>
    ),
    actionButtons: [
      {
        type: "move",
        args: { dx: 0, dy: -1 },
        goToNextSlide: true,
      },
    ],
  },
  16: {
    section: "code-explain",
    text: (
      <>
        <p>16</p>
      </>
    ),
  },
};

export const totalSlides = Object.keys(SLIDES).length;
