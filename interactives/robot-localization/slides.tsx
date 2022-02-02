import { Code, InlineCode, Popover, PopoverContent } from "../../components";
import { GetSlideParams, Slides } from "./types";
import LocalizationPlayground, { ActionButton } from "./LocalizationPlayground";

export function getSlides({
  onSense,
  onMove,
  playgroundValues,
}: GetSlideParams): Slides {
  return {
    1: {
      section: "overview",
      text: (
        <>
          <p>
            Here we have a 5x5 grid with our robot (white diamond) with tiles of
            two colours: orange and light blue.
          </p>
          <p>
            The dark blue circles indicate the robot's <i>belief</i> of where it
            currently is. Initially, it has no idea, so all positions are
            equally likely.
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
            The sensor can identify the colour of the tile it's currently in.
            But the sensor's not 100% accurate. Sometimes, very rarely, it makes
            an error.
          </p>
          <p>This introduces uncertainty in measurement.</p>
          <p>
            The robot can move as well &mdash; left or right, up or down, or any
            of the four diagonals. The grid is also mirrored &mdash; going past
            an edge brings you to the other parallel side, like going through a
            portal.
          </p>
        </>
      ),
    },
    3: {
      section: "overview",
      text: (
        <>
          <p>
            We're going to see how, despite being clueless of it's starting
            position and having uncertainty in its sensor measurement, a robot
            can move around and localize itself within its environment.
          </p>
          <p>
            Take a quick look at the grid, and then let's start by{" "}
            <i>sensing</i> the current tile. Click the Sense button to begin.
          </p>
          <ActionButton onClick={() => onSense(true)}>Sense</ActionButton>
        </>
      ),
    },
    4: {
      section: "overview",
      text: (
        <>
          <p>Did you notice what happened?</p>
          <p>
            <Popover
              content={
                <PopoverContent>
                  there's a 1% chance you'll get an erroneous blue tile. If so,
                  please Reset and Sense again
                </PopoverContent>
              }
              highlightColor="bg-newt-blue-100"
            >
              The robot sensed it was on an orange tile
            </Popover>
            , and then updated its <b>beliefs</b> about where it was on the
            grid.
          </p>
          <p>
            It now believes it's more likely to be on an orange tile, and less
            likely to be on a blue one, and the probabilities, represented by
            the dark blue circles, have shifted accordingly.
          </p>
        </>
      ),
    },
    5: {
      section: "overview",
      text: (
        <>
          <p>
            Now let's move the robot up by one tile, onto the light blue square
            on the row above.
          </p>
          <p>
            Make note of the positions of the dark blue circles. Where do you
            think they're gonna move?
          </p>
          <ActionButton onClick={() => onMove({ dx: 0, dy: -1 }, true)}>
            Move
          </ActionButton>
        </>
      ),
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
          <p>So far we've sensed and moved once. Let's do it once more.</p>
          <ActionButton onClick={() => onSense(true)}>Sense</ActionButton>
        </>
      ),
    },
    8: {
      section: "overview",
      text: (
        <>
          <p>
            Last time, we specifically moved up a tile. This time, let's move in
            a random direction.
          </p>
          <p>
            This can be up or down, left or right, any of the four diagonals, or
            staying in the same spot.
          </p>
          <ActionButton onClick={() => onMove(null, true)}>Move</ActionButton>
        </>
      ),
    },
    9: {
      section: "overview",
      text: (
        <>
          <p>
            Now, let's repeat this Sense and move cycle several more times, and
            notice what happens.
          </p>
          <ActionButton onClick={() => onSense(false)}>Sense</ActionButton>
          <ActionButton onClick={() => onMove(null, false)}>Move</ActionButton>
        </>
      ),
    },
    10: {
      section: "overview",
      text: (
        <>
          <p>
            If you've run this several times, you should see that the robot's
            belief has converged to its actual location (the dark blue circle is
            largest where the robot is).
          </p>
          <p>
            So far, you haven't seen what's happening under the hood. So now,
            let's take a look.
          </p>
        </>
      ),
      onNextActions: ["reset", "show under the hood"],
    },
    11: {
      section: "code",
      text: (
        <>
          <p>
            We've reset back to where we started. We've also displayed a box
            below the grid displaying some associated data &mdash; a peek under
            the hood.
          </p>
          <p>
            Beliefs is represented as a{" "}
            <InlineCode variant="medium">2D array</InlineCode>. Each row in the
            array represents a row on the grid, and each value in the row
            represents the robot's belief that it's on that cell.
          </p>
          <p>
            The robot's position is denoted by the{" "}
            <InlineCode variant="medium">currentPosition</InlineCode> object,
            which has the fields <InlineCode variant="medium">row</InlineCode>{" "}
            and <InlineCode variant="medium">col</InlineCode> representing the
            row and column. The values are{" "}
            <Popover
              content={
                <PopoverContent>
                  The first row or column is denoted by the number 0
                </PopoverContent>
              }
              highlightColor="bg-newt-blue-100"
            >
              zero-indexed
            </Popover>{" "}
            because arrays are zero-indexed, which why the current position has
            a value of <InlineCode variant="medium">(4, 2)</InlineCode>.
          </p>
        </>
      ),
      onBackActions: ["hide under the hood"],
    },
    12: {
      section: "code",
      text: (
        <>
          <p>
            When we click Sense, we do two things. First the robot measures the
            color of the tile it's on, which will be correct 99% of the time.
            Then based on the measurement, it will update its beliefs across the
            entire grid. If it senses that the tile it's on is orange, then it
            increases the probability of all orange tiles and decreases the
            probability of all light-blue tiles.
          </p>
          <p>First, how did we get that 99% value? Here's the math:</p>
          <Code variant="dark" className="mb-4">
            {`pHit = 99\npMiss = 1\nincorrectSenseProbability = pMiss / (pHit + pMiss)`}
          </Code>
          <p>
            <Popover
              content={
                <PopoverContent>
                  If you're wondering why not just use decimals like pHit = 0.99
                  and pMiss = 1 - pHit, you'll see the reason in the next slide
                </PopoverContent>
              }
              highlightColor="bg-newt-blue-100"
            >
              With these values
            </Popover>
            , the probability the robot senses incorrectly is{" "}
            <InlineCode variant="medium">1/100</InlineCode> or 1%, which means
            the probability it senses correctly is 99%.
          </p>
          <p>
            Later, you'll be able to change these values and see how it affects
            the outcome.
          </p>
        </>
      ),
    },
    13: {
      section: "code",
      text: (
        <>
          <Code
            variant="dark"
            className="mb-4"
          >{`pHit = 99\npMiss = 1\n`}</Code>
          <p>
            So now, after taking a measurment, we go over each cell in the grid,
            and if the true color matches the measured color,{" "}
            <Popover
              content={
                <PopoverContent>
                  here's the reason &mdash; the values are also used as a belief
                  multiplier
                </PopoverContent>
              }
              highlightColor="bg-newt-blue-100"
            >
              we multiply the belief by{" "}
              <InlineCode variant="medium">pHit</InlineCode>. Otherwise, we
              multiply with <InlineCode variant="medium">pMiss</InlineCode>.
            </Popover>
          </p>
          <p>
            So in this example, if the robot senses{" "}
            <InlineCode className="bg-orange-200 text-orange-900">
              orange
            </InlineCode>
            , all orange cells belief value will be multiplied by 99, and all
            light-blue tiles will be multipled by 1.
          </p>
          <p>
            Let's try this again. Click on Sense and see what happens to the{" "}
            <InlineCode variant="medium">belief</InlineCode> values.
          </p>
          <ActionButton onClick={() => onSense(true)}>Sense</ActionButton>
        </>
      ),
    },
    14: {
      section: "code",
      text: (
        <>
          <p>
            Now, most likely the robot sensed{" "}
            <InlineCode className="bg-orange-200 text-orange-900">
              orange
            </InlineCode>
            , and all orange tiles have a slightly larger blue circle. (If
            you're part of the 1% that sensed incorrectly, it will be the light
            blue tiles).
          </p>
          <p>
            Take a look at the <InlineCode variant="medium">beliefs</InlineCode>{" "}
            array. It was previously all <code>0.04</code>. Now, some{" "}
            <Popover
              content={
                <PopoverContent>
                  I've rounded the digits to 2 sigfigs to make them easier to
                  read
                </PopoverContent>
              }
              highlightColor="bg-newt-blue-100"
            >
              should be <InlineCode>0.09</InlineCode> and others{" "}
              <InlineCode>0.0009</InlineCode>.
            </Popover>
          </p>
          <p>
            We've updated our beliefs about where the robot is, and if you got
            orange, the robot has more-or-less narrowed it down to 11 orange
            tiles.
          </p>
          <p>
            In the previous slide, I said that we would multiply the measured
            probability values by 99. So how did we get values less than 1 here?
          </p>
          <p>
            After the multiplication, we <b>normalized</b> the array. Because
            probabilities have to add up to 1, we divided each multiplied value
            by the array's total to get the same proportion.
          </p>
        </>
      ),
    },
    15: {
      section: "code",
      text: (
        <>
          <p>
            Now the next step for our robot is to move. Once again, we're going
            to move up a tile by 1.
          </p>
          <p>
            Notice where the dark-blue circles are now, and try and predict
            where they'll shift to after the robot moves.
          </p>
          <ActionButton onClick={() => onMove({ dx: 0, dy: -1 }, true)}>
            Move up
          </ActionButton>
        </>
      ),
    },
    16: {
      section: "code",
      text: (
        <>
          <p>
            As you might have seen before, the beliefs would shift up by one as
            well. But if you take a look at the{" "}
            <InlineCode variant="medium">beliefs</InlineCode> array again,
            you'll notice that the values are slightly different.
          </p>
          <p>
            This is because of a step called <b>blurring</b>. We won't go into
            its details now, but you can think of blurring as spreading a little
            bit of a tile's probability to its neighboring tiles, mimicking
            uncertainty in movement.
          </p>
          <p>
            You can also see that{" "}
            <InlineCode variant="medium">currentPosition</InlineCode> got
            updated as well, and the robot is now in{" "}
            <InlineCode variant="medium">row 3</InlineCode>.
          </p>
        </>
      ),
    },
    17: {
      section: "code",
      text: (
        <>
          <p>
            Now let's repeat this Sense and Move cycle repeatedly, and see how
            the <InlineCode variant="medium">beliefs</InlineCode> array changes
            over cycles.
          </p>
          <p>
            Remember, clicking Move now means that the robot will move at random
            to any neighboring tile, or stay in the same spot.
          </p>
          <ActionButton onClick={() => onSense(false)}>Sense</ActionButton>
          <ActionButton onClick={() => onMove(null, false)}>Move</ActionButton>
        </>
      ),
    },
    18: {
      section: "code",
      text: (
        <>
          <p>
            Eventually, even with potential erroneous measurements, the belief
            will converge to the robot's actual position, with its associated
            probability value in the array hovering around{" "}
            <InlineCode>0.9</InlineCode>.
          </p>
          <p>
            So, despite the robot starting at a random spot, having some
            uncertainty in its measurment, and some uncertainty in its movement,
            we have a basic algorithm that still manages to figure out its
            location.
          </p>
          <p>Ofcourse, this is a highly simplified model, but it's a start.</p>
        </>
      ),
      onNextActions: ["reset"],
    },
    19: {
      section: "code",
      text: (
        <>
          <p>In the beginning we set out some initial conditions:</p>
          <Code variant="dark" className="mb-4">
            {`pHit = 99\npMiss = 1\n`}
          </Code>
          <p>
            Now, let's set up a playground environment where you can change
            these values, and see what happens.
          </p>
        </>
      ),
    },
    20: {
      section: "playground",
      text: (
        <>
          <LocalizationPlayground values={playgroundValues} />
          <ActionButton onClick={() => onSense(false)}>Sense</ActionButton>
          <ActionButton onClick={() => onMove(null, false)}>Move</ActionButton>
        </>
      ),
    },
  };
}
