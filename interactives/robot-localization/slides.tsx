export const SLIDES = {
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
        <p>slide 2</p>
      </>
    ),
  },
  3: {
    text: (
      <>
        <p>slide 3</p>
      </>
    ),
  },
};

export const totalSlides = Object.keys(SLIDES).length;
